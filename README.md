# VƯỜN HỌC VUI – KHO LIÊN KẾT HỌC TẬP TIỂU HỌC

Ứng dụng web hiện đại, sinh động, giao diện pastel tươi sáng, được thiết kế chuyên biệt dành cho giáo viên tiểu học để lưu trữ, quản lý và chia sẻ các trang web học tập, phần mềm tương tác và tài liệu bổ ích cho các môn: **Toán, Tiếng Việt, Tin học, Tiếng Anh**.

---

## 🌟 Tính năng nổi bật

1. **Giao diện Trực quan & Dễ sử dụng**:
   - 4 nút bông hoa môn học lớn (`Toán`, `Tiếng Việt`, `Tin học`, `Tiếng Anh`) với màu sắc pastel sinh động, giúp lọc nhanh liên kết theo bộ môn.
   - Thanh tìm kiếm thông minh theo tên, mô tả, từ khóa và địa chỉ URL.
   - Sắp xếp theo ngày cập nhật hoặc theo tên (A-Z).
   - Đánh dấu mục yêu thích để truy cập nhanh.

2. **Quản lý Liên kết Toàn diện**:
   - Thêm, chỉnh sửa và xóa liên kết dễ dàng với giao diện thân thiện.
   - Kiểm tra tính hợp lệ của URL (bắt buộc bắt đầu bằng `http://` hoặc `https://`).
   - Sao chép nhanh đường dẫn chỉ với 1 cú nhấp chuột.

3. **Lưu trữ Bền vững & Supabase**:
   - Hỗ trợ kết nối cơ sở dữ liệu **Supabase** để lưu trữ lâu dài trên mây (Cloud), không sợ mất dữ liệu khi làm mới trang hoặc triển khai phiên bản mới.
   - Tự động chuyển về lưu trữ cục bộ (`LocalStorage`) nếu chưa cấu hình Supabase.
   - Tính năng Xuất/Nhập dữ liệu (`Export/Import JSON`) để sao lưu và phục hồi danh sách liên kết bất cứ lúc nào.

---

## 🚀 Hướng dẫn Cấu hình Supabase

Để lưu trữ dữ liệu vĩnh viễn và đồng bộ cho nhiều giáo viên:
1. Tạo một dự án miễn phí tại [Supabase](https://supabase.com).
2. Vào mục **SQL Editor** trong dự án Supabase của bạn và chạy đoạn lệnh sau để tạo bảng `links`:
```sql
create table public.links (
  id text primary key,
  title text not null,
  url text not null,
  subject text not null,
  description text not null,
  tags jsonb default '[]'::jsonb,
  is_favorite boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author text default 'Giáo viên'
);

alter table public.links enable row level security;

create policy "Cho phép xem danh sách công khai" on public.links
  for select using (true);

create policy "Cho phép quản lý liên kết" on public.links
  for all using (true);
```
3. Lấy **Project URL** và **Anon / Public Key** từ phần **Project Settings > API**.
4. Nhấn nút **Cấu hình Supabase** trên giao diện ứng dụng để nhập thông tin hoặc cấu hình qua biến môi trường.

---

## 📦 Hướng dẫn Triển khai lên Vercel

1. Đẩy mã nguồn dự án lên kho lưu trữ GitHub của bạn.
2. Đăng nhập vào [Vercel](https://vercel.com) và chọn **Add New > Project**.
3. Chọn repository GitHub của ứng dụng “Vườn Học Vui”.
4. Trong phần **Environment Variables**, thêm các biến sau:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
5. Nhấn **Deploy** để hoàn tất và nhận đường dẫn truy cập trực tuyến!
