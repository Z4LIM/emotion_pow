const MoodWheel = {
  _valence: 0,
  _arousal: 0,
  _selectCallback: null,

  EMOJI_MAP: [
    { minV: 0.3, minA: 0.3, emoji: '🤩', label: '兴奋而积极' },
    { minV: 0.3, minA: -Infinity, emoji: '😌', label: '平静而积极' },
    { minV: -0.3, minA: 0.3, emoji: '😳', label: '紧张而中性' },
    { minV: -0.3, minA: -Infinity, emoji: '😐', label: '平静而中性' },
    { minV: -Infinity, minA: 0.3, emoji: '😰', label: '焦虑而消极' },
    { minV: -Infinity, minA: -Infinity, emoji: '😔', label: '低落而消极' }
  ],

  SIZE: 280,

  render() {
    return `
      <div class="mood-wheel-container">
        <div class="mood-wheel" id="mood-wheel" role="slider"
             aria-label="情绪色盘" aria-valuetext="效价与唤醒度选择器">
          <div class="mood-wheel-center" id="mood-wheel-center">
            <span class="mood-wheel-emoji" id="mood-wheel-emoji">😐</span>
            <span class="mood-wheel-desc" id="mood-wheel-desc">你的大脑正在定位...</span>
            <span class="mood-wheel-psych" id="mood-wheel-psych"></span>
          </div>
          <span class="mood-wheel-axis-label mood-wheel-axis-top">兴奋</span>
          <span class="mood-wheel-axis-label mood-wheel-axis-bottom">平静</span>
          <span class="mood-wheel-axis-label mood-wheel-axis-left">消极</span>
          <span class="mood-wheel-axis-label mood-wheel-axis-right">积极</span>
        </div>
      </div>
    `;
  },

  mount() {
    const wheel = document.getElementById('mood-wheel');
    if (!wheel) return;

    wheel.addEventListener('click', (e) => this._handleClick(e));
  },

  getValues() {
    return { valence: this._valence, arousal: this._arousal };
  },

  onSelect(callback) {
    this._selectCallback = callback;
  },

  _handleClick(e) {
    const wheel = document.getElementById('mood-wheel');
    if (!wheel) return;

    const rect = wheel.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dx = clickX - centerX;
    const dy = centerY - clickY;

    const radius = rect.width / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > radius) return;

    this._valence = Math.max(-1, Math.min(1, dx / radius));
    this._arousal = Math.max(-1, Math.min(1, dy / radius));

    this._showRipple(clickX, clickY, wheel);
    this._updateCenter();
    this._updateBackground();

    if (typeof this._selectCallback === 'function') {
      this._selectCallback({ valence: this._valence, arousal: this._arousal });
    }
  },

  _getEmojiData() {
    const v = this._valence;
    const a = this._arousal;

    if (v > 0.3 && a > 0.3) return { emoji: '🤩', label: '兴奋而积极', psychLabel: '多巴胺+去甲肾上腺素' };
    if (v > 0.3 && a <= 0.3) return { emoji: '😌', label: '平静而积极', psychLabel: '腹侧迷走神经激活' };
    if (v >= -0.3 && v <= 0.3 && a > 0.3) return { emoji: '😳', label: '紧张而中性', psychLabel: '交感神经轻度唤醒' };
    if (v >= -0.3 && v <= 0.3 && a <= 0.3) return { emoji: '😐', label: '平静而中性', psychLabel: '自主神经平衡态' };
    if (v < -0.3 && a > 0.3) return { emoji: '😰', label: '焦虑而消极', psychLabel: '杏仁核高频放电' };
    return { emoji: '😔', label: '低落而消极', psychLabel: '5-HT水平偏低' };
  },

  _updateCenter() {
    const emojiEl = document.getElementById('mood-wheel-emoji');
    const descEl = document.getElementById('mood-wheel-desc');
    const psychEl = document.getElementById('mood-wheel-psych');
    const centerEl = document.getElementById('mood-wheel-center');
    const data = this._getEmojiData();

    if (emojiEl) emojiEl.textContent = data.emoji;
    if (descEl) descEl.textContent = data.label;
    if (psychEl) psychEl.textContent = data.psychLabel;

    if (centerEl && AnimationEngine.shouldAnimate()) {
      anime({
        targets: centerEl,
        scale: [0.85, 1],
        duration: AnimationEngine.getDuration(400),
        easing: 'easeOutBack'
      });
    }
  },

  _updateBackground() {
    const color = artEngine.getEmotionColorRaw(this._valence);
    document.body.style.transition = `background-color 600ms var(--ease-smooth, cubic-bezier(0.4, 0, 0.2, 1))`;
    document.body.style.backgroundColor = this._hexToRgba(color, 0.15);
  },

  _showRipple(x, y, container) {
    const ripple = document.createElement('div');
    ripple.className = 'mood-wheel-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    container.appendChild(ripple);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: ripple,
        scale: [0, 2.5],
        opacity: [0.6, 0],
        duration: AnimationEngine.getDuration(600),
        easing: 'easeOutQuad',
        complete: () => ripple.remove()
      });
    } else {
      ripple.remove();
    }
  },

  _hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
};
