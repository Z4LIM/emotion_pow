from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random

W, H = 2400, 1800
BG = (253, 248, 232)
INK = (45, 42, 38)
WHITE = (255, 255, 255)
MORANDI_GREEN = (138, 166, 138)
MORANDI_ROSE = (184, 134, 134)
MORANDI_BLUE = (138, 155, 182)
MORANDI_WARM = (196, 168, 106)
MORANDI_GRAY = (155, 152, 149)
DEEP_GREEN = (80, 120, 80)
DEEP_ROSE = (140, 90, 90)
LIGHT_ROSE = (240, 220, 215)

FONT_DIR = r"c:\Users\15812\.trae-cn\skills\canvas-design\canvas-fonts"

def load_font(name, size):
    try:
        return ImageFont.truetype(f"{FONT_DIR}/{name}", size)
    except:
        return ImageFont.load_default()

def draw_halftone(draw, x, y, w, h, dot_size=2, spacing=5, opacity=15):
    rng = random.Random(42)
    for dx in range(0, w, spacing):
        for dy in range(0, h, spacing):
            if rng.random() < 0.85:
                draw.ellipse([x+dx, y+dy, x+dx+dot_size, y+dy+dot_size], fill=(0,0,0,opacity))

def draw_hard_shadow(draw, box, offsets=[(6,6), (11,11)], color=INK):
    x1, y1, x2, y2 = box
    for ox, oy in offsets:
        shadow = [x1+ox, y1+oy, x2+ox, y2+oy]
        draw.rectangle(shadow, fill=color)

def draw_speech_bubble(draw, x, y, w, h, tail_x=None):
    if tail_x is None:
        tail_x = x + w // 3
    r = 15
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

def draw_concentration_lines(draw, cx, cy, r_inner, r_outer, n_lines=16, opacity=40):
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

