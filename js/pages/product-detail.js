const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const products = JSON.parse(localStorage.getItem("products")) || [];
const product = products.find((p) => p.id == productId);

if (!product) {
  alert("Không tìm thấy sản phẩm!");
} else {
  console.log("Product detail:", product);
  // TODO: render dữ liệu ra giao diện
}
