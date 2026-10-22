/**
 * PORTFÓLIO CRIATIVO — THALITA DE OLIVEIRA TERRAZAN
 * Script Principal: WebGL (Three.js), Tipografia Cinética, Cursor e Interatividade
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. ESTADO E PREFERÊNCIAS DO SISTEMA
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const state = {
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    cursorX: 0,
    cursorY: 0,
    ringX: 0,
    ringY: 0,
    fps: 60,
    lastTime: performance.now(),
    frameCount: 0
  };

  // --------------------------------------------------------------------------
  // 2. PRELOADER & SEQUÊNCIA DE ABERTURA CINEMATOGRÁFICA
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderCounter = document.getElementById('preloader-counter');
  const preloaderProgress = document.getElementById('preloader-progress');
  const charElements = document.querySelectorAll('.char');
  const ghostTitle = document.querySelector('.hero-title-ghost');

  function initOpeningSequence() {
    if (prefersReducedMotion) {
      // Ignora animações se o usuário preferir movimento reduzido
      if (preloader) preloader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      charElements.forEach(char => {
        char.style.transform = 'translateY(0%)';
      });
      return;
    }

    let progress = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      progress = Math.min(Math.floor((elapsed / duration) * 100), 100);

      if (preloaderCounter) {
        preloaderCounter.textContent = progress < 10 ? `0${progress}` : `${progress}`;
      }
      if (preloaderProgress) {
        preloaderProgress.style.width = `${progress}%`;
      }

      if (progress < 100) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(revealHeroContent, 200);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function revealHeroContent() {
    if (preloader) {
      preloader.classList.add('is-hidden');
    }
    document.body.classList.remove('is-loading');

    // Entrada ritmada e escalonada das letras de "THALITA"
    charElements.forEach((char, index) => {
      char.style.transitionDelay = `${index * 60 + 100}ms`;
      char.style.transform = 'translateY(0%)';
    });
  }

  // --------------------------------------------------------------------------
  // 3. CURSOR PERSONALIZADO & INTERAÇÃO COM ELEMENTOS
  // --------------------------------------------------------------------------
  const cursor = document.getElementById('custom-cursor');

  function initCustomCursor() {
    if (isTouchDevice || !cursor) return;

    window.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
    });

    // Detectar hover em elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, [data-magnetic], .tech-pill, .char');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
    });

    function renderCursor() {
      // Física suave do anel seguidor (LERP)
      state.ringX += (state.mouseX - state.ringX) * 0.18;
      state.ringY += (state.mouseY - state.ringY) * 0.18;

      cursor.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0)`;

      requestAnimationFrame(renderCursor);
    }

    renderCursor();
  }

  // --------------------------------------------------------------------------
  // 4. MICRO-INTERAÇÃO MAGNÉTICA NOS BOTÕES
  // --------------------------------------------------------------------------
  function initMagneticElements() {
    if (isTouchDevice || prefersReducedMotion) return;

    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. PARALLAX DA CAMADA GHOST & METADADOS
  // --------------------------------------------------------------------------
  function initParallax() {
    if (prefersReducedMotion || isTouchDevice) return;

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      state.targetMouseX = normX;
      state.targetMouseY = normY;

      if (ghostTitle) {
        ghostTitle.style.transform = `translate3d(${normX * 25}px, ${normY * 15}px, 0)`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. OBJETO 3D TRIDIMENSIONAL INTERATIVO (THREE.JS WEBGL)
  // --------------------------------------------------------------------------
  function initThreeScene() {
    const canvas = document.getElementById('webgl-canvas');
    const container = document.getElementById('webgl-container');
    const fpsDisplay = document.getElementById('fps-display');

    if (!canvas || typeof THREE === 'undefined') {
      if (fpsDisplay) fpsDisplay.textContent = 'RENDER: CANVAS 2D // STANDBY';
      return;
    }

    // Cenário, Câmera e Renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = window.innerWidth < 768 ? 7.5 : 5.8;
    camera.position.x = window.innerWidth < 768 ? 0 : -0.85;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Grupo de Objetos para Rotação Coordenada
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // Geometria Central: Escultura Crystalline / Cyber Icosaedro Esculpido
    const coreGeometry = new THREE.IcosahedronGeometry(1.85, 24);
    
    // Material Físico Avançado com Acabamento Metálico e Iluminação Violeta
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1A122B,
      emissive: 0x120924,
      roughness: 0.12,
      metalness: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      flatShading: false
    });

    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sceneGroup.add(coreMesh);

    // Anel Orbital Wireframe para estética de precisão tecnológica
    const wireframeGeometry = new THREE.IcosahedronGeometry(2.1, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    sceneGroup.add(wireframeMesh);

    // Enxame de Partículas Luminosas Orbitais
    const particleCount = window.innerWidth < 768 ? 120 : 260;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xB58CFF,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    sceneGroup.add(particleSystem);

    // Iluminação Tri-Point com Assinatura Cromática Roxa
    const ambientLight = new THREE.AmbientLight(0x281944, 1.2);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x8B5CF6, 4.0, 20);
    light1.position.set(4, 3, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xB58CFF, 3.2, 20);
    light2.position.set(-4, -3, 3);
    scene.add(light2);

    const rimLight = new THREE.DirectionalLight(0xF5F0FF, 1.0);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Variáveis de Animação e Interatividade
    let currentRotationX = 0;
    let currentRotationY = 0;

    // Medição real de FPS
    let lastFpsUpdate = performance.now();
    let framesThisSecond = 0;

    function animateThree(timestamp) {
      requestAnimationFrame(animateThree);

      // Otimização: se o usuário rolou além da seção inicial, pausa renderização para poupar recursos
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > window.innerHeight * 1.1) {
        return;
      }

      framesThisSecond++;
      if (timestamp - lastFpsUpdate >= 1000) {
        state.fps = framesThisSecond;
        framesThisSecond = 0;
        lastFpsUpdate = timestamp;
        if (fpsDisplay) {
          fpsDisplay.textContent = `WEBGL ATIVO // ${state.fps} FPS`;
        }
      }

      if (!prefersReducedMotion) {
        // Rotação ociosa orgânica
        const time = timestamp * 0.001;
        coreMesh.rotation.y = time * 0.15;
        wireframeMesh.rotation.y = -time * 0.08;
        wireframeMesh.rotation.x = time * 0.05;
        particleSystem.rotation.y = time * 0.04;

        // Pulsação sutil de escala
        const pulse = 1 + Math.sin(time * 1.5) * 0.025;
        coreMesh.scale.set(pulse, pulse, pulse);

        // Interação física com a posição do cursor (LERP suave)
        const targetX = state.targetMouseY * 0.6;
        const targetY = state.targetMouseX * 0.8;

        currentRotationX += (targetX - currentRotationX) * 0.05;
        currentRotationY += (targetY - currentRotationY) * 0.05;

        sceneGroup.rotation.x = currentRotationX;
        sceneGroup.rotation.y = currentRotationY;
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animateThree);

    // Suavização do elemento 3D durante a rolagem para nunca sobrepor texto
    function handleScrollFade() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = window.innerHeight || 800;
      const fadeThreshold = heroHeight * 0.65;

      if (!container) return;

      if (scrollY <= 0) {
        container.style.opacity = '0.9';
        container.style.visibility = 'visible';
      } else if (scrollY >= fadeThreshold) {
        container.style.opacity = '0';
        container.style.visibility = 'hidden';
      } else {
        const factor = Math.max(0, 1 - (scrollY / fadeThreshold));
        container.style.opacity = (factor * 0.9).toFixed(3);
        container.style.visibility = 'visible';
      }
    }

    window.addEventListener('scroll', handleScrollFade, { passive: true });
    handleScrollFade();

    // Ajuste dinâmico de redimensionamento de tela
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = window.innerWidth < 768 ? 7.5 : 5.8;
      camera.position.x = window.innerWidth < 768 ? 0 : -0.85;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // --------------------------------------------------------------------------
  // 7. MENU MOBILE RESPONSIVO
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggle || !navMenu) return;

    toggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. INICIALIZAÇÃO GERAL
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    initOpeningSequence();
    initCustomCursor();
    initMagneticElements();
    initParallax();
    initThreeScene();
    initMobileMenu();
  });

})();
