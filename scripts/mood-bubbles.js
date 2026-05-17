const MoodBubbles = {
  _selected: [],
  _onSelectCallback: null,
  _bubbleCount: { min: 8, max: 12 },
  _adjacentCount: { min: 2, max: 3 },

  _EMOJI_MAP: {
    enthusiastic: '🔥',
    relieved: '😮‍💨',
    joyful: '😄',
    grateful: '🙏',
    peaceful: '😌',
    hopeful: '🌟',
    proud: '💪',
    amused: '😊',
    inspired: '💡',
    confident: '😎',
    neutral: '😐',
    contemplative: '🤔',
    indifferent: '😶',
    bored: '😴',
    anxious: '😰',
    sad: '😢',
    angry: '😠',
    frustrated: '😤',
    lonely: '🥺',
    overwhelmed: '😵',
    guilty: '😔',
    embarrassed: '😳'
  },

  _RHYTHM_MAP: {
    anxious: '杏仁核在拉警报，心跳加速手心汗',
    sad: '五羟色胺在低谷，允许悲伤是修复',
    angry: '六秒暂停是良药，冲动决定多后悔',
    joyful: '多巴胺回路亮起来，品味此刻莫等待',
    peaceful: '迷走神经慢呼吸，腹侧vagus护平安',
    stressed: '皮质醇短促帮聚焦，长留身体伤不了',
    lonely: '镜像神经元在等待，连接是最好的药',
    fearful: '杏仁核闪速预警，前额叶慢半拍到',
    frustrated: '前扣带回在冲突，认知失调需调和',
    guilty: '内侧前额叶自责，过度反刍伤自己',
    hopeful: '多巴胺预期奖励，希望本身就是药',
    proud: '自我奖赏回路亮，适度骄傲也健康',
    embarrassed: '社交痛共享回路，脸红也是连接信号',
    overwhelmed: '认知负荷超上限，拆解任务是出路',
    bored: '默认模式网络闲，创意就在走神间',
    grateful: '感恩激活奖赏路，幸福回路越用越粗',
    inspired: '默认网络连创意，灵光一闪有道理',
    confident: '自我效能感满满，前额叶指挥若定',
    enthusiastic: '去甲肾上腺素涌，激情燃烧有方向',
    relieved: '副交感神经接管，安全信号终于来',
    contemplative: '默认模式在漫游，自我反思是成长',
    indifferent: '情绪基线平平过，中性也有中性福',
    amused: '内啡肽小剂量，微笑也是调节方'
  },

  _filterByValence(valence) {
    if (valence > 0.3) {
      const primary = EMOTION_LABELS.filter(e => e.defaultValence > 0.2);
      const adjacent = EMOTION_LABELS.filter(e => e.defaultValence >= -0.1 && e.defaultValence <= 0.2);
      return { primary, adjacent };
    }
    if (valence < -0.3) {
      const primary = EMOTION_LABELS.filter(e => e.defaultValence < -0.2);
      const adjacent = EMOTION_LABELS.filter(e => e.defaultValence >= -0.2 && e.defaultValence <= 0.1);
      return { primary, adjacent };
    }
    const primary = EMOTION_LABELS.filter(e => e.defaultValence >= -0.2 && e.defaultValence <= 0.2);
    const adjacent = EMOTION_LABELS.filter(e => e.defaultValence < -0.2 || e.defaultValence > 0.2);
    return { primary, adjacent };
  },

  _pickRandom(arr, count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  _generateBubbles(valence) {
    const { primary, adjacent } = this._filterByValence(valence);
    const totalTarget = this._bubbleCount.min + Math.floor(Math.random() * (this._bubbleCount.max - this._bubbleCount.min + 1));
    const adjCount = this._adjacentCount.min + Math.floor(Math.random() * (this._adjacentCount.max - this._adjacentCount.min + 1));
    const primaryCount = totalTarget - adjCount;

    const primaryPicked = this._pickRandom(primary, primaryCount);
    const adjacentPicked = this._pickRandom(adjacent, adjCount);

    const bubbles = [...primaryPicked, ...adjacentPicked]
      .sort(() => Math.random() - 0.5)
      .map(emotion => ({
        ...emotion,
        emoji: this._EMOJI_MAP[emotion.id] || '💭',
        x: 8 + Math.random() * 75,
        y: 5 + Math.random() * 65,
        delay: (Math.random() * 2.5).toFixed(2)
      }));

    return bubbles;
  },

  render(valence, arousal) {
    this._selected = [];
    const bubbles = this._generateBubbles(valence);

    const bubbleHtml = bubbles.map(b => {
      const colorVar = artEngine.getEmotionColor(b.defaultValence);
      return `
        <div class="mood-bubble"
             data-id="${b.id}"
             data-valence="${b.defaultValence}"
             data-rhythm="${this._RHYTHM_MAP[b.id] || ''}"
             style="left:${b.x}%;top:${b.y}%;animation-delay:${b.delay}s;--bubble-color:${colorVar}">
          <span class="mood-bubble-emoji">${b.emoji}</span>
          <span class="mood-bubble-text">${b.label}</span>
          <span class="mood-bubble-rhythm">${this._RHYTHM_MAP[b.id] || ''}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="mood-bubbles-container">
        ${bubbleHtml}
        <div class="bubbles-progress">
          <div class="bubbles-progress-fill" style="width:0%"></div>
          <span class="bubbles-progress-text">已选择 0 个情绪</span>
        </div>
      </div>
    `;
  },

  mount() {
    const container = document.querySelector('.mood-bubbles-container');
    if (!container) return;

    const bubbles = container.querySelectorAll('.mood-bubble');
    bubbles.forEach(bubble => {
      bubble.addEventListener('click', (e) => this._handleBubbleClick(e, bubble));
    });

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: '.mood-bubble',
        scale: [0, 1],
        opacity: [0, 1],
        duration: AnimationEngine.getDuration(500),
        delay: anime.stagger(80),
        easing: AnimationEngine.config.easing
      });
    } else {
      bubbles.forEach(b => { b.style.opacity = 1; b.style.transform = 'none'; });
    }
  },

  _handleBubbleClick(e, bubble) {
    const id = bubble.dataset.id;
    const label = EMOTION_LABELS.find(em => em.id === id);
    if (!label) return;

    const idx = this._selected.indexOf(label.label);
    if (idx === -1) {
      this._selected.push(label.label);
      bubble.classList.add('selected');
    } else {
      this._selected.splice(idx, 1);
      bubble.classList.remove('selected');
    }

    this._popAnimation(bubble);
    this._particleBurst(e.clientX, e.clientY, bubble.dataset.valence);
    this._updateProgress();

    if (this._onSelectCallback) {
      this._onSelectCallback([...this._selected]);
    }
  },

  _popAnimation(bubble) {
    if (!AnimationEngine.shouldAnimate()) return;
    anime({
      targets: bubble,
      scale: [1, 1.25, 1],
      duration: 350,
      easing: 'easeOutElastic(1, .6)'
    });
  },

  _particleBurst(x, y, valence) {
    if (!AnimationEngine.shouldAnimate()) return;
    const color = artEngine.getEmotionColorRaw(parseFloat(valence) || 0);
    const count = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'mood-bubble-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.backgroundColor = color;
      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 40;

      anime({
        targets: particle,
        translateX: Math.cos(angle) * distance,
        translateY: Math.sin(angle) * distance,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 500 + Math.random() * 300,
        easing: 'easeOutCubic',
        complete: () => particle.remove()
      });
    }
  },

  _updateProgress() {
    const fill = document.querySelector('.bubbles-progress-fill');
    const text = document.querySelector('.bubbles-progress-text');
    if (!fill || !text) return;

    const total = document.querySelectorAll('.mood-bubble').length;
    const pct = total > 0 ? (this._selected.length / total) * 100 : 0;
    fill.style.width = pct + '%';
    text.textContent = `已选择 ${this._selected.length} 个情绪`;

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: fill,
        duration: 300,
        easing: 'easeOutCubic'
      });
    }
  },

  getSelected() {
    return [...this._selected];
  },

  onSelect(callback) {
    this._onSelectCallback = callback;
  }
};
