// Vectorizes the Putnam mark from src/assets/putnam-dark.png into public/favicon.svg.
// The mark is a flat, single-color shape, so a contour trace of the alpha mask at the
// PNG's native 800 px (then simplified to ≤ 0.35 px error) is faithful at every icon
// size. Replace the output with the real vector logo when it exists.
//
//   node scripts/trace-mark.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'src/assets/putnam-dark.png';
const OUT = 'public/favicon.svg';
const FILL = '#003a36';
const EPSILON = 0.35;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && data[(y * W + x) * 4 + 3] > 127;

// Boundary edges between an inside pixel and an outside neighbour, keyed by start vertex.
// Each edge runs with the shape on its left, so following them yields closed loops
// with consistent winding (outer loops CCW, holes CW → fill-rule nonzero works).
const edges = new Map();
const add = (ax, ay, bx, by) => { const key = `${ax},${ay}`; (edges.get(key) ?? edges.set(key, []).get(key)).push([bx, by]); };
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!inside(x, y)) continue;
  if (!inside(x, y - 1)) add(x, y, x + 1, y);           // top edge, left→right
  if (!inside(x + 1, y)) add(x + 1, y, x + 1, y + 1);   // right edge, top→bottom
  if (!inside(x, y + 1)) add(x + 1, y + 1, x, y + 1);   // bottom edge, right→left
  if (!inside(x - 1, y)) add(x, y + 1, x, y);           // left edge, bottom→top
}

const loops = [];
for (const [start, targets] of edges) {
  while (targets.length) {
    const loop = [];
    let [x, y] = start.split(',').map(Number);
    let next = targets.pop();
    loop.push([x, y]);
    while (next && !(next[0] === loop[0][0] && next[1] === loop[0][1])) {
      loop.push(next);
      const key = `${next[0]},${next[1]}`;
      const options = edges.get(key);
      if (!options?.length) break;
      // At a saddle (two exits), prefer the exit that keeps turning left.
      next = options.length === 1 ? options.pop() : options.splice(options.findIndex((candidate) => (candidate[0] - next[0]) * (next[1] - loop.at(-2)[1]) - (candidate[1] - next[1]) * (next[0] - loop.at(-2)[0]) < 0) >>> 0 || 0, 1)[0];
    }
    if (loop.length > 2) loops.push(loop);
  }
}

// Ramer–Douglas–Peucker on a closed loop.
const simplify = (points, epsilon) => {
  const distance = ([px, py], [ax, ay], [bx, by]) => {
    const dx = bx - ax, dy = by - ay;
    const length = Math.hypot(dx, dy) || 1;
    return Math.abs(dy * px - dx * py + bx * ay - by * ax) / length;
  };
  const rdp = (pts) => {
    if (pts.length < 3) return pts;
    let index = 0, max = 0;
    for (let i = 1; i < pts.length - 1; i++) { const d = distance(pts[i], pts[0], pts.at(-1)); if (d > max) { max = d; index = i; } }
    if (max <= epsilon) return [pts[0], pts.at(-1)];
    return [...rdp(pts.slice(0, index + 1)).slice(0, -1), ...rdp(pts.slice(index))];
  };
  // Split the loop at its two farthest-apart points so RDP sees two open polylines.
  let far = 0;
  for (let i = 1; i < points.length; i++) if (Math.hypot(points[i][0] - points[0][0], points[i][1] - points[0][1]) > Math.hypot(points[far][0] - points[0][0], points[far][1] - points[0][1])) far = i;
  const a = rdp(points.slice(0, far + 1)), b = rdp([...points.slice(far), points[0]]);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
};

const paths = loops.map((loop) => simplify(loop, EPSILON)).filter((loop) => loop.length > 2);
const d = paths.map((loop) => `M${loop.map(([x, y]) => `${x} ${y}`).join('L')}Z`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><path fill="${FILL}" fill-rule="nonzero" d="${d}"/></svg>\n`;
await writeFile(OUT, svg);
console.log(`trace-mark: ${loops.length} contour(s), ${paths.reduce((n, loop) => n + loop.length, 0)} points, ${(svg.length / 1024).toFixed(1)} KB → ${OUT}`);
