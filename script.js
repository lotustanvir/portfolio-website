'use strict';

// ============================================
//              DOM REFERENCES
// ============================================
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');
const navLinks = document.querySelectorAll('.nav__link');
const typingText = document.getElementById('typingText');
const cursorGlow = document.getElementById('cursorGlow');
const themeToggle = document.getElementById('themeToggle');
const statCounters = document.querySelectorAll('.stat-counter');
const statCards = document.querySelectorAll('.stat-card');
const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-scale, .animate-slide-left, .animate-slide-right, .animate-fade-down, .animate-fade-left, .animate-zoom');
const loader = document.getElementById('loader');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// ============================================
//              TYPING ANIMATION
// ============================================
const roles = [
  'Full Stack Developer',
  'Software Engineering Student',
  'Business Analyst',
  'Data Analyst',
  'Creative Designer',
  'Capital Market Researcher'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeRole() {
  if (!typingText) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingText.textContent = currentRole.substring(0, charIndex);

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    typingTimeout = setTimeout(typeRole, 2000);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typingTimeout = setTimeout(typeRole, 400);
    return;
  }

  const speed = isDeleting ? 40 : 80;
  typingTimeout = setTimeout(typeRole, speed);
}

if (typingText) {
  typeRole();
}

// ============================================
//           PROJECT FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const categories = card.getAttribute('data-category').split(' ');
        if (categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  });
});

// ============================================
//              NAVBAR SCROLL
// ============================================
function handleNavScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ============================================
//              MOBILE MENU
// ============================================
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (!hamburger) return;
    hamburger.classList.remove('active');
    navList.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', (e) => {
  if (!hamburger) return;
  if (e.key === 'Escape' && navList.classList.contains('open')) {
    hamburger.classList.remove('active');
    navList.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// ============================================
//              ACTIVE NAV LINK
// ============================================
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 150;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ============================================
//              CURSOR GLOW
// ============================================
let cursorX = -200;
let cursorY = -200;
let glowX = -200;
let glowY = -200;
let cursorAnimationId;
let cursorIdleTimer;

function updateCursorGlow() {
  if (!cursorGlow) return;
  glowX += (cursorX - glowX) * 0.08;
  glowY += (cursorY - glowY) * 0.08;
  cursorGlow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
  cursorAnimationId = requestAnimationFrame(updateCursorGlow);
}

function startCursorGlow(x, y) {
  if (!cursorGlow) return;
  cursorX = x;
  cursorY = y;
  glowX = x;
  glowY = y;
  cancelAnimationFrame(cursorAnimationId);
  cursorAnimationId = requestAnimationFrame(updateCursorGlow);
}

function stopCursorGlow() {
  cancelAnimationFrame(cursorAnimationId);
  cursorAnimationId = null;
}

if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (!cursorAnimationId) {
      glowX = cursorX;
      glowY = cursorY;
      cursorAnimationId = requestAnimationFrame(updateCursorGlow);
    }
    clearTimeout(cursorIdleTimer);
    cursorIdleTimer = setTimeout(stopCursorGlow, 2000);
    cursorGlow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    stopCursorGlow();
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });
}

// ============================================
//              PARTICLES
// ============================================
const canvasContainer = document.getElementById('particles-canvas');
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
canvasContainer.appendChild(canvas);
const ctx = canvas.getContext('2d');

let particles = [];
let particleCount;
let particleAnimationId;

function resizeParticles() {
  const rect = canvasContainer.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[j].x - p.x;
      const dy = particles[j].y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });

  particleAnimationId = requestAnimationFrame(drawParticles);
}

function initParticles() {
  resizeParticles();
  createParticles();
  if (particleAnimationId) cancelAnimationFrame(particleAnimationId);
  drawParticles();
}

initParticles();

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initParticles, 200);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(particleAnimationId);
  cancelAnimationFrame(cursorAnimationId);
  if (circleAnimId != null) cancelAnimationFrame(circleAnimId);
});

// ============================================
//              SCROLL ANIMATIONS (IO)
// ============================================
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => scrollObserver.observe(el));

// Observe stat cards
statCards.forEach(card => scrollObserver.observe(card));

// Mark initially visible elements immediately
function checkInitialVisibility() {
  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
      scrollObserver.unobserve(el);
    }
  });
}

checkInitialVisibility();

// ============================================
//           SKILL BAR ANIMATIONS
// ============================================
const skillFills = document.querySelectorAll('.skill-item__fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const progress = fill.closest('.skill-item').getAttribute('data-progress');
      fill.style.setProperty('--progress', `${progress}%`);
      fill.classList.add('animated');
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.2 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ============================================
//              COUNTER ANIMATION
// ============================================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.getAttribute('data-target'));
      animateCounter(counter, target);
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

statCounters.forEach(counter => counterObserver.observe(counter));

function animateCounter(element, target) {
  let current = 0;
  const increment = Math.max(1, Math.floor(target / 60));
  const duration = 1500;
  const stepTime = Math.floor(duration / target);

  function update() {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      return;
    }
    element.textContent = current;
    setTimeout(update, stepTime);
  }

  update();
}

