const KnowledgeTip = {
  DISMISS_KEY: 'knowledge-tip-dismissed',

  snippets: [
    {
      id: 'neuro-naming',
      onomatopoeia: '叮！',
      tag: '神经科学',
      title: '命名即驯服',
      text: '当你用语言描述一种情绪时，杏仁核活跃度降低约50%。这就是为什么"记录心情"本身就是一种调节——你在用前额叶皮层给情绪贴标签，让它从混沌变得可处理。',
      psych: '机制：前额叶皮层 → 杏仁核抑制',
      module: 'emotion-regulation',
      bubbleType: 'speech',
      trigger: { valenceMax: -0.1 }
    },
    {
      id: 'vagal-breath',
      onomatopoeia: '嗯...',
      tag: '自主神经',
      title: '呼吸是迷走神经的遥控器',
      text: '缓慢呼气时，迷走神经被激活，心率下降，身体进入"安全模式"。4-7-8呼吸法就是利用了这个机制——延长呼气来激活副交感神经系统。',
      psych: '机制：延长呼气 → 迷走神经张力↑',
      module: 'stress-and-coping',
      bubbleType: 'thought',
      trigger: { valenceMax: 0, labels: ['焦虑', '紧张', '压力', '不安'] }
    },
    {
      id: 'amygdala-hijack',
      onomatopoeia: '！？',
      tag: '杏仁核',
      title: '6秒——前额叶的上线时间',
      text: '愤怒时，杏仁核在0.012秒内接管大脑，但前额叶需要约6秒才能重新上线。这6秒内做的决定，往往不是你真正想要的。先暂停，再行动。',
      psych: '机制：杏仁核劫持 → 前额叶抑制',
      module: 'emotion-regulation',
      bubbleType: 'shout',
      trigger: { valenceMax: -0.3, labels: ['愤怒', '生气', '烦躁'] }
    },
    {
      id: 'savor-positive',
      onomatopoeia: '哗！',
      tag: '积极心理学',
      title: '品味——让快乐持续的秘密',
      text: '积极情绪天然短暂，但"品味"可以延长它。停下来，用所有感官记住这个时刻：画面、声音、气味。感恩能放大积极情绪，让幸福感持续更久。',
      psych: '机制：品味 → 多巴胺回路强化',
      module: 'emotion-health',
      bubbleType: 'speech',
      trigger: { valenceMin: 0.3 }
    },
    {
      id: 'default-mode',
      onomatopoeia: '嗯...',
      tag: '默认模式网络',
      title: '发呆时大脑在做什么？',
      text: '当你"什么都不想"时，默认模式网络（DMN）正在活跃——它负责自我反思、未来规划和创意连接。适度的走神不是浪费时间，而是大脑的"整理模式"。',
      psych: '机制：DMN活跃 → 创意连接↑',
      module: 'emotion-and-creativity',
      bubbleType: 'thought',
      trigger: { valenceMin: -0.2, valenceMax: 0.2 }
    },
    {
      id: 'mirror-neuron',
      onomatopoeia: '叮！',
      tag: '镜像神经元',
      title: '为什么别人的情绪会"传染"？',
      text: '看到别人微笑时，你大脑中的镜像神经元会自动"模拟"那个微笑——你实际上在脑内体验了对方的快乐。这就是共情的神经基础，也是情绪传染的原因。',
      psych: '机制：镜像神经元 → 情绪共振',
      module: 'emotion-and-relationships',
      bubbleType: 'speech',
      trigger: { labels: ['孤独', '感动', '温暖'] }
    },
    {
      id: 'cortisol-body',
      onomatopoeia: '！？',
      tag: 'HPA轴',
      title: '压力正在重塑你的身体',
      text: '长期压力使皮质醇持续升高，抑制免疫细胞活性，增加心血管炎症，加速细胞老化。但好消息是：冥想和积极情绪可以激活端粒酶，逆转这一过程。',
      psych: '机制：皮质醇↑ → 免疫抑制 + 端粒缩短',
      module: 'emotion-health',
      bubbleType: 'shout',
      trigger: { valenceMax: -0.3, labels: ['压力', '疲惫', '不堪重负'] }
    },
    {
      id: 'approach-avoidance',
      onomatopoeia: '嗯...',
      tag: '动机系统',
      title: '你的身体在说"靠近"还是"远离"？',
      text: '趋近动机由多巴胺驱动——你向奖励靠近；回避动机由血清素调节——你从威胁后退。注意你的身体倾向：前倾是趋近，后仰是回避。你的身体比大脑更早知道答案。',
      psych: '机制：多巴胺→趋近 / 血清素→回避',
      module: 'what-are-emotions',
      bubbleType: 'thought',
      trigger: { valenceMin: -0.2, valenceMax: 0.2 }
    },
    {
      id: 'vagal-window',
      onomatopoeia: '叮！',
      tag: '多迷走神经理论',
      title: '你的"容纳之窗"有多大？',
      text: '容纳之窗是你能同时感受情绪和理性思考的范围。窗口内=平衡，窗口上缘=过度激活（战斗/逃跑），窗口下缘=低激活（冻结/解离）。调节就是扩大这个窗口。',
      psych: '机制：腹侧迷走神经 → 容纳之窗',
      module: 'emotion-regulation',
      bubbleType: 'speech',
      trigger: { valenceMin: -0.5, valenceMax: 0 }
    },
    {
      id: 'interoception',
      onomatopoeia: '嗯...',
      tag: '内感受',
      title: '你的身体知道答案',
      text: '内感受是你感知身体内部信号的能力——心跳、呼吸、胃部感受。研究表明，内感受越敏锐的人，情绪调节能力越强。记录心情就是在训练内感受。',
      psych: '机制：岛叶皮层 → 内感受觉察',
      module: 'emotion-intelligence',
      bubbleType: 'thought',
      trigger: {}
    }
  ],

  unlockLevels: [
    { count: 3, id: 'anatomy-stickers', label: '情绪解剖学分镜' },
    { count: 7, id: 'brain-science-bar', label: '今日脑科学' },
    { count: 14, id: 'neuro-overlay', label: '神经科学视角' }
  ],

  anatomyStickers: [
    {
      id: 'amygdala',
      title: '杏仁核：情绪的火警铃',
      poem: '杏仁核小脾气爆，零点零一二秒就报到；前额叶慢六秒到，先停后想不乱跑',
      science: '杏仁核是大脑的威胁检测器，能在12毫秒内触发战斗/逃跑反应，而前额叶皮层需要约6秒才能介入调节。',
      emoji: '🔔'
    },
    {
      id: 'vagus',
      title: '迷走神经：安全的开关',
      poem: '迷走神经分两段，腹侧安全背侧寒；长呼慢吸腹侧亮，安全感从呼吸来',
      science: '腹侧迷走神经激活时产生安全感和社交连接，背侧迷走神经激活时产生冻结和解离反应。',
      emoji: '🌿'
    },
    {
      id: 'prefrontal',
      title: '前额叶：理性的指挥官',
      poem: '前额叶是总指挥，命名情绪就到位；写写说说它就醒，冲动魔鬼变天使',
      science: '前额叶皮层负责执行功能和情绪调节，语言化情绪可以激活前额叶、抑制杏仁核活动。',
      emoji: '🧠'
    }
  ],

  brainScienceFacts: [
    { valenceMin: 0.3, text: '多巴胺回路正在亮起——积极情绪激活了大脑的奖赏系统，伏隔核释放多巴胺让你感到愉悦。', poem: '多巴胺回路亮起来，品味此刻莫等待' },
    { valenceMax: -0.3, text: '杏仁核正在高频放电——消极情绪触发了威胁检测系统，前扣带回也在活跃，试图理解这种不适。', poem: '杏仁核拉响警报器，前额叶慢半拍到' },
    { valenceMin: -0.2, valenceMax: 0.2, text: '默认模式网络正在漫游——中性状态下，大脑进入自我反思和创意连接模式。', poem: '默认网络闲漫步，走神也是好时光' }
  ],

  _floatingNotes: [],
  _artBgState: null,
  _bubbleTimer: null,
  _expandedNote: null,

  getUnlockLevel() {
    const moods = moodManager.getMoods();
    const count = moods.length;
    let highest = null;
    for (const level of this.unlockLevels) {
      if (count >= level.count) highest = level;
    }
    return highest;
  },

  getUnlockedLevels() {
    const moods = moodManager.getMoods();
    const count = moods.length;
    return this.unlockLevels.filter(l => count >= l.count);
  },

  isNewlyUnlocked() {
    const moods = moodManager.getMoods();
    if (moods.length === 0) return null;
    const latest = moods[moods.length - 1];
    const now = Date.now();
    const diff = now - latest.timestamp;
    if (diff > 60000) return null;
    const count = moods.length;
    for (const level of this.unlockLevels) {
      if (count === level.count) return level;
    }
    return null;
  },

  getRecommendation(recordData) {
    const { valence = 0, label = '', labels = [] } = recordData;
    const allLabels = [label, ...(labels || [])].filter(Boolean);
    const scored = [];

    for (const snippet of this.snippets) {
      let score = 0;
      const t = snippet.trigger;

      if (t.labels && allLabels.some(l => t.labels.includes(l))) {
        score += 10;
      }

      if (t.valenceMin !== undefined && valence >= t.valenceMin) score += 3;
      if (t.valenceMax !== undefined && valence <= t.valenceMax) score += 3;

      if (score > 0) scored.push({ snippet, score });
    }

    scored.sort((a, b) => b.score - a.score);

    const dismissed = this._getDismissed();
    const filtered = scored.filter(s => !this._isDismissed(s.snippet.id));

    if (filtered.length > 0) return filtered[0].snippet;

    if (scored.length > 0) return scored[0].snippet;

    return this.snippets[Math.floor(Math.random() * this.snippets.length)];
  },

  getFloatingSnippets() {
    const moods = moodManager.getMoods();
    const dismissed = this._getDismissed();

    if (moods.length > 0) {
      const latest = moods[moods.length - 1];
      const rec = this.getRecommendation(latest);
      const others = this.snippets
        .filter(s => s.id !== rec.id && !this._isDismissed(s.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      return [rec, ...others];
    }

    return this.snippets
      .filter(s => !this._isDismissed(s.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  },

  createFloatingNotes(container) {
    this.destroyFloatingNotes();

    const unlocked = this.getUnlockedLevels();
    const snippets = this.getFloatingSnippets();
    if (snippets.length === 0 && unlocked.length === 0) return;

    const layer = document.createElement('div');
    layer.className = 'knowledge-floating-layer';
    container.style.position = 'relative';
    container.appendChild(layer);

    const containerRect = container.getBoundingClientRect();
    const navHeight = 60;
    const bottomBarHeight = 60;
    const noteWidth = 220;
    const noteHeight = 160;

    const gridCols = Math.max(1, Math.floor((containerRect.width - 32) / (noteWidth + 20)));
    const gridRows = 2;
    const gridStartY = containerRect.height - bottomBarHeight - (gridRows * (noteHeight + 20)) - 20;
    const gridStartX = 16;

    const items = [];

    if (unlocked.some(l => l.id === 'anatomy-stickers')) {
      items.push(...this.anatomyStickers.map(s => ({ type: 'anatomy', data: s })));
    }

    items.push(...snippets.map(s => ({ type: 'snippet', data: s })));

    const displayItems = items.slice(0, gridCols * gridRows);
    const tilts = ['knowledge-note-tilt-right', 'knowledge-note-tilt-left', 'knowledge-note-tilt-center'];

    displayItems.forEach((item, i) => {
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      const note = document.createElement('div');
      note.className = `knowledge-note ${tilts[i % 3]}`;
      note.style.setProperty('--note-tilt', `${(i % 2 === 0 ? 3 : -3) * (i % 3 === 2 ? 0.33 : 1)}deg`);

      const x = gridStartX + col * (noteWidth + 20);
      const y = gridStartY + row * (noteHeight + 20);

      note.style.left = `${x}px`;
      note.style.top = `${y}px`;
      note.style.zIndex = 20 + i;

      if (item.type === 'anatomy') {
        const s = item.data;
        note.innerHTML = `
          <div class="knowledge-note-torn"></div>
          <div class="knowledge-note-header">
            <span class="knowledge-note-onomatopoeia">${s.emoji}</span>
            <span class="knowledge-note-tag">情绪解剖学</span>
            <button class="knowledge-note-close" aria-label="关闭" data-close="anatomy-${s.id}">✕</button>
          </div>
          <div class="knowledge-note-body">
            <div class="knowledge-note-title">${s.title}</div>
            <div class="knowledge-note-text">${s.poem}</div>
            <div class="knowledge-note-psych">${s.science.substring(0, 40)}...</div>
          </div>
        `;
        note.dataset.noteId = `anatomy-${s.id}`;
        note.dataset.expandText = s.science;
        note.dataset.expandPoem = s.poem;
      } else {
        const s = item.data;
        note.innerHTML = `
          <div class="knowledge-note-torn"></div>
          <div class="knowledge-note-header">
            <span class="knowledge-note-onomatopoeia">${s.onomatopoeia}</span>
            <span class="knowledge-note-tag">${s.tag}</span>
            <button class="knowledge-note-close" aria-label="关闭" data-close="${s.id}">✕</button>
          </div>
          <div class="knowledge-note-body">
            <div class="knowledge-note-title">${s.title}</div>
            <div class="knowledge-note-text">${s.text}</div>
            <div class="knowledge-note-psych">${s.psych}</div>
          </div>
        `;
        note.dataset.noteId = s.id;
      }

      layer.appendChild(note);
      this._floatingNotes.push(note);

      if (AnimationEngine.shouldAnimate()) {
        anime({
          targets: note,
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 500,
          delay: 800 + i * 200,
          easing: 'easeOutBack'
        });
      }

      note.addEventListener('click', (e) => {
        if (e.target.closest('.knowledge-note-close')) {
          e.stopPropagation();
          this._dismissNote(note.dataset.noteId, note);
          return;
        }
        if (item.type === 'anatomy') {
          this._expandAnatomyNote(item.data, note);
        } else {
          this._expandNote(item.data, note);
        }
      });
    });
  },

  _expandNote(snippet, noteEl) {
    if (this._expandedNote) return;
    this._expandedNote = snippet.id;

    const overlay = document.createElement('div');
    overlay.className = 'knowledge-note-overlay';
    document.body.appendChild(overlay);

    const expanded = document.createElement('div');
    expanded.className = 'knowledge-note-expanded';
    expanded.innerHTML = `
      <div class="knowledge-note-torn"></div>
      <div class="knowledge-note-header">
        <span class="knowledge-note-onomatopoeia">${snippet.onomatopoeia}</span>
        <span class="knowledge-note-tag">${snippet.tag}</span>
        <button class="knowledge-note-close" aria-label="关闭">✕</button>
      </div>
      <div class="knowledge-note-body">
        <div class="knowledge-note-title">${snippet.title}</div>
        <div class="knowledge-note-text">${snippet.text}</div>
        <div class="knowledge-note-psych">${snippet.psych}</div>
        <a href="#/knowledge" class="knowledge-note-link">查看完整知识库 →</a>
      </div>
      <span class="knowledge-note-onomatopoeia-pop">哗！</span>
    `;
    document.body.appendChild(expanded);

    const linesContainer = document.createElement('div');
    linesContainer.className = 'knowledge-note-concentric-lines';
    for (let i = 0; i < 12; i++) {
      const line = document.createElement('span');
      line.style.transform = `rotate(${i * 30}deg)`;
      line.style.animationDelay = `${i * 30}ms`;
      linesContainer.appendChild(line);
    }
    expanded.appendChild(linesContainer);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: expanded,
        scale: [0.7, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutBack'
      });
      anime({
        targets: overlay,
        opacity: [0, 1],
        duration: 300
      });
    }

    const closeExpanded = () => {
      if (AnimationEngine.shouldAnimate()) {
        anime({
          targets: expanded,
          scale: [1, 0.8],
          opacity: [1, 0],
          duration: 250,
          easing: 'easeInQuad',
          complete: () => {
            expanded.remove();
            overlay.remove();
            linesContainer.remove();
          }
        });
        anime({
          targets: overlay,
          opacity: [1, 0],
          duration: 250
        });
      } else {
        expanded.remove();
        overlay.remove();
        linesContainer.remove();
      }
      this._expandedNote = null;
    };

    expanded.querySelector('.knowledge-note-close').addEventListener('click', closeExpanded);
    overlay.addEventListener('click', closeExpanded);
  },

  _expandAnatomyNote(sticker, noteEl) {
    if (this._expandedNote) return;
    this._expandedNote = sticker.id;

    const overlay = document.createElement('div');
    overlay.className = 'knowledge-note-overlay';
    document.body.appendChild(overlay);

    const expanded = document.createElement('div');
    expanded.className = 'knowledge-note-expanded';
    expanded.innerHTML = `
      <div class="knowledge-note-torn"></div>
      <div class="knowledge-note-header">
        <span class="knowledge-note-onomatopoeia">${sticker.emoji}</span>
        <span class="knowledge-note-tag">情绪解剖学</span>
        <button class="knowledge-note-close" aria-label="关闭">✕</button>
      </div>
      <div class="knowledge-note-body">
        <div class="knowledge-note-title">${sticker.title}</div>
        <div class="knowledge-note-poem">${sticker.poem}</div>
        <div class="knowledge-note-text">${sticker.science}</div>
        <a href="#/knowledge" class="knowledge-note-link">查看完整知识库 →</a>
      </div>
      <span class="knowledge-note-onomatopoeia-pop">叮！</span>
    `;
    document.body.appendChild(expanded);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: expanded,
        scale: [0.7, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutBack'
      });
      anime({
        targets: overlay,
        opacity: [0, 1],
        duration: 300
      });
    }

    const closeExpanded = () => {
      if (AnimationEngine.shouldAnimate()) {
        anime({
          targets: expanded,
          scale: [1, 0.8],
          opacity: [1, 0],
          duration: 250,
          easing: 'easeInQuad',
          complete: () => { expanded.remove(); overlay.remove(); }
        });
        anime({ targets: overlay, opacity: [1, 0], duration: 250 });
      } else {
        expanded.remove();
        overlay.remove();
      }
      this._expandedNote = null;
    };

    expanded.querySelector('.knowledge-note-close').addEventListener('click', closeExpanded);
    overlay.addEventListener('click', closeExpanded);
  },

  _dismissNote(id, noteEl) {
    this._setDismissed(id);

    if (AnimationEngine.shouldAnimate()) {
      const onomatopoeia = document.createElement('span');
      onomatopoeia.className = 'knowledge-note-onomatopoeia-pop';
      onomatopoeia.textContent = '嗖~';
      onomatopoeia.style.color = 'var(--color-text-tertiary)';
      noteEl.appendChild(onomatopoeia);

      noteEl.classList.add('knowledge-note-fadeout');
      setTimeout(() => {
        noteEl.remove();
        this._floatingNotes = this._floatingNotes.filter(n => n !== noteEl);
      }, 300);
    } else {
      noteEl.remove();
      this._floatingNotes = this._floatingNotes.filter(n => n !== noteEl);
    }
  },

  destroyFloatingNotes() {
    this._floatingNotes.forEach(n => n.remove());
    this._floatingNotes = [];
    const layer = document.querySelector('.knowledge-floating-layer');
    if (layer) layer.remove();
    this._expandedNote = null;
  },

  createBubbleTip(container, recordData) {
    this.destroyBubbleTip();

    const snippet = this.getRecommendation(recordData);
    if (!snippet) return;

    const bubbleTypeClass = {
      'speech': '',
      'thought': 'record-bubble-tip-thought',
      'shout': 'record-bubble-tip-shout',
      'whisper': 'record-bubble-tip-whisper'
    }[snippet.bubbleType || 'speech'] || '';

    const bubble = document.createElement('div');
    bubble.className = `record-bubble-tip ${bubbleTypeClass}`;
    bubble.dataset.bubbleId = snippet.id;

    bubble.innerHTML = `
      <span class="record-bubble-onomatopoeia">${snippet.onomatopoeia}</span>
      <div class="record-bubble-content">
        <div class="record-bubble-title">${snippet.title}</div>
        <div class="record-bubble-text">${snippet.text.substring(0, 80)}...</div>
        <div class="record-bubble-psych">${snippet.psych}</div>
      </div>
    `;

    container.appendChild(bubble);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: bubble,
        scale: [0.5, 1.1, 1],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutBack'
      });
    }

    let expanded = false;

    bubble.addEventListener('click', () => {
      if (expanded) return;
      expanded = true;

      clearTimeout(this._bubbleTimer);

      bubble.classList.add('record-bubble-impact-flash');

      const expandedEl = document.createElement('div');
      expandedEl.className = 'record-bubble-expanded';
      expandedEl.innerHTML = `
        <div class="record-bubble-content">
          <div class="record-bubble-title">${snippet.title}</div>
          <div class="record-bubble-text">${snippet.text}</div>
          <div class="record-bubble-psych">${snippet.psych}</div>
          <a href="#/knowledge" class="record-bubble-link">📚 查看完整知识库 →</a>
        </div>
      `;

      bubble.style.display = 'none';
      container.appendChild(expandedEl);

      if (AnimationEngine.shouldAnimate()) {
        anime({
          targets: expandedEl,
          scale: [0.8, 1],
          opacity: [0, 1],
          duration: 400,
          easing: 'easeOutBack'
        });
      }

      this._bubbleTimer = setTimeout(() => {
        this._fadeBubble(expandedEl);
      }, 15000);
    });

    this._bubbleTimer = setTimeout(() => {
      this._fadeBubble(bubble);
    }, 8000);
  },

  _fadeBubble(el) {
    if (!el || !el.parentNode) return;

    const onomatopoeia = document.createElement('span');
    onomatopoeia.className = 'record-bubble-onomatopoeia';
    onomatopoeia.textContent = '嗖~';
    onomatopoeia.style.color = 'var(--color-text-tertiary)';
    onomatopoeia.style.position = 'absolute';
    onomatopoeia.style.top = '-10px';
    onomatopoeia.style.right = '10px';
    el.style.position = 'relative';
    el.appendChild(onomatopoeia);

    if (AnimationEngine.shouldAnimate()) {
      el.classList.add('record-bubble-fadeout');
      setTimeout(() => el.remove(), 300);
    } else {
      el.remove();
    }
  },

  destroyBubbleTip() {
    clearTimeout(this._bubbleTimer);
    document.querySelectorAll('.record-bubble-tip, .record-bubble-expanded').forEach(el => el.remove());
  },

  createBrainScienceBar(container, recordData) {
    const unlocked = this.getUnlockedLevels();
    if (!unlocked.some(l => l.id === 'brain-science-bar')) return;

    const valence = recordData.valence || 0;
    let fact = this.brainScienceFacts.find(f => {
      const minOk = f.valenceMin === undefined || valence >= f.valenceMin;
      const maxOk = f.valenceMax === undefined || valence <= f.valenceMax;
      return minOk && maxOk;
    });
    if (!fact) fact = this.brainScienceFacts[2];

    const bar = document.createElement('div');
    bar.className = 'brain-science-bar';
    bar.innerHTML = `
      <div class="brain-science-bar-header">
        <span class="brain-science-bar-icon">🧠</span>
        <span class="brain-science-bar-title">今日脑科学</span>
      </div>
      <div class="brain-science-bar-poem">${fact.poem}</div>
      <div class="brain-science-bar-text">${fact.text}</div>
    `;
    container.appendChild(bar);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: bar,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        delay: 1200,
        easing: 'easeOutQuad'
      });
    }
  },

  destroyBrainScienceBar() {
    document.querySelectorAll('.brain-science-bar').forEach(el => el.remove());
  },

  showUnlockNotification(level) {
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.innerHTML = `
      <span class="unlock-notification-icon">🔓</span>
      <span class="unlock-notification-text">新知识已解锁：${level.label}</span>
    `;
    document.body.appendChild(notification);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: notification,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 500,
        easing: 'easeOutBack',
        complete: () => {
          setTimeout(() => {
            anime({
              targets: notification,
              opacity: [1, 0],
              translateY: [0, -20],
              duration: 300,
              easing: 'easeInQuad',
              complete: () => notification.remove()
            });
          }, 3000);
        }
      });
    } else {
      setTimeout(() => notification.remove(), 3000);
    }
  },

  createArtBackground(container) {
    this.destroyArtBackground();

    const bgDiv = document.createElement('div');
    bgDiv.className = 'home-art-bg';
    container.style.position = 'relative';
    container.insertBefore(bgDiv, container.firstChild);

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth || 800;
    canvas.height = container.clientHeight || 600;
    bgDiv.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const state = {
      particles: Array(40).fill(null).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 3,
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      })),
      waves: Array(3).fill(null).map((_, i) => ({
        amplitude: 8 + i * 4,
        frequency: 0.005 + i * 0.002,
        speed: 0.008 + i * 0.003,
        phase: Math.random() * Math.PI * 2,
        yOffset: 0.3 + i * 0.15
      })),
      running: true,
      frame: 0
    };

    this._artBgState = state;

    const draw = () => {
      if (!state.running) return;

      const cs = getComputedStyle(document.documentElement);
      const bgColor = cs.getPropertyValue('--color-bg-primary').trim();
      const lineColor = cs.getPropertyValue('--color-emotion-positive-deep').trim();

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      state.particles.forEach(p => {
        p.phase += 0.01;
        p.y -= p.speed;
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x + Math.sin(p.phase) * 3, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      state.waves.forEach(w => {
        w.phase += w.speed;
        ctx.beginPath();
        const baseY = canvas.height * w.yOffset;
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = baseY + Math.sin(x * w.frequency + w.phase) * w.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      state.frame++;
      requestAnimationFrame(draw);
    };

    draw();
  },

  destroyArtBackground() {
    if (this._artBgState) {
      this._artBgState.running = false;
      this._artBgState = null;
    }
    const bg = document.querySelector('.home-art-bg');
    if (bg) bg.remove();
  },

  _getDismissed() {
    try {
      const data = SecurityUtils.safeGetItem(this.DISMISS_KEY, {});
      return data || {};
    } catch {
      return {};
    }
  },

  _setDismissed(id) {
    const data = this._getDismissed();
    data[id] = Date.now();
    SecurityUtils.safeSetItem(this.DISMISS_KEY, data);
  },

  _isDismissed(id) {
    const data = this._getDismissed();
    if (!data[id]) return false;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (Date.now() - data[id]) < twentyFourHours;
  }
};
