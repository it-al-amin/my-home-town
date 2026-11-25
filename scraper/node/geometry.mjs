// Shared polygon helpers for the map-geometry build scripts.

// Douglas-Peucker on planar lon/lat (fine at district scale).
function simplify(points, tol) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a]; const [bx, by] = points[b];
    const dx = bx - ax; const dy = by - ay; const len = Math.hypot(dx, dy) || 1e-12;
    let maxD = 0; let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return points.filter((_, i) => keep[i]);
}

/** A closed ring has first == last point, so its first chord has zero length; simplify it in two halves. */
export function simplifyRing(ring, tol) {
  const mid = Math.floor(ring.length / 2);
  const a = simplify(ring.slice(0, mid + 1), tol);
  const b = simplify(ring.slice(mid), tol);
  return [...a, ...b.slice(1)];
}

export const round = (n) => Math.round(n * 1e5) / 1e5;