// ============================================
//              CARD TILT EFFECT
// ============================================
function applyTilt(elements, intensity = 6) {
  elements.forEach(el => {
    el.style.willChange = 'transform';
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    }, { passive: true });
  });
}

const tiltConfigs = [
  [statCards],
  [document.querySelectorAll('.timeline__card'), 4],
  [document.querySelectorAll('.about__info-item'), 3],
  [document.querySelectorAll('.skill-group'), 3],
  [document.querySelectorAll('.service-card'), 4],
  [document.querySelectorAll('.cert-card'), 4],
  [document.querySelectorAll('.tech-card'), 3],
  [document.querySelectorAll('.project-card'), 4],
  [document.querySelectorAll('.analytics-card'), 4],
  [document.querySelectorAll('.research-card'), 4],
  [document.querySelectorAll('.achievement-card'), 4],
  [document.querySelectorAll('.profile-card-sm'), 3],
  [document.querySelectorAll('.testimonial-card'), 4]
];

tiltConfigs.forEach(([el, intensity = 6]) => applyTilt(el, intensity));

// ============================================
//              SMOOTH ANCHOR SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
//        GRADIENT CIRCLES ANIMATION
// ============================================
const gradientCircles = document.querySelectorAll('.gradient-circle');
const circleOffsets = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 }
];
let mouseX = 0;
let mouseY = 0;
let circleAnimId;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateGradientCircles(time) {
  gradientCircles.forEach((circle, i) => {
    const speed = (i + 1) * 10;
    const floatX = Math.sin(time * 0.0005 + i * 2) * 25;
    const floatY = Math.cos(time * 0.0006 + i * 1.5) * 25;
    const scale = 1 + Math.sin(time * 0.0004 + i * 3) * 0.08;
    const paraX = mouseX * speed;
    const paraY = mouseY * speed;

    circle.style.transform = `translate(${floatX + paraX}px, ${floatY + paraY}px) scale(${scale})`;
  });

  circleAnimId = requestAnimationFrame(animateGradientCircles);
}

animateGradientCircles(0);

// ============================================
//              LOADING SCREEN
// ============================================
function hideLoader() {
  loader.classList.add('hidden');
  document.body.classList.add('loaded');
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 2000);
});

// Fallback: hide loader after 4s regardless
setTimeout(hideLoader, 4000);

// ============================================
//              BACK TO TOP
// ============================================
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTop.style.opacity = '0';
  backToTop.style.transform = 'translateY(20px)';
  backToTop.style.transition = 'all 0.3s ease';
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    if (backToTop) {
      backToTop.style.opacity = '1';
      backToTop.style.transform = 'translateY(0)';
    }
  } else {
    if (backToTop) {
      backToTop.style.opacity = '0';
      backToTop.style.transform = 'translateY(20px)';
    }
  }
}, { passive: true });

// ============================================
//           CONTACT FORM VALIDATION
// ============================================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateInput(input) {
  const value = input.value.trim();
  const isEmail = input.type === 'email';
  let hasError = false;

  if (value === '') {
    hasError = true;
  } else if (isEmail && !emailRegex.test(value)) {
    hasError = true;
  }

  input.classList.toggle('error', hasError);
  input.classList.toggle('success', !hasError && value !== '');
  input.setAttribute('aria-invalid', hasError);
  return !hasError;
}

if (contactForm) {
  const formInputs = contactForm.querySelectorAll('.form-input');

  formInputs.forEach(input => {
    input.setAttribute('aria-required', input.hasAttribute('required'));

    input.addEventListener('blur', () => validateInput(input));

    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateInput(input);
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    formInputs.forEach(input => {
      if (!validateInput(input)) valid = false;
    });

    if (valid) {
      const btn = contactForm.querySelector('.contact__submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent!</span>';
      btn.style.pointerEvents = 'none';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.pointerEvents = '';
        contactForm.reset();
        formInputs.forEach(i => {
          i.classList.remove('success');
          i.setAttribute('aria-invalid', 'false');
        });
      }, 3000);
    }
  });
}

// ============================================
//           THEME PERSISTENCE (LocalStorage)
// ============================================
function applyTheme(theme) {
  if (!themeToggle) return;
  if (theme === 'light') {
    document.body.classList.add('light');
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    document.body.classList.remove('light');
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  if (themeToggle) {
    applyTheme(savedTheme);
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ============================================
//       EXTRA SCROLL ANIMATIONS (new classes)
// ============================================
document.querySelectorAll('.animate-fade-down, .animate-fade-left, .animate-zoom').forEach(el => scrollObserver.observe(el));

// Keyboard nav: handled by CSS :focus-visible — no JS needed

// ============================================
//      MICRO-INTERACTION: RIPPLE ON BUTTONS
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;border-radius:50%;background:rgba(255,255,255,0.15);transform:scale(0);animation:rippleAnim 0.5s ease-out forwards;pointer-events:none;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// ============================================
//   MICRO-INTERACTION: MAGNETIC SOCIAL ICONS
// ============================================
document.querySelectorAll('.contact-social').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});
