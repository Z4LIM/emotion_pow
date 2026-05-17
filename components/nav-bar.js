const NavBar = {
  routes: [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/sleep', label: '睡前', icon: '🌙' },
    { path: '/record', label: '记录', icon: '✏️' },
    { path: '/knowledge', label: '知识库', icon: '📚' },
    { path: '/insights', label: '洞察', icon: '📊' }
  ],

  currentPath: '/',

  render() {
    const nav = document.getElementById('nav-bar');
    if (!nav) return;

    const isMobile = ResponsiveConfig.isMobile();

    nav.innerHTML = `
      <div class="nav-inner ${isMobile ? 'nav-mobile' : 'nav-desktop'}">
        <div class="nav-brand">
          <span class="nav-brand-icon">💭</span>
          <span class="nav-brand-text">心情记录</span>
        </div>
        ${isMobile ? '' : `
          <div class="nav-links">
            ${this.routes.map(r => `
              <a href="#${r.path}" class="nav-link ${this.currentPath === r.path ? 'nav-link-active' : ''}" 
                 data-route="${r.path}" aria-label="${r.label}">
                <span class="nav-link-icon">${r.icon}</span>
                <span class="nav-link-text">${r.label}</span>
              </a>
            `).join('')}
          </div>
        `}
        <div class="nav-actions">
          <button class="nav-theme-toggle" id="theme-toggle" aria-label="切换主题">
            <span class="theme-icon">${artEngine.currentTheme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          <button class="nav-camera-toggle" id="camera-toggle" aria-label="手势识别">
            <span class="camera-icon">🖐️</span>
          </button>
        </div>
      </div>
      ${isMobile ? `
        <div class="nav-bottom-bar">
          ${this.routes.map(r => `
            <a href="#${r.path}" class="nav-tab ${this.currentPath === r.path ? 'nav-tab-active' : ''}" 
               data-route="${r.path}" aria-label="${r.label}">
              <span class="nav-tab-icon">${r.icon}</span>
              <span class="nav-tab-label">${r.label}</span>
            </a>
          `).join('')}
        </div>
      ` : ''}
    `;

    this.bindEvents();
  },

  bindEvents() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        artEngine.toggleTheme();
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) icon.textContent = artEngine.currentTheme === 'dark' ? '☀️' : '🌙';
      });
    }

    const cameraToggle = document.getElementById('camera-toggle');
    if (cameraToggle) {
      cameraToggle.addEventListener('click', () => {
        if (GestureManager.isCameraActive()) {
          GestureManager.disableCamera();
          cameraToggle.classList.remove('camera-active');
        } else {
          GestureManager.enableCamera();
          cameraToggle.classList.add('camera-loading');
        }
      });
    }

    GestureManager.on('camera-ready', (active) => {
      if (cameraToggle) {
        cameraToggle.classList.toggle('camera-active', active);
        cameraToggle.classList.remove('camera-loading');
      }
    });

    GestureManager.on('camera-error', () => {
      if (cameraToggle) {
        cameraToggle.classList.remove('camera-loading', 'camera-active');
      }
    });
  },

  setActive(path) {
    this.currentPath = path;
    const navPath = path.startsWith('/sleep') ? '/sleep' : path;

    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.toggle('nav-link-active', el.dataset.route === navPath);
    });

    document.querySelectorAll('.nav-tab').forEach(el => {
      el.classList.toggle('nav-tab-active', el.dataset.route === navPath);
    });
  },

  update() {
    this.render();
  }
};
