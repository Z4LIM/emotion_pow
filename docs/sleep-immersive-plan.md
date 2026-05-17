# 睡眠模式「文字+音乐沉浸式体验」实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use general_purpose_task or execute inline to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把睡眠模式的白噪音和睡前文字深度整合，添加8个场景化沉浸式模式，让用户能一键启动「文字+音乐」的治愈体验。

**Architecture:** 保持现有功能独立，通过新增沉浸式模式入口和文字页音乐控制区实现联动。使用localStorage记住用户偏好。

**Tech Stack:** 原生 JavaScript, Web Audio API, anime.js, localStorage

---

## Task 1: 更新sleep-storage.js添加音乐偏好记忆

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\scripts\sleep-storage.js`

- [ ] **Step 1: 添加音乐偏好存取方法**

```javascript
// 在SleepStorage对象中添加
getMusicPreference() {
  try {
    const data = localStorage.getItem('sleep_music_pref');
    return data ? JSON.parse(data) : { lastMusic: null, lastVolume: 0.5, lastScene: null };
  } catch (e) {
    return { lastMusic: null, lastVolume: 0.5, lastScene: null };
  }
},

saveMusicPreference(pref) {
  try {
    localStorage.setItem('sleep_music_pref', JSON.stringify(pref));
  } catch (e) { }
}
```

---

## Task 2: 更新sleep-audio.js新增5种声音并集成偏好

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\scripts\sleep-audio.js`

- [ ] **Step 1: 添加海浪声、森林声、壁炉声、潮汐声、收音机声**

```javascript
_createWaveSound() {
  const ctx = this._getCtx();
  const bufferSize = 5;
  const buffer = this._createNoiseBuffer('brown', bufferSize);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 300;
  lowpass.Q.value = 0.5;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.2;
  lfo.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);
  lfo.start();

  source.connect(lowpass);
  lowpass.connect(this._gainNode);

  source._lfo = lfo;
  return source;
},

_createForestSound() {
  const ctx = this._getCtx();
  const bufferSize = 4;
  const buffer = this._createNoiseBuffer('pink', bufferSize);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1500;
  bandpass.Q.value = 0.2;

  const gain = ctx.createGain();
  gain.gain.value = 0.18;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 4400;
  const oscGain = ctx.createGain();
  oscGain.gain.value = 0.02;
  osc.connect(oscGain);
  osc.start();

  source.connect(bandpass);
  bandpass.connect(gain);
  oscGain.connect(this._gainNode);
  gain.connect(this._gainNode);

  source._osc = osc;
  return source;
},

_createFireplaceSound() {
  const ctx = this._getCtx();
  const bufferSize = 3;
  const buffer = this._createNoiseBuffer('brown', bufferSize);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 600;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 100;

  const crackleGain = ctx.createGain();
  crackleGain.gain.value = 0.1;

  source.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(crackleGain);
  crackleGain.connect(this._gainNode);

  return source;
},

_createTideSound() {
  const ctx = this._getCtx();
  const bufferSize = 6;
  const buffer = this._createNoiseBuffer('brown', bufferSize);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 200;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.03;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.4;
  lfo.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);
  lfo.start();

  source.connect(lowpass);
  lowpass.connect(this._gainNode);

  source._lfo = lfo;
  return source;
},

_createRadioSound() {
  const ctx = this._getCtx();
  const bufferSize = 3;
  const buffer = this._createNoiseBuffer('white', bufferSize);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 800;
  bandpass.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.2;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.15;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  source.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(this._gainNode);

  source._lfo = lfo;
  return source;
}
```

- [ ] **Step 2: 更新soundMap添加新声音**

```javascript
soundMap: {
  rain: '_createRainSound',
  book: '_createBookSound',
  guitar: '_createGuitarSound',
  cafe: '_createCafeSound',
  wave: '_createWaveSound',
  forest: '_createForestSound',
  fireplace: '_createFireplaceSound',
  tide: '_createTideSound',
  radio: '_createRadioSound'
}
```

- [ ] **Step 3: 集成偏好记忆**

```javascript
// 在SleepAudio对象中添加
loadPreference() {
  const pref = SleepStorage.getMusicPreference();
  if (pref.lastVolume !== undefined) {
    this.setVolume(pref.lastVolume);
  }
  return pref;
},

savePreference() {
  const pref = {
    lastMusic: this._currentSound,
    lastVolume: this._gainNode ? this._gainNode.gain.value : 0.5,
    lastScene: null
  };
  SleepStorage.saveMusicPreference(pref);
}

// 在play()方法末尾添加
this.savePreference();

// 在setVolume()方法末尾添加
this.savePreference();
```

