// ================= USER =================
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// ================= CART =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.querySelector(".badge");
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
    window.location.href = "SignIn/sign-in.html";
    return;
  }

  if (user.role !== "customer") {
    alert("Admin không thể mua hàng!");
    return;
  }

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.id == productId);

  if (!product) {
    alert("Sản phẩm không tồn tại!");
    return;
  }

  let cart = getCart();
  const index = cart.findIndex(i => i.id == productId);

  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
  alert("Đã thêm vào giỏ hàng 🛒");
}

// ================= RENDER PRODUCTS =================
function renderProducts(filterCategory = null) {
  const container = document.querySelector(".flash-track");
  if (!container) return;

  container.innerHTML = "";

  const products = JSON.parse(localStorage.getItem("products")) || [];

  const filteredProducts = filterCategory
    ? products.filter(p => p.category === filterCategory)
    : products;

  filteredProducts.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <span class="product-discount">-40%</span>

        <img src="${p.img}" class="product-img" />

        <button class="product-cart" onclick="addToCart('${p.id}')">
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
document.querySelectorAll("#menu li").forEach(item => {
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
  localStorage.removeItem("user");
  window.location.reload();
}
}
const userIcon = document.getElementById("userIcon");
const currentUser = JSON.parse(localStorage.getItem("user"));

if (userIcon) {
  userIcon.addEventListener("click", () => {
    if (!currentUser) {
      window.location.href = "./SignIn/sign-in.html";
    } else if (currentUser.role === "admin") {
      window.location.href = "admin.html";
    } else {
      alert("Trang cá nhân customer chưa làm, tạm thời ở home");
    }
  });
}
// ================= INIT =================
renderProducts();
updateCartBadge();
handleAuthUI();
