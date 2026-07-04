const ProjectsRenderer = (() => {
  const CATEGORY_MAP = {
    WEB_DEVELOPMENT: 'web',
    DATA_ANALYTICS: 'analytics',
    RESEARCH: 'research',
  };

  const GRADIENT_CLASSES = [
    'project-card__image--cyan',
    'project-card__image--purple',
    'project-card__image--dark',
  ];

  const SVG_ICONS = {
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
    analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="10" width="3" height="10" rx="1"/><rect x="7" y="6" width="3" height="14" rx="1"/><rect x="12" y="4" width="3" height="16" rx="1"/><rect x="17" y="8" width="3" height="12" rx="1"/></svg>',
    research: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  };

  function mapCategory(apiCategory) {
    return CATEGORY_MAP[apiCategory] || apiCategory?.toLowerCase().replace(/_/g, '-') || 'web';
  }

  function buildCategoryString(project) {
    const tokens = [mapCategory(project.category)];
    if (project.technologies) {
      project.technologies.forEach((pt) => {
        if (pt.technology?.name) {
          tokens.push(pt.technology.name.toLowerCase());
        }
      });
    }
    return tokens.join(' ');
  }

  function pickGradient(index) {
    return GRADIENT_CLASSES[index % GRADIENT_CLASSES.length];
  }

  function pickIcon(category) {
    const key = mapCategory(category);
    if (key === 'analytics') return SVG_ICONS.analytics;
    if (key === 'research') return SVG_ICONS.research;
    return SVG_ICONS.default;
  }

  function statusHTML(status) {
    if (status === 'PUBLISHED') {
      return '<span class="project-card__status project-card__status--completed">Completed</span>';
    }
    return '<span class="project-card__status project-card__status--dev">In Development</span>';
  }

  function buildCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card animate-fade-up';
    card.setAttribute('data-category', buildCategoryString(project));

    const liveHref = sanitizeURL(project.liveDemo) || '#';
    const githubHref = sanitizeURL(project.github) || '#';
    const safeTitle = escapeHTML(project.title);
    const safeCategory = escapeHTML(project.category?.replace(/_/g, ' ') || 'Project');
    const safeDesc = escapeHTML(project.description || '');
    const imageSrc = sanitizeURL(project.image);
    const imageHtml = imageSrc
      ? `<img src="${imageSrc}" alt="${safeTitle}" class="project-card__image" loading="lazy" />`
      : `<div class="project-card__image-icon" aria-hidden="true">${pickIcon(project.category)}</div>`;

    card.innerHTML = `
      <div class="project-card__thumbnail">
        <div class="project-card__image ${pickGradient(index)}" style="${imageSrc ? '' : 'display:flex;align-items:center;justify-content:center;'}">
          ${imageHtml}
        </div>
        <div class="project-card__overlay">
          <span class="project-card__category">${safeCategory}</span>
          <div class="project-card__overlay-links">
            <a href="${liveHref}" target="_blank" rel="noopener noreferrer" class="project-card__overlay-btn" aria-label="Live Demo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <a href="${githubHref}" target="_blank" rel="noopener noreferrer" class="project-card__overlay-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href="#" class="project-card__overlay-btn" aria-label="View Details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
            </a>
          </div>
        </div>
        ${statusHTML(project.status)}
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${safeTitle}</h3>
        <p class="project-card__description">${safeDesc}</p>
        <div class="project-card__techs">
          ${(project.technologies || []).map(pt => `<span class="project-tech">${escapeHTML(pt.technology?.name || 'Tech')}</span>`).join('')}
        </div>
        <div class="project-card__actions">
          <a href="${liveHref}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">Live Demo</a>
          <a href="${githubHref}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--sm">GitHub</a>
          <a href="#" class="btn btn--ghost btn--sm">Details</a>
        </div>
      </div>
    `;

    return card;
  }

  function rebindFilter(grid) {
    const filterContainer = document.querySelector('.projects__filter');
    if (!filterContainer) return;
    filterContainer.removeEventListener('click', handleFilterClick);
    filterContainer.addEventListener('click', handleFilterClick);
  }

  function handleFilterClick(e) {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const filterContainer = btn.closest('.projects__filter');
    const grid = document.querySelector('.projects__grid');
    if (!filterContainer || !grid) return;

    filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    const cards = grid.querySelectorAll('.project-card');

    cards.forEach((card) => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  }

  function render(projects) {
    const grid = document.querySelector('.projects__grid');
    if (!grid) return;

    if (!projects || projects.length === 0) return;

    const fragment = document.createDocumentFragment();

    projects.forEach((project, i) => {
      const card = buildCard(project, i);
      fragment.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);

    requestAnimationFrame(() => {
      const newCards = grid.querySelectorAll('.project-card');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      newCards.forEach((card) => observer.observe(card));
    });

    rebindFilter(grid);
  }

  return { render };
})();
