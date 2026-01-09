import { initAdminAccount, loadComponent } from "./shared.js";

// ================= USER =================

const USERS_KEY = "users";
const CURRENT_USER_KEY = "user";

let activeCategory = null;

function syncActiveCategoryUI() {
  const items = document.querySelectorAll("#menu .menu-list-item");
  if (!items.length) return;

  const current = activeCategory || "";
  items.forEach((li) => {
    const liCategory = li.dataset.category || "";
    li.classList.toggle("is-active", liCategory === current);
  });
}

function getUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  window.location.href = isInPagesFolder ? "../index.html" : "./index.html";
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
function getSearchTermFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("search") || "").trim();
}

function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function setSearchTermInUrl(term, { replace = false } = {}) {
  const url = new URL(window.location.href);
  const next = (term || "").trim();
  if (!next) url.searchParams.delete("search");
  else url.searchParams.set("search", next);
  if (replace) history.replaceState({}, "", url);
  else history.pushState({}, "", url);
}

function renderProductCards(container, list) {
  if (!container) return;
  container.innerHTML = "";

  list.forEach((p) => {
    container.innerHTML += `
      <div class="product" onclick="goToDetail('${p.id}')">
        <span class="product-discount">-40%</span>

        <div class="product-img-wrap">
          <img src="${p.img}" class="product-img" />
        </div>

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

function renderFlashSaleProducts(filterCategory = null) {
  const container = document.querySelector(".flash-track");
  if (!container) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const filteredProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products;

  renderProductCards(container, filteredProducts.slice(0, 8));
}

function renderSearchResults(term, filterCategory = null) {
  const titleEl = document.getElementById("searchResultsTitle");
  const container = document.getElementById("searchResultsTrack");
  if (!container) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const q = normalizeText(term);
  const categoryFiltered = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products;
  const matched = q
    ? categoryFiltered.filter((p) => {
        const name = normalizeText(p.name);
        const category = normalizeText(p.category);
        return name.includes(q) || category.includes(q);
      })
    : categoryFiltered;

  if (titleEl) {
    titleEl.textContent = q
      ? `Kết quả tìm kiếm: "${term}" (${matched.length})`
      : "Kết quả tìm kiếm";
  }

  if (matched.length === 0) {
    container.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
    return;
  }

  renderProductCards(container, matched);
}

function applySearchState() {
  const flashSection = document.getElementById("flashSection");
  const searchSection = document.getElementById("searchResultsSection");
  const term = getSearchTermFromUrl();

  const input = document.getElementById("headerSearchInput");
  if (input) input.value = term;

  if (term) {
    if (flashSection) flashSection.hidden = true;
    if (searchSection) searchSection.hidden = false;
    renderSearchResults(term, activeCategory);
  } else {
    if (flashSection) flashSection.hidden = false;
    if (searchSection) searchSection.hidden = true;
    renderFlashSaleProducts(activeCategory);
  }
}

function bindHeaderSearch() {
  const form = document.getElementById("headerSearchForm");
  const input = document.getElementById("headerSearchInput");
  const suggestions = document.getElementById("headerSearchSuggestions");
  if (!form || !input) return;

  function getSuggestions(query) {
    const q = normalizeText(query);
    if (!q) return [];

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const unique = new Set();

    products.forEach((p) => {
      if (p?.category) unique.add(String(p.category).trim());
      if (p?.name) {
        const words = String(p.name).trim().split(/\s+/).filter(Boolean);
        const max = Math.min(3, words.length);
        for (let k = 2; k <= max; k++) {
          unique.add(words.slice(0, k).join(" "));
        }
      }
    });

    const all = Array.from(unique)
      .map((s) => s.trim())
      .filter(Boolean);

    const filtered = all.filter((s) => normalizeText(s).includes(q));

    filtered.sort((a, b) => {
      const na = normalizeText(a);
      const nb = normalizeText(b);
      const aStarts = na.startsWith(q);
      const bStarts = nb.startsWith(q);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;
      return na.localeCompare(nb);
    });

    return filtered.slice(0, 8);
  }

  function hideSuggestions() {
    if (!suggestions) return;
    suggestions.hidden = true;
    suggestions.innerHTML = "";
  }

  function renderSuggestions(list) {
    if (!suggestions) return;
    if (!list.length) {
      hideSuggestions();
      return;
    }

    suggestions.innerHTML = list
      .map(
        (text) =>
          `<button type="button" class="header-search__suggestion-item" data-value="${text.replace(
            /"/g,
            "&quot;"
          )}">${text}</button>`
      )
      .join("");
    suggestions.hidden = false;
  }

  input.addEventListener("input", () => {
    renderSuggestions(getSuggestions(input.value));
  });

  input.addEventListener("focus", () => {
    renderSuggestions(getSuggestions(input.value));
  });

  suggestions?.addEventListener("click", (e) => {
    const btn = e.target.closest(".header-search__suggestion-item");
    if (!btn) return;
    const value = btn.dataset.value || btn.textContent || "";
    input.value = value;
    hideSuggestions();
    setSearchTermInUrl(value);
    applySearchState();
    document.getElementById("searchResultsSection")?.scrollIntoView();
  });

  document.addEventListener("click", (e) => {
    if (!suggestions || suggestions.hidden) return;
    if (!form.contains(e.target)) hideSuggestions();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = input.value.trim();
    hideSuggestions();
    setSearchTermInUrl(term);
    applySearchState();
    if (term) document.getElementById("searchResultsSection")?.scrollIntoView();
  });
}

