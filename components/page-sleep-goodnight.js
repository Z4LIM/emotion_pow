const PageSleepGoodnight = {
  _selectedChoice: null,

  render() {
    const cal = SleepStorage.getGoodnightCalendar();
    const streak = SleepStorage.getGoodnightStreak();
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

    const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];
    const calendarHeader = dayLabels.map(d => `<div class="sleep-calendar-day-label">${d}</div>`).join('');
    const blanks = Array(cal.firstDay).fill('<div class="sleep-calendar-day"></div>').join('');
    const days = cal.checkedDays.map(d => {
      const cls = ['sleep-calendar-day'];
      if (d.checked) cls.push('checked');
      if (d.day === cal.today) cls.push('today');
      return `<div class="${cls.join(' ')}" title="${d.checked ? d.choice : ''}">${d.day}${d.checked ? '🌙' : ''}</div>`;
    }).join('');

    const optionsHtml = SleepQuotes.goodnightOptions.map(opt =>
      `<button class="sleep-gn-option" data-choice="${opt.label}"><span class="gn-icon">${opt.icon}</span><span class="gn-label">${opt.label}</span></button>`
    ).join('');

    return `
      <div class="sleep-page sleep-goodnight-page" style="position:relative;">
        <button class="sleep-back-btn" onclick="location.hash='#/sleep'">← 返回</button>
        <header class="sleep-header">
          <h1>晚安打卡</h1>
        </header>

        <div class="sleep-goodnight-card">
          <div class="sleep-goodnight-date">${dateStr}</div>
          <h2>今晚我选择______入睡</h2>

          <div class="sleep-goodnight-options">
            ${optionsHtml}
          </div>

          <div class="sleep-goodnight-message" id="sleep-gn-message"></div>
          ${streak > 0 ? `<div class="sleep-goodnight-streak">🔥 已连续打卡 ${streak} 天</div>` : ''}
        </div>

        <div class="sleep-goodnight-calendar">
          <div class="sleep-calendar-title">${cal.year}年${cal.month + 1}月</div>
          <div class="sleep-calendar-grid">
            ${calendarHeader}
            ${blanks}
            ${days}
          </div>
        </div>
      </div>
    `;
  },

  mount() {
    document.querySelectorAll('.sleep-gn-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sleep-gn-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this._selectedChoice = btn.dataset.choice;

        const msgEl = document.getElementById('sleep-gn-message');
        if (msgEl) {
          const text = SleepQuotes.goodnightMessages[this._selectedChoice] || '';
          msgEl.textContent = text;
          msgEl.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              msgEl.classList.add('visible');
            });
          });
        }

        SleepStorage.recordGoodnight(this._selectedChoice);

        const streakEl = document.querySelector('.sleep-goodnight-streak');
        const streak = SleepStorage.getGoodnightStreak();
        if (streakEl) {
          streakEl.textContent = `🔥 已连续打卡 ${streak} 天`;
        }

        if (AnimationEngine.shouldAnimate()) {
          anime({
            targets: btn,
            scale: [1, 1.1, 1],
            duration: 400,
            easing: 'easeOutBack'
          });
        }
      });
    });
  },

  unmount() {
    this._selectedChoice = null;
  }
};
