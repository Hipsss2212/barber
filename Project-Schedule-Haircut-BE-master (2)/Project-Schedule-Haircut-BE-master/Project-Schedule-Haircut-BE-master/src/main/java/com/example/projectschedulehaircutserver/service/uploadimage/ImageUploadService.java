package com.example.projectschedulehaircutserver.service.uploadimage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {
    @Autowired
    private Cloudinary cloudinary;

    // Upload ảnh lên Cloudinary
    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto"));
        return uploadResult.get("secure_url").toString();
    }

    // xóa ảnh từ Cloudinary
    public void deleteImage(String imageUrl) throws IOException {
        try {
            // Lấy public_id từ URL ảnh
            String publicId = extractPublicIdFromUrl(imageUrl);

            if (publicId != null) {
                // Xóa ảnh từ Cloudinary
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            throw new IOException("Lỗi khi xóa ảnh từ Cloudinary", e);
        }
    }

    // Trích xuất public_id từ URL ảnh
    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            // URL có dạng: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>
            String[] parts = imageUrl.split("/upload/")[1].split("/");
            String lastPart = parts[parts.length - 1];

            // Loại bỏ version nếu có (v123456...)
            if (lastPart.startsWith("v") && lastPart.contains("/")) {
                return lastPart.split("/", 2)[1].split("\\.")[0];
            }
            return lastPart.split("\\.")[0];
        } catch (Exception e) {
            return null;
        }
    }
}
