const PageInsights = {
  trendChart: null,
  labelChart: null,
  factorChart: null,
  scatterChart: null,
  hourlyChart: null,
  activeTab: 'trend',

  render() {
    const moods = moodManager.getMoods();
    const hasData = moods.length > 0;

    return `
      <div class="page-insights">
        <section class="insights-header comic-panel">
          <h1 class="text-h1">情绪洞察</h1>
          <p class="text-body-lg">可视化你的情绪数据，发现隐藏的模式</p>
        </section>

        ${hasData ? `
          <div class="insights-tabs">
            <button class="comic-tag ${this.activeTab === 'trend' ? 'selected' : ''}" data-gesture data-tab="trend">趋势图</button>
            <button class="comic-tag ${this.activeTab === 'calendar' ? 'selected' : ''}" data-gesture data-tab="calendar">日历</button>
            <button class="comic-tag ${this.activeTab === 'scatter' ? 'selected' : ''}" data-gesture data-tab="scatter">情绪空间</button>
            <button class="comic-tag ${this.activeTab === 'labels' ? 'selected' : ''}" data-gesture data-tab="labels">情绪分布</button>
            <button class="comic-tag ${this.activeTab === 'factors' ? 'selected' : ''}" data-gesture data-tab="factors">影响因素</button>
            <button class="comic-tag ${this.activeTab === 'hourly' ? 'selected' : ''}" data-gesture data-tab="hourly">时间模式</button>
            <button class="comic-tag ${this.activeTab === 'journal' ? 'selected' : ''}" data-gesture data-tab="journal">笔记统计</button>
          </div>

          <section class="insights-content" id="insights-content">
            ${this.renderActiveTab()}
          </section>
        ` : `
          <section class="insights-empty comic-panel">
            <div class="empty-icon">📝</div>
            <h3 class="text-h3">还没有记录</h3>
            <p class="text-body">开始记录你的心情，这里将展示情绪洞察</p>
            <a href="#/record" class="comic-btn comic-btn-primary" data-gesture>开始记录</a>
          </section>
        `}
      </div>
    `;
  },

  renderActiveTab() {
    switch (this.activeTab) {
      case 'trend': return this.renderTrendTab();
      case 'calendar': return this.renderCalendarTab();
      case 'scatter': return this.renderScatterTab();
      case 'labels': return this.renderLabelsTab();
      case 'factors': return this.renderFactorsTab();
      case 'hourly': return this.renderHourlyTab();
      case 'journal': return this.renderJournalTab();
      default: return '';
    }
  },

  renderTrendTab() {
    return `
      <div class="insights-trend comic-card">
        <h3 class="text-h4">30天情绪趋势</h3>
        <p class="text-body-sm">红色 = 效价（积极/消极），蓝色 = 唤醒度（兴奋/平静）</p>
        <div class="chart-container">
          <canvas id="trend-chart" aria-label="情绪趋势图表"></canvas>
        </div>
      </div>
    `;
  },

  renderCalendarTab() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const calendarData = moodManager.getCalendarData(month, year);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

    let calendarCells = '';
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarCells += '<div class="calendar-cell calendar-cell-empty"></div>';
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const valence = calendarData[day];
      const bgColor = valence !== undefined ? artEngine.getEmotionColor(valence) : 'transparent';
      const hasData = valence !== undefined;
      calendarCells += `
        <div class="calendar-cell ${hasData ? 'calendar-cell-has-data' : ''}" 
             style="background-color: ${bgColor}" 
             ${hasData ? `title="效价: ${valence.toFixed(1)}"` : ''}>
          <span class="calendar-day">${day}</span>
        </div>
      `;
    }

    return `
      <div class="insights-calendar comic-card">
        <h3 class="text-h4">${year}年${monthNames[month]}</h3>
        <div class="calendar-weekdays">
          <span>日</span><span>一</span><span>二</span><span>三</span>
          <span>四</span><span>五</span><span>六</span>
        </div>
        <div class="calendar-grid">
          ${calendarCells}
        </div>
        <div class="calendar-legend">
          <span class="calendar-legend-item">
            <span class="calendar-legend-color" style="background-color: var(--color-emotion-negative-deep)"></span>消极
          </span>
          <span class="calendar-legend-item">
            <span class="calendar-legend-color" style="background-color: var(--color-emotion-neutral)"></span>中性
          </span>
          <span class="calendar-legend-item">
            <span class="calendar-legend-color" style="background-color: var(--color-emotion-positive-deep)"></span>积极
          </span>
        </div>
      </div>
    `;
  },

  renderScatterTab() {
    return `
      <div class="insights-scatter comic-card">
        <h3 class="text-h4">情绪空间分布</h3>
        <p class="text-body-sm">X轴：效价（消极→积极），Y轴：唤醒度（平静→兴奋）</p>
        <div class="chart-container">
          <canvas id="scatter-chart" aria-label="效价-唤醒度散点图"></canvas>
        </div>
        <div class="scatter-quadrants">
          <div class="quadrant" style="--q-color: var(--color-emotion-positive-deep)">
            <span class="quadrant-label">高效价+高唤醒</span>
            <span class="quadrant-desc">兴奋、热情</span>
          </div>
          <div class="quadrant" style="--q-color: var(--color-emotion-positive)">
            <span class="quadrant-label">高效价+低唤醒</span>
            <span class="quadrant-desc">平静、满足</span>
          </div>
          <div class="quadrant" style="--q-color: var(--color-emotion-negative)">
            <span class="quadrant-label">低效价+高唤醒</span>
            <span class="quadrant-desc">焦虑、愤怒</span>
          </div>
          <div class="quadrant" style="--q-color: var(--color-emotion-negative-deep)">
            <span class="quadrant-label">低效价+低唤醒</span>
            <span class="quadrant-desc">悲伤、疲惫</span>
          </div>
        </div>
      </div>
    `;
  },

  renderLabelsTab() {
    const distribution = moodManager.getLabelDistribution();
    const total = distribution.reduce((sum, d) => sum + d.count, 0);

    return `
      <div class="insights-labels">
        <div class="insights-label-chart comic-card">
          <h3 class="text-h4">情绪标签分布</h3>
          <div class="chart-container">
            <canvas id="label-chart" aria-label="情绪标签分布饼图"></canvas>
          </div>
        </div>
        <div class="insights-label-list comic-card">
          <h4 class="text-h4">详细统计</h4>
          <div class="label-list">
            ${distribution.map((d, i) => `
              <div class="label-item">
                <span class="label-rank">${i + 1}</span>
                <span class="label-name text-body-sm">${d.label}</span>
                <div class="label-bar-wrapper">
                  <div class="label-bar" style="width: ${total > 0 ? (d.count / total) * 100 : 0}%"></div>
                </div>
                <span class="label-count text-caption">${d.count}次 (${total > 0 ? Math.round((d.count / total) * 100) : 0}%)</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderFactorsTab() {
    const distribution = moodManager.getFactorDistribution();
    const total = distribution.reduce((sum, d) => sum + d.count, 0);
    const allFactors = [...ASSOCIATED_FACTORS.lifeScenes, ...ASSOCIATED_FACTORS.personalImpact];

    return `
      <div class="insights-factors">
        <div class="insights-factor-chart comic-card">
          <h3 class="text-h4">影响因素分布</h3>
          <div class="chart-container">
            <canvas id="factor-chart" aria-label="影响因素分布柱状图"></canvas>
          </div>
        </div>
        <div class="insights-factor-list comic-card">
          <h4 class="text-h4">详细统计</h4>
          <div class="factor-grid">
            ${distribution.map((d, i) => {
              const factor = allFactors.find(f => f.id === d.factor);
              return `
                <div class="factor-card">
                  <div class="factor-rank">${i + 1}</div>
                  <div class="factor-info">
                    <span class="factor-name">${factor ? factor.label : d.factor}</span>
                    <span class="factor-count">${d.count}次</span>
                  </div>
                  <div class="factor-percent">${total > 0 ? Math.round((d.count / total) * 100) : 0}%</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderHourlyTab() {
    return `
      <div class="insights-hourly">
        <div class="insights-hourly-chart comic-card">
          <h3 class="text-h4">24小时情绪模式</h3>
          <p class="text-body-sm">红色 = 效价趋势，蓝色 = 唤醒度趋势</p>
          <div class="chart-container">
            <canvas id="hourly-chart" aria-label="24小时情绪模式图"></canvas>
          </div>
        </div>
        <div class="insights-hourly-stats comic-card">
          <h4 class="text-h4">时段分析</h4>
          <div class="hourly-stats-grid">
            ${this.getHourlyStats().map(stat => `
              <div class="hourly-stat-item">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-content">
                  <span class="stat-label">${stat.label}</span>
                  <span class="stat-value">${stat.value}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  getHourlyStats() {
    const hourlyData = moodManager.getHourlyPattern();
    const stats = [];
    
    let maxValenceHour = 0;
    let maxArousalHour = 0;
    let minValenceHour = 0;
    let maxActivityHour = 0;
    
    hourlyData.forEach((h, i) => {
      if (h.count > 0) {
        if (h.avgValence > hourlyData[maxValenceHour].avgValence) maxValenceHour = i;
        if (h.avgArousal > hourlyData[maxArousalHour].avgArousal) maxArousalHour = i;
        if (h.avgValence < hourlyData[minValenceHour].avgValence) minValenceHour = i;
        if (h.count > hourlyData[maxActivityHour].count) maxActivityHour = i;
      }
    });

    const formatHour = (h) => `${h}:00`;
    
    stats.push({ icon: '🌟', label: '最开心时段', value: formatHour(maxValenceHour) });
    stats.push({ icon: '🚀', label: '最兴奋时段', value: formatHour(maxArousalHour) });
    stats.push({ icon: '😔', label: '情绪低谷', value: formatHour(minValenceHour) });
    stats.push({ icon: '📊', label: '记录最频繁', value: formatHour(maxActivityHour) });
    
    return stats;
  },

  renderJournalTab() {
    const journalStats = moodManager.getJournalStats();

    return `
      <div class="insights-journal">
        <div class="journal-summary comic-grid">
          <div class="comic-card stat-card" style="grid-column: 1 / 5;">
            <div class="stat-value text-h2">${journalStats.totalJournals}</div>
            <div class="stat-label text-caption">笔记数量</div>
          </div>
          <div class="comic-card stat-card" style="grid-column: 5 / 9;">
            <div class="stat-value text-h2">${journalStats.totalWords}</div>
            <div class="stat-label text-caption">总字数</div>
          </div>
          <div class="comic-card stat-card" style="grid-column: 9 / 13;">
            <div class="stat-value text-h2">${journalStats.avgWords}</div>
            <div class="stat-label text-caption">平均字数</div>
          </div>
        </div>
        
        ${journalStats.topWords.length > 0 ? `
          <div class="journal-word-cloud comic-card">
            <h4 class="text-h4">高频词汇</h4>
            <div class="word-cloud">
              ${journalStats.topWords.map((w, i) => {
                const maxCount = journalStats.topWords[0]?.count || 1;
                const size = 0.8 + (w.count / maxCount) * 1.4;
                return `<span class="word-cloud-item" style="font-size: ${size}rem;">${w.word}</span>`;
              }).join('')}
            </div>
          </div>
        ` : `
          <div class="journal-empty comic-card">
            <div class="empty-icon">📝</div>
            <p class="text-body">还没有心情笔记记录</p>
          </div>
        `}
      </div>
    `;
  },

  mount() {
    this.bindTabEvents();

    if (this.activeTab === 'trend') this.initTrendChart();
    if (this.activeTab === 'scatter') this.initScatterChart();
    if (this.activeTab === 'labels') this.initLabelChart();
    if (this.activeTab === 'factors') this.initFactorChart();
    if (this.activeTab === 'hourly') this.initHourlyChart();
  },

  unmount() {
    [this.trendChart, this.labelChart, this.factorChart, this.scatterChart, this.hourlyChart].forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    this.trendChart = null;
    this.labelChart = null;
    this.factorChart = null;
    this.scatterChart = null;
    this.hourlyChart = null;
  },

  bindTabEvents() {
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        this.unmount();
        this.activeTab = tab.dataset.tab;
        const content = document.getElementById('insights-content');
        if (content) {
          content.innerHTML = this.renderActiveTab();
          this.bindTabEvents();
          this.mount();
        }

        document.querySelectorAll('[data-tab]').forEach(t => {
          t.classList.toggle('selected', t.dataset.tab === this.activeTab);
        });
      });
    });
  },

  initTrendChart() {
    const canvas = document.getElementById('trend-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const trend = moodManager.getMoodTrendWithArousal(30);
    const labels = trend.map(t => {
      const d = new Date(t.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const valenceData = trend.map(t => t.avgValence);
    const arousalData = trend.map(t => t.avgArousal);

    const isDark = artEngine.currentTheme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    const textColor = isDark ? '#C5C2BD' : '#6B6865';

    this.trendChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '效价',
            data: valenceData,
            borderColor: '#A68A85',
            backgroundColor: 'rgba(166, 138, 133, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: valenceData.map(v => artEngine.getEmotionColorRaw(v)),
            pointBorderColor: isDark ? '#2A2826' : '#F5F3F0',
            pointBorderWidth: 2,
            borderWidth: 3,
            yAxisID: 'y'
          },
          {
            label: '唤醒度',
            data: arousalData,
            borderColor: '#8A9BB6',
            backgroundColor: 'rgba(138, 155, 182, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: arousalData.map(a => a > 0 ? '#8A9BB6' : '#9B9895'),
            pointBorderColor: isDark ? '#2A2826' : '#F5F3F0',
            pointBorderWidth: 2,
            borderWidth: 3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#363432' : '#F5F3F0',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDark ? '#6B6865' : '#C5C2BD',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y;
                const label = ctx.dataset.label;
                let desc = '中性';
                if (val > 0.6) desc = '高';
                else if (val > 0.2) desc = '偏高';
                else if (val < -0.6) desc = '低';
                else if (val < -0.2) desc = '偏低';
                return `${label}: ${val.toFixed(1)} (${desc})`;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            min: -1,
            max: 1,
            grid: { color: gridColor },
            ticks: {
              color: '#A68A85',
              stepSize: 0.5,
              callback: (v) => {
                if (v === -1) return '消极';
                if (v === 0) return '中性';
                if (v === 1) return '积极';
                return '';
              }
            },
            title: {
              display: true,
              text: '效价',
              color: '#A68A85'
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            min: -1,
            max: 1,
            grid: { display: false },
            ticks: {
              color: '#8A9BB6',
              stepSize: 0.5,
              callback: (v) => {
                if (v === -1) return '平静';
                if (v === 0) return '中性';
                if (v === 1) return '兴奋';
                return '';
              }
            },
            title: {
              display: true,
              text: '唤醒度',
              color: '#8A9BB6'
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor, maxRotation: 45 }
          }
        }
      }
    });
  },

  initScatterChart() {
    const canvas = document.getElementById('scatter-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const scatterData = moodManager.getValenceArousalScatter(90);
    const valences = scatterData.map(d => d.valence);
    const arousals = scatterData.map(d => d.arousal);

    const isDark = artEngine.currentTheme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    const textColor = isDark ? '#C5C2BD' : '#6B6865';

    this.scatterChart = new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [{
          label: '情绪记录',
          data: scatterData.map(d => ({ x: d.valence, y: d.arousal })),
          backgroundColor: scatterData.map(d => artEngine.getEmotionColorRaw(d.valence)),
          borderColor: isDark ? '#2A2826' : '#F5F3F0',
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#363432' : '#F5F3F0',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDark ? '#6B6865' : '#C5C2BD',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const x = ctx.parsed.x;
                const y = ctx.parsed.y;
                let quadrant = '';
                if (x > 0 && y > 0) quadrant = '兴奋积极';
                else if (x > 0 && y <= 0) quadrant = '平静积极';
                else if (x <= 0 && y > 0) quadrant = '焦虑消极';
                else quadrant = '低落消极';
                return [`效价: ${x.toFixed(2)}`, `唤醒度: ${y.toFixed(2)}`, `象限: ${quadrant}`];
              }
            }
          }
        },
        scales: {
          x: {
            min: -1.1,
            max: 1.1,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              stepSize: 0.5,
              callback: (v) => {
                if (v === -1) return '消极';
                if (v === 0) return '中性';
                if (v === 1) return '积极';
                return '';
              }
            },
            title: {
              display: true,
              text: '效价',
              color: textColor
            }
          },
          y: {
            min: -1.1,
            max: 1.1,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              stepSize: 0.5,
              callback: (v) => {
                if (v === -1) return '平静';
                if (v === 0) return '中性';
                if (v === 1) return '兴奋';
                return '';
              }
            },
            title: {
              display: true,
              text: '唤醒度',
              color: textColor
            }
          }
        }
      }
    });
  },

  initLabelChart() {
    const canvas = document.getElementById('label-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const distribution = moodManager.getLabelDistribution();
    const top5 = distribution.slice(0, 5);
    const others = distribution.slice(5);
    const othersCount = others.reduce((sum, d) => sum + d.count, 0);

    if (othersCount > 0) {
      top5.push({ label: '其他', count: othersCount });
    }

    const colors = [
      '#8AA68A', '#A68A85', '#9B9895', '#8A9BB6', '#C4A86A',
      '#B88686', '#86B8A8', '#A886B8', '#86A8B8', '#B8B086'
    ];

    const isDark = artEngine.currentTheme === 'dark';

    this.labelChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: top5.map(d => d.label),
        datasets: [{
          data: top5.map(d => d.count),
          backgroundColor: colors.slice(0, top5.length),
          borderColor: isDark ? '#2A2826' : '#F5F3F0',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: isDark ? '#363432' : '#F5F3F0',
            titleColor: isDark ? '#C5C2BD' : '#6B6865',
            bodyColor: isDark ? '#C5C2BD' : '#6B6865',
            borderColor: isDark ? '#6B6865' : '#C5C2BD',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        }
      }
    });
  },

  initFactorChart() {
    const canvas = document.getElementById('factor-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const distribution = moodManager.getFactorDistribution();
    const top8 = distribution.slice(0, 8);
    const allFactors = [...ASSOCIATED_FACTORS.lifeScenes, ...ASSOCIATED_FACTORS.personalImpact];

    const isDark = artEngine.currentTheme === 'dark';
    const textColor = isDark ? '#C5C2BD' : '#6B6865';

    this.factorChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: top8.map(d => {
          const factor = allFactors.find(f => f.id === d.factor);
          return factor ? factor.label : d.factor;
        }),
        datasets: [{
          label: '记录次数',
          data: top8.map(d => d.count),
          backgroundColor: top8.map((_, i) => artEngine.getEmotionColorRaw((i - top8.length / 2) / (top8.length / 2))),
          borderColor: isDark ? '#2A2826' : '#F5F3F0',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#363432' : '#F5F3F0',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDark ? '#6B6865' : '#C5C2BD',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
            ticks: { color: textColor }
          },
          y: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });
  },

  initHourlyChart() {
    const canvas = document.getElementById('hourly-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const hourlyData = moodManager.getHourlyPattern();
    const labels = hourlyData.map(h => `${h.hour}:00`);
    const valenceData = hourlyData.map(h => h.avgValence);
    const arousalData = hourlyData.map(h => h.avgArousal);

    const isDark = artEngine.currentTheme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    const textColor = isDark ? '#C5C2BD' : '#6B6865';

    this.hourlyChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '效价',
            data: valenceData,
            borderColor: '#A68A85',
            backgroundColor: 'rgba(166, 138, 133, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2
          },
          {
            label: '唤醒度',
            data: arousalData,
            borderColor: '#8A9BB6',
            backgroundColor: 'rgba(138, 155, 182, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#363432' : '#F5F3F0',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDark ? '#6B6865' : '#C5C2BD',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y;
                const label = ctx.dataset.label;
                let desc = '中性';
                if (val > 0.6) desc = '高';
                else if (val > 0.2) desc = '偏高';
                else if (val < -0.6) desc = '低';
                else if (val < -0.2) desc = '偏低';
                return `${label}: ${val.toFixed(2)} (${desc})`;
              }
            }
          }
        },
        scales: {
          y: {
            min: -1,
            max: 1,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              stepSize: 0.5
            }
          },
          x: {
            grid: { display: false },
            ticks: { 
              color: textColor,
              maxRotation: 45,
              autoSkip: true,
              maxTicksLimit: 12
            }
          }
        }
      }
    });
  }
};