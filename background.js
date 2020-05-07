const tabTimeObjectKey = "tabTimesObject";
const lastActiveTabKey = "lastActiveTab";

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

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId == chrome.windows.WINDOW_ID_NONE) {
    processTabChange(false);
  } else {
    processTabChange(true);
  }
});

function processTabChange(isWindowActive) {
  // get active tabs
  chrome.tabs.query({ active: true }, (tabs) => {
    // console.log("tabs", tabs);

    // check if first active tab exist
    if (tabs.length > 0 && tabs[0] !== null) {
      let currentTab = tabs[0];
      let url = currentTab.url;
      let title = currentTab.title;
      let hostName = url;
      console.log(currentTab);

      try {
        if (currentTab.status === "loading") {
          console.log("Page is loading");
        } else {
          let urlObject = new URL(url);

          urlObject.protocol === "file:"
            ? (hostName = urlObject.origin)
            : (hostName = urlObject.hostname);
        }
      } catch (error) {
        console.log(
          `Could not construct url from ${currentTab.url}, error:${error}`
        );
      }

      chrome.storage.local.get(
        [tabTimeObjectKey, lastActiveTabKey],
        (result) => {
          // console.log("result", result);

          // get JSON obj from storage
          let lastActiveTabString = result[lastActiveTabKey];
          let tabTimeObjectString = result[tabTimeObjectKey];

          // parse objects to JS
          let tabTimeObject =
            tabTimeObjectString != null ? JSON.parse(tabTimeObjectString) : {};
          let lastActiveTab =
            lastActiveTabString != null ? JSON.parse(lastActiveTabString) : {};

          // console.log("lastActiveTab", lastActiveTab);

          // calculate passed time
          if (
            lastActiveTab.hasOwnProperty("url") &&
            lastActiveTab.hasOwnProperty("lastDateVal")
          ) {
            let lastUrl = lastActiveTab["url"];
            let currentDatVal_ = Date.now();
            let passedSeconds =
              (currentDatVal_ - lastActiveTab["lastDateVal"]) * 0.001;

            if (tabTimeObject.hasOwnProperty(lastUrl)) {
              // get url from last active tab and store it
              let lastUrlObjectInfo = tabTimeObject[lastUrl];

              // if has stored seconds, add to that value
              if (lastUrlObjectInfo.hasOwnProperty("trackedSeconds")) {
                lastUrlObjectInfo["trackedSeconds"] =
                  lastUrlObjectInfo["trackedSeconds"] + passedSeconds;
              } else {
                lastUrlObjectInfo["trackedSeconds"] = passedSeconds;
              }
              // update lastDateVal
              lastUrlObjectInfo["lastDateVal"] = currentDatVal_;
            } else {
              let newUrlInfo = {
                url: lastUrl,
                trackedSeconds: passedSeconds,
                lastDateVal: currentDatVal_,
              };
              tabTimeObject[lastUrl] = newUrlInfo;
            }
          }

          let currentDateValue = Date.now();

          let lastTabInfo = { url: hostName, lastDateVal: currentDateValue };

          // check if Chrome is in focus
          if (!isWindowActive) lastTabInfo = {};

          let newLastTabObject = {};
          // update
          newLastTabObject[lastActiveTabKey] = JSON.stringify(lastTabInfo);
          // console.log("newLastTabObject: ", newLastTabObject);

          // set newLastTabObject
          chrome.storage.local.set(newLastTabObject, () => {
            // console.log("lastActiveTab stored: " + hostName);
            const tabTimesObjectString = JSON.stringify(tabTimeObject);
            let newTabTimesObject = {};
            newTabTimesObject[tabTimeObjectKey] = tabTimesObjectString;

            // set newTabTimesObject
            chrome.storage.local.set(newTabTimesObject, () => {
              console.log("------------------------------");
            });
          });
        }
      );
    }
  });
}

function onTabTrack() {
  processTabChange(true);
}

chrome.tabs.onActivated.addListener(onTabTrack);
