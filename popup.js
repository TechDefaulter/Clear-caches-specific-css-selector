document.getElementById("clearForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cssSelector = document.getElementById("cssSelector").value;

  if (cssSelector) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: monitorCSSSelector,
        args: [cssSelector],
      });
    });
  }

  // Perform cache clearing as before
  const dataToClear = {
    cache: document.getElementById("cache").checked,
    cookies: document.getElementById("cookies").checked,
    history: document.getElementById("history").checked,
    localStorage: document.getElementById("localStorage").checked,
  };

  const timeRange = document.getElementById("timeRange").value;

  const since = Date.now() - parseInt(timeRange);

  chrome.browsingData.remove(
    {
      since: timeRange === "0" ? 0 : since,
    },
    {
      cache: dataToClear.cache,
      cookies: dataToClear.cookies,
      history: dataToClear.history,
      localStorage: dataToClear.localStorage,
    },
    () => {
      document.getElementById("status").textContent = "Selected data cleared!";
    }
  );
});

// Function to monitor CSS selector
function monitorCSSSelector(selector) {
  const observer = new MutationObserver(() => {
    if (document.querySelector(selector)) {
      alert(`CSS selector "${selector}" found!`);
      // Trigger additional actions if needed
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
