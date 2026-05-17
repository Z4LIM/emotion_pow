const EMOTION_LABELS = [
  { id: 'enthusiastic', label: '热忱', defaultValence: 0.8 },
  { id: 'relieved', label: '如释重负', defaultValence: 0.6 },
  { id: 'joyful', label: '喜悦', defaultValence: 0.9 },
  { id: 'grateful', label: '感恩', defaultValence: 0.7 },
  { id: 'peaceful', label: '平静', defaultValence: 0.4 },
  { id: 'hopeful', label: '充满希望', defaultValence: 0.6 },
  { id: 'proud', label: '自豪', defaultValence: 0.7 },
  { id: 'amused', label: '愉悦', defaultValence: 0.5 },
  { id: 'inspired', label: '受到启发', defaultValence: 0.7 },
  { id: 'confident', label: '自信', defaultValence: 0.6 },
  { id: 'neutral', label: '中性', defaultValence: 0 },
  { id: 'contemplative', label: '沉思', defaultValence: 0.1 },
  { id: 'indifferent', label: '无所谓', defaultValence: 0 },
  { id: 'bored', label: '无聊', defaultValence: -0.1 },
  { id: 'anxious', label: '焦虑', defaultValence: -0.5 },
  { id: 'sad', label: '悲伤', defaultValence: -0.6 },
  { id: 'angry', label: '愤怒', defaultValence: -0.7 },
  { id: 'frustrated', label: '沮丧', defaultValence: -0.5 },
  { id: 'lonely', label: '孤独', defaultValence: -0.6 },
  { id: 'overwhelmed', label: '不堪重负', defaultValence: -0.7 },
  { id: 'guilty', label: '内疚', defaultValence: -0.4 },
  { id: 'embarrassed', label: '尴尬', defaultValence: -0.3 }
];

const ASSOCIATED_FACTORS = {
  lifeScenes: [
    { id: 'work', label: '工作', icon: 'briefcase' },
    { id: 'family', label: '家庭', icon: 'home' },
    { id: 'friends', label: '朋友', icon: 'users' },
    { id: 'partner', label: '伴侣', icon: 'heart' },
    { id: 'social', label: '社交', icon: 'message-circle' },
    { id: 'study', label: '学习', icon: 'book' },
    { id: 'commute', label: '通勤', icon: 'map' },
    { id: 'leisure', label: '休闲', icon: 'coffee' }
  ],
  personalImpact: [
    { id: 'health', label: '健康', icon: 'activity' },
    { id: 'sleep', label: '睡眠', icon: 'moon' },
    { id: 'exercise', label: '运动', icon: 'zap' },
    { id: 'diet', label: '饮食', icon: 'utensils' },
    { id: 'weather', label: '天气', icon: 'cloud' },
    { id: 'finance', label: '财务', icon: 'wallet' },
    { id: 'creativity', label: '创造力', icon: 'palette' },
    { id: 'self-care', label: '自我关怀', icon: 'smile' }
  ]
};

class MoodManager {
  constructor() {
    this.STORAGE_KEY = 'mood-journal-records';
  }

  recordMood(data) {
    const record = SecurityUtils.validateMoodRecord(data);
    record.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    const records = this.getMoods();
    records.push(record);
    
    SecurityUtils.safeSetItem(this.STORAGE_KEY, records);
    return record;
  }

  getMoods() {
    return SecurityUtils.safeGetItem(this.STORAGE_KEY, []);
  }

  getMoodsByDateRange(start, end) {
    return this.getMoods().filter(r => r.timestamp >= start && r.timestamp <= end);
  }

