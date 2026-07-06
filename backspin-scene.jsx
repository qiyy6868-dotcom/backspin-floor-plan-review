/* BACKSPIN ARCADE — 2F 3D walkthrough, rebuilt faithfully from the CAD floor plan.
   Grid: cols 1-7 → x -20.7,-14.0,-7.1,-0.4,7.2,13.9,20.7 ; rows A-J → z 14.7 … -14.7 */
const STOPS = [
  { zh: '入口 · 接待', en: 'ENTRANCE & RECEPTION', pos: [-13.2, 1.65, -8.4], look: [-9, 1.1, -3] },
  { zh: '推杆果岭区', en: 'PUTTING AREA', pos: [-11, 1.6, -7.6], look: [-9.2, 0.7, -10.6] },
  { zh: '高尔夫模拟打位', en: 'FREE RANGE BAYS', pos: [7.5, 1.65, -7.6], look: [7, 1.6, -13.8] },
  { zh: '高尔夫 VIP 包间 ×2', en: 'VIP COMPARTMENTS', pos: [12.8, 1.6, -8.6], look: [17.5, 1.3, -11.8] },
  { zh: '中央吧台', en: 'CENTRAL BAR', pos: [0.3, 1.6, 2.6], look: [0.3, 1.4, -2.2] },
  { zh: '散座 · 演奏区', en: 'SEATING & PERFORMANCE', pos: [-10.8, 1.6, -1.4], look: [-16.5, 1.0, -4.8] },
  { zh: '下沉卡座 · 歌台', en: 'SUNKEN LOUNGE & STAGE', pos: [-12.4, 1.6, 4.6], look: [-16.6, 0.6, 2.2] },
  { zh: '客人吧台座位', en: 'GUEST BAR SEATING', pos: [2.4, 1.6, -5.6], look: [0.3, 1.3, -1.6] },
  { zh: '飞镖区', en: 'DART AREA', pos: [-11.6, 1.6, 3.4], look: [-8.6, 1.4, 2.4] },
  { zh: '餐饮卡座区', en: 'DINING LOUNGE', pos: [3.2, 1.6, 1.2], look: [-2.5, 1.0, 6.2] },
  { zh: '台球区', en: 'BILLIARD AREA', pos: [-8.6, 1.7, 8.4], look: [-13, 0.9, 11.6] },
];

function makeTex(THREE, w, h, draw, rx, ry) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (rx) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry || rx); }
  return t;
}

