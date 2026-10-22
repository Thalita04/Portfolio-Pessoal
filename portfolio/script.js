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
    
    // Material Físico Avançado com Acabamento Metálico e Iluminação Rosa Cibernética
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x220D1D,
      emissive: 0x180514,
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
      color: 0xFF2A85,
      wireframe: true,
      transparent: true,
      opacity: 0.28
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
      color: 0xFF70BA,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    sceneGroup.add(particleSystem);

    // Iluminação Tri-Point com Assinatura Cromática Rosa Cibernética
    const ambientLight = new THREE.AmbientLight(0x380F29, 1.2);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xFF1493, 4.2, 20);
    light1.position.set(4, 3, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xFF69B4, 3.4, 20);
    light2.position.set(-4, -3, 3);
    scene.add(light2);

    const rimLight = new THREE.DirectionalLight(0xFFE4F0, 1.0);
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

    // Interação tátil no mobile (Touch Drag suave no hero)
    let isTouching = false;

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        isTouching = true;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        state.targetMouseX = ((touchX / window.innerWidth) - 0.5) * 2;
        state.targetMouseY = ((touchY / window.innerHeight) - 0.5) * 2;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isTouching || !e.touches || e.touches.length !== 1) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      state.targetMouseX = ((touchX / window.innerWidth) - 0.5) * 2;
      state.targetMouseY = ((touchY / window.innerHeight) - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isTouching = false;
      state.targetMouseX = 0;
      state.targetMouseY = 0;
    }, { passive: true });

    // Ajuste dinâmico de redimensionamento de tela otimizado para mobile e desktop
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    window.addEventListener('resize', () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      const widthChanged = currentWidth !== lastWidth;
      const heightDifference = Math.abs(currentHeight - lastHeight);

      // No mobile, ignora variações pequenas de altura causadas pela barra de navegação do browser
      if (!widthChanged && heightDifference < 90) {
        return;
      }

      lastWidth = currentWidth;
      lastHeight = currentHeight;

      camera.aspect = currentWidth / currentHeight;
      camera.position.z = currentWidth < 768 ? 7.5 : 5.8;
      camera.position.x = currentWidth < 768 ? 0 : -0.85;
      camera.updateProjectionMatrix();

      renderer.setSize(currentWidth, currentHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // --------------------------------------------------------------------------
  // 7. MENU MOBILE RESPONSIVO & ACESSIBILIDADE
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-contact, .mobile-drawer-github');

    if (!toggle || !navMenu) return;

    function closeMenu() {
      navMenu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    function openMenu() {
      navMenu.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Fechar ao pressionar a tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Fechar ao redimensionar de mobile para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. HEADER GLASSMORPHIC NO SCROLL (DESKTOP & MOBILE)
  // --------------------------------------------------------------------------
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    function handleScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 35) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --------------------------------------------------------------------------
  // 9. SCROLL SPY (INDICADOR DE SEÇÃO ATIVA)
  // --------------------------------------------------------------------------
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    if (!sections.length || !navLinks.length) return;

    function updateActiveLink() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollMiddle = scrollY + window.innerHeight * 0.35;

      let currentSectionId = '';

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollMiddle >= top && scrollMiddle < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (!currentSectionId && sections.length) {
        currentSectionId = sections[0].getAttribute('id');
      }

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  // --------------------------------------------------------------------------
  // 10. INICIALIZAÇÃO GERAL
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    initOpeningSequence();
    initCustomCursor();
    initMagneticElements();
    initParallax();
    initThreeScene();
    initMobileMenu();
    initHeaderScroll();
    initScrollSpy();
  });

})();
