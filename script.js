// modal
const ctaBtn = document.querySelector(".cta-btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
modal.addEventListener('click', modalClick);
function modalClick(e) {
  e.stopPropagation();
  return false;
}

const closeModal = (e) => {
  e.stopPropagation();
  
  modal.style.opacity = 0;
  overlay.style.opacity = 0; 
  const closeTimeout = setTimeout(() => {
    overlay.style.display = "none";
  modal.style.display = "none";
  }, 400);
}
const openModal = () => {
  modal.style.display = "block"
  overlay.style.display = "block";
  const openTimeout = setTimeout(() => {
    modal.style.opacity = 1;
    overlay.style.opacity = 1; 
  }, 50);
}

ctaBtn.addEventListener("click", openModal);
overlay.addEventListener("click", closeModal);

// lottie hover effect
const playerContainers = document.querySelectorAll(".hoverEffects");
  playerContainers.forEach(container => {
    container.addEventListener("mouseover", () => {
      const player = container.querySelector("lottie-player");
      player.setDirection(1);
      player.play();
    });

    container.addEventListener("mouseleave", () => {
      const player = container.querySelector("lottie-player");
      player.setDirection(-1);
      player.play();
    });
  });