function buildScene(THREE, scene) {
  // ================= textures =================
  const tileT = makeTex(THREE, 512, 512, (g) => {
    g.fillStyle = '#c8bfae'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) { g.fillStyle = 'rgba(255,255,255,' + Math.random() * 0.05 + ')'; g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2); }
    g.strokeStyle = '#a89f8e'; g.lineWidth = 2;
    for (let i = 0; i <= 2; i++) { g.beginPath(); g.moveTo(i * 256, 0); g.lineTo(i * 256, 512); g.stroke(); g.beginPath(); g.moveTo(0, i * 256); g.lineTo(512, i * 256); g.stroke(); }
  }, 10, 7);
  const fluteGoldT = makeTex(THREE, 256, 64, (g) => {
    for (let x = 0; x < 256; x += 16) {
      const gr = g.createLinearGradient(x, 0, x + 16, 0);
      gr.addColorStop(0, '#4a3b26'); gr.addColorStop(0.5, '#a8895a'); gr.addColorStop(1, '#3a2e1e');
      g.fillStyle = gr; g.fillRect(x, 0, 16, 64);
    }
  }, 26, 1);
  const fluteOliveT = makeTex(THREE, 256, 64, (g) => {
    for (let x = 0; x < 256; x += 22) {
      const gr = g.createLinearGradient(x, 0, x + 22, 0);
      gr.addColorStop(0, '#23271c'); gr.addColorStop(0.5, '#3f4630'); gr.addColorStop(1, '#1f2318');
      g.fillStyle = gr; g.fillRect(x, 0, 22, 64);
    }
  }, 8, 1);
  const marbleT = makeTex(THREE, 512, 512, (g) => {
    g.fillStyle = '#15120e'; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(214,196,160,.5)'; g.lineWidth = 1.6;
    for (let i = 0; i < 9; i++) {
      g.beginPath(); let x = Math.random() * 512, y = 0;
      g.moveTo(x, y);
      while (y < 512) { y += 24 + Math.random() * 30; x += (Math.random() - 0.5) * 70; g.lineTo(x, y); }
      g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,.14)';
    for (let i = 0; i < 14; i++) { g.beginPath(); const x = Math.random() * 512, y = Math.random() * 512; g.moveTo(x, y); g.lineTo(x + 60 - Math.random() * 120, y + 60); g.stroke(); }
  }, 2, 2);
  const carpetT = makeTex(THREE, 256, 256, (g) => {
    g.fillStyle = '#1b201a'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 700; i++) { g.fillStyle = Math.random() < 0.82 ? 'rgba(58,68,52,.5)' : 'rgba(150,124,72,.45)'; const s = 1 + Math.random() * 3; g.fillRect(Math.random() * 256, Math.random() * 256, s, s); }
  }, 6, 3);
  const checkerT = makeTex(THREE, 256, 256, (g) => {
    g.fillStyle = '#cfc6b4'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#211d17';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if ((x + y) % 2) g.fillRect(x * 64, y * 64, 64, 64);
  }, 3, 1.4);
  const screenT = makeTex(THREE, 512, 300, (g) => {
    const sky = g.createLinearGradient(0, 0, 0, 150);
    sky.addColorStop(0, '#9cc0e4'); sky.addColorStop(1, '#e9eef0'); g.fillStyle = sky; g.fillRect(0, 0, 512, 158);
    g.fillStyle = 'rgba(255,255,255,.85)';[[80, 40, 60], [200, 60, 40], [380, 34, 70]].forEach(c => { g.beginPath(); g.ellipse(c[0], c[1], c[2], c[2] * 0.36, 0, 0, 7); g.fill(); });
    const gr = g.createLinearGradient(0, 150, 0, 300); gr.addColorStop(0, '#86b06c'); gr.addColorStop(1, '#39603c'); g.fillStyle = gr; g.fillRect(0, 150, 512, 150);
    g.fillStyle = '#a3ca82'; g.beginPath(); g.ellipse(256, 244, 140, 40, 0, 0, 7); g.fill();
    g.fillStyle = '#d9e6c8'; g.beginPath(); g.ellipse(330, 226, 26, 12, 0, 0, 7); g.fill();
  });
  const bandT = makeTex(THREE, 1024, 128, (g) => {
    g.fillStyle = '#080706'; g.fillRect(0, 0, 1024, 128);
    const hues = ['#33587e', '#7e3333', '#2f6b48', '#6b5a2e', '#4a3a6b'];
    for (let i = 0; i < 8; i++) {
      g.fillStyle = hues[i % 5]; g.fillRect(i * 128 + 8, 12, 112, 104);
      g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(i * 128 + 24, 34, 80, 7); g.fillRect(i * 128 + 24, 54, 56, 7);
      g.fillStyle = 'rgba(255,220,140,.9)'; g.fillRect(i * 128 + 24, 84, 34, 10);
    }
  }, 1, 1);
  const nightT = makeTex(THREE, 256, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, '#0a0d14'); gr.addColorStop(1, '#141018'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,214,150,' + (0.1 + Math.random() * 0.3) + ')'; g.fillRect(Math.random() * 256, 40 + Math.random() * 180, 2, 2); }
  }, 2, 1);

  // ================= materials =================
  const M = {
    cream: new THREE.MeshStandardMaterial({ color: 0xe9e0cd, roughness: 0.88 }),
    creamDim: new THREE.MeshStandardMaterial({ color: 0xd8cfba, roughness: 0.9 }),
    charc: new THREE.MeshStandardMaterial({ color: 0x1e1b17, roughness: 0.85 }),
    black: new THREE.MeshStandardMaterial({ color: 0x121009, roughness: 0.5 }),
    mirror: new THREE.MeshStandardMaterial({ color: 0x0c0a08, roughness: 0.12, metalness: 0.95 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xa5854e, roughness: 0.3, metalness: 0.85 }),
    glow: new THREE.MeshStandardMaterial({ color: 0x332818, emissive: 0xffd9a0, emissiveIntensity: 2.6 }),
    glowSoft: new THREE.MeshStandardMaterial({ color: 0x2a2115, emissive: 0xffe3b8, emissiveIntensity: 1.4 }),
    tile: new THREE.MeshStandardMaterial({ map: tileT, roughness: 0.55, metalness: 0.06 }),
    checker: new THREE.MeshStandardMaterial({ map: checkerT, roughness: 0.6 }),
    carpet: new THREE.MeshStandardMaterial({ map: carpetT, roughness: 1 }),
    felt: new THREE.MeshStandardMaterial({ color: 0x36593f, roughness: 1 }),
    green: new THREE.MeshStandardMaterial({ color: 0x41694a, roughness: 1 }),
    fringe: new THREE.MeshStandardMaterial({ color: 0x2b3d2c, roughness: 1 }),
    turf: new THREE.MeshStandardMaterial({ color: 0x4c7a52, roughness: 1 }),
    olive: new THREE.MeshStandardMaterial({ color: 0x4c4f37, roughness: 0.95 }),
    fluteOlive: new THREE.MeshStandardMaterial({ map: fluteOliveT, roughness: 0.9 }),
    fluteGold: new THREE.MeshStandardMaterial({ map: fluteGoldT, roughness: 0.35, metalness: 0.6 }),
    boucle: new THREE.MeshStandardMaterial({ color: 0xb2a68f, roughness: 1 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x77492e, roughness: 0.62 }),
    marble: new THREE.MeshStandardMaterial({ map: marbleT, roughness: 0.16, metalness: 0.15 }),
    stoneTop: new THREE.MeshStandardMaterial({ color: 0xd9cfb8, roughness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x9fb2b5, transparent: true, opacity: 0.16, roughness: 0.08 }),
    night: new THREE.MeshStandardMaterial({ map: nightT, emissive: 0xffffff, emissiveMap: nightT, emissiveIntensity: 0.5 }),
    boh: new THREE.MeshStandardMaterial({ color: 0x262320, roughness: 0.92 }),
    screen: new THREE.MeshStandardMaterial({ map: screenT, emissive: 0xffffff, emissiveMap: screenT, emissiveIntensity: 1.15 }),
    band: new THREE.MeshStandardMaterial({ map: bandT, emissive: 0xffffff, emissiveMap: bandT, emissiveIntensity: 1.25, side: THREE.DoubleSide }),
    amber: new THREE.MeshStandardMaterial({ color: 0x3a2a12, emissive: 0xffb75e, emissiveIntensity: 1.1 }),
    plant: new THREE.MeshStandardMaterial({ color: 0x2e4630, roughness: 1 }),
  };

  const box = (w, h, d, mat, x, y, z, ry) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); if (ry) m.rotation.y = ry; scene.add(m); return m;
  };
  const cyl = (rt, rb, h, mat, x, y, z, seg, open) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 40, 1, !!open), mat);
    m.position.set(x, y, z); scene.add(m); return m;
  };
  const torus = (r, tube, arc, mat, x, y, z, rz) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 14, 48, arc || Math.PI * 2), mat);
    m.rotation.x = -Math.PI / 2; if (rz) m.rotation.z = rz;
    m.position.set(x, y, z); scene.add(m); return m;
  };
  const sphere = (r, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat); m.position.set(x, y, z); scene.add(m); return m; };
  const candle = (x, y, z) => cyl(0.025, 0.025, 0.05, M.amber, x, y, z, 8);
  const plane = (w, h, mat, x, y, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z); if (ry) m.rotation.y = ry; scene.add(m); return m;
  };
  const roundTable = (x, z, r, chairs, chairMat) => {
    cyl(r, r - 0.04, 0.05, M.marble, x, 0.72, z);
    cyl(0.06, 0.06, 0.7, M.brass, x, 0.36, z, 12);
    candle(x, 0.77, z);
    for (let k = 0; k < chairs; k++) {
      const a = k * (Math.PI * 2 / chairs) + x;
      const cxp = x + Math.cos(a) * (r + 0.45), czp = z + Math.sin(a) * (r + 0.45);
      cyl(0.23, 0.2, 0.44, chairMat, cxp, 0.22, czp, 18);
      const bk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 18, 1, true, 0, Math.PI), chairMat);
      bk.position.set(cxp + Math.cos(a) * 0.1, 0.55, czp + Math.sin(a) * 0.1);
      bk.rotation.y = Math.PI / 2 - a; scene.add(bk);
    }
  };
  const pendantCone = (x, y, z) => {
    cyl(0.012, 0.012, 3.7 - y - 0.2, M.black, x, (3.7 + y) / 2, z, 6);
    cyl(0.03, 0.14, 0.18, M.brass, x, y, z, 20);
    sphere(0.055, M.glowSoft, x, y - 0.11, z);
  };
  const planter = (x, z) => {
    cyl(0.32, 0.26, 0.52, M.black, x, 0.26, z, 20);
    sphere(0.3, M.plant, x, 0.9, z).scale.y = 1.3;
    sphere(0.24, M.plant, x + 0.18, 0.78, z + 0.1);
  };

  // ================= shell =================
  const H = 3.8;
  // chamfer endpoints (1,E)→(3,J)
  const cA = { x: -20.7, z: -4.5 }, cB = { x: -7.1, z: -14.7 };
  const cLen = Math.hypot(cB.x - cA.x, cB.z - cA.z);
  const cAng = Math.atan2(-(cB.z - cA.z), cB.x - cA.x); // rotation.y for boxes along the chamfer
  const cU = { x: (cB.x - cA.x) / cLen, z: (cB.z - cA.z) / cLen };
  const cN = { x: 0.6, z: 0.8 }; // interior normal
  const alongC = (t, off) => ({ x: cA.x + cU.x * t + cN.x * (off || 0), z: cA.z + cU.z * t + cN.z * (off || 0) });

  const shp = new THREE.Shape();
  shp.moveTo(cA.x, cA.z); shp.lineTo(cB.x, cB.z); shp.lineTo(20.7, -14.7);
  shp.lineTo(20.7, 14.7); shp.lineTo(-20.7, 14.7); shp.closePath();
  const fg = new THREE.ShapeGeometry(shp); fg.rotateX(-Math.PI / 2);
  scene.add(new THREE.Mesh(fg, M.tile));
  const ceil = new THREE.Mesh(fg.clone(), new THREE.MeshStandardMaterial({ color: 0x0f0d0a, roughness: 0.95 }));
  ceil.position.y = H; ceil.rotation.x = Math.PI; scene.add(ceil);

  box(27.8, H, 0.3, M.charc, 6.8, H / 2, -14.85);           // N wall (east of chamfer)
  box(0.3, H, 29.4, M.charc, 20.85, H / 2, 0);              // E wall
  box(0.3, H, 19.2, M.creamDim, -20.85, H / 2, 5.1);        // W wall (south of chamfer)
  // chamfer wall with entrance gap (t 6.25..8.65)
  const seg1 = alongC(3.125); box(6.25, H, 0.3, M.creamDim, seg1.x, H / 2, seg1.z, cAng);
  const seg2 = alongC(12.825); box(8.35, H, 0.3, M.creamDim, seg2.x, H / 2, seg2.z, cAng);
  // entrance double doors + brass portal
  const dC = alongC(7.45);
  const j1 = alongC(6.3), j2 = alongC(8.6);
  box(0.16, 3.15, 0.16, M.brass, j1.x, 1.57, j1.z);
  box(0.16, 3.15, 0.16, M.brass, j2.x, 1.57, j2.z);
  box(2.4, 0.16, 0.16, M.brass, dC.x, 3.16, dC.z, cAng);
  const dr1 = alongC(6.9, 0.12), dr2 = alongC(8.0, -0.05);
  box(1.05, 2.9, 0.06, M.glass, dr1.x, 1.45, dr1.z, cAng + 0.5);
  box(1.05, 2.9, 0.06, M.glass, dr2.x, 1.45, dr2.z, cAng);
  // DOWN stair to street level (west end of chamfer)
  const sw = alongC(2.6, 1.4);
  box(3.4, 0.02, 1.7, M.black, sw.x, 0.012, sw.z, cAng);
  for (let i = 0; i < 4; i++) {
    const sp = alongC(1.4 + i * 0.75, 1.4);
    box(0.7, 0.02, 1.6, M.charc, sp.x, 0.011 - i * 0.001, sp.z, cAng);
  }
  const r1 = alongC(0.9, 0.55), r2 = alongC(4.3, 0.55), r3 = alongC(0.9, 2.25), r4 = alongC(4.3, 2.25);
  [[r1, r2], [r3, r4]].forEach(pr => {
    const mx = (pr[0].x + pr[1].x) / 2, mz = (pr[0].z + pr[1].z) / 2;
    box(3.4, 0.05, 0.05, M.brass, mx, 1.05, mz, cAng);
    [pr[0], pr[1]].forEach(p => box(0.045, 1.05, 0.045, M.brass, p.x, 0.52, p.z));
  });
  const dnT = makeTex(THREE, 256, 64, (g) => { g.fillStyle = '#1c1915'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#e8c887'; g.font = '600 30px Georgia'; g.textAlign = 'center'; g.fillText('DOWN ↓', 128, 42); });
  plane(1.4, 0.35, new THREE.MeshStandardMaterial({ map: dnT, emissive: 0xffffff, emissiveMap: dnT, emissiveIntensity: 0.6 }), sw.x, 2.2, sw.z, cAng + Math.PI / 2);

  // logo on chamfer wall inside, east of door
  const logoT = makeTex(THREE, 1024, 160, (g) => {
    g.clearRect(0, 0, 1024, 160);
    g.fillStyle = '#e8c887'; g.font = '600 92px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('B A C K S P I N', 512, 80);
  });
  const logoM = new THREE.MeshStandardMaterial({ map: logoT, transparent: true, emissive: 0xffd9a0, emissiveMap: logoT, emissiveIntensity: 1.5 });
  const lgP = alongC(12.8, 0.18);
  plane(4.6, 0.72, logoM, lgP.x, 2.5, lgP.z, cAng + Math.PI); // faces interior
  // ramp guide from door down into the hall (level walkway with brass rails + light lines)
  const rmp = alongC(7.45, 2.2);
  box(2.3, 0.016, 3.4, M.carpet, rmp.x, 0.009, rmp.z, cAng);
  const rl1 = alongC(6.35, 2.2), rl2 = alongC(8.55, 2.2);
  [rl1, rl2].forEach(p => {
    box(0.05, 0.05, 3.4, M.brass, p.x, 1.02, p.z, cAng);
    box(0.04, 1.0, 0.04, M.brass, p.x + cN.x * 1.55, 0.5, p.z + cN.z * 1.55);
    box(0.04, 1.0, 0.04, M.brass, p.x - cN.x * 1.35, 0.5, p.z - cN.z * 1.35);
    box(0.03, 0.02, 3.4, M.glow, p.x, 0.03, p.z, cAng);
  });

  // ================= reception (inside entrance) =================
  const dk = alongC(9.9, 2.0);
  cyl(1.15, 1.15, 1.06, M.marble, dk.x, 0.53, dk.z, 48);
  cyl(1.18, 1.18, 0.05, M.stoneTop, dk.x, 1.08, dk.z, 48);
  cyl(1.2, 1.2, 0.03, M.glow, dk.x, 0.05, dk.z, 48);
  cyl(0.09, 0.12, 0.16, M.amber, dk.x + 0.5, 1.19, dk.z - 0.3, 16);
  box(0.34, 0.02, 0.24, M.black, dk.x - 0.2, 1.12, dk.z + 0.2);
  pendantCone(dk.x, 2.55, dk.z);
  const chk = alongC(7.45, 1.3);
  box(2.3, 0.02, 2.2, M.checker, chk.x, 0.012, chk.z, cAng);
  // slatted partition screen between door and hall (west side of door)
  for (let i = 0; i <= 9; i++) {
    const p = alongC(4.7 + i * 0.17, 1.1);
    box(0.08, 2.4, 0.05, M.fluteOlive, p.x, 1.2, p.z, cAng);
  }
  const pc1 = alongC(5.46, 1.1);
  box(1.75, 0.06, 0.13, M.brass, pc1.x, 2.43, pc1.z, cAng);
  box(1.75, 0.09, 0.16, M.black, pc1.x, 0.045, pc1.z, cAng);
  planter(alongC(4.2, 1.15).x, alongC(4.2, 1.15).z);
  planter(alongC(9.0, 0.6).x, alongC(9.0, 0.6).z);

  // ================= putting green (inside chamfer, west of equipment) =================
  const g1 = cyl(1, 1, 0.045, M.fringe, -9.4, 0.024, -10.3); g1.scale.set(3.6, 1, 2.6);
  const g1b = cyl(1, 1, 0.045, M.fringe, -7.4, 0.023, -9.2); g1b.scale.set(2.0, 1, 1.6);
  const g2 = cyl(1, 1, 0.05, M.green, -9.4, 0.03, -10.3); g2.scale.set(3.15, 1, 2.2);
  const g2b = cyl(1, 1, 0.05, M.green, -7.5, 0.029, -9.2); g2b.scale.set(1.7, 1, 1.35);
  [[-10.6, -10.9], [-8.4, -10.1], [-7.2, -9.0]].forEach(p => {
    cyl(0.02, 0.02, 1.35, M.brass, p[0], 0.7, p[1], 8);
    box(0.42, 0.26, 0.015, M.glowSoft, p[0] + 0.21, 1.24, p[1]);
    cyl(0.055, 0.055, 0.012, M.charc, p[0], 0.055, p[1], 16);
  });
  [[-9.9, -9.6], [-8.9, -10.8], [-10.2, -10.2]].forEach(p => cyl(0.042, 0.042, 0.084, M.cream, p[0], 0.05, p[1], 10));
  [[-11.2, -11.6], [-6.7, -8.2], [-8.3, -11.9]].forEach(p => {
    cyl(0.02, 0.02, 0.32, M.brass, p[0], 0.16, p[1], 8);
    sphere(0.035, M.glowSoft, p[0], 0.34, p[1]);
  });

  // ================= equipment / retail display (spiral column) =================
  cyl(0.5, 0.5, 3.4, M.creamDim, -3.2, 1.7, -13.2, 32);
  for (let i = 0; i < 10; i++) {
    const a = i * 0.75, y = 0.5 + i * 0.26;
    box(0.55, 0.05, 0.3, M.brass, -3.2 + Math.cos(a) * 0.72, y, -13.2 + Math.sin(a) * 0.72, -a);
    sphere(0.05, M.cream, -3.2 + Math.cos(a) * 0.72, y + 0.09, -13.2 + Math.sin(a) * 0.72);
  }
  box(2.6, 0.9, 0.6, M.charc, -4.2, 0.45, -11.6);
  box(2.7, 0.05, 0.7, M.stoneTop, -4.2, 0.93, -11.6);
  box(2.5, 0.03, 0.5, M.glowSoft, -4.2, 0.96, -11.6);

  // ================= golf sim bays (4 bays x 1.2..14.8 along N wall) =================
  const roundTopRect = (cx, w, h, r) => {
    const p = new THREE.Path();
    p.moveTo(cx - w / 2, 0.001);
    p.lineTo(cx - w / 2, h - r);
    p.quadraticCurveTo(cx - w / 2, h, cx - w / 2 + r, h);
    p.lineTo(cx + w / 2 - r, h);
    p.quadraticCurveTo(cx + w / 2, h, cx + w / 2, h - r);
    p.lineTo(cx + w / 2, 0.001);
    p.closePath();
    return p;
  };
  const bays = [2.9, 6.3, 9.7, 13.1];
  const wallShape = new THREE.Shape();
  wallShape.moveTo(1.0, 0); wallShape.lineTo(15.0, 0); wallShape.lineTo(15.0, H); wallShape.lineTo(1.0, H); wallShape.closePath();
  bays.forEach(cx => wallShape.holes.push(roundTopRect(cx, 2.7, 2.7, 0.58)));
  const portal = new THREE.Mesh(new THREE.ExtrudeGeometry(wallShape, { depth: 0.34, bevelEnabled: false }), M.cream);
  portal.position.set(0, 0, -11.56); scene.add(portal);
  box(1.1, H, 0.34, M.cream, 0.5, H / 2, -11.39); // filler west of portal wall

  const screenM = M.screen;
  bays.forEach(cx => {
    const fs = new THREE.Shape();
    const o = roundTopRect(0, 2.94, 2.82, 0.66); fs.curves = o.curves; fs.holes.push(roundTopRect(0, 2.74, 2.72, 0.59));
    const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: 0.025, bevelEnabled: false }), M.glowSoft);
    frame.position.set(cx, 0, -11.2); scene.add(frame);
    box(0.14, 3.2, 3.5, M.charc, cx - 1.62, 1.6, -13.1);
    box(0.14, 3.2, 3.5, M.charc, cx + 1.62, 1.6, -13.1);
    box(3.2, 0.14, 3.5, M.charc, cx, 3.05, -13.1);
    plane(3.0, 2.2, screenM, cx, 1.42, -14.6);
    box(3.15, 2.36, 0.04, M.black, cx, 1.42, -14.64);
    box(3.0, 0.05, 3.1, M.turf, cx, 0.026, -13.05);
    box(1.0, 0.03, 0.95, M.green, cx + 0.45, 0.055, -12.5);
    cyl(0.14, 0.11, 0.7, M.leather, cx - 1.28, 0.35, -13.5, 14);
    const c1 = box(0.02, 0.5, 0.02, M.brass, cx - 1.32, 0.88, -13.52); c1.rotation.z = 0.12;
    const c2 = box(0.02, 0.46, 0.02, M.brass, cx - 1.25, 0.86, -13.48); c2.rotation.z = -0.1;
    [[0.2, -12.3], [0.32, -12.45]].forEach(o2 => sphere(0.028, M.cream, cx + o2[0], 0.08, o2[1]));
    box(0.05, 0.7, 0.05, M.glow, cx + 1.72, 1.9, -11.15);
  });
  box(0.05, 0.7, 0.05, M.glow, 1.2, 1.9, -11.15);
  box(14.6, 0.14, 3.4, M.cream, 8, 3.42, -9.7);
  box(14.7, 0.05, 0.06, M.glow, 8, 3.34, -8.0);
  box(14.7, 0.05, 0.06, M.glow, 8, 3.34, -11.4);
  plane(6.4, 1.0, logoM, 8, 3.05, -11.15);

  // booth clusters facing the bays
  [4.4, 8.2, 12.0].forEach(bx => {
    const sofa = torus(1.05, 0.27, Math.PI, M.boucle, bx, 0.4, -9.35); sofa.rotation.z = Math.PI;
    cyl(0.5, 0.45, 0.055, M.marble, bx, 0.72, -9.65);
    cyl(0.07, 0.07, 0.7, M.brass, bx, 0.35, -9.65, 12);
    candle(bx, 0.775, -9.65);
    for (let i = 0; i <= 13; i++) {
      const a = 0.25 + (i / 13) * (Math.PI - 0.5);
      box(0.05, 0.92, 0.05, M.fluteGold, bx + Math.cos(a) * 1.42, 0.46, -9.35 + Math.sin(a) * 0.92);
    }
    const cap = torus(1.42, 0.022, Math.PI - 0.5, M.brass, bx, 0.94, -9.35, Math.PI + 0.25);
    cap.scale.set(1, 1, 0.648);
    cyl(0.2, 0.17, 0.46, M.boucle, bx - 1.0, 0.23, -10.4, 18);
    cyl(0.2, 0.17, 0.46, M.boucle, bx + 1.0, 0.23, -10.4, 18);
  });

  // ================= VIP compartments ×2 (NE corner) =================
  const vipRooms = [{ z0: -14.55, z1: -10.75 }, { z0: -10.55, z1: -6.75 }];
  box(0.1, 3.25, 7.9, M.glass, 14.2, 1.62, -10.65);
  [-14.55, -10.65, -6.75].forEach(z => box(0.09, 3.25, 0.09, M.brass, 14.2, 1.62, z));
  box(0.09, 0.09, 7.9, M.brass, 14.2, 3.26, -10.65);
  box(6.5, 3.25, 0.12, M.charc, 17.45, 1.62, -10.65); // divider between the two rooms
  vipRooms.forEach((r, ri) => {
    const zc = (r.z0 + r.z1) / 2;
    box(6.3, 0.12, 3.8, M.black, 17.45, 3.28, zc);
    plane(3.2, 2.1, screenM, 20.55, 1.42, zc, -Math.PI / 2);
    box(0.04, 2.26, 3.36, M.black, 20.62, 1.42, zc);
    box(2.6, 0.05, 2.6, M.turf, 18.6, 0.026, zc);
    box(0.9, 0.45, 2.6, M.olive, 15.1, 0.32, zc);
    box(0.22, 0.5, 2.6, M.olive, 14.75, 0.72, zc);
    cyl(0.42, 0.38, 0.05, M.marble, 16.2, 0.72, zc, 26);
    cyl(0.05, 0.05, 0.7, M.brass, 16.2, 0.36, zc, 12);
    candle(16.2, 0.77, zc);
    pendantCone(17.4, 2.5, zc);
    const vt = makeTex(THREE, 256, 64, (g) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, 256, 64); g.fillStyle = '#e8c887'; g.font = '600 34px Georgia'; g.textAlign = 'center'; g.fillText('VIP ' + (ri + 1), 128, 44); });
    plane(1.1, 0.3, new THREE.MeshStandardMaterial({ map: vt, transparent: true, emissive: 0xffd9a0, emissiveMap: vt, emissiveIntensity: 1.2 }), 14.32, 2.6, zc, Math.PI / 2);
  });

  // ================= central bar (long capsule, double-sided) =================
  const bX = 0.3, bZ = -2.2, bL = 7.6, bR = 1.55; // straight length & end radius
  box(bL, 1.08, bR * 2, M.fluteGold, bX, 0.54, bZ);
  cyl(bR, bR, 1.08, M.fluteGold, bX - bL / 2, 0.54, bZ, 40);
  cyl(bR, bR, 1.08, M.fluteGold, bX + bL / 2, 0.54, bZ, 40);
  box(bL, 0.08, bR * 2 + 0.4, M.marble, bX, 1.16, bZ);
  cyl(bR + 0.2, bR + 0.2, 0.08, M.marble, bX - bL / 2, 1.16, bZ, 40);
  cyl(bR + 0.2, bR + 0.2, 0.08, M.marble, bX + bL / 2, 1.16, bZ, 40);
  box(bL, 0.05, bR * 2 + 0.25, M.glow, bX, 0.05, bZ);
  cyl(bR + 0.12, bR + 0.12, 0.05, M.glow, bX - bL / 2, 0.05, bZ, 40);
  cyl(bR + 0.12, bR + 0.12, 0.05, M.glow, bX + bL / 2, 0.05, bZ, 40);
  // TV lift block mid-counter
  box(1.5, 1.15, 0.7, M.black, bX, 1.73, bZ);
  plane(1.3, 0.72, M.band, bX, 1.78, bZ + 0.36);
  plane(1.3, 0.72, M.band, bX, 1.78, bZ - 0.36, Math.PI);
  box(1.6, 0.05, 0.8, M.brass, bX, 2.33, bZ);
  // suspended screen band above the counter
  box(9.8, 0.8, 0.5, M.black, bX, 2.98, bZ);
  plane(9.6, 0.68, M.band, bX, 2.98, bZ + 0.26);
  plane(9.6, 0.68, M.band, bX, 2.98, bZ - 0.26, Math.PI);
  box(9.9, 0.06, 0.56, M.brass, bX, 3.41, bZ);
  box(9.9, 0.06, 0.56, M.brass, bX, 2.55, bZ);
  box(9.9, 0.035, 0.5, M.glow, bX, 2.51, bZ);
  [-4, -1.5, 1.5, 4].forEach(o => cyl(0.012, 0.012, 0.36, M.black, bX + o, 3.6, bZ, 6));
  // member cabinet backbar (north of bar)
  box(5.2, 2.5, 0.7, M.black, bX, 1.25, -5.0);
  box(5.35, 0.06, 0.8, M.brass, bX, 2.53, -5.0);
  for (let s = 0; s < 3; s++) {
    const y = 1.15 + s * 0.42;
    box(4.9, 0.035, 0.62, M.glowSoft, bX, y, -5.0);
    for (let b = 0; b < 12; b++) cyl(0.042, 0.042, 0.27, M.amber, bX - 2.25 + b * 0.41, y + 0.16, -4.75, 8);
  }
  const mcT = makeTex(THREE, 512, 64, (g) => { g.clearRect(0, 0, 512, 64); g.fillStyle = '#b99a5f'; g.font = '500 30px Georgia'; g.textAlign = 'center'; g.fillText('MEMBER CABINET · 会员柜', 256, 42); });
  plane(2.9, 0.32, new THREE.MeshStandardMaterial({ map: mcT, transparent: true, emissive: 0xffd9a0, emissiveMap: mcT, emissiveIntensity: 1.0 }), bX, 2.78, -4.95);
  // stools both long sides + ends
  for (let i = 0; i < 6; i++) {
    const sx = bX - 3.6 + i * 1.45;
    [[sx, bZ - 2.35, Math.PI / 2], [sx, bZ + 2.35, -Math.PI / 2]].forEach(sp => {
      cyl(0.03, 0.03, 0.72, M.brass, sp[0], 0.36, sp[1], 10);
      torus(0.17, 0.02, Math.PI * 2, M.brass, sp[0], 0.28, sp[1]);
      cyl(0.21, 0.21, 0.1, i % 2 ? M.leather : M.olive, sp[0], 0.78, sp[1], 22);
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.34, 20, 1, true, 0, Math.PI * 0.85), i % 2 ? M.leather : M.olive);
      const aOut = sp[2] > 0 ? -Math.PI / 2 : Math.PI / 2; // outward from bar
      back.position.set(sp[0], 1.0, sp[1] + (sp[1] > bZ ? 0.16 : -0.16));
      back.rotation.y = 0.233 - (sp[1] > bZ ? Math.PI / 2 : -Math.PI / 2);
      scene.add(back);
    });
  }
  [[bX - bL / 2 - 2.15, bZ], [bX + bL / 2 + 2.15, bZ]].forEach((sp, si) => {
    cyl(0.03, 0.03, 0.72, M.brass, sp[0], 0.36, sp[1], 10);
    cyl(0.21, 0.21, 0.1, M.olive, sp[0], 0.78, sp[1], 22);
  });
  for (let i = 0; i < 5; i++) cyl(0.045, 0.035, 0.14, M.glass, bX - 3 + i * 1.5, 1.27, bZ + 0.9, 12);
  pendantCone(bX - 3.4, 2.6, bZ); pendantCone(bX + 3.4, 2.6, bZ);
  // glossy canopy above bar
  box(11.5, 0.1, 5.4, M.mirror, bX, 3.62, bZ - 0.6);
  box(11.6, 0.035, 0.06, M.glow, bX, 3.56, bZ - 3.26);
  box(11.6, 0.035, 0.06, M.glow, bX, 3.56, bZ + 2.06);
  box(0.06, 0.035, 5.35, M.glow, bX - 5.77, 3.56, bZ - 0.6);
  box(0.06, 0.035, 5.35, M.glow, bX + 5.77, 3.56, bZ - 0.6);

  // ================= stair + ADA lift core (center-west) =================
  box(3.0, H, 0.18, M.boh, -7.3, H / 2, -2.5);
  box(3.0, H, 0.18, M.boh, -7.3, H / 2, 3.5);
  box(0.18, H, 6.2, M.boh, -5.8, H / 2, 0.5);
  box(0.18, H, 6.2, M.fluteOlive, -8.8, H / 2, 0.5);
  // brass lift doors on the east face
  box(0.06, 2.2, 0.85, M.brass, -5.7, 1.1, 1.9);
  box(0.06, 2.2, 0.02, M.glowSoft, -5.68, 1.1, 1.9);
  const liftT = makeTex(THREE, 256, 64, (g) => { g.clearRect(0, 0, 256, 64); g.fillStyle = '#b3aa99'; g.font = '500 26px Georgia'; g.textAlign = 'center'; g.fillText('LIFT · 楼梯', 128, 42); });
  plane(1.1, 0.28, new THREE.MeshStandardMaterial({ map: liftT, transparent: true, emissive: 0xffe3b8, emissiveMap: liftT, emissiveIntensity: 0.8 }), -5.69, 2.5, 1.0, Math.PI / 2);

  // ================= dart area (west face of the core) =================
  for (let i = 0; i < 3; i++) {
    const z = 0.0 + i * 1.5 - 1.0;
    box(0.07, 1.35, 0.9, M.black, -8.9, 1.62, z);
    const board = cyl(0.24, 0.24, 0.06, M.felt, 0, 0, 0, 24);
    board.rotation.z = Math.PI / 2; board.position.set(-8.95, 1.66, z);
    torus(0.25, 0.018, Math.PI * 2, M.brass, -8.95, 1.66, z).rotation.set(0, Math.PI / 2, 0);
    box(0.05, 0.05, 0.8, M.glow, -10.7, 0.03, z);
    box(0.04, 0.9, 0.04, M.glow, -8.88, 2.65, z);
    plane(0.62, 0.36, M.band, -8.9, 2.62, z, -Math.PI / 2);
  }
  [[-11.1, 1.2], [-11.1, -1.1]].forEach(p => {
    cyl(0.3, 0.25, 1.04, M.black, p[0], 0.52, p[1], 20);
    cyl(0.4, 0.4, 0.045, M.marble, p[0], 1.06, p[1], 26);
    candle(p[0], 1.11, p[1]);
  });

  // ================= seating & performance area (west) =================
  [[-17.8, -4.6], [-15.6, -2.6], [-18.2, -1.4], [-15.9, -5.9], [-12.4, -4.4], [-11.6, -1.8]].forEach((p, pi) =>
    roundTable(p[0], p[1], 0.52, 3, M.boucle));
  // small performance platform in the SW corner of the zone
  box(2.6, 0.28, 1.9, M.black, -19.2, 0.14, -6.9, 0.5);
  box(2.7, 0.03, 2.0, M.brass, -19.2, 0.3, -6.9, 0.5);
  cyl(0.025, 0.025, 1.5, M.brass, -19.0, 1.06, -6.7, 10);
  sphere(0.05, M.black, -19.0, 1.84, -6.7);
  const wdg = box(0.34, 0.16, 0.24, M.black, -18.3, 0.42, -6.3); wdg.rotation.y = 0.6; wdg.rotation.x = -0.28;
  pendantCone(-19.2, 2.7, -6.9);
  planter(-20.1, -8.2);

  // ================= sunken lounge + stage (far west, rows C-D) =================
  box(7.0, 0.05, 5.8, M.carpet, -16.7, 0.028, 2.2);
  box(7.3, 0.025, 0.1, M.brass, -16.7, 0.168, -0.72);
  box(7.3, 0.025, 0.1, M.brass, -16.7, 0.168, 5.12);
  box(0.1, 0.025, 5.94, M.brass, -20.32, 0.168, 2.2);
  box(0.1, 0.025, 5.94, M.brass, -13.08, 0.168, 2.2);
  box(7.32, 0.03, 0.06, M.glow, -16.7, 0.185, -0.6);
  box(7.32, 0.03, 0.06, M.glow, -16.7, 0.185, 5.0);
  box(0.06, 0.03, 5.8, M.glow, -13.2, 0.185, 2.2);
  cyl(1.55, 1.65, 0.34, M.black, -16.7, 0.22, 2.2, 48);
  cyl(1.67, 1.67, 0.03, M.glow, -16.7, 0.07, 2.2, 48);
  cyl(1.58, 1.58, 0.03, M.brass, -16.7, 0.4, 2.2, 48);
  cyl(0.025, 0.025, 1.5, M.brass, -17.2, 1.14, 1.9, 10);
  sphere(0.05, M.black, -17.2, 1.92, 1.9);
  const w1 = box(0.34, 0.16, 0.24, M.black, -16.0, 0.46, 1.5); w1.rotation.y = 0.5; w1.rotation.x = -0.28;
  const s1 = torus(2.7, 0.42, 4.4, M.olive, -16.7, 0.48, 2.2); s1.rotation.z = 2.0;
  const s2 = torus(2.7, 0.29, 4.4, M.olive, -16.7, 0.8, 2.2); s2.rotation.z = 2.0; s2.scale.set(1.09, 1, 1.09);
  [[-14.6, 0.6], [-18.8, 3.8], [-14.9, 3.9]].forEach(p => { cyl(0.32, 0.28, 0.5, M.marble, p[0], 0.29, p[1], 24); candle(p[0], 0.57, p[1]); });
  torus(3.4, 0.04, Math.PI * 2, M.glow, -16.7, 3.32, 2.2);
  cyl(3.4, 3.4, 0.06, M.mirror, -16.7, 3.42, 2.2, 48);
  // olive flute wall + logo behind (west wall)
  box(0.12, 3.4, 6.4, M.fluteOlive, -20.62, 1.7, 2.2);
  [0.2, 2.2, 4.2].forEach(z => box(0.03, 2.7, 0.035, M.glow, -20.53, 1.7, z));
  plane(3.2, 0.5, logoM, -20.5, 2.6, 2.2, Math.PI / 2);

  // ================= booths row + partition (row C, backs to billiards) =================
  box(15.5, 2.5, 0.14, M.fluteOlive, -6.9, 1.25, 6.95);
  box(15.6, 0.06, 0.2, M.brass, -6.9, 2.53, 6.95);
  box(15.6, 0.04, 0.05, M.glow, -6.9, 2.44, 6.87);
  for (let i = 0; i < 5; i++) {
    const bx2 = -13.4 + i * 3.1;
    const b = torus(1.25, 0.34, Math.PI, M.boucle, bx2, 0.5, 6.35); b.rotation.z = Math.PI;
    const bb = torus(1.25, 0.22, Math.PI, M.boucle, bx2, 0.82, 6.35); bb.rotation.z = Math.PI; bb.scale.set(1.08, 1, 1.08);
    cyl(0.47, 0.42, 0.05, M.marble, bx2, 0.7, 6.1);
    cyl(0.05, 0.05, 0.68, M.black, bx2, 0.34, 6.1, 12);
    candle(bx2, 0.755, 6.1);
    cyl(0.2, 0.17, 0.44, M.olive, bx2 - 0.95, 0.22, 5.3, 18);
    cyl(0.2, 0.17, 0.44, M.olive, bx2 + 0.95, 0.22, 5.3, 18);
  }

  // ================= dining lounge (center-east) + pick-up window =================
  [[4.6, 1.6], [7.6, 0.8], [10.4, 1.8], [6.2, 3.8], [9.4, 4.0]].forEach(p => roundTable(p[0], p[1], 0.5, 3, M.olive));
  const db = torus(1.3, 0.34, Math.PI, M.boucle, 12.6, 0.5, 3.4); db.rotation.z = Math.PI / 2;
  cyl(0.47, 0.42, 0.05, M.marble, 12.2, 0.7, 3.4); cyl(0.05, 0.05, 0.68, M.black, 12.2, 0.34, 3.4, 12);
  box(2.2, 0.02, 4.4, M.carpet, 7.5, 0.012, 2.4);
  // pick-up window on kitchen north wall
  box(1.9, 1.1, 0.16, M.black, 9.6, 1.62, 6.05);
  box(2.0, 0.06, 0.3, M.stoneTop, 9.6, 1.1, 6.0);
  box(1.7, 0.03, 0.2, M.glowSoft, 9.6, 2.2, 6.0);
  const puT = makeTex(THREE, 256, 48, (g) => { g.clearRect(0, 0, 256, 48); g.fillStyle = '#b3aa99'; g.font = '500 22px Georgia'; g.textAlign = 'center'; g.fillText('PICK-UP · 出餐口', 128, 32); });
  plane(1.5, 0.24, new THREE.MeshStandardMaterial({ map: puT, transparent: true, emissive: 0xffe3b8, emissiveMap: puT, emissiveIntensity: 0.9 }), 9.6, 2.5, 5.95, Math.PI);

  // ================= WC + kitchen blocks (south-center / south-east) =================
  box(4.8, 3.3, 0.16, M.creamDim, 4.6, 1.65, 6.6);
  box(0.16, 3.3, 5.4, M.creamDim, 2.2, 1.65, 9.3);
  box(0.16, 3.3, 5.4, M.creamDim, 7.0, 1.65, 9.3);
  const wcT = makeTex(THREE, 256, 48, (g) => { g.clearRect(0, 0, 256, 48); g.fillStyle = '#b3aa99'; g.font = '500 24px Georgia'; g.textAlign = 'center'; g.fillText('WC · 洗手间', 128, 33); });
  plane(1.4, 0.26, new THREE.MeshStandardMaterial({ map: wcT, transparent: true, emissive: 0xffe3b8, emissiveMap: wcT, emissiveIntensity: 0.8 }), 4.6, 2.4, 6.5, Math.PI);
  box(0.9, 2.2, 0.06, M.charc, 3.4, 1.1, 6.58); box(0.9, 2.2, 0.06, M.charc, 5.8, 1.1, 6.58);
  box(6.5, 3.3, 0.16, M.boh, 10.3, 1.65, 6.05);
  box(0.16, 3.3, 8.6, M.boh, 13.55, 1.65, 10.35);
  const kT = makeTex(THREE, 256, 48, (g) => { g.clearRect(0, 0, 256, 48); g.fillStyle = '#8a8172'; g.font = '500 22px Georgia'; g.textAlign = 'center'; g.fillText('PREP KITCHEN', 128, 32); });
  plane(1.5, 0.24, new THREE.MeshStandardMaterial({ map: kT, transparent: true, emissive: 0xffe3b8, emissiveMap: kT, emissiveIntensity: 0.6 }), 12.2, 2.4, 5.97, Math.PI);

  // ================= east service blocks =================
  box(10.6, H, 0.16, M.boh, 15.4, H / 2, -5.5);   // fire egress corridor south wall
  box(10.6, H, 0.16, M.charc, 15.4, H / 2, -3.9); // its north wall (hall side)
  box(0.16, H, 5.0, M.boh, 13.6, H / 2, -1.4);
  box(7.0, H, 0.16, M.boh, 17.2, H / 2, 1.1);
  box(3.6, H, 0.16, M.boh, 18.9, H / 2, 11.5);
  const svT = makeTex(THREE, 256, 48, (g) => { g.clearRect(0, 0, 256, 48); g.fillStyle = '#8a8172'; g.font = '500 20px Georgia'; g.textAlign = 'center'; g.fillText('STAIR · WC · CLEANING', 128, 31); });
  plane(2.0, 0.24, new THREE.MeshStandardMaterial({ map: svT, transparent: true, emissive: 0xffe3b8, emissiveMap: svT, emissiveIntensity: 0.6 }), 13.7, 2.4, -1.4, -Math.PI / 2);

  // ================= billiards (south-west, 8 tables) =================
  box(19.6, 0.024, 7.0, M.carpet, -10.2, 0.013, 10.9);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const tx = -16.9 + c * 4.6, tz = 9.2 + r * 3.5;
    box(2.75, 0.52, 1.5, M.black, tx, 0.52, tz);
    box(2.55, 0.1, 1.3, M.felt, tx, 0.83, tz);
    box(2.95, 0.09, 1.7, M.black, tx, 0.92, tz);
    box(2.97, 0.03, 0.06, M.brass, tx, 0.975, tz - 0.83);
    box(2.97, 0.03, 0.06, M.brass, tx, 0.975, tz + 0.83);
    box(0.06, 0.03, 1.68, M.brass, tx - 1.46, 0.975, tz);
    box(0.06, 0.03, 1.68, M.brass, tx + 1.46, 0.975, tz);
    [[-1.2, -0.58], [1.2, -0.58], [-1.2, 0.58], [1.2, 0.58]].forEach(o => sphere(0.055, M.black, tx + o[0], 0.9, tz + o[1]));
    [[-0.5, 0, M.cream], [0.45, 0.15, M.amber], [0.6, 0.05, M.felt], [0.52, -0.12, M.leather]].forEach(o => sphere(0.04, o[2], tx + o[0], 0.92, tz + o[1]));
    if (c === 1 && r === 0) { const cue = cyl(0.012, 0.012, 1.5, M.leather, tx - 0.3, 0.9, tz + 0.25, 8); cue.rotation.z = Math.PI / 2; cue.rotation.y = 0.35; }
    box(1.5, 0.07, 0.24, M.brass, tx, 2.02, tz);
    box(1.35, 0.035, 0.15, M.glowSoft, tx, 1.97, tz);
    cyl(0.012, 0.012, 1.7, M.black, tx, 2.9, tz, 6);
    // wall-hung TV for this table on the booth partition (north side of billiards)
    if (tx > -15.5 && tx < 0) plane(1.05, 0.6, M.band, tx, 1.95, 7.03);
  }
  // banquette along the south storefront
  [[-16.5], [-11.9], [-7.3]].forEach(p => {
    box(3.4, 0.42, 0.8, M.olive, p[0], 0.30, 13.9);
    box(3.4, 0.55, 0.22, M.olive, p[0], 0.75, 14.25);
    box(0.5, 0.11, 0.45, M.leather, p[0] - 0.9, 0.56, 13.9);
    box(0.5, 0.11, 0.45, M.boucle, p[0] + 0.9, 0.56, 13.9);
  });
  [[-14.2, 12.6], [-5.9, 12.4]].forEach(p => {
    const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.62, 22, 1, true, 0, Math.PI * 1.3), M.leather);
    tub.position.set(p[0], 0.44, p[1]); tub.rotation.y = Math.PI + 0.4; scene.add(tub);
    cyl(0.36, 0.32, 0.3, M.leather, p[0], 0.28, p[1], 20);
  });
  cyl(0.3, 0.26, 0.48, M.marble, -13.5, 0.42, 12.9, 22); candle(-13.5, 0.69, 12.9);
  // mirrored raft + brass trim over billiards
  box(19.2, 0.1, 6.6, M.mirror, -10.2, 3.56, 10.9);
  box(19.3, 0.035, 0.06, M.glow, -10.2, 3.47, 7.65);
  box(19.3, 0.035, 0.06, M.glow, -10.2, 3.47, 14.15);
  box(0.06, 0.035, 6.55, M.glow, -19.78, 3.47, 10.9);
  box(0.06, 0.035, 6.55, M.glow, -0.62, 3.47, 10.9);
  // storefront: columns + night glass along the south wall
  [-14.0, -7.1, -0.4].forEach(x => box(0.55, H, 0.55, M.creamDim, x, H / 2, 14.45));
  [[-17.35, 6.3], [-10.55, 6.3], [-3.75, 6.3], [6.8, 13.2]].forEach(p => {
    plane(p[1] - 0.7, 2.3, M.night, p[0], 1.85, 14.68, Math.PI);
    box(p[1] - 0.7, 0.06, 0.06, M.brass, p[0], 3.05, 14.62);
    box(p[1] - 0.7, 0.1, 0.08, M.black, p[0], 0.62, 14.62);
  });
  // framed art on booth partition west end / west wall
  [[-20.58, 8.6, Math.PI / 2], [-20.58, 11.6, Math.PI / 2]].forEach(p => {
    plane(0.95, 1.25, M.brass, p[0], 1.95, p[1], p[2]);
    plane(0.84, 1.14, M.black, p[0] + 0.012, 1.95, p[1], p[2]);
  });

  // ================= ceiling downlights along walkways =================
  for (let x = -12; x <= 12; x += 2.6) cyl(0.06, 0.06, 0.03, M.glowSoft, x, 3.77, 5.7, 12);
  for (let x = -10; x <= 12; x += 2.6) cyl(0.06, 0.06, 0.03, M.glowSoft, x, 3.77, -6.6, 12);
  for (let z = -4; z <= 4; z += 2.0) cyl(0.06, 0.06, 0.03, M.glowSoft, -10.2, 3.77, z, 12);
  for (let z = -4; z <= 4; z += 2.0) cyl(0.06, 0.06, 0.03, M.glowSoft, 12.6, 3.77, z, 12);

  // ================= lights =================
  scene.add(new THREE.HemisphereLight(0xffe4bd, 0x14100c, 0.65));
  scene.add(new THREE.AmbientLight(0x8a7a64, 0.3));
  const pt = (x, y, z, i, d, col) => { const L = new THREE.PointLight(col || 0xffd9a0, i, d, 2); L.position.set(x, y, z); scene.add(L); };
  pt(0.3, 3.3, -2.2, 120, 20);      // bar
  pt(-16.7, 3.1, 2.2, 60, 13);      // sunken lounge
  pt(-9.4, 3.0, -10.3, 45, 11);     // putting
  pt(4.5, 3.2, -9.8, 55, 12);       // promenade W
  pt(11.5, 3.2, -9.8, 55, 12);      // promenade E
  pt(8, 3.2, -13.2, 40, 11);        // bays inner
  pt(17.4, 2.9, -12.6, 30, 8);      // VIP 1
  pt(17.4, 2.9, -8.6, 30, 8);       // VIP 2
  pt(-9.8, 3.0, 2.2, 26, 8);        // dart
  pt(7.5, 3.2, 2.4, 55, 13);        // dining
  pt(-6.9, 3.1, 5.9, 45, 12);       // booths row
  pt(-14.6, 2.9, 10.6, 70, 13, 0xffe9c8); // billiards W
  pt(-5.8, 2.9, 10.6, 65, 12, 0xffe9c8);  // billiards E
  pt(-13.2, 3.1, -8.6, 55, 12);     // entrance
  pt(-16.4, 3.1, -4.2, 50, 12);     // performance/seating
  pt(-11.9, 3.1, -3.4, 40, 10);     // seating east
  pt(9.6, 2.9, 6.9, 22, 7);         // pick-up
}

