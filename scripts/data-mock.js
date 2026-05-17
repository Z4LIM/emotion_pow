const DataMock = {
  generateMockRecords(days = 30) {
    const records = [];
    const now = Date.now();

    for (let i = 0; i < days; i++) {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < count; j++) {
        const timestamp = now - i * 24 * 60 * 60 * 1000 + Math.random() * 12 * 60 * 60 * 1000;
        const valence = (Math.random() * 2 - 1);
        const label = EMOTION_LABELS[Math.floor(Math.random() * EMOTION_LABELS.length)];
        const allFactors = [...ASSOCIATED_FACTORS.lifeScenes, ...ASSOCIATED_FACTORS.personalImpact];
        const factorCount = Math.floor(Math.random() * 3);
        const factors = [];
        for (let k = 0; k < factorCount; k++) {
          const f = allFactors[Math.floor(Math.random() * allFactors.length)];
          if (!factors.includes(f.id)) factors.push(f.id);
        }

        records.push({
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5) + i + j,
          type: Math.random() > 0.5 ? 'mood' : 'emotion',
          valence: Math.round(valence * 10) / 10,
          label: label.label,
          factors,
          timestamp,
          duration: Math.floor(Math.random() * 120) + 5
        });
      }
    }

    return records.sort((a, b) => b.timestamp - a.timestamp);
  },

  injectMockData() {
    const existing = moodManager.getMoods();
    if (existing.length > 0) return existing;

    const mockRecords = this.generateMockRecords();
    SecurityUtils.safeSetItem(moodManager.STORAGE_KEY, mockRecords);
    return mockRecords;
  }
};
