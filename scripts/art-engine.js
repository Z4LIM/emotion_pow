class ArtEngine {
  constructor() {
    this.currentTheme = 'light';
    this.initTheme();
  }

  initTheme() {
    const saved = SecurityUtils.safeGetItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved && (saved === 'light' || saved === 'dark')) {
      this.currentTheme = saved;
    } else if (prefersDark) {
      this.currentTheme = 'dark';
    }

    this.applyTheme(this.currentTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!SecurityUtils.safeGetItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    SecurityUtils.safeSetItem('theme', newTheme);
  }

  getEmotionColor(valence) {
    if (valence <= -0.6) return 'var(--color-emotion-negative-deep)';
    if (valence <= -0.2) return 'var(--color-emotion-negative)';
    if (valence <= 0.2) return 'var(--color-emotion-neutral)';
    if (valence <= 0.6) return 'var(--color-emotion-positive)';
    return 'var(--color-emotion-positive-deep)';
  }

  getEmotionColorRaw(valence) {
    const cs = getComputedStyle(document.documentElement);
    if (valence <= -0.6) return cs.getPropertyValue('--color-emotion-negative-deep').trim() || '#8B6F6A';
    if (valence <= -0.2) return cs.getPropertyValue('--color-emotion-negative').trim() || '#A68A85';
    if (valence <= 0.2) return cs.getPropertyValue('--color-emotion-neutral').trim() || '#9B9895';
    if (valence <= 0.6) return cs.getPropertyValue('--color-emotion-positive').trim() || '#8AA68A';
    return cs.getPropertyValue('--color-emotion-positive-deep').trim() || '#6A8B6A';
  }
}

const artEngine = new ArtEngine();
