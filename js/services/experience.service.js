const ExperienceService = (() => {
  async function getAll(limit = 50) {
    const params = new URLSearchParams({
      sort: 'startDate',
      order: 'desc',
      limit: String(limit),
    });
    const url = `${apiURL('experience')}?${params}`;
    const data = await fetchJSON(url, { cacheTTL: 900000 });
    const items = data.data || [];
    items.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      return new Date(b.startDate) - new Date(a.startDate);
    });
    return items;
  }

  return { getAll };
})();
