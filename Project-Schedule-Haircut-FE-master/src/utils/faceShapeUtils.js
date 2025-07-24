// faceShapeUtils.js
// Các hàm phân tích hình dạng khuôn mặt dựa trên landmark Mediapipe

// Tính toán các khoảng cách Euclidean giữa hai điểm
function distance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2)
  );
}

// Tính toán các thông số khuôn mặt từ landmark
export function calculateFaceMeasurements(landmarks) {
  // Các chỉ số landmark dựa trên Mediapipe FaceMesh
  const chin = landmarks[152];
  const forehead = landmarks[10];
  const leftJaw = landmarks[234];
  const rightJaw = landmarks[454];
  const leftCheekbone = landmarks[93];
  const rightCheekbone = landmarks[323];
  const leftJawBottom = landmarks[205];
  const rightJawBottom = landmarks[425];
  const leftEyeInner = landmarks[133];
  const rightEyeInner = landmarks[362];
  const leftNose = landmarks[102];
  const rightNose = landmarks[331];

  const faceLength = distance(forehead, chin);
  const faceWidth = distance(leftJaw, rightJaw);
  const cheekboneWidth = distance(leftCheekbone, rightCheekbone);
  const jawWidth = distance(leftJawBottom, rightJawBottom);
  const eyeDistance = distance(leftEyeInner, rightEyeInner);
  const noseWidth = distance(leftNose, rightNose);

  return {
    faceLength,
    faceWidth,
    cheekboneWidth,
    jawWidth,
    eyeDistance,
    noseWidth,
    faceRatio: faceLength / faceWidth,
    jawToForeheadRatio: jawWidth / faceWidth,
    cheekboneToJawRatio: cheekboneWidth / jawWidth,
  };
}

// Xác định hình dạng khuôn mặt dựa trên các tỉ lệ
export function determineFaceShape(measurements) {
  const { faceRatio, jawToForeheadRatio, cheekboneToJawRatio } = measurements;
  let shape = 'Oval';
  let description = 'Khuôn mặt cân đối, phù hợp nhiều kiểu tóc.';

  if (faceRatio > 1.75) {
    shape = 'Oblong';
    description = 'Khuôn mặt dài, nên chọn kiểu tóc tạo cảm giác rộng hơn.';
  } else if (faceRatio < 1.3) {
    if (jawToForeheadRatio > 0.9) {
      shape = 'Round';
      description = 'Khuôn mặt tròn, nên chọn kiểu tóc tạo độ cao và dài.';
    } else {
      shape = 'Square';
      description = 'Khuôn mặt vuông, nên chọn kiểu tóc mềm mại quanh hàm.';
    }
  } else if (cheekboneToJawRatio > 1.1) {
    shape = 'Heart';
    description = 'Khuôn mặt trái tim, nên cân bằng phần cằm.';
  } else if (cheekboneToJawRatio > 1.05 && faceRatio > 1.4) {
    shape = 'Diamond';
    description = 'Khuôn mặt kim cương, nên cân bằng trán và cằm.';
  }
  // Mặc định là Oval
  return { shape, description };
}

// Gợi ý kiểu tóc dựa trên hình dạng khuôn mặt
export function getHairstyleRecommendations(faceShape) {
  switch (faceShape) {
    case 'Oval':
      return {
        recommendations: [
          'Kiểu tóc ngắn layer',
          'Undercut',
          'Side part',
        ],
        avoid: ['Tóc quá dài che mặt']
      };
    case 'Round':
      return {
        recommendations: [
          'Pompadour',
          'Quiff',
          'Tóc dựng mái cao',
        ],
        avoid: ['Tóc ôm sát hai bên']
      };
    case 'Square':
      return {
        recommendations: [
          'Tóc mái lệch',
          'Layer mềm',
          'Tóc uốn nhẹ'] ,
        avoid: ['Tóc vuông góc, quá cứng']
      };
    case 'Heart':
      return {
        recommendations: [
          'Tóc mái thưa',
          'Tóc ôm nhẹ hai bên',
          'Tóc có độ phồng ở cằm'],
        avoid: ['Tóc quá ngắn ở cằm']
      };
    case 'Diamond':
      return {
        recommendations: [
          'Tóc mái lệch',
          'Tóc có độ phồng hai bên',
          'Tóc uốn nhẹ'],
        avoid: ['Tóc quá ôm sát đầu']
      };
    case 'Oblong':
      return {
        recommendations: [
          'Tóc mái ngang',
          'Tóc có độ phồng hai bên',
          'Tóc ngắn vừa phải'],
        avoid: ['Tóc dựng quá cao']
      };
    default:
      return {
        recommendations: ['Kiểu tóc layer', 'Undercut', 'Side part'],
        avoid: []
      };
  }
}

// Vẽ landmark và đo đạc lên canvas (nếu cần)
export function drawLandmarks(canvas, landmarks, measurements, faceShape) {
  if (!canvas || !landmarks) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#1976d2';
  ctx.lineWidth = 2;
  // Vẽ các điểm landmark
  for (let i = 0; i < landmarks.length; i++) {
    const p = landmarks[i];
    ctx.beginPath();
    ctx.arc(p.x * canvas.width, p.y * canvas.height, 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#388e3c';
    ctx.fill();
  }
  // Vẽ các đường đo đạc chính
  if (measurements) {
    ctx.strokeStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(landmarks[10].x * canvas.width, landmarks[10].y * canvas.height);
    ctx.lineTo(landmarks[152].x * canvas.width, landmarks[152].y * canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(landmarks[234].x * canvas.width, landmarks[234].y * canvas.height);
    ctx.lineTo(landmarks[454].x * canvas.width, landmarks[454].y * canvas.height);
    ctx.stroke();
  }
  // Ghi chú loại khuôn mặt
  ctx.font = '18px Segoe UI';
  ctx.fillStyle = '#1976d2';
  ctx.fillText(faceShape?.shape || '', 10, 30);
} 