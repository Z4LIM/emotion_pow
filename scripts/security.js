const SecurityUtils = {
  escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
  sanitizeHTML(html) {
    if (typeof html !== 'string') return html;
    const allowedTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a', 'nav', 'main', 'section', 'article', 'header', 'footer', 'img', 'canvas'];
    const allowedAttrs = ['class', 'id', 'data-', 'href', 'aria-label', 'src', 'alt', 'type'];
    const div = document.createElement('div');
    div.innerHTML = html;
    const sanitize = (el) => {
      if (el.nodeType === 3) return;
      [...el.childNodes].forEach(child => {
        if (child.nodeType === 1) {
          sanitize(child);
        }
      });
      if (el.nodeType !== 1) return;
      const tagName = el.tagName.toLowerCase();
      if (!allowedTags.includes(tagName)) {
        el.replaceWith(document.createTextNode(el.textContent || ''));
        return;
      }
      [...el.attributes].forEach(attr => {
        const attrName = attr.name.toLowerCase();
        const isAllowed = allowedAttrs.some(a => attrName.startsWith(a));
        const isSafe = !attrName.startsWith('on') && !attrName.includes('javascript');
        if (!isAllowed || !isSafe) {
          el.removeAttribute(attr.name);
        }
      });
    };
    sanitize(div);
    return div.innerHTML;
  },
  validateMoodRecord(record) {
    const valid = {
      type: record.type === 'mood' || record.type === 'emotion' ? record.type : 'mood',
      valence: Math.max(-1, Math.min(1, Number(record.valence) || 0)),
      arousal: Math.max(-1, Math.min(1, Number(record.arousal) || 0)),
      label: this.escapeHtml(record.label || ''),
      labels: Array.isArray(record.labels) ? record.labels.map(l => this.escapeHtml(l)) : [],
      factors: Array.isArray(record.factors) ? record.factors.map(f => this.escapeHtml(f)) : [],
      factorsTimeline: Array.isArray(record.factorsTimeline)
        ? record.factorsTimeline.map(ft => ({
            factorId: this.escapeHtml(ft.factorId || ''),
            timePoint: this.escapeHtml(ft.timePoint || '')
          }))
        : [],
      journal: this.escapeHtml(record.journal || ''),
      timestamp: Number(record.timestamp) || Date.now()
    };
    return valid;
  },
  safeGetItem(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.warn('Security: Failed to read from localStorage', e);
      return defaultValue;
    }
  },
  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Security: Failed to write to localStorage', e);
      return false;
    }
  },
  safeRemoveItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Security: Failed to remove from localStorage', e);
      return false;
    }
  }
};
