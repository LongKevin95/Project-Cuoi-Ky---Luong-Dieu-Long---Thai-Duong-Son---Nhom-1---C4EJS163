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

const flashSlider = document.querySelector(".flash-slider");
const flashSaleTrack = document.querySelector(".flash-track");
const items = Array.from(document.querySelectorAll(".product"));
const btnPrev = document.querySelector(".flash-arrow--left");
const btnNext = document.querySelector(".flash-arrow--right");

function getItemMetrics() {
  const item = items[0];
  const itemRect = item.getBoundingClientRect();

  const styles = getComputedStyle(flashSaleTrack);
  const gap = parseFloat(styles.columnGap || styles.gap || 0);

  return {
    itemWidth: itemRect.width,
    gap,
    step: itemRect.width + gap,
  };
}

function getVisibleCount() {
  const sliderWidth = flashSlider.getBoundingClientRect().width;
  const { step } = getItemMetrics();

  return Math.floor(sliderWidth / step);
}

let currentIndex = 0;

function updateFlashSlider() {
  const { step } = getItemMetrics();
  flashSaleTrack.style.transform = `translateX(-${currentIndex * step}px)`;
}
btnNext.addEventListener("click", () => {
  const visible = getVisibleCount();
  const maxIndex = items.length - visible;

  currentIndex = Math.min(currentIndex + visible, maxIndex);
  updateFlashSlider();
});

btnPrev.addEventListener("click", () => {
  const visible = getVisibleCount();

  currentIndex = Math.max(currentIndex - visible, 0);
  updateFlashSlider();
});

// let translateIndex = 0;
// const itemsPerSlide = 4;

// function updateFlashSaleSlider() {
//   flashSaleTrack.style.transform = `translateX(-${
//     translateIndex * (260 + 20) // chiều rộng product-item + padding-inline
//   }px)`;
// }

// btnRight.addEventListener("click", () => {
//   if (translateIndex < cards.length - itemsPerSlide)
//     translateIndex += itemsPerSlide;
//   updateFlashSaleSlider();
// });

// btnLeft.addEventListener("click", () => {
//   if (translateIndex >= itemsPerSlide) translateIndex -= itemsPerSlide;
//   updateFlashSaleSlider();
// });
// --------------------------------------- TEST

const a = getItemMetrics();

console.log(a);
