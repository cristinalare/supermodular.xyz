'use strict';
import * as THREE from 'three';

import { GLTFLoader } from 'GLTFLoader';
import { TrackballControls } from 'TrackballControls';

const mechanismsContainer = document.querySelector('.mechanisms-container');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.modal-close');
const mechanismBox = document.querySelector('.mechanism-box');
const mechanismBoxTitle = document.querySelector('.mechanism-box_title');
const mechanismBoxDescription = document.querySelector('.mechanism-box_description');

const mechanismBoxLink = document.querySelector('.mechanism-box_link');
const mechanismBoxMore = document.querySelector('.mechanism-box_more');
const mechanismBoxMesh = document.querySelector('.mechanism-box_mesh');
let startClick, endClick, startClickPosition, endClickPosition;
const footerSection = document.querySelector('footer');
const introSection = document.querySelector('.intro');
const introMeshes = document.querySelectorAll('.intro_mesh');
const loadingSection = document.querySelector('.loading');
const minLoadedMeshes = introMeshes.length + 4;
// helpers

const handle3dClick = (element, fn) => {
  element.addEventListener('mousedown', (e) => {
    startClick = new Date();
    startClickPosition = { x: e.clientX, y: e.clientY };
  });
  element.onmouseup = (e) => {
    endClick = new Date();
    endClickPosition = { x: e.clientX, y: e.clientY };
    const timeDiff = new Date(endClick - startClick).getMilliseconds();
    const cursorDiff = {
      x: Math.abs(endClickPosition.x - startClickPosition.x),
      y: Math.abs(endClickPosition.y - startClickPosition.y),
    };
    const isClick = timeDiff < 300 && cursorDiff.x < 10 && cursorDiff.y < 10;
    isClick && fn();
  };
};

const getMechType = (type) => {
  return type === 0 ? 'web1' : type === 1 ? 'web2' : 'web3'; 
};

const getBgSvg = (elementType) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '90');
  svg.setAttribute('height', '90');
  svg.setAttribute ('class', 'mesh-background');
  
  if (elementType === 0) {
    svg.setAttribute('viewBox', '0 0 136 136');
    const rect = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect.setAttribute('fill', '#014875');
    rect.setAttribute('rx', '68');
    rect.setAttribute('width', '136');
    rect.setAttribute('height', '136');
    svg.appendChild(rect);
  }

  if (elementType === 1) {
    svg.setAttribute('viewBox', '0 0 188 188');
    const rect = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect.setAttribute('fill', '#014875');
    rect.setAttribute('transform', 'rotate(45 94 0)');
    rect.setAttribute('x', '94');
    rect.setAttribute('width', '132');
    rect.setAttribute('height', '132');
    svg.appendChild(rect);
  }

  if (elementType === 2) {
    svg.setAttribute('viewBox', '0 0 145 167');
    const iconPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    iconPath.setAttribute('d', "M72.5 0L144.813 41.75V125.25L72.5 167L0.186882 125.25V41.75L72.5 0Z");
    iconPath.setAttribute('fill', '#014875');
    svg.appendChild(iconPath);
  }
  return svg;
}

const handleIntroClicks = () => {
  const firstWeb1 = document.querySelector('.web1');
  const firstWeb2 = document.querySelector('.web2');
  const firstWeb3 = document.querySelector('.web3');
  const firstOfType = [firstWeb1, firstWeb2, firstWeb3];

  const introMeshesContainers = document.querySelectorAll('.intro_mesh-container');
  introMeshesContainers.forEach((mesh, index) => {
    handle3dClick(mesh, () => {
      const startY = firstOfType[index].getBoundingClientRect().top;
      window.scrollTo(0, startY - 0.1 * window.innerHeight);
    });
  });
}

const formatMechTitle = (title) => {
  return title.replaceAll(' ', '_');
}

const formatBackMechTitle = (title) => {
  return title.replaceAll('_', ' ');
}

// end helpers

