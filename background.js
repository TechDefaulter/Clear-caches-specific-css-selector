const monitoredSelectors = new Set(); // Store monitored selectors

// Listen for messages from popup.js and content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "monitorSelector" && message.selector) {
    monitoredSelectors.add(message.selector);
    // Save selectors in local storage so they persist
    chrome.storage.local.set({
      monitoredSelectors: Array.from(monitoredSelectors),
    });
    console.log(`Monitoring added for selector: ${message.selector}`);
    sendResponse({
      success: true,
      message: `Selector "${message.selector}" is now being monitored.`,
    });
  }

  if (message.action === "clearDataOnMatch") {
    console.log(
      `Clearing data because selector "${message.selector}" was found.`
    );

    // Clear specified browsing data
    chrome.browsingData.remove(
      {
        since: 0, // Clear data from the beginning
      },
      {
        cache: true,
        cookies: false,
        history: false,
        localStorage: false,
      },
      () => {
        console.log("Data cleared successfully on selector match.");
      }
    );

    sendResponse({ success: true, message: "Data cleared on selector match." });
  }

  if (message.action === "clearData") {
    chrome.browsingData.remove(
      {
        since: message.since || 0,
      },
      {
        cache: message.cache || false,
        cookies: message.cookies || false,
        history: message.history || false,
        localStorage: message.localStorage || false,
      },
      () => {
        sendResponse({ success: true, message: "Data cleared successfully!" });
      }
    );
    return true; // Keeps the sendResponse callback valid.
  }
});

// Load previously monitored selectors on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("monitoredSelectors", (data) => {
    if (data.monitoredSelectors) {
      data.monitoredSelectors.forEach((selector) =>
        monitoredSelectors.add(selector)
      );
      console.log(
        "Restored monitored selectors:",
        Array.from(monitoredSelectors)
      );
    }
  });
});

// Clear selectors on browser installation or reloading the extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("monitoredSelectors", (data) => {
    if (data.monitoredSelectors) {
      data.monitoredSelectors.forEach((selector) =>
        monitoredSelectors.add(selector)
      );
      console.log(
        "Initialized monitored selectors:",
        Array.from(monitoredSelectors)
      );
    }
  });
});
