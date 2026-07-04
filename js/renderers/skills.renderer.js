const SkillsRenderer = (() => {
  const CATEGORY_ICONS = {
    'Programming Languages': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    'Frontend Development': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
    'Backend Development': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg>',
    'Database': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    'Data Analytics': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    'Business Analysis': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    'Capital Market Research': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'Creative Design': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    'Soft Skills': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  };

  function groupByCategory(skills) {
    const map = {};
    const order = [];

    skills.forEach((skill) => {
      const cat = skill.category || 'Other';
      if (!map[cat]) {
        map[cat] = { category: cat, skills: [], minOrder: skill.displayOrder ?? 999 };
        order.push(map[cat]);
      }
      map[cat].skills.push(skill);
      if ((skill.displayOrder ?? 999) < map[cat].minOrder) {
        map[cat].minOrder = skill.displayOrder ?? 999;
      }
    });

    order.sort((a, b) => a.minOrder - b.minOrder);
    return order;
  }

  function buildSkillItem(skill) {
    const div = document.createElement('div');
    div.className = 'skill-item';
    div.setAttribute('data-progress', String(skill.percentage));
    const nameSpan = document.createElement('span');
    nameSpan.className = 'skill-item__name';
    nameSpan.textContent = skill.name;
    const bar = document.createElement('div');
    bar.className = 'skill-item__bar';
    const fill = document.createElement('div');
    fill.className = 'skill-item__fill';
    const pct = document.createElement('span');
    pct.className = 'skill-item__percent';
    pct.textContent = `${skill.percentage}%`;
    fill.appendChild(pct);
    bar.appendChild(fill);
    div.appendChild(nameSpan);
    div.appendChild(bar);
    return div;
  }

  function buildSkillGroup(group) {
    const div = document.createElement('div');
    div.className = 'skill-group animate-fade-up';

    const iconSvg = CATEGORY_ICONS[group.category] || CATEGORY_ICONS['Programming Languages'];

    const header = document.createElement('div');
    header.className = 'skill-group__header';
    const iconDiv = document.createElement('div');
    iconDiv.className = 'skill-group__icon';
    iconDiv.setAttribute('aria-hidden', 'true');
    iconDiv.innerHTML = iconSvg;
    const title = document.createElement('h3');
    title.className = 'skill-group__title';
    title.textContent = group.category;
    header.appendChild(iconDiv);
    header.appendChild(title);
    div.appendChild(header);

    const itemsFrag = document.createDocumentFragment();

    group.skills?.forEach((skill) => {
      itemsFrag.appendChild(buildSkillItem(skill));
    });

    itemsContainer.appendChild(itemsFrag);
    return div;
  }

  function initProgressBars() {
    const fills = document.querySelectorAll('.skill-item__fill');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const progress = fill.closest('.skill-item')?.getAttribute('data-progress');
            if (progress) {
              fill.style.setProperty('--progress', `${progress}%`);
              fill.classList.add('animated');
            }
            observer.unobserve(fill);
          }
        });
      },
      { threshold: 0.2 }
    );
    fills.forEach((fill) => observer.observe(fill));
  }

  function initScrollAnimations() {
    const els = document.querySelectorAll('.skill-group.animate-fade-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach((el) => observer.observe(el));
  }

  function render(skills) {
    const grid = document.querySelector('.skills__grid');
    if (!grid) return;

    if (!skills || skills.length === 0) return;

    const groups = groupByCategory(skills);
    const fragment = document.createDocumentFragment();

    groups.forEach((g) => {
      fragment.appendChild(buildSkillGroup(g));
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);

    requestAnimationFrame(() => {
      initScrollAnimations();
      initProgressBars();
    });
  }

  return { render };
})();
