const ResumeRenderer = (() => {
  function render(resume) {
    if (!resume) return;

    const downloadUrl = ResumeService.getDownloadUrl();

    const buttons = document.querySelectorAll(
      '.nav__resume, .hero__buttons .btn--outline, .cta__buttons .btn--outline'
    );

    buttons.forEach((btn) => {
      if (btn.tagName === 'A') {
        btn.href = downloadUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
      }
    });
  }

  return { render };
})();
