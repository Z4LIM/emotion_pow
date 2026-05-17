const PageAbout = {
  render() {
    return `
      <div class="page-about">
        <section class="about-hero comic-panel">
          <h1 class="text-h1">关于心情记录</h1>
          <p class="text-body-lg">探索 iOS 18 健康应用中的情绪追踪功能</p>
        </section>

        <section class="about-content comic-grid">
          <div class="comic-card about-card" style="grid-column: 1 / 7;">
            <div class="about-card-icon">📱</div>
            <h3 class="text-h3">iOS 18 心情记录</h3>
            <p class="text-body">
              Apple 在 iOS 17 中首次引入了心情记录功能，并在 iOS 18 中进一步完善。
              用户可以通过健康 App 记录自己当下的心情或情绪状态，
              数据将被安全地存储在设备上，并可与医疗提供者共享。
            </p>
            <div class="comic-dialogue-bubble">
              <p class="text-body-sm">心情记录基于效价（Valence）模型，将情绪映射到从消极到积极的连续光谱上。</p>
            </div>
          </div>

          <div class="comic-card about-card" style="grid-column: 7 / 13;">
            <div class="about-card-icon">🏥</div>
            <h3 class="text-h3">HealthKit 集成</h3>
            <p class="text-body">
              心情数据通过 HealthKit 框架存储和管理，与心率、睡眠、步数等其他健康数据并列，
              成为个人健康档案的重要组成部分。
            </p>
            <div class="about-tech-details">
              <div class="tech-detail-item">
                <span class="text-caption">数据类型</span>
                <span class="text-body-sm">HKCategoryType .mood / .emotion</span>
              </div>
              <div class="tech-detail-item">
                <span class="text-caption">效价值</span>
                <span class="text-body-sm">-1.0（极度消极）至 +1.0（极度积极）</span>
              </div>
              <div class="tech-detail-item">
                <span class="text-caption">关联因素</span>
                <span class="text-body-sm">生活场景 + 个人影响</span>
              </div>
            </div>
          </div>
        </section>

        <section class="about-features comic-panel">
          <h2 class="text-h3">本概念网站功能</h2>
          <div class="about-features-grid">
            <div class="about-feature">
              <div class="about-feature-icon">✏️</div>
              <h4 class="text-h4">心情记录</h4>
              <p class="text-body-sm">模拟 iOS 18 的心情记录流程：选择类型 → 设置效价 → 选择情绪标签 → 关联因素</p>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">📊</div>
              <h4 class="text-h4">数据洞察</h4>
              <p class="text-body-sm">可视化情绪趋势图、日历热力图和统计分析</p>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">🖐️</div>
              <h4 class="text-h4">隔空手势</h4>
              <p class="text-body-sm">支持摄像头手势识别，隔空操控界面元素</p>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">📚</div>
              <h4 class="text-h4">心理知识</h4>
              <p class="text-body-sm">以漫画形式传播情绪科学知识</p>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">🌙</div>
              <h4 class="text-h4">暗色模式</h4>
              <p class="text-body-sm">完整的明暗双主题支持，保护夜间使用体验</p>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">📱</div>
              <h4 class="text-h4">多端适配</h4>
              <p class="text-body-sm">桌面端、平板、手机三端自适应布局</p>
            </div>
          </div>
        </section>

        <section class="about-disclaimer comic-card">
          <h3 class="text-h4">⚠️ 声明</h3>
          <p class="text-body-sm">
            本网站为概念演示项目，旨在以交互式方式展示 iOS 18 心情记录模块的设计理念，
            并作为心理知识的传播工具。本网站不收集任何个人数据，所有数据仅存储在本地浏览器中。
            本网站不是医疗工具，如有心理健康问题请咨询专业人士。
          </p>
        </section>

        <section class="about-tech comic-card">
          <h3 class="text-h4">技术栈</h3>
          <div class="tech-tags">
            <span class="comic-tag">HTML5</span>
            <span class="comic-tag">CSS3</span>
            <span class="comic-tag">JavaScript</span>
            <span class="comic-tag">Anime.js</span>
            <span class="comic-tag">Chart.js</span>
            <span class="comic-tag">MediaPipe Hands</span>
            <span class="comic-tag">LocalStorage</span>
            <span class="comic-tag">SPA</span>
          </div>
        </section>

        <section class="about-security comic-card">
          <h3 class="text-h4">🔒 安全说明</h3>
          <div class="security-items">
            <div class="security-item">
              <h4 class="text-h4">内容安全策略 (CSP)</h4>
              <p class="text-body-sm">网站配置了严格的内容安全策略，防止 XSS 攻击和未经授权的资源加载。</p>
            </div>
            <div class="security-item">
              <h4 class="text-h4">数据本地化</h4>
              <p class="text-body-sm">所有数据完全存储在您的本地浏览器中，不会发送到任何服务器。</p>
            </div>
            <div class="security-item">
              <h4 class="text-h4">输入验证</h4>
              <p class="text-body-sm">所有用户输入都会经过清理和验证，确保数据安全。</p>
            </div>
            <div class="security-item">
              <h4 class="text-h4">隐私保护</h4>
              <p class="text-body-sm">摄像头仅在您主动启用时开启，关闭后立即释放所有资源。</p>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  mount() {},

  unmount() {}
};
