# Sử dụng OpenJDK 17 làm base image
FROM eclipse-temurin:17-jdk-jammy

# Tạo thư mục app
WORKDIR /app

# Copy file JAR vào container
COPY target/Project-Schedule-Haircut-Server-0.0.1-SNAPSHOT.jar app.jar

# Mở cổng 8080 (tùy theo cổng của Spring Boot)
EXPOSE 9090

# Chạy ứng dụng khi container khởi động
ENTRYPOINT ["java", "-jar", "app.jar"]