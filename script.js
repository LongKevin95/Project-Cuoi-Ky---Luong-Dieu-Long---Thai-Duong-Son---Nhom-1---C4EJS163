// Đóng mở danh mục-----------------
const toggleBtn = document.getElementById("menu-btn");
const category = document.getElementById("menu");

toggleBtn.addEventListener("click", () => {
  category.classList.toggle("hide");
});

// hero-slider --------------------
const track = document.querySelector(".slider-track");
const dots = document.querySelectorAll(".dot");

let index = 0;

function updateSlider() {
  track.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    updateSlider();
  });
});

// Auto slide interval  ---------------
setInterval(() => {
  index = (index + 1) % dots.length;
  updateSlider();
}, 4000);

// Countdown Timer -------------------------------
function countdownTimer() {
  const target = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // đếm 3 ngày

  setInterval(() => {
    const now = new Date().getTime();
    const diff = target - now;

    document.getElementById("days").textContent = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );
    document.getElementById("hours").textContent = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    );
    document.getElementById("minutes").textContent = Math.floor(
      (diff / 1000 / 60) % 60
    );
    document.getElementById("seconds").textContent = Math.floor(
      (diff / 1000) % 60
    );
  }, 1000);
}

countdownTimer();

// Flash Sales Slider ------------------------------------

const flashSaleTrack = document.querySelector(".flash-track");
const cards = document.querySelectorAll(".product");
const btnLeft = document.querySelector(".flash-arrow--left");
const btnRight = document.querySelector(".flash-arrow--right");

let translateIndex = 0;
const itemsPerSlide = 4;

function updateFlashSaleSlider() {
  flashSaleTrack.style.transform = `translateX(-${
    translateIndex * (250 + 20)
  }px)`;
}

btnRight.addEventListener("click", () => {
  if (translateIndex < cards.length - itemsPerSlide)
    translateIndex += itemsPerSlide;
  updateFlashSaleSlider();
});

btnLeft.addEventListener("click", () => {
  if (translateIndex >= itemsPerSlide) translateIndex -= itemsPerSlide;
  updateFlashSaleSlider();
});
