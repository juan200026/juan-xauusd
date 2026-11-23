// Add the WhatsApp number in international format, digits only, e.g. 573001234567.
const WHATSAPP_NUMBER = '573148177501';

// A calmer, wider-spaced conceptual candle series for the phone illustration.
const candleRoot = document.querySelector('#candles');
const candleData = Array.from({ length: 34 }, (_, i) => {
  const trend = 72 - i * 1.72;
  const wave = Math.sin(i * 0.78) * 8 + Math.sin(i * 0.29) * 5;
  return Math.max(10, Math.min(84, trend + wave));
});
if (candleRoot) candleData.forEach((price, i) => {
  const candle = document.createElement('i');
  const bullish = i === 0 || price < candleData[i - 1];
  const bodyHeight = 5 + ((i * 7) % 8);
  const bodyTop = Math.max(3, Math.min(86, price - (bullish ? bodyHeight : 0)));
  const wickTop = Math.max(0, bodyTop - (3 + (i * 3) % 7));
  const wickBottom = Math.min(100, bodyTop + bodyHeight + (3 + (i * 5) % 8));
  candle.className = 'candle';
  candle.style.setProperty('--c', bullish ? '#d2b578' : '#e6e3dc');
  candle.style.setProperty('--wick-top', `${wickTop}%`);
  candle.style.setProperty('--wick-height', `${wickBottom - wickTop}%`);
  candle.style.setProperty('--body-top', `${bodyTop}%`);
  candle.style.setProperty('--body-height', `${bodyHeight}%`);
  candle.style.animationDelay = `${(i % 8) * -0.34}s`;
  candleRoot.appendChild(candle);
});

const nav = document.querySelector('.nav nav');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

