const PageStories = {
  stories: [
    {
      id: 'anxiety-adventure',
      title: '焦虑大冒险',
      description: '跟随小安一起，学会识别和应对焦虑情绪',
      cover: '🌊',
      color: 'var(--color-emotion-negative)',
      pages: [
        {
          panels: [
            { type: 'dialogue', speaker: '旁白', text: '这是小安。今天，她感到一种说不清的不安...' },
            { type: 'scene', description: '小安坐在办公桌前，窗外乌云密布', mood: 'anxious' },
            { type: 'dialogue', speaker: '小安', text: '心跳好快...我是不是忘了什么重要的事？' }
          ]
        },
        {
          panels: [
            { type: 'dialogue', speaker: '旁白', text: '焦虑是大脑的警报系统。它在说："注意！可能有危险！"' },
            { type: 'info', title: '焦虑的本质', items: [
              { label: '进化功能', desc: '焦虑帮助我们的祖先预见危险、提前准备' },
              { label: '现代困境', desc: '在安全的环境中，警报系统可能过度敏感' },
              { label: '关键认知', desc: '焦虑≠危险，它只是一个信号' }
            ]},
            { type: 'dialogue', speaker: '小安', text: '所以...我的心跳加速，只是在提醒我注意？' }
          ]
        },
        {
          panels: [
            { type: 'dialogue', speaker: '旁白', text: '小安尝试了一个简单的方法：5-4-3-2-1 感官练习' },
            { type: 'info', title: '5-4-3-2-1 接地练习', items: [
              { label: '5', desc: '看到的东西' },
              { label: '4', desc: '触摸到的东西' },
              { label: '3', desc: '听到的声音' },
              { label: '2', desc: '闻到的气味' },
              { label: '1', desc: '尝到的味道' }
            ]},
            { type: 'dialogue', speaker: '小安', text: '窗外的树...键盘的触感...空调的声音...咖啡的香味...嗯，好多了。' }
          ]
        }
      ]
    },
    {
      id: 'sadness-rain',
      title: '悲伤的雨季',
      description: '理解悲伤的意义，学会与它和平共处',
      cover: '🌧️',
      color: 'var(--color-emotion-negative-deep)',
      pages: [
        {
          panels: [
            { type: 'dialogue', speaker: '旁白', text: '有时候，悲伤就像一场不期而至的雨...' },
            { type: 'scene', description: '雨天，窗边，一杯温热的茶', mood: 'sad' },
            { type: 'dialogue', speaker: '旁白', text: '但雨水滋润大地，悲伤也在滋养我们的内心。' }
          ]
        },
        {
          panels: [
            { type: 'info', title: '悲伤的积极面', items: [
              { label: '信号功能', desc: '告诉自己和他人：我需要帮助和支持' },
              { label: '深度思考', desc: '悲伤让我们慢下来，重新审视重要的事' },
              { label: '增强共情', desc: '经历过悲伤的人更能理解他人的痛苦' },
              { label: '情感韧性', desc: '每次经历悲伤并恢复，都会变得更坚强' }
            ]},
            { type: 'dialogue', speaker: '旁白', text: '允许自己悲伤，不是软弱，而是勇敢。' }
          ]
        }
      ]
    },
    {
      id: 'joy-garden',
      title: '喜悦花园',
      description: '发现日常生活中的小确幸，培育积极情绪',
      cover: '🌸',
      color: 'var(--color-emotion-positive-deep)',
      pages: [
        {
          panels: [
            { type: 'dialogue', speaker: '旁白', text: '喜悦不需要宏大的理由，它藏在每一个微小的瞬间里。' },
            { type: 'scene', description: '阳光透过树叶的缝隙，洒下斑驳的光影', mood: 'joyful' },
            { type: 'dialogue', speaker: '旁白', text: '关键不是寻找喜悦，而是注意到它一直都在。' }
          ]
        },
        {
          panels: [
            { type: 'info', title: '培养积极情绪的科学方法', items: [
              { label: '感恩练习', desc: '每天写下三件感恩的事，重塑大脑的注意力模式' },
              { label: '品味当下', desc: '有意识地延长和深化积极体验' },
              { label: '善意行动', desc: '帮助他人是提升自身幸福感的有效方式' },
              { label: '社交连接', desc: '与他人的深度连接是幸福感的最强预测因子' }
            ]}
          ]
        }
      ]
    }
  ],

  activeStoryId: null,
  currentPageIndex: 0,

  render(params) {
    const storyId = params?.storyId;

    if (storyId) {
      return this.renderStoryReader(storyId);
    }

    return this.renderStoryList();
  },

  renderStoryList() {
    return `
      <div class="page-stories">
        <section class="stories-header comic-panel">
          <h1 class="text-h1">情绪故事</h1>
          <p class="text-body-lg">用漫画故事，走进情绪的世界</p>
        </section>

        <section class="stories-list">
          ${this.stories.map(s => `
            <div class="comic-card story-card" data-gesture data-story="${s.id}">
              <div class="story-cover" style="background-color: ${s.color}">
                <span class="story-cover-emoji">${s.cover}</span>
              </div>
              <div class="story-info">
                <h3 class="text-h4">${s.title}</h3>
                <p class="text-body-sm">${s.description}</p>
                <span class="comic-tag">阅读故事</span>
              </div>
            </div>
          `).join('')}
        </section>

        <section class="stories-coming comic-card">
          <div class="coming-icon">🎨</div>
          <h3 class="text-h4">更多故事即将到来</h3>
          <p class="text-body-sm">我们正在创作更多关于情绪的漫画故事，敬请期待</p>
        </section>
      </div>
    `;
  },

  renderStoryReader(storyId) {
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return this.renderStoryList();

    this.activeStoryId = storyId;
    const page = story.pages[this.currentPageIndex] || story.pages[0];
    const totalPages = story.pages.length;

    return `
      <div class="page-stories">
        <div class="story-reader">
          <div class="story-reader-header">
            <a href="#/stories" class="comic-btn story-back-btn" data-gesture>← 返回</a>
            <h3 class="text-h4">${story.title}</h3>
            <span class="text-caption">${this.currentPageIndex + 1} / ${totalPages}</span>
          </div>

          <div class="story-pages" id="story-pages">
            ${this.renderStoryPage(page)}
          </div>

          <div class="story-nav">
            <button class="comic-btn" id="story-prev" ${this.currentPageIndex === 0 ? 'disabled' : ''} data-gesture>
              ← 上一页
            </button>
            <div class="story-dots">
              ${story.pages.map((_, i) => `
                <span class="story-dot ${i === this.currentPageIndex ? 'story-dot-active' : ''}"></span>
              `).join('')}
            </div>
            <button class="comic-btn comic-btn-primary" id="story-next" 
                    ${this.currentPageIndex >= totalPages - 1 ? 'disabled' : ''} data-gesture>
              下一页 →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderStoryPage(page) {
    return `
      <div class="story-page">
        ${page.panels.map((panel, i) => {
          switch (panel.type) {
            case 'dialogue':
              return `
                <div class="comic-dialogue-bubble story-dialogue" style="animation-delay: ${i * 200}ms">
                  <span class="dialogue-speaker">${panel.speaker}</span>
                  <p class="text-body">${panel.text}</p>
                </div>
              `;
            case 'scene':
              return `
                <div class="story-scene comic-panel" data-mood="${panel.mood || ''}">
                  <div class="scene-placeholder">
                    <span class="scene-mood-emoji">${this.getMoodEmoji(panel.mood)}</span>
                    <p class="handwriting-note">${panel.description}</p>
                  </div>
                </div>
              `;
            case 'info':
              return `
                <div class="story-info comic-card">
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
            default:
              return '';
          }
        }).join('')}
      </div>
    `;
  },

  getMoodEmoji(mood) {
    const map = { anxious: '😰', sad: '😢', joyful: '😊', angry: '😠', neutral: '😐' };
    return map[mood] || '📖';
  },

  mount(params) {
    const storyId = params?.storyId;

    document.querySelectorAll('.story-card').forEach(card => {
      card.addEventListener('click', () => {
        this.currentPageIndex = 0;
        window.location.hash = `#/stories/${card.dataset.story}`;
      });
    });

    if (storyId) {
      const prevBtn = document.getElementById('story-prev');
      const nextBtn = document.getElementById('story-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.refreshReader(storyId);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const story = this.stories.find(s => s.id === storyId);
          if (story && this.currentPageIndex < story.pages.length - 1) {
            this.currentPageIndex++;
            this.refreshReader(storyId);
          }
        });
      }

      GestureManager.on('gesture-swipe', (data) => {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;
        if (data.direction === 'left' && this.currentPageIndex < story.pages.length - 1) {
          this.currentPageIndex++;
          this.refreshReader(storyId);
        } else if (data.direction === 'right' && this.currentPageIndex > 0) {
          this.currentPageIndex--;
          this.refreshReader(storyId);
        }
      });
    }
  },

  refreshReader(storyId) {
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return;

    const pagesEl = document.getElementById('story-pages');
    const page = story.pages[this.currentPageIndex];
    if (pagesEl && page) {
      if (AnimationEngine.shouldAnimate()) {
        anime({
          targets: pagesEl,
          opacity: [0, 1],
          translateX: [30, 0],
          duration: 500,
          easing: 'easeInOutQuad'
        });
      }
      pagesEl.innerHTML = this.renderStoryPage(page);
    }

    const dots = document.querySelectorAll('.story-dot');
    dots.forEach((d, i) => d.classList.toggle('story-dot-active', i === this.currentPageIndex));

    const prevBtn = document.getElementById('story-prev');
    const nextBtn = document.getElementById('story-next');
    if (prevBtn) prevBtn.disabled = this.currentPageIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentPageIndex >= story.pages.length - 1;

    const counter = document.querySelector('.story-reader-header .text-caption');
    if (counter) counter.textContent = `${this.currentPageIndex + 1} / ${story.pages.length}`;
  },

  unmount() {
    this.activeStoryId = null;
    this.currentPageIndex = 0;
  }
};
