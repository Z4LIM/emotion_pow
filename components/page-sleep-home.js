const PageSleepHome = {
  sleepScenes: [
    {
      id: 'rain-letters',
      name: '窗月知意',
      icon: '🌲',
      music: 'forest-night',
      description: '深夜怀思、独处怅然'
    },
    {
      id: 'bedtime-story',
      name: '风月知欢',
      icon: '🎵',
      music: 'pastoral-dusk',
      description: '心生欢喜、相思温柔'
    },
    {
      id: 'nature-healing',
      name: '山野寄心',
      icon: '🐦',
      music: 'forest-bird',
      description: '人际倦累、渴望松弛'
    },
    {
      id: 'ocean-release',
      name: '云间忘忧',
      icon: '🌊',
      music: 'ocean-rain',
      description: '思绪纷乱、执念难消'
    },
    {
      id: 'warm-fireplace',
      name: '温岁安然',
      icon: '✨',
      music: 'spiritual-peace',
      description: '感念流年、淡然自愈'
    },
    {
      id: 'nostalgic-radio',
      name: '朝暮期许',
      icon: '🌆',
      music: 'dreamy-dusk',
      description: '前路迷茫、温柔蓄力'
    },
    {
      id: 'tide-breathe',
      name: '静念自愈',
      icon: '🧘',
      music: 'bowl-wave',
      description: '学业承压、自我怀疑'
    },
    {
      id: 'study-recharge',
      name: '浅夏安隅',
      icon: '🛏️',
      music: 'calm-nerves',
      description: '心绪躁动、满心浮躁'
    }
  ],

  render() {
    const quote = SleepQuotes.getRandomQuote();
    const scenesHtml = this.sleepScenes.map(scene => `
      <div class="sleep-scene-card" data-scene="${scene.id}" data-music="${scene.music}">
        <div class="sleep-scene-icon">${scene.icon}</div>
        <div class="sleep-scene-name">${scene.name}</div>
        <div class="sleep-scene-desc">${scene.description}</div>
      </div>
    `).join('');

    return `
      <div class="sleep-page sleep-home-page">
        <header class="sleep-header">
          <h1>今夜，放轻松</h1>
          <p class="sleep-subtitle">睡个好觉，明天会更好</p>
        </header>

        <div class="sleep-scenes-section">
          <div class="sleep-scenes-title">🌙 沉浸式模式</div>
          <div class="sleep-scenes-container">
            <div class="sleep-scenes-grid">
              ${scenesHtml}
            </div>
          </div>
        </div>

        <div class="sleep-modules">
          <a href="#/sleep/white-noise" class="sleep-module-card" style="--accent:var(--sleep-rain)">
            <div class="sleep-module-icon">🌧️</div>
            <div class="sleep-module-title">白噪音</div>
            <div class="sleep-module-desc">雨声、书页、吉他伴你入眠</div>
          </a>
          <a href="#/sleep/text" class="sleep-module-card" style="--accent:var(--sleep-moon)">
            <div class="sleep-module-icon">🌙</div>
            <div class="sleep-module-title">睡前文字</div>
            <div class="sleep-module-desc">反内耗短句与治愈故事</div>
          </a>
          <a href="#/sleep/treehole" class="sleep-module-card" style="--accent:var(--sleep-star)">
            <div class="sleep-module-icon">💫</div>
            <div class="sleep-module-title">情绪树洞</div>
            <div class="sleep-module-desc">今天没说出口的话，留在这里吧</div>
          </a>
        </div>

        <div class="sleep-quote">
          <span class="sleep-quote-icon">✨</span>
          <span class="sleep-quote-text">${quote}</span>
        </div>

        <a href="#/sleep/goodnight" class="sleep-cta-button">晚安打卡 🌟</a>
      </div>
    `;
  },

  mount() {
    const cards = document.querySelectorAll('.sleep-module-card');
    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: cards,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(150),
        duration: 500,
        easing: 'easeOutQuad'
      });
    }

    const sceneCards = document.querySelectorAll('.sleep-scene-card');
    sceneCards.forEach(card => {
      card.addEventListener('click', () => {
        const sceneId = card.dataset.scene;
        const musicId = card.dataset.music;

        SleepStorage.saveMusicPreference({
          ...SleepStorage.getMusicPreference(),
          lastScene: sceneId
        });

        SleepAudio.play(musicId);
        location.hash = `/sleep/text?scene=${sceneId}`;
      });
    });
  },

  unmount() {}
};