  getMoodTrend(days = 30) {
    const now = Date.now();
    const start = now - days * 24 * 60 * 60 * 1000;
    const records = this.getMoodsByDateRange(start, now);

    const byDate = {};
    records.forEach(r => {
      const date = new Date(r.timestamp).toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(r.valence);
    });

    return Object.entries(byDate).map(([date, valences]) => ({
      date,
      avgValence: valences.reduce((a, b) => a + b, 0) / valences.length,
      count: valences.length
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  getCalendarData(month, year) {
    const records = this.getMoods();
    const calendarData = {};

    records.forEach(r => {
      const d = new Date(r.timestamp);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!calendarData[day]) calendarData[day] = [];
        calendarData[day].push(r.valence);
      }
    });

    return Object.fromEntries(
      Object.entries(calendarData).map(([day, valences]) => [
        day,
        valences.reduce((a, b) => a + b, 0) / valences.length
      ])
    );
  }

  deleteMood(id) {
    const safeId = SecurityUtils.escapeHtml(id);
    const records = this.getMoods().filter(r => r.id !== safeId);
    SecurityUtils.safeSetItem(this.STORAGE_KEY, records);
  }

  clearAll() {
    SecurityUtils.safeRemoveItem(this.STORAGE_KEY);
  }

  getMoodTrendWithArousal(days = 30) {
    const now = Date.now();
    const start = now - days * 24 * 60 * 60 * 1000;
    const records = this.getMoodsByDateRange(start, now);

    const byDate = {};
    records.forEach(r => {
      const date = new Date(r.timestamp).toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = { valences: [], arousals: [] };
      byDate[date].valences.push(r.valence || 0);
      byDate[date].arousals.push(r.arousal || 0);
    });

    return Object.entries(byDate).map(([date, data]) => ({
      date,
      avgValence: data.valences.reduce((a, b) => a + b, 0) / data.valences.length,
      avgArousal: data.arousals.reduce((a, b) => a + b, 0) / data.arousals.length,
      count: data.valences.length
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  getLabelDistribution() {
    const records = this.getMoods();
    const distribution = {};

    records.forEach(r => {
      const label = r.label || '未标记';
      distribution[label] = (distribution[label] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  getFactorDistribution() {
    const records = this.getMoods();
    const distribution = {};

    records.forEach(r => {
      (r.factors || []).forEach(factor => {
        distribution[factor] = (distribution[factor] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count);
  }

  getValenceArousalScatter(days = 30) {
    const now = Date.now();
    const start = now - days * 24 * 60 * 60 * 1000;
    const records = this.getMoodsByDateRange(start, now);

    return records.map(r => ({
      valence: r.valence || 0,
      arousal: r.arousal || 0,
      timestamp: r.timestamp,
      label: r.label
    }));
  }

  getHourlyPattern() {
    const records = this.getMoods();
    const hourlyData = Array(24).fill(null).map(() => ({ count: 0, avgValence: 0, avgArousal: 0, valences: [], arousals: [] }));

    records.forEach(r => {
      const hour = new Date(r.timestamp).getHours();
      hourlyData[hour].count++;
      hourlyData[hour].valences.push(r.valence || 0);
      hourlyData[hour].arousals.push(r.arousal || 0);
    });

    return hourlyData.map((h, hour) => ({
      hour,
      count: h.count,
      avgValence: h.count > 0 ? h.valences.reduce((a, b) => a + b, 0) / h.count : 0,
      avgArousal: h.count > 0 ? h.arousals.reduce((a, b) => a + b, 0) / h.count : 0
    }));
  }

  getJournalStats() {
    const records = this.getMoods();
    const journals = records.filter(r => r.journal && r.journal.trim());
    
    const totalJournals = journals.length;
    const totalWords = journals.reduce((sum, r) => sum + r.journal.length, 0);
    const avgWords = totalJournals > 0 ? Math.round(totalWords / totalJournals) : 0;

    const wordCounts = {};
    const commonWords = ['的', '是', '了', '在', '我', '有', '和', '他', '她', '它', '这', '那', '很', '都', '就', '也', '要', '会', '可以', '不', '我们', '你们', '他们'];
    
    journals.forEach(r => {
      const text = r.journal;
      const words = text.match(/[\u4e00-\u9fa5]+/g) || [];
      words.forEach(word => {
        if (word.length >= 2 && !commonWords.includes(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    });

    const topWords = Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return { totalJournals, totalWords, avgWords, topWords };
  }
}

const moodManager = new MoodManager();
