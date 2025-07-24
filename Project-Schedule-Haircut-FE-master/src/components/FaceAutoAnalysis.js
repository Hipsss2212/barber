import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceUtils from '../utils/faceShapeUtils';

const FaceAutoAnalysis = ({ onResult, onClose = null, noOverlay }) => {
  const [mode, setMode] = useState('upload'); // 'upload' | 'webcam'
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [opencvReady, setOpencvReady] = useState(!!window.cv);
  const [mediapipeReady, setMediapipeReady] = useState(!!window.FaceMesh);
  const webcamRef = useRef(null);

  React.useEffect(() => {
    if (window.cv) setOpencvReady(true);
    if (window.FaceMesh) setMediapipeReady(true);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Chỉ hỗ trợ file ảnh.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Dung lượng ảnh tối đa 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage(ev.target.result);
      setError('');
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setSelectedImage(imageSrc);
      setError('');
      setAnalysisResult(null);
    }
  };

  const processImage = async () => {
    setIsProcessing(true);
    setError('');
    setAnalysisResult(null);
    if (!window.FaceMesh) {
      setError('Không tìm thấy Mediapipe FaceMesh.');
      setIsProcessing(false);
      return;
    }
    const faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true });
    faceMesh.onResults((results) => {
      setIsProcessing(false);
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length !== 1) {
        setError('Vui lòng chọn ảnh có đúng 1 khuôn mặt, chính diện, rõ nét.');
        return;
      }
      const landmarks = results.multiFaceLandmarks[0];
      const measurements = faceUtils.calculateFaceMeasurements(landmarks);
      const shapeResult = faceUtils.determineFaceShape(measurements);
      const hairstyle = faceUtils.getHairstyleRecommendations(shapeResult.shape);
      setAnalysisResult({ shapeResult, measurements, hairstyle });
    });
    const img = new window.Image();
    img.src = selectedImage;
    img.onload = () => {
      faceMesh.send({ image: img });
    };
    img.onerror = () => {
      setError('Không thể đọc ảnh.');
      setIsProcessing(false);
    };
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="chat-box" style={{ position: 'fixed', bottom: 30, right: 15, width: 440, height: 540, zIndex: 1002, borderRadius: 18, boxShadow: '0 12px 36px rgba(0,0,0,0.18)' }}>
      <div className="chat-header">
        <h3>Phân tích khuôn mặt & Gợi ý kiểu tóc</h3>
        <button className="close-btn" onClick={onClose ? onClose : resetAnalysis} title="Đóng">×</button>
      </div>
      <div className="chat-messages" style={{ padding: 20, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <button onClick={() => { setMode('upload'); resetAnalysis(); }} className={mode === 'upload' ? 'action-btn active' : 'action-btn'} style={{ minWidth: 120, fontSize: 15 }}>Tải ảnh</button>
          <button onClick={() => { setMode('webcam'); resetAnalysis(); }} className={mode === 'webcam' ? 'action-btn active' : 'action-btn'} style={{ minWidth: 120, fontSize: 15 }}>Chụp webcam</button>
        </div>
        {mode === 'upload' && (
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isProcessing} style={{ marginBottom: 10, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        )}
        {mode === 'webcam' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
              height={210}
              mirrored
              audio={false}
              style={{ borderRadius: 16, border: '2px solid #ccc', marginBottom: 8, background: '#f5f5f5', maxWidth: '100%' }}
            />
            <button onClick={handleCapture} className="action-btn camera-btn" style={{ marginBottom: 8, fontSize: 15 }}>Chụp ảnh</button>
          </div>
        )}
        {selectedImage && (
          <div style={{ margin: '12px 0', textAlign: 'center' }}>
            <img src={selectedImage} alt="Ảnh đã chọn" style={{ maxWidth: 260, maxHeight: 180, borderRadius: 14, border: '1.5px solid #ccc' }} />
          </div>
        )}
        {selectedImage && !analysisResult && !isProcessing && (
          <button className="action-btn active" style={{ width: 220, margin: '0 auto 12px auto', fontSize: 16, padding: '12px 0', display: 'block' }} onClick={processImage}>
            Phân tích khuôn mặt
          </button>
        )}
        {isProcessing && <div style={{ color: '#1976d2', fontWeight: 500, margin: '14px 0', fontSize: 16 }}>Đang xử lý...</div>}
        {error && <div style={{ color: 'red', fontWeight: 500, margin: '14px 0', fontSize: 15 }}>{error}</div>}
        {analysisResult && (
          <div style={{ marginTop: 10, width: '100%' }}>
            <div style={{ color: '#388e3c', fontWeight: 700, fontSize: 19, marginBottom: 6 }}>
              <b>Kết quả:</b> {analysisResult.shapeResult.shape}
            </div>
            <div style={{ color: '#444', fontSize: 16, marginBottom: 16 }}>{analysisResult.shapeResult.description}</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 10 }}>
              <button className="action-btn active" style={{ background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 16, padding: '12px 32px' }}
                onClick={() => {
                  if (typeof window.handleFaceAnalysisResult === 'function') {
                    window.handleFaceAnalysisResult(analysisResult.shapeResult);
                  }
                  if (typeof window.onFaceAnalysisClose === 'function') {
                    window.onFaceAnalysisClose();
                  }
                  if (onClose) onClose();
                }}
              >
                Nhận tư vấn từ chat box
              </button>
              <button className="action-btn" style={{ background: '#888', color: '#fff', fontWeight: 600, fontSize: 16, padding: '12px 32px' }} onClick={resetAnalysis}>
                Phân tích lại
              </button>
            </div>
          </div>
        )}
        {((error && !analysisResult) || (!selectedImage && !analysisResult)) && (
          <button className="action-btn" style={{ background: '#888', color: '#fff', fontWeight: 600, fontSize: 16, padding: '12px 32px', margin: '10px auto 0 auto', display: 'block' }} onClick={resetAnalysis}>
            Phân tích lại
          </button>
        )}
      </div>
      <div className="chat-input" style={{ fontSize: 14, color: '#888', textAlign: 'center', background: '#f9fafc', padding: 14 }}>
        Ảnh chỉ xử lý trên trình duyệt, không lưu trữ lên server.<br />Hỗ trợ ảnh rõ nét, chính diện, 1 khuôn mặt.
        {(!opencvReady || !mediapipeReady) && (
          <div style={{ color: '#e53935', fontWeight: 500, marginTop: 10 }}>
            Thiếu thư viện OpenCV.js hoặc Mediapipe FaceMesh. Hãy kiểm tra lại import script trong public/index.html.<br />
            <code>&lt;script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"&gt;&lt;/script&gt;</code><br />
            <code>&lt;script src="https://docs.opencv.org/4.8.0/opencv.js"&gt;&lt;/script&gt;</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceAutoAnalysis; 