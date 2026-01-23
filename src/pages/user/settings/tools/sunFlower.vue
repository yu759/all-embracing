<canvas id="sunflowerCanvas" width="600" height="400"></canvas>

<script>
const canvas = document.getElementById("sunflowerCanvas");
const ctx = canvas.getContext("2d");

// 绘制天空背景
const gradient = ctx.createLinearGradient(0, 0, 0, 300);
gradient.addColorStop(0, "#87CEEB");
gradient.addColorStop(1, "#E0F7FF");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 600, 300);

// 绘制地面
ctx.fillStyle = "#8B7355";
ctx.fillRect(0, 300, 600, 100);

// 绘制太阳
ctx.beginPath();
ctx.arc(100, 100, 40, 0, Math.PI * 2);
ctx.fillStyle = "#FFD700";
ctx.fill();
ctx.strokeStyle = "#FF8C00";
ctx.lineWidth = 3;
ctx.stroke();

// 绘制阳光
ctx.strokeStyle = "#FFA500";
ctx.lineWidth = 4;
for (let i = 0; i < 8; i++) {
  const angle = (Math.PI * 2 * i) / 8;
  const x1 = 100 + Math.cos(angle) * 40;
  const y1 = 100 + Math.sin(angle) * 40;
  const x2 = 100 + Math.cos(angle) * 60;
  const y2 = 100 + Math.sin(angle) * 60;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// 绘制向日葵茎
ctx.fillStyle = "#32CD32";
ctx.fillRect(450, 280, 10, 100);

// 绘制向日葵花盘
ctx.beginPath();
ctx.arc(455, 280, 35, 0, Math.PI * 2);
ctx.fillStyle = "#8B4513";
ctx.fill();

// 绘制向日葵花瓣
ctx.fillStyle = "#FFD700";
ctx.strokeStyle = "#FFA500";
ctx.lineWidth = 2;

for (let i = 0; i < 12; i++) {
  const angle = (Math.PI * 2 * i) / 12;
  const petalLength = 40;
  const petalWidth = 15;

  const x = 455 + Math.cos(angle) * 35;
  const y = 280 + Math.sin(angle) * 35;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.ellipse(0, 0, petalWidth, petalLength, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// 绘制叶子
ctx.fillStyle = "#228B22";
// 左边叶子
ctx.beginPath();
ctx.ellipse(420, 320, 25, 40, Math.PI / 4, 0, Math.PI * 2);
ctx.fill();
// 右边叶子
ctx.beginPath();
ctx.ellipse(490, 320, 25, 40, -Math.PI / 4, 0, Math.PI * 2);
ctx.fill();

// 添加文字说明
ctx.fillStyle = "#000";
ctx.font = "16px Arial";
ctx.fillText("向日葵朝阳", 300, 50);
</script>