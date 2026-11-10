# Mạch nguồn Nùng An — gói website hoàn chỉnh

## Chạy website
1. Giải nén toàn bộ thư mục `mach-nguon-nung-an`.
2. Mở thư mục bằng Visual Studio Code.
3. Mở `index.html` bằng Live Server (hoặc phục vụ thư mục bằng máy chủ web tĩnh).

## Âm thanh từ vựng
- Danh sách chuẩn gồm 78 tên MP3 nằm trong `assets/audio/README.txt`.
- Chép các tệp MP3 thật vào `assets/audio/` và giữ nguyên tên tệp.
- Bộ đối chiếu tên đã được sửa để chuẩn hóa cả khóa alias có dấu, khoảng trắng và dấu câu; đây là lỗi khiến một số tệp có sẵn nhưng website không tìm thấy.
- Nút loa luôn hiển thị. Nếu từ không có file phù hợp, bấm nút sẽ im lặng, không bật cảnh báo và không xóa nút.
- Từ xuất hiện ở nhiều bài vẫn giữ nút loa tại từng bài.

## Video
Hai mục video được đặt đúng tên hiển thị:
- Phằn Nùng và Phằn Song
- Truyền thuyết dấu ấn trên khăn và áo dài

Đường dẫn được khai báo lần lượt là `assets/video/Videophannungphansong.mp4` và `assets/video/Videodautrontrang.mp4`. Chép video gốc vào đúng đường dẫn này. Tệp video gốc không có trong gói mã nguồn đã gửi, nên chưa thể kiểm tra phát video thực tế.

## Các phần còn lại
- 10 bài học và các hoạt động học tập được giữ trong `js/content.js`.
- Công tắc tiếng Việt điều khiển các phần dịch đã có trong dữ liệu.
- Các liên kết sách mở trực tiếp tài liệu tương ứng.
- Nút NuanAI mở chatbot ở liên kết ngoài.
- Logo chân trang dùng ảnh `assets/logo-footer.png` thay cho chữ MN.

## Giới hạn dữ liệu nguồn
Một số câu hỏi trắc nghiệm ở các bài đầu chưa có bản dịch hoặc đáp án trong tài liệu Word được cung cấp. Website không tự bịa đáp án; những câu chưa có đáp án được đánh dấu là chưa có dữ liệu kiểm định. Các bản ghi MP3 và MP4 gốc cũng không nằm trong ZIP nguồn được gửi để chỉnh sửa, nên cần chép từ máy của bạn vào đúng thư mục.
