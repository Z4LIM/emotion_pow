from PIL import Image, ImageDraw, ImageFont
import math, random

W, H = 2400, 1800
BG = (253, 248, 232)
INK = (45, 42, 38)
WHITE = (255, 255, 255)

VENTRAL_GREEN = (138, 166, 138)
SYMP_ROSE = (184, 134, 134)
DORSAL_BLUE = (138, 155, 182)
INTEGRATE_GOLD = (196, 168, 106)
GRAY = (155, 152, 149)
LIGHT_ROSE = (240, 220, 215)
LIGHT_GREEN = (220, 235, 220)
LIGHT_BLUE = (220, 228, 240)

FONT_DIR = r"c:\Users\15812\.trae-cn\skills\canvas-design\canvas-fonts"

def load_font(name, size):
    try:
        return ImageFont.truetype(f"{FONT_DIR}/{name}", size)
    except:
        return ImageFont.load_default()

def draw_halftone(draw, x, y, w, h, dot_size=1, spacing=4, opacity=12):
    rng = random.Random(42)
    for dx in range(0, w, spacing):
        for dy in range(0, h, spacing):
            if rng.random() < 0.85:
                draw.ellipse([x+dx, y+dy, x+dx+dot_size, y+dy+dot_size], fill=(0,0,0,opacity))

def draw_hard_shadow(draw, box, offsets=[(6,6), (11,11)], color=INK):
    x1, y1, x2, y2 = box
    for ox, oy in offsets:
        draw.rectangle([x1+ox, y1+oy, x2+ox, y2+oy], fill=color)

def draw_speech_bubble(draw, x, y, w, h, tail_x=None):
    if tail_x is None:
        tail_x = x + w // 3
    draw_hard_shadow(draw, (x, y, x+w, y+h))
    draw.rectangle([x, y, x+w, y+h], fill=BG, outline=INK, width=4)
    pts = [(tail_x-12, y+h), (tail_x, y+h+22), (tail_x+12, y+h)]
    draw.polygon(pts, fill=BG, outline=INK, width=4)
    draw.line([(tail_x-12, y+h-2), (tail_x-12, y+h+2)], fill=BG, width=8)
    draw.line([(tail_x+12, y+h-2), (tail_x+12, y+h+2)], fill=BG, width=8)

