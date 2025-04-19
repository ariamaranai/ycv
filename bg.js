chrome.contentSettings.javascript.set({
  primaryPattern: "https://www.youtube.com/*",
  setting: "allow"
});
chrome.browsingData.removeServiceWorkers({
  origins: ["https://www.youtube.com"]
});

chrome.alarms.onAlarm.addListener(() => (
  chrome.contentSettings.javascript.set({
    primaryPattern: "https://www.youtube.com/*",
    setting: "allow"
  })
));

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(info => (
  chrome.contentSettings.javascript.set({
    primaryPattern: "https://www.youtube.com/*",
    setting: "block"
  }),
  chrome.alarms.create({ delayInMinutes: .05 })
));

chrome.action.onClicked.addListener(() => {
  
});

chrome.contextMenus.onClicked.addListener((a, b) =>
  chrome.system.display.getInfo((infos => {
    let url = a?.linkUrl || a?.frameUrl || b.url;
    let { workArea } = infos[0];
    chrome.windows.create({
      url:
        "https://www.youtube.com/watch?app=desktop&hl=de&persist_hl=1&v=" +
        url.substr(url[8] != "y" ? url[24] == "w" ? 32 : url[24] == "e" ? 30 : 31 : 17, 11) +
        "/",
      type: "popup",
      width: 500,
      height: workArea.height,
      left: workArea.width - 500,
      top: 0
    })
  }))
);

chrome.runtime.onInstalled.addListener(() => (
  chrome.contextMenus.create({
    id: "0",
    title: "View comments",
    contexts: ["page", "video"],
    documentUrlPatterns: [
      "https://www.youtube.com/watch?v=*",
      "https://www.youtube.com/embed/*",
      "https://www.youtube.com/shorts/*"
    ]
  }),
  chrome.contextMenus.create({
    id: "1",
    title: "View comments",
    contexts: ["frame", "video", "link"],
    targetUrlPatterns: [
      "https://www.youtube.com/watch?v=*",
      "https://www.youtube.com/embed/*",
      "https://www.youtube.com/shorts/*",
      "https://youtu.be/*"
    ]
  }),
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.userScripts.register([{
    id: "0",
    js: [{ file: "main.js" }],
    matches: ["https://www.youtube.com/watch?app=desktop&hl=de&persist_hl=1&v=*"],
    runAt: "document_start"
  }])
));