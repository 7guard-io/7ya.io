// Respect reduced motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
    document.querySelector(".hero").style.transition = "opacity 1.4s ease-out";
    document.querySelector(".hero").style.opacity = "0";
    setTimeout(() => {
        document.querySelector(".hero").style.opacity = "1";
    }, 50);
}