function BackspinScene(props) {
  const hostRef = React.useRef(null);
  const apiRef = React.useRef(null);
  const [idx, setIdx] = React.useState(0);
  const [busy, setBusy] = React.useState(true);
  const autoTour = props.autoTour ?? false;
  const exposure = props.exposure ?? 1.35;

  React.useEffect(() => {
    let dead = false, raf = 0, renderer, ro;
    (async () => {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
      if (dead || !hostRef.current) return;
      const host = hostRef.current; host.innerHTML = '';
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b0a08);
      scene.fog = new THREE.FogExp2(0x0b0a08, 0.013);
      const cam = new THREE.PerspectiveCamera(70, 1, 0.1, 120);
      cam.rotation.order = 'YXZ';
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = exposure;
      host.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;cursor:grab';
      buildScene(THREE, scene);

      const st = { pos: new THREE.Vector3(), yaw: 0, pitch: 0, t: 1, from: null, to: null };
      const angFor = (p, l) => {
        const d = new THREE.Vector3(l[0] - p[0], l[1] - p[1], l[2] - p[2]).normalize();
        return { yaw: Math.atan2(-d.x, -d.z), pitch: Math.asin(THREE.MathUtils.clamp(d.y, -1, 1)) };
      };
      const jump = (i, instant) => {
        const s = STOPS[i]; const a = angFor(s.pos, s.look);
        if (instant) { st.pos.set(...s.pos); st.yaw = a.yaw; st.pitch = a.pitch; st.t = 1; return; }
        let dy = a.yaw - st.yaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
        st.from = { pos: st.pos.clone(), yaw: st.yaw, pitch: st.pitch };
        st.to = { pos: new THREE.Vector3(...s.pos), yaw: st.yaw + dy, pitch: a.pitch };
        st.t = 0;
      };
      jump(0, true);
      apiRef.current = { goTo: (i) => jump(i, false), setExposure: (e) => { renderer.toneMappingExposure = e; } };

      let drag = null;
      const el = renderer.domElement;
      el.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; });
      el.addEventListener('pointermove', (e) => {
        if (!drag || st.t < 1) return;
        st.yaw += (e.clientX - drag.x) * 0.0042;
        st.pitch = THREE.MathUtils.clamp(st.pitch + (e.clientY - drag.y) * 0.0042, -1.15, 1.15);
        drag = { x: e.clientX, y: e.clientY };
      });
      el.addEventListener('pointerup', () => { drag = null; el.style.cursor = 'grab'; });

      const fit = () => {
        const w = host.clientWidth || 800, h = host.clientHeight || 500;
        renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix();
      };
      ro = new ResizeObserver(fit); ro.observe(host); fit();

      const clock = new THREE.Clock();
      const tick = () => {
        if (dead) return;
        const dt = clock.getDelta();
        if (st.t < 1 && st.to) {
          st.t = Math.min(1, st.t + dt / 1.8);
          const k = st.t < 0.5 ? 2 * st.t * st.t : 1 - Math.pow(-2 * st.t + 2, 2) / 2;
          st.pos.lerpVectors(st.from.pos, st.to.pos, k);
          st.yaw = st.from.yaw + (st.to.yaw - st.from.yaw) * k;
          st.pitch = st.from.pitch + (st.to.pitch - st.from.pitch) * k;
        }
        cam.position.copy(st.pos);
        cam.rotation.set(st.pitch, st.yaw, 0);
        renderer.render(scene, cam);
        raf = requestAnimationFrame(tick);
      };
      tick();
      setBusy(false);
    })();
    return () => { dead = true; cancelAnimationFrame(raf); ro && ro.disconnect(); renderer && renderer.dispose(); };
  }, []);

  React.useEffect(() => { apiRef.current && apiRef.current.goTo(idx); }, [idx]);
  React.useEffect(() => { apiRef.current && apiRef.current.setExposure(exposure); }, [exposure]);
  React.useEffect(() => {
    if (!autoTour) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % STOPS.length), 7000);
    return () => clearInterval(iv);
  }, [autoTour]);

  const s = STOPS[idx];
  const btn = {
    background: 'rgba(20,18,15,.82)', color: '#e8c887', border: '1px solid #4a4234',
    borderRadius: 999, width: 44, height: 44, fontSize: 20, cursor: 'pointer', flex: 'none',
  };
  return React.createElement('div', { style: { position: 'relative', width: '100%', height: '100%', background: '#0b0a08', fontFamily: "'Noto Serif SC',serif", overflow: 'hidden' } },
    React.createElement('div', { ref: hostRef, style: { position: 'absolute', inset: 0 } }),
    busy && React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9d9484', fontSize: 15 } }, '正在加载 3D 场景…'),
    React.createElement('div', { style: { position: 'absolute', top: 20, left: 24, pointerEvents: 'none' } },
      React.createElement('div', { style: { letterSpacing: '.3em', fontSize: 11, color: '#b99a5f', fontFamily: 'Georgia,serif' } }, 'BACKSPIN ARCADE · 2F'),
      React.createElement('div', { style: { fontSize: 24, fontWeight: 700, color: '#ece5d8', marginTop: 4 } }, s.zh),
      React.createElement('div', { style: { fontSize: 11, letterSpacing: '.2em', color: '#9d9484', fontFamily: 'Georgia,serif', marginTop: 2 } }, s.en)),
    React.createElement('div', { style: { position: 'absolute', top: 22, right: 24, color: '#8a8172', fontSize: 12, pointerEvents: 'none' } }, '拖拽环视 · 点击站点跳转'),
    React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 18px', display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(transparent,rgba(10,9,7,.9))' } },
      React.createElement('button', { style: btn, onClick: () => setIdx((idx + STOPS.length - 1) % STOPS.length) }, '‹'),
      React.createElement('div', { style: { display: 'flex', gap: 8, overflowX: 'auto', flex: 1, padding: '4px 2px', scrollbarWidth: 'none' } },
        STOPS.map((p, i) => React.createElement('button', {
          key: i, onClick: () => setIdx(i),
          style: {
            flex: 'none', padding: '9px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 13,
            fontFamily: "'Noto Serif SC',serif",
            background: i === idx ? '#b99a5f' : 'rgba(28,25,20,.85)',
            color: i === idx ? '#171410' : '#cfc5b2',
            border: i === idx ? '1px solid #d8bc82' : '1px solid #3a352c',
          },
        }, (i + 1).toString().padStart(2, '0') + ' ' + p.zh))),
      React.createElement('button', { style: btn, onClick: () => setIdx((idx + 1) % STOPS.length) }, '›')));
}

module.exports = { BackspinScene };
