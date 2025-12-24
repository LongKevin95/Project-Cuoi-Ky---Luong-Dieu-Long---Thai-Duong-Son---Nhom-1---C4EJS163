// ================= LOGIN LOGIC =================
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// Tài khoản cứng
const ACCOUNT_LIST = [
  {
    email: "khachhang@gmail.com",
    password: "khachhang",
    role: "customer",
    name: "Khách Hàng"
  },
  {
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
    name: "Admin"
  }
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const user = ACCOUNT_LIST.find(
    acc => acc.email === email && acc.password === password
  );

  if (!user) {
    alert("Sai tài khoản hoặc mật khẩu ❌");
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));

  alert("Đăng nhập thành công ✅");

  if (user.role === "admin") {
    window.location.href = "../admin.html";
  } else {
    window.location.href = "../index.html";
  }
  
});


// Show / Hide password
togglePassword.addEventListener("click", () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
});
