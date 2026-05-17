const GestureManager = {
  cameraActive: false,
  cameraLoading: false,
  handsInstance: null,
  cameraInstance: null,
  videoElement: null,
  cursorElement: null,
  lastGesture: null,
  hoverTarget: null,
  pinchStartDistance: 0,
  isPinching: false,
  handPosition: { x: 0, y: 0 },
  smoothedPosition: { x: 0, y: 0 },
  listeners: {},
  SMOOTHING: 0.3,
  HOVER_THRESHOLD: 50,
  PINCH_THRESHOLD: 0.07,
  SWIPE_THRESHOLD: 100,
  SWIPE_TIME_WINDOW: 500,
  lastSwipeTime: 0,
  swipeStartPos: null,

  init() {
    this.createCursor();
    this.setupMouseFallback();
    this.setupTouchFallback();
  },

  createCursor() {
    this.cursorElement = document.createElement('div');
    this.cursorElement.className = 'gesture-cursor';
    this.cursorElement.setAttribute('aria-hidden', 'true');
    this.cursorElement.innerHTML = '<div class="gesture-cursor-inner"></div>';
    document.body.appendChild(this.cursorElement);
  },

  updateCursor(x, y, state) {
    if (!this.cursorElement) return;
    this.cursorElement.style.left = x + 'px';
    this.cursorElement.style.top = y + 'px';
    this.cursorElement.className = 'gesture-cursor';
    if (state === 'hover') this.cursorElement.classList.add('gesture-cursor-hover');
    if (state === 'pinch') this.cursorElement.classList.add('gesture-cursor-pinch');
  },

  hideCursor() {
    if (this.cursorElement) this.cursorElement.style.display = 'none';
  },

  showCursor() {
    if (this.cursorElement) this.cursorElement.style.display = 'block';
  },

  async enableCamera() {
    if (this.cameraActive || this.cameraLoading) return;
    this.cameraLoading = true;
    this.emit('camera-loading', true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });

      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = stream;
      this.videoElement.setAttribute('playsinline', '');
      this.videoElement.style.display = 'none';
      document.body.appendChild(this.videoElement);

      await this.videoElement.play();

      if (typeof Hands !== 'undefined') {
        await this.initMediaPipeHands();
      } else {
        await this.loadMediaPipeScript();
        if (typeof Hands !== 'undefined') {
          await this.initMediaPipeHands();
        } else {
          throw new Error('MediaPipe Hands 加载失败');
        }
      }

      this.cameraActive = true;
      this.cameraLoading = false;
      this.showCursor();
      this.emit('camera-ready', true);
    } catch (err) {
      this.cameraLoading = false;
      this.cameraActive = false;
      this.hideCursor();
      console.warn('摄像头手势启用失败:', err.message);
      this.emit('camera-error', err.message);
    }
  },

  loadMediaPipeScript() {
    return new Promise((resolve, reject) => {
      if (typeof Hands !== 'undefined') { resolve(); return; }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js';
      script.crossOrigin = 'anonymous';

      const cameraScript = document.createElement('script');
      cameraScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.js';
      cameraScript.crossOrigin = 'anonymous';

      let loaded = 0;
      const checkDone = () => { loaded++; if (loaded >= 2) resolve(); };

      script.onload = checkDone;
      cameraScript.onload = checkDone;
      script.onerror = () => reject(new Error('MediaPipe Hands 脚本加载失败'));
      cameraScript.onerror = () => reject(new Error('Camera Utils 脚本加载失败'));

      document.head.appendChild(script);
      document.head.appendChild(cameraScript);

      setTimeout(() => reject(new Error('MediaPipe 加载超时')), 15000);
    });
  },

  async initMediaPipeHands() {
    this.handsInstance = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
    });

    this.handsInstance.setOptions({
      maxNumHands: 1,
      modelComplexity: ResponsiveConfig.isLowEndDevice() ? 0 : 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    this.handsInstance.onResults((results) => this.processHandResults(results));

    if (typeof Camera !== 'undefined') {
      this.cameraInstance = new Camera(this.videoElement, {
        onFrame: async () => {
          if (this.handsInstance && this.cameraActive) {
            await this.handsInstance.send({ image: this.videoElement });
          }
        },
        width: 640,
        height: 480
      });
      await this.cameraInstance.start();
    }
  },

  processHandResults(results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      if (this.hoverTarget) {
        this.emit('gesture-leave', this.hoverTarget);
        this.hoverTarget = null;
      }
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const wrist = landmarks[0];

    const rawX = (1 - indexTip.x) * window.innerWidth;
    const rawY = indexTip.y * window.innerHeight;

    this.smoothedPosition.x += (rawX - this.smoothedPosition.x) * (1 - this.SMOOTHING);
    this.smoothedPosition.y += (rawY - this.smoothedPosition.y) * (1 - this.SMOOTHING);

    const x = this.smoothedPosition.x;
    const y = this.smoothedPosition.y;

    const pinchDistance = Math.sqrt(
      Math.pow(indexTip.x - thumbTip.x, 2) + Math.pow(indexTip.y - thumbTip.y, 2)
    );

    const wasPinching = this.isPinching;
    this.isPinching = pinchDistance < this.PINCH_THRESHOLD;

    if (this.isPinching && !wasPinching) {
      this.handlePinchStart(x, y);
    } else if (!this.isPinching && wasPinching) {
      this.handlePinchEnd(x, y);
    }

    if (!this.isPinching) {
      this.handleHover(x, y);
    }

    this.updateCursor(x, y, this.isPinching ? 'pinch' : 'hover');
    this.handPosition = { x, y };
  },

  handleHover(x, y) {
    const target = document.elementFromPoint(x, y);
    if (!target) return;

    const interactiveEl = target.closest('[data-gesture], .comic-btn, .comic-tag, .comic-card, .comic-panel, a, button');

    if (interactiveEl !== this.hoverTarget) {
      if (this.hoverTarget) {
        this.emit('gesture-leave', this.hoverTarget);
        if (AnimationEngine.shouldAnimate()) {
          AnimationEngine.hoverOut(this.hoverTarget);
        }
      }
      this.hoverTarget = interactiveEl;
      if (interactiveEl) {
        this.emit('gesture-hover', { element: interactiveEl, x, y });
        if (AnimationEngine.shouldAnimate()) {
          AnimationEngine.hoverEffect(interactiveEl);
        }
      }
    }
  },

  handlePinchStart(x, y) {
    this.pinchStartDistance = 0;
    const target = document.elementFromPoint(x, y);
    const interactiveEl = target?.closest('[data-gesture], .comic-btn, .comic-tag, .comic-card, .comic-panel, a, button');
    if (interactiveEl) {
      this.emit('gesture-pinch-start', { element: interactiveEl, x, y });
    }
  },

  handlePinchEnd(x, y) {
    const target = document.elementFromPoint(x, y);
    const interactiveEl = target?.closest('[data-gesture], .comic-btn, .comic-tag, .comic-card, .comic-panel, a, button');
    if (interactiveEl) {
      this.emit('gesture-click', { element: interactiveEl, x, y });
      interactiveEl.click();
      if (AnimationEngine.shouldAnimate()) {
        AnimationEngine.clickBounce(interactiveEl);
      }
    }

    const now = Date.now();
    if (this.swipeStartPos) {
      const dx = x - this.swipeStartPos.x;
      const dy = y - this.swipeStartPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > this.SWIPE_THRESHOLD && now - this.lastSwipeTime > this.SWIPE_TIME_WINDOW) {
        const direction = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
        this.emit('gesture-swipe', { direction, x, y });
        this.lastSwipeTime = now;
      }
    }
    this.swipeStartPos = { x, y };
  },

  disableCamera() {
    this.cameraActive = false;
    if (this.cameraInstance) {
      this.cameraInstance.stop();
      this.cameraInstance = null;
    }
    if (this.videoElement) {
      const stream = this.videoElement.srcObject;
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      this.videoElement.remove();
      this.videoElement = null;
    }
    if (this.handsInstance) {
      this.handsInstance.close();
      this.handsInstance = null;
    }
    this.hideCursor();
    this.emit('camera-ready', false);
  },

  setupMouseFallback() {
    let hoverTimeout;

    document.addEventListener('mousemove', (e) => {
      if (this.cameraActive) return;
      const target = e.target.closest('[data-gesture], .comic-btn, .comic-tag, .comic-card, .comic-panel, a, button');
      if (target && target !== this.hoverTarget) {
        if (this.hoverTarget) {
          this.emit('gesture-leave', this.hoverTarget);
        }
        this.hoverTarget = target;
        this.emit('gesture-hover', { element: target, x: e.clientX, y: e.clientY });
      }
    });

    document.addEventListener('mouseleave', () => {
      if (this.cameraActive) return;
      if (this.hoverTarget) {
        this.emit('gesture-leave', this.hoverTarget);
        this.hoverTarget = null;
      }
    });

    document.addEventListener('click', (e) => {
      if (this.cameraActive) return;
      const target = e.target.closest('[data-gesture], .comic-btn, .comic-tag, .comic-card, .comic-panel, a, button');
      if (target) {
        this.emit('gesture-click', { element: target, x: e.clientX, y: e.clientY });
      }
    });
  },

  setupTouchFallback() {
    let touchStartPos = null;
    let touchStartTime = 0;

    document.addEventListener('touchstart', (e) => {
      if (this.cameraActive) return;
      const touch = e.touches[0];
      touchStartPos = { x: touch.clientX, y: touch.clientY };
      touchStartTime = Date.now();

      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const interactiveEl = target?.closest('[data-gesture], .comic-btn, .comic-tag, .comic-card, .comic-panel, a, button');
      if (interactiveEl) {
        this.emit('gesture-hover', { element: interactiveEl, x: touch.clientX, y: touch.clientY });
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (this.cameraActive || !touchStartPos) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartPos.x;
      const dy = touch.clientY - touchStartPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const elapsed = Date.now() - touchStartTime;

      if (dist > this.SWIPE_THRESHOLD && elapsed < this.SWIPE_TIME_WINDOW) {
        const direction = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
        this.emit('gesture-swipe', { direction, x: touch.clientX, y: touch.clientY });
      } else {
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const interactiveEl = target?.closest('[data-gesture], .comic-btn, .comic-tag, .comic-card, .comic-panel, a, button');
        if (interactiveEl) {
          this.emit('gesture-click', { element: interactiveEl, x: touch.clientX, y: touch.clientY });
        }
      }

      touchStartPos = null;
    }, { passive: true });
  },

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  },

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => {
      try { cb(data); } catch (e) { console.warn('Gesture event error:', e); }
    });
  },

  isCameraActive() {
    return this.cameraActive;
  },

  isCameraLoading() {
    return this.cameraLoading;
  }
};

GestureManager.init();
