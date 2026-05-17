const PageSleepTreehole = {
  render() {
    const messages = SleepStorage.getLatestTreeholeMessages(3);
    return `
      <div class="sleep-page sleep-treehole-page" style="position:relative;">
        <button class="sleep-back-btn" onclick="location.hash='#/sleep'">← 返回</button>
        <header class="sleep-header">
          <h1>情绪树洞</h1>
          <p class="sleep-subtitle">今天没说出口的话，留在这里吧</p>
        </header>

        <div class="sleep-treehole-input-area" style="max-width:500px;margin:0 auto 24px;">
          <textarea class="sleep-treehole-textarea" id="sleep-treehole-input"
                    placeholder="写下你今天没说出口的话..." maxlength="200"></textarea>
          <div class="sleep-treehole-char-count">
            <span id="sleep-treehole-count">0</span>/200
          </div>
          <button class="sleep-treehole-submit" id="sleep-treehole-submit" disabled>放进树洞 🌳</button>
        </div>

        <div class="sleep-treehole-messages" id="sleep-treehole-messages" style="max-width:500px;margin:0 auto;">
          ${messages.map(m => this._renderMessage(m)).join('')}
        </div>
      </div>
    `;
  },

  _renderMessage(m) {
    const timeStr = this._formatTime(m.timestamp);
    return `
      <div class="sleep-treehole-message" data-msg-id="${m.id}">
        <div class="sleep-treehole-msg-text">${m.text}</div>
        <div class="sleep-treehole-msg-meta">
          <span class="sleep-treehole-msg-time">${timeStr}</span>
          <button class="sleep-treehole-like-btn" data-like-id="${m.id}" aria-label="点赞">🤍 ${m.likes || 0}</button>
        </div>
      </div>
    `;
  },

  _formatTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return `${Math.floor(diff / 86400000)}天前`;
  },

  mount() {
    const input = document.getElementById('sleep-treehole-input');
    const countEl = document.getElementById('sleep-treehole-count');
    const submitBtn = document.getElementById('sleep-treehole-submit');

    if (input) {
      input.addEventListener('input', () => {
        const len = input.value.length;
        if (countEl) countEl.textContent = len;
        if (submitBtn) submitBtn.disabled = len === 0;
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        SleepStorage.saveTreeholeMessage(text);
        input.value = '';
        if (countEl) countEl.textContent = '0';
        submitBtn.disabled = true;
        this._refreshMessages();
      });
    }

    document.querySelectorAll('.sleep-treehole-like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.likeId);
        const newLikes = SleepStorage.likeTreeholeMessage(id);
        btn.textContent = `💗 ${newLikes}`;
        btn.classList.add('liked');
      });
    });
  },

  _refreshMessages() {
    const container = document.getElementById('sleep-treehole-messages');
    if (!container) return;
    const messages = SleepStorage.getLatestTreeholeMessages(3);
    container.innerHTML = messages.map(m => this._renderMessage(m)).join('');

    document.querySelectorAll('.sleep-treehole-like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.likeId);
        const newLikes = SleepStorage.likeTreeholeMessage(id);
        btn.textContent = `💗 ${newLikes}`;
        btn.classList.add('liked');
      });
    });
  },

  unmount() {}
};
