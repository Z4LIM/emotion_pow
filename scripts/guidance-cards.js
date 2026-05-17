const GuidanceCards = {
  cards: [
    {
      id: 'anxiety-grounding',
      trigger: { valenceMax: -0.2, labels: ['焦虑', '紧张', '不安', '担心', '恐惧'] },
      title: '试试 5-4-3-2-1 接地练习',
      icon: '🌿',
      description: '当你感到焦虑时，接地练习可以帮助你回到当下，减轻不安感。',
      steps: [
        '看到 5 样东西——环顾四周，说出你看到的',
        '触摸 4 样东西——感受它们的质地',
        '听到 3 种声音——安静地聆听',
        '闻到 2 种气味——深呼吸感受',
        '尝到 1 种味道——喝口水或含颗糖'
      ],
      relatedModule: 'emotion-regulation',
      color: 'var(--color-emotion-negative)'
    },
    {
      id: 'sadness-acceptance',
      trigger: { valenceMax: -0.2, labels: ['悲伤', '难过', '失落', '孤独', '空虚'] },
      title: '允许自己悲伤',
      icon: '🌧️',
      description: '悲伤不是软弱，它是你的心在告诉你：有些事情对你很重要。',
      steps: [
        '对自己说："我现在很难过，这很正常"',
        '找一个安全的空间，给自己几分钟',
        '如果需要，就哭出来——眼泪能排出压力激素',
        '写下来你为什么难过——文字能帮助大脑处理情绪',
        '给一个信任的人发条消息，不需要解释太多'
      ],
      relatedModule: 'emotion-regulation',
      color: 'var(--color-emotion-negative-deep)'
    },
    {
      id: 'anger-pause',
      trigger: { valenceMax: -0.2, labels: ['愤怒', '生气', '烦躁', '恼火', '暴怒'] },
      title: '先暂停 6 秒钟',
      icon: '⏸️',
      description: '愤怒时大脑的杏仁核接管了理性思考。6 秒钟是让前额叶重新上线所需的最短时间。',
      steps: [
        '停下来，深吸一口气',
        '从 6 慢慢数到 1',
        '注意你的双脚踩在地面的感觉',
        '问自己："我真正想要的是什么？"',
        '选择一个能帮你达到目标的行动'
      ],
      relatedModule: 'emotion-regulation',
      color: 'var(--color-emotion-negative)'
    },
    {
      id: 'stress-breathing',
      trigger: { valenceMax: 0, valenceMin: -1, labels: ['压力', '疲惫', '倦怠', '不堪重负'] },
      title: '4-7-8 呼吸法',
      icon: '💨',
      description: '这个呼吸技巧能快速激活副交感神经系统，帮助身体从"战斗模式"切换到"休息模式"。',
      steps: [
        '用鼻子吸气 4 秒',
        '屏住呼吸 7 秒',
        '用嘴缓慢呼气 8 秒',
        '重复 3-4 个循环',
        '感受心跳逐渐放缓'
      ],
      relatedModule: 'stress-and-coping',
      color: 'var(--color-emotion-negative-deep)'
    },
    {
      id: 'neutral-checkin',
      trigger: { valenceMin: -0.2, valenceMax: 0.2 },
      title: '此刻的你，还好吗？',
      icon: '🪞',
      description: '中性状态不是"没感觉"，它可能是平静，也可能是麻木。花一分钟分辨一下。',
      steps: [
        '问自己："我是平静，还是麻木？"',
        '如果是平静——享受这份安宁，它很珍贵',
        '如果是麻木——试着做一个小动作：伸个懒腰、喝口水',
        '留意身体有没有被忽略的信号：肩膀紧？胃不舒服？',
        '如果需要，给自己一个小小的奖励'
      ],
      relatedModule: 'emotion-intelligence',
      color: 'var(--color-emotion-neutral)'
    },
    {
      id: 'positive-savor',
      trigger: { valenceMin: 0.2, labels: ['开心', '快乐', '满足', '幸福', '愉悦'] },
      title: '品味这个时刻',
      icon: '✨',
      description: '积极心理学研究发现，主动"品味"积极体验能让幸福感持续更久。',
      steps: [
        '停下来，感受此刻的愉悦',
        '在心里描述这个感觉："我感到温暖、轻松..."',
        '想想是什么带来了这份快乐',
        '用所有感官记住这个时刻：画面、声音、气味',
        '在心里说"谢谢"——感恩能放大积极情绪'
      ],
      relatedModule: 'emotion-health',
      color: 'var(--color-emotion-positive)'
    },
    {
      id: 'excitement-channel',
      trigger: { valenceMin: 0.4, labels: ['兴奋', '激动', '期待', '热情'] },
      title: '把兴奋转化为行动',
      icon: '🚀',
      description: '兴奋是一种高能量状态，如果不加以利用，它会消退。趁热打铁！',
      steps: [
        '写下你此刻最想做的 3 件事',
        '选一件现在就能开始做的',
        '设定一个 15 分钟的计时器',
        '开始行动——不需要完美，只需要开始',
        '完成后给自己一个肯定'
      ],
      relatedModule: 'emotion-and-creativity',
      color: 'var(--color-emotion-positive-deep)'
    },
    {
      id: 'gratitude-practice',
      trigger: { valenceMin: 0, labels: ['感激', '感恩', '感动', '温暖'] },
      title: '感恩三件事',
      icon: '🙏',
      description: '感恩练习是积极心理学中实证最充分的幸福感提升方法之一。',
      steps: [
        '想一件今天让你感恩的小事',
        '想一个你感激的人',
        '想一个你觉得幸运的事',
        '把它们写在心里或纸上',
        '坚持一周，你会发现心态的微妙变化'
      ],
      relatedModule: 'emotion-health',
      color: 'var(--color-emotion-positive)'
    },
    {
      id: 'loneliness-reach',
      trigger: { labels: ['孤独', '寂寞', '被忽视', '无助', '被遗弃'] },
      title: '你并不孤单',
      icon: '🤗',
      description: '孤独感是大脑在提醒你：你需要连接。这不是软弱，而是人类最基本的需求之一。',
      steps: [
        '承认这种感觉——"我感到孤独，这很正常"',
        '给一个朋友或家人发一条简单的消息',
        '如果不想说话，可以去一个有人的地方：咖啡馆、公园',
        '试试写一封不寄出的信，把心里话说出来',
        '记住：寻求连接是勇敢，不是软弱'
      ],
      relatedModule: 'emotion-and-relationships',
      color: 'var(--color-emotion-negative-deep)'
    },
    {
      id: 'confusion-explore',
      trigger: { labels: ['困惑', '迷茫', '矛盾', '纠结', '犹豫'] },
      title: '迷茫时，先写下来',
      icon: '🧭',
      description: '当情绪模糊不清时，写作是整理内心的最有效方式之一。表达性写作能帮助大脑重新组织混乱的思绪。',
      steps: [
        '拿出纸笔或打开备忘录',
        '写下"我现在感觉..."然后不停笔写 5 分钟',
        '不需要逻辑，不需要完整句子',
        '写完后读一遍，圈出最触动你的词',
        '问自己："这个词在告诉我什么？"'
      ],
      relatedModule: 'emotion-intelligence',
      color: 'var(--color-emotion-neutral)'
    }
  ],

  getGuidance(recordData) {
    const { valence, label, factors } = recordData;
    const matched = [];

    for (const card of this.cards) {
      let score = 0;
      const t = card.trigger;

      if (t.labels && label && t.labels.includes(label)) {
        score += 10;
      }

      if (t.valenceMin !== undefined && valence >= t.valenceMin) score += 3;
      if (t.valenceMax !== undefined && valence <= t.valenceMax) score += 3;

      if (t.labels && label && !t.labels.includes(label)) {
        if (t.valenceMin === undefined && t.valenceMax === undefined) continue;
        score -= 5;
      }

      if (score > 0) {
        matched.push({ card, score });
      }
    }

    matched.sort((a, b) => b.score - a.score);

    if (matched.length === 0) {
      const fallback = valence >= 0
        ? this.cards.find(c => c.id === 'positive-savor')
        : this.cards.find(c => c.id === 'neutral-checkin');
      return fallback || null;
    }

    return matched[0].card;
  },

  renderCard(card) {
    if (!card) return '';

    return `
      <div class="guidance-card" data-guidance="${card.id}">
        <div class="guidance-card-header" style="border-color: ${card.color}">
          <span class="guidance-icon">${card.icon}</span>
          <h3 class="text-h4 guidance-title">${card.title}</h3>
        </div>
        <p class="text-body-sm guidance-desc">${card.description}</p>
        <div class="guidance-steps">
          ${card.steps.map((step, i) => `
            <div class="guidance-step">
              <span class="guidance-step-num">${i + 1}</span>
              <span class="text-body-sm">${step}</span>
            </div>
          `).join('')}
        </div>
        <div class="guidance-footer">
          <a href="#/knowledge" class="guidance-link" data-gesture>
            📚 了解更多：${this.getModuleName(card.relatedModule)}
          </a>
        </div>
      </div>
    `;
  },

  getModuleName(moduleId) {
    const names = {
      'emotion-regulation': '情绪调节',
      'emotion-health': '情绪与健康',
      'emotion-intelligence': '情绪智力',
      'stress-and-coping': '压力与应对',
      'emotion-and-relationships': '情绪与关系',
      'emotion-and-creativity': '情绪与创造力'
    };
    return names[moduleId] || '情绪科学';
  }
};
