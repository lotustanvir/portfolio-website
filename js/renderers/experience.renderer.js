const ExperienceRenderer = (() => {
  const ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  ];

  const EMPLOYMENT_TYPE_LABELS = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
    REMOTE: 'Remote',
    FREELANCE: 'Freelance',
  };

  function formatEmploymentType(type) {
    return EMPLOYMENT_TYPE_LABELS[type] || type?.replace(/_/g, ' ') || '';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatDuration(startDate, endDate, isCurrent) {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} – ${end}`;
  }

  function parseResponsibilities(responsibilities) {
    if (!responsibilities) return [];
    try {
      const parsed = JSON.parse(responsibilities);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (_) {
      // not JSON
    }
    return responsibilities.split('\n').map((l) => l.trim()).filter(Boolean);
  }

  function buildItem(exp, index) {
    const item = document.createElement('div');
    item.className = `timeline__item animate-fade-up${exp.isCurrent ? ' timeline__item--current' : ''}`;

    const iconSvg = ICONS[index % ICONS.length];
    let duties = parseResponsibilities(exp.responsibilities);
    duties = duties.map((d) => escapeHTML(d));
    const typeLabel = formatEmploymentType(exp.employmentType);
    const safePosition = escapeHTML(exp.position);
    const safeCompany = escapeHTML(exp.company);
    const safeDescription = escapeHTML(exp.description || '');

    const iconDiv = document.createElement('div');
    iconDiv.className = 'timeline__icon';
    iconDiv.setAttribute('aria-hidden', 'true');
    iconDiv.innerHTML = iconSvg;
    item.appendChild(iconDiv);

    const card = document.createElement('div');
    card.className = `timeline__card${exp.isCurrent ? ' timeline__card--current' : ''}`;

    if (exp.isCurrent) {
      const badge = document.createElement('div');
      badge.className = 'timeline__card-badge';
      badge.textContent = 'Current';
      card.appendChild(badge);
    }

    const year = document.createElement('span');
    year.className = 'timeline__year';
    year.textContent = formatDuration(exp.startDate, exp.endDate, exp.isCurrent) + (typeLabel ? ` · ${typeLabel}` : '');
    card.appendChild(year);

    const title = document.createElement('h3');
    title.className = 'timeline__title';
    title.textContent = safePosition;
    card.appendChild(title);

    const sub = document.createElement('p');
    sub.className = 'timeline__subtitle';
    sub.textContent = safeCompany;
    card.appendChild(sub);

    if (duties.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'timeline__responsibilities';
      duties.forEach((d) => {
        const li = document.createElement('li');
        li.textContent = d;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    } else if (exp.description) {
      const desc = document.createElement('p');
      desc.className = 'timeline__desc';
      desc.textContent = safeDescription;
      card.appendChild(desc);
    }

    if (exp.technologies && exp.technologies.length > 0) {
      const techs = document.createElement('div');
      techs.className = 'timeline__techs';
      exp.technologies.forEach((pt) => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = pt.technology?.name || 'Tech';
        techs.appendChild(tag);
      });
      card.appendChild(techs);
    }

    item.appendChild(card);
    return item;
  }

  function initScrollAnimations() {
    const els = document.querySelectorAll('.experience .timeline__item.animate-fade-up');
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

  function render(experiences) {
    const timeline = document.querySelector('.experience .timeline');
    if (!timeline) return;

    if (!experiences || experiences.length === 0) return;

    const fragment = document.createDocumentFragment();
    experiences.forEach((exp, i) => {
      fragment.appendChild(buildItem(exp, i));
    });

    timeline.innerHTML = '';
    timeline.appendChild(fragment);

    requestAnimationFrame(() => {
      initScrollAnimations();
    });
  }

  return { render };
})();
