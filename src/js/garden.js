/**
 * garden.js — Three.js Interactive Garden Scene
 *
 * THREE is loaded as a global via CDN <script> in index.html.
 * We capture it explicitly from window so Vite's strict-mode
 * ES module processing never sees it as an undeclared identifier.
 */

// ── Capture THREE from the CDN global ──────────────────────────
const THREE = window.THREE;

if (!THREE) {
  console.error(
    '[garden.js] THREE not found on window. ' +
    'Make sure the Three.js CDN <script> tag loads before this module.'
  );
}

export class GardenScene {
  constructor() {
    if (!THREE) return; // CDN failed to load — bail out silently

    this.canvas = document.getElementById('garden-canvas');
    if (!this.canvas) {
      console.error('[GardenScene] #garden-canvas not found in DOM.');
      return;
    }

    // State
    this.mouse       = { x: 0, y: 0 };
    this.scrollY     = 0;
    this.isPouring   = false;
    this.clock       = new THREE.Clock();

    // Collections
    this.flowers     = [];
    this.butterflies = [];
    this.petalVels   = [];

    // Water particle pool
    this.waterPool   = [];
    this.waterHead   = 0;
    this.WATER_COUNT = 150;

    try {
      this._init();
    } catch (err) {
      console.error('[GardenScene] Init failed:', err);
    }
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  _init() {
    this._setupRenderer();
    this._setupCamera();
    this._setupLights();
    this._buildGround();
    this._buildPath();
    this._buildFence();
    this._buildTrees();
    this._buildFlowers();
    this._buildButterflies();
    this._buildPetals();
    this._buildWateringCan();
    this._buildWaterParticles();
    this._bindEvents();
    this._animate();
  }

  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas:    this.canvas,
      antialias: true,
      alpha:     true,   // tells WebGL to allocate an alpha channel
    });
    // CRITICAL: explicitly set clear color to fully transparent.
    // Even with alpha:true the default is opaque black — without this
    // the canvas covers the CSS gradient background completely.
    this.renderer.setClearColor(0x000000, 0);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    // No scene.background — keep transparent so CSS sky gradient shows
    // Fog tints distant objects toward the pink sky color
    this.scene.fog = new THREE.FogExp2(0xFFDDE9, 0.018);
  }

  _setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    this.camera.position.set(0, 4.5, 18);
    this.camera.lookAt(0, 1.5, 0);
  }

  _setupLights() {
    // Soft warm ambient
    this.scene.add(new THREE.AmbientLight(0xFFEBF5, 1.1));

    // Sun (directional + shadows)
    const sun = new THREE.DirectionalLight(0xFFF8E7, 2.0);
    sun.position.set(12, 22, 10);
    sun.castShadow = true;
    const sc = sun.shadow.camera;
    sc.left = sc.bottom = -30;
    sc.right = sc.top = 30;
    sun.shadow.mapSize.width  = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.bias = -0.001;
    this.scene.add(sun);

    // Pink hemisphere (sky / ground bounce)
    this.scene.add(new THREE.HemisphereLight(0xFFCCE4, 0x8FBC8F, 0.7));

    // Soft rosy fill from the left
    const fill = new THREE.PointLight(0xFF85A1, 1.0, 35);
    fill.position.set(-10, 8, 6);
    this.scene.add(fill);
  }

  /* ─────────────────────────────────────────────────
     WORLD GEOMETRY
  ───────────────────────────────────────────────── */
  _buildGround() {
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshLambertMaterial({ color: 0x72C472 });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  _buildPath() {
    // Lighter green path running toward camera
    const pathMat = new THREE.MeshLambertMaterial({ color: 0x95D48A });
    const path = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 28), pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, -0.04, 3);
    this.scene.add(path);

    // Stepping stones
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0xC8C0B0 });
    for (let i = 0; i < 6; i++) {
      const rx = 0.28 + Math.random() * 0.18;
      const rz = 0.24 + Math.random() * 0.14;
      const geo = new THREE.CylinderGeometry(rx, rx * 1.05, 0.08, 8);
      const stone = new THREE.Mesh(geo, stoneMat);
      stone.position.set(
        (Math.random() - 0.5) * 1.2,
        0.01,
        i * 2.2 - 3
      );
      stone.rotation.y = Math.random() * Math.PI;
      stone.receiveShadow = true;
      this.scene.add(stone);
    }
  }

  _buildFence() {
    const mat = new THREE.MeshLambertMaterial({ color: 0xF7EDD0 });
    const Z   = -13;
    const W   = 44;
    const STEP = 1.5;
    const count = Math.floor(W / STEP);

    for (let i = 0; i <= count; i++) {
      const x = -W / 2 + i * STEP;

      // Post body
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), mat);
      post.position.set(x, 0.7, Z);
      post.castShadow = true;
      this.scene.add(post);

      // Pointed top
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 4), mat);
      cap.position.set(x, 1.52, Z);
      cap.rotation.y = Math.PI / 4;
      this.scene.add(cap);
    }

    // Two horizontal rails
    for (let r = 0; r < 2; r++) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(W, 0.09, 0.09), mat);
      rail.position.set(0, 0.42 + r * 0.52, Z);
      this.scene.add(rail);
    }
  }

  /* ─────────────────────────────────────────────────
     CHERRY BLOSSOM TREES
  ───────────────────────────────────────────────── */
  _makeTree(x, z, scale = 1) {
    const grp     = new THREE.Group();
    const trunkM  = new THREE.MeshLambertMaterial({ color: 0x7D5A3C });
    const bColors = [0xFFB7C5, 0xFFC2CC, 0xFFCBD9, 0xFFD9E5, 0xFFF0F5];

    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24 * scale, 0.42 * scale, 5.2 * scale, 8),
      trunkM
    );
    trunk.position.y = 2.6 * scale;
    trunk.castShadow = true;
    grp.add(trunk);

    // Branches (5)
    const bAngles = [0, 1.25, 2.5, 3.75, 5.0];
    bAngles.forEach((a, idx) => {
      const len = (1.6 + Math.random() * 1.4) * scale;
      const b   = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07 * scale, 0.14 * scale, len, 6),
        trunkM
      );
      b.position.set(
        Math.cos(a) * 1.6 * scale,
        (3.6 + idx * 0.25 + Math.random() * 0.4) * scale,
        Math.sin(a) * 1.6 * scale
      );
      b.rotation.z = Math.cos(a) * 0.65;
      b.rotation.x = Math.sin(a) * 0.65;
      b.castShadow = true;
      grp.add(b);
    });

    // Blossom clusters (20)
    for (let i = 0; i < 20; i++) {
      const sz = (0.65 + Math.random() * 0.95) * scale;
      const bm = new THREE.MeshLambertMaterial({
        color: bColors[Math.floor(Math.random() * bColors.length)]
      });
      const bl = new THREE.Mesh(new THREE.SphereGeometry(sz, 8, 6), bm);
      const a  = Math.random() * Math.PI * 2;
      const r  = (0.5 + Math.random() * 2.5) * scale;
      bl.position.set(
        Math.cos(a) * r,
        (4.2 + Math.random() * 3.5) * scale,
        Math.sin(a) * r
      );
      bl.castShadow = true;
      grp.add(bl);
    }

    grp.position.set(x, 0, z);
    grp.scale.y = 0; // start flat — will grow up
    this.scene.add(grp);
    return grp;
  }

  _buildTrees() {
    const specs = [
      { x: -9,  z: -8,  s: 1.2, delay: 400  },
      { x:  9,  z: -10, s: 1.0, delay: 700  },
      { x: -5,  z: -14, s: 0.75,delay: 1100 },
      { x:  6,  z: -6,  s: 0.85,delay: 900  },
    ];
    specs.forEach(({ x, z, s, delay }) => {
      const tree = this._makeTree(x, z, s);
      this._growUp(tree, delay, 2600);
    });
  }

  /* Animates scale.y from 0→1 with elastic ease */
  _growUp(obj, delay, duration) {
    setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        obj.scale.y = Math.max(0, this._easeOutElastic(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  }

  /* ─────────────────────────────────────────────────
     FLOWERS
  ───────────────────────────────────────────────── */
  _makeFlower(x, z, color, stemH = 0.85) {
    const grp     = new THREE.Group();
    const stemM   = new THREE.MeshLambertMaterial({ color: 0x4D8B3E });
    const leafM   = new THREE.MeshLambertMaterial({ color: 0x60A858 });
    const centerM = new THREE.MeshLambertMaterial({ color: 0xF4D03F });
    const petalM  = new THREE.MeshLambertMaterial({ color });

    // Stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.038, stemH, 5),
      stemM
    );
    stem.position.y = stemH / 2;
    grp.add(stem);

    // Leaf
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 5), leafM);
    leaf.scale.set(1.3, 0.22, 0.7);
    leaf.position.set(0.12, stemH * 0.55, 0);
    grp.add(leaf);

    // Centre
    const ctr = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 7), centerM);
    ctr.position.y = stemH + 0.02;
    grp.add(ctr);

    // 6 Petals
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), petalM);
      p.scale.set(0.75, 0.28, 1.5);
      p.position.set(
        Math.cos(a) * 0.13,
        stemH + 0.015,
        Math.sin(a) * 0.13
      );
      p.rotation.y = -a;
      grp.add(p);
    }

    grp.position.set(x, 0, z);
    grp.scale.set(1, 0, 1); // hidden until bloom
    this.scene.add(grp);
    this.flowers.push(grp);
    return grp;
  }

  _bloom(flower, delay) {
    setTimeout(() => {
      const start = performance.now();
      const dur   = 600 + Math.random() * 350;
      const tick  = (now) => {
        const t = Math.min((now - start) / dur, 1);
        flower.scale.y = Math.max(0, this._easeOutBack(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  }

  _buildFlowers() {
    const palette = [
      0xFFB7C5, 0xC9B8E8, 0xF4D03F, 0xFF85A1,
      0xE8B4D0, 0xB0D0FF, 0xFFE580, 0xFF95A8,
    ];
    const pick = () => palette[Math.floor(Math.random() * palette.length)];

    // Left bed
    for (let i = 0; i < 14; i++) {
      const f = this._makeFlower(
        -13 + Math.random() * 5.5,
        -8  + Math.random() * 9,
        pick(),
        0.65 + Math.random() * 0.55
      );
      this._bloom(f, 900 + i * 65);
    }

    // Right bed
    for (let i = 0; i < 14; i++) {
      const f = this._makeFlower(
        7.5 + Math.random() * 5,
        -8  + Math.random() * 9,
        pick(),
        0.65 + Math.random() * 0.55
      );
      this._bloom(f, 900 + i * 65);
    }

    // Along the path
    for (let i = 0; i < 10; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const f = this._makeFlower(
        side * (2.0 + Math.random() * 0.9),
        -5 + i * 1.6 + Math.random() * 0.5,
        pick(),
        0.45 + Math.random() * 0.35
      );
      this._bloom(f, 1300 + i * 90);
    }

    // Background scatter
    for (let i = 0; i < 18; i++) {
      const f = this._makeFlower(
        (Math.random() - 0.5) * 32,
        -11 + Math.random() * (-8),
        pick(),
        0.5 + Math.random() * 0.9
      );
      this._bloom(f, 1000 + i * 55);
    }
  }

  /* ─────────────────────────────────────────────────
     BUTTERFLIES
  ───────────────────────────────────────────────── */
  _makeButterfly() {
    const grp = new THREE.Group();
    const colors = [0xFFB7C5, 0xC9B8E8, 0xF4D03F, 0xFF85A1, 0xA8D4FF];
    const wColor = colors[Math.floor(Math.random() * colors.length)];

    const wMat = new THREE.MeshBasicMaterial({
      color: wColor, side: THREE.DoubleSide,
      transparent: true, opacity: 0.88,
    });

    // Wing shape — upper + lower lobe
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.38, 0.12, -0.62, 0.48, -0.42, 0.7);
    shape.bezierCurveTo(-0.22, 0.9, -0.04, 0.42, 0, 0);
    shape.bezierCurveTo(-0.08, -0.28, -0.32, -0.34, -0.22, -0.1);
    shape.bezierCurveTo(-0.12, 0.06, 0, 0, 0, 0);

    const wingGeo = new THREE.ShapeGeometry(shape);

    const lWing = new THREE.Mesh(wingGeo, wMat);
    lWing.name = 'lWing';
    grp.add(lWing);

    const rWing = new THREE.Mesh(wingGeo, wMat);
    rWing.scale.x = -1;
    rWing.name = 'rWing';
    grp.add(rWing);

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.028, 0.022, 0.32, 6);
    const body    = new THREE.Mesh(bodyGeo, new THREE.MeshBasicMaterial({ color: 0x5C3A5A }));
    body.rotation.z = Math.PI / 2;
    grp.add(body);

    grp.scale.setScalar(0.48);

    grp.userData = {
      speed:   0.18 + Math.random() * 0.4,
      radius:  2.2  + Math.random() * 3.8,
      cx:      (Math.random() - 0.5) * 16,
      cy:      2.4  + Math.random() * 4,
      cz:      (Math.random() - 0.5) * 9 - 4,
      angle:   Math.random() * Math.PI * 2,
      bobSpd:  0.8  + Math.random() * 1.8,
      wingSpd: 4.0  + Math.random() * 4,
    };

    const d = grp.userData;
    grp.position.set(
      d.cx + Math.cos(d.angle) * d.radius,
      d.cy,
      d.cz + Math.sin(d.angle) * d.radius * 0.45
    );

    this.scene.add(grp);
    this.butterflies.push(grp);
    return grp;
  }

  _buildButterflies() {
    for (let i = 0; i < 8; i++) this._makeButterfly();
  }

  /* ─────────────────────────────────────────────────
     FLOATING PETALS (Points)
  ───────────────────────────────────────────────── */
  _buildPetals() {
    const N   = 70;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);

    const palettes = [
      [1.0, 0.72, 0.77],
      [0.79, 0.72, 0.91],
      [1.0,  0.90, 0.95],
      [1.0,  0.96, 0.72],
    ];

    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const c = palettes[Math.floor(Math.random() * palettes.length)];
      col[i * 3]     = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];

      this.petalVels.push({
        vx:    (Math.random() - 0.5) * 0.012,
        vy:    -(0.012 + Math.random() * 0.018),
        vz:    (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    this.petalSystem = new THREE.Points(geo, new THREE.PointsMaterial({
      size:         0.22,
      vertexColors: true,
      transparent:  true,
      opacity:      0.88,
      sizeAttenuation: true,
    }));
    this.scene.add(this.petalSystem);
  }

  /* ─────────────────────────────────────────────────
     WATERING CAN
  ───────────────────────────────────────────────── */
  _buildWateringCan() {
    const can  = new THREE.Group();
    const pink = new THREE.MeshLambertMaterial({ color: 0xFF85A1 });
    const lite = new THREE.MeshLambertMaterial({ color: 0xFFB4C8 });

    // Body — lathe for a rounded can silhouette
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const r = 0.38 + Math.sin(t * Math.PI) * 0.18;
      pts.push(new THREE.Vector2(r, t * 0.85 - 0.42));
    }
    const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 18), pink);
    body.castShadow = true;
    can.add(body);

    // Spout pivot
    const spoutGrp = new THREE.Group();
    // Use .position.set() — Object.assign would replace Three.js's
    // internal Vector3 reference and break matrix updates.
    const spoutMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 0.75, 8), pink);
    spoutMesh.position.set(0, 0.38, 0);
    spoutGrp.add(spoutMesh);
    // Opening ring
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.1, 8), lite);
    ring.position.y = 0.78;
    spoutGrp.add(ring);

    spoutGrp.rotation.z = Math.PI / 4;
    spoutGrp.position.set(0.55, 0.12, 0);
    can.add(spoutGrp);
    this._spoutGrp = spoutGrp; // used to compute water spawn

    // Handle (QuadraticBezier tube)
    const hCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.38, -0.22, 0),
      new THREE.Vector3(-0.78,  0.18, 0),
      new THREE.Vector3(-0.38,  0.44, 0)
    );
    can.add(new THREE.Mesh(new THREE.TubeGeometry(hCurve, 10, 0.042, 8, false), pink));

    // Decorative dots
    for (let i = 0; i < 4; i++) {
      const a   = (i / 4) * Math.PI;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.048, 6, 6),
        new THREE.MeshLambertMaterial({ color: 0xFFC2D4 }));
      dot.position.set(Math.cos(a) * 0.37, Math.sin(a) * 0.22, 0.37);
      can.add(dot);
    }

    can.position.set(-20, 5, 10); // starts off-screen left
    can.scale.setScalar(1.25);
    this.scene.add(can);
    this.wateringCan = can;
  }

  /* ─────────────────────────────────────────────────
     WATER PARTICLES
  ───────────────────────────────────────────────── */
  _buildWaterParticles() {
    const N   = this.WATER_COUNT;
    const arr = new Float32Array(N * 3).fill(0);
    // hide them below ground initially
    for (let i = 1; i < N * 3; i += 3) arr[i] = -200;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));

    this.waterSystem = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x87CEEB, size: 0.13, transparent: true, opacity: 0.82, sizeAttenuation: true,
    }));
    this.scene.add(this.waterSystem);

    for (let i = 0; i < N; i++) {
      this.waterPool.push({ active: false, life: 0, vx: 0, vy: 0, vz: 0 });
    }
  }

  _sprayWater() {
    // Force world-matrix update before localToWorld.
    // Without this, matrices may be stale (especially before the first render frame).
    this.wateringCan.updateWorldMatrix(true, true);
    const tip = new THREE.Vector3(0, 0.9, 0);
    this._spoutGrp.localToWorld(tip);

    for (let i = 0; i < 18; i++) {
      const idx = (this.waterHead++) % this.WATER_COUNT;
      const pos = this.waterSystem.geometry.attributes.position.array;
      pos[idx * 3]     = tip.x;
      pos[idx * 3 + 1] = tip.y;
      pos[idx * 3 + 2] = tip.z;

      this.waterPool[idx] = {
        active: true,
        life:   1.0,
        vx:  0.04 + Math.random() * 0.07,
        vy: -0.03 - Math.random() * 0.06,
        vz: (Math.random() - 0.5) * 0.045,
      };
    }
    this.waterSystem.geometry.attributes.position.needsUpdate = true;
  }

  /* ─────────────────────────────────────────────────
     EVENTS
  ───────────────────────────────────────────────── */
  _bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('mousedown', () => { this.isPouring = true;  });
    window.addEventListener('mouseup',   () => { this.isPouring = false; });

    window.addEventListener('scroll',    () => { this.scrollY = window.scrollY; });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Touch: hold = pour
    window.addEventListener('touchstart', () => { this.isPouring = true;  }, { passive: true });
    window.addEventListener('touchend',   () => { this.isPouring = false; });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length) {
        this.mouse.x = (e.touches[0].clientX / window.innerWidth)  * 2 - 1;
        this.mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────
     ANIMATION LOOP
  ───────────────────────────────────────────────── */
  _animate() {
    requestAnimationFrame(() => this._animate());
    const t = this.clock.getElapsedTime();
    this._updateButterflies(t);
    this._updatePetals(t);
    this._updateWateringCan(t);
    this._updateFlowers(t);
    this._updateWater();
    this._updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  _updateButterflies(t) {
    this.butterflies.forEach(b => {
      const d = b.userData;
      d.angle += d.speed * 0.006;

      b.position.x = d.cx + Math.cos(d.angle) * d.radius;
      b.position.y = d.cy + Math.sin(t * d.bobSpd) * 0.35;
      b.position.z = d.cz + Math.sin(d.angle) * d.radius * 0.4;

      // Face direction of travel
      const nx = d.cx + Math.cos(d.angle + 0.01) * d.radius;
      const nz = d.cz + Math.sin(d.angle + 0.01) * d.radius * 0.4;
      b.rotation.y = Math.atan2(nx - b.position.x, nz - b.position.z);

      // Wing flap
      const flap = Math.abs(Math.sin(t * d.wingSpd)) * (Math.PI / 2.8);
      const lW = b.getObjectByName('lWing');
      const rW = b.getObjectByName('rWing');
      if (lW) lW.rotation.y =  flap;
      if (rW) rW.rotation.y = -flap;
    });
  }

  _updatePetals(t) {
    if (!this.petalSystem) return;
    const pos = this.petalSystem.geometry.attributes.position.array;
    const N   = pos.length / 3;

    for (let i = 0; i < N; i++) {
      const v = this.petalVels[i];
      pos[i * 3]     += v.vx + Math.sin(t * 0.5 + v.phase) * 0.003;
      pos[i * 3 + 1] += v.vy;
      pos[i * 3 + 2] += v.vz + Math.cos(t * 0.3 + v.phase) * 0.002;

      // Recycle when fallen below ground
      if (pos[i * 3 + 1] < -1) {
        pos[i * 3 + 1] = 10 + Math.random() * 4;
        pos[i * 3]     = (Math.random() - 0.5) * 44;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      }
    }
    this.petalSystem.geometry.attributes.position.needsUpdate = true;
  }

  _updateWateringCan(t) {
    if (!this.wateringCan) return;

    // Map mouse → world position in front of camera
    const tx = this.mouse.x * 10;
    const ty = this.mouse.y * 4.5 + 3.5;

    this.wateringCan.position.x += (tx  - this.wateringCan.position.x) * 0.07;
    this.wateringCan.position.y += (ty  - this.wateringCan.position.y) * 0.07;
    this.wateringCan.position.z = 10; // always in front

    // Tilt: more when pouring
    const tiltTarget = this.isPouring ? -0.95 : -0.18;
    this.wateringCan.rotation.z += (tiltTarget - this.wateringCan.rotation.z) * 0.12;
    this.wateringCan.rotation.y = this.mouse.x * -0.18;

    // Gentle bob
    this.wateringCan.position.y += Math.sin(t * 1.2) * 0.03;

    if (this.isPouring && Math.random() > 0.25) {
      this._sprayWater();
    }
  }

  _updateWater() {
    const pos = this.waterSystem.geometry.attributes.position.array;
    let dirty = false;

    for (let i = 0; i < this.WATER_COUNT; i++) {
      const p = this.waterPool[i];
      if (!p.active) continue;
      dirty = true;
      p.life -= 0.016;

      if (p.life <= 0) {
        p.active = false;
        pos[i * 3 + 1] = -200;
        continue;
      }

      p.vy -= 0.006; // gravity
      pos[i * 3]     += p.vx;
      pos[i * 3 + 1] += p.vy;
      pos[i * 3 + 2] += p.vz;
    }

    if (dirty) this.waterSystem.geometry.attributes.position.needsUpdate = true;
  }

  _updateFlowers(t) {
    this.flowers.forEach((f, i) => {
      f.rotation.z = Math.sin(t * 0.45 + i * 0.62) * 0.055;
    });
  }

  _updateCamera() {
    // Subtle parallax: camera drifts back + up as user scrolls down
    const s = this.scrollY * 0.003;
    this.camera.position.y = 4.5 - s * 0.4;
    this.camera.position.z = 18  + s * 0.8;
    this.camera.lookAt(0, 1.5, 0);
  }

  /* ─────────────────────────────────────────────────
     EASING HELPERS
  ───────────────────────────────────────────────── */
  _easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    if (x === 0) return 0;
    if (x === 1) return 1;
    return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  _easeOutBack(x) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
}
