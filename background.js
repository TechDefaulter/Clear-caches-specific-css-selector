chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clearData") {
    chrome.browsingData.remove(
      { since: 0 },
      {
        cache: true,
        cookies: true,
        history: false,
        localStorage: false,
      },
      () => {
        console.log("Cache and cookies cleared!");
      }
    );
  }
});
