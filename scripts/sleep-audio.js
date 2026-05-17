const SleepAudio = {
  _ctx: null,
  _gainNode: null,
  _currentSource: null,
  _currentSound: null,
  _isPlaying: false,
  _timerId: null,
  _timerRemaining: 0,
  _timerInterval: null,
  _visualizerFrame: null,
  _audioEl: null,
  _isFileMode: false,
  _fadeOutTimer: null,

  soundConfig: [
    { id: 'forest-night', name: '森林夜雨流水', icon: '🌲', category: 'nature', file: 'assets/audio/forest-night.mp3', fallback: 'rain' },
    { id: 'forest-bird', name: '林间鸟鸣韵律', icon: '🐦', category: 'nature', file: 'assets/audio/forest-bird.mp3', fallback: 'forest' },
    { id: 'forest-morning', name: '森林清晨能量', icon: '🌅', category: 'nature', file: 'assets/audio/forest-morning.mp3', fallback: 'forest' },
    { id: 'ocean-rain', name: '海雨涛声', icon: '🌊', category: 'nature', file: 'assets/audio/ocean-rain.mp3', fallback: 'wave' },
    { id: 'bowl-wave', name: '颂钵海浪', icon: '🧘', category: 'nature', file: 'assets/audio/bowl-wave.mp3', fallback: 'tide' },
    { id: 'anxiety-relief', name: '焦虑放松', icon: '💆', category: 'healing', file: 'assets/audio/anxiety-relief.mp3', fallback: 'cafe' },
    { id: 'stress-ancient', name: '世外桃源古曲', icon: '🏯', category: 'healing', file: 'assets/audio/stress-ancient.mp3', fallback: 'fireplace' },
    { id: 'hypnosis-heal', name: '催眠净化心灵', icon: '🌙', category: 'healing', file: 'assets/audio/hypnosis-heal.mp3', fallback: 'tide' },
    { id: 'nature-energy', name: '大自然能量疗愈', icon: '🍃', category: 'healing', file: 'assets/audio/nature-energy.mp3', fallback: 'forest' },
    { id: 'calm-nerves', name: '安神助眠', icon: '🛏️', category: 'healing', file: 'assets/audio/calm-nerves.mp3', fallback: 'cafe' },
    { id: 'brain-guide', name: '平和大脑引导', icon: '🧠', category: 'healing', file: 'assets/audio/brain-guide.mp3', fallback: 'book' },
    { id: 'spiritual-peace', name: '祥和灵性', icon: '✨', category: 'healing', file: 'assets/audio/spiritual-peace.mp3', fallback: 'fireplace' },
    { id: 'dreamy-dusk', name: '梦幻黄昏', icon: '🌆', category: 'ambience', file: 'assets/audio/dreamy-dusk.mp3', fallback: 'guitar' },
    { id: 'pastoral-dusk', name: '牧童短笛黄昏', icon: '🎵', category: 'ambience', file: 'assets/audio/pastoral-dusk.mp3', fallback: 'guitar' }
  ],

  soundFileMap: {
    'forest-night': 'assets/audio/forest-night.mp3',
    'forest-bird': 'assets/audio/forest-bird.mp3',
    'forest-morning': 'assets/audio/forest-morning.mp3',
    'ocean-rain': 'assets/audio/ocean-rain.mp3',
    'bowl-wave': 'assets/audio/bowl-wave.mp3',
    'anxiety-relief': 'assets/audio/anxiety-relief.mp3',
    'stress-ancient': 'assets/audio/stress-ancient.mp3',
    'hypnosis-heal': 'assets/audio/hypnosis-heal.mp3',
    'nature-energy': 'assets/audio/nature-energy.mp3',
    'calm-nerves': 'assets/audio/calm-nerves.mp3',
    'brain-guide': 'assets/audio/brain-guide.mp3',
    'spiritual-peace': 'assets/audio/spiritual-peace.mp3',
    'dreamy-dusk': 'assets/audio/dreamy-dusk.mp3',
    'pastoral-dusk': 'assets/audio/pastoral-dusk.mp3'
  },

  getSoundsByCategory(cat) {
    return this.soundConfig.filter(s => s.category === cat);
  },

  getAllSounds() {
    return this.soundConfig;
  },

  getSoundInfo(soundId) {
    return this.soundConfig.find(s => s.id === soundId) || null;
  },

  _getCtx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._gainNode = this._ctx.createGain();
      this._gainNode.gain.value = 0.5;
      this._gainNode.connect(this._ctx.destination);
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    return this._ctx;
  },

  _createNoiseBuffer(type, duration) {
    const ctx = this._getCtx();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'brown') {
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 3.5;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else {
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    return buffer;
  },

  _createRainSound() {
    const ctx = this._getCtx();
    const bufferSize = 4;
    const buffer = this._createNoiseBuffer('brown', bufferSize);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 400;
    lowpass.Q.value = 1;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 80;

    source.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(this._gainNode);

    return source;
  },

  _createBookSound() {
    const ctx = this._getCtx();
    const bufferSize = 4;
    const buffer = this._createNoiseBuffer('white', bufferSize);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2000;
    bandpass.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.15;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.1;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    source.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this._gainNode);

    source._lfo = lfo;
    return source;
  },

  _createGuitarSound() {
    const ctx = this._getCtx();

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 220;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 330;

    const gain = ctx.createGain();
    gain.gain.value = 0.08;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    const reverb = ctx.createBiquadFilter();
    reverb.type = 'lowpass';
    reverb.frequency.value = 800;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(reverb);
    reverb.connect(this._gainNode);

    osc1.start();
    osc2.start();

    const wrapper = {
      _osc1: osc1,
      _osc2: osc2,
      _lfo: lfo,
      stop: function () {
        this._osc1.stop();
        this._osc2.stop();
        this._lfo.stop();
      },
      connect: function () { }
    };

    return wrapper;
  },

  _createCafeSound() {
    const ctx = this._getCtx();
    const bufferSize = 4;
    const buffer = this._createNoiseBuffer('pink', bufferSize);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1000;
    bandpass.Q.value = 0.3;

    const gain = ctx.createGain();
    gain.gain.value = 0.25;

    source.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this._gainNode);

    return source;
  },

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
  },

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
  },

  _stopAudioEl() {
    if (this._audioEl) {
      this._audioEl.pause();
      this._audioEl.src = '';
      this._audioEl = null;
    }
    this._isFileMode = false;
  },

  _playFile(soundId) {
    const filePath = this.soundFileMap[soundId];
    if (!filePath) return false;

    this._stopAudioEl();

    const audio = new Audio(filePath);
    audio.loop = true;
    audio.volume = this._gainNode ? this._gainNode.gain.value : 0.5;
    audio.preload = 'auto';

    return new Promise((resolve) => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this._audioEl = audio;
          this._isFileMode = true;
          this._currentSound = soundId;
          this._isPlaying = true;
          this._stopSynth();
          resolve(true);
        }).catch(() => {
          audio.src = '';
          resolve(false);
        });
      } else {
        this._audioEl = audio;
        this._isFileMode = true;
        this._currentSound = soundId;
        this._isPlaying = true;
        this._stopSynth();
        resolve(true);
      }
    });
  },

  _stopSynth() {
    if (this._currentSource) {
      try {
        if (this._currentSource.stop) this._currentSource.stop();
        if (this._currentSource._lfo && this._currentSource._lfo.stop) this._currentSource._lfo.stop();
        if (this._currentSource._osc && this._currentSource._osc.stop) this._currentSource._osc.stop();
      } catch (e) { }
      this._currentSource = null;
    }
  },

  play(soundId) {
    this.stop();

    if (this.soundFileMap[soundId]) {
      this._playFile(soundId).then(success => {
        if (!success) {
          const config = this.soundConfig.find(s => s.id === soundId);
          const fallbackId = config ? config.fallback : null;
          if (fallbackId && this.soundMap[fallbackId]) {
            this._playSynth(fallbackId);
            this._currentSound = soundId;
          }
        } else {
          this.savePreference();
        }
      });
      return;
    }

    if (this.soundMap[soundId]) {
      this._playSynth(soundId);
      this._currentSound = soundId;
      this.savePreference();
    }
  },

  _playSynth(soundId) {
    const methodName = this.soundMap[soundId];
    if (!methodName) return;

    this._stopSynth();
    this._stopAudioEl();

    this._currentSource = this[methodName]();
    this._isFileMode = false;
    this._isPlaying = true;

    if (this._currentSource.start) {
      this._currentSource.start();
    }
  },

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
  },

  pause() {
    if (this._isFileMode && this._audioEl) {
      this._audioEl.pause();
    }
    this._stopSynth();
    this._isPlaying = false;
  },

  stop() {
    this._stopAudioEl();
    this._stopSynth();
    this.clearTimer();
    this._currentSound = null;
    this._isPlaying = false;
  },

  setVolume(vol) {
    const v = Math.max(0, Math.min(1, vol));
    if (this._gainNode) {
      this._gainNode.gain.value = v;
    }
    if (this._audioEl) {
      this._audioEl.volume = v;
    }
    this.savePreference();
  },

  startTimer(minutes) {
    this.clearTimer();
    this._timerRemaining = minutes * 60;

    this._timerInterval = setInterval(() => {
      this._timerRemaining--;
      if (this._timerRemaining <= 0) {
        this.fadeOutAndStop();
        this.clearTimer();
      }
    }, 1000);
  },

  clearTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
    this._timerRemaining = 0;
  },

  fadeOutAndStop() {
    if (this._fadeOutTimer) {
      clearInterval(this._fadeOutTimer);
      this._fadeOutTimer = null;
    }

    if (this._isFileMode && this._audioEl) {
      const startVol = this._audioEl.volume;
      const steps = 30;
      const stepTime = 100;
      let step = 0;
      this._fadeOutTimer = setInterval(() => {
        step++;
        const progress = step / steps;
        this._audioEl.volume = Math.max(0, startVol * (1 - progress));
        if (step >= steps) {
          clearInterval(this._fadeOutTimer);
          this._fadeOutTimer = null;
          this.stop();
        }
      }, stepTime);
    } else if (this._gainNode && this._isPlaying) {
      const ctx = this._getCtx();
      this._gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
      setTimeout(() => this.stop(), 3500);
    }
  },

  getTimerDisplay() {
    if (this._timerRemaining <= 0) return '';
    const m = Math.floor(this._timerRemaining / 60);
    const s = this._timerRemaining % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  },

  isPlaying() {
    return this._isPlaying;
  },

  getCurrentSound() {
    return this._currentSound;
  }
};
