import { initAdminAccount, loadComponent } from "./shared.js";

// ================= USER =================

const USERS_KEY = "users";
const CURRENT_USER_KEY = "user";

function getUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

// ================= LOGOUT =================
function logout() {
  alert("Đăng xuất thành công!");
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = "../index.html";
}

// exposer ra global để sử dụng do <script type="module"> chuyển biến và hàm thành module scope
window.logout = logout;

// ================= CART =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.querySelector(".header-action__badge");
  if (!badge) return;

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = total;
}

// ================= ADD TO CART =================
function addToCart(productId) {
  const user = getUser();

  if (!user) {
    alert("Vui lòng đăng nhập để mua hàng!");
    window.location.href = "pages/login.html";
    return;
  }

  if (user.role !== "customer") {
    alert("Admin không thể mua hàng!");
    return;
  }

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id == productId);

  if (!product) {
    alert("Sản phẩm không tồn tại!");
    return;
  }

  let cart = getCart();
  const index = cart.findIndex((i) => i.id == productId);

  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1,
    });
  }

  saveCart(cart);
  updateCartBadge();
  alert("Đã thêm vào giỏ hàng 🛒");
}
// exposer ra global để sử dụng
window.addToCart = addToCart;

// ================= RENDER PRODUCTS =================
function renderProducts(filterCategory = null) {
  const container = document.querySelector(".flash-track");
  if (!container) return;

  container.innerHTML = "";

  const products = JSON.parse(localStorage.getItem("products")) || [];

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products;

  filteredProducts.forEach((p) => {
    container.innerHTML += `
      <div class="product" onclick="goToDetail('${p.id}')">
        <span class="product-discount">-40%</span>

        <img src="${p.img}" class="product-img" />

        <button class="product-cart" onclick="event.stopPropagation(); addToCart('${
          p.id
        }')">
          Add To Cart
        </button>

        <h3 class="product-name">${p.name}</h3>

        <div class="product-price">
          <span class="price-new">$${p.price}</span>
          <span class="price-old">$${Math.round(p.price * 1.3)}</span>
        </div>

        <div class="product-rating">
          ⭐⭐⭐⭐⭐ <span>(88)</span>
        </div>
      </div>
    `;
  });
}
document.querySelectorAll("#menu li").forEach((item) => {
  item.addEventListener("click", () => {
    const cate = item.dataset.category;
    renderProducts(cate);
  });
});

// ================= LOGIN / LOGOUT UI =================
function handleAuthUI() {
  const currentUser = getUser();
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (currentUser) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload();
  }
}
const userIcon = document.getElementById("userIcon");
const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

function bindUserMenu() {
  const userIcon = document.getElementById("userIcon");
  const userMenu = document.getElementById("userMenu");
  const nameEl = document.getElementById("userMenuName");
  const emailEl = document.getElementById("userMenuEmail");
  const myProfileBtn = document.getElementById("menuMyProfile");
  const logoutBtn = document.getElementById("menuLogout");
  if (!userIcon || !userMenu) return;
  const closeMenu = () => {
    userMenu.hidden = true;
    userIcon.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    const u = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const displayName = u?.fullName || u?.name || "Your name";
    const displayEmail = u?.email || "yourname@gmail.com";
    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = displayEmail;
    userMenu.hidden = false;
    userIcon.setAttribute("aria-expanded", "true");
  };
  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (userMenu.hidden) openMenu();
    else closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (
      !userMenu.hidden &&
      !userMenu.contains(e.target) &&
      e.target !== userIcon
    ) {
      closeMenu();
    }
  });
  myProfileBtn?.addEventListener("click", () => {
    const u = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!u) {
      window.location.href = "pages/login.html";
      return;
    }
    window.location.href = "pages/user-profile.html";
  });
  logoutBtn?.addEventListener("click", () => {
    closeMenu();
    window.logout?.();
  });
}

// ==========PRODUCT DETAIL=============
function goToDetail(productId) {
  window.location.href = `pages/product-detail.html?id=${productId}`;
}
window.goToDetail = goToDetail;

async function init() {
  initAdminAccount();
  await loadComponent("#header", "/components/Header/header.html");
  bindUserMenu();
  updateCartBadge();
  renderProducts();
  handleAuthUI();
}
init();
