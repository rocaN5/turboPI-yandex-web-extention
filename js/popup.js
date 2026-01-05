document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const url = new URL(tabs[0].url);
      const targetPattern = /^https:\/\/logistics\.market\.yandex\.ru\/sorting-center\/21972131\/.*$/;
      const bodyStyle = targetPattern.test(url.href) ? 'unset' : 'saturate(0)';
  
      document.body.style.filter = bodyStyle;
    });
  });
  