/* BACKSPIN VR — cinematic 360° property tour.
   Crossfade sphere viewer + floor-plan minimap navigator + chapter rail + intro. */
const { useRef, useState, useEffect } = React;

const ZONES = [
  { id: 'pano-entrance', zh: '入口 · 接待',      en: 'ENTRANCE',        x: 33, y: 50 },
  { id: 'pano-putting',  zh: '推杆果岭区',       en: 'PUTTING GREEN',   x: 37, y: 41 },
  { id: 'pano-bays',     zh: '高尔夫模拟打位',   en: 'GOLF SIMULATORS',  x: 50, y: 38 },
  { id: 'pano-vip',      zh: '高尔夫 VIP 包间',  en: 'VIP SUITE',       x: 62, y: 38 },
  { id: 'pano-bar',      zh: '中央吧台',         en: 'CENTRAL BAR',     x: 47, y: 57 },
  { id: 'pano-seating',  zh: '散座区',           en: 'OPEN LOUNGE',  x: 40, y: 53 },
  { id: 'pano-sunken',   zh: '下沉卡座 · 歌台',  en: 'SUNKEN STAGE',    x: 27, y: 65 },
  { id: 'pano-barseat',  zh: '客人吧台座位',     en: 'BAR COUNTER',     x: 49, y: 54 },
  { id: 'pano-dart',     zh: '飞镖区',           en: 'DARTS LOUNGE',    x: 36, y: 71 },
  { id: 'pano-dining',   zh: '餐饮卡座区',       en: 'DINING BOOTHS',   x: 57, y: 66 },
  { id: 'pano-billiard', zh: '台球区',           en: 'BILLIARDS',       x: 37, y: 85 },
];
const ASSET_VERSION = '20260706-4k';
const panoSrc = (z, highRes) => (highRes ? 'panos-8k/' : 'panos/') + z.id + '.jpg?v=' + ASSET_VERSION;
const thumbSrc = (z) => 'panos/' + z.id + '.jpg?v=' + ASSET_VERSION;

const cream = '#efe8db', gold = '#c6a563', goldB = '#e8c887', muted = '#a89e8b', ink = '#080706';
const glass = { background: 'rgba(13,11,9,.52)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(198,165,99,.22)' };
const serif = "'Noto Serif SC',serif", disp = "'Marcellus','Noto Serif SC',serif";
const roundBtn = (on) => ({ width: 42, height: 42, borderRadius: 999, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'all .2s', ...glass, background: on ? 'rgba(198,165,99,.92)' : 'rgba(13,11,9,.52)', color: on ? '#1a150e' : goldB, borderColor: on ? goldB : 'rgba(198,165,99,.22)' });

function placeholderCanvas(z, i) {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1024;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#0d0c0a'); grad.addColorStop(.6, '#241f18'); grad.addColorStop(.78, '#141210'); grad.addColorStop(1, '#0a0908');
  g.fillStyle = grad; g.fillRect(0, 0, 2048, 1024);
  g.textAlign = 'center'; g.fillStyle = '#b99a5f'; g.font = '600 44px Georgia';
  g.fillText(String(i + 1).padStart(2, '0'), 1024, 470);
  g.fillStyle = '#ece5d8'; g.font = '700 66px "Noto Serif SC",serif'; g.fillText(z.zh, 1024, 545);
  return c;
}

function Intro({ onEnter, isTouch }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, background: 'radial-gradient(120% 130% at 50% 28%, #16120c 0%, #080706 68%)' }}>
      <div style={{ fontFamily: disp, letterSpacing: '.42em', color: muted, fontSize: 12, marginBottom: 20 }}>BACKSPIN&nbsp;&nbsp;ARCADE&nbsp;·&nbsp;2F</div>
      <div style={{ fontFamily: disp, fontSize: 'clamp(38px,8vw,74px)', letterSpacing: '.18em', color: cream, lineHeight: 1, animation: 'bsRise 1s ease both' }}>BACKSPIN</div>
      <div style={{ width: 56, height: 1, background: gold, margin: '22px 0' }} />
      <div style={{ fontFamily: serif, fontSize: 16, color: '#cec3ab', letterSpacing: '.08em' }}>沉浸式 360° 空间导览</div>
      <div style={{ fontFamily: serif, fontSize: 12.5, color: muted, marginTop: 9, letterSpacing: '.14em' }}>高尔夫 · 餐酒 · 娱乐 — 11 个场景</div>
      <button className="bs-enter" onClick={onEnter} style={{ marginTop: 36, padding: '14px 40px', borderRadius: 999, cursor: 'pointer', background: 'transparent', color: goldB, border: '1px solid ' + gold, fontFamily: disp, letterSpacing: '.22em', fontSize: 14, transition: 'all .3s' }}>进入导览</button>
      <div style={{ marginTop: 28, fontFamily: serif, fontSize: 11.5, color: muted, letterSpacing: '.14em', animation: 'bsFloat 3.2s ease-in-out infinite' }}>{isTouch ? '拖动环视 · 双指缩放 · 可开陀螺仪' : '拖拽环视 · 滚轮缩放 · 点楼层图跳转'}</div>
    </div>
  );
}

