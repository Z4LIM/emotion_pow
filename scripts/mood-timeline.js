const MoodTimeline = {
  TIME_POINTS: [
    { id: 'today', label: '今天' },
    { id: 'yesterday', label: '昨天' },
    { id: 'this-week', label: '本周' },
    { id: 'earlier', label: '更早' }
  ],

  _assignments: [],
  _changeCallback: null,
  _dragState: null,
  _touchDragEl: null,

  render(recordData) {
    const valence = recordData ? recordData.valence : 0;
    const label = recordData ? recordData.label : '';
    const type = recordData ? recordData.type : 'mood';
    const emoji = this._getValenceEmoji(valence);
    const color = typeof artEngine !== 'undefined' ? artEngine.getEmotionColor(valence) : 'var(--color-emotion-positive)';

    return `
      <div class="mood-timeline-container">
        <div class="timeline-summary-bar" style="border-color: ${color}">
          <span class="summary-emoji">${emoji}</span>
          <span class="summary-label">${label || this._getValenceDescription(valence)}</span>
          <span class="summary-valence" style="color: ${color}">${valence > 0 ? '+' : ''}${valence.toFixed(1)}</span>
        </div>
        <div class="timeline-content">
          <div class="timeline-factors">
            <div class="factors-group">
              <div class="factors-group-label">生活场景</div>
              <div class="factors-cards">
                ${ASSOCIATED_FACTORS.lifeScenes.map(f => `
                  <div class="factor-drag-card" draggable="true" data-factor-id="${f.id}" data-factor-label="${f.label}">
                    <span class="factor-card-label">${f.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="factors-group">
              <div class="factors-group-label">个人影响</div>
              <div class="factors-cards">
                ${ASSOCIATED_FACTORS.personalImpact.map(f => `
                  <div class="factor-drag-card" draggable="true" data-factor-id="${f.id}" data-factor-label="${f.label}">
                    <span class="factor-card-label">${f.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div class="timeline-track-wrapper">
            <div class="timeline-track">
              ${this.TIME_POINTS.map((tp, i) => `
                <div class="timeline-point" data-time-id="${tp.id}">
                  <div class="timeline-point-marker"></div>
                  <div class="timeline-point-label">${tp.label}</div>
                  <div class="timeline-attached-cards" data-time-id="${tp.id}"></div>
                </div>
                ${i < this.TIME_POINTS.length - 1 ? '<div class="timeline-track-segment"></div>' : ''}
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  mount() {
    this._assignments = [];
    this._bindDragEvents();
    this._bindTouchEvents();
  },

  getData() {
    return this._assignments.map(a => ({
      factorId: a.factorId,
      timePoint: a.timePoint
    }));
  },

  onChange(callback) {
    this._changeCallback = callback;
  },

  _bindDragEvents() {
    const container = document.querySelector('.mood-timeline-container');
    if (!container) return;

    container.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.factor-drag-card');
      if (!card) return;
      this._dragState = { factorId: card.dataset.factorId, factorLabel: card.dataset.factorLabel };
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.factorId);
    });

    container.addEventListener('dragend', (e) => {
      const card = e.target.closest('.factor-drag-card');
      if (card) card.classList.remove('dragging');
      this._clearHighlights();
      this._dragState = null;
    });

    const track = container.querySelector('.timeline-track');
    if (!track) return;

    track.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const nearest = this._findNearestPoint(e.clientX, e.clientY);
      this._clearHighlights();
      if (nearest) nearest.classList.add('highlight');
    });

    track.addEventListener('dragleave', () => {
      this._clearHighlights();
    });

    track.addEventListener('drop', (e) => {
      e.preventDefault();
      this._clearHighlights();
      if (!this._dragState) return;

      const nearest = this._findNearestPoint(e.clientX, e.clientY);
      if (!nearest) return;

      const timeId = nearest.dataset.timeId;
      this._attachFactor(this._dragState.factorId, this._dragState.factorLabel, timeId);
      this._dragState = null;
    });
  },

  _bindTouchEvents() {
    const container = document.querySelector('.mood-timeline-container');
    if (!container) return;

    let touchCard = null;
    let touchClone = null;
    let offsetX = 0;
    let offsetY = 0;

    container.addEventListener('touchstart', (e) => {
      const card = e.target.closest('.factor-drag-card');
      if (!card) return;

      touchCard = card;
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      touchClone = card.cloneNode(true);
      touchClone.classList.add('dragging');
      touchClone.style.position = 'fixed';
      touchClone.style.width = rect.width + 'px';
      touchClone.style.zIndex = '9999';
      touchClone.style.pointerEvents = 'none';
      touchClone.style.left = (touch.clientX - offsetX) + 'px';
      touchClone.style.top = (touch.clientY - offsetY) + 'px';
      document.body.appendChild(touchClone);

      card.style.opacity = '0.4';
      this._dragState = { factorId: card.dataset.factorId, factorLabel: card.dataset.factorLabel };
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!touchClone) return;
      e.preventDefault();
      const touch = e.touches[0];
      touchClone.style.left = (touch.clientX - offsetX) + 'px';
      touchClone.style.top = (touch.clientY - offsetY) + 'px';

      const nearest = this._findNearestPoint(touch.clientX, touch.clientY);
      this._clearHighlights();
      if (nearest) nearest.classList.add('highlight');
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
      if (!touchClone || !touchCard) return;

      const touch = e.changedTouches[0];
      const nearest = this._findNearestPoint(touch.clientX, touch.clientY);
      this._clearHighlights();

      if (nearest && this._dragState) {
        const timeId = nearest.dataset.timeId;
        this._attachFactor(this._dragState.factorId, this._dragState.factorLabel, timeId);
      }

      touchCard.style.opacity = '';
      document.body.removeChild(touchClone);
      touchClone = null;
      touchCard = null;
      this._dragState = null;
    });
  },

  _findNearestPoint(clientX, clientY) {
    const points = document.querySelectorAll('.timeline-point');
    let nearest = null;
    let minDist = Infinity;

    points.forEach(point => {
      const rect = point.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((clientX - cx) ** 2 + (clientY - cy) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = point;
      }
    });

    if (nearest && minDist < 120) return nearest;
    return null;
  },

  _clearHighlights() {
    document.querySelectorAll('.timeline-point.highlight').forEach(p => p.classList.remove('highlight'));
  },

  _attachFactor(factorId, factorLabel, timeId) {
    const existing = this._assignments.findIndex(a => a.factorId === factorId);
    if (existing >= 0) {
      this._removeAttachedCard(this._assignments[existing].factorId, this._assignments[existing].timePoint);
      this._assignments.splice(existing, 1);
    }

    this._assignments.push({ factorId, factorLabel, timePoint: timeId });

    const attachedContainer = document.querySelector(`.timeline-attached-cards[data-time-id="${timeId}"]`);
    if (!attachedContainer) return;

    const cardEl = document.createElement('div');
    cardEl.className = 'timeline-attached-card';
    cardEl.dataset.factorId = factorId;
    cardEl.innerHTML = `
      <div class="timeline-connector"></div>
      <div class="attached-card-inner">
        <span class="attached-card-label">${factorLabel}</span>
        <button class="attached-card-remove" data-factor-id="${factorId}" aria-label="移除${factorLabel}">×</button>
      </div>
    `;
    attachedContainer.appendChild(cardEl);

    const point = document.querySelector(`.timeline-point[data-time-id="${timeId}"]`);
    if (point) {
      point.classList.add('flash');
      setTimeout(() => point.classList.remove('flash'), 600);
    }

    const sourceCard = document.querySelector(`.factor-drag-card[data-factor-id="${factorId}"]`);
    if (sourceCard) sourceCard.classList.add('assigned');

    cardEl.querySelector('.attached-card-remove').addEventListener('click', () => {
      this._detachFactor(factorId);
    });

    this._notifyChange();
  },

  _detachFactor(factorId) {
    const idx = this._assignments.findIndex(a => a.factorId === factorId);
    if (idx < 0) return;

    const assignment = this._assignments[idx];
    this._removeAttachedCard(factorId, assignment.timePoint);
    this._assignments.splice(idx, 1);

    const sourceCard = document.querySelector(`.factor-drag-card[data-factor-id="${factorId}"]`);
    if (sourceCard) sourceCard.classList.remove('assigned');

    this._notifyChange();
  },

  _removeAttachedCard(factorId, timeId) {
    const container = document.querySelector(`.timeline-attached-cards[data-time-id="${timeId}"]`);
    if (!container) return;
    const card = container.querySelector(`.timeline-attached-card[data-factor-id="${factorId}"]`);
    if (card) card.remove();
  },

  _notifyChange() {
    if (typeof this._changeCallback === 'function') {
      this._changeCallback(this.getData());
    }
  },

  _getValenceEmoji(valence) {
    if (valence >= 0.6) return '😄';
    if (valence >= 0.2) return '🙂';
    if (valence >= -0.2) return '😐';
    if (valence >= -0.6) return '😔';
    return '😢';
  },

  _getValenceDescription(valence) {
    if (valence >= 0.8) return '非常棒';
    if (valence >= 0.6) return '挺好的';
    if (valence >= 0.4) return '还不错';
    if (valence >= 0.2) return '有点好';
    if (valence >= -0.2) return '一般般';
    if (valence >= -0.4) return '有点差';
    if (valence >= -0.6) return '不太好';
    if (valence >= -0.8) return '挺糟糕';
    return '非常差';
  }
};
