const CertificatesRenderer = (() => {
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function buildCard(cert) {
    const card = document.createElement('div');
    card.className = 'cert-card animate-fade-up';

    const safeTitle = escapeHTML(cert.title);
    const safeIssuer = escapeHTML(cert.issuer);
    const safeDesc = escapeHTML(cert.description || '');
    const imageSrc = sanitizeURL(cert.image);
    const credLink = sanitizeURL(cert.credentialLink);
    const btnHref = credLink || '#';

    if (imageSrc) {
      const img = document.createElement('img');
      img.className = 'cert-card__icon';
      img.src = imageSrc;
      img.alt = safeTitle;
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:auto;aspect-ratio:16/11;object-fit:cover;padding:0;background:none;border-radius:8px;margin-bottom:8px;';
      card.appendChild(img);
    } else {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'cert-card__icon';
      iconDiv.setAttribute('aria-hidden', 'true');
      iconDiv.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5"/></svg>';
      card.appendChild(iconDiv);
    }

    const title = document.createElement('h3');
    title.className = 'cert-card__title';
    title.textContent = safeTitle;
    card.appendChild(title);

    const issuer = document.createElement('p');
    issuer.className = 'cert-card__issuer';
    issuer.textContent = safeIssuer;
    card.appendChild(issuer);

    const dateStr = formatDate(cert.issueDate);
    if (dateStr || safeDesc) {
      const meta = document.createElement('p');
      meta.className = 'cert-card__meta';
      const parts = [];
      if (dateStr) parts.push('Issued: ' + dateStr);
      if (safeDesc) parts.push(safeDesc);
      meta.textContent = parts.join(' · ');
      card.appendChild(meta);
    }

    if (credLink) {
      const idMatch = credLink.match(/[^/]+\/?$/);
      const credId = idMatch ? idMatch[0].replace(/\/$/, '') : '';
      if (credId && !credId.startsWith('http')) {
        const idEl = document.createElement('p');
        idEl.className = 'cert-card__id';
        idEl.textContent = 'Credential ID: ' + credId;
        card.appendChild(idEl);
      }
    }

    const btn = document.createElement('a');
    btn.href = btnHref;
    btn.className = 'cert-card__btn';
    if (credLink) {
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.textContent = 'View Credential';
    } else {
      btn.setAttribute('aria-disabled', 'true');
      btn.textContent = 'No Link Available';
    }
    card.appendChild(btn);

    return card;
  }

  function initScrollAnimations() {
    const els = document.querySelectorAll('.certifications .cert-card.animate-fade-up');
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

  function render(certificates) {
    const grid = document.querySelector('.certifications .cert__grid');
    if (!grid) return;

    if (!certificates || certificates.length === 0) return;

    const fragment = document.createDocumentFragment();
    certificates.forEach((cert) => {
      fragment.appendChild(buildCard(cert));
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);

    requestAnimationFrame(() => {
      initScrollAnimations();
    });
  }

  return { render };
})();