function main() {
  const manager = new THREE.LoadingManager();
  const progressElement = document.querySelector('.progress-percent');
  manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    // const percent = `${Math.floor(itemsLoaded / itemsTotal * 100)}%`;
    const newItemsLoaded = Math.min(itemsLoaded, minLoadedMeshes);
    const percent = `${Math.floor(newItemsLoaded / minLoadedMeshes * 100)}%`;
    progressElement.style.width = percent;
  };
  
  const canvas = document.createElement('canvas');
  const loader = new GLTFLoader(manager);
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});
  renderer.setScissorTest(true);

  const sceneElements = [];

  function addScene(elem, fn, size) {
    const ctx = document.createElement('canvas').getContext('2d');
    elem.appendChild(ctx.canvas);
    sceneElements.push({elem, ctx, fn});
  }

  function makeScene(elem, disabledScroll) {
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    let controls;
    if (!disabledScroll || window.innerWidth > '600') {
      controls = new TrackballControls(camera, elem);
      controls.noZoom = true;
      controls.noPan = true;
    }

    // old lights
    const dirLight1 = new THREE.DirectionalLight( 0xf23fff );
    dirLight1.position.set( 1, 1, 1 );
    scene.add( dirLight1 );
  
    const dirLight2 = new THREE.DirectionalLight( 0x3effff );
    dirLight2.position.set( - 1, - 1, - 1 );
    scene.add( dirLight2 );
  
    const ambientLight = new THREE.AmbientLight( 0xf2ffff );
    scene.add( ambientLight );
    // end old lights

    {
      const color = 0xFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    return {scene, camera, controls};
  }

  let count = 0;
  const initFunctionTemplate = (mechType, disabledScroll, i) => (elem) => {
    // disabledScroll = true for hero + mechanisms list meshes
    const {scene, camera, controls} = makeScene(elem, disabledScroll);
    let mesh;
    const randomX = Math.random() > 0.5 ? -1 : 1;
    const randomY = Math.random() > 0.5 ? -1 : 1;
    const randomZ = Math.random() > 0.5 ? -1 : 1;

    loader.load(`./assets/${mechType}.glb`, function(gltf) {
      mesh = gltf.scene;
      mesh.traverse((o) => {
        if (o.isMesh) {
          const x = !i ? Math.random() * 0.7 : i % 3 == 0 ? 0.1 : i % 3 === 1 ? 0.7 : 0.4;
          o.material.metalness = x;

          if (i) {
            let geometry;
            if (i % 4 === 0) geometry = new THREE.OctahedronGeometry( 3, 0 );
            else if (i % 4 === 1) geometry = new THREE.DodecahedronGeometry( 3, i % 3 === 0 ? 0 : 1 );
            else if (i % 4 === 2) geometry = new THREE.TorusGeometry( 2.7, 0.7, i % 3 == 0 ? 5 : i % 3 == 1 ? 8 : 20, i % 3 == 0 ? 5 : i % 3 == 1 ? 8 : 20);
            else if (i % 4 === 3) geometry = new THREE.SphereGeometry( 3, i % 3 == 0 ? 1 : i % 3 == 1 ? 10 : 25, 16 );
            o.geometry = geometry;
          }
          
          const wireframeGeometry = new THREE.WireframeGeometry( o.geometry );
          const wireframeMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
   	      const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );
          wireframe.material.opacity = i % 4 == 0 ? 0.85 : i % 3 == 1 ? 0.3 : i % 4 == 3 ? 0.15 : 0.5;
          wireframe.material.transparent = true;
          o.add( wireframe );
        }
      });
      scene.add(gltf.scene);
      mesh.scale.set(0.2, 0.2, 0.2);

      count ++;
      if (disabledScroll && count === minLoadedMeshes) {
        loadingSection.style.opacity = '0';
        introSection.style.opacity = '1';
        mechanismsContainer.style.display = 'flex';
        footerSection.style.display = 'flex';
        setTimeout(() => {
          loadingSection.style.display = 'none';
        }, 1000);
      }

    }, function(progress) {
      if (disabledScroll) {
        // loadingSection.style.display = 'flex';
        // mechanismsContainer.style.display = 'none';
      }
    });

    return (time, rect) => {
      
      if (mesh) {
        mesh.rotation.y = time * 0.3 * randomX;
        mesh.rotation.x = time * 0.02 * randomY;
        mesh.rotation.z = time * 0.09 * randomZ;
      }
      if (controls) {
        controls.handleResize();
        controls.update();
      }
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      
      renderer.render(scene, camera);
    };
  };

  const sceneInitFunctionsByName = (disabledScroll, i) => {
    return {
      'web1': initFunctionTemplate('web1', disabledScroll),
      'web2': initFunctionTemplate('web2', disabledScroll),
      'web3': initFunctionTemplate('web3', disabledScroll, i),
    };
  };

  // add meshes
  const addMeshToScene = (meshHtmlElement, disabledScroll, i) => {
    const sceneName = meshHtmlElement.dataset.type;
    const sceneInitFunction = sceneInitFunctionsByName(disabledScroll, i)[sceneName];
    const sceneRenderFunction = sceneInitFunction(meshHtmlElement);
    addScene(meshHtmlElement, sceneRenderFunction);
  };

  // intro section
  const introBtn = document.querySelector('.intro-btn');
  introBtn.addEventListener('click', () => {
    const y = window.innerHeight;
    window.scrollTo(0, y);
  });
 
  const addIntroMeshes = () => {
   for (let i = 0; i < introMeshes.length; i++) {
     const element = introMeshes[i];
     element.setAttribute('data-type', getMechType(i));
     addMeshToScene(element, true);
   };
  }
  // end intro section

  // modal
  const openBox = (element, i) => {
    history.pushState('', '', `./#${formatMechTitle(element.title)}`);
    overlay.style.display = "block";
    mechanismBox.style.display = 'flex';
    mechanismBox.id = element.title;
    setTimeout(() => {
      mechanismBox.style.opacity = 1;
      overlay.style.opacity = 1; 
    }, 5);

    mechanismBoxTitle.textContent = element.title;
    mechanismBoxDescription.textContent = element.description;
    if (!element.link) {
      mechanismBoxMore.style.display = 'none';
    } else {
      const link = element.link;
      mechanismBoxMore.style.display = 'block';
      handle3dClick(mechanismBoxLink, () => window.open(link, '_blank'));
    }

    const prevCanvas = mechanismBoxMesh.firstChild;
    prevCanvas && prevCanvas.remove();
    mechanismBoxMesh.className = 'large-mesh';
    mechanismBoxMesh.setAttribute('data-type', getMechType(element.type));
    addMeshToScene(mechanismBoxMesh, false, i);
  };

  mechanismBox.addEventListener('click', modalClick);
  function modalClick(e) {
    e.stopPropagation();
    return false;
  }
 
  const closeBox = (e) => {
    history.pushState('', '', './');
    e && e.stopPropagation();
    mechanismBox.style.opacity = 0;
    
    setTimeout(() => {
      overlay.style.opacity = 0; 
      overlay.style.display = "none";
      mechanismBox.style.display = "none";
    }, 400);
  };

  overlay.addEventListener('click', closeBox);
  closeModalBtn.addEventListener('click', closeBox);

  document.addEventListener('keyup', (e) => {
    if(e.key === "Escape") {
      closeBox();
    }
  });

  const openBoxFromUrl = (jsonData) => {
    const url = window.location.href;
    const selectedMech = url.indexOf('#');
    if(selectedMech !== -1) {
      const mechTitle = formatBackMechTitle(url.slice(selectedMech + 1));
      let mechElement, i;
      jsonData.forEach((element, index) => {
        if (element.title === mechTitle) { mechElement = element; i = index; return;}
      });
      mechElement && openBox(mechElement, i);
    }
  };

  // create mechanisms
  fetch("./data.json")
    .then(response => response.json())
    .then(json => {
      openBoxFromUrl(json);
      addIntroMeshes();
      createMechanisms(json);
      handleIntroClicks();
    });
  
  const createMechanisms = (jsonData) => {
    jsonData.forEach((element, index) => {
      const mechContainer = document.createElement('div');
      mechContainer.className = `mechanism-container hover-container ${getMechType(element.type)}`;
      handle3dClick(mechContainer, () => openBox(element, index));

      const meshContainer = document.createElement('div');
      meshContainer.className = 'mesh-container';
      const mesh = document.createElement('div');
      mesh.className += 'small-mesh';
      mesh.setAttribute('data-type', getMechType(element.type));
      addMeshToScene(mesh, true, index);
      
      const bgSvg = getBgSvg(element.type);
      meshContainer.appendChild(mesh);
      meshContainer.appendChild(bgSvg);

      const title = document.createElement('p');
      title.textContent = element.title;
      title.className = 'mechanism-title hover-gradient-text';

      mechContainer.appendChild(meshContainer);
      mechContainer.appendChild(title);
      mechanismsContainer.appendChild(mechContainer);
    });
  }

  // render
  const renderElements = (time) => {
    for (const {elem, fn, ctx} of sceneElements) {
      const dpr = window.devicePixelRatio;
      const rect = elem.getBoundingClientRect();
      const {left, right, top, bottom, width, height} = rect;
      const rendererCanvas = renderer.domElement;

      const isOffscreen =
          bottom < 0 ||
          top > window.innerHeight ||
          right < 0 ||
          left > window.innerWidth;

      if (!isOffscreen) {
        // make sure the renderer's canvas is big enough
        if ((rendererCanvas.width !== width || rendererCanvas.height !== height) && width !== 0 && height !== 0) {
          renderer.setSize(width * dpr, height * dpr, false);
        }
        
        // make sure the canvas for this area is the same size as the area
        if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
          ctx.canvas.width = width  * dpr;
          ctx.canvas.height = height  * dpr;
        }

        renderer.setScissor(0, 0, width * dpr, height * dpr);
        renderer.setViewport(0, 0, width * dpr, height * dpr);
        // renderer.setPixelRatio(dpr);
        fn(time, rect);

        // copy the rendered scene to this element's canvas
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage(
            rendererCanvas,
            0, rendererCanvas.height - height * dpr, width * dpr, height * dpr,  // src rect
            0, 0, width * dpr, height * dpr);                              // dst rect
      }
    }
  };

  function render(time) {
    time *= 0.001;
    renderElements(time);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
