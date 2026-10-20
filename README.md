# Một bó hoa dành tặng bạn · 20/10

Trang tặng hoa, album ảnh người nhận và thiệp chúc mừng ngày Phụ nữ Việt Nam 20/10, dùng HTML, CSS và JavaScript thuần. Hoạt động offline, không cần cài thư viện hoặc build.

## Lời cảm ơn & Tác giả gốc (Credits)

Dự án được phát triển và tùy biến dựa trên mã nguồn mở gốc tuyệt đẹp của:
- **Tác giả ban đầu:** [Trịnh Văn Hảo (IdeaToCodee)](https://github.com/IdeaToCodee)
- **Repository gốc (Original Project):** [https://github.com/IdeaToCodee/flowers-20-10](https://github.com/IdeaToCodee/flowers-20-10)

Xin trân trọng cảm ơn tác giả **Trịnh Văn Hảo** vì đã sáng tạo và chia sẻ mã nguồn bó hoa 20/10 rất dịu dàng và ý nghĩa này đến cộng đồng.

## Chạy

Mở `index.html` trực tiếp trong trình duyệt, hoặc chạy từ thư mục này:

```bash
python3 -m http.server 8080
```

Truy cập http://localhost:8080.

## Trang vườn hoa mới

Mở `garden.html` trực tiếp trong trình duyệt, chọn **Ngắm vườn hoa** ở góc trên bên phải trang `index.html`, hoặc truy cập http://localhost:8080/garden.html khi chạy server ở trên. Trang hoạt động offline; khi sao chép sang nơi khác, chép kèm `garden-botany.js`, `garden-card.js` và thư mục `assets`.

- Ban đầu chỉ có một bông hoa giữa màn hình. Bấm vào hoa (hoặc dùng Tab rồi Enter/Space) để cả vườn hoa dần nở từ giữa ra hai bên.
- Sau khoảng 7 giây, thiệp chúc 20/10 tự hiện. Chọn **Ngắm vườn hoa**, nút × hoặc Escape để đóng thiệp.
- Chọn **Đọc lại thiệp** để mở lại, hoặc **Cho hoa nở lại** để trở về bông hoa đầu tiên.
- Chọn **Viết lời chúc riêng** trong thiệp để sửa người nhận, tiêu đề, lời chúc và chữ ký. **Lưu lời chúc** cập nhật thiệp và lưu trên trình duyệt hiện tại; **Hủy** bỏ sửa đổi chưa lưu. Lời chúc của vườn hoa được lưu riêng với thiệp ở `index.html`.
- Trang tự điều chỉnh theo màn hình và bỏ qua hoạt ảnh nở khi người xem bật chế độ giảm chuyển động.
- Hoa hồng dùng cùng cách dựng cánh với `index.html`: nhiều vòng cánh cong, tâm xoắn, bóng giữa các cánh, viền bắt sáng và giọt sương. Các hàm vẽ được lấy từ `script.js` sang `garden-botany.js` cho vườn hoa. Lá có gân, thân lay theo gió, hoa nghiêng nhẹ khi rê chuột gần và có cánh hoa bay; chuyển động tạm dừng khi tab bị ẩn.
- Hoa hồng, kem được xen với hoa xanh lá nhạt, xanh dương và trắng. Nền trời xanh có mây mỏng trôi chậm; gió làm thân, lá và đầu hoa lắc lư cùng nhau.
- Có thêm 20 nụ hoa nhiều màu xen qua các lớp của khu vườn, cánh còn khép và đài xanh ôm quanh gốc nụ. Nụ xuất hiện cùng đợt hoa và giữ dáng khép khi vườn đã nở.
- Trang dùng Noto Serif (chữ đứng và nghiêng) cho tiêu đề, lời gửi và chữ ký; Noto Sans cho nội dung. Font có đầy đủ dấu tiếng Việt, được lưu tại `assets/fonts` kèm giấy phép để dùng offline. Khi sao chép trang sang nơi khác, chép kèm thư mục này.

## Ý nghĩa & Nghệ thuật Đồ họa Hoa Cẩm Tú Cầu (Hydrangea)

Dự án lựa chọn **Hoa Cẩm Tú Cầu** làm loài hoa chủ đạo gửi gắm thông điệp ngày Phụ nữ Việt Nam 20/10:

- **Biểu tượng của sự biết ơn & Gắn kết vẹn tròn:** Những cánh hoa nhỏ bé, mỏng manh đan cài khít khao bên nhau tạo thành một đóa hoa tròn đầy viên mãn, tượng trưng cho tình cảm chân thành, lòng biết ơn sâu sắc và sự gắn kết bền chặt.
- **Bốn bảng màu tự nhiên thanh lịch:**
  - `skyBlue` (Xanh da trời): Đại diện cho niềm hy vọng, sự thanh bình và dịu êm.
  - `tealJade` (Xanh ngọc bích): Tượng trưng cho vẻ đẹp tinh tế, sang trọng và tươi mới.
  - `pureWhite` (Trắng tinh khôi): Tượng trưng cho sự thuần khiết, trong sáng và chân thành.
  - `pastelPink` (Hồng phấn): Mang nét ngọt ngào, dịu dàng và đầy thương mến.
- **Mô phỏng thực vật học bằng Canvas 2D (`createHydrangeaSprite`):**
  - Không dùng hình ảnh tĩnh cắt sẵn, mỗi đóa cẩm tú cầu được tính toán và vẽ hoàn toàn bằng thuật toán đồ họa toán học với từ **35 đến 55 bông hoa con (florets)**.
  - Mỗi bông hoa con gồm 4 cánh hoa đối xứng hình chữ thập (+), có tâm hoa, gân cánh li ti và độ chuyển sắc mềm mại từ cuống cánh.
  - Toàn bộ đóa hoa được phân chia thành **5 lớp canvas đệm độc lập** (1 lớp bóng/lá đáy và 4 vòng tán hoa từ ngoài vào trong) giúp hiệu ứng hoa bung nở theo từng tầng lớp diễn ra tự nhiên, sống động và đạt tốc độ khung hình 60 FPS mượt mà.

## Trải nghiệm

- Bó hoa nở trước, sau đó xuất hiện phong bì để người xem tự mở thiệp.
- Chạm từng bông hoa để nhận một lời chúc nhỏ. Khi dùng bàn phím, Tab đến bó hoa rồi nhấn Enter, Space hoặc các phím mũi tên.
- Chọn **Mở thiệp** để đọc lời chúc; đóng bằng nút ×, phím Escape hoặc **Gấp thiệp** trên phong bì.
- Hoa và tiêu đề được căn giữa khi vào trang. Khi mở thiệp, cả cụm hoa và thiệp được cân giữa; trang tự chia cột trên màn hình rộng và xếp thiệp xuống dưới trên màn hình hẹp. Thiệp nằm trong luồng trang, nên tiêu đề, ảnh, hoa và lời chúc không bị che; có thể tiếp tục tương tác với hoa khi thiệp mở.
- Chọn **Viết lời chúc riêng** để sửa người nhận, nội dung và chữ ký. **Lưu lời chúc** cập nhật thiệp và lưu trên trình duyệt hiện tại; **Hủy** bỏ các sửa đổi chưa lưu. Nội dung không tự gửi sang thiết bị hay trình duyệt khác.
- Chọn **Cho hoa nở lại** để xem lại hiệu ứng.
- Thiệp dài tự tăng chiều cao và cuộn cùng trang. Trang tôn trọng thiết lập giảm chuyển động và tạm dừng hoạt ảnh khi tab bị ẩn.

## Album kỷ niệm và thay ảnh

- Album xuất hiện sau lần đầu mở thiệp, hiện dần khi cuộn tới phần ảnh.
- Chọn **Xem album kỷ niệm** trong thiệp để chuyển đến album.
- Ban đầu ảnh xếp chồng như ảnh giấy. **Xòe album** trải ba ảnh ra ngang trên máy tính, dọc trên điện thoại; **Gấp album** xếp lại.
- Album vẫn giữ lại khi đóng thiệp, để người xem có thể ngắm ảnh tiếp.
- Chọn **Thay ảnh** để xòe album và hiện nút **Đổi ảnh** cho từng khung. Chọn ảnh trên thiết bị (tối đa 20 MB); ảnh được thu nhỏ và lưu trên trình duyệt hiện tại. Chọn **Ảnh ban đầu** để khôi phục từng khung, hoặc **Xong** để ẩn các nút chỉnh sửa.
- Ảnh đã chọn chỉ có trên trình duyệt này, không tự chia sẻ sang thiết bị khác hoặc thay đổi tệp ảnh trong mã nguồn.


Album gồm ba ô ảnh, mặc định dùng cùng một ảnh mẫu. Ngoài cách thay trực tiếp trên trang, có thể sửa ảnh mặc định trong mã nguồn để người khác mở trang cũng thấy ảnh của bạn:

1. Chép ảnh của bạn vào thư mục `assets`, ví dụ `assets/me.jpg`.
2. Trong phần `memoryAlbum` ở `index.html`, đổi `src="./assets/portrait-placeholder.webp"` của từng ô ảnh thành đường dẫn tương ứng, ví dụ `src="./assets/me.jpg"`.
3. Sửa `alt` và hai dòng chữ trong `figcaption` nếu muốn cá nhân hóa phần ảnh.

Khung ảnh dùng tỉ lệ 3:4 và tự cắt ảnh vừa khung. Có thể chỉnh `object-position` trong `.portrait-photo img` ở `style.css` để giữ khuôn mặt đúng vị trí.

Ảnh mẫu `assets/portrait-placeholder.webp` (768 × 1024) được tạo bằng công cụ imagegen tích hợp; prompt cuối nằm trong `assets/portrait-prompt.txt`.

## Trang Quản Trị Cấu Hình (admin.html)

Mở `admin.html` trực tiếp trong trình duyệt hoặc truy cập http://localhost:8080/admin.html:
- **Tài khoản quản trị mặc định:** `admin`
- **Mật khẩu quản trị mặc định:** `admin2010` (có thể đổi ngay trong trang quản trị)
- **Các tính năng trên trang admin:**
  1. **Cấu hình Người nhận & Nội dung thư**: Tên người nhận, tiêu đề thư, nội dung thư tâm sự nhiều đoạn, chữ ký người gửi.
  2. **Cấu hình Mật khẩu ngày sinh**: Ngày tháng năm sinh mở khóa (`dd/mm/yyyy`), tiêu đề, lời hướng dẫn và gợi ý.
  3. **Cấu hình Vườn hoa**: Dòng đề từ góc vườn hoa và tiêu đề thiệp trong vườn hoa.
  4. **Tạo Link Chia Sẻ Tự Động Đồng Bộ (`#cfg=...`)**: Bấm **Sao chép Link gửi người ấy** để tạo link gửi qua tin nhắn. Khi người nhận mở link trên điện thoại hoặc máy tính của họ, mọi thông tin bạn đã cấu hình sẽ tự động hiển thị chính xác mà không cần cấu hình lại.
  5. **Xem trước trực quan (Live Preview)**: Xem trước thiệp và màn hình khóa thời gian thực ngay khi gõ.

## Các tệp

- `index.html`: bó hoa cẩm tú cầu, phong bì, thiệp và màn hình khóa bảo mật ngày sinh.
- `garden.html`: khu vườn hoa với hoa bỉ ngạn (bông đầu tiên chạm vào), hoa cẩm tú cầu và hoa hồng nhiều lớp cánh bung nở.
- `admin.html`: bảng điều khiển quản trị có tài khoản và mật khẩu bảo vệ để tùy chỉnh nội dung và sao chép link đồng bộ.
- `config.js`: module cấu hình tập trung và cơ chế sinh mã URL hash `#cfg=...` giúp tự động đồng bộ sang máy người nhận.
- `lock.js` & `lock.css`: giao diện màn hình khóa thông minh mở bằng ngày sinh (`dd/mm/yyyy`).
- `garden-botany.js`: thuật toán đồ họa sinh học vẽ hoa bỉ ngạn, hoa hồng nở rộ từng lớp cánh, cẩm tú cầu và nụ hoa.
- `style.css`: phong bì, giấy gấp, bảng màu cẩm tú cầu dịu mát, bố cục responsive và chuyển động mượt mà.
- `script.js`: vẽ bó hoa, hiệu ứng nở hoa, parallax, cánh hoa bay và tương tác từng bông.
- `card.js`: mở/đóng thiệp, tự động nạp nội dung người nhận, lời chúc từ module cấu hình `config.js`.
- `album.js`: thay, thu nhỏ, lưu ảnh album trên trình duyệt và khôi phục ảnh ban đầu.
- `assets/portrait-placeholder.webp`: ảnh mẫu có thể thay thế.
- `tests/layout.cjs`: kiểm tra hồi quy bố cục trên 11 kích thước màn hình, hoa căn giữa, album ẩn/hiện và xòe/gấp, thiệp dài và các tương tác. Chạy `node tests/layout.cjs` trong môi trường có Playwright (hoặc đặt `NODE_PATH` đến thư mục chứa Playwright đã cài).
- `tests/album.cjs`: kiểm tra chọn ảnh, thu nhỏ, lưu và khôi phục riêng từng ảnh, tải lại trang, tệp không hợp lệ, bộ nhớ không khả dụng và bố cục chỉnh ảnh trên điện thoại. Chạy `node tests/album.cjs` với Playwright.

Đổi nội dung thiệp mặc định tại `defaultGreeting` trong `card.js`; đổi các lời chúc theo bông hoa tại `WHISPER_NOTES` trong `script.js`. Nội dung được render dưới dạng văn bản thuần.

# flowers-20-10
