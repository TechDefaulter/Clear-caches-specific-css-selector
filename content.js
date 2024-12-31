// Send a message to the background script when a monitored selector is found
function monitorSelectors() {
  chrome.storage.local.get("monitoredSelectors", (data) => {
    const monitoredSelectors = data.monitoredSelectors || [];
    monitoredSelectors.forEach((selector) => {
      if (document.querySelector(selector)) {
        console.log(`Selector "${selector}" found.`);
        chrome.runtime.sendMessage(
          { action: "clearDataOnMatch", selector },
          (response) => {
            if (response?.success) {
              console.log(`Action taken for selector: ${selector}`);
            }
          }
        );
      }
    });
  });
}

// Monitor DOM changes to detect selectors dynamically
const observer = new MutationObserver(() => {
  monitorSelectors();
});

observer.observe(document, { childList: true, subtree: true });

// Initial check for the selectors
monitorSelectors();
