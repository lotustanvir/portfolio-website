(function () {
  'use strict';

  async function loadSection(name, fetchFn, renderFn) {
    try {
      const data = await fetchFn();
      if (data) {
        renderFn(data);
      }
    } catch (_err) {
      // Backend unavailable — hardcoded HTML remains as fallback
    }
  }

  async function initPortfolio() {
    await loadSection('settings', SettingsService.getPublic, SettingsRenderer.render);
    await loadSection('projects', ProjectsService.getPublished, ProjectsRenderer.render);
    await loadSection('skills', SkillsService.getAll, SkillsRenderer.render);
    await loadSection('experience', ExperienceService.getAll, ExperienceRenderer.render);
    await loadSection('education', EducationService.getAll, EducationRenderer.render);
    await loadSection('resume', ResumeService.getActive, ResumeRenderer.render);
    await loadSection('certificates', CertificatesService.getAll, CertificatesRenderer.render);
    ContactRenderer.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
})();
