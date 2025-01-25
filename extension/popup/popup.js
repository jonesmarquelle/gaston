document.addEventListener('DOMContentLoaded', () => {
  const EMBED_PASSTHROUGH_URL = 'http://localhost:3000';
  // Get the current active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const finalUrl = `${EMBED_PASSTHROUGH_URL}/?url=${encodeURIComponent(url)}`;
    const urlDisplay = document.getElementById('url-display');
    urlDisplay.textContent = finalUrl;
  });

  // Copy URL functionality
  document.getElementById('copy-button').addEventListener('click', () => {
    const urlDisplay = document.getElementById('url-display');
    navigator.clipboard.writeText(urlDisplay.textContent).then(() => {
      const button = document.getElementById('copy-button');
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy URL';
      }, 1500);
    });
  });
}); 