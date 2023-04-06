// modals
function modalClick(e) {
  e.stopPropagation();
  return false;
}

const closeModal = (e, modal, overlay) => {
  e.stopPropagation();
  
  modal.style.opacity = 0;
  overlay.style.opacity = 0; 
  const closeTimeout = setTimeout(() => {
    overlay.style.display = "none";
  modal.style.display = "none";
  }, 400);
}
const openModal = (modal, overlay) => {
  modal.style.display = "block"
  overlay.style.display = "block";
  const openTimeout = setTimeout(() => {
    modal.style.opacity = 1;
    overlay.style.opacity = 1; 
  }, 50);
}

// menu
const menuProjects = document.querySelectorAll('.menu-project');
const menuItems = document.querySelectorAll('.menu-item');
const menuMobileDivider = document.querySelector('.menu-divider-mobile');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const menuModal = document.querySelector('.menu-modal');
const menuOverlay = document.querySelector('.menu-overlay');
const body = document.body;


menuModal.addEventListener('click', modalClick);

menuIcon.addEventListener("click", () => {
  openModal(menuModal, menuOverlay);
  closeIcon.style.display = 'block';
  menuIcon.style.display = 'none';
  body.style.position = 'fixed';
});

closeIcon.addEventListener("click", (e) => {
  body.style.position = '';
  closeModal(e, menuModal, menuOverlay);
  closeIcon.style.display = 'none';
  menuIcon.style.display = 'block';
});
menuOverlay.addEventListener("click", (e) => {
  body.style.position = '';
  closeModal(e, menuModal, menuOverlay);
  closeIcon.style.display = 'none';
  menuIcon.style.display = 'block';
});

// select menu item
const showProject = (index) => {
  menuItems.forEach((item, i) => {
    // if (index == i) item.style.color = 'transparent !important';
    // else item.style.color = 'white';
    if (index == i) item.classList.add('selected');
    else item.classList.remove('selected');
  });

  menuProjects.forEach((proj, i) => {
    if (index == i) proj.style.display = 'flex';
    else proj.style.display = 'none';
  })

  if (menuMobileDivider) {
    menuModal.scrollTo({
      top: menuMobileDivider.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  }
}

menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    showProject(index)
  })
})

// signup modal
const openModalBtn = document.querySelector("#signup-btn");
const modal = document.querySelector(".signup-modal");
const overlay = document.querySelector(".overlay");

modal.addEventListener('click', modalClick);

openModalBtn.addEventListener("click", () => openModal(modal, overlay));
overlay.addEventListener("click", (e) => closeModal(e, modal, overlay));