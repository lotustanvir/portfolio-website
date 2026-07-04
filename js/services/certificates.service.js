const CertificatesService = (() => {
  async function getAll(limit = 50) {
    const params = new URLSearchParams({
      sort: 'issueDate',
      order: 'desc',
      limit: String(limit),
    });
    const url = `${apiURL('certificates')}?${params}`;
    const data = await fetchJSON(url, { cacheTTL: 1800000 });
    return data.data || [];
  }

  return { getAll };
})();
