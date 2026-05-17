const MoodJournal = {
  EMOJIS: ['😊', '😢', '💪', '❤️', '✨', '🌧️', '🎉', '🤔'],
  MAX_STARS: 5,

  POSITIVE_KEYWORDS: ['开心', '快乐', '好', '棒', '感谢'],
  NEGATIVE_KEYWORDS: ['难过', '伤心', '糟糕', '累', '痛苦'],

  SPIRIT_DEFAULT: '🧘',
  SPIRIT_POSITIVE: '😊',
  SPIRIT_NEGATIVE: '🫂',

  SENTENCE_ENDINGS: /[。！？.!?]/,

  _skipped: false,
  _text: '',
  _starCount: 0,
  _lastSentenceCount: 0,
  _submitCallback: null,
  _currentSpirit: null,

  render() {
    return `
      <div class="mood-journal-container">
        <div class="journal-header">
          <span class="journal-header-icon">📝</span>
          <span>心情笔记</span>
        </div>
        <div class="journal-body">
          <div class="journal-editor">
            <div class="journal-stars" id="journal-stars"></div>
            <textarea
              class="journal-textarea"
              id="journal-textarea"
              placeholder="说出来，杏仁核就"矮"了"
              aria-label="心情笔记输入框"
            ></textarea>
            <div class="journal-char-count" id="journal-char-count">已写 0 字</div>
          </div>
          <div class="journal-spirit" id="journal-spirit">
            <span class="journal-spirit-emoji" id="journal-spirit-emoji">${this.SPIRIT_DEFAULT}</span>
            <span class="journal-spirit-label">精灵</span>
          </div>
        </div>
        <div class="journal-emoji-bar" id="journal-emoji-bar">
          ${this.EMOJIS.map(e => `
            <button class="journal-emoji-btn" data-emoji="${e}" aria-label="插入表情 ${e}">${e}</button>
          `).join('')}
        </div>
        <div class="journal-footer">
          <button class="journal-skip-btn" id="journal-skip-btn">跳过</button>
        </div>
      </div>
    `;
  },

  mount() {
    const textarea = document.getElementById('journal-textarea');
    const charCount = document.getElementById('journal-char-count');
    const emojiBar = document.getElementById('journal-emoji-bar');
    const skipBtn = document.getElementById('journal-skip-btn');
    const starsContainer = document.getElementById('journal-stars');
    const spiritEmoji = document.getElementById('journal-spirit-emoji');

    this._currentSpirit = this.SPIRIT_DEFAULT;

    if (!textarea) return;

    textarea.addEventListener('input', () => {
      this._text = textarea.value;
      this._updateCharCount(charCount);
      this._updateSpirit(spiritEmoji);
      this._checkForNewSentences(starsContainer);
    });

    emojiBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.journal-emoji-btn');
      if (!btn) return;
      const emoji = btn.dataset.emoji;
      this._insertEmojiAtCursor(textarea, emoji);
      this._text = textarea.value;
      this._updateCharCount(charCount);
      this._updateSpirit(spiritEmoji);
      textarea.focus();
    });

    skipBtn.addEventListener('click', () => {
      this._skipped = true;
      if (this._submitCallback) {
        this._submitCallback('');
      }
    });
  },

  getText() {
    return this._text;
  },

  isSkipped() {
    return this._skipped;
  },

  onSubmit(callback) {
    this._submitCallback = callback;
  },

  _updateCharCount(charCountEl) {
    if (!charCountEl) return;
    const len = this._text.length;
    charCountEl.textContent = `已写 ${len} 字`;
  },

  _updateSpirit(spiritEmojiEl) {
    if (!spiritEmojiEl) return;

    const text = this._text;
    let newSpirit = this.SPIRIT_DEFAULT;

    if (text.length > 0) {
      const hasPositive = this.POSITIVE_KEYWORDS.some(kw => text.includes(kw));
      const hasNegative = this.NEGATIVE_KEYWORDS.some(kw => text.includes(kw));

      if (hasPositive && !hasNegative) {
        newSpirit = this.SPIRIT_POSITIVE;
      } else if (hasNegative && !hasPositive) {
        newSpirit = this.SPIRIT_NEGATIVE;
      } else if (hasPositive && hasNegative) {
        newSpirit = this.SPIRIT_DEFAULT;
      } else {
        newSpirit = this.SPIRIT_DEFAULT;
      }
    }

    if (newSpirit !== this._currentSpirit) {
      this._currentSpirit = newSpirit;
      spiritEmojiEl.textContent = newSpirit;

      if (AnimationEngine.shouldAnimate()) {
        anime({
          targets: spiritEmojiEl,
          scale: [1, 1.25, 0.9, 1.1, 1],
          duration: AnimationEngine.getDuration(400),
          easing: 'easeOutElastic(1, .6)'
        });
      }
    }
  },

  _checkForNewSentences(starsContainer) {
    if (!starsContainer) return;

    const sentences = this._text.split(this.SENTENCE_ENDINGS).filter(s => s.trim().length > 0);
    const currentCount = sentences.length;

    if (currentCount > this._lastSentenceCount) {
      const newSentences = currentCount - this._lastSentenceCount;
      for (let i = 0; i < newSentences; i++) {
        this._addStar(starsContainer);
      }
    }

    this._lastSentenceCount = currentCount;
  },

  _addStar(starsContainer) {
    const existingStars = starsContainer.querySelectorAll('.journal-star');
    if (existingStars.length >= this.MAX_STARS) {
      const oldest = existingStars[0];
      oldest.remove();
    }

    const star = document.createElement('span');
    star.className = 'journal-star';
    star.textContent = '⭐';

    starsContainer.appendChild(star);

    if (AnimationEngine.shouldAnimate()) {
      anime({
        targets: star,
        opacity: [0, 1],
        scale: [0.3, 1.2, 1],
        rotate: ['-30deg', '5deg', '0deg'],
        duration: AnimationEngine.getDuration(400),
        easing: 'easeOutBack'
      });
    } else {
      star.style.opacity = 1;
    }
  },

  _insertEmojiAtCursor(textarea, emoji) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    textarea.value = value.substring(0, start) + emoji + value.substring(end);
    const newPos = start + emoji.length;
    textarea.selectionStart = newPos;
    textarea.selectionEnd = newPos;

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
};
