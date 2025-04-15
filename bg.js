chrome.contentSettings.javascript.set({
  primaryPattern: "https://www.youtube.com/*",
  setting: "allow"
});
chrome.browsingData.removeServiceWorkers({
  origins: ["https://www.youtube.com"]
});

chrome.alarms.onAlarm.addListener(() =>
  chrome.contentSettings.javascript.set({
    primaryPattern: "https://www.youtube.com/*",
    setting: "allow"
  })
);

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(() => (
  chrome.contentSettings.javascript.set({
    primaryPattern: "https://www.youtube.com/*",
    setting: "block"
  }),
  chrome.alarms.create({
    delayInMinutes: .1
  })
));

chrome.action.onClicked.addListener(() => {

});

chrome.contextMenus.onClicked.addListener(() => {

});

chrome.runtime.onInstalled.addListener(() => (
  chrome.contextMenus.create({
    id: "",
    title: "View comments",
    contexts: ["page"],
    documentUrlPatterns: [
      "https://www.youtube.com/watch?v=*",
      "https://www.youtube.com/embed/*",
      "https://www.youtube.com/shorts/*"
    ]
  }),
  chrome.contextMenus.create({
    id: "0",
    title: "View comments",
    contexts: ["video", "frame", "link"],
    targetUrlPatterns: [
      "https://www.youtube.com/watch?v=*",
      "https://www.youtube.com/embed/*",
      "https://www.youtube.com/shorts/*",
      "https://youtu.be/*"
    ]
  }),
  chrome.contextMenus.create({
    id: "1",
    title: "Like all comments",
    contexts: ["video", "frame", "link"],
    targetUrlPatterns: [
      "https://www.youtube.com/watch?app=desktop&hl=en&persist_hl=1&v=*/"
    ]
  }),
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.userScripts.register([{
    id: "0",
    js: [{ file: "main.js" }],
    matches: ["https://www.youtube.com/watch?app=desktop&hl=en&persist_hl=1&v=*/"],
    runAt: "document_start"
  }])
));