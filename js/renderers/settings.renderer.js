const SettingsRenderer = (() => {
  function renderHero(settings) {
    const heroName = document.querySelector('.hero__name');
    const heroDesc = document.querySelector('.hero__description');

    if (settings.siteTitle && heroName) {
      heroName.textContent = settings.siteTitle;
    }
    if (settings.heroSubtitle && heroDesc) {
      heroDesc.textContent = settings.heroSubtitle;
    }
  }

  function renderAbout(settings) {
    const aboutTexts = document.querySelectorAll('.about__text');
    const infoValues = {
      name: document.querySelector('.about__info-item:nth-child(1) .about__info-value'),
      email: document.querySelector('.about__info-item:nth-child(5) .about__info-value'),
      phone: document.querySelector('.about__info-item:nth-child(6) .about__info-value'),
      location: document.querySelector('.about__info-item:nth-child(4) .about__info-value'),
    };

    if (settings.about && aboutTexts.length > 0) {
      const paragraphs = settings.about.split('\n').filter(Boolean);
      aboutTexts.forEach((el, i) => {
        if (paragraphs[i]) el.textContent = paragraphs[i];
      });
    }

    if (settings.siteTitle && infoValues.name) {
      infoValues.name.textContent = settings.siteTitle;
    }
    if (settings.email && infoValues.email) {
      infoValues.email.textContent = settings.email;
    }
    if (settings.phone && infoValues.phone) {
      infoValues.phone.textContent = settings.phone;
    }
    if (settings.location && infoValues.location) {
      infoValues.location.textContent = settings.location;
    }
  }

  function renderContact(settings) {
    const contactEmail = document.querySelector('.contact-info-card:nth-child(2) .contact-info-card__value');
    const contactPhone = document.querySelector('.contact-info-card:nth-child(3) .contact-info-card__value');
    const contactLocation = document.querySelector('.contact-info-card:nth-child(4) .contact-info-card__value');
    const contactName = document.querySelector('.contact-info-card:nth-child(1) .contact-info-card__value');

    if (settings.siteTitle && contactName) contactName.textContent = settings.siteTitle;
    if (settings.email && contactEmail) contactEmail.textContent = settings.email;
    if (settings.phone && contactPhone) contactPhone.textContent = settings.phone;
    if (settings.location && contactLocation) contactLocation.textContent = settings.location;
  }

  function renderSocialLinks(settings) {
    const links = {
      github: document.querySelector('.contact-social[aria-label="GitHub"]'),
      linkedin: document.querySelector('.contact-social[aria-label="LinkedIn"]'),
      facebook: document.querySelector('.contact-social[aria-label="Facebook"]'),
      instagram: document.querySelector('.contact-social[aria-label="Instagram"]'),
    };

    if (settings.github && links.github) links.github.href = settings.github;
    if (settings.linkedin && links.linkedin) links.linkedin.href = settings.linkedin;
    if (settings.facebook && links.facebook) links.facebook.href = settings.facebook;
    if (settings.instagram && links.instagram) links.instagram.href = settings.instagram;
  }

  function renderResumeButtons(settings) {
    if (!settings.resumeUrl) return;
    document.querySelectorAll('.nav__resume, .hero__buttons .btn--outline, .cta__buttons .btn--outline').forEach((btn) => {
      if (btn.tagName === 'A') btn.href = settings.resumeUrl;
    });
  }

  function renderNavFooter(settings) {
    const logo = document.querySelector('.nav__logo');
    if (settings.siteTitle && logo) logo.textContent = settings.siteTitle;

    if (settings.siteTitle) {
      document.title = `${settings.siteTitle} — ${settings.siteDescription || 'Portfolio'}`;
    }
  }

  function render(settings) {
    renderHero(settings);
    renderAbout(settings);
    renderContact(settings);
    renderSocialLinks(settings);
    renderNavFooter(settings);
  }

  return { render };
})();
