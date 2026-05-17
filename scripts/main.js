const App = {
  currentPage: null,
  currentPath: null,
  pageContainer: null,
  routes: {},
  isTransitioning: false,

  init() {
    this.pageContainer = document.getElementById('app');
    if (!this.pageContainer) return;

    this.registerRoutes();
    NavBar.render();
    DataMock.injectMockData();

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('resize', this.debounce(() => {
      NavBar.update();
    }, 250));

    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      this.handleRoute();
    }
  },

  registerRoutes() {
    this.routes = {
      '/': PageHome,
      '/knowledge': PageKnowledge,
      '/record': PageRecord,
      '/insights': PageInsights,
      '/about': PageAbout,
      '/stories': PageStories,
      '/sleep': PageSleepHome,
      '/sleep/white-noise': PageSleepWhiteNoise,
      '/sleep/text': PageSleepText,
      '/sleep/treehole': PageSleepTreehole,
      '/sleep/goodnight': PageSleepGoodnight
    };
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const path = this.normalizePath(hash);

    if (path === this.currentPath) return;
    if (this.isTransitioning) return;

    this.navigateTo(path);
  },

  normalizePath(hash) {
    // Remove query params for path matching
    const pathWithoutQuery = hash.split('?')[0];
    if (pathWithoutQuery.startsWith('/stories/')) return '/stories';
    if (pathWithoutQuery.startsWith('/sleep')) return pathWithoutQuery;
    if (pathWithoutQuery.startsWith('/')) return pathWithoutQuery;
    return '/' + pathWithoutQuery;
  },

  getRouteParams(hash) {
    if (hash.startsWith('/stories/')) {
      const id = hash.replace('/stories/', '');
      return { storyId: id };
    }
    return {};
  },

  async navigateTo(path) {
    this.isTransitioning = true;
    const page = this.routes[path];

    if (!page) {
      this.isTransitioning = false;
      window.location.hash = '#/';
      return;
    }

    const oldPage = this.currentPage;
    const oldElement = this.pageContainer.querySelector('.page-content');

    NavBar.setActive(path);

    const params = this.getRouteParams((window.location.hash.slice(1) || '/').replace(/^\//, ''));
    const newElement = document.createElement('div');
    newElement.className = 'page-content';
    newElement.setAttribute('data-page', path);
    newElement.innerHTML = page.render(params);

    if (oldElement) {
      await AnimationEngine.pageTransition(oldElement, newElement);
      this.pageContainer.innerHTML = '';
    } else {
      this.pageContainer.innerHTML = '';
    }

    this.pageContainer.appendChild(newElement);

    if (page.mount) {
      page.mount(params);
    }

    if (oldPage && oldPage.unmount) {
      oldPage.unmount();
    }

    this.currentPage = page;
    this.currentPath = path;
    this.isTransitioning = false;

    this.animatePageIn(newElement);
  },

  animatePageIn(element) {
    if (!AnimationEngine.shouldAnimate()) return;

    const panels = element.querySelectorAll('.comic-panel, .comic-card');
    if (panels.length > 0) {
      AnimationEngine.staggerReveal(panels, AnimationEngine.config.stagger.normal);
    }

    const bubbles = element.querySelectorAll('.comic-dialogue-bubble');
    bubbles.forEach((b, i) => {
      AnimationEngine.dialogueBubbleAppear(b);
    });

    const characters = element.querySelectorAll('.character-placeholder');
    characters.forEach(c => {
      AnimationEngine.characterEnter(c);
    });
  },

  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
