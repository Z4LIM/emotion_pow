const PageRecord = {
  currentStep: 0,
  recordData: {
    type: 'mood',
    valence: 0,
    arousal: 0,
    label: '',
    labels: [],
    factors: [],
    factorsTimeline: [],
    journal: ''
  },
  steps: [
    { id: 'valence-wheel', caption: '定位 · 唤醒你的情绪坐标' },
    { id: 'emotion-bubbles', caption: '命名 · 叫出它的名字就驯服了一半' },
    { id: 'story-timeline', caption: '溯源 · 找到情绪的导火索' },
    { id: 'mood-journal', caption: '书写 · 前额叶最爱的表达方式' }
  ],

  render() {
    return `
      <div class="page-record">
        <section class="record-header comic-panel">
          <h1 class="text-h1">记录心情</h1>
          <div class="record-type-switch">
            <button class="type-switch-btn ${this.recordData.type === 'mood' ? 'type-switch-active' : ''}" data-type="mood">🌤️ 心情</button>
            <button class="type-switch-btn ${this.recordData.type === 'emotion' ? 'type-switch-active' : ''}" data-type="emotion">🎭 情绪</button>
          </div>
          <div class="record-progress">
            ${this.steps.map((s, i) => `
              <div class="progress-step ${i <= this.currentStep ? 'progress-step-active' : ''} ${i < this.currentStep ? 'progress-step-done' : ''}">
                <span class="progress-dot">${i < this.currentStep ? '✓' : i + 1}</span>
              </div>
              ${i < this.steps.length - 1 ? '<div class="progress-line"></div>' : ''}
            `).join('')}
          </div>
          <div class="record-step-caption" id="record-step-caption">${this.steps[this.currentStep].caption}</div>
        </section>
        <section class="record-body" id="record-body">
          ${this.renderCurrentStep()}
        </section>
        <section class="record-actions" id="record-actions">
          <button class="comic-btn" id="record-prev" ${this.currentStep === 0 ? 'style="visibility:hidden"' : ''} data-gesture>
            ← 上一步
          </button>
          <button class="comic-btn comic-btn-primary" id="record-next" data-gesture>
            ${this.currentStep === this.steps.length - 1 ? '保存记录 ✓' : '下一步 →'}
          </button>
        </section>
      </div>
    `;
  },

  renderCurrentStep() {
    switch (this.steps[this.currentStep].id) {
      case 'valence-wheel': return MoodWheel.render();
      case 'emotion-bubbles': return MoodBubbles.render(this.recordData.valence, this.recordData.arousal);
      case 'story-timeline': return MoodTimeline.render(this.recordData);
      case 'mood-journal': return MoodJournal.render();
      default: return '';
    }
  },

  mount() {
    this.bindStepEvents();
    this.bindNavEvents();
  },

  bindStepEvents() {
    document.querySelectorAll('.type-switch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.recordData.type = btn.dataset.type;
        document.querySelectorAll('.type-switch-btn').forEach(b => {
          b.classList.toggle('type-switch-active', b.dataset.type === this.recordData.type);
        });
      });
    });

    switch (this.steps[this.currentStep].id) {
      case 'valence-wheel':
        MoodWheel.mount();
        MoodWheel.onSelect(({ valence, arousal }) => {
          this.recordData.valence = valence;
          this.recordData.arousal = arousal;
        });
        break;
      case 'emotion-bubbles':
        MoodBubbles.mount();
        MoodBubbles.onSelect((labels) => {
          this.recordData.labels = labels;
          if (labels.length > 0) this.recordData.label = labels[0];
        });
        break;
      case 'story-timeline':
        MoodTimeline.mount();
        MoodTimeline.onChange((data) => {
          this.recordData.factorsTimeline = data;
          this.recordData.factors = data.map(d => d.factorId);
        });
        break;
      case 'mood-journal':
        MoodJournal.mount();
        break;
    }
  },

  bindNavEvents() {
    const prevBtn = document.getElementById('record-prev');
    const nextBtn = document.getElementById('record-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 0) this.goToStep(this.currentStep - 1, 'prev');
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentStep < this.steps.length - 1) {
          this.goToStep(this.currentStep + 1, 'next');
        } else {
          this.saveRecord();
        }
      });
    }
  },

  async goToStep(newStep, direction) {
    const body = document.getElementById('record-body');
    if (!body) return;

    this.collectStepData();

    const oldContent = body.querySelector('.record-step, .mood-wheel-container, .mood-bubbles-container, .mood-timeline-container, .mood-journal-container');

    this.currentStep = newStep;
    body.innerHTML = this.renderCurrentStep();
    this.bindStepEvents();
    this.updateNavButtons();

    if (AnimationEngine.shouldAnimate() && oldContent) {
      const newContent = body.firstElementChild;
      if (newContent) {
        anime({
          targets: newContent,
          opacity: [0, 1],
          translateX: [direction === 'next' ? 40 : -40, 0],
          duration: 350,
          easing: 'easeOutQuad'
        });
      }
    }

    if (newStep === 0) MoodFeedback.resetBackground();
  },

  collectStepData() {
    switch (this.steps[this.currentStep].id) {
      case 'valence-wheel':
        const wheelVals = MoodWheel.getValues();
        if (wheelVals) {
          this.recordData.valence = wheelVals.valence;
          this.recordData.arousal = wheelVals.arousal;
        }
        break;
      case 'emotion-bubbles':
        this.recordData.labels = MoodBubbles.getSelected();
        if (this.recordData.labels.length > 0) this.recordData.label = this.recordData.labels[0];
        break;
      case 'story-timeline':
        this.recordData.factorsTimeline = MoodTimeline.getData();
        this.recordData.factors = this.recordData.factorsTimeline.map(d => d.factorId);
        break;
      case 'mood-journal':
        this.recordData.journal = MoodJournal.getText();
        break;
    }
  },

  updateNavButtons() {
    const prevBtn = document.getElementById('record-prev');
    const nextBtn = document.getElementById('record-next');
    const captionEl = document.getElementById('record-step-caption');
    if (prevBtn) prevBtn.style.visibility = this.currentStep === 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.textContent = this.currentStep === this.steps.length - 1 ? '保存记录 ✓' : '下一步 →';
    if (captionEl) captionEl.textContent = this.steps[this.currentStep].caption;

    document.querySelectorAll('.progress-step').forEach((el, i) => {
      el.classList.toggle('progress-step-active', i <= this.currentStep);
      el.classList.toggle('progress-step-done', i < this.currentStep);
      el.querySelector('.progress-dot').textContent = i < this.currentStep ? '✓' : i + 1;
    });
  },

  saveRecord() {
    this.collectStepData();

    const record = moodManager.recordMood({
      type: this.recordData.type,
      valence: this.recordData.valence,
      arousal: this.recordData.arousal,
      label: this.recordData.label,
      labels: [...this.recordData.labels],
      factors: [...this.recordData.factors],
      factorsTimeline: [...this.recordData.factorsTimeline],
      journal: this.recordData.journal || '',
      timestamp: Date.now()
    });

    if (record) {
      this.showSaveWithGuidance();
    }
  },

  showSaveWithGuidance() {
    const body = document.getElementById('record-body');
    const actions = document.getElementById('record-actions');
    if (actions) actions.style.display = 'none';
    if (!body) return;

    const guidanceCard = GuidanceCards.getGuidance(this.recordData);

    body.innerHTML = `
      <div class="save-with-guidance">
        <div class="save-success">
          <div class="save-success-icon">✨</div>
          <h2 class="text-h2">记录成功！</h2>
          <p class="text-body">你的心情已被安全保存</p>
        </div>
        ${guidanceCard ? `
          <div class="guidance-section">
            <div class="guidance-section-label">
              <span class="guidance-label-icon">🌱</span>
              <span>为你推荐</span>
            </div>
            ${GuidanceCards.renderCard(guidanceCard)}
            <div class="guidance-actions">
              <button class="comic-btn" id="guidance-skip" data-gesture>知道了，去看洞察 →</button>
              <a href="#/knowledge" class="comic-btn comic-btn-primary" data-gesture>深入学习 📚</a>
            </div>
          </div>
        ` : `
          <p class="handwriting-note">正在跳转到洞察页面...</p>
        `}
      </div>
    `;

    MoodFeedback.saveCelebration(body);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: '.save-success',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutBack'
      });
      if (guidanceCard) {
        anime({
          targets: '.guidance-section',
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 600,
          delay: 400,
          easing: 'easeOutQuad'
        });
      }
    }

    const skipBtn = document.getElementById('guidance-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.resetAndNavigate();
      });
    }

    MoodFeedback.resetBackground();

    const newUnlock = KnowledgeTip.isNewlyUnlocked();
    if (newUnlock) {
      setTimeout(() => KnowledgeTip.showUnlockNotification(newUnlock), 1500);
    }

    const saveWithGuidance = body.querySelector('.save-with-guidance');
    if (saveWithGuidance) {
      setTimeout(() => {
        KnowledgeTip.createBubbleTip(saveWithGuidance, this.recordData);
        KnowledgeTip.createBrainScienceBar(saveWithGuidance, this.recordData);
      }, 800);
    }
  },

  resetAndNavigate() {
    this.currentStep = 0;
    this.recordData = { type: 'mood', valence: 0, arousal: 0, label: '', labels: [], factors: [], factorsTimeline: [], journal: '' };
    window.location.hash = '#/insights';
  },

  unmount() {
    this.currentStep = 0;
    this.recordData = { type: 'mood', valence: 0, arousal: 0, label: '', labels: [], factors: [], factorsTimeline: [], journal: '' };
    MoodFeedback.resetBackground();
    KnowledgeTip.destroyBubbleTip();
    KnowledgeTip.destroyBrainScienceBar();
  }
};
