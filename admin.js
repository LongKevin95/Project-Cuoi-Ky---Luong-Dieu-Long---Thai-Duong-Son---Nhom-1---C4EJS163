// ================= ADMIN AUTH =================
let imageBase64 = "";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") {
  alert("Bạn không có quyền truy cập ❌");
  window.location.href = "index.html";
}

const idInput = document.getElementById("id");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const descInput = document.getElementById("desc");
// ================= PRODUCT CRUD =================
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function renderTable() {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  getProducts().forEach((p, index) => {
    table.innerHTML += `
      <tr onclick="editProduct(${index})" style="cursor:pointer">
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td>
          <img src="${p.img}" style="width:60px;object-fit:cover">
        </td>
        <td>${p.category}</td>
        <td>${p.desc}</td>
        <td>
          <button onclick="event.stopPropagation(); removeProduct('${p.id}')">❌</button>
        </td>
      </tr>
    `;
  });
}

function addOrUpdate() {
  if (
    !idInput.value ||
    !nameInput.value ||
    !priceInput.value ||
    !categoryInput.value ||
    !descInput.value ||
    !imageBase64
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const product = {
    id: idInput.value,
    name: nameInput.value,
    price: Number(priceInput.value),
    img: imageBase64,
    category: categoryInput.value,
    desc: descInput.value
  };

  let products = getProducts();
  const index = products.findIndex(p => p.id === product.id);

  if (index !== -1) {
    products[index] = product;
  } else {
    products.push(product);
  }

  saveProducts(products);
  renderTable();
  alert("Lưu sản phẩm thành công ✅");
}
function removeProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  renderTable();
}

renderTable();
document.getElementById("imgFile").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    imageBase64 = reader.result;
    const preview = document.getElementById("preview");
    preview.src = imageBase64;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
});
function editProduct(index) {
  const p = getProducts()[index];

  idInput.value = p.id;
  nameInput.value = p.name;
  priceInput.value = p.price;
  categoryInput.value = p.category;
  descInput.value = p.desc;

  imageBase64 = p.img;

  const preview = document.getElementById("preview");
  preview.src = p.img;
  preview.style.display = "block";
}
function filterByCategory() {
  const selected = document.getElementById("filterCategory").value;
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  let products = getProducts();

  if (selected !== "all") {
    products = products.filter(p => p.category === selected);
  }

  products.forEach((p, index) => {
    table.innerHTML += `
      <tr onclick="editProduct(${index})">
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td>${p.category}</td>
        <td>${p.desc}</td>
        <td><img src="${p.img}" width="60"></td>
        <td>
          <button onclick="event.stopPropagation(); removeProduct('${p.id}')">❌</button>
        </td>
      </tr>
    `;
  });
}