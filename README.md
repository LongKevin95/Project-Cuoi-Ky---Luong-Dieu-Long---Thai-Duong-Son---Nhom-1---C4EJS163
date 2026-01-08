- Project được tổ chức theo kiến trúc Asset-based:

  LS Ecommerce/
  │
  ├── index.html
  ├── pages/
  │ ├── login.html
  │ ├── signup.html
  │ ├── admin.html
  │ ├── cart.html
  │ ├── product.html
  │ ├──

  ├── components/
  │ ├── header.html
  │ ├── footer.html
  │ └── userMenu.html
  │
  ├── assets/
  │ ├── images/
  │ └── icons/
  │
  ├── css/
  │ ├── base.css
  │ ├── layout.css
  │ ├── components.css
  │ ├── pages/
  │ ├── login.css
  │ └──...
  │
  ├── js/
  │ ├── pages/
  │ │ ├── login.js
  │ │ ├── signin.js
  │ │ └── ....
  │ ├── shared(tạm thời chưa sử dụng được)
  │ └── script.js(main)
  │
  └── README.md

- Tài khoản admin được init ngay khi khởi chạy app với thông tin đăng nhập mặc định:
  Email: admin@gmail.com
  Password: admin

- Cần tạo tài khoản user trước mới đăng nhập.

- Phần CSS áp dụng một phần kiến trúc ITCSS và đặt tên class theo quy tắc BEM.

- Các trang chính sẽ nằm trong thư mục pages

- Mục components chứa các thành phần con như header, footer, user menu... được tái sử dụng nhiều lần trong các trang chính.

- Các components sẽ được load vào các page bằng hàm loadComponent trong file loadComponents.js

-