---

## Task 3: 更新sleep-quotes.js新增内容

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\scripts\sleep-quotes.js`

- [ ] **Step 1: 添加海洋主题短句**

```javascript
oceanQuotes: [
  "海浪会带走今天的焦虑",
  "像海水一样，让情绪自然流动",
  "每一次潮起潮落，都是一次释放",
  "大海不会因为浪花而改变方向",
  "像海洋一样，深而平静",
  "今天的烦恼，就让海浪带走吧",
  "潮汐会带来新的一天",
  "在海边，一切都可以被原谅"
]
```

- [ ] **Step 2: 添加怀旧小故事**

```javascript
nostalgicStory: `这是一个关于童年夏夜的故事。

记得小时候，每到暑假的晚上，家里的大人会搬着小板凳到院子里乘凉。我们几个小孩会围在奶奶身边，听她讲那些已经讲过无数遍的老故事。

那时的月亮特别亮，星星特别多。奶奶手里的蒲扇轻轻摇着，带着一阵又一阵的凉意。偶尔会有萤火虫飞过，像会发光的小精灵。

不知道从什么时候开始，那些夏夜变成了回忆里的画面。但每当想起，心里还是会觉得温暖。

今晚，让我们回到那个时候，那个没有手机、没有烦恼的夜晚。

就安静地，和自己待一会儿。`
```

- [ ] **Step 3: 添加呼吸指引**

```javascript
breathingGuide: `请跟着潮汐的节奏，慢慢呼吸。

吸气……
感受空气进入身体，
让腹部轻轻鼓起……
1……2……3……4……

呼气……
让所有的紧张，
都随着这口气，
一起离开身体……
1……2……3……4……

再一次，
吸气……
1……2……3……4……

呼气……
1……2……3……4……

很好，
就这样，
慢慢地，
越来越放松……`
```

- [ ] **Step 4: 添加getSceneContent方法**

```javascript
getSceneContent(sceneId) {
  switch (sceneId) {
    case 'rain-letters':
      return { tab: 'letter' };
    case 'bedtime-story':
      return { tab: 'story', content: this.story };
    case 'nature-healing':
      return { tab: 'quotes', content: [...this.quotes, '聆听森林，找回内心的平静'] };
    case 'ocean-release':
      return { tab: 'quotes', content: this.oceanQuotes };
    case 'warm-fireplace':
      return { tab: 'quotes', content: this.quotes.filter(q => q.includes('感恩') || q.includes('感谢')) };
    case 'nostalgic-radio':
      return { tab: 'story', content: this.nostalgicStory };
    case 'tide-breathe':
      return { tab: 'story', content: this.breathingGuide };
    case 'study-recharge':
      return { tab: 'letter' };
    default:
      return { tab: 'quotes' };
  }
}
```

---

## Task 4: 更新sleep-theme.css添加样式

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\styles\sleep-theme.css`

- [ ] **Step 1: 添加睡眠场景卡片样式**

```css
.sleep-scenes-section {
  margin-bottom: 32px;
}

.sleep-scenes-title {
  font-size: 1.1rem;
  color: var(--sleep-text-primary);
  margin-bottom: 12px;
  font-family: var(--font-comic-title);
}

.sleep-scenes-container {
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.sleep-scenes-container::-webkit-scrollbar {
  display: none;
}

.sleep-scenes-grid {
  display: flex;
  gap: 12px;
  width: max-content;
}

.sleep-scene-card {
  width: 140px;
  padding: 16px 12px;
  background: var(--sleep-card);
  border: 2px solid var(--sleep-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms var(--ease-smooth);
  text-align: center;
}

.sleep-scene-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sleep-shadow-hover);
}

.sleep-scene-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.sleep-scene-name {
  font-size: 0.9rem;
  color: var(--sleep-text-primary);
  margin-bottom: 4px;
  font-weight: 500;
}

.sleep-scene-desc {
  font-size: 0.75rem;
  color: var(--sleep-text-secondary);
  line-height: 1.3;
}

@media (min-width: 768px) {
  .sleep-scenes-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
  }

  .sleep-scene-card {
    width: auto;
  }
}
```

