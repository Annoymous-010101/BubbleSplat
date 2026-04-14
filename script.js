const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const revealInViewport = () => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (
      rect.top < window.innerHeight * 1.06 &&
      rect.bottom > -window.innerHeight * 0.08
    ) {
      element.classList.add("is-visible");
      revealObserver.unobserve(element);
    }
  });
};

const tokenizeWordmark = () => {
  const wordmark = document.querySelector(".hero-wordmark");

  if (!wordmark || wordmark.dataset.tokenized === "true") {
    return;
  }

  const text = wordmark.textContent.trim();

  if (!text) {
    return;
  }

  wordmark.dataset.tokenized = "true";
  wordmark.classList.add("is-tokenized");
  wordmark.setAttribute("aria-label", text);
  wordmark.textContent = "";

  const fragment = document.createDocumentFragment();
  const bubbleLength = text.toLowerCase().startsWith("bubble") ? 6 : text.length;

  [...text].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "hero-wordmark-char";
    span.classList.add(index < bubbleLength ? "is-bubble" : "is-splat");
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--bubble-delay", `${index * 120}ms`);
    span.style.setProperty("--bubble-drift", `${(index % 4) * 20 + 6}ms`);
    span.style.setProperty(
      "--bubble-amplitude",
      `${0.72 + ((index * 37) % 41) / 100}`
    );

    if (char === " ") {
      span.classList.add("is-space");
      span.textContent = "\u00A0";
    } else {
      span.textContent = char;
    }

    fragment.appendChild(span);
  });

  wordmark.appendChild(fragment);
};

const tokenizeClaim = () => {
  const claim = document.querySelector(".hero-claim");

  if (!claim || claim.dataset.tokenized === "true") {
    return;
  }

  const text = claim.textContent.trim();

  if (!text) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    claim.dataset.tokenized = "true";
    return;
  }

  claim.dataset.tokenized = "true";
  claim.classList.add("is-tokenized");
  claim.setAttribute("aria-label", text);
  claim.textContent = "";

  const fragment = document.createDocumentFragment();
  const durationSeconds = Math.max(3.6, text.length * 0.052 + 0.62);

  [...text].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "hero-claim-char";
    span.setAttribute("aria-hidden", "true");
    span.style.animationDelay = `${index * 52}ms`;

    if (char === " ") {
      span.classList.add("is-space");
      span.textContent = "\u00A0";
    } else {
      span.textContent = char;
    }

    fragment.appendChild(span);
  });

  claim.style.setProperty("--claim-duration", `${durationSeconds}s`);
  claim.appendChild(fragment);
};

const settleReveal = () => {
  revealInViewport();
  window.setTimeout(revealInViewport, 180);
  window.setTimeout(revealInViewport, 900);
};

const heroImage = document.querySelector(".hero-visual img");
const heroSection = document.querySelector(".hero");

const syncHeader = () => {
  const headerContrast = window.scrollY < (heroSection?.offsetHeight || 0) * 0.6;
  document.body.classList.toggle("header-contrast", headerContrast);

  if (!heroImage) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.06, 22);
  heroImage.style.transform = `translateY(${offset}px) scale(1.015)`;
};

syncHeader();
tokenizeWordmark();
tokenizeClaim();
settleReveal();
window.addEventListener("DOMContentLoaded", settleReveal);
window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("scroll", revealInViewport, { passive: true });
window.addEventListener("resize", revealInViewport);
window.addEventListener("load", settleReveal);
window.addEventListener("pageshow", settleReveal);
window.addEventListener("hashchange", () => {
  settleReveal();
});
