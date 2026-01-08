// ================= LOGIN LOGIC =================
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const USERS_KEY = "users";
const CURRENT_USER_KEY = "user";

// Tài khoản cứng
// const ACCOUNT_LIST = [
//   {
//     email: "khachhang@gmail.com",
//     password: "khachhang",
//     role: "customer",
//     name: "Khách Hàng",
//   },
//   {
//     email: "admin@gmail.com",
//     password: "admin",
//     role: "admin",
//     name: "Admin",
//   },
// ];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const rawUserData = localStorage.getItem(USERS_KEY);
  const usersList = JSON.parse(rawUserData);
  console.log(usersList);

  const currentUser = usersList.find(
    (acc) => acc.email === email && acc.password === password
  );

  if (!currentUser) {
    alert("Sai tài khoản hoặc mật khẩu ❌");
    return;
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  alert("Đăng nhập thành công ✅");

  if (currentUser.role === "admin") {
    window.location.href = "../pages/admin.html";
  } else {
    window.location.href = "../index.html";
  }
});

// Show / Hide password
togglePassword.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});
