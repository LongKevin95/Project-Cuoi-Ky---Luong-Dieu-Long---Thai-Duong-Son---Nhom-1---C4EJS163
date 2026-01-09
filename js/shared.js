const USERS_KEY = "users";
const CURRENT_USER_KEY = "user";

export async function initAdminAccount() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  // init tài khoản admin đầu tiên
  const hasAdmin = users.some((user) => user.role === "admin");

  if (!hasAdmin) {
    const admin = {
      id: Date.now(),
      email: "admin@gmail.com",
      password: "admin",
      name: "admin",
      role: "admin",
    };

    users.push(admin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    console.log("Admin account created");
  }
}

export async function loadComponent(selector, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}
