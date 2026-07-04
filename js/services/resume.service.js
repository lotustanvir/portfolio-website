const ResumeService = (() => {
  async function getActive() {
    const url = apiURL('resume');
    const data = await fetchJSON(url, { cacheTTL: 3600000 });
    return data.data?.resume || null;
  }

  function getDownloadUrl() {
    return apiURL('resume/download');
  }

  return { getActive, getDownloadUrl };
})();
