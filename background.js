chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {},
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.windows.onFocusChanged.addListener(() => {
  processTabChange();
});

function processTabChange() {
  // get active tabs
  chrome.tabs.query({ active: true }, (tabs) => {
    console.log("tabs", tabs);
  });
}
