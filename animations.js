// image sequence 
gsap.registerPlugin(ScrollTrigger);
const canvas = document.getElementById("hero");
const context = canvas.getContext("2d");
const section = document.querySelector(".img-sequence-container");
const frameCount = 9;
const currentFrame = index => `./images/img-sequence/${index}.png`;
canvas.width = 329;
canvas.height = 329;
const images = [];
const unis = {
  frame: 0
};

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

gsap.to(unis, {
  frame: 9 - 1,
  snap: "frame",
  ease: "none",
  // duration: 1,
  scrollTrigger: {
    trigger: section,
    fastScrollEnd: true,
    pin: true,
    start: -5,
    scrub: 0.3,
    end: "+=200%"
  },
  onUpdate: render
});

images[0].onload = render;

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[unis.frame], 0, 0, 329, 329); 
}

// projects transition
const projects = gsap.utils.toArray('.project-card');
projects.forEach(project => {
  gsap.from(project, {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    scrollTrigger: {
      trigger: project,
      toggleActions: 'restart none none reverse',
    }
  });
});
const projectsDescriptions = gsap.utils.toArray('.project-description');
projectsDescriptions.forEach(description => {
  gsap.from(description, {
    opacity: 0,
    y: 30,
    duration: 1,
    scrollTrigger: {
      trigger: description,
      toggleActions: 'restart none none reverse',
    }
  });
});