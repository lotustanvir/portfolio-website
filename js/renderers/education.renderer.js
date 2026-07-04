const EducationRenderer = (() => {
  function formatDuration(startYear, endYear, isCurrent) {
    if (isCurrent || !endYear) return `${startYear} – Present`;
    return `${startYear} – ${endYear}`;
  }

  function buildItem(edu) {
    const item = document.createElement('div');
    item.className = 'timeline__item animate-fade-up';

    const safeDegree = escapeHTML(edu.degree);
    const safeDept = escapeHTML(edu.department || '');
    const safeInstitution = escapeHTML(edu.institution);
    const safeDesc = escapeHTML(edu.description || '');
    const safeCgpa = escapeHTML(edu.cgpa || '');

    const iconDiv = document.createElement('div');
    iconDiv.className = 'timeline__icon';
    iconDiv.setAttribute('aria-hidden', 'true');
    iconDiv.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5"/></svg>';
    item.appendChild(iconDiv);

    const card = document.createElement('div');
    card.className = 'timeline__card';

    const year = document.createElement('span');
    year.className = 'timeline__year';
    year.textContent = formatDuration(edu.startYear, edu.endYear, edu.isCurrent);
    card.appendChild(year);

    const titleParts = [safeDegree];
    if (safeDept) titleParts.push(`(${safeDept})`);
    const title = document.createElement('h3');
    title.className = 'timeline__title';
    title.textContent = titleParts.join(' ');
    card.appendChild(title);

    const sub = document.createElement('p');
    sub.className = 'timeline__subtitle';
    sub.textContent = safeInstitution;
    card.appendChild(sub);

    if (safeCgpa) {
      const meta = document.createElement('div');
      meta.className = 'timeline__meta';
      const metaItem = document.createElement('span');
      metaItem.className = 'timeline__meta-item';
      metaItem.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ';
      const label = (edu.isCurrent ? 'Current ' : '') + (safeCgpa.indexOf('.') !== -1 ? 'CGPA' : 'GPA') + ': ' + safeCgpa;
      metaItem.appendChild(document.createTextNode(label));
      meta.appendChild(metaItem);
      card.appendChild(meta);
    }

    if (safeDesc) {
      const desc = document.createElement('p');
      desc.className = 'timeline__desc';
      desc.textContent = safeDesc;
      card.appendChild(desc);
    }

    item.appendChild(card);
    return item;
  }

  function initScrollAnimations() {
    const els = document.querySelectorAll('.education .timeline__item.animate-fade-up');
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

  function render(educations) {
    const timeline = document.querySelector('.education .timeline');
    if (!timeline) return;

    if (!educations || educations.length === 0) return;

    const fragment = document.createDocumentFragment();
    educations.forEach((edu) => {
      fragment.appendChild(buildItem(edu));
    });

    timeline.innerHTML = '';
    timeline.appendChild(fragment);

    requestAnimationFrame(() => {
      initScrollAnimations();
    });
  }

  return { render };
})();
