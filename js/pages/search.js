(function () {
  const QUERY_PARAM = "q";

  function normalizeText(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return (params.get(QUERY_PARAM) || params.get("search") || "").trim();
  }

  function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
  }

  function getSearchPageHref(term) {
    const next = (term || "").trim();
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const prefix = isInPagesFolder ? "" : "pages/";

    if (!next) return `${prefix}search.html`;
    return `${prefix}search.html?${QUERY_PARAM}=${encodeURIComponent(next)}`;
  }

  function redirectToSearch(term) {
    window.location.href = getSearchPageHref(term);
  }

  function renderResults(term) {
    const titleEl = document.getElementById("searchResultsTitle");
    const container = document.getElementById("searchResultsTrack");
    if (!container) return;

    const products = getProducts();
    const q = normalizeText(term);

    const matched = q
      ? products.filter((p) => normalizeText(p?.name).includes(q))
      : products;

    if (titleEl) {
      titleEl.textContent = q
        ? `Kết quả tìm kiếm: "${term}" (${matched.length})`
        : `Kết quả tìm kiếm (${matched.length})`;
    }

    if (!matched.length) {
      container.classList.add("is-empty");
      container.innerHTML =
        '<p class="search-page__empty">Không tìm thấy sản phẩm phù hợp.</p>';
      return;
    }

    container.classList.remove("is-empty");

    if (typeof window.renderProductCards === "function") {
      window.renderProductCards(container, matched);
      return;
    }

    container.innerHTML = matched
      .map(
        (p) => `
        <div class="product" onclick="goToDetail('${p.id}')">
          <span class="product-discount">-40%</span>

          <div class="product-actions">
            <button class="product-action-btn" aria-label="Wishlist" onclick="event.stopPropagation(); alert('Đã thêm vào wishlist!')">♡</button>
            <button class="product-action-btn" aria-label="Quick view" onclick="event.stopPropagation(); goToDetail('${p.id}')">👁</button>
          </div>

          <div class="product-img-wrap">
            <img src="${p.img}" class="product-img" />

            <button class="product-cart" onclick="event.stopPropagation(); addToCart('${p.id}')">Add To Cart</button>
          </div>

          <h3 class="product-name">${p.name}</h3>

          <div class="product-price">
            <span class="price-new">$${p.price}</span>
            <span class="price-old">$${Math.round(p.price * 1.3)}</span>
          </div>

          <div class="product-rating">⭐⭐⭐⭐⭐ <span>(88)</span></div>
        </div>
      `,
      )
      .join("");
  }

  function renderSearchPage() {
    const term = getQueryFromUrl();
    const input = document.getElementById("headerSearchInput");
    if (input) input.value = term;
    renderResults(term);
  }

  window.Search = {
    normalizeText,
    redirectToSearch,
    renderSearchPage,
  };

  document.addEventListener("DOMContentLoaded", () => {
    const path = (window.location.pathname || "").toLowerCase();
    const isSearchPage =
      path.endsWith("/pages/search.html") || path.endsWith("/search.html");
    if (isSearchPage) renderSearchPage();
  });
})();
