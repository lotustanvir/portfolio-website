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

typeRole();

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
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navList.classList.toggle('open');
  document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navList.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navList.classList.contains('open')) {
    hamburger.classList.remove('active');
    navList.classList.remove('open');
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

function updateCursorGlow() {
  glowX += (cursorX - glowX) * 0.08;
  glowY += (cursorY - glowY) * 0.08;
  cursorGlow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
  cursorAnimationId = requestAnimationFrame(updateCursorGlow);
}

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (!cursorAnimationId) {
    glowX = cursorX;
    glowY = cursorY;
    cursorAnimationId = requestAnimationFrame(updateCursorGlow);
  }
});

document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursorGlow.style.opacity = '1';
});

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
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

applyTilt(statCards);
applyTilt(document.querySelectorAll('.timeline__card'), 4);
applyTilt(document.querySelectorAll('.about__info-item'), 3);
applyTilt(document.querySelectorAll('.skill-group'), 3);
applyTilt(document.querySelectorAll('.service-card'), 4);
applyTilt(document.querySelectorAll('.cert-card'), 4);
applyTilt(document.querySelectorAll('.tech-card'), 3);
applyTilt(document.querySelectorAll('.project-card'), 4);
applyTilt(document.querySelectorAll('.analytics-card'), 4);
applyTilt(document.querySelectorAll('.research-card'), 4);

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
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.style.opacity = '1';
    backToTop.style.transform = 'translateY(0)';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.transform = 'translateY(20px)';
  }
}, { passive: true });

backToTop.style.opacity = '0';
backToTop.style.transform = 'translateY(20px)';
backToTop.style.transition = 'all 0.3s ease';

// ============================================
//           CONTACT FORM VALIDATION
// ============================================
if (contactForm) {
  const formInputs = contactForm.querySelectorAll('.form-input');

  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.classList.add('error');
        input.classList.remove('success');
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('error');
        input.classList.remove('success');
      } else {
        input.classList.remove('error');
        input.classList.add('success');
      }
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error') && input.value.trim() !== '') {
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) return;
        input.classList.remove('error');
        input.classList.add('success');
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    formInputs.forEach(input => {
      if (input.value.trim() === '') {
        input.classList.add('error');
        input.classList.remove('success');
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('error');
        input.classList.remove('success');
        valid = false;
      } else {
        input.classList.remove('error');
        input.classList.add('success');
      }
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
        formInputs.forEach(i => { i.classList.remove('success'); });
      }, 3000);
    }
  });
}

// ============================================
//           THEME PERSISTENCE (LocalStorage)
// ============================================
function applyTheme(theme) {
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
  applyTheme(savedTheme);
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ============================================
//       EXTRA SCROLL ANIMATIONS (new classes)
// ============================================
const extraAnimElements = document.querySelectorAll('.animate-fade-down, .animate-fade-left, .animate-zoom');
extraAnimElements.forEach(el => scrollObserver.observe(el));

// ============================================
//        TILT FOR NEW CARDS
// ============================================
applyTilt(document.querySelectorAll('.achievement-card'), 4);
applyTilt(document.querySelectorAll('.profile-card-sm'), 3);
applyTilt(document.querySelectorAll('.testimonial-card'), 4);

// ============================================
//          KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Focus visible polyfill for keyboard users
document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
  el.addEventListener('focus', (e) => {
    if (document.body.classList.contains('keyboard-nav')) {
      e.target.style.outline = '2px solid var(--accent-1)';
      e.target.style.outlineOffset = '2px';
    }
  });
  el.addEventListener('blur', (e) => {
    e.target.style.outline = '';
  });
});
