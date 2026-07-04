const ProjectsService = (() => {
  async function getPublished(limit = 6) {
    const params = new URLSearchParams({
      status: 'PUBLISHED',
      sort: 'createdAt',
      order: 'desc',
      limit: String(limit),
    });
    const url = `${apiURL('projects')}?${params}`;
    const data = await fetchJSON(url);
    const projects = data.data || [];
    projects.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return projects;
  }

  return { getPublished };
})();
