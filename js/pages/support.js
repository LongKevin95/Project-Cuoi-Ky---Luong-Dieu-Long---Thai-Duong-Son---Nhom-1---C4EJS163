(function () {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Vui lòng đăng nhập tài khoản để được hỗ trợ!");
      window.location.href = "./login.html";
    }
  } catch {
    alert("Vui lòng đăng nhập tài khoản để được hỗ trợ!");
    window.location.href = "./login.html";
  }
})();
