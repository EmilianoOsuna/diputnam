const root = document.querySelector<HTMLElement>('[data-putnam]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileViewport = window.matchMedia('(max-width: 767px)').matches;

if (root) {
  const processSteps = Array.from(root.querySelectorAll<HTMLElement>('[data-process-step]'));
  const processMedia = Array.from(root.querySelectorAll<HTMLElement>('[data-process-media]'));
  const processMarkers = Array.from(root.querySelectorAll<HTMLElement>('[data-process-marker]'));
  const processTrack = root.querySelector<HTMLElement>('[data-process-markers]');
  const lineProgress = root.querySelector<HTMLElement>('[data-line-progress]');
  const currentStep = root.querySelector<HTMLElement>('[data-process-current]');

  const setProcessStep = (activeIndex: number) => {
    processSteps.forEach((step, index) => {
      const active = index === activeIndex;
      step.classList.toggle('is-active', active);
      step.setAttribute('aria-hidden', String(!active));
    });
    processMedia.forEach((media, index) => {
      const active = index === activeIndex;
      media.classList.toggle('is-active', active);
      media.setAttribute('aria-hidden', String(!active));
    });
    if (currentStep) currentStep.textContent = String(activeIndex + 1).padStart(2, '0');
  };

  setProcessStep(0);

  if (mobileViewport || reducedMotion) {
    document.body.classList.add('is-native-motion');
    let progressFrame = 0;
    let trackTop = 0;
    let trackRange = 1;

    const measureTrack = () => {
      if (!processTrack) return;
      const rect = processTrack.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      trackRange = Math.max(1, processTrack.offsetHeight - window.innerHeight);
    };
    const updateProgress = () => {
      progressFrame = 0;
      if (!lineProgress) return;
      const progress = Math.min(1, Math.max(0, (window.scrollY - trackTop) / trackRange));
      lineProgress.style.transform = `scaleX(${progress})`;
    };
    const scheduleProgress = () => {
      if (progressFrame) return;
      progressFrame = window.requestAnimationFrame(updateProgress);
    };
    const refreshGeometry = () => {
      measureTrack();
      scheduleProgress();
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (!visible) return;
      const index = processMarkers.indexOf(visible.target as HTMLElement);
      if (index >= 0) setProcessStep(index);
    }, { rootMargin: '-45% 0px -45%', threshold: 0 });

    processMarkers.forEach((marker) => observer.observe(marker));
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', refreshGeometry, { passive: true });
    refreshGeometry();

    window.addEventListener('pagehide', () => {
      if (progressFrame) window.cancelAnimationFrame(progressFrame);
      observer.disconnect();
    }, { once: true });
  } else {
    void (async () => {
    const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('is-motion-ready');
    const lenis = new Lenis({ anchors: true, autoRaf: true, lerp: 0.09 });
    let scrollFrame = 0;
    let refreshFrame = 0;

    lenis.on('scroll', () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        ScrollTrigger.update();
      });
    });
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.from('.institutional-hero .section-kicker, .institutional-hero h1, .institutional-hero .hero-lead', {
        autoAlpha: 0,
        y: 34,
        duration: 1.15,
        stagger: 0.09,
        ease: 'power3.out',
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        if (group.closest('.institutional-hero')) return;
        gsap.from(Array.from(group.children), {
          autoAlpha: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      });

      processMarkers.forEach((marker, index) => {
        ScrollTrigger.create({
          trigger: marker,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setProcessStep(index),
          onEnterBack: () => setProcessStep(index),
        });
      });

      const refreshLayout = () => {
        if (refreshFrame) return;
        refreshFrame = window.requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
      };
      const heroImage = root.querySelector<HTMLImageElement>('.hero-frame img');
      if (heroImage) {
        if (heroImage.complete) refreshLayout();
        else heroImage.addEventListener('load', refreshLayout, { once: true });
      }
      window.addEventListener('resize', refreshLayout, { passive: true });

      gsap.to(lineProgress, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: processTrack, start: 'top top', end: 'bottom bottom', scrub: 0.45 },
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.fromTo(element, { yPercent: -4 }, {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        });
      });
      gsap.to('.cta-mark', {
        yPercent: -9,
        ease: 'none',
        scrollTrigger: { trigger: '.institutional-cta', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
      });
    }, root);

    window.addEventListener('pagehide', () => {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
      context.revert();
      lenis.destroy();
    }, { once: true });
    })();
  }
}
