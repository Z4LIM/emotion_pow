const PageKnowledge = {
  modules: [
    {
      id: 'what-are-emotions',
      title: '情绪是什么',
      icon: '🎭',
      color: 'var(--color-emotion-neutral)',
      tag: '基础概念',
      summary: '情绪是心理和生理状态的综合反应，是进化赋予我们的信号系统。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '情绪不仅仅是"感觉"——它们是大脑对身体状态的解读，是数百万年进化打磨出的精密信号系统。' },
        { type: 'section', label: '核心理论' },
        {
          type: 'info', title: '情绪的三个组成部分',
          items: [
            { label: '主观体验', desc: '你对情绪的内在感受，比如"我感到开心"或"我感到焦虑"。这是最私人的部分——只有你自己能完全感知' },
            { label: '生理反应', desc: '身体的自动响应：心跳加速、出汗、肌肉紧张、呼吸变化。这些反应由自主神经系统控制，往往先于意识' },
            { label: '行为表达', desc: '可观察的反应：微笑、皱眉、后退、靠近、战斗或逃跑。面部表情是跨文化通用的情绪信号' }
          ]
        },
        {
          type: 'fact', icon: '🔬', label: '科学发现',
          text: '保罗·艾克曼的研究发现，人类有6种基本情绪的面部表情是跨文化一致的：快乐、悲伤、愤怒、恐惧、厌恶、惊讶。这暗示情绪有深层的生物学基础。'
        },
        { type: 'section', label: '关键区分' },
        {
          type: 'keyConcept',
          items: [
            { title: '情绪 Emotion', desc: '对特定事件的短暂、强烈反应，有明确对象。如"被批评后感到愤怒"' },
            { title: '心情 Mood', desc: '持续时间更长（数小时到数天）、强度更弱的情感状态，可能没有明确原因。如"今天莫名低落"' },
            { title: '感受 Feeling', desc: '对情绪或心情的主观体验，是你"意识到"的那部分。如"我注意到自己很紧张"' },
            { title: '情感 Affect', desc: '涵盖所有情绪状态的广义术语，是心理学研究的基本对象' }
          ]
        },
        {
          type: 'quote', author: '威廉·詹姆斯', source: '《心理学原理》1890',
          text: '我们不是因为悲伤而哭泣，而是因为哭泣而悲伤。身体反应先于情绪体验。'
        },
        { type: 'section', label: '反思' },
        { type: 'reflection', text: '回想最近一次强烈情绪体验，你能分辨出其中的主观感受、身体反应和行为冲动吗？试着把这三个层面分开观察。' }
      ]
    },
    {
      id: 'valence-model',
      title: '效价与唤醒度',
      icon: '📊',
      color: 'var(--color-emotion-positive)',
      tag: '情绪维度',
      summary: '情绪可以用效价（积极/消极）和唤醒度（平静/兴奋）两个维度来定位。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '效价模型认为，所有情绪都可以在一个从 -1（极度消极）到 +1（极度积极）的轴上找到位置。但这还不够——我们还需要"唤醒度"来描述情绪的强度。' },
        { type: 'section', label: '二维模型' },
        {
          type: 'keyConcept',
          items: [
            { title: '高效价+高唤醒', desc: '兴奋、激动、热情——积极但强烈，像赢得比赛的狂喜' },
            { title: '高效价+低唤醒', desc: '平静、满足、安详——积极而温和，像午后阳光下的阅读' },
            { title: '低效价+高唤醒', desc: '焦虑、愤怒、恐慌——消极而强烈，像考试前的极度紧张' },
            { title: '低效价+低唤醒', desc: '悲伤、疲惫、无聊——消极而低沉，像阴雨天的倦怠感' }
          ]
        },
        { type: 'visual', content: 'valence-slider' },
        { type: 'section', label: '为什么重要' },
        {
          type: 'info', title: '二维模型的实用价值',
          items: [
            { label: '更精准', desc: '"焦虑"和"愤怒"都是消极的，但焦虑是紧绷的，愤怒是爆发的——调节策略完全不同' },
            { label: '更实用', desc: '调节策略因唤醒度而异：高唤醒需要先冷静（深呼吸），低唤醒需要先激活（运动）' },
            { label: '更科学', desc: '二维模型是情绪研究中最广泛使用的框架，fMRI研究支持不同象限激活不同脑区' }
          ]
        },
        {
          type: 'quote', author: '詹姆斯·罗素', source: '环形情绪模型 (1980)',
          text: '情绪不是离散的岛屿，而是一片连续的海洋。效价和唤醒度是这片海洋的经纬度。'
        },
        { type: 'section', label: '实践' },
        {
          type: 'practice', title: '情绪定位练习',
          steps: ['回想你此刻的情绪状态', '在心中画出效价-唤醒度坐标', '给效价打分：-1到+1', '给唤醒度打分：-1到+1', '观察你的情绪落在哪个象限']
        }
      ]
    },
    {
      id: 'emotion-health',
      title: '情绪与健康',
      icon: '❤️',
      color: 'var(--color-emotion-negative)',
      tag: '心身联系',
      summary: '情绪状态直接影响身体健康，心身医学揭示了心理与生理的深层联系。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '你的心情不仅仅是心理状态——它正在实时影响你的身体健康。情绪与身体的联系比我们想象的要深得多。' },
        { type: 'section', label: '身体影响' },
        {
          type: 'info', title: '消极情绪对身体的影响',
          items: [
            { label: '心血管系统', desc: '长期压力导致血压升高、心率不齐、血管内皮炎症，增加心脏病风险50%' },
            { label: '免疫系统', desc: '皮质醇持续升高会抑制NK细胞和T细胞活性，使感染风险增加2-3倍' },
            { label: '消化系统', desc: '焦虑影响肠道菌群平衡，90%的血清素在肠道产生，肠脑轴是双向通道' },
            { label: '睡眠质量', desc: '情绪波动直接影响褪黑素分泌，破坏入睡和深度睡眠周期' },
            { label: '内分泌系统', desc: '慢性压力扰乱HPA轴，影响代谢、食欲、性功能，加速细胞老化' }
          ]
        },
        {
          type: 'fact', icon: '🧬', label: '端粒研究',
          text: '诺贝尔奖得主伊丽莎白·布莱克本的研究发现：长期压力可使端粒缩短，相当于加速衰老10年。而冥想和积极情绪可以激活端粒酶，逆转这一过程。'
        },
        { type: 'section', label: '积极力量' },
        {
          type: 'info', title: '积极情绪的健康益处',
          items: [
            { label: '增强免疫', desc: '积极情绪与更高的IgA抗体水平相关，感冒发病率降低约30%' },
            { label: '心血管保护', desc: '乐观者冠心病发病率降低约35%，这与炎症指标降低直接相关' },
            { label: '抗炎作用', desc: '积极情绪可降低CRP、IL-6等炎症指标，慢性炎症是多种疾病的基础' },
            { label: '延长寿命', desc: '修女研究追踪发现，年轻时表达更多积极情绪的修女平均多活7-10年' }
          ]
        },
        {
          type: 'quote', author: '世界卫生组织', source: '健康定义',
          text: '健康不仅是没有疾病，而是身体、心理和社会适应的完好状态。'
        },
        { type: 'reflection', text: '你有没有注意过，心情不好的时候身体也会不舒服？试着记录一周的情绪和身体感受，看看两者之间的关联。' }
      ]
    },
    {
      id: 'emotion-regulation',
      title: '情绪调节',
      icon: '🧘',
      color: 'var(--color-emotion-positive-deep)',
      tag: '实用技能',
      summary: '情绪调节不是压抑情绪，而是学会识别、接纳和有效管理情绪反应。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '情绪调节的目标不是"不难过"，而是"难过的时候，依然能做出明智的选择"。' },
        { type: 'section', label: '过程模型' },
        {
          type: 'info', title: '格罗斯的情绪调节过程模型',
          items: [
            { label: '情境选择', desc: '主动接近或回避某些情境来影响情绪。如选择去公园而非酒吧' },
            { label: '情境修正', desc: '改变外部环境来改变情绪影响。如调暗灯光、播放舒缓音乐' },
            { label: '注意分配', desc: '将注意力从情绪刺激上转移。如数呼吸、关注周围5样东西' },
            { label: '认知重评', desc: '改变对事件的解读方式。如"这不是失败，是反馈"' },
            { label: '反应调节', desc: '直接调整情绪表达和行为。如深呼吸后再回应' }
          ]
        },
        { type: 'section', label: '科学策略' },
        {
          type: 'info', title: '循证调节策略',
          items: [
            { label: '认知重评', desc: '最有效的策略之一：改变对事件的解读。fMRI显示它降低杏仁核激活' },
            { label: '正念冥想', desc: '不带评判地观察当下情绪，8周MBSR训练可增厚前额叶皮层' },
            { label: '表达性写作', desc: '连续4天每天15分钟写下最深感受，可改善免疫功能和情绪状态' },
            { label: '身体活动', desc: '30分钟有氧运动释放BDNF和内啡肽，抗抑郁效果与药物相当' },
            { label: '社会支持', desc: '与信任的人分享情绪可降低皮质醇23%，这是进化赋予的缓冲机制' }
          ]
        },
        {
          type: 'practice', title: '5-4-3-2-1 接地练习',
          steps: ['看到5样东西（视觉）', '触摸4样东西（触觉）', '听到3种声音（听觉）', '闻到2种气味（嗅觉）', '尝到1种味道（味觉）']
        },
        {
          type: 'fact', icon: '🧠', label: '神经科学',
          text: '命名一种情绪时，杏仁核活跃度降低约50%，前额叶皮层重新接管——这就是"命名即驯服"（Name it to tame it）的神经机制。记录心情本身就是调节。'
        }
      ]
    },
    {
      id: 'emotion-intelligence',
      title: '情绪智力',
      icon: '🧠',
      color: 'var(--color-emotion-positive)',
      tag: '能力发展',
      summary: '情绪智力（EQ）是识别、理解和管理自己及他人情绪的能力，比IQ更能预测人生成就。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '你可能听说过EQ，但你知道它到底是什么吗？它不是"会说话"，也不是"脾气好"——它是一套可以习得的技能。' },
        { type: 'section', label: '四维模型' },
        {
          type: 'info', title: '戈尔曼的情绪智力四维度',
          items: [
            { label: '自我觉察', desc: '识别和理解自己的情绪，知道它们如何影响思维和行为。这是EQ的基础' },
            { label: '自我管理', desc: '调节冲动和情绪，适应变化，保持积极。包括情绪韧性和自我激励' },
            { label: '社会觉察', desc: '感知他人的情绪和需求，理解他们的视角。核心是共情能力' },
            { label: '关系管理', desc: '有效处理人际关系，激励他人，管理冲突。这是EQ的最高表现' }
          ]
        },
        {
          type: 'quote', author: '丹尼尔·戈尔曼', source: '《情绪智力》1995',
          text: '在决定一个人成功的因素中，情绪智力的重要性是智商的两倍。'
        },
        { type: 'section', label: '提升方法' },
        {
          type: 'info', title: '如何提升情绪智力',
          items: [
            { label: '情绪日记', desc: '每天记录情绪，训练自我觉察能力。研究表明3周即可显著提升' },
            { label: '暂停练习', desc: '情绪来时先暂停6秒，让前额叶参与决策。6秒是杏仁核冲动的衰减时间' },
            { label: '共情训练', desc: '主动站在他人角度思考，练习"我理解你的感受"。镜像神经元可以被训练' },
            { label: '反馈寻求', desc: '请信任的人给你真实反馈，发现盲点。乔哈里视窗理论的核心实践' }
          ]
        },
        {
          type: 'fact', icon: '📈', label: '职场研究',
          text: ' TalentSmart对100万+人的研究发现：EQ与58%的工作绩效相关，高EQ者平均年薪高出29000美元。而且EQ不像IQ那样相对固定——它可以终身提升。'
        }
      ]
    },
    {
      id: 'stress-and-coping',
      title: '压力与应对',
      icon: '⚡',
      color: 'var(--color-emotion-negative-deep)',
      tag: '压力管理',
      summary: '压力是现代生活的常态，但并非所有压力都有害。关键在于如何应对。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '压力不是敌人。适度的压力让我们保持警觉和高效，但过度的压力会吞噬我们的健康和快乐。' },
        { type: 'section', label: '两种压力' },
        {
          type: 'keyConcept',
          items: [
            { title: '良性压力 Eustress', desc: '适度的、短期的压力，提升专注力和表现力。如演讲前的紧张、比赛前的兴奋' },
            { title: '恶性压力 Distress', desc: '过度的、长期的压力，损害身心健康。如持续的工作超负荷、关系冲突' },
            { title: '关键区别', desc: '不是压力本身，而是你对压力的解读和应对方式决定了它是"良药"还是"毒药"' },
            { title: '倒U曲线', desc: '耶克斯-多德森定律：压力与表现呈倒U形关系，中等压力下表现最佳' }
          ]
        },
        { type: 'section', label: '应对模型' },
        {
          type: 'info', title: '拉扎鲁斯压力应对模型',
          items: [
            { label: '初级评估', desc: '"这个情境对我有威胁吗？"——大脑在0.012秒内完成威胁判断' },
            { label: '次级评估', desc: '"我有资源应对吗？"——评估自身能力和可用资源' },
            { label: '问题导向应对', desc: '直接处理压力源：制定计划、寻求帮助、改变情境。适用于可控压力' },
            { label: '情绪导向应对', desc: '处理情绪反应：倾诉、运动、冥想、重构认知。适用于不可控压力' }
          ]
        },
        {
          type: 'practice', title: '4-7-8 呼吸法',
          steps: ['用鼻子吸气4秒', '屏住呼吸7秒', '用嘴缓慢呼气8秒', '重复3-4个循环', '感受副交感神经被激活']
        },
        {
          type: 'fact', icon: '💪', label: '凯利·麦格尼格尔研究',
          text: '斯坦福大学研究发现：认为压力有害的人死亡风险增加43%；而承受同样压力但不认为压力有害的人，死亡风险并不增加。改变对压力的看法，就能改变压力对身体的影响。'
        }
      ]
    },
    {
      id: 'emotion-and-relationships',
      title: '情绪与关系',
      icon: '🤝',
      color: 'var(--color-emotion-positive-deep)',
      tag: '人际智慧',
      summary: '人际关系是情绪的重要来源和调节器。理解情绪在关系中的角色，是建立深度连接的关键。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '我们很少独自感受情绪——大多数情绪都发生在关系的语境中。关系是情绪的放大器，也是缓冲器。' },
        { type: 'section', label: '情绪功能' },
        {
          type: 'info', title: '情绪在关系中的三种功能',
          items: [
            { label: '信号功能', desc: '情绪向他人传递我们的需求和状态：微笑表示接纳，皱眉表示不满。这是非语言沟通的核心' },
            { label: '协调功能', desc: '情绪帮助双方同步状态：共情让我们"感受"对方的感受。镜像神经元是生理基础' },
            { label: '调节功能', desc: '关系中的互动调节彼此的情绪：安慰降低焦虑23%，而批评使防御增加3倍' }
          ]
        },
        { type: 'section', label: '修复策略' },
        {
          type: 'info', title: '戈特曼的关系修复策略',
          items: [
            { label: '柔和启动', desc: '用"我感到..."而非"你总是..."开始对话。前者激活共情，后者激活防御' },
            { label: '修复尝试', desc: '在冲突中主动发出和解信号：道歉、幽默、暂停。关键不是不冲突，而是会修复' },
            { label: '情绪接纳', desc: '承认对方的感受是真实的，即使你不认同原因。"我能理解你为什么这么想"' },
            { label: '5:1比例', desc: '健康关系中积极互动与消极互动的比例至少为5:1。这是戈特曼"爱情实验室"的核心发现' }
          ]
        },
        {
          type: 'quote', author: '约翰·戈特曼', source: '《幸福的婚姻》',
          text: '每一段关系中都有冲突，但决定关系走向的不是冲突本身，而是修复的方式。'
        },
        {
          type: 'fact', icon: '💕', label: '依恋理论',
          text: '鲍尔比的依恋理论发现：童年形成的依恋模式（安全型、焦虑型、回避型）深刻影响成年后的情绪关系模式。好消息是：通过觉察和练习，不安全依恋可以向安全型转变。'
        }
      ]
    },
    {
      id: 'emotion-and-creativity',
      title: '情绪与创造力',
      icon: '🎨',
      color: 'var(--color-emotion-positive)',
      tag: '创造潜能',
      summary: '情绪不是创造力的敌人，而是它的燃料。不同情绪状态激发不同类型的创造性思维。',
      panels: [
        { type: 'viz' },
        { type: 'dialogue', speaker: '旁白', text: '你可能以为只有"开心"才能创造，但研究表明：每种情绪都有其独特的创造力优势。' },
        { type: 'section', label: '情绪优势' },
        {
          type: 'keyConcept',
          items: [
            { title: '积极情绪→发散', desc: '拓宽思维范围，促进联想和创新组合，适合头脑风暴和概念生成' },
            { title: '消极情绪→收敛', desc: '增强专注力和细节处理，适合编辑、修改和深度分析思考' },
            { title: '愤怒→突破', desc: '增加突破常规的勇气，促进"打破框架"的创新。愤怒者更倾向于拒绝现状' },
            { title: '悲伤→深度', desc: '提升分析深度和审美敏感度。许多伟大作品诞生于忧郁——悲伤让人更用心地观察' }
          ]
        },
        {
          type: 'quote', author: '苏珊·凯恩', source: '《安静》',
          text: '世界上许多最具创造力的人都是内向的、忧郁的——他们不是因为悲伤而创造，而是因为创造而找到了悲伤的意义。'
        },
        { type: 'section', label: '实用方法' },
        {
          type: 'info', title: '利用情绪提升创造力',
          items: [
            { label: '情绪匹配', desc: '根据当前情绪选择合适的创作任务：开心时发散，悲伤时打磨，愤怒时突破' },
            { label: '情绪转换', desc: '刻意切换情绪状态来突破思维瓶颈：散步、听音乐、换环境、与人交谈' },
            { label: '双相优势', desc: '轻度躁狂与抑郁的交替（双相谱系）与创造力高度相关——但需要专业管理' },
            { label: '情绪记录', desc: '追踪情绪与创作产出的关系，发现你的最佳创作模式和个人节奏' }
          ]
        },
        {
          type: 'fact', icon: '🎭', label: '扩展-建构理论',
          text: '芭芭拉·弗雷德里克森的扩展-建构理论发现：积极情绪"扩展"认知范围，使人注意到更多可能性；这些扩展的思维模式"建构"持久的个人资源。消极情绪则收窄注意力，这在危险中有用，但在创造中是障碍。'
        },
        { type: 'reflection', text: '回想你最富创造力的时刻——你当时是什么情绪？试着找出你的"最佳创作情绪"，然后在那个状态下开始创作。' }
      ]
    }
  ],

  activeModule: null,

  render() {
    return `
      <div class="page-knowledge">
        <section class="knowledge-header comic-panel">
          <h1 class="text-h1">情绪科学</h1>
          <p class="text-body-lg">用算法艺术与漫画的方式，探索情绪背后的心理学</p>
        </section>

        <section class="knowledge-modules">
          ${this.modules.map((m, i) => `
            <div class="comic-card knowledge-module-card" data-gesture data-module="${m.id}" style="--module-accent: ${m.color}">
              <span class="module-number">${String(i + 1).padStart(2, '0')}</span>
              <div class="module-icon" style="background-color: ${m.color}">${m.icon}</div>
              <div class="module-info">
                <h3 class="text-h4">${m.title}</h3>
                <p class="text-body-sm">${m.summary}</p>
                <span class="module-tag">${m.tag}</span>
              </div>
              <div class="module-arrow">→</div>
            </div>
          `).join('')}
        </section>

        <div class="comic-modal-overlay" id="knowledge-modal">
          <div class="comic-modal-content knowledge-modal-content">
            <button class="modal-close comic-btn" id="knowledge-modal-close" aria-label="关闭">✕</button>
            <div id="knowledge-modal-body"></div>
          </div>
        </div>
      </div>
    `;
  },

  mount() {
    document.querySelectorAll('.knowledge-module-card').forEach(card => {
      card.addEventListener('click', () => {
        const moduleId = card.dataset.module;
        this.openModule(moduleId);
      });
    });

    const closeBtn = document.getElementById('knowledge-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModule());
    }

    const overlay = document.getElementById('knowledge-modal');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModule();
      });

      this._touchStartY = 0;
      overlay.addEventListener('touchstart', (e) => {
        this._touchStartY = e.touches[0].clientY;
      }, { passive: true });
      overlay.addEventListener('touchend', (e) => {
        const deltaY = e.changedTouches[0].clientY - this._touchStartY;
        if (deltaY > 80) this.closeModule();
      }, { passive: true });
    }

    document.addEventListener('keydown', this._keyHandler = (e) => {
      if (e.key === 'Escape') this.closeModule();
    });
  },

  unmount() {
    document.removeEventListener('keydown', this._keyHandler);
    KnowledgeViz.destroy();
  },

  openModule(moduleId) {
    const mod = this.modules.find(m => m.id === moduleId);
    if (!mod) return;

    this.activeModule = moduleId;
    const body = document.getElementById('knowledge-modal-body');
    if (!body) return;

    body.innerHTML = `
      <div class="module-detail">
        <div class="module-detail-header">
          <span class="module-detail-icon">${mod.icon}</span>
          <h2 class="text-h2">${mod.title}</h2>
          <span class="module-tag" style="--module-accent: ${mod.color}">${mod.tag}</span>
        </div>
        <div class="module-panels">
          ${mod.panels.map((panel, i) => this.renderPanel(panel, i, mod)).join('')}
        </div>
      </div>
    `;

    const overlay = document.getElementById('knowledge-modal');
    if (overlay) {
      overlay.classList.add('open');
      this.animateModalContent();
    }

    const vizPanel = body.querySelector('.knowledge-viz-container');
    if (vizPanel) {
      vizPanel.id = 'knowledge-viz-' + moduleId;
      setTimeout(() => {
        KnowledgeViz.create('knowledge-viz-' + moduleId, moduleId);
      }, 100);
    }
  },

  renderPanel(panel, index, mod) {
    switch (panel.type) {
      case 'viz':
        return `
          <div class="knowledge-viz-container">
            <span class="knowledge-viz-label">生成式可视化</span>
          </div>
        `;
      case 'dialogue':
        return `
          <div class="comic-dialogue-bubble module-dialogue" style="animation-delay: ${index * 200}ms">
            <span class="dialogue-speaker">${panel.speaker}</span>
            <p class="text-body">${panel.text}</p>
          </div>
        `;
      case 'info':
        return `
          <div class="module-info-panel comic-card">
            <h4 class="text-h4">${panel.title}</h4>
            <ul class="info-list">
              ${panel.items.map(item => `
                <li class="info-item">
                  <strong class="info-item-label">${item.label}</strong>
                  <span class="text-body-sm">${item.desc}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      case 'quote':
        return `
          <div class="module-quote-panel">
            <blockquote class="module-quote">
              <p class="text-body">"${panel.text}"</p>
              <footer class="module-quote-footer">
                <span class="quote-author">${panel.author}</span>
                <span class="quote-source">${panel.source}</span>
              </footer>
            </blockquote>
          </div>
        `;
      case 'tip':
        return `
          <div class="module-tip-panel comic-card">
            <div class="tip-icon">💡</div>
            <h4 class="text-h4">${panel.title}</h4>
            <p class="text-body-sm">${panel.text}</p>
          </div>
        `;
      case 'visual':
        if (panel.content === 'valence-slider') {
          return this.renderValenceSlider();
        }
        return '';
      case 'section':
        return `
          <div class="module-section-divider">
            <span>${panel.label}</span>
          </div>
        `;
      case 'keyConcept':
        return `
          <div class="module-key-concept">
            ${panel.items.map(item => `
              <div class="module-key-concept-item" style="--module-accent: ${mod.color}">
                <h5>${item.title}</h5>
                <p>${item.desc}</p>
              </div>
            `).join('')}
          </div>
        `;
      case 'fact':
        return `
          <div class="module-fact-box">
            <span class="module-fact-icon">${panel.icon}</span>
            <div class="module-fact-content">
              <div class="module-fact-label">${panel.label}</div>
              <div class="module-fact-text">${panel.text}</div>
            </div>
          </div>
        `;
      case 'practice':
        return `
          <div class="module-practice-card">
            <h5>🧪 ${panel.title}</h5>
            <div class="module-practice-steps">
              ${panel.steps.map((step, i) => `
                <div class="module-practice-step">
                  <span class="module-practice-step-num">${i + 1}</span>
                  <span>${step}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 'reflection':
        return `
          <div class="module-reflection">
            <h5>💭 自我反思</h5>
            <p>${panel.text}</p>
          </div>
        `;
      default:
        return '';
    }
  },

  renderValenceSlider() {
    return `
      <div class="valence-visual comic-card">
        <div class="valence-bar">
          <div class="valence-gradient"></div>
          <div class="valence-labels">
            <span class="valence-label-negative">消极 -1</span>
            <span class="valence-label-neutral">中性 0</span>
            <span class="valence-label-positive">积极 +1</span>
          </div>
          <div class="valence-markers">
            <span class="valence-marker" style="left: 10%">😢</span>
            <span class="valence-marker" style="left: 30%">😔</span>
            <span class="valence-marker" style="left: 50%">😐</span>
            <span class="valence-marker" style="left: 70%">🙂</span>
            <span class="valence-marker" style="left: 90%">😄</span>
          </div>
        </div>
        <p class="handwriting-note">效价轴：从消极到积极的连续光谱</p>
      </div>
    `;
  },

  closeModule() {
    KnowledgeViz.destroy();
    const overlay = document.getElementById('knowledge-modal');
    if (overlay) {
      overlay.classList.remove('open');
    }
    this.activeModule = null;
  },

  animateModalContent() {
    if (!AnimationEngine.shouldAnimate()) return;

    const bubbles = document.querySelectorAll('.module-dialogue');
    AnimationEngine.staggerReveal(bubbles, 200);

    const infoPanels = document.querySelectorAll('.module-info-panel, .valence-visual, .module-quote-panel, .module-tip-panel, .module-fact-box, .module-practice-card, .module-reflection, .module-key-concept, .module-section-divider');
    AnimationEngine.staggerReveal(infoPanels, 300);
  }
};
