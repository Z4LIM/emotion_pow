from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random

W, H = 2400, 1600
BG = (253, 248, 232)
INK = (45, 42, 38)
MORANDI_GREEN = (138, 166, 138)
MORANDI_ROSE = (184, 134, 134)
MORANDI_BLUE = (138, 155, 182)
MORANDI_WARM = (196, 168, 106)
MORANDI_GRAY = (155, 152, 149)

FONT_DIR = r"c:\Users\15812\.trae-cn\skills\canvas-design\canvas-fonts"

def load_font(name, size):
    try:
        return ImageFont.truetype(f"{FONT_DIR}/{name}", size)
    except:
        return ImageFont.load_default()

def draw_halftone(draw, x, y, w, h, dot_size=2, spacing=5, opacity=25):
    for dx in range(0, w, spacing):
        for dy in range(0, h, spacing):
            if random.random() < 0.9:
                draw.ellipse([x+dx, y+dy, x+dx+dot_size, y+dy+dot_size], fill=(0,0,0,opacity))

def draw_hard_shadow(draw, box, offset=5, color=INK):
    x1, y1, x2, y2 = box
    shadow = [x1+offset, y1+offset, x2+offset, y2+offset]
    draw.rectangle(shadow, fill=color)

def draw_speech_bubble(draw, x, y, w, h, tail_dir='down', tail_x=None):
    if tail_x is None:
        tail_x = x + w // 3
    draw_hard_shadow(draw, (x, y, x+w, y+h), offset=6)
    draw.rectangle([x, y, x+w, y+h], fill=BG, outline=INK, width=4)
    if tail_dir == 'down':
        pts = [(tail_x-15, y+h), (tail_x, y+h+25), (tail_x+15, y+h)]
        draw.polygon(pts, fill=BG, outline=INK, width=4)
        draw.line([(tail_x-15, y+h-2), (tail_x-15, y+h+2)], fill=BG, width=6)
        draw.line([(tail_x+15, y+h-2), (tail_x+15, y+h+2)], fill=BG, width=6)
    elif tail_dir == 'left':
        pts = [(x, y+h//3), (x-25, y+h//3+15), (x, y+h//3+30)]
        draw.polygon(pts, fill=BG, outline=INK, width=4)
        draw.line([(x-2, y+h//3), (x+2, y+h//3)], fill=BG, width=6)

def draw_thought_bubble(draw, x, y, w, h):
    draw_hard_shadow(draw, (x, y, x+w, y+h), offset=6)
    draw.rounded_rectangle([x, y, x+w, y+h], radius=30, fill=BG, outline=INK, width=4)
    for i, (cx, cy, cr) in enumerate([(x+w//4, y+h+8, 10), (x+w//4+20, y+h+18, 6), (x+w//4+30, y+h+26, 3)]):
        draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=BG, outline=INK, width=3)

def draw_shout_bubble(draw, x, y, w, h):
    draw_hard_shadow(draw, (x, y, x+w, y+h), offset=6)
    cx, cy = x+w//2, y+h//2
    points = []
    n_teeth = 12
    for i in range(n_teeth * 2):
        angle = (i * math.pi) / n_teeth
        r = (w//2 if i % 2 == 0 else w//2 - 20)
        px = cx + int(r * math.cos(angle))
        py = cy + int((h//2 if i % 2 == 0 else h//2 - 15) * math.sin(angle))
        points.append((px, py))
    draw.polygon(points, fill=BG, outline=INK, width=4)

def draw_concentration_lines(draw, cx, cy, r_inner, r_outer, n_lines=16):
    for i in range(n_lines):
        angle = (i * 2 * math.pi) / n_lines
        x1 = cx + int(r_inner * math.cos(angle))
        y1 = cy + int(r_inner * math.sin(angle))
        x2 = cx + int(r_outer * math.cos(angle))
        y2 = cy + int(r_outer * math.sin(angle))
        draw.line([(x1, y1), (x2, y2)], fill=INK, width=2)

def draw_ink_splatter(draw, x, y, size=8):
    for _ in range(3):
        dx = random.randint(-size, size)
        dy = random.randint(-size, size)
        r = random.randint(2, max(3, size//2))
        draw.ellipse([x+dx-r, y+dy-r, x+dx+r, y+dy+r], fill=INK)

def draw_torn_edge(draw, x1, y, x2, amplitude=8, segments=20):
    points = [(x1, y)]
    seg_w = (x2 - x1) / segments
    for i in range(1, segments):
        px = x1 + i * seg_w
        py = y + random.randint(-amplitude, amplitude)
        points.append((px, py))
    points.append((x2, y))
    draw.line(points, fill=INK, width=3)

def draw_motion_lines(draw, x, y, direction='right', n=5, length=40):
    for i in range(n):
        offset_y = (i - n//2) * 8
        if direction == 'right':
            draw.line([(x, y+offset_y), (x+length, y+offset_y)], fill=INK, width=2)
        elif direction == 'left':
            draw.line([(x, y+offset_y), (x-length, y+offset_y)], fill=INK, width=2)

img = Image.new('RGBA', (W, H), BG + (255,))
draw = ImageDraw.Draw(img)

draw_halftone(draw, 0, 0, W, H, dot_size=1, spacing=4, opacity=10)

draw_concentration_lines(draw, 400, 350, 180, 260, n_lines=20)

font_title = load_font("BigShoulders-Bold.ttf", 120)
font_subtitle = load_font("Outfit-Bold.ttf", 36)
font_body = load_font("Outfit-Regular.ttf", 28)
font_small = load_font("IBMPlexMono-Regular.ttf", 20)
font_onomatopoeia = load_font("SmoochSans-Medium.ttf", 80)
font_onomatopoeia_sm = load_font("SmoochSans-Medium.ttf", 48)
font_label = load_font("Jura-Medium.ttf", 22)
font_handwrite = load_font("NothingYouCouldDo-Regular.ttf", 32)

draw_speech_bubble(draw, 80, 200, 520, 220, tail_dir='down', tail_x=250)
draw.text((110, 230), "情绪是什么？", font=font_subtitle, fill=INK)
draw.text((110, 290), "情绪不仅仅是\"感觉\"——它们是", font=font_body, fill=(107, 104, 101))
draw.text((110, 325), "大脑对身体状态的解读...", font=font_body, fill=(107, 104, 101))

draw_thought_bubble(draw, 680, 180, 480, 200)
draw.text((710, 210), "你知道吗？", font=font_subtitle, fill=MORANDI_BLUE)
draw.text((710, 265), "命名情绪可使杏仁核", font=font_body, fill=(107, 104, 101))
draw.text((710, 300), "活跃度降低50%", font=font_body, fill=(107, 104, 101))

draw_shout_bubble(draw, 1250, 170, 320, 200)
draw.text((1300, 220), "叮！", font=font_onomatopoeia_sm, fill=MORANDI_ROSE)
draw.text((1320, 290), "新知识", font=font_label, fill=INK)

draw_concentration_lines(draw, 1410, 270, 170, 220, n_lines=12)

card1_box = (80, 530, 580, 830)
draw_hard_shadow(draw, card1_box, offset=8)
draw_hard_shadow(draw, (card1_box[0]+3, card1_box[1]+3, card1_box[2]+3, card1_box[3]+3), offset=8)
draw.rectangle(card1_box, fill=BG, outline=INK, width=4)
draw_torn_edge(draw, card1_box[0], card1_box[1], card1_box[2], amplitude=6)
draw_ink_splatter(draw, card1_box[2]-20, card1_box[3]-20, size=10)
draw.text((110, 555), "🎭", font=font_onomatopoeia_sm, fill=INK)
draw.text((170, 570), "情绪是什么", font=font_subtitle, fill=INK)
draw.text((110, 625), "主观体验 · 生理反应 · 行为表达", font=font_small, fill=MORANDI_GRAY)
draw.text((110, 660), "情绪是数百万年进化打磨出的", font=font_body, fill=(107, 104, 101))
draw.text((110, 695), "精密信号系统，不仅仅是感觉", font=font_body, fill=(107, 104, 101))
draw.text((110, 760), "基础概念", font=font_label, fill=(255,255,255))
draw.rounded_rectangle([105, 752, 210, 780], radius=10, fill=MORANDI_GREEN)

card2_box = (640, 560, 1140, 860)
draw_hard_shadow(draw, card2_box, offset=8)
draw.rectangle(card2_box, fill=BG, outline=INK, width=4)
draw_torn_edge(draw, card2_box[0], card2_box[1], card2_box[2], amplitude=5)
draw_ink_splatter(draw, card2_box[0]+15, card2_box[1]+15, size=8)
draw.text((670, 585), "📊", font=font_onomatopoeia_sm, fill=INK)
draw.text((730, 600), "效价与唤醒度", font=font_subtitle, fill=INK)
draw.text((670, 655), "高效价+高唤醒 → 兴奋", font=font_body, fill=MORANDI_GREEN)
draw.text((670, 690), "低效价+高唤醒 → 焦虑", font=font_body, fill=MORANDI_ROSE)
draw.text((670, 725), "二维模型是情绪研究的基石", font=font_body, fill=(107, 104, 101))
draw.text((670, 790), "情绪维度", font=font_label, fill=(255,255,255))
draw.rounded_rectangle([665, 782, 770, 810], radius=10, fill=MORANDI_BLUE)

card3_box = (1200, 540, 1700, 840)
draw_hard_shadow(draw, card3_box, offset=8)
draw.rectangle(card3_box, fill=BG, outline=INK, width=4)
draw_torn_edge(draw, card3_box[0], card3_box[1], card3_box[2], amplitude=7)
draw_ink_splatter(draw, card3_box[2]-25, card3_box[1]+20, size=12)
draw.text((1230, 565), "🧘", font=font_onomatopoeia_sm, fill=INK)
draw.text((1290, 580), "情绪调节", font=font_subtitle, fill=INK)
draw.text((1230, 635), "5-4-3-2-1 接地练习", font=font_body, fill=MORANDI_WARM)
draw.text((1230, 670), "看到5样 · 触摸4样 · 听到3种", font=font_body, fill=(107, 104, 101))
draw.text((1230, 705), "闻到2种 · 尝到1种", font=font_body, fill=(107, 104, 101))
draw.text((1230, 770), "实用技能", font=font_label, fill=(255,255,255))
draw.rounded_rectangle([1225, 762, 1330, 790], radius=10, fill=MORANDI_WARM)

draw_motion_lines(draw, 1780, 650, direction='right', n=7, length=60)
draw_motion_lines(draw, 1780, 720, direction='right', n=5, length=45)

draw.text((180, 940), "叮！", font=font_onomatopoeia, fill=MORANDI_GREEN)
draw_concentration_lines(draw, 280, 980, 80, 140, n_lines=14)

draw.text((700, 920), "哗！", font=font_onomatopoeia, fill=MORANDI_ROSE)
draw_concentration_lines(draw, 800, 960, 80, 140, n_lines=14)

draw.text((1200, 940), "嗯...", font=font_onomatopoeia, fill=MORANDI_BLUE)

draw.text((1600, 920), "嗖~", font=font_onomatopoeia, fill=MORANDI_GRAY)

section_y = 1100
draw.line([(80, section_y), (W-80, section_y)], fill=INK, width=2)
draw.text((W//2 - 200, section_y - 20), "— 漫画视觉系统 —", font=font_label, fill=INK)

spec_y = 1150
specs = [
    ("描边", "4px 实线 · 线宽变化 4/2/1px", MORANDI_GREEN),
    ("阴影", "硬投影 5px+10px · 无模糊", MORANDI_ROSE),
    ("网点", "半调 4px间距 · 三级密度", MORANDI_BLUE),
    ("气泡", "语音 · 思考 · 喊叫 · 低语", MORANDI_WARM),
    ("拟声词", "3-5rem描边大字 · 场景映射", MORANDI_GREEN),
    ("构图", "倾斜-5°~+5° · 重叠 · 撕裂", MORANDI_ROSE),
    ("动效", "集中线 · 运动线 · 冲击框", MORANDI_BLUE),
    ("质感", "泛黄 · 墨线抖动 · 折痕", MORANDI_WARM),
]

for i, (label, desc, color) in enumerate(specs):
    col = i % 4
    row = i // 4
    sx = 80 + col * 570
    sy = spec_y + 30 + row * 80
    draw.rounded_rectangle([sx, sy, sx+540, sy+65], radius=4, fill=BG, outline=INK, width=2)
    draw.rounded_rectangle([sx+4, sy+4, sx+544, sy+69], radius=4, outline=INK, width=1)
    draw.rectangle([sx+10, sy+10, sx+110, sy+60], fill=color)
    draw.text((sx+25, sy+18), label, font=font_label, fill=(255,255,255))
    draw.text((sx+125, sy+22), desc, font=font_small, fill=INK)

draw.text((W//2 - 350, 1380), "INK PULSE  ·  墨脉", font=font_title, fill=INK)
draw.text((W//2 - 200, 1500), "情绪科学 · 漫画风格设计系统", font=font_label, fill=MORANDI_GRAY)

output_path = r"d:\solo-trae\mood-journal-demo\docs\ink-pulse-design.png"
img = img.convert("RGB")
img.save(output_path, "PNG", quality=95)
print(f"Saved to {output_path}")
