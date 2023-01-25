// mobile menu

const menuIcon = document.querySelector('.menu-icon');
const menuList = document.querySelector('.menu');
menuIcon.addEventListener('click', () => {
  menuList.classList.toggle('open');
});

// modal
const openModalBtn = document.querySelector(".cta-btn");
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

openModalBtn.addEventListener("click", openModal);
overlay.addEventListener("click", closeModal);