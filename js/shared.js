const USERS_KEY = "users";
const CURRENT_USER_KEY = "user";
const LAST_ORDER_KEY = "lastOrder";
function loadComponent(selector, url) {
  return fetch(url)
    .then((res) => res.text())
    .then((html) => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.innerHTML = html;
    });
}

window.loadComponent = loadComponent;
