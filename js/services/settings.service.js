const SettingsService = (() => {
  async function getPublic() {
    const data = await fetchJSON(apiURL('settings'));
    return data.data.settings;
  }

  return { getPublic };
})();
