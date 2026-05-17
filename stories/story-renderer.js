const StoryRenderer = {
  render(storyData) {
    if (!storyData || !storyData.pages) return '<p class="text-body">故事数据无效</p>';

    return `
      <div class="story-rendered" data-story-id="${storyData.id}">
        ${storyData.pages.map((page, pageIndex) => this.renderPage(page, pageIndex, storyData.pages.length)).join('')}
      </div>
    `;
  },

  renderPage(page, pageIndex, totalPages) {
    return `
      <div class="story-rendered-page" data-page="${pageIndex}" style="display: ${pageIndex === 0 ? 'block' : 'none'}">
        <div class="story-rendered-panels comic-grid">
          ${page.panels.map((panel, panelIndex) => this.renderPanel(panel, panelIndex)).join('')}
        </div>
      </div>
    `;
  },

  renderPanel(panel, index) {
    const columnSpan = this.getColumnSpan(panel, index);

    switch (panel.type) {
      case 'dialogue':
        return `
          <div class="story-panel story-panel-dialogue" style="grid-column: ${columnSpan}" data-parallax="0.5">
            ${this.renderDialoguePanel(panel)}
          </div>
        `;

      case 'scene':
        return `
          <div class="story-panel story-panel-scene comic-panel" style="grid-column: ${columnSpan}" data-parallax="1">
            ${this.renderScenePanel(panel)}
          </div>
        `;

      case 'info':
        return `
          <div class="story-panel story-panel-info" style="grid-column: ${columnSpan}" data-parallax="0.3">
            ${this.renderInfoPanel(panel)}
          </div>
        `;

      default:
        return '';
    }
  },

  getColumnSpan(panel, index) {
    if (panel.type === 'scene') return '1 / 13';
    if (panel.type === 'info') return '2 / 12';
    if (index % 2 === 0) return '1 / 7';
    return '7 / 13';
  },

  renderDialoguePanel(panel) {
    return `
      <div class="comic-dialogue-bubble">
        <span class="dialogue-speaker">${panel.speaker}</span>
        <p class="text-body">${panel.text}</p>
      </div>
    `;
  },

  renderScenePanel(panel) {
    const moodColors = {
      anxious: 'var(--color-emotion-negative)',
      sad: 'var(--color-emotion-negative-deep)',
      joyful: 'var(--color-emotion-positive-deep)',
      angry: 'var(--color-emotion-negative)',
      neutral: 'var(--color-emotion-neutral)'
    };
    const bgColor = moodColors[panel.mood] || 'var(--color-bg-secondary)';

    return `
      <div class="scene-visual" style="background-color: ${bgColor}">
        <div class="scene-visual-overlay"></div>
        <div class="scene-visual-content">
          <p class="handwriting-note scene-description">${panel.description}</p>
        </div>
      </div>
    `;
  },

  renderInfoPanel(panel) {
    return `
      <div class="comic-card story-info-card">
        <h4 class="text-h4">${panel.title}</h4>
        <ul class="info-list">
          ${panel.items.map(item => `
            <li class="info-item">
              <strong class="info-item-label">${item.label}</strong>
              <span class="text-body-sm">${item.desc}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  initInteractions(container) {
    if (!container) return;

    const panels = container.querySelectorAll('.story-panel-scene');
    panels.forEach(panel => {
      ComicInteraction.createPerspectiveTilt(panel, 3);
    });

    const storyEl = container.querySelector('.story-rendered');
    if (storyEl) {
      ComicInteraction.createParallaxEffect(storyEl, 0.015);
    }
  }
};
