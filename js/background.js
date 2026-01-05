let skToken = null;

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const headers = details.requestHeaders;
    for (const header of headers) {
      if (header.name.toLowerCase() === 'sk') {
        skToken = header.value;
        chrome.storage.local.set({skToken: header.value});
        console.log('SK Token captured:', header.value);
        break;
      }
    }
    return {requestHeaders: headers};
  },
  {urls: ["https://logistics.market.yandex.ru/*"]},
  ["requestHeaders", "blocking"]
);

// Отправка токена в content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSKToken") {
    sendResponse({skToken: skToken});
  }
});