window.addEventListener("popstate", () => {
  applySearchState();
});

document.querySelectorAll("#menu li").forEach((item) => {
  item.addEventListener("click", () => {
    activeCategory = item.dataset.category || null;
    syncActiveCategoryUI();
    applySearchState();
  });
});

// ================= LOGIN / LOGOUT UI =================
function handleAuthUI() {
  const currentUser = getUser();
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (currentUser) {
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (signupLink) signupLink.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}
const userIcon = document.getElementById("userIcon");
const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

function bindUserMenu() {
  const userIcon = document.getElementById("userIcon");
  const userIconImg = document.getElementById("userIconImg");
  const userMenu = document.getElementById("userMenu");
  const headEl = userMenu?.querySelector(".user-menu__head");
  const dividerEl = userMenu?.querySelector(".user-menu__divider");
  const avatarEl = document.getElementById("userMenuAvatar");
  const nameEl = document.getElementById("userMenuName");
  const emailEl = document.getElementById("userMenuEmail");
  const signInBtn = document.getElementById("menuSignIn");
  const myProfileBtn = document.getElementById("menuMyProfile");
  const settingsBtn = document.getElementById("menuSettings");
  const notificationBtn = document.getElementById("menuNotification");
  const logoutBtn = document.getElementById("menuLogout");
  if (!userIcon || !userMenu) return;

  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const loginUrl = isInPagesFolder ? "login.html" : "pages/login.html";
  const defaultAvatar = isInPagesFolder
    ? "../assets/icons/user-icon.svg"
    : "./assets/icons/user-icon.svg";
  const loggedInAvatar = "https://i.pravatar.cc/80?img=32";

  const applyUserMenuState = (u) => {
    const isLoggedIn = Boolean(u);

    if (userIconImg)
      userIconImg.src = isLoggedIn ? loggedInAvatar : defaultAvatar;
    if (avatarEl) avatarEl.src = isLoggedIn ? loggedInAvatar : defaultAvatar;

    if (headEl) headEl.style.display = isLoggedIn ? "flex" : "none";
    if (dividerEl) dividerEl.style.display = isLoggedIn ? "block" : "none";

    if (signInBtn) signInBtn.style.display = isLoggedIn ? "none" : "flex";

    if (myProfileBtn) myProfileBtn.style.display = isLoggedIn ? "flex" : "none";
    if (settingsBtn) settingsBtn.style.display = isLoggedIn ? "flex" : "none";
    if (notificationBtn)
      notificationBtn.style.display = isLoggedIn ? "block" : "none";
    if (logoutBtn) logoutBtn.style.display = isLoggedIn ? "flex" : "none";

    if (!isLoggedIn) return;
    const displayName = u?.fullName || u?.name || "Your name";
    const displayEmail = u?.email || "yourname@gmail.com";
    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = displayEmail;
  };

  applyUserMenuState(JSON.parse(localStorage.getItem(CURRENT_USER_KEY)));

  const closeMenu = () => {
    userMenu.hidden = true;
    userIcon.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    const u = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    applyUserMenuState(u);
    userMenu.hidden = false;
    userIcon.setAttribute("aria-expanded", "true");
  };
  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (userMenu.hidden) openMenu();
    else closeMenu();
  });

  signInBtn?.addEventListener("click", () => {
    closeMenu();
    window.location.href = loginUrl;
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
      window.location.href = loginUrl;
      return;
    }
    window.location.href = isInPagesFolder
      ? "user-profile.html"
      : "pages/user-profile.html";
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
  bindHeaderSearch();
  bindUserMenu();
  updateCartBadge();
  syncActiveCategoryUI();
  applySearchState();
  handleAuthUI();
}
init();
