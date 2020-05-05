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

    // check if first active tab exist
    if (tabs.length > 0 && tabs[0] !== null) {
      let currentTab = tabs[0];
      let url = currentTab.url;
      let title = currentTab.title;
      let hostName = url;

      try {
        let urlObject = new URL(url);
        hostName = urlObject.hostname;
      } catch (error) {
        console.log(
          `Could not construct url from ${currentTab.url}, error:${error}`
        );
      }

      chrome.storage.local.get(
        ["tabTimeObjectKey", "lastActiveTabKey"],
        (result) => {
          console.log("result", result);
        }
      );
    }
  });
}
