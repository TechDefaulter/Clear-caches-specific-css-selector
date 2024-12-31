function monitorCSSSelector(selector) {
  const observer = new MutationObserver(() => {
    if (document.querySelector(selector)) {
      alert(`CSS selector "${selector}" detected!`);

      // Trigger additional actions, e.g., clear cookies or cache
      chrome.runtime.sendMessage({ action: "clearData" });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "monitorSelector" && message.selector) {
    monitorCSSSelector(message.selector);
  }
});
