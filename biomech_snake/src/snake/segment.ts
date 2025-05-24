export class Segment {
  public vx = 0;
  public vy = 0;
  public angle = 0;
  public length = 10;
  public damping = 0.2;

  constructor(
    public index: number,
    public x: number,
    public y: number
  ) {}

  moveTo(targetX: number, targetY: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    this.vx += dx * 0.1;
    this.vy += dy * 0.1;
    this.vx *= 1 - this.damping;
    this.vy *= 1 - this.damping;
    this.x += this.vx;
    this.y += this.vy;
  }

  follow(leader: Segment) {
    const dx = leader.x - this.x;
    const dy = leader.y - this.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const offset = dist - this.length;
    this.x += Math.cos(angle) * offset * 0.5;
    this.y += Math.sin(angle) * offset * 0.5;
  }
}
