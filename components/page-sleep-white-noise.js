const PageSleepWhiteNoise = {
  render() {
    const categories = [
      { key: 'nature', title: '🌿 自然白噪音' },
      { key: 'healing', title: '🧘 疗愈冥想' },
      { key: 'ambience', title: '🎵 氛围音乐' }
    ];

    const categoriesHtml = categories.map(cat => {
      const sounds = SleepAudio.getSoundsByCategory(cat.key);
      const cardsHtml = sounds.map(s => `
        <div class="sleep-sound-card" data-sound="${s.id}">
          <div class="sleep-sound-icon">${s.icon}</div>
          <div class="sleep-sound-name">${s.name}</div>
        </div>
      `).join('');

      return `
        <div class="sleep-sound-category">${cat.title}</div>
        <div class="sleep-sounds-category-grid">
          ${cardsHtml}
        </div>
      `;
    }).join('');

    return `
      <div class="sleep-page sleep-white-noise-page" style="position:relative;">
        <button class="sleep-back-btn" onclick="location.hash='#/sleep'">← 返回</button>
        <header class="sleep-header">
          <h1>白噪音</h1>
        </header>

        <div style="max-width:500px;margin:0 auto 24px;">
          ${categoriesHtml}
        </div>

        <div class="sleep-player" id="sleep-player">
          <div class="sleep-player-visualizer" id="sleep-visualizer">
            <div class="sleep-visualizer-bar" style="height:4px;"></div>
            <div class="sleep-visualizer-bar" style="height:4px;"></div>
            <div class="sleep-visualizer-bar" style="height:4px;"></div>
            <div class="sleep-visualizer-bar" style="height:4px;"></div>
            <div class="sleep-visualizer-bar" style="height:4px;"></div>
          </div>
          <button class="sleep-play-btn" id="sleep-play-btn">▶ 播放</button>
          <div class="sleep-timer">
            <span>定时关闭</span>
            <button data-minutes="10" class="sleep-timer-btn">10分钟</button>
            <button data-minutes="20" class="sleep-timer-btn">20分钟</button>
            <button data-minutes="30" class="sleep-timer-btn">30分钟</button>
            <span id="sleep-timer-display" class="sleep-timer-display"></span>
          </div>
          <div class="sleep-volume-slider">
            <input type="range" id="sleep-volume" min="0" max="100" value="50">
          </div>
        </div>
      </div>
    `;
  },

  _vizFrame: null,

  mount() {
    const pref = SleepStorage.getMusicPreference();
    const volumeSlider = document.getElementById('sleep-volume');
    if (volumeSlider) {
      volumeSlider.value = (pref.lastVolume || 0.5) * 100;
      SleepAudio.setVolume(pref.lastVolume || 0.5);
    }

    const soundCards = document.querySelectorAll('.sleep-sound-card');
    soundCards.forEach(card => {
      card.addEventListener('click', () => {
        soundCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const soundId = card.dataset.sound;
        SleepAudio.play(soundId);
        this._updatePlayBtn();
        this._startVisualizer();
      });
    });

    if (pref.lastMusic) {
      const lastCard = document.querySelector(`.sleep-sound-card[data-sound="${pref.lastMusic}"]`);
      if (lastCard) lastCard.classList.add('active');
    }

    const playBtn = document.getElementById('sleep-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (SleepAudio.isPlaying()) {
          SleepAudio.pause();
          this._stopVisualizer();
        } else if (SleepAudio.getCurrentSound()) {
          SleepAudio.play(SleepAudio.getCurrentSound());
          this._startVisualizer();
        } else if (pref.lastMusic) {
          SleepAudio.play(pref.lastMusic);
          this._startVisualizer();
        }
        this._updatePlayBtn();
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        SleepAudio.setVolume(e.target.value / 100);
      });
    }

    document.querySelectorAll('.sleep-timer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sleep-timer-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        SleepAudio.startTimer(parseInt(btn.dataset.minutes));
        this._startTimerDisplay();
      });
    });
  },

  _updatePlayBtn() {
    const btn = document.getElementById('sleep-play-btn');
    if (!btn) return;
    if (SleepAudio.isPlaying()) {
      btn.textContent = '⏸ 暂停';
      btn.classList.add('playing');
    } else {
      btn.textContent = '▶ 播放';
      btn.classList.remove('playing');
    }
  },

  _startVisualizer() {
    this._stopVisualizer();
    const bars = document.querySelectorAll('.sleep-visualizer-bar');
    const animate = () => {
      bars.forEach(bar => {
        const h = 4 + Math.random() * 50;
        bar.style.height = `${h}px`;
      });
      this._vizFrame = requestAnimationFrame(animate);
    };
    this._vizFrame = requestAnimationFrame(animate);
  },

  _stopVisualizer() {
    if (this._vizFrame) {
      cancelAnimationFrame(this._vizFrame);
      this._vizFrame = null;
    }
    document.querySelectorAll('.sleep-visualizer-bar').forEach(bar => {
      bar.style.height = '4px';
    });
  },

  _timerDisplayInterval: null,

  _startTimerDisplay() {
    if (this._timerDisplayInterval) clearInterval(this._timerDisplayInterval);
    this._timerDisplayInterval = setInterval(() => {
      const display = document.getElementById('sleep-timer-display');
      if (display) {
        display.textContent = SleepAudio.getTimerDisplay();
      }
    }, 1000);
  },

  unmount() {
    SleepAudio.stop();
    this._stopVisualizer();
    if (this._timerDisplayInterval) clearInterval(this._timerDisplayInterval);
  }
};
