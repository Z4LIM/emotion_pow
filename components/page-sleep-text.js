const PageSleepText = {
  _currentTab: 'quotes',
  _currentEssay: null,
  _typewriterTimer: null,
  soundNames: {
    'forest-night': '🌲 森林夜雨流水',
    'forest-bird': '🐦 林间鸟鸣韵律',
    'forest-morning': '🌅 森林清晨能量',
    'ocean-rain': '🌊 海雨涛声',
    'bowl-wave': '🧘 颂钵海浪',
    'anxiety-relief': '😌 焦虑放松',
    'stress-ancient': '🏯 世外桃源古曲',
    'hypnosis-heal': '💫 催眠净化心灵',
    'nature-energy': '🌿 大自然能量疗愈',
    'calm-nerves': '🛏️ 安神助眠',
    'brain-guide': '🧠 平和大脑引导',
    'spiritual-peace': '✨ 祥和灵性',
    'dreamy-dusk': '🌆 梦幻黄昏',
    'pastoral-dusk': '🎵 牧童短笛黄昏'
  },

  render() {
    const currentSound = SleepAudio.getCurrentSound();
    const isPlaying = SleepAudio.isPlaying();
    const musicBtnText = currentSound ? this.soundNames[currentSound] : '🔇 背景音乐';

    return `
      <div class="sleep-page sleep-text-page" style="position:relative;">
        <button class="sleep-back-btn" onclick="location.hash='#/sleep'">← 返回</button>

        <div class="sleep-music-control">
          <button class="sleep-music-btn" id="sleep-music-toggle">
            ${isPlaying ? '▶' : '🔇'} ${musicBtnText}
          </button>
          <div class="sleep-music-panel" id="sleep-music-panel">
            <div class="sleep-music-panel-header">
              <span>背景音乐</span>
              <button class="sleep-music-panel-close" id="sleep-music-close">×</button>
            </div>
            <div class="sleep-music-sounds">
              ${Object.entries(this.soundNames).map(([id, name]) => `
                <button class="sleep-music-sound-btn" data-sound="${id}" title="${name}">
                  ${name.split(' ')[0]}
                </button>
              `).join('')}
            </div>
            <div class="sleep-music-volume">
              <span class="sleep-music-volume-icon">🔊</span>
              <input type="range" class="sleep-music-volume-slider" id="sleep-music-volume" min="0" max="100" value="50">
            </div>
            <div class="sleep-music-actions">
              <button class="sleep-music-play-btn" id="sleep-music-play">
                ${isPlaying ? '⏸ 暂停' : '▶ 播放'}
              </button>
              <button class="sleep-music-stop-btn" id="sleep-music-stop">🔇 关闭</button>
            </div>
          </div>
        </div>

        <header class="sleep-header">
          <h1>睡前文字</h1>
        </header>

        <div class="sleep-text-tabs">
          <button class="sleep-tab active" data-tab="quotes">反内耗短句</button>
          <button class="sleep-tab" data-tab="story">治愈小故事</button>
          <button class="sleep-tab" data-tab="letter">给今晚的自己</button>
        </div>

        <div class="sleep-tab-content" id="sleep-text-content"></div>
      </div>
    `;
  },

  mount() {
    document.querySelectorAll('.sleep-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sleep-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._currentTab = tab.dataset.tab;
        this._renderTab();
      });
    });

    // 检查是否从场景卡片进入
    const hash = location.hash;
    const sceneMatch = hash.match(/scene=([^&]+)/);
    if (sceneMatch) {
      const sceneId = sceneMatch[1];
      const sceneContent = SleepQuotes.getSceneContent(sceneId);
      if (sceneContent.tab) {
        this._currentTab = sceneContent.tab;
        document.querySelectorAll('.sleep-tab').forEach(t => t.classList.remove('active'));
        const targetTab = document.querySelector(`.sleep-tab[data-tab="${sceneContent.tab}"]`);
        if (targetTab) targetTab.classList.add('active');
      }
      if (sceneContent.essayId) {
        this._currentEssay = sceneContent.essayId;
      }
    }

    // 加载音量偏好
    const pref = SleepStorage.getMusicPreference();
    const volumeSlider = document.getElementById('sleep-music-volume');
    if (volumeSlider) {
      volumeSlider.value = (pref.lastVolume || 0.5) * 100;
      SleepAudio.setVolume(pref.lastVolume || 0.5);
    }

    // 更新声音按钮激活状态
    this._updateSoundButtons();

    this._renderTab(sceneMatch ? sceneMatch[1] : null);
    this._bindMusicControls();
  },

  _renderTab(sceneId) {
    if (this._typewriterTimer) {
      clearInterval(this._typewriterTimer);
      this._typewriterTimer = null;
    }

    const container = document.getElementById('sleep-text-content');
    if (!container) return;

    let content = null;
    if (sceneId) {
      const sceneContent = SleepQuotes.getSceneContent(sceneId);
      content = sceneContent.content;
    }

    if (this._currentTab === 'quotes') {
      const quote = content || SleepQuotes.getRandomQuote();
      container.innerHTML = `
        <div class="sleep-quote-card">
          <div class="sleep-quote-text" id="sleep-current-quote">${Array.isArray(quote) ? quote[0] : quote}</div>
          <button class="sleep-quote-refresh" id="sleep-quote-refresh">换一条 ✨</button>
        </div>
      `;
      const refreshBtn = document.getElementById('sleep-quote-refresh');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          const textEl = document.getElementById('sleep-current-quote');
          if (textEl) {
            if (AnimationEngine.shouldAnimate()) {
              anime({
                targets: textEl,
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuad',
                complete: () => {
                  textEl.textContent = Array.isArray(content) ? content[Math.floor(Math.random() * content.length)] : SleepQuotes.getRandomQuote();
                  anime({ targets: textEl, opacity: [0, 1], duration: 300 });
                }
              });
            } else {
              textEl.textContent = Array.isArray(content) ? content[Math.floor(Math.random() * content.length)] : SleepQuotes.getRandomQuote();
            }
          }
        });
      }
    } else if (this._currentTab === 'story') {
      if (this._currentEssay) {
        const essay = SleepQuotes.getEssayById(this._currentEssay);
        if (essay) {
          container.innerHTML = `
            <div class="sleep-essay-reader">
              <button class="sleep-essay-back" id="sleep-essay-back">← 返回列表</button>
              <div class="sleep-essay-reader-title">${essay.title}</div>
              <div class="sleep-essay-reader-mood">${essay.mood}</div>
              <div class="sleep-essay-reader-text" id="sleep-story-text"></div>
            </div>
          `;
          const backBtn = document.getElementById('sleep-essay-back');
          if (backBtn) {
            backBtn.addEventListener('click', () => {
              this._currentEssay = null;
              this._renderTab();
            });
          }
          this._startTypewriter(essay.text);
        }
      } else {
        const essays = SleepQuotes.essays;
        container.innerHTML = `
          <div class="sleep-essay-list">
            ${essays.map(e => `
              <div class="sleep-essay-card" data-essay-id="${e.id}">
                <div class="sleep-essay-title">${e.title}</div>
                <div class="sleep-essay-tags">
                  <span class="sleep-essay-mood">${e.mood.split('、')[0]}</span>
                  <span class="sleep-essay-music">${e.musicStyle.split('，')[0]}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        document.querySelectorAll('.sleep-essay-card').forEach(card => {
          card.addEventListener('click', () => {
            this._currentEssay = card.dataset.essayId;
            this._renderTab();
          });
        });
      }
    } else if (this._currentTab === 'letter') {
      const letters = SleepQuotes.letters;
      container.innerHTML = letters.map(l => `
        <div class="sleep-letter-card">
          <div class="sleep-letter-text">${l.text}</div>
          <div class="sleep-letter-author">—— ${l.author}</div>
        </div>
      `).join('');
    }
  },

  _startTypewriter(text) {
    const el = document.getElementById('sleep-story-text');
    if (!el) return;
    let i = 0;
    el.textContent = '';
    this._typewriterTimer = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(this._typewriterTimer);
        this._typewriterTimer = null;
      }
    }, 80);
  },

  _bindMusicControls() {
    const toggleBtn = document.getElementById('sleep-music-toggle');
    const panel = document.getElementById('sleep-music-panel');
    const closeBtn = document.getElementById('sleep-music-close');
    const playBtn = document.getElementById('sleep-music-play');
    const stopBtn = document.getElementById('sleep-music-stop');
    const volumeSlider = document.getElementById('sleep-music-volume');

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('show');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.classList.remove('show');
      });
    }

    document.querySelectorAll('.sleep-music-sound-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const soundId = btn.dataset.sound;
        SleepAudio.play(soundId);
        this._updateSoundButtons();
        this._updateMusicBtn();
      });
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (SleepAudio.isPlaying()) {
          SleepAudio.pause();
        } else if (SleepAudio.getCurrentSound()) {
          SleepAudio.play(SleepAudio.getCurrentSound());
        } else {
          SleepAudio.play('forest-night');
        }
        this._updateSoundButtons();
        this._updateMusicBtn();
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        SleepAudio.stop();
        this._updateSoundButtons();
        this._updateMusicBtn();
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        SleepAudio.setVolume(e.target.value / 100);
      });
    }
  },

  _updateSoundButtons() {
    const currentSound = SleepAudio.getCurrentSound();
    document.querySelectorAll('.sleep-music-sound-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sound === currentSound);
    });
  },

  _updateMusicBtn() {
    const btn = document.getElementById('sleep-music-toggle');
    if (!btn) return;
    const currentSound = SleepAudio.getCurrentSound();
    const isPlaying = SleepAudio.isPlaying();
    btn.textContent = currentSound ? (isPlaying ? '▶ ' : '🔇 ') + this.soundNames[currentSound] : '🔇 背景音乐';

    // Also update play button
    const playBtn = document.getElementById('sleep-music-play');
    if (playBtn) {
      playBtn.textContent = isPlaying ? '⏸ 暂停' : '▶ 播放';
      playBtn.classList.toggle('playing', isPlaying);
    }
  },

  unmount() {
    if (this._typewriterTimer) {
      clearInterval(this._typewriterTimer);
      this._typewriterTimer = null;
    }
    this._currentEssay = null;
  }
};