const WHATSAPP_MESSAGE = 'Hola Juan, quiero conocer más sobre tu mentoría de trading.';
const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : '';
document.querySelectorAll('.whatsapp-cta').forEach(link => {
  const hint = document.querySelector('.config-hint');
  if (whatsappHref) {
    link.href = whatsappHref;
    link.target = '_blank';
    link.rel = 'noopener';
  } else {
    link.href = '#contacto';
    link.removeAttribute('target');
    link.addEventListener('click', event => {
      event.preventDefault();
      if (hint) hint.hidden = false;
      hint?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
if (whatsappHref) document.querySelector('.config-hint')?.setAttribute('hidden', '');


// Clearly disclosed illustrative profit animation; it never represents a live trade.
(() => {
  const first = document.querySelector('#profit-value-a');
  const second = document.querySelector('#profit-value-b');
  const total = document.querySelector('#profit-value');
  const phone = document.querySelector('.phone');
  if (!first || !second || !total || !phone || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const duration = 60000;
  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;
  let lastPaint = 0;
  let visible = false;
  const cents = amount => Math.round((amount + Number.EPSILON) * 100) / 100;
  const format = amount => `+$${cents(amount).toFixed(2)}`;
  const render = (a, b) => {
    const shownA = cents(a);
    const shownB = cents(b);
    first.textContent = format(shownA);
    second.textContent = format(shownB);
    total.textContent = format(shownA + shownB);
  };
  const tick = now => {
    if (!visible || document.visibilityState !== 'visible') { frame = 0; lastFrame = 0; return; }
    if (!lastFrame) lastFrame = now;
    const delta = Math.min(now - lastFrame, 120);
    lastFrame = now;
    elapsed += delta;
    if (elapsed <= duration) {
      if (now - lastPaint >= 85 || elapsed >= duration) {
        const progress = Math.min(elapsed / duration, 1);
        const eased = 0.2 * progress + 0.8 * progress * progress * (3 - 2 * progress);
        // Slow drift with clear, bounded pullbacks and pauses: illustrative, never a live result.
        const cycleA = Math.sin(elapsed / 4300 * Math.PI * 2 + 0.4) * 6 + Math.sin(elapsed / 1700 * Math.PI * 2) * 1.4;
        const cycleB = Math.sin(elapsed / 5100 * Math.PI * 2 + 1.7) * 3.2 + Math.sin(elapsed / 2200 * Math.PI * 2 + 0.8) * 0.7;
        const amountA = progress >= 1 ? 50 : Math.max(12.4, 12.4 + 37.6 * eased + cycleA);
        const amountB = progress >= 1 ? 25 : Math.max(6.2, 6.2 + 18.8 * eased + cycleB);
        render(amountA, amountB);
        lastPaint = now;
      }
    } else if (elapsed <= duration + 1450) {
      render(50, 25);
    } else {
      elapsed = 0;
      render(12.4, 6.2);
      total.classList.add('profit-reset');
      window.setTimeout(() => total.classList.remove('profit-reset'), 280);
    }
    frame = window.requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible && !frame && document.visibilityState === 'visible') frame = window.requestAnimationFrame(tick);
    if (!visible && frame) { window.cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
  }, { threshold: 0.15 });
  observer.observe(phone);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && visible && !frame) frame = window.requestAnimationFrame(tick);
    else if (document.visibilityState !== 'visible' && frame) { window.cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
  });
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const smallScreenMotion = window.matchMedia('(max-width: 700px)').matches;
const gsapReady = window.gsap && window.ScrollTrigger;
if (gsapReady) {
  document.body.classList.add('gsap-ready');
  gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) {
    gsap.set('[data-reveal-item], .week, [data-freedom-word]', { clearProps: 'all' });
  } else {
    const context = gsap.context(() => {
      // Build the hero in distinct beats while keeping the native page scroll.
      const hero = document.querySelector('#inicio');
      if (hero) {
        const phone = hero.querySelector('.phone');
        if (phone) {
          // Use one compositor-friendly transform loop; CSS keyframes remain as a graceful fallback.
          phone.style.animation = 'none';
          if (smallScreenMotion) gsap.set(phone, { rotation: 1.6 });
          gsap.to(phone, {
            y: -15,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            overwrite: 'auto'
          });
        }
        const heroIntro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroIntro
          .fromTo('.hero-copy .eyebrow', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45 })
          .fromTo('.hero-brand-title', { y: 30, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 -8% 0)', duration: 0.78 }, '-=0.12')
          .fromTo('.hero-tagline', { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, '-=0.22')
          .fromTo('.hero-copy>p', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.52 }, '-=0.08')
          .fromTo('.hero-actions>*', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.12 }, '-=0.12')
          .fromTo('.chart-scene', { autoAlpha: 0, filter: 'blur(7px)' }, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.8 }, '-=0.7')
          .fromTo('.hero-foot', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, '-=0.1');
        gsap.to('.hero-grid', { yPercent: smallScreenMotion ? 4 : 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } });
        gsap.to('.hero-glow', { xPercent: smallScreenMotion ? -4 : -8, yPercent: smallScreenMotion ? 3 : 7, scale: smallScreenMotion ? 1.04 : 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
      }

      // Section entries play once, leaving native scroll fully in control.
      gsap.utils.toArray('[data-story-section]').forEach(section => {
        const items = section.querySelectorAll('[data-reveal-item]');
        if (!items.length) return;
        gsap.fromTo(items,
          { y: 26, autoAlpha: 0, filter: 'blur(5px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.85, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 76%', once: true } }
        );
      });

      const pricePath = document.querySelector('.price-line path');
      if (pricePath) {
        const length = pricePath.getTotalLength();
        const priceDot = document.querySelector('.price-line-dot');
        const priceHalo = document.querySelector('.price-line-halo');
        gsap.set(pricePath, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pricePath, { strokeDashoffset: 0, ease: 'none', scrollTrigger: {
          trigger: '.intro', start: 'top 78%', end: 'bottom 60%', scrub: 0.8,
          onUpdate: self => {
            if (!priceDot || !priceHalo) return;
            const point = pricePath.getPointAtLength(length * self.progress);
            gsap.set([priceDot, priceHalo], { attr: { cx: point.x, cy: point.y }, autoAlpha: self.progress > 0.015 ? 1 : 0 });
          }
        }});
      }
      const intro = document.querySelector('.intro');
      if (intro) {
        gsap.to('.intro-market-art', { yPercent: smallScreenMotion ? -2 : -4, scale: smallScreenMotion ? 1.018 : 1.035, ease: 'none', scrollTrigger: {
          trigger: intro, start: 'top bottom', end: 'bottom top', scrub: 1.1, invalidateOnRefresh: true
        }});
        gsap.to('.intro-ambience', { xPercent: smallScreenMotion ? 1.4 : 3, yPercent: smallScreenMotion ? -1.5 : -3, ease: 'none', scrollTrigger: {
          trigger: intro, start: 'top bottom', end: 'bottom top', scrub: 1.3, invalidateOnRefresh: true
        }});
        const introStory = gsap.timeline({ scrollTrigger: {
          trigger: intro, start: 'top 80%', end: 'top 28%', scrub: 0.7, invalidateOnRefresh: true
        }});
        introStory
          .fromTo('.intro h2', { x: -18, autoAlpha: 0.35 }, {
            x: 0, autoAlpha: 1, duration: 0.72, ease: 'power2.out'
          })
          .fromTo('.intro-title-line-inner', { yPercent: 108, autoAlpha: 0.35 }, {
            yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.2, ease: 'power3.out'
          }, 0)
          .fromTo('.intro h2 em', { textShadow: '0 0 0 rgba(216,172,85,0)' }, {
            textShadow: '0 0 16px rgba(216,172,85,.2)', duration: 0.8, ease: 'power2.out'
          }, 0.28)
          .fromTo('.intro-right', { x: 24, autoAlpha: 0.25 }, {
            x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out'
          }, 0.12)
          .fromTo('.intro-right p', { y: 12, autoAlpha: 0.35 }, {
            y: 0, autoAlpha: 1, duration: 0.48, stagger: 0.18, ease: 'power2.out'
          }, 0.3)
          .fromTo('.intro-right .inline-arrow', { y: 8, autoAlpha: 0.25 }, {
            y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out'
          }, 0.68);
      }

      const rail = document.querySelector('.timeline-rail i');
      if (rail) gsap.fromTo(rail, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 68%', end: 'bottom 42%', scrub: 0.5 } });
      gsap.utils.toArray('[data-week]').forEach((week, index, weeks) => {
        ScrollTrigger.create({
          trigger: week,
          start: 'top 68%', end: 'bottom 42%',
          onEnter: () => weeks.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === index);
            item.classList.toggle('is-past', itemIndex < index);
          }),
          onEnterBack: () => weeks.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === index);
            item.classList.toggle('is-past', itemIndex < index);
          }),
          onLeave: () => { week.classList.remove('is-active'); week.classList.add('is-past'); },
          onLeaveBack: () => { week.classList.remove('is-active', 'is-past'); weeks.slice(index + 1).forEach(later => later.classList.remove('is-active', 'is-past')); }
        });
      });
      gsap.fromTo('.mentorship-head', { y: 18, autoAlpha: 0.55 }, { y: 0, autoAlpha: 1, duration: 0.7,
        scrollTrigger: { trigger: '.mentorship', start: 'top 76%', once: true } });

      gsap.fromTo('[data-freedom-atmosphere]', { yPercent: smallScreenMotion ? 3 : 7, scale: smallScreenMotion ? 1.03 : 1.08 }, {
        yPercent: smallScreenMotion ? -2 : -5, scale: 1, ease: 'none',
        scrollTrigger: { trigger: '#libertad', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
      const freedomIntro = document.querySelector('.freedom-intro');
      if (freedomIntro) {
        gsap.timeline({ scrollTrigger: {
          trigger: '#libertad', start: 'top 78%', end: 'top 22%', scrub: 0.8, invalidateOnRefresh: true
        }})
          .fromTo('.freedom-intro h2', { y: 24, autoAlpha: 0.3, clipPath: 'inset(0 0 34% 0)' }, {
            y: 0, autoAlpha: 1, clipPath: 'inset(0 0 -5% 0)', duration: 0.72, ease: 'power2.out'
          })
          .fromTo('.freedom-intro p', { y: 14, autoAlpha: 0.35 }, {
            y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out'
          }, 0.25);
      }
      const freedomStory = gsap.timeline({
        scrollTrigger: {
          trigger: '#libertad', start: 'top 78%', end: 'bottom 60%',
          scrub: 0.65, invalidateOnRefresh: true
        }
      });
      freedomStory
        .fromTo('[data-freedom-word]', { y: 18, autoAlpha: 0.24 }, {
          y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.44, ease: 'power2.out'
        })
        .fromTo('.freedom-closing', { y: 15, autoAlpha: 0.25 }, {
          y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out'
        }, '-=0.12');
      freedomStory.fromTo('.freedom-concepts b', { color: '#a59b83', textShadow: '0 0 0 rgba(216,172,85,0)' }, {
        color: '#ead29c', textShadow: '0 0 15px rgba(216,172,85,.18)', duration: 0.9, stagger: 0.44, ease: 'power1.out'
      }, 0);
      const freedomPlane = document.querySelector('[data-freedom-plane]');
      if (freedomPlane) gsap.fromTo(freedomPlane, { xPercent: -70, y: smallScreenMotion ? 4 : 8, autoAlpha: 0.3 }, {
        xPercent: smallScreenMotion ? 120 : 260, y: smallScreenMotion ? -4 : -8, autoAlpha: 0.72, ease: 'none',
        scrollTrigger: { trigger: '#libertad', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });

      const services = document.querySelector('#servicios');
      if (services) {
        const serviceStory = gsap.timeline({ scrollTrigger: {
          trigger: services, start: 'top 76%', end: 'bottom 30%', scrub: 0.55, invalidateOnRefresh: true
        }});
        serviceStory
          .fromTo('.services-heading', { y: 16, autoAlpha: 0.55 }, { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power2.out' })
          .fromTo('.service-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'none' }, '-=0.25')
          .fromTo('[data-service-card]', { y: 16, autoAlpha: 0.82 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.34, ease: 'power2.out' }, '-=0.1')
          .fromTo('[data-price]', { y: 6, autoAlpha: 0.9 }, { y: 0, autoAlpha: 1, duration: 0.38, stagger: 0.12, ease: 'power2.out' }, '-=0.5');
      }
      gsap.fromTo('.about-copy > p, .about-copy blockquote', { y: 18, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#sobre-mi', start: 'top 70%', once: true }
      });
      const contact = document.querySelector('#contacto');
      if (contact) {
        const contactStory = gsap.timeline({ scrollTrigger: {
          trigger: contact, start: 'top 78%', end: 'top 20%', scrub: 0.85, invalidateOnRefresh: true
        }});
        contactStory
          .fromTo('.contact > .section-kicker', { y: 8, autoAlpha: 0.35 }, {
            y: 0, autoAlpha: 1, duration: 0.2, ease: 'power2.out'
          })
          .fromTo('.contact-overline', { y: 12, autoAlpha: 0.25 }, {
            y: 0, autoAlpha: 1, duration: 0.34, ease: 'power2.out'
          }, 0.18)
          .fromTo('.contact-content h2', { y: 24, autoAlpha: 0.28, clipPath: 'inset(0 0 32% 0)' }, {
            y: 0, autoAlpha: 1, clipPath: 'inset(0 0 -5% 0)', duration: 0.72, ease: 'power2.out'
          }, 0.36)
          .fromTo('.contact-line', { scaleX: 0, transformOrigin: 'center' }, {
            scaleX: 1, duration: 0.32, ease: 'power2.out'
          }, 0.78)
          .fromTo('.contact-content>p', { y: 12, autoAlpha: 0.3 }, {
            y: 0, autoAlpha: 1, duration: 0.38, ease: 'power2.out'
          }, 0.9)
          .fromTo('.contact-btn', { y: 10, autoAlpha: 0.25 }, {
            y: 0, autoAlpha: 1, duration: 0.34, ease: 'power2.out'
          }, 1.02);
        gsap.to('.contact-glow', { xPercent: smallScreenMotion ? 2.5 : 5, yPercent: smallScreenMotion ? -2 : -4, scale: smallScreenMotion ? 1.04 : 1.08, ease: 'none', scrollTrigger: {
          trigger: contact, start: 'top bottom', end: 'bottom top', scrub: 1.2
        }});
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          contact.addEventListener('pointermove', event => {
            const bounds = contact.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
            const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
            contact.style.setProperty('--pointer-x', `${x}%`);
            contact.style.setProperty('--pointer-y', `${y}%`);
          }, { passive: true });
          contact.addEventListener('pointerleave', () => {
            contact.style.setProperty('--pointer-x', '50%');
            contact.style.setProperty('--pointer-y', '42%');
          }, { passive: true });
        }
      }
      gsap.utils.toArray('main > section[id]').forEach(section => {
        ScrollTrigger.create({ trigger: section, start: 'top 45%', end: 'bottom 45%',
          onToggle: self => {
            if (!self.isActive) return;
            document.querySelectorAll('.section-progress a').forEach(link => link.classList.toggle('active', link.hash === `#${section.id}`));
            document.querySelectorAll('.nav nav a').forEach(link => {
              if (link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            });
          }
        });
      });
      ScrollTrigger.refresh();
      // A later refresh catches the portrait and local background images when they finish loading.
      if (document.readyState !== 'complete') window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      else requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    window.addEventListener('pagehide', () => context.revert(), { once: true });
  }
} else {
  // All content stays available if scripts or local animation files fail to load.
  document.querySelectorAll('[data-week], [data-freedom-word]').forEach(node => node.style.opacity = 1);
}
