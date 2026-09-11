import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Swal from 'sweetalert2';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export function initAppSetup() {
  if (window.__vinayakAppSetup) return;

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    lerp: 0.08,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  tippy('[data-tippy-content]', {
    allowHTML: true,
    animation: 'scale-subtle',
    theme: 'light-border',
  });

  window.Swal = Swal;
  window.__vinayakAppSetup = true;
}
