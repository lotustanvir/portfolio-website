const EducationService = (() => {
  async function getAll(limit = 20) {
    const params = new URLSearchParams({
      sort: 'startYear',
      order: 'desc',
      limit: String(limit),
    });
    const url = `${apiURL('education')}?${params}`;
    const data = await fetchJSON(url, { cacheTTL: 1800000 });
    return data.data || [];
  }

  return { getAll };
})();
