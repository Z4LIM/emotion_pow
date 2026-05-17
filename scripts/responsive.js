const ResponsiveConfig = {
  BREAKPOINTS: {
    mobile: 768,
    tablet: 1024,
    desktop: 1024
  },

  currentDevice: 'desktop',

  init() {
    this.detect();
    window.addEventListener('resize', () => this.detect());
  },

  detect() {
    const width = window.innerWidth;
    if (width < this.BREAKPOINTS.mobile) {
      this.currentDevice = 'mobile';
    } else if (width < this.BREAKPOINTS.tablet) {
      this.currentDevice = 'tablet';
    } else {
      this.currentDevice = 'desktop';
    }
    document.documentElement.setAttribute('data-device', this.currentDevice);
    return this.currentDevice;
  },

  isMobile() { return this.currentDevice === 'mobile'; },
  isTablet() { return this.currentDevice === 'tablet'; },
  isDesktop() { return this.currentDevice === 'desktop'; },

  isLowEndDevice() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    return memory < 4 || cores < 4;
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

ResponsiveConfig.init();
