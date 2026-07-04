const ContactService = (() => {
  async function send(data) {
    const url = apiURL('contact');
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    return fetchJSON(url, options);
  }

  return { send };
})();
