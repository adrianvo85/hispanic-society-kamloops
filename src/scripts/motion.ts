import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) document.documentElement.classList.add("no-motion");

const nav = document.querySelector<HTMLElement>("[data-nav]");
const hero = document.querySelector(".hero, .event-hero");
function setNav() {
  if (!nav) return;
  const threshold = hero ? Math.min(window.innerHeight * 0.7, 520) : 0;
  nav.classList.toggle("is-light", window.scrollY > threshold || !hero);
}
setNav();
window.addEventListener("scroll", setNav, { passive: true });

if (!reduce) {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.09 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

// Lightbox
const layer = document.querySelector<HTMLElement>("[data-lightbox-layer]");
const layerImg = layer?.querySelector("img");
document.querySelectorAll<HTMLElement>("[data-lightbox]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!layer || !layerImg) return;
    layerImg.src = btn.dataset.lightbox || "";
    layer.classList.add("open");
  });
});
layer?.querySelector("[data-lightbox-close]")?.addEventListener("click", () => {
  layer.classList.remove("open");
});
layer?.addEventListener("click", (e) => {
  if (e.target === layer) layer.classList.remove("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") layer?.classList.remove("open");
});

// Light 3D logo
const canvas = document.querySelector<HTMLCanvasElement>("[data-logo-canvas]");
const cssFallback = document.querySelector<HTMLElement>("[data-logo-css]");
const flat = document.querySelector<HTMLElement>("[data-logo-flat]");

async function logo3d() {
  if (!canvas || !flat) return;
  if (reduce) {
    flat.hidden = false;
    return;
  }
  const webgl = (() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  })();
  if (!webgl) {
    flat.hidden = true;
    if (cssFallback) cssFallback.hidden = false;
    return;
  }
  const THREE = await import("three");
  const src = flat.querySelector("img")?.getAttribute("src");
  if (!src) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.z = 6;

  const light = new THREE.DirectionalLight(0xffffff, 1.15);
  light.position.set(2, 3, 4);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(src);
  texture.colorSpace = THREE.SRGBColorSpace;

  const group = new THREE.Group();
  const plane = new THREE.Mesh(
    new THREE.CircleGeometry(1.25, 64),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  group.add(plane);

  const colors = [0xe8891a, 0xf0c01c, 0x1299a8, 0xd10070, 0x1e3a8a, 0x60f830, 0x9050c8, 0xf858c0];
  colors.forEach((color, i) => {
    const theta = (i / colors.length) * Math.PI * 2;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.1 })
    );
    mesh.position.set(Math.cos(theta) * 1.85, Math.sin(theta) * 1.85, 0);
    group.add(mesh);
  });
  scene.add(group);

  function resize() {
    const parent = canvas!.parentElement!;
    const w = parent.clientWidth || 400;
    const h = parent.clientHeight || 400;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  canvas.hidden = false;
  flat.hidden = true;
  if (cssFallback) cssFallback.hidden = true;

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
  });
  io.observe(canvas);

  let t = 0;
  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    t += 0.008;
    group.rotation.y = Math.sin(t) * 0.45;
    group.rotation.x = Math.cos(t * 0.7) * 0.12;
    renderer.render(scene, camera);
  }
  tick();
}

logo3d().catch(() => {
  if (canvas) canvas.hidden = true;
  if (flat) flat.hidden = true;
  if (cssFallback) cssFallback.hidden = false;
});
