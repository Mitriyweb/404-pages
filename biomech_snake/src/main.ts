import { Segment } from './segment';
import { COLORS } from './colors';
import { SNAKE_CONFIG } from './config';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = innerWidth;
canvas.height = innerHeight;

const segments: Segment[] = [];
let targetX = innerWidth / 2;
let targetY = innerHeight / 2;

for (let i = 0; i < SNAKE_CONFIG.segmentCount; i++)
  segments.push(new Segment(i, 100 - i * 10, 300));

window.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 0 && segments.length < 80) {
    const last = segments[segments.length - 1];
    segments.push(new Segment(segments.length, last.x, last.y));
  }
  if (e.button === 2 && segments.length > 5) {
    segments.pop();
  }
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

function update() {
  const head = segments[0];
  const lag = SNAKE_CONFIG.lag;
  const laggedX = head.x + (targetX - head.x) * lag;
  const laggedY = head.y + (targetY - head.y) * lag;
  head.moveTo(laggedX, laggedY);

  for (let i = 1; i < segments.length; i++) {
    segments[i].follow(segments[i - 1]);
  }
}

function draw() {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];

    if (i === 0) {
      const angle = Math.atan2(targetY - s.y, targetX - s.x);

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.ellipse(0, 0, SNAKE_CONFIG.headRadius * 1.2, SNAKE_CONFIG.headRadius, 0, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.head;
      ctx.fill();
      ctx.strokeStyle = COLORS.headStroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(6, -5, 2, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.headEye;
      ctx.fill();

      ctx.restore();
      continue;
    }

    ctx.beginPath();
    ctx.arc(
      s.x,
      s.y,
      i > segments.length - SNAKE_CONFIG.tailSegments
        ? SNAKE_CONFIG.tailRadius
        : SNAKE_CONFIG.bodyRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle =
      i > segments.length - SNAKE_CONFIG.tailSegments ? COLORS.tail : COLORS.body;
    ctx.fill();

    const angle =
      i < segments.length - 1
        ? Math.atan2(segments[i + 1].y - s.y, segments[i + 1].x - s.x)
        : Math.atan2(s.y - segments[i - 1].y, s.x - segments[i - 1].x);

    if (i < segments.length - SNAKE_CONFIG.tailSegments) {
      for (let j = -1; j <= 1; j += 2) {
        const legAngle = angle + j * Math.PI / 2.5;
        const legLen = SNAKE_CONFIG.legLength - i * 0.2;
        const legX = s.x + Math.cos(legAngle) * legLen;
        const legY = s.y + Math.sin(legAngle) * legLen;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(legX, legY);
        ctx.strokeStyle = COLORS.leg;
        ctx.lineWidth = SNAKE_CONFIG.legWidth;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(legX, legY, SNAKE_CONFIG.legClawRadius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.legClaw;
        ctx.fill();
      }
    }
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();