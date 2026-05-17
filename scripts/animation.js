const AnimationEngine = {
  config: {
    duration: { fast: 300, normal: 500, slow: 700 },
    easing: 'easeInOutQuad',
    stagger: { fast: 50, normal: 100, slow: 200, dramatic: 300 }
  },

  shouldAnimate() {
    return !ResponsiveConfig.prefersReducedMotion();
  },

  getDuration(defaultMs) {
    return this.shouldAnimate() ? defaultMs : 0;
  },

  hoverEffect(element) {
    if (!this.shouldAnimate()) return;
    if (element.closest('.comic-modal, .knowledge-modal-content, .module-panels')) return;
    anime({
      targets: element,
      scale: 1.05,
      translateY: -4,
      duration: this.getDuration(500),
      easing: this.config.easing
    });
  },

  hoverOut(element) {
    if (!this.shouldAnimate()) return;
    anime({
      targets: element,
      scale: 1,
      translateY: 0,
      duration: this.getDuration(500),
      easing: this.config.easing
    });
  },

  clickBounce(element) {
    if (!this.shouldAnimate()) return;
    anime({
      targets: element,
      scale: [0.95, 1.02, 1],
      duration: this.getDuration(500),
      easing: this.config.easing
    });
  },

  fadeIn(element, delay = 0) {
    if (!this.shouldAnimate()) {
      element.style.opacity = 1;
      return;
    }
    anime({
      targets: element,
      opacity: [0, 1],
      duration: this.getDuration(500),
      delay,
      easing: this.config.easing
    });
  },

  slideUp(element, delay = 0) {
    if (!this.shouldAnimate()) {
      element.style.opacity = 1;
      element.style.transform = 'none';
      return;
    }
    anime({
      targets: element,
      translateY: [30, 0],
      opacity: [0, 1],
      duration: this.getDuration(600),
      delay,
      easing: this.config.easing
    });
  },

  scaleIn(element, delay = 0) {
    if (!this.shouldAnimate()) {
      element.style.opacity = 1;
      element.style.transform = 'none';
      return;
    }
    anime({
      targets: element,
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: this.getDuration(500),
      delay,
      easing: this.config.easing
    });
  },

  pageTransition(fromPage, toPage) {
    if (!this.shouldAnimate()) {
      fromPage.style.display = 'none';
      toPage.style.display = 'block';
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      anime({
        targets: fromPage,
        opacity: [1, 0],
        translateX: [0, -30],
        duration: this.getDuration(400),
        easing: this.config.easing,
        complete: () => {
          fromPage.style.display = 'none';
          toPage.style.display = 'block';
          anime({
            targets: toPage,
            opacity: [0, 1],
            translateX: [30, 0],
            duration: this.getDuration(500),
            easing: this.config.easing,
            complete: resolve
          });
        }
      });
    });
  },

  comicPanelReveal(panel) {
    if (!this.shouldAnimate()) {
      panel.style.opacity = 1;
      panel.style.transform = 'none';
      return;
    }
    anime({
      targets: panel,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: this.getDuration(600),
      easing: this.config.easing
    });
  },

  characterEnter(character) {
    if (!this.shouldAnimate()) {
      character.style.opacity = 1;
      character.style.transform = 'none';
      return;
    }
    anime({
      targets: character,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: this.getDuration(800),
      easing: this.config.easing
    });
  },

  dialogueBubbleAppear(bubble) {
    if (!this.shouldAnimate()) {
      bubble.style.opacity = 1;
      bubble.style.transform = 'none';
      return;
    }
    anime({
      targets: bubble,
      scale: [0.5, 1.1, 1],
      opacity: [0, 1],
      duration: this.getDuration(500),
      easing: this.config.easing
    });
  },

  successCelebration(container) {
    if (!this.shouldAnimate()) return;
    anime({
      targets: container,
      scale: [1, 1.02, 1],
      duration: 400,
      easing: this.config.easing
    });
  },

  staggerReveal(elements, staggerDelay = 100) {
    if (!this.shouldAnimate()) {
      elements.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    anime({
      targets: elements,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: this.getDuration(500),
      delay: anime.stagger(staggerDelay),
      easing: this.config.easing
    });
  },

  shakeEffect(element) {
    if (!this.shouldAnimate()) return;
    anime({
      targets: element,
      translateX: [0, -10, 10, -10, 10, 0],
      duration: 400,
      easing: this.config.easing
    });
  },

  createTimeline() {
    return anime.timeline({
      easing: this.config.easing,
      autoplay: false
    });
  },

  rippleEffect(element, x, y) {
    if (!this.shouldAnimate() || !element) return;
    const ripple = document.createElement('div');
    ripple.className = 'anim-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    element.style.position = element.style.position || 'relative';
    element.appendChild(ripple);
    anime({
      targets: ripple,
      scale: [0, 3],
      opacity: [0.6, 0],
      duration: 600,
      easing: 'easeOutQuad',
      complete: () => ripple.remove()
    });
  },

  bubbleExplode(element) {
    if (!this.shouldAnimate() || !element) return;
    anime({
      targets: element,
      scale: [1, 1.3, 0],
      opacity: [1, 1, 0],
      duration: 400,
      easing: 'easeOutBack'
    });
  },

  timelineSnap(element) {
    if (!this.shouldAnimate() || !element) return;
    anime({
      targets: element,
      scale: [1, 1.2, 1],
      duration: 300,
      easing: 'easeOutElastic(1, .5)'
    });
  },

  celebrationBurst(container) {
    if (!this.shouldAnimate() || !container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'anim-particle';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.backgroundColor = artEngine.getEmotionColorRaw(Math.random() * 2 - 1);
      container.style.position = container.style.position || 'relative';
      container.appendChild(p);
      const angle = (Math.PI * 2 * i) / 20;
      const dist = 60 + Math.random() * 80;
      anime({
        targets: p,
        translateX: Math.cos(angle) * dist,
        translateY: Math.sin(angle) * dist,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 800,
        delay: i * 30,
        easing: 'easeOutCubic',
        complete: () => p.remove()
      });
    }
  }
};
