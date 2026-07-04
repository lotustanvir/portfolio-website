const SkillsService = (() => {
  async function getAll(limit = 200) {
    const params = new URLSearchParams({
      sort: 'displayOrder',
      order: 'asc',
      limit: String(limit),
    });
    const url = `${apiURL('skills')}?${params}`;
    const data = await fetchJSON(url, { cacheTTL: 600000 });
    return data.data || [];
  }

  return { getAll };
})();
