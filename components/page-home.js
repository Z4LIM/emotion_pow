const PageHome = {
  render() {
    const recentMoods = moodManager.getMoods().slice(0, 3);
    const todayMood = this.getTodayMood();

    return `
      <div class="page-home">
        <section class="hero-section comic-panel comic-panel-1">
          <div class="hero-content">
            <div class="hero-badge comic-onomatopoeia">POW!</div>
            <h1 class="text-h1 hero-title">探索你的<br><span class="hero-highlight">情绪宇宙</span></h1>
            <p class="text-body-lg hero-subtitle">用漫画的方式理解你的内心世界</p>
            <div class="hero-actions">
              <a href="#/record" class="comic-btn comic-btn-primary hero-cta" data-gesture>
                开始记录 ✏️
              </a>
              <a href="#/knowledge" class="comic-btn hero-secondary" data-gesture>
                了解更多 📖
              </a>
            </div>
          </div>
          <div class="hero-visual character-placeholder">
            <div class="hero-illustration">
              <div class="mood-orb" data-valence="${todayMood}">
                <div class="mood-orb-inner"></div>
                <div class="mood-orb-ring"></div>
              </div>
              <div class="floating-emotions">
                <span class="float-emotion" style="--delay: 0s; --x: 20%;">😊</span>
                <span class="float-emotion" style="--delay: 1s; --x: 50%;">🤔</span>
                <span class="float-emotion" style="--delay: 2s; --x: 80%;">😌</span>
              </div>
            </div>
          </div>
        </section>

        <section class="features-section comic-grid">
          <div class="comic-card feature-card" data-gesture style="grid-column: 1 / 5;">
            <div class="feature-icon">📚</div>
            <h3 class="text-h4">情绪科学</h3>
            <p class="text-body-sm">了解情绪的心理学原理，认识效价模型与情绪调节策略</p>
            <a href="#/knowledge" class="comic-tag">探索知识</a>
          </div>
          <div class="comic-card feature-card" data-gesture style="grid-column: 5 / 9;">
            <div class="feature-icon">✏️</div>
            <h3 class="text-h4">心情记录</h3>
            <p class="text-body-sm">用漫画式交互记录你的情绪状态，追踪心情变化趋势</p>
            <a href="#/record" class="comic-tag">开始记录</a>
          </div>
          <div class="comic-card feature-card" data-gesture style="grid-column: 9 / 13;">
            <div class="feature-icon">📊</div>
            <h3 class="text-h4">情绪洞察</h3>
            <p class="text-body-sm">可视化你的情绪数据，发现隐藏的情绪模式与规律</p>
            <a href="#/insights" class="comic-tag">查看洞察</a>
          </div>
        </section>

        ${recentMoods.length > 0 ? `
          <section class="recent-section">
            <h2 class="text-h3 section-title">最近的心情</h2>
            <div class="recent-moods">
              ${recentMoods.map(m => `
                <div class="comic-card recent-mood-card" data-gesture>
                  <div class="recent-mood-emoji">${this.getValenceEmoji(m.valence)}</div>
                  <div class="recent-mood-info">
                    <span class="text-body-sm recent-mood-label">${m.label || '未标记'}</span>
                    <span class="text-caption recent-mood-time">${this.formatTime(m.timestamp)}</span>
                  </div>
                  <div class="recent-mood-valence" style="background-color: ${artEngine.getEmotionColor(m.valence)}"></div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="gesture-guide-section comic-panel">
          <h2 class="text-h3 section-title">交互方式</h2>
          <div class="gesture-guide-grid">
            <div class="gesture-guide-item">
              <div class="gesture-guide-icon">🖱️</div>
              <h4 class="text-h4">鼠标交互</h4>
              <p class="text-body-sm">悬浮查看效果，点击触发操作</p>
            </div>
            <div class="gesture-guide-item">
              <div class="gesture-guide-icon">📱</div>
              <h4 class="text-h4">触屏交互</h4>
              <p class="text-body-sm">轻触点击，滑动切换页面</p>
            </div>
            <div class="gesture-guide-item">
              <div class="gesture-guide-icon">🖐️</div>
              <h4 class="text-h4">隔空手势</h4>
              <p class="text-body-sm">点击导航栏手势按钮开启摄像头手势识别</p>
            </div>
          </div>
        </section>

        <section class="home-disclaimer comic-card">
          <h3 class="text-h4">⚠️ 声明</h3>
          <p class="text-body-sm">本网站为概念演示项目，旨在以交互式方式展示心情记录的设计理念，并作为心理知识的传播工具。本网站不收集任何个人数据，所有数据仅存储在本地浏览器中。本网站不是医疗工具，如有心理健康问题请咨询专业人士。</p>
          <div class="disclaimer-security">
            <div class="disclaimer-item">
              <span class="disclaimer-icon">🔒</span>
              <span class="text-body-sm">数据本地化存储</span>
            </div>
            <div class="disclaimer-item">
              <span class="disclaimer-icon">🛡️</span>
              <span class="text-body-sm">内容安全策略保护</span>
            </div>
            <div class="disclaimer-item">
              <span class="disclaimer-icon">🔐</span>
              <span class="text-body-sm">输入验证与清理</span>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  mount() {
    this.startOrbAnimation();
    const container = document.querySelector('.page-home');
    if (container) {
      KnowledgeTip.createArtBackground(container);
      KnowledgeTip.createFloatingNotes(container);
    }
  },

  unmount() {
    if (this._orbAnim) this._orbAnim.pause();
    KnowledgeTip.destroyArtBackground();
    KnowledgeTip.destroyFloatingNotes();
  },

  getTodayMood() {
    const today = new Date();
    const moods = moodManager.getMoodsByDateRange(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime(),
      Date.now()
    );
    if (moods.length === 0) return 0;
    return moods.reduce((sum, m) => sum + m.valence, 0) / moods.length;
  },

  getValenceEmoji(valence) {
    if (valence >= 0.6) return '😄';
    if (valence >= 0.2) return '🙂';
    if (valence >= -0.2) return '😐';
    if (valence >= -0.6) return '😔';
    return '😢';
  },

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  startOrbAnimation() {
    const orb = document.querySelector('.mood-orb');
    if (!orb || !AnimationEngine.shouldAnimate()) return;

    this._orbAnim = anime({
      targets: orb.querySelector('.mood-orb-inner'),
      scale: [1, 1.1, 1],
      duration: 3000,
      easing: 'easeInOutSine',
      loop: true
    });

    anime({
      targets: orb.querySelector('.mood-orb-ring'),
      rotate: '1turn',
      duration: 8000,
      easing: 'linear',
      loop: true
    });
  }
};
