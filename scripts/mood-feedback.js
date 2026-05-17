const MoodFeedback = {
  particleBurst(x, y, color, count) {
    if (!AnimationEngine.shouldAnimate()) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'mood-feedback-particle';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.backgroundColor = color;
      document.body.appendChild(p);
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 40 + Math.random() * 60;
      anime({
        targets: p,
        translateX: Math.cos(angle) * dist,
        translateY: Math.sin(angle) * dist,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 600 + Math.random() * 300,
        easing: 'easeOutCubic',
        complete: () => p.remove()
      });
    }
  },

  celebrationBurst() {
    if (!AnimationEngine.shouldAnimate()) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const palette = [
      artEngine.getEmotionColorRaw(1),
      artEngine.getEmotionColorRaw(0.5),
      artEngine.getEmotionColorRaw(0),
      artEngine.getEmotionColorRaw(-0.5),
      artEngine.getEmotionColorRaw(-1)
    ];
    const count = 30 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'mood-feedback-particle';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.backgroundColor = palette[i % palette.length];
      document.body.appendChild(p);
      const angle = (Math.PI * 2 * i) / count;
      const dist = 80 + Math.random() * 120;
      anime({
        targets: p,
        translateX: Math.cos(angle) * dist,
        translateY: Math.sin(angle) * dist,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 800 + Math.random() * 400,
        delay: i * 20,
        easing: 'easeOutCubic',
        complete: () => p.remove()
      });
    }
  },

  transitionStep(fromEl, toEl, direction) {
    if (!AnimationEngine.shouldAnimate()) {
      if (fromEl) fromEl.style.display = 'none';
      if (toEl) toEl.style.display = '';
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const slideOutX = direction === 'next' ? -60 : 60;
      const slideInX = direction === 'next' ? 60 : -60;
      if (fromEl) {
        anime({
          targets: fromEl,
          opacity: [1, 0],
          translateX: [0, slideOutX],
          duration: 150,
          easing: 'easeInQuad',
          complete: () => {
            fromEl.style.display = 'none';
          }
        });
      }
      if (toEl) {
        toEl.style.display = '';
        anime({
          targets: toEl,
          opacity: [0, 1],
          translateX: [slideInX, 0],
          duration: 150,
          delay: 150,
          easing: 'easeOutQuad',
          complete: resolve
        });
      } else {
        setTimeout(resolve, 300);
      }
    });
  },

  saveCelebration(containerEl) {
    if (!AnimationEngine.shouldAnimate()) {
      this._showSaveText(containerEl);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const children = Array.from(containerEl.children);
      children.forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        this.particleBurst(cx, cy, artEngine.getEmotionColorRaw(Math.random() * 2 - 1), 5);
        anime({
          targets: child,
          scale: [1, 0],
          opacity: [1, 0],
          duration: 400,
          delay: i * 50,
          easing: 'easeInBack',
          complete: () => child.remove()
        });
      });
      setTimeout(() => {
        this._showSaveText(containerEl);
        resolve();
      }, children.length * 50 + 400);
    });
  },

  _showSaveText(containerEl) {
    const text = document.createElement('div');
    text.className = 'mood-feedback-celebration';
    text.textContent = '✨ 记录完成！';
    containerEl.appendChild(text);
    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: text,
        scale: [0.5, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutBack'
      });
    }
  },

  setBackgroundEmotion(valence) {
    const color = artEngine.getEmotionColorRaw(valence);
    document.body.style.transition = AnimationEngine.shouldAnimate() ? 'background-color 0.5s ease' : 'none';
    document.body.style.backgroundColor = color + '1F';
  },

  resetBackground() {
    document.body.style.transition = AnimationEngine.shouldAnimate() ? 'background-color 0.5s ease' : 'none';
    document.body.style.backgroundColor = '';
  }
};
