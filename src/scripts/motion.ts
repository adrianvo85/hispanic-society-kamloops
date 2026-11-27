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
  const threshold = hero ? Math.min(window.innerHeight * 0.62, 480) : 0;
  nav.classList.toggle("is-light", window.scrollY > threshold || !hero);
}
setNav();
window.addEventListener("scroll", setNav, { passive: true });

const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
toggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});
document.querySelectorAll("[data-nav-links] a").forEach((a) => {
  a.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

if (!reduce) {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.085 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
const poster = document.querySelector<HTMLElement>("[data-hero-poster]");
const videoBtn = document.querySelector<HTMLButtonElement>("[data-hero-toggle]");
function setVideoUi(playing: boolean) {
  if (!videoBtn) return;
  const pause = videoBtn.closest("body") && document.documentElement.lang.startsWith("es") ? "Pausar video" : null;
  // labels come from the initial button text / a data attribute if present
  videoBtn.textContent = playing
    ? (videoBtn.dataset.pauseLabel || videoBtn.textContent || "Pause")
    : (videoBtn.dataset.playLabel || "Play");
}
if (video && videoBtn) {
  const pauseLabel = videoBtn.textContent || "Pause video";
  videoBtn.dataset.pauseLabel = pauseLabel;
  // Play label is swapped in JS; keep a simple English/Spanish guess from the pause label
  videoBtn.dataset.playLabel = /pausar/i.test(pauseLabel) ? "Reproducir video" : "Play video";
  if (reduce) {
    video.removeAttribute("autoplay");
    video.pause();
    video.setAttribute("hidden", "");
    poster?.removeAttribute("hidden");
    videoBtn.hidden = true;
  } else {
    video.play().catch(() => {
      poster?.removeAttribute("hidden");
    });
    videoBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        setVideoUi(true);
      } else {
        video.pause();
        setVideoUi(false);
      }
    });
  }
}

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
  if (e.key === "Escape") {
    layer?.classList.remove("open");
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});
