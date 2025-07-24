package com.example.projectschedulehaircutserver.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    // email gửi đi
    @Value("${spring.mail.username}")
    private String fromEmail;

    // tên người gửi
    @Value("${app.email.sender.name}")
    private String senderName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Gửi email xác nhận lịch hẹn
    @Async
    public void sendBookingConfirmation(String toEmail, String customerName, String bookingDetails, String employeeName) {
        String subject = "📅 Xác nhận lịch hẹn tại Salon";
        String body = buildConfirmationTemplate(customerName, bookingDetails, employeeName);
        send(toEmail, subject, body);
    }

    // Gửi email thông báo hủy lịch hẹn
    @Async
    public void sendBookingCancellation(String toEmail, String customerName, String bookingDetails, String employeeName, String reason) {
        String subject = "❌ Thông báo hủy lịch hẹn";
        String body = buildCancellationTemplate(customerName, bookingDetails, employeeName, reason);
        send(toEmail, subject, body);
    }

    // Gửi email chung
    public void send(String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, senderName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            logger.info("Email sent to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }

    // Tạo nội dung email xác nhận lịch hẹn
    private String buildConfirmationTemplate(String customerName, String bookingDetails, String employeeName) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }" +
                "  .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "  .header { background-color: #4CAF50; color: white; padding: 15px; text-align: center; }" +
                "  .content { padding: 20px; background-color: #f9f9f9; }" +
                "  .footer { margin-top: 20px; font-size: 0.8em; color: #777; text-align: center; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>XÁC NHẬN LỊCH HẸN</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Xin chào <strong>" + customerName + "</strong>,</p>" +
                "<p>Nhân viên <strong>" + employeeName + "</strong> đã xác nhận lịch hẹn của bạn với thông tin sau:</p>" +
                bookingDetails +
                "<p>Vui lòng đến đúng giờ hẹn. Nếu có thay đổi, xin vui lòng liên hệ salon trước ít nhất 2 giờ.</p>" +
                "<p>Trân trọng,<br><strong>Đội ngũ Salon</strong></p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Đây là email tự động. Vui lòng không trả lời.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // Tạo nội dung email thông báo hủy lịch hẹn
    private String buildCancellationTemplate(String customerName, String bookingDetails, String employeeName, String reason) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }" +
                "  .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "  .header { background-color: #f44336; color: white; padding: 15px; text-align: center; }" +
                "  .content { padding: 20px; background-color: #f9f9f9; }" +
                "  .reason-box { background-color: #ffe6e6; padding: 10px; border-left: 4px solid #f44336; margin: 15px 0; }" +
                "  .footer { margin-top: 20px; font-size: 0.8em; color: #777; text-align: center; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>THÔNG BÁO HỦY LỊCH HẸN</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Xin chào <strong>" + customerName + "</strong>,</p>" +
                "<p>Chúng tôi rất tiếc phải thông báo rằng nhân viên <strong>" + employeeName + "</strong> đã hủy lịch hẹn sau:</p>" +
                bookingDetails +
                "<div class='reason-box'>" +
                "<p><strong>Lý do:</strong><br>" + (reason != null ? reason : "Không có lý do cụ thể") + "</p>" +
                "</div>" +
                "<p>Xin lỗi vì sự bất tiện này. Vui lòng đặt lịch lại hoặc liên hệ với chúng tôi để được hỗ trợ.</p>" +
                "<p>Trân trọng,<br><strong>Đội ngũ Salon</strong></p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Đây là email tự động. Vui lòng không trả lời.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // Gửi email yêu cầu đổi mật khẩu
    @Async
    public void sendPasswordResetEmail(String toEmail, String customerName, String verificationCode) {
        String subject = "🔐 Yêu cầu đổi mật khẩu - Mã xác thực";
        String body = buildPasswordResetEmailTemplate(customerName, verificationCode);
        send(toEmail, subject, body);
    }

    // Tạo nội dung email yêu cầu đổi mật khẩu
    private String buildPasswordResetEmailTemplate(String customerName, String verificationCode) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }" +
                "  .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "  .header { background-color: #4285F4; color: white; padding: 15px; text-align: center; }" +
                "  .content { padding: 20px; background-color: #f9f9f9; }" +
                "  .code { font-size: 24px; font-weight: bold; color: #4285F4; text-align: center; margin: 20px 0; }" +
                "  .footer { margin-top: 20px; font-size: 0.8em; color: #777; text-align: center; }" +
                "  .note { color: #d32f2f; font-style: italic; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>YÊU CẦU ĐỔI MẬT KHẨU</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Xin chào <strong>" + customerName + "</strong>,</p>" +
                "<p>Bạn đã yêu cầu đổi mật khẩu. Vui lòng sử dụng mã xác thực sau:</p>" +
                "<div class='code'>" + verificationCode + "</div>" +
                "<p class='note'>Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.</p>" +
                "<p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Đây là email tự động. Vui lòng không trả lời.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // Gửi email reset password bằng link
    @Async
    public void sendPasswordResetLinkEmail(String toEmail, String customerName, String resetLink) {
        String subject = "🔐 Đặt lại mật khẩu tài khoản BossBarber";
        String body = buildPasswordResetLinkEmailTemplate(customerName, resetLink);
        send(toEmail, subject, body);
    }

    private String buildPasswordResetLinkEmailTemplate(String customerName, String resetLink) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }" +
                "  .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "  .header { background-color: #4285F4; color: white; padding: 15px; text-align: center; }" +
                "  .content { padding: 20px; background-color: #f9f9f9; }" +
                "  .button { display: inline-block; padding: 12px 28px; background: #1976d2; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 18px; margin: 18px 0; }" +
                "  .footer { margin-top: 20px; font-size: 0.8em; color: #777; text-align: center; }" +
                "  .note { color: #d32f2f; font-style: italic; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>ĐẶT LẠI MẬT KHẨU</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Xin chào <strong>" + customerName + "</strong>,</p>" +
                "<p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản BossBarber.</p>" +
                "<p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>" +
                "<a class='button' href='" + resetLink + "'>Đặt lại mật khẩu</a>" +
                "<p class='note'>Link có hiệu lực trong 15 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Đây là email tự động. Vui lòng không trả lời.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // Gửi email thông báo lịch hẹn mới đến nhân viên
    @Async
    public void sendBookingNotificationToEmployee(String toEmail, String employeeName,
                                                  String customerName, String bookingDetails) {
        String subject = "📢 Thông báo lịch hẹn mới từ khách hàng";
        String body = buildEmployeeNotificationTemplate(employeeName, customerName, bookingDetails);
        send(toEmail, subject, body);
    }

    // Tạo nội dung email thông báo lịch hẹn mới đến nhân viên
    private String buildEmployeeNotificationTemplate(String employeeName, String customerName, String bookingDetails) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }" +
                "  .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "  .header { background-color: #2196F3; color: white; padding: 15px; text-align: center; }" +
                "  .content { padding: 20px; background-color: #f9f9f9; }" +
                "  .footer { margin-top: 20px; font-size: 0.8em; color: #777; text-align: center; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>THÔNG BÁO LỊCH HẸN MỚI</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Xin chào <strong>" + employeeName + "</strong>,</p>" +
                "<p>Bạn có một lịch hẹn mới từ khách hàng <strong>" + customerName + "</strong> với thông tin sau:</p>" +
                bookingDetails +
                "<p>Vui lòng kiểm tra lịch làm việc và chuẩn bị đón tiếp khách hàng đúng giờ.</p>" +
                "<p>Trân trọng,<br><strong>Quản lý Salon</strong></p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Đây là email tự động. Vui lòng không trả lời.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    @Async
    public void sendVerificationEmail(String toEmail, String customerName, String verificationCode) {
        String subject = "Mã xác thực tài khoản";
        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }" +
                "  .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "  .header { background-color: #4285F4; color: white; padding: 15px; text-align: center; }" +
                "  .content { padding: 20px; background-color: #f9f9f9; }" +
                "  .code { font-size: 24px; font-weight: bold; color: #4285F4; text-align: center; margin: 20px 0; }" +
                "  .footer { margin-top: 20px; font-size: 0.8em; color: #777; text-align: center; }" +
                "  .note { color: #d32f2f; font-style: italic; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>XÁC THỰC TÀI KHOẢN</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Xin chào <strong>" + customerName + "</strong>,</p>" +
                "<p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã xác thực sau để kích hoạt tài khoản:</p>" +
                "<div class='code'>" + verificationCode + "</div>" +
                "<p class='note'>Mã có hiệu lực trong 24 giờ. Không chia sẻ mã này với bất kỳ ai.</p>" +
                "<p>Nếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Đây là email tự động. Vui lòng không trả lời.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
        send(toEmail, subject, body);
    }
}