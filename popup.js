document.getElementById("clearForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cssSelector = document.getElementById("cssSelector").value;

  if (cssSelector) {
    if (isValidSelector(cssSelector)) {
      chrome.runtime.sendMessage(
        {
          action: "monitorSelector",
          selector: cssSelector,
        },
        (response) => {
          document.getElementById("status").textContent =
            response?.message || "Failed to add selector.";
        }
      );
    } else {
      document.getElementById("status").textContent = "Invalid CSS Selector!";
      return;
    }
  }

  // Perform cache clearing
  const dataToClear = {
    cache: document.getElementById("cache").checked,
    cookies: document.getElementById("cookies").checked,
    history: document.getElementById("history").checked,
    localStorage: document.getElementById("localStorage").checked,
  };

  const timeRange = document.getElementById("timeRange").value;
  const since = timeRange === "0" ? 0 : Date.now() - parseInt(timeRange);

  chrome.runtime.sendMessage(
    {
      action: "clearData",
      cache: dataToClear.cache,
      cookies: dataToClear.cookies,
      history: dataToClear.history,
      localStorage: dataToClear.localStorage,
      since,
    },
    (response) => {
      document.getElementById("status").textContent =
        response?.message || "Error clearing data.";
    }
  );
});

function isValidSelector(selector) {
  try {
    document.createDocumentFragment().querySelector(selector);
    return true;
  } catch {
    return false;
  }
}
