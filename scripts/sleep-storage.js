const SleepStorage = {
  TREEHOLE_KEY: 'sleep_treehole_messages',
  GOODNIGHT_KEY: 'sleep_goodnight_log',
  MUSIC_PREF_KEY: 'sleep_music_pref',

  SEED_MESSAGES: [
    { id: 1, text: '今天考试考砸了，但没关系，我还有下次。', timestamp: Date.now() - 86400000 * 3, likes: 12 },
    { id: 2, text: '想家了，宿舍的床没有家里的舒服。', timestamp: Date.now() - 86400000 * 2, likes: 8 },
    { id: 3, text: '暗恋的人今天和别人说话了，有点难过。', timestamp: Date.now() - 86400000, likes: 15 },
    { id: 4, text: '终于把论文写完了，虽然写得不好但写完了就是胜利。', timestamp: Date.now() - 43200000, likes: 20 },
    { id: 5, text: '今天看到夕阳很美，可惜没有人一起分享。', timestamp: Date.now() - 3600000, likes: 6 },
    { id: 6, text: '室友都睡了，只有我还在失眠。', timestamp: Date.now() - 1800000, likes: 11 }
  ],

  saveTreeholeMessage(text) {
    const messages = this.getAllTreeholeMessages();
    messages.unshift({
      id: Date.now(),
      text: SecurityUtils.sanitizeHTML(text.substring(0, 200)),
      timestamp: Date.now(),
      likes: 0
    });
    SecurityUtils.safeSetItem(this.TREEHOLE_KEY, messages.slice(0, 50));
  },

  getAllTreeholeMessages() {
    const stored = SecurityUtils.safeGetItem(this.TREEHOLE_KEY, []);
    if (!stored || stored.length === 0) return [...this.SEED_MESSAGES];
    return stored;
  },

  getLatestTreeholeMessages(count = 3) {
    return this.getAllTreeholeMessages().slice(0, count);
  },

  likeTreeholeMessage(id) {
    const messages = this.getAllTreeholeMessages();
    const msg = messages.find(m => m.id === id);
    if (msg) msg.likes = (msg.likes || 0) + 1;
    SecurityUtils.safeSetItem(this.TREEHOLE_KEY, messages);
    return msg ? msg.likes : 0;
  },

  recordGoodnight(choice) {
    const today = new Date().toISOString().split('T')[0];
    const log = SecurityUtils.safeGetItem(this.GOODNIGHT_KEY, {});
    log[today] = { choice, timestamp: Date.now() };
    SecurityUtils.safeSetItem(this.GOODNIGHT_KEY, log);
    return this.getGoodnightStreak();
  },

  getGoodnightStreak() {
    const log = SecurityUtils.safeGetItem(this.GOODNIGHT_KEY, {});
    let streak = 0;
    let date = new Date();
    while (true) {
      const key = date.toISOString().split('T')[0];
      if (log[key]) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  getGoodnightCalendar() {
    const log = SecurityUtils.safeGetItem(this.GOODNIGHT_KEY, {});
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const checkedDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      checkedDays.push({ day: d, checked: !!log[key], choice: log[key]?.choice });
    }
    return { year, month, daysInMonth, firstDay, checkedDays, today: now.getDate() };
  },

  getMusicPreference() {
    try {
      const data = localStorage.getItem(this.MUSIC_PREF_KEY);
      return data ? JSON.parse(data) : { lastMusic: null, lastVolume: 0.5, lastScene: null };
    } catch (e) {
      return { lastMusic: null, lastVolume: 0.5, lastScene: null };
    }
  },

  saveMusicPreference(pref) {
    try {
      localStorage.setItem(this.MUSIC_PREF_KEY, JSON.stringify(pref));
    } catch (e) { }
  }
};