def draw_panel_border(draw, x, y, w, h, rotation=0, offset=8):
    cx = x + w//2
    cy = y + h//2
    if rotation != 0:
        img_temp = Image.new('RGBA', (w+offset*2, h+offset*2), (0,0,0,0))
        draw_temp = ImageDraw.Draw(img_temp)
        draw_temp.rectangle([offset, offset, w+offset, h+offset], outline=INK, width=4)
        draw_temp.rectangle([offset+3, offset+3, w+offset+3, h+offset+3], outline=INK, width=3)
        img_temp = img_temp.rotate(rotation, resample=Image.BICUBIC, fillcolor=(0,0,0,0))
        img.paste(img_temp, (cx - w//2 - offset + 5, cy - h//2 - offset + 5), img_temp)

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

def draw_drawing_hand(draw, x, y):
    draw.ellipse([x-5, y-5, x+15, y+15], outline=INK, width=2)
    draw.line([(x+5, y+5), (x+5, y+50)], fill=INK, width=3)
    draw.line([(x+5, y+50), (x-10, y+70)], fill=INK, width=3)
    draw.line([(x+5, y+50), (x+25, y+65)], fill=INK, width=3)

def draw_character(draw, x, y, style='simple'):
    if style == 'simple':
        draw.ellipse([x-12, y-35, x+12, y-11], outline=INK, width=3)
        draw.line([(x, y-11), (x, y+15)], fill=INK, width=3)
        draw.line([(x, y+15), (x-15, y+35)], fill=INK, width=3)
        draw.line([(x, y+15), (x+15, y+35)], fill=INK, width=3)
        draw.line([(x, y+5), (x+20, y+15)], fill=INK, width=3)
        draw.line([(x, y+5), (x-20, y-5)], fill=INK, width=3)

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

img = Image.new('RGBA', (W, H), BG + (255,))
draw = ImageDraw.Draw(img)

draw_halftone(draw, 0, 0, W, H, dot_size=1, spacing=4, opacity=8)

font_title = load_font("BigShoulders-Bold.ttf", 100)
font_title_sm = load_font("BigShoulders-Bold.ttf", 56)
font_subtitle = load_font("Outfit-Bold.ttf", 32)
font_body = load_font("Outfit-Regular.ttf", 24)
font_body_sm = load_font("Outfit-Regular.ttf", 20)
font_small = load_font("IBMPlexMono-Regular.ttf", 18)
font_onomatopoeia = load_font("SmoochSans-Medium.ttf", 70)
font_onomatopoeia_sm = load_font("SmoochSans-Medium.ttf", 44)
font_onomatopoeia_xl = load_font("SmoochSans-Medium.ttf", 90)
font_label = load_font("Jura-Medium.ttf", 20)
font_handwrite = load_font("NothingYouCouldDo-Regular.ttf", 28)
font_handwrite_sm = load_font("NothingYouCouldDo-Regular.ttf", 22)
font_handwrite_lg = load_font("NothingYouCouldDo-Regular.ttf", 36)

draw.text((100, 60), "当你打开这个页面", font=font_handwrite_lg, fill=MORANDI_BLUE)
draw.text((100, 115), "故事就开始了", font=font_handwrite_lg, fill=INK)
draw.text((100, 165), "→", font=font_onomatopoeia, fill=MORANDI_GREEN)

draw_character(draw, 100, 350)
draw_speech_bubble(draw, 140, 280, 320, 100, tail_x=130)
draw.text((155, 300), "今天的我，", font=font_body, fill=INK)
draw.text((155, 335), "是什么心情？", font=font_body, fill=INK)

draw_arrow(draw, 200, 420, 500, 300, color=MORANDI_GREEN, width=3)

draw_thought_bubble(draw, 500, 220, 380, 160)
draw.text((520, 245), "焦虑... 但没关系", font=font_body, fill=INK)
draw.text((520, 285), "大脑在保护我", font=font_body_sm, fill=MORANDI_GRAY)

draw.text((480, 200), "嗯...", font=font_onomatopoeia_sm, fill=MORANDI_BLUE)

draw_concentration_lines(draw, 690, 300, 100, 180, n_lines=14, opacity=25)

draw_shout_bubble(draw, 960, 200, 240, 160)
draw.text((1010, 240), "叮！", font=font_onomatopoeia, fill=MORANDI_ROSE)
draw.text((1015, 310), "新知识", font=font_label, fill=INK)

draw_panel_border(draw, 100, 520, 600, 480, rotation=-3)
draw_hard_shadow(draw, (105, 525, 705, 1005))
draw.rectangle([105, 525, 705, 1005], fill=BG, outline=INK, width=4)
draw_torn_edge(draw, 105, 525, 705, amplitude=4)
draw_ink_splatter(draw, 690, 980, size=10)

draw.text((130, 540), "🎭", font=font_onomatopoeia_sm, fill=INK)
draw.text((190, 550), "情绪是什么", font=font_subtitle, fill=INK)
draw.line([(130, 600), (680, 600)], fill=INK, width=2)
draw.line([(130, 603), (680, 603)], fill=INK, width=1)

draw.text((130, 620), "焦虑不是敌人。", font=font_handwrite, fill=DEEP_ROSE)
draw.text((130, 660), "它是大脑在说：", font=font_handwrite, fill=DEEP_ROSE)
draw.text((130, 700), "\"我在保护你。\"", font=font_handwrite, fill=INK)

draw.line([(130, 740), (320, 740)], fill=MORANDI_ROSE, width=3)
draw.text((330, 725), "生理反应", font=font_small, fill=MORANDI_ROSE)
draw.text((130, 755), "心跳加快 · 肌肉紧张 · 警觉提升", font=font_body_sm, fill=(107, 104, 101))

draw.line([(130, 800), (320, 800)], fill=MORANDI_GREEN, width=3)
draw.text((330, 785), "行为表达", font=font_small, fill=MORANDI_GREEN)
draw.text((130, 815), "后退 · 寻找安全 · 告诉他人", font=font_body_sm, fill=(107, 104, 101))

draw.line([(130, 860), (320, 860)], fill=MORANDI_BLUE, width=3)
draw.text((330, 845), "情绪调节", font=font_small, fill=MORANDI_BLUE)
draw.text((130, 875), "5-4-3-2-1 接地 · 深呼吸 · 命名情绪", font=font_body_sm, fill=(107, 104, 101))

draw.text((130, 940), "→", font=font_onomatopoeia, fill=MORANDI_GREEN)
draw.text((160, 935), "查看完整知识库", font=font_label, fill=MORANDI_GREEN)

draw_panel_border(draw, 780, 500, 550, 520, rotation=2)
draw_hard_shadow(draw, (785, 505, 1335, 1025))
draw.rectangle([785, 505, 1335, 1025], fill=BG, outline=INK, width=4)
draw_torn_edge(draw, 785, 505, 1335, amplitude=5)
draw_ink_splatter(draw, 800, 520, size=8)

draw.text((810, 520), "📊", font=font_onomatopoeia_sm, fill=INK)
draw.text((870, 530), "效价与唤醒度", font=font_subtitle, fill=INK)
draw.line([(810, 580), (1310, 580)], fill=INK, width=2)
draw.line([(810, 583), (1310, 583)], fill=INK, width=1)

draw.rounded_rectangle([810, 600, 1310, 650], radius=8, fill=LIGHT_ROSE, outline=MORANDI_ROSE, width=2)
draw.text((830, 612), "焦虑", font=font_subtitle, fill=DEEP_ROSE)
draw.text((920, 615), "←", font=font_body, fill=MORANDI_GRAY)
draw.text((950, 612), "低效价", font=font_small, fill=MORANDI_GRAY)
draw.text((1080, 615), "+", font=font_body, fill=MORANDI_GRAY)
draw.text((1110, 612), "高唤醒", font=font_small, fill=MORANDI_ROSE)

draw.text((810, 670), "调节策略：先冷静，再思考", font=font_handwrite_sm, fill=MORANDI_GREEN)

draw_speech_bubble(draw, 810, 700, 500, 90, tail_x=900)
draw.text((825, 718), "💡 你知道吗？命名情绪可使杏仁核降低50%", font=font_body_sm, fill=INK)

draw.line([(810, 820), (1100, 820)], fill=MORANDI_BLUE, width=3)
draw.text((1110, 805), "情绪维度", font=font_small, fill=MORANDI_BLUE)
draw.text((810, 835), "二维模型是情绪研究最广泛使用的框架", font=font_body_sm, fill=(107, 104, 101))

draw.text((810, 880), "→", font=font_onomatopoeia, fill=MORANDI_BLUE)
draw.text((840, 875), "查看完整知识库", font=font_label, fill=MORANDI_BLUE)

draw_panel_border(draw, 1410, 480, 500, 560, rotation=-2)
draw_hard_shadow(draw, (1415, 485, 1915, 1045))
draw.rectangle([1415, 485, 1915, 1045], fill=BG, outline=INK, width=4)
draw_torn_edge(draw, 1415, 485, 1915, amplitude=6)
draw_ink_splatter(draw, 1900, 1020, size=12)

draw.text((1440, 500), "🧘", font=font_onomatopoeia_sm, fill=INK)
draw.text((1500, 510), "情绪调节", font=font_subtitle, fill=INK)
draw.line([(1440, 560), (1890, 560)], fill=INK, width=2)
draw.line([(1440, 563), (1890, 563)], fill=INK, width=1)

draw.text((1440, 580), "5-4-3-2-1 接地练习", font=font_handwrite, fill=MORANDI_WARM)

steps = [
    ("5", "看到5样东西"),
    ("4", "触摸4样东西"),
    ("3", "听到3种声音"),
    ("2", "闻到2种气味"),
    ("1", "尝到1种味道"),
]
for i, (num, text) in enumerate(steps):
    y_pos = 640 + i * 60
    draw.ellipse([1440, y_pos, 1470, y_pos+30], fill=MORANDI_WARM, outline=INK, width=2)
    draw.text((1450, y_pos+2), num, font=font_label, fill=WHITE)
    draw.text((1485, y_pos+2), text, font=font_body_sm, fill=INK)

draw.text((1440, 970), "→", font=font_onomatopoeia, fill=MORANDI_WARM)
draw.text((1470, 965), "查看完整知识库", font=font_label, fill=MORANDI_WARM)

draw_arrow(draw, 400, 1080, 400, 1250, color=MORANDI_GREEN, width=3)
draw_arrow(draw, 1050, 1080, 1050, 1250, color=MORANDI_BLUE, width=3)

draw.text((200, 1120), "哗！", font=font_onomatopoeia_xl, fill=MORANDI_GREEN)
draw_concentration_lines(draw, 320, 1160, 60, 140, n_lines=12, opacity=20)

draw.text((850, 1120), "嗖~", font=font_onomatopoeia_xl, fill=MORANDI_GRAY)

draw_character(draw, 1600, 1150)
draw_speech_bubble(draw, 1650, 1080, 400, 120, tail_x=1640)
draw.text((1665, 1100), "今天的心情，", font=font_body, fill=INK)
draw.text((1665, 1135), "明天会更好 ✨", font=font_body, fill=INK)

draw.text((1650, 1060), "嗯...", font=font_onomatopoeia_sm, fill=MORANDI_BLUE)

draw.line([(100, 1320), (W-100, 1320)], fill=INK, width=1)

draw.text((100, 1350), "IN", font=load_font("BigShoulders-Bold.ttf", 80), fill=INK)
draw.text((190, 1350), "K", font=load_font("BigShoulders-Bold.ttf", 80), fill=MORANDI_GREEN)
draw.text((240, 1350), "  PULSE", font=load_font("BigShoulders-Bold.ttf", 80), fill=INK)
draw.text((580, 1370), "墨脉", font=font_title_sm, fill=MORANDI_ROSE)
draw.text((100, 1440), "不是规范，是故事。不是展示，是体验。", font=font_handwrite, fill=MORANDI_BLUE)
draw.text((100, 1490), "每一条墨线，都是情绪的脉搏。", font=font_handwrite, fill=INK)

draw.line([(100, 1540), (W-100, 1540)], fill=MORANDI_GRAY, width=1)

specs_v2 = [
    ("叙事", "页面即分镜 · 卡片即故事 · 滚动即剧情", MORANDI_GREEN),
    ("角色", "用户即主角 · 情绪即配角 · 知识即旁白", MORANDI_ROSE),
    ("色彩", "Morandi色调即情绪配乐", MORANDI_BLUE),
    ("文字", "标题是呐喊 · 正文是低语 · 拟声是动作", MORANDI_WARM),
    ("空间", "倾斜制造动势 · 重叠制造深度 · 撕裂制造真实", MORANDI_GREEN),
    ("时间", "集中线制造瞬间 · 运动线制造过程 · 留白制造呼吸", MORANDI_ROSE),
]

for i, (label, desc, color) in enumerate(specs_v2):
    col = i % 3
    row = i // 3
    sx = 100 + col * 750
    sy = 1560 + 30 + row * 70
    draw_hard_shadow(draw, (sx, sy, sx+720, sy+58))
    draw.rectangle([sx, sy, sx+720, sy+58], fill=BG, outline=INK, width=2)
    draw.rectangle([sx+3, sy+3, sx+726, sy+64], outline=INK, width=1)
    draw.rectangle([sx+8, sy+8, sx+80, sy+50], fill=color)
    draw.text((sx+18, sy+16), label, font=font_label, fill=WHITE)
    draw.text((sx+95, sy+20), desc, font=font_small, fill=INK)

output_path = r"d:\solo-trae\mood-journal-demo\docs\ink-pulse-design-v2.png"
img = img.convert("RGB")
img.save(output_path, "PNG", quality=95)
print(f"Saved to {output_path}")