def draw_thought_bubble(draw, x, y, w, h):
    draw_hard_shadow(draw, (x, y, x+w, y+h))
    draw.rounded_rectangle([x, y, x+w, y+h], radius=25, fill=BG, outline=INK, width=4)
    dots = [(x+w//3, y+h+8, 10), (x+w//3+18, y+h+16, 6), (x+w//3+28, y+h+23, 3)]
    for cx, cy, cr in dots:
        draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=BG, outline=INK, width=3)

def draw_shout_bubble(draw, x, y, w, h):
    cx, cy = x+w//2, y+h//2
    points = []
    for i in range(24):
        angle = (i * math.pi) / 12
        r = (w//2 if i % 2 == 0 else w//2 - 18)
        rh = (h//2 if i % 2 == 0 else h//2 - 12)
        px = cx + int(r * math.cos(angle))
        py = cy + int(rh * math.sin(angle))
        points.append((px, py))
    draw_hard_shadow(draw, (min(p[0] for p in points), min(p[1] for p in points), max(p[0] for p in points), max(p[1] for p in points)))
    draw.polygon(points, fill=BG, outline=INK, width=3)

def draw_concentration_lines(draw, cx, cy, r_inner, r_outer, n_lines=16, opacity=30):
    for i in range(n_lines):
        angle = (i * 2 * math.pi) / n_lines + random.uniform(-0.1, 0.1)
        x1 = cx + int(r_inner * math.cos(angle))
        y1 = cy + int(r_inner * math.sin(angle))
        x2 = cx + int(r_outer * math.cos(angle))
        y2 = cy + int(r_outer * math.sin(angle))
        draw.line([(x1, y1), (x2, y2)], fill=INK+(opacity,))

def draw_speed_lines(draw, x, y, w, h, n=12, direction='right'):
    for i in range(n):
        offset = (i - n//2) * (h // n)
        length = random.randint(20, w)
        if direction == 'right':
            draw.line([(x, y+offset), (x+length, y+offset)], fill=INK, width=2)
        else:
            draw.line([(x+w, y+offset), (x+w-length, y+offset)], fill=INK, width=2)

def draw_torn_edge(draw, x1, y, x2, amplitude=5, segments=25):
    points = [(x1, y)]
    seg_w = (x2 - x1) / segments
    for i in range(1, segments):
        px = x1 + i * seg_w
        py = y + random.randint(-amplitude, amplitude)
        points.append((px, py))
    points.append((x2, y))
    draw.line(points, fill=INK, width=3)

def draw_ink_splatter(draw, x, y, size=6):
    for i in range(4):
        dx = random.randint(-size, size)
        dy = random.randint(-size, size)
        r = random.randint(2, max(3, size//2))
        draw.ellipse([x+dx-r, y+dy-r, x+dx+r, y+dy+r], fill=INK)

def draw_arrow(draw, x1, y1, x2, y2, color=INK, width=2):
    draw.line([(x1, y1), (x2, y2)], fill=color, width=width)
    dx, dy = x2-x1, y2-y1
    angle = math.atan2(dy, dx)
    arrow_len = 12
    ax1 = x2 - int(arrow_len * math.cos(angle - 0.4))
    ay1 = y2 - int(arrow_len * math.sin(angle - 0.4))
    ax2 = x2 - int(arrow_len * math.cos(angle + 0.4))
    ay2 = y2 - int(arrow_len * math.sin(angle + 0.4))
    draw.polygon([(x2, y2), (ax1, ay1), (ax2, ay2)], fill=color)

def draw_brain_outline(draw, x, y, size=80):
    cx, cy = x, y
    pts = []
    for i in range(40):
        angle = (i * 2 * math.pi) / 40
        r = size + random.randint(-3, 3)
        if i > 30:
            r = size * 0.7
        px = cx + int(r * math.cos(angle))
        py = cy + int(r * 0.8 * math.sin(angle))
        pts.append((px, py))
    draw.polygon(pts, outline=INK, width=2)
    draw.line([(cx, cy-size*0.3), (cx, cy+size*0.5)], fill=INK, width=1)
    draw.line([(cx-size*0.5, cy), (cx+size*0.5, cy)], fill=INK, width=1)

def draw_neuron(draw, x, y, size=30):
    draw.ellipse([x-size, y-size, x+size, y+size], outline=INK, width=2)
    for i in range(6):
        angle = (i * 2 * math.pi) / 6
        ax = x + int(size * 0.8 * math.cos(angle))
        ay = y + int(size * 0.8 * math.sin(angle))
        draw.line([(x, y), (ax, ay)], fill=INK, width=1)
        draw.ellipse([ax-4, ay-4, ax+4, ay+4], fill=INK)

def draw_heart_pulse(draw, x, y, w, h):
    cx, cy = x + w//2, y + h//2
    points = []
    for i in range(60):
        t = i / 60.0
        px = x + int(t * w)
        base_y = cy
        if 0.2 < t < 0.3:
            py = base_y - int(30 * math.sin((t-0.2)/0.1 * math.pi))
        elif 0.4 < t < 0.5:
            py = base_y - int(20 * math.sin((t-0.4)/0.1 * math.pi))
        else:
            py = base_y + random.randint(-2, 2)
        points.append((px, py))
    draw.line(points, fill=SYMP_ROSE, width=3)
    draw.line([(x, cy), (x+w, cy)], fill=GRAY, width=1)

def draw_breath_circle(draw, cx, cy, r, phase=0):
    current_r = r + int(15 * math.sin(phase))
    draw.ellipse([cx-current_r, cy-current_r, cx+current_r, cy+current_r], outline=VENTRAL_GREEN, width=3)
    draw.ellipse([cx-current_r-10, cy-current_r-10, cx+current_r+10, cy+current_r+10], outline=VENTRAL_GREEN, width=1)

img = Image.new('RGBA', (W, H), BG + (255,))
draw = ImageDraw.Draw(img)

draw_halftone(draw, 0, 0, W, H, dot_size=1, spacing=4, opacity=8)

font_title = load_font("BigShoulders-Bold.ttf", 90)
font_title_sm = load_font("BigShoulders-Bold.ttf", 52)
font_subtitle = load_font("Outfit-Bold.ttf", 30)
font_body = load_font("Outfit-Regular.ttf", 22)
font_body_sm = load_font("Outfit-Regular.ttf", 18)
font_small = load_font("IBMPlexMono-Regular.ttf", 16)
font_onomatopoeia = load_font("SmoochSans-Medium.ttf", 64)
font_onomatopoeia_sm = load_font("SmoochSans-Medium.ttf", 40)
font_onomatopoeia_xl = load_font("SmoochSans-Medium.ttf", 80)
font_label = load_font("Jura-Medium.ttf", 18)
font_handwrite = load_font("NothingYouCouldDo-Regular.ttf", 26)
font_handwrite_sm = load_font("NothingYouCouldDo-Regular.ttf", 20)
font_handwrite_lg = load_font("NothingYouCouldDo-Regular.ttf", 32)

draw.text((100, 50), "半调网点 = 神经元放电", font=font_handwrite_sm, fill=GRAY)
draw.text((100, 80), "每一条墨线，都是情绪的脉搏", font=font_handwrite_lg, fill=INK)

draw_brain_outline(draw, 200, 200, size=60)
draw.text((160, 270), "大脑", font=font_small, fill=GRAY)
draw.text((160, 290), "默认模式网络", font=font_small, fill=GRAY)

for i in range(5):
    draw_neuron(draw, 350 + i*40, 180 + (i%2)*30, size=15)
draw.text((340, 240), "神经元集群", font=font_small, fill=GRAY)

draw_speech_bubble(draw, 500, 120, 320, 100, tail_x=520)
draw.text((515, 140), "外部自我", font=font_subtitle, fill=INK)
draw.text((515, 175), "我们呈现给他人的声音", font=font_body_sm, fill=GRAY)

draw_thought_bubble(draw, 880, 110, 380, 130)
draw.text((900, 135), "内部自我", font=font_subtitle, fill=DORSAL_BLUE)
draw.text((900, 175), "递归的、云状的反刍思维", font=font_body_sm, fill=GRAY)

draw_shout_bubble(draw, 1340, 120, 200, 130)
draw.text((1380, 155), "叮！", font=font_onomatopoeia_sm, fill=SYMP_ROSE)
draw.text((1390, 210), "杏仁核劫持", font=font_small, fill=INK)

draw_concentration_lines(draw, 1440, 185, 70, 140, n_lines=14, opacity=20)

draw.text((1600, 140), "嗯...", font=font_onomatopoeia_sm, fill=DORSAL_BLUE)
draw.text((1600, 190), "内感受暂停", font=font_small, fill=GRAY)
draw.text((1600, 210), "检查身体的感觉", font=font_small, fill=GRAY)

draw_heart_pulse(draw, 100, 320, 400, 60)
draw.text((100, 390), "自主神经系统", font=font_small, fill=SYMP_ROSE)
draw.text((250, 390), "交感神经激活", font=font_small, fill=GRAY)

draw_breath_circle(draw, 650, 350, 40, phase=0.5)
draw.text((610, 400), "腹侧迷走神经", font=font_small, fill=VENTRAL_GREEN)
draw.text((610, 420), "社会参与 · 安全", font=font_small, fill=GRAY)

draw_breath_circle(draw, 850, 350, 35, phase=2.0)
draw.text((810, 400), "背侧迷走神经", font=font_small, fill=DORSAL_BLUE)
draw.text((810, 420), "关闭 · 退缩", font=font_small, fill=GRAY)

draw.text((1050, 330), "整合窗口", font=font_subtitle, fill=INTEGRATE_GOLD)
draw.text((1050, 370), "神经系统找到耐受窗口时", font=font_body_sm, fill=GRAY)
draw.text((1050, 395), "颜色融合成新的东西", font=font_body_sm, fill=GRAY)

draw.line([(100, 450), (W-100, 450)], fill=INK, width=2)
draw.text((W//2 - 150, 430), "— 情绪卡片 = 自我状态 —", font=font_label, fill=INK)

card1_box = (100, 480, 700, 950)
draw_hard_shadow(draw, card1_box, offsets=[(6,6), (11,11)])
draw.rectangle(card1_box, fill=LIGHT_ROSE, outline=INK, width=4)
draw_torn_edge(draw, card1_box[0], card1_box[1], card1_box[2], amplitude=4)
draw_ink_splatter(draw, card1_box[2]-20, card1_box[3]-20, size=10)

draw.text((130, 500), "🎭", font=font_onomatopoeia_sm, fill=INK)
draw.text((190, 510), "焦虑", font=font_subtitle, fill=INK)
draw.line([(130, 555), (670, 555)], fill=INK, width=2)
draw.line([(130, 558), (670, 558)], fill=INK, width=1)

draw.text((130, 575), "交感神经激活", font=font_handwrite, fill=SYMP_ROSE)
draw.text((130, 610), "身体在准备行动", font=font_handwrite_sm, fill=SYMP_ROSE)

draw.line([(130, 650), (320, 650)], fill=SYMP_ROSE, width=3)
draw.text((330, 635), "生理反应", font=font_small, fill=SYMP_ROSE)
draw.text((130, 665), "心跳加快 · 肌肉紧张 · 警觉提升", font=font_body_sm, fill=(107, 104, 101))

draw.line([(130, 710), (320, 710)], fill=SYMP_ROSE, width=3)
draw.text((330, 695), "行为表达", font=font_small, fill=SYMP_ROSE)
draw.text((130, 725), "后退 · 寻找安全 · 告诉他人", font=font_body_sm, fill=(107, 104, 101))

draw.line([(130, 770), (320, 770)], fill=VENTRAL_GREEN, width=3)
draw.text((330, 755), "调节策略", font=font_small, fill=VENTRAL_GREEN)
draw.text((130, 785), "5-4-3-2-1 接地 · 深呼吸", font=font_body_sm, fill=(107, 104, 101))

draw.text((130, 830), "→", font=font_onomatopoeia, fill=VENTRAL_GREEN)
draw.text((160, 825), "查看完整知识库", font=font_label, fill=VENTRAL_GREEN)

draw.text((130, 870), "倾斜 = 回避动机", font=font_small, fill=GRAY)
draw.text((130, 890), "卡片向左倾斜 = 远离威胁", font=font_small, fill=GRAY)

card2_box = (780, 500, 1380, 970)
draw_hard_shadow(draw, card2_box, offsets=[(6,6), (11,11)])
draw.rectangle(card2_box, fill=LIGHT_GREEN, outline=INK, width=4)
draw_torn_edge(draw, card2_box[0], card2_box[1], card2_box[2], amplitude=5)
draw_ink_splatter(draw, card2_box[0]+15, card2_box[1]+15, size=8)

draw.text((810, 520), "📊", font=font_onomatopoeia_sm, fill=INK)
draw.text((870, 530), "平静满足", font=font_subtitle, fill=INK)
draw.line([(810, 575), (1350, 575)], fill=INK, width=2)
draw.line([(810, 578), (1350, 578)], fill=INK, width=1)

draw.text((810, 595), "腹侧迷走神经状态", font=font_handwrite, fill=VENTRAL_GREEN)
draw.text((810, 630), "社会参与 · 安全 · 连接", font=font_handwrite_sm, fill=VENTRAL_GREEN)

draw_speech_bubble(draw, 810, 660, 500, 90, tail_x=900)
draw.text((825, 678), "💡 你知道吗？命名情绪可使杏仁核活跃度降低50%", font=font_body_sm, fill=INK)

draw.line([(810, 780), (1100, 780)], fill=DORSAL_BLUE, width=3)
draw.text((1110, 765), "情绪维度", font=font_small, fill=DORSAL_BLUE)
draw.text((810, 795), "二维模型是情绪研究最广泛使用的框架", font=font_body_sm, fill=(107, 104, 101))

draw.text((810, 840), "→", font=font_onomatopoeia, fill=DORSAL_BLUE)
draw.text((840, 835), "查看完整知识库", font=font_label, fill=DORSAL_BLUE)

draw.text((810, 880), "倾斜 = 趋近动机", font=font_small, fill=GRAY)
draw.text((810, 900), "卡片向右倾斜 = 朝向奖励", font=font_small, fill=GRAY)

card3_box = (1460, 480, 1960, 950)
draw_hard_shadow(draw, card3_box, offsets=[(6,6), (11,11)])
draw.rectangle(card3_box, fill=LIGHT_BLUE, outline=INK, width=4)
draw_torn_edge(draw, card3_box[0], card3_box[1], card3_box[2], amplitude=6)
draw_ink_splatter(draw, card3_box[2]-25, card3_box[1]+20, size=12)

draw.text((1490, 500), "🧘", font=font_onomatopoeia_sm, fill=INK)
draw.text((1550, 510), "情绪调节", font=font_subtitle, fill=INK)
draw.line([(1490, 555), (1930, 555)], fill=INK, width=2)
draw.line([(1490, 558), (1930, 558)], fill=INK, width=1)

draw.text((1490, 575), "5-4-3-2-1 接地练习", font=font_handwrite, fill=INTEGRATE_GOLD)

steps = [
    ("5", "看到5样东西", "视觉皮层"),
    ("4", "触摸4样东西", "体感皮层"),
    ("3", "听到3种声音", "听觉皮层"),
    ("2", "闻到2种气味", "嗅觉皮层"),
    ("1", "尝到1种味道", "味觉皮层"),
]
for i, (num, text, cortex) in enumerate(steps):
    y_pos = 630 + i * 55
    draw.ellipse([1490, y_pos, 1520, y_pos+30], fill=INTEGRATE_GOLD, outline=INK, width=2)
    draw.text((1500, y_pos+2), num, font=font_label, fill=WHITE)
    draw.text((1535, y_pos+2), text, font=font_body_sm, fill=INK)
    draw.text((1535, y_pos+22), cortex, font=font_small, fill=GRAY)

draw.text((1490, 900), "→", font=font_onomatopoeia, fill=INTEGRATE_GOLD)
draw.text((1520, 895), "查看完整知识库", font=font_label, fill=INTEGRATE_GOLD)

draw.line([(100, 1000), (W-100, 1000)], fill=INK, width=1)

draw.text((100, 1020), "叙事层", font=font_subtitle, fill=INK)
draw.text((100, 1055), "用户进入 → 成为自己故事的主角 → 穿越分镜 → 获得工具 → 书写下一章", font=font_body_sm, fill=GRAY)

draw.text((100, 1090), "叮！", font=font_onomatopoeia_xl, fill=VENTRAL_GREEN)
draw_concentration_lines(draw, 220, 1130, 60, 130, n_lines=12, opacity=20)
draw.text((280, 1095), "= 洞察到达", font=font_body, fill=INK)
draw.text((280, 1125), "模式识别 · 连接建立", font=font_body_sm, fill=GRAY)

draw.text((700, 1090), "哗！", font=font_onomatopoeia_xl, fill=SYMP_ROSE)
draw.text((820, 1095), "= 情绪释放", font=font_body, fill=INK)
draw.text((820, 1125), "理解的宣泄", font=font_body_sm, fill=GRAY)

draw.text((1200, 1090), "嗖~", font=font_onomatopoeia_xl, fill=DORSAL_BLUE)
draw.text((1320, 1095), "= 放下", font=font_body, fill=INK)
draw.text((1320, 1125), "呼气 · 回归基线", font=font_body_sm, fill=GRAY)

draw.text((1600, 1090), "嗯...", font=font_onomatopoeia_xl, fill=INTEGRATE_GOLD)
draw.text((1720, 1095), "= 内感受暂停", font=font_body, fill=INK)
draw.text((1720, 1125), "检查身体的感觉", font=font_body_sm, fill=GRAY)

draw.line([(100, 1180), (W-100, 1180)], fill=INK, width=1)

draw.text((100, 1200), "INK", font=load_font("BigShoulders-Bold.ttf", 72), fill=INK)
draw.text((190, 1200), "PULSE", font=load_font("BigShoulders-Bold.ttf", 72), fill=VENTRAL_GREEN)
draw.text((420, 1215), "墨脉", font=font_title_sm, fill=SYMP_ROSE)

draw.text((100, 1280), "不是装饰，是概念的可视化", font=font_handwrite, fill=DORSAL_BLUE)
draw.text((100, 1315), "每一个视觉元素 = 一个心理学概念", font=font_handwrite, fill=INK)

draw.line([(100, 1360), (W-100, 1360)], fill=GRAY, width=1)

concepts = [
    ("半调网点", "神经元放电 · 感知的量子", VENTRAL_GREEN),
    ("语音气泡", "外部自我 · 呈现给他人的声音", SYMP_ROSE),
    ("思考气泡", "内部自我 · 递归的反刍", DORSAL_BLUE),
    ("喊叫气泡", "杏仁核劫持 · 战斗或逃跑", SYMP_ROSE),
    ("低语气泡", "副交感神经 · 呼吸放缓", DORSAL_BLUE),
    ("卡片倾斜", "情绪效价 · 趋近/回避动机", INTEGRATE_GOLD),
    ("卡片重叠", "情绪记忆堆叠 · 时间距离", VENTRAL_GREEN),
    ("撕裂边缘", "叙事断裂 · 重组时刻", SYMP_ROSE),
    ("墨渍飞溅", "不可预测 · 顿悟 · 侵入性思维", DORSAL_BLUE),
    ("集中线", "注意力聚焦 · 瞬间捕获", INTEGRATE_GOLD),
    ("运动线", "状态转换 · 过程可视化", VENTRAL_GREEN),
    ("色彩系统", "自主神经系统 · 迷走神经色调", SYMP_ROSE),
]

for i, (label, desc, color) in enumerate(concepts):
    col = i % 4
    row = i // 4
    sx = 100 + col * 570
    sy = 1380 + 30 + row * 70
    draw_hard_shadow(draw, (sx, sy, sx+540, sy+58))
    draw.rectangle([sx, sy, sx+540, sy+58], fill=BG, outline=INK, width=2)
    draw.rectangle([sx+3, sy+3, sx+546, sy+64], outline=INK, width=1)
    draw.rectangle([sx+8, sy+8, sx+90, sy+50], fill=color)
    draw.text((sx+14, sy+16), label, font=font_label, fill=WHITE)
    draw.text((sx+105, sy+20), desc, font=font_small, fill=INK)

output_path = r"d:\solo-trae\mood-journal-demo\docs\ink-pulse-design-v3.png"
img = img.convert("RGB")
img.save(output_path, "PNG", quality=95)
print(f"Saved to {output_path}")