- [ ] **Step 2: 添加背景音乐控制区样式**

```css
.sleep-music-control {
  position: fixed;
  top: 72px;
  right: 16px;
  z-index: 100;
}

.sleep-music-btn {
  background: var(--sleep-card);
  border: 2px solid var(--sleep-border);
  border-radius: 20px;
  padding: 8px 14px;
  color: var(--sleep-text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 200ms var(--ease-smooth);
  box-shadow: var(--sleep-shadow);
}

.sleep-music-btn:hover {
  transform: scale(1.02);
  border-color: var(--sleep-accent);
}

.sleep-music-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--sleep-card);
  border: 2px solid var(--sleep-border);
  border-radius: 12px;
  padding: 16px;
  min-width: 240px;
  box-shadow: var(--sleep-shadow);
  display: none;
}

.sleep-music-panel.show {
  display: block;
  animation: slideDown 200ms var(--ease-smooth);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sleep-music-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: var(--sleep-text-primary);
}

.sleep-music-panel-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
}

.sleep-music-sounds {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.sleep-music-sound-btn {
  background: var(--sleep-bg);
  border: 2px solid var(--sleep-border);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 150ms var(--ease-smooth);
}

.sleep-music-sound-btn:hover {
  border-color: var(--sleep-accent);
}

.sleep-music-sound-btn.active {
  border-color: var(--sleep-accent);
  background: color-mix(in srgb, var(--sleep-accent) 15%, var(--sleep-bg));
}

.sleep-music-volume {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.sleep-music-volume-icon {
  font-size: 1rem;
}

.sleep-music-volume-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--sleep-border);
}

.sleep-music-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--sleep-accent);
  cursor: pointer;
}

.sleep-music-actions {
  display: flex;
  gap: 8px;
}

.sleep-music-play-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid var(--sleep-border);
  border-radius: 8px;
  background: var(--sleep-bg);
  color: var(--sleep-text-primary);
  cursor: pointer;
  transition: all 150ms var(--ease-smooth);
}

.sleep-music-play-btn:hover {
  border-color: var(--sleep-accent);
}

.sleep-music-play-btn.playing {
  border-color: var(--sleep-accent);
  background: color-mix(in srgb, var(--sleep-accent) 10%, var(--sleep-bg));
}

.sleep-music-stop-btn {
  padding: 10px 16px;
  border: 2px solid var(--sleep-border);
  border-radius: 8px;
  background: var(--sleep-bg);
  color: var(--sleep-text-secondary);
  cursor: pointer;
}
```

---

## Task 5: 更新page-sleep-home.js添加场景卡片

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\components\page-sleep-home.js`

- [ ] **Step 1: 添加场景数据**

```javascript
// 在PageSleepHome对象顶部添加
sleepScenes: [
  {
    id: 'rain-letters',
    name: '雨夜读信',
    icon: '🌧️',
    music: 'rain',
    description: '雨滴落在窗上，写下给今天自己的信'
  },
  {
    id: 'bedtime-story',
    name: '睡前故事',
    icon: '🎸',
    music: 'guitar',
    description: '吉他轻弹，听一个温暖的睡前小故事'
  },
  {
    id: 'nature-healing',
    name: '自然疗愈',
    icon: '🌲',
    music: 'forest',
    description: '聆听森林，找回内心的平静'
  },
  {
    id: 'ocean-release',
    name: '海洋释放',
    icon: '🌊',
    music: 'wave',
    description: '让海浪带走今天的烦恼'
  },
  {
    id: 'warm-fireplace',
    name: '温暖壁炉',
    icon: '🫂',
    music: 'fireplace',
    description: '在温暖的壁炉旁，感恩今天的一切'
  },
  {
    id: 'nostalgic-radio',
    name: '怀旧电台',
    icon: '📻',
    music: 'radio',
    description: '回到童年的某个夜晚'
  },
  {
    id: 'tide-breathe',
    name: '潮汐放松',
    icon: '🐚',
    music: 'tide',
    description: '跟着潮汐的节奏，放松呼吸'
  },
  {
    id: 'study-recharge',
    name: '自习充电',
    icon: '☕',
    music: 'cafe',
    description: '在安静的自习室，整理思绪'
  }
]
```

- [ ] **Step 2: 更新render方法添加场景区**

```javascript
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
}
```

- [ ] **Step 3: 更新mount方法添加场景卡片点击事件**

```javascript
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
}
```

---

## Task 6: 更新page-sleep-text.js添加音乐控制区

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\components\page-sleep-text.js`

