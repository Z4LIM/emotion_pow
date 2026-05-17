const KnowledgeViz = {
  _activeSketch: null,

  create(containerId, moduleId) {
    this.destroy();

    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'knowledge-viz-canvas';
    canvas.width = container.clientWidth || 560;
    canvas.height = 280;
    canvas.style.width = '100%';
    canvas.style.height = '280px';
    canvas.style.borderRadius = '12px';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    this._activeSketch = { canvas, ctx, moduleId, running: true, frame: 0 };

    const vizMap = {
      'what-are-emotions': this._vizEmotionWaves,
      'valence-model': this._vizValenceField,
      'emotion-health': this._vizBodyPulse,
      'emotion-regulation': this._vizBreathingCircle,
      'emotion-intelligence': this._vizNetworkGraph,
      'stress-and-coping': this._vizStressParticles,
      'emotion-and-relationships': this._vizResonanceRings,
      'emotion-and-creativity': this._vizCreativeFlow
    };

    const vizFn = vizMap[moduleId];
    if (vizFn) {
      const state = vizFn.init(canvas, ctx);
      this._activeSketch.state = state;
      this._animate(vizFn.draw, state);
    }
  },

  _animate(drawFn, state) {
    if (!this._activeSketch || !this._activeSketch.running) return;
    const { canvas, ctx } = this._activeSketch;
    drawFn(canvas, ctx, state, this._activeSketch.frame);
    this._activeSketch.frame++;
    requestAnimationFrame(() => this._animate(drawFn, state));
  },

  destroy() {
    if (this._activeSketch) {
      this._activeSketch.running = false;
      const canvas = this._activeSketch.canvas;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      this._activeSketch = null;
    }
  },

  _getColors() {
    const cs = getComputedStyle(document.documentElement);
    return {
      bg: cs.getPropertyValue('--color-bg-secondary').trim() || '#F5F3F0',
      primary: cs.getPropertyValue('--color-emotion-positive-deep').trim() || '#6A8B6A',
      secondary: cs.getPropertyValue('--color-emotion-negative').trim() || '#A68A85',
      accent: cs.getPropertyValue('--color-border-accent').trim() || '#8A8683',
      warm: cs.getPropertyValue('--color-emotion-neutral').trim() || '#9B9895',
      text: cs.getPropertyValue('--color-text-secondary').trim() || '#6B6865',
      muted: cs.getPropertyValue('--color-text-tertiary').trim() || '#9B9895',
      positive: cs.getPropertyValue('--color-emotion-positive-deep').trim() || '#6A8B6A',
      negative: cs.getPropertyValue('--color-emotion-negative-deep').trim() || '#8B6F6A',
      neutral: cs.getPropertyValue('--color-emotion-neutral').trim() || '#9B9895'
    };
  },

  _vizEmotionWaves: {
    init(canvas, ctx) {
      return {
        waves: Array(5).fill(null).map((_, i) => ({
          amplitude: 15 + i * 8,
          frequency: 0.008 + i * 0.003,
          speed: 0.015 + i * 0.005,
          phase: Math.random() * Math.PI * 2,
          yOffset: 0.3 + i * 0.1
        })),
        particles: Array(30).fill(null).map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 1 + Math.random() * 3,
          speed: 0.2 + Math.random() * 0.5,
          opacity: 0.2 + Math.random() * 0.5
        }))
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      state.particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(138,166,138,${p.opacity})`;
        ctx.fill();
      });

      const colors = [c.negative, c.neutral, c.positive, c.warm, c.accent];
      state.waves.forEach((w, i) => {
        w.phase += w.speed;
        ctx.beginPath();
        const baseY = canvas.height * w.yOffset;
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = baseY + Math.sin(x * w.frequency + w.phase) * w.amplitude
                    + Math.sin(x * w.frequency * 0.5 + w.phase * 0.7) * w.amplitude * 0.3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      ctx.font = '12px "Nunito", sans-serif';
      ctx.fillStyle = c.muted;
      ctx.fillText('主观体验', 20, canvas.height * 0.25);
      ctx.fillText('生理反应', 20, canvas.height * 0.45);
      ctx.fillText('行为表达', 20, canvas.height * 0.65);
    }
  },

  _vizValenceField: {
    init(canvas, ctx) {
      return {
        points: Array(80).fill(null).map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          valence: (Math.random() - 0.5) * 2,
          arousal: (Math.random() - 0.5) * 2,
          size: 3 + Math.random() * 6,
          phase: Math.random() * Math.PI * 2
        }))
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.strokeStyle = c.muted;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(cx, 10);
      ctx.lineTo(cx, canvas.height - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, cy);
      ctx.lineTo(canvas.width - 10, cy);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.font = '11px "Nunito", sans-serif';
      ctx.fillStyle = c.positive;
      ctx.fillText('积极', canvas.width - 40, cy - 8);
      ctx.fillStyle = c.negative;
      ctx.fillText('消极', 10, cy - 8);
      ctx.fillStyle = c.accent;
      ctx.fillText('兴奋', cx + 8, 20);
      ctx.fillStyle = c.warm;
      ctx.fillText('平静', cx + 8, canvas.height - 10);

      state.points.forEach(p => {
        p.phase += 0.02;
        const px = cx + p.valence * (cx - 20) + Math.sin(p.phase) * 3;
        const py = cy - p.arousal * (cy - 20) + Math.cos(p.phase) * 3;

        const r = p.valence > 0 ? 106 + p.valence * 60 : 150 + p.valence * 50;
        const g = p.valence > 0 ? 139 + p.valence * 27 : 106 + p.valence * 40;
        const b = p.valence > 0 ? 106 + p.valence * 27 : 106 + p.valence * 40;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},0.7)`;
        ctx.fill();
      });
    }
  },

  _vizBodyPulse: {
    init(canvas, ctx) {
      return {
        rings: Array(6).fill(null).map((_, i) => ({
          radius: 20 + i * 18,
          maxRadius: 20 + i * 18,
          speed: 0.3 + i * 0.1,
          opacity: 0.6 - i * 0.08
        })),
        heartbeat: 0,
        particles: Array(20).fill(null).map(() => ({
          angle: Math.random() * Math.PI * 2,
          dist: 30 + Math.random() * 80,
          size: 1 + Math.random() * 2,
          speed: 0.01 + Math.random() * 0.02
        }))
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      state.heartbeat += 0.03;
      const pulse = Math.sin(state.heartbeat) * 0.15 + 1;

      state.rings.forEach((ring, i) => {
        const r = ring.maxRadius * pulse + Math.sin(frame * 0.02 + i) * 3;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, r), 0, Math.PI * 2);
        const color = i % 2 === 0 ? c.negative : c.positive;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = ring.opacity;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = c.negative;
      ctx.fill();

      state.particles.forEach(p => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * p.dist;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,134,134,0.5)`;
        ctx.fill();
      });

      ctx.font = '11px "Nunito", sans-serif';
      ctx.fillStyle = c.muted;
      ctx.textAlign = 'center';
      ctx.fillText('心', cx, cy + 4);
      ctx.fillText('情绪 → 身体 → 健康', cx, canvas.height - 15);
      ctx.textAlign = 'left';
    }
  },

  _vizBreathingCircle: {
    init(canvas, ctx) {
      return {
        breathPhase: 0,
        innerRadius: 30,
        outerRings: Array(4).fill(null).map((_, i) => ({
          baseRadius: 50 + i * 25,
          wobble: Array(12).fill(null).map(() => Math.random() * 4)
        })),
        flowParticles: Array(15).fill(null).map(() => ({
          angle: Math.random() * Math.PI * 2,
          dist: 40 + Math.random() * 90,
          speed: 0.005 + Math.random() * 0.01,
          size: 1 + Math.random() * 2
        }))
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      state.breathPhase += 0.012;
      const breathCycle = Math.sin(state.breathPhase);
      const breathScale = 0.7 + breathCycle * 0.3;

      state.outerRings.forEach((ring, ri) => {
        ctx.beginPath();
        const segments = ring.wobble.length;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const wobbleOffset = ring.wobble[i % segments] * Math.sin(frame * 0.02 + ri);
          const r = (ring.baseRadius * breathScale) + wobbleOffset;
          const px = cx + Math.cos(angle) * Math.max(1, r);
          const py = cy + Math.sin(angle) * Math.max(1, r);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = ri % 2 === 0 ? c.positive : c.accent;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5 - ri * 0.08;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      const innerR = Math.max(1, state.innerRadius * breathScale);
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
      grad.addColorStop(0, c.positive);
      grad.addColorStop(1, 'rgba(138,166,138,0.2)');
      ctx.fillStyle = grad;
      ctx.fill();

      state.flowParticles.forEach(p => {
        p.angle += p.speed;
        const d = p.dist * breathScale;
        const px = cx + Math.cos(p.angle) * d;
        const py = cy + Math.sin(p.angle) * d;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(138,166,138,0.4)`;
        ctx.fill();
      });

      ctx.font = '12px "Nunito", sans-serif';
      ctx.fillStyle = c.text;
      ctx.textAlign = 'center';
      const label = breathCycle > 0.3 ? '吸气' : breathCycle < -0.3 ? '呼气' : '屏息';
      ctx.fillText(label, cx, cy + 4);
      ctx.fillStyle = c.muted;
      ctx.fillText('跟随节奏，调节呼吸', cx, canvas.height - 15);
      ctx.textAlign = 'left';
    }
  },

  _vizNetworkGraph: {
    init(canvas, ctx) {
      const nodes = [
        { label: '自我觉察', x: 0.3, y: 0.3 },
        { label: '自我管理', x: 0.7, y: 0.3 },
        { label: '社会觉察', x: 0.3, y: 0.7 },
        { label: '关系管理', x: 0.7, y: 0.7 },
        { label: 'EQ核心', x: 0.5, y: 0.5 }
      ];
      const edges = [
        [0, 4], [1, 4], [2, 4], [3, 4],
        [0, 1], [1, 3], [2, 3], [0, 2]
      ];
      return {
        nodes: nodes.map(n => ({
          ...n,
          px: n.x * canvas.width,
          py: n.y * canvas.height,
          phase: Math.random() * Math.PI * 2
        })),
        edges,
        signals: [],
        signalTimer: 0
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      state.nodes.forEach(n => {
        n.phase += 0.015;
        n.px = n.x * canvas.width + Math.sin(n.phase) * 5;
        n.py = n.y * canvas.height + Math.cos(n.phase * 0.7) * 5;
      });

      state.edges.forEach(([a, b]) => {
        const na = state.nodes[a];
        const nb = state.nodes[b];
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.strokeStyle = c.muted;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      state.signalTimer++;
      if (state.signalTimer > 60) {
        state.signalTimer = 0;
        const edgeIdx = Math.floor(Math.random() * state.edges.length);
        state.signals.push({ edge: edgeIdx, t: 0 });
      }

      state.signals = state.signals.filter(s => {
        s.t += 0.02;
        if (s.t > 1) return false;
        const [a, b] = state.edges[s.edge];
        const na = state.nodes[a];
        const nb = state.nodes[b];
        const sx = na.px + (nb.px - na.px) * s.t;
        const sy = na.py + (nb.py - na.py) * s.t;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = c.positive;
        ctx.globalAlpha = 1 - s.t;
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      const nodeColors = [c.positive, c.accent, c.warm, c.secondary, c.positive];
      state.nodes.forEach((n, i) => {
        const r = i === 4 ? 22 : 16;
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColors[i];
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = i === 4 ? 'bold 11px "Nunito"' : '10px "Nunito"';
        ctx.fillStyle = c.text;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.px, n.py + r + 14);
      });
      ctx.textAlign = 'left';
    }
  },

  _vizStressParticles: {
    init(canvas, ctx) {
      return {
        particles: Array(60).fill(null).map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 2 + Math.random() * 4,
          stress: Math.random()
        })),
        calmZone: { x: canvas.width / 2, y: canvas.height / 2, radius: 60 }
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      const cz = state.calmZone;
      ctx.beginPath();
      ctx.arc(cz.x, cz.y, cz.radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cz.x, cz.y, 0, cz.x, cz.y, cz.radius);
      grad.addColorStop(0, 'rgba(138,166,138,0.15)');
      grad.addColorStop(1, 'rgba(138,166,138,0)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.font = '10px "Nunito"';
      ctx.fillStyle = c.positive;
      ctx.textAlign = 'center';
      ctx.fillText('应对区', cz.x, cz.y + 4);
      ctx.textAlign = 'left';

      state.particles.forEach(p => {
        const dx = cz.x - p.x;
        const dy = cz.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < cz.radius) {
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.stress = Math.max(0, p.stress - 0.005);
        } else {
          p.vx += (Math.random() - 0.5) * 0.3;
          p.vy += (Math.random() - 0.5) * 0.3;
          p.stress = Math.min(1, p.stress + 0.002);
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const r = Math.round(150 + p.stress * 50);
        const g = Math.round(106 - p.stress * 40);
        const b = Math.round(106 - p.stress * 40);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + p.stress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
        ctx.fill();
      });
    }
  },

  _vizResonanceRings: {
    init(canvas, ctx) {
      return {
        left: { x: canvas.width * 0.35, y: canvas.height / 2, rings: [], pulsePhase: 0 },
        right: { x: canvas.width * 0.65, y: canvas.height / 2, rings: [], pulsePhase: Math.PI },
        connectionWaves: []
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      state.left.pulsePhase += 0.03;
      state.right.pulsePhase += 0.03;

      [state.left, state.right].forEach((entity, ei) => {
        const pulse = Math.sin(entity.pulsePhase);
        const baseR = 18 + pulse * 3;

        ctx.beginPath();
        ctx.arc(entity.x, entity.y, Math.max(1, baseR), 0, Math.PI * 2);
        ctx.fillStyle = ei === 0 ? c.positive : c.accent;
        ctx.fill();

        for (let i = 1; i <= 3; i++) {
          const ringR = Math.max(1, baseR + i * 18 + pulse * 5 * i);
          ctx.beginPath();
          ctx.arc(entity.x, entity.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = ei === 0 ? c.positive : c.accent;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.4 - i * 0.1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      const lx = state.left.x;
      const rx = state.right.x;
      const cy = canvas.height / 2;

      for (let i = 0; i < 5; i++) {
        const waveY = cy + Math.sin(frame * 0.03 + i * 0.8) * (15 + i * 5);
        ctx.beginPath();
        ctx.moveTo(lx + 30, waveY);
        const cpx = (lx + rx) / 2;
        const cpy = waveY + Math.sin(frame * 0.02 + i) * 20;
        ctx.quadraticCurveTo(cpx, cpy, rx - 30, waveY);
        ctx.strokeStyle = c.warm;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3 - i * 0.04;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.font = '10px "Nunito"';
      ctx.fillStyle = c.text;
      ctx.textAlign = 'center';
      ctx.fillText('你', state.left.x, state.left.y + 50);
      ctx.fillText('他人', state.right.x, state.right.y + 50);
      ctx.fillStyle = c.muted;
      ctx.fillText('情绪共振', (lx + rx) / 2, canvas.height - 15);
      ctx.textAlign = 'left';
    }
  },

  _vizCreativeFlow: {
    init(canvas, ctx) {
      return {
        curves: Array(6).fill(null).map((_, i) => ({
          points: Array(20).fill(null).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1
          })),
          hue: i * 60,
          width: 1 + Math.random() * 2
        })),
        sparkles: Array(12).fill(null).map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          life: Math.random(),
          speed: 0.005 + Math.random() * 0.01
        }))
      };
    },
    draw(canvas, ctx, state, frame) {
      const c = KnowledgeViz._getColors();
      ctx.fillStyle = c.bg;
      ctx.globalAlpha = 0.08;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      const colors = [c.positive, c.negative, c.accent, c.warm, c.secondary, c.neutral];

      state.curves.forEach((curve, ci) => {
        curve.points.forEach(p => {
          p.x += p.vx + Math.sin(frame * 0.01 + p.y * 0.01) * 0.5;
          p.y += p.vy + Math.cos(frame * 0.01 + p.x * 0.01) * 0.5;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        ctx.beginPath();
        curve.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else {
            const prev = curve.points[i - 1];
            const cpx = (prev.x + p.x) / 2;
            const cpy = (prev.y + p.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
          }
        });
        ctx.strokeStyle = colors[ci];
        ctx.lineWidth = curve.width;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      state.sparkles.forEach(s => {
        s.life += s.speed;
        if (s.life > 1) {
          s.life = 0;
          s.x = Math.random() * canvas.width;
          s.y = Math.random() * canvas.height;
        }
        const alpha = Math.sin(s.life * Math.PI);
        const size = 2 + alpha * 3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,168,106,${alpha * 0.6})`;
        ctx.fill();
      });
    }
  }
};
