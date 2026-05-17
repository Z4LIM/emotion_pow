const ComicInteraction = {
  activeDialogues: [],
  onomatopoeiaPool: {
    positive: ['BAM!', 'WOW!', 'YAY!', 'ZING!', 'POP!'],
    negative: ['SIGH...', 'UGH!', 'OH NO!', 'EEP!', 'WILT...'],
    neutral: ['HMM...', 'SO...', 'WELL...', 'OK!', 'AH...'],
    action: ['SWOOSH!', 'ZAP!', 'WHOOSH!', 'CLICK!', 'BOING!']
  },

  createDialogueBubble(options) {
    const { speaker, text, position = 'left', mood = 'neutral' } = options;
    const bubble = document.createElement('div');
    bubble.className = `comic-dialogue-bubble dialogue-${position} dialogue-mood-${mood}`;
    bubble.innerHTML = `
      <span class="dialogue-speaker">${speaker}</span>
      <p class="text-body">${text}</p>
    `;
    return bubble;
  },

  showOnomatopoeia(text, x, y, options = {}) {
    const { size = 'normal', color, rotation = 0, duration = 1500 } = options;
    const el = document.createElement('div');
    el.className = `comic-onomatopoeia onomatopoeia-${size}`;
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = `rotate(${rotation}deg)`;
    if (color) el.style.color = color;

    document.body.appendChild(el);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: el,
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0],
        duration,
        easing: 'easeOutBack',
        complete: () => el.remove()
      });
    } else {
      setTimeout(() => el.remove(), duration);
    }
  },

  triggerOnomatopoeia(mood, x, y) {
    const pool = this.onomatopoeiaPool[mood] || this.onomatopoeiaPool.neutral;
    const text = pool[Math.floor(Math.random() * pool.length)];
    const rotation = (Math.random() - 0.5) * 30;
    this.showOnomatopoeia(text, x, y, { rotation });
  },

  createParticleBurst(x, y, options = {}) {
    const { count = 12, color = artEngine.getEmotionColorRaw(0.3), spread = 100 } = options;
    if (!AnimationEngine.shouldAnimate()) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'comic-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.backgroundColor = color;
      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / count;
      const distance = spread * (0.5 + Math.random() * 0.5);

      anime({
        targets: particle,
        translateX: Math.cos(angle) * distance,
        translateY: Math.sin(angle) * distance,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 600 + Math.random() * 400,
        easing: 'easeOutCubic',
        complete: () => particle.remove()
      });
    }
  },

  createSceneTransition(container, type = 'dissolve') {
    if (!AnimationEngine.shouldAnimate()) return Promise.resolve();

    return new Promise((resolve) => {
      switch (type) {
        case 'dissolve':
          anime({
            targets: container,
            opacity: [1, 0, 1],
            duration: 800,
            easing: 'easeInOutQuad',
            complete: resolve
          });
          break;

        case 'page-flip':
          anime({
            targets: container,
            perspective: 1000,
            rotateY: [0, -90, 0],
            duration: 800,
            easing: 'easeInOutQuad',
            complete: resolve
          });
          break;

        case 'panel-expand':
          anime({
            targets: container,
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1],
            duration: 600,
            easing: 'easeInOutQuad',
            complete: resolve
          });
          break;

        default:
          resolve();
      }
    });
  },

  createParallaxEffect(container, intensity = 0.02) {
    if (!AnimationEngine.shouldAnimate() || ResponsiveConfig.isMobile()) return;

    const handler = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = (e.clientX - centerX) * intensity;
      const moveY = (e.clientY - centerY) * intensity;

      const layers = container.querySelectorAll('[data-parallax]');
      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.parallax) || 1;
        anime({
          targets: layer,
          translateX: moveX * depth,
          translateY: moveY * depth,
          duration: 500,
          easing: 'easeOutQuad'
        });
      });
    };

    container.addEventListener('mousemove', handler);
    return () => container.removeEventListener('mousemove', handler);
  },

  createPerspectiveTilt(element, maxTilt = 5) {
    if (!AnimationEngine.shouldAnimate() || ResponsiveConfig.isMobile()) return;

    const handler = (e) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      anime({
        targets: element,
        rotateX: -y * maxTilt,
        rotateY: x * maxTilt,
        duration: 400,
        easing: 'easeOutQuad'
      });
    };

    const resetHandler = () => {
      anime({
        targets: element,
        rotateX: 0,
        rotateY: 0,
        duration: 600,
        easing: 'easeOutQuad'
      });
    };

    element.addEventListener('mousemove', handler);
    element.addEventListener('mouseleave', resetHandler);

    return () => {
      element.removeEventListener('mousemove', handler);
      element.removeEventListener('mouseleave', resetHandler);
    };
  },

  createAmbientParticles(container, options = {}) {
    const { count = 20, color = 'var(--color-text-tertiary)', speed = 1 } = options;
    if (!AnimationEngine.shouldAnimate()) return null;

    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'ambient-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.backgroundColor = color;
      p.style.opacity = 0.1 + Math.random() * 0.2;
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);

      const anim = anime({
        targets: p,
        translateY: [container.offsetHeight, -20],
        translateX: () => anime.random(-30, 30),
        duration: (5000 + Math.random() * 10000) / speed,
        easing: 'linear',
        loop: true,
        delay: Math.random() * 5000
      });

      particles.push({ element: p, animation: anim });
    }

    return () => {
      particles.forEach(p => {
        p.animation.pause();
        p.element.remove();
      });
    };
  },

  typewriterEffect(element, text, options = {}) {
    const { speed = 50, delay = 0 } = options;
    if (!AnimationEngine.shouldAnimate()) {
      element.textContent = text;
      return;
    }

    element.textContent = '';
    let i = 0;

    setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text[i];
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);
    }, delay);
  }
};