- [ ] **Step 1: 添加音效名称映射**

```javascript
// 在PageSleepText对象顶部添加
soundNames: {
  rain: '🌧️ 雨声',
  book: '📖 翻书声',
  guitar: '🎸 吉他',
  cafe: '☕ 自习室',
  wave: '🌊 海浪',
  forest: '🌲 森林',
  fireplace: '🫂 壁炉',
  tide: '🐚 潮汐',
  radio: '📻 收音机'
}
```

- [ ] **Step 2: 更新render方法添加音乐控制区**

```javascript
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
}
```

- [ ] **Step 3: 更新mount方法添加场景检测和音乐控制**

```javascript
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

  this._renderTab();
  this._bindMusicControls();
},
```

- [ ] **Step 4: 添加音乐控制绑定和辅助方法**

```javascript
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
        SleepAudio.play('rain');
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
},
```

---

## Task 7: 更新page-sleep-white-noise.js与偏好集成

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\components\page-sleep-white-noise.js`

- [ ] **Step 1: 更新声音卡片添加新音效**

```javascript
// 在render方法中更新sleep-sounds-grid
<div class="sleep-sounds-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:500px;margin:0 auto 24px;">
  <div class="sleep-sound-card" data-sound="rain">
    <div class="sleep-sound-icon">🌧️</div>
    <div class="sleep-sound-name">宿舍雨声</div>
  </div>
  <div class="sleep-sound-card" data-sound="book">
    <div class="sleep-sound-icon">📖</div>
    <div class="sleep-sound-name">图书馆翻书</div>
  </div>
  <div class="sleep-sound-card" data-sound="guitar">
    <div class="sleep-sound-icon">🎸</div>
    <div class="sleep-sound-name">轻缓吉他</div>
  </div>
  <div class="sleep-sound-card" data-sound="cafe">
    <div class="sleep-sound-icon">☕</div>
    <div class="sleep-sound-name">自习室白噪音</div>
  </div>
  <div class="sleep-sound-card" data-sound="wave">
    <div class="sleep-sound-icon">🌊</div>
    <div class="sleep-sound-name">海浪声</div>
  </div>
  <div class="sleep-sound-card" data-sound="forest">
    <div class="sleep-sound-icon">🌲</div>
    <div class="sleep-sound-name">森林鸟叫</div>
  </div>
  <div class="sleep-sound-card" data-sound="fireplace">
    <div class="sleep-sound-icon">🫂</div>
    <div class="sleep-sound-name">温暖壁炉</div>
  </div>
  <div class="sleep-sound-card" data-sound="tide">
    <div class="sleep-sound-icon">🐚</div>
    <div class="sleep-sound-name">潮汐声</div>
  </div>
  <div class="sleep-sound-card" data-sound="radio">
    <div class="sleep-sound-icon">📻</div>
    <div class="sleep-sound-name">怀旧收音机</div>
  </div>
</div>
```

- [ ] **Step 2: 更新mount方法加载偏好音量**

```javascript
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

  // 如果有上次播放的声音，自动激活
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
}
```

---

## Task 8: 更新main.js支持sleep子页面URL参数

**Files:**
- Modify: `d:\solo-trae\mood-journal-demo\scripts\main.js`

- [ ] **Step 1: 更新normalizePath方法保留查询参数**

```javascript
// 在normalizePath函数中，更新sleep路径处理
if (hash.startsWith('/sleep/text')) return hash;
if (hash.startsWith('/sleep/white-noise')) return hash;
if (hash.startsWith('/sleep/treehole')) return hash;
if (hash.startsWith('/sleep/goodnight')) return hash;
```

---

## Task 9: 验证整体效果

**Files:**
- Verify: 启动本地服务器，在浏览器测试

- [ ] **Step 1: 启动服务器**

```bash
cd d:\solo-trae\mood-journal-demo
python -m http.server 8099
```

- [ ] **Step 2: 验证场景卡片**

访问 `http://localhost:8099/#/sleep`，确认8个场景卡片正确显示，点击能跳转到文字页并自动播放音乐。

- [ ] **Step 3: 验证音乐控制**

在文字页点击右上角音乐按钮，确认面板能展开/收起，声音能切换，音量能调节。

- [ ] **Step 4: 验证偏好记忆**

切换声音和音量，刷新页面，确认偏好被记住。