function Minimap({ idx, go, open, setOpen }) {
  if (!open) {
    return (
      <button className="bs-hov" onClick={() => setOpen(true)} style={{ position: 'absolute', left: 26, bottom: 32, zIndex: 30, cursor: 'pointer', padding: '9px 15px', borderRadius: 999, fontFamily: disp, letterSpacing: '.16em', fontSize: 12, color: goldB, ...glass }}>楼层图</button>
    );
  }
  return (
    <div style={{ position: 'absolute', left: 26, bottom: 32, zIndex: 30, width: 244, borderRadius: 14, padding: 11, boxShadow: '0 22px 60px rgba(0,0,0,.55)', ...glass }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, padding: '0 2px' }}>
        <span style={{ fontFamily: disp, letterSpacing: '.2em', fontSize: 11, color: muted }}>楼层导览 · 2F</span>
        <button className="bs-hov" onClick={() => setOpen(false)} style={{ width: 22, height: 22, borderRadius: 6, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(198,165,99,.28)', color: goldB, fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
      </div>
      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(198,165,99,.2)' }}>
        <img src={'floorplan/plan-full.png?v=' + ASSET_VERSION} alt="2F" style={{ display: 'block', width: '100%', filter: 'grayscale(.25) sepia(.16) brightness(.97) contrast(1.02)' }} />
        {ZONES.map((z, i) => {
          const on = i === idx;
          return (
            <button key={z.id} className="bs-dot" title={(i + 1) + ' ' + z.zh} onClick={() => go(i)}
              style={{ position: 'absolute', left: z.x + '%', top: z.y + '%', transform: 'translate(-50%,-50%)', width: on ? 19 : 11, height: on ? 19 : 11, borderRadius: 999, cursor: 'pointer', padding: 0, transition: 'all .25s', background: on ? gold : 'rgba(20,16,11,.82)', border: '1.5px solid ' + (on ? goldB : 'rgba(198,165,99,.75)'), color: '#1a150e', fontFamily: disp, fontSize: 9.5, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: on ? '0 0 0 3px rgba(198,165,99,.22)' : 'none', zIndex: on ? 2 : 1 }}>
              {on ? i + 1 : ''}
              {on && <span style={{ position: 'absolute', inset: -2, borderRadius: 999, border: '1.5px solid ' + goldB, animation: 'bsPulse 2.2s ease-out infinite' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GridOverlay({ idx, go, close }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'bsFade .3s ease' }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(6,5,4,.8)', backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)' }} />
      <div style={{ position: 'relative', width: 'min(1020px,92vw)', maxHeight: '86vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '2px 4px 16px' }}>
          <div>
            <div style={{ fontFamily: disp, letterSpacing: '.3em', fontSize: 12, color: gold }}>BACKSPIN ARCADE · 2F</div>
            <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: cream, marginTop: 4 }}>空间导览 <span style={{ fontFamily: disp, fontSize: 13, color: muted, letterSpacing: '.1em', fontWeight: 400 }}>／ 11 个场景</span></div>
          </div>
          <button className="bs-hov" onClick={close} style={{ width: 40, height: 40, borderRadius: 999, cursor: 'pointer', color: goldB, fontSize: 18, ...glass }}>×</button>
        </div>
        <div style={{ overflow: 'auto', paddingRight: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(184px,1fr))', gap: 14 }}>
          {ZONES.map((z, i) => {
            const on = i === idx;
            return (
              <button key={z.id} className="bs-card" onClick={() => { go(i); close(); }}
                style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', padding: 0, transition: 'transform .25s', backgroundImage: 'url(' + thumbSrc(z) + ')', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid ' + (on ? goldB : 'rgba(198,165,99,.2)'), boxShadow: on ? '0 0 0 2px ' + goldB : '0 10px 26px rgba(0,0,0,.4)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 38%, rgba(6,5,4,.9))' }} />
                <div style={{ position: 'absolute', left: 13, bottom: 11, textAlign: 'left' }}>
                  <div style={{ fontFamily: disp, color: goldB, fontSize: 12, letterSpacing: '.12em' }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontFamily: serif, color: cream, fontSize: 15, fontWeight: 600 }}>{z.zh}</div>
                </div>
                {on && <div style={{ position: 'absolute', top: 10, right: 10, background: goldB, color: '#1a150e', fontFamily: disp, fontSize: 10, letterSpacing: '.1em', padding: '3px 9px', borderRadius: 999 }}>当前</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BackspinVR(props) {
  const hostRef = useRef(null);
  const apiRef = useRef(null);
  const stateApi = useRef({});
  const [idx, setIdx] = useState(0);
  const [entered, setEntered] = useState(!(props.introSplash ?? true));
  const [loading, setLoading] = useState(true);
  const [gyro, setGyro] = useState(false);
  const [autoRot, setAutoRot] = useState(props.autoRotate ?? true);
  const [tour, setTour] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const isTouch = typeof matchMedia !== 'undefined' && matchMedia('(pointer:coarse)').matches;
  const showMinimap = props.showMinimap ?? true;

  stateApi.current.setLoading = setLoading;
  stateApi.current.autoRot = autoRot;
  stateApi.current.tour = tour;
  useEffect(() => { setMapOpen(showMinimap && !isTouch); }, []);

  useEffect(() => {
    let dead = false, raf = 0, renderer, ro;
    (async () => {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
      if (dead || !hostRef.current) return;
      const host = hostRef.current; host.innerHTML = '';
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(66, 1, 0.1, 200); cam.rotation.order = 'YXZ';
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 3));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;cursor:grab';

      const mk = (r, opts) => { const g = new THREE.SphereGeometry(r, 64, 44); g.scale(-1, 1, 1); const m = new THREE.MeshBasicMaterial(opts); const s = new THREE.Mesh(g, m); scene.add(s); return m; };
      const matA = mk(60, {});
      const matB = mk(59, { transparent: true, opacity: 0, depthWrite: false });
      matB.visible = false;
      const loader = new THREE.TextureLoader();
      const loadTex = (s) => new Promise((res, rej) => loader.load(s, (t) => {
        t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; res(t);
      }, undefined, () => rej()));

      const useHiResPanos = (renderer.capabilities.maxTextureSize || 4096) >= 8192;
      let cur = -1, first = true;
      const trans = { active: false, start: 0, tex: null };
      const goTo = (i) => {
        if (i === cur && !first) return;
        cur = i; const z = ZONES[i];
        stateApi.current.setLoading(true);
        const done = (tex) => {
          stateApi.current.setLoading(false);
          if (dead) return;
          if (first) { if (matA.map) matA.map.dispose(); matA.map = tex; matA.needsUpdate = true; first = false; return; }
          if (matB.map && matB.map !== matA.map) matB.map.dispose();
          matB.map = tex; matB.needsUpdate = true; matB.opacity = 0; matB.visible = true;
          trans.active = true; trans.start = performance.now(); trans.tex = tex;
        };
        const fallback = () => loadTex(panoSrc(z, false)).then(done).catch(() => { const t = new THREE.CanvasTexture(placeholderCanvas(z, i)); t.colorSpace = THREE.SRGBColorSpace; done(t); });
        loadTex(panoSrc(z, useHiResPanos)).then(done).catch(fallback);
      };
      apiRef.current = { goTo };
      goTo(0);

      const st = { yaw: 0, pitch: 0, fov: 66 };
      const el = renderer.domElement;
      let gyroOn = false, gyroBase = null, lastInter = performance.now();
      const bump = () => { lastInter = performance.now(); };
      const ptrs = new Map(); let lastP = null, pinch = 0;
      el.addEventListener('pointerdown', (e) => { ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; bump(); if (ptrs.size === 1) lastP = { x: e.clientX, y: e.clientY }; else if (ptrs.size === 2) { const p = [...ptrs.values()]; pinch = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); } });
      el.addEventListener('pointermove', (e) => {
        if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); bump();
        if (ptrs.size >= 2) { const p = [...ptrs.values()]; const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); if (pinch) st.fov = Math.max(42, Math.min(92, st.fov - (d - pinch) * 0.12)); pinch = d; lastP = null; return; }
        if (!lastP) { lastP = { x: e.clientX, y: e.clientY }; return; }
        gyroOn = false; st.yaw += (e.clientX - lastP.x) * 0.0038; st.pitch = Math.max(-1.35, Math.min(1.35, st.pitch + (e.clientY - lastP.y) * 0.0038)); lastP = { x: e.clientX, y: e.clientY };
      });
      const drop = (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = 0; if (ptrs.size === 0) { lastP = null; el.style.cursor = 'grab'; } };
      el.addEventListener('pointerup', drop); el.addEventListener('pointercancel', drop);
      el.addEventListener('wheel', (e) => { e.preventDefault(); st.fov = Math.max(42, Math.min(92, st.fov + e.deltaY * 0.04)); bump(); }, { passive: false });

      const onOrient = (e) => { if (!gyroOn || e.alpha == null) return; const a = THREE.MathUtils.degToRad(e.alpha), b = THREE.MathUtils.degToRad(e.beta); if (gyroBase == null) gyroBase = a; st.yaw = -(a - gyroBase); st.pitch = Math.max(-1.2, Math.min(1.2, b - Math.PI / 2)); };
      window.addEventListener('deviceorientation', onOrient, true);
      apiRef.current.enableGyro = async () => { try { const D = window.DeviceOrientationEvent; if (D && typeof D.requestPermission === 'function') { const r = await D.requestPermission(); if (r !== 'granted') return false; } gyroBase = null; gyroOn = true; return true; } catch (err) { return false; } };
      apiRef.current.disableGyro = () => { gyroOn = false; };

      const fit = () => { const w = host.clientWidth || 800, h = host.clientHeight || 500; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); };
      ro = new ResizeObserver(fit); ro.observe(host); fit();

      const tick = () => {
        if (dead) return;
        if (trans.active) {
          const p = Math.min(1, (performance.now() - trans.start) / 850);
          const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          matB.opacity = e; st.pitch += (0 - st.pitch) * 0.05;
          if (p >= 1) { if (matA.map && matA.map !== trans.tex) matA.map.dispose(); matA.map = trans.tex; matA.needsUpdate = true; matB.opacity = 0; matB.visible = false; matB.map = null; trans.active = false; }
        }
        const auto = (stateApi.current.autoRot || stateApi.current.tour) && ptrs.size === 0 && !gyroOn && (stateApi.current.tour || performance.now() - lastInter > 3500);
        if (auto) st.yaw += 0.0004;
        cam.rotation.set(st.pitch, st.yaw, 0);
        if (Math.abs(cam.fov - st.fov) > 0.05) { cam.fov += (st.fov - cam.fov) * 0.15; cam.updateProjectionMatrix(); }
        renderer.render(scene, cam); raf = requestAnimationFrame(tick);
      };
      tick();
    })();
    return () => { dead = true; cancelAnimationFrame(raf); ro && ro.disconnect(); renderer && renderer.dispose(); };
  }, []);

  useEffect(() => { apiRef.current && apiRef.current.goTo(idx); }, [idx]);
  useEffect(() => {
    const k = (e) => { if (e.key === 'ArrowRight') { setTour(false); setIdx((v) => (v + 1) % ZONES.length); } else if (e.key === 'ArrowLeft') { setTour(false); setIdx((v) => (v + ZONES.length - 1) % ZONES.length); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  useEffect(() => {
    if (!tour) return;
    const t = setTimeout(() => setIdx((v) => (v + 1) % ZONES.length), 7000);
    return () => clearTimeout(t);
  }, [tour, idx]);

  const go = (i) => { setTour(false); setIdx(i); };
  const z = ZONES[idx];
  const toggleAuto = () => setAutoRot((v) => !v);
  const toggleGyro = async () => { if (gyro) { apiRef.current && apiRef.current.disableGyro(); setGyro(false); } else { const ok = apiRef.current && await apiRef.current.enableGyro(); setGyro(!!ok); } };
  const toggleFull = () => { const el = document.documentElement; if (!document.fullscreenElement) { el.requestFullscreen && el.requestFullscreen(); } else { document.exitFullscreen && document.exitFullscreen(); } };
  const chev = { width: 40, height: 40, borderRadius: 999, cursor: 'pointer', fontSize: 20, color: goldB, background: 'transparent', border: '1px solid rgba(198,165,99,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'all .2s' };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: ink, fontFamily: serif, color: cream, WebkitUserSelect: 'none', userSelect: 'none' }}>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(132% 122% at 50% 36%, transparent 50%, rgba(0,0,0,.45) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, pointerEvents: 'none', background: 'linear-gradient(rgba(6,5,4,.74), transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, pointerEvents: 'none', background: 'linear-gradient(transparent, rgba(6,5,4,.8))' }} />

      {entered && (
        <div key={idx} style={{ position: 'absolute', top: 28, left: 32, pointerEvents: 'none', animation: 'bsRise .7s ease both' }}>
          <div style={{ fontFamily: disp, letterSpacing: '.34em', fontSize: 11.5, color: gold }}>BACKSPIN ARCADE — 2F{tour ? '  ·  自动巡览中' : ''}</div>
          <div style={{ fontSize: 'clamp(26px,3.4vw,38px)', fontWeight: 700, color: cream, marginTop: 6, lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>{z.zh}</div>
          <div style={{ fontFamily: disp, letterSpacing: '.26em', fontSize: 11.5, color: muted, marginTop: 6 }}>{z.en}&nbsp;&nbsp;·&nbsp;&nbsp;{String(idx + 1).padStart(2, '0')} / 11</div>
        </div>
      )}

      {entered && (
        <div style={{ position: 'absolute', top: 26, right: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, zIndex: 30 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <a className="bs-hov" href="Backspin 3D.dc.html" style={{ color: '#d9cfb8', fontFamily: disp, fontSize: 12, letterSpacing: '.14em', textDecoration: 'none', padding: '7px 14px', borderRadius: 999, ...glass }}>立体模型</a>
            <a className="bs-hov" href="Backspin Walkthrough.dc.html" style={{ color: '#d9cfb8', fontFamily: disp, fontSize: 12, letterSpacing: '.14em', textDecoration: 'none', padding: '7px 14px', borderRadius: 999, ...glass }}>图文导览</a>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button title="自动巡览" onClick={() => setTour(v => !v)} style={roundBtn(tour)}>{tour ? '❚❚' : '▷'}</button>
            <button title="自动环绕" onClick={toggleAuto} style={roundBtn(autoRot)}>⟳</button>
            {isTouch && <button title="陀螺仪环视" onClick={toggleGyro} style={roundBtn(gyro)}>✧</button>}
            <button title="全屏" onClick={toggleFull} style={roundBtn(false)}>⤢</button>
          </div>
        </div>
      )}

      {entered && showMinimap && <Minimap idx={idx} go={go} open={mapOpen} setOpen={setMapOpen} />}

      {entered && (
        <div style={{ position: 'absolute', left: '50%', bottom: 34, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 'min(600px,90vw)', zIndex: 30 }}>
          <div style={{ display: 'flex', gap: 6, width: '100%', justifyContent: 'center', padding: '0 4px' }}>
            {ZONES.map((zz, i) => (
              <button key={zz.id} title={zz.zh} onClick={() => go(i)} style={{ flex: '1 1 0', maxWidth: 40, height: 3, borderRadius: 2, border: 'none', padding: 0, cursor: 'pointer', transition: 'background .3s', background: i === idx ? goldB : (i < idx ? 'rgba(198,165,99,.5)' : 'rgba(233,232,220,.22)') }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 999, boxShadow: '0 18px 46px rgba(0,0,0,.5)', ...glass }}>
            <button className="bs-hov" style={chev} onClick={() => go((idx + ZONES.length - 1) % ZONES.length)}>‹</button>
            <button className="bs-hov" onClick={() => setGridOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: cream, padding: '2px 8px', minWidth: 176, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, justifyContent: 'center' }}>
                <span style={{ fontFamily: disp, color: goldB, fontSize: 15, letterSpacing: '.08em' }}>{String(idx + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{z.zh}</span>
              </div>
              <div style={{ fontFamily: disp, fontSize: 9.5, letterSpacing: '.24em', color: muted, marginTop: 3 }}>{z.en} · 全部场景</div>
            </button>
            <button className="bs-hov" style={chev} onClick={() => go((idx + 1) % ZONES.length)}>›</button>
          </div>
        </div>
      )}

      {entered && loading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, animation: 'bsFade .4s ease' }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, border: '2px solid rgba(198,165,99,.25)', borderTopColor: goldB, animation: 'bsSpin .9s linear infinite' }} />
          <div style={{ fontFamily: disp, fontSize: 11, letterSpacing: '.28em', color: muted }}>载入空间</div>
        </div>
      )}

      {gridOpen && <GridOverlay idx={idx} go={go} close={() => setGridOpen(false)} />}
      {!entered && <Intro onEnter={() => setEntered(true)} isTouch={isTouch} />}
    </div>
  );
}

module.exports = { BackspinVR };
