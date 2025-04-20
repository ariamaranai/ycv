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

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(info => {
  chrome.contentSettings.javascript.set({
    primaryPattern: "https://www.youtube.com/*",
    setting: "block"
  });
  chrome.alarms.create({ delayInMinutes: .05 })
});

chrome.runtime.onUserScriptMessage.addListener((_, s, r) => (
  chrome.storage.local.get("0", v => r(v[0].includes(s.tab.url.slice(-11)))),
  !0
));

chrome.contextMenus.onClicked.addListener((a, b) => (
  chrome.system.display.getInfo((infos => {
    let { menuItemId } = a;
    if (menuItemId < "2")
      chrome.storage.local.get("0", v => {
        let videoIds = v[0];
        let targetVideoId = a.pageUrl.slice(-11);
        let index = videoIds.indexOf(targetVideoId);
          index < 0
            ? menuItemId && (
              videoIds.push(targetVideoId),
              chrome.storage.local.set("0", videoIds),
              chrome.runtime.sendMessage(1)
            )
            : menuItemId || (
              videoIds.splice(index, 1),
              chrome.storage.local.set("0", videoIds),
              chrome.runtime.sendMessage(0)
            );
      })
    else {
      let url = a.linkUrl || a.frameUrl || b.url;
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
    }
  }))
));

chrome.runtime.onInstalled.addListener(() => (
  chrome.contextMenus.create({
    id: "",
    title: "Register auto-likes",
    type: "radio",
    documentUrlPatterns: [
      "https://www.youtube.com/watch?app=desktop&hl=de&persist_hl=1&v=*"
    ]
  }),
  chrome.contextMenus.create({
    id: "1",
    title: "Unregister auto-likes",
    type: "radio",
    documentUrlPatterns: [
      "https://www.youtube.com/watch?app=desktop&hl=de&persist_hl=1&v=*"
    ]
  }),
  chrome.contextMenus.create({
    id: "2",
    title: "View comments",
    contexts: ["page", "video"],
    documentUrlPatterns: [
      "https://www.youtube.com/watch?v=*",
      "https://www.youtube.com/embed/*",
      "https://www.youtube.com/shorts/*"
    ]
  }),
  chrome.contextMenus.create({
    id: "3",
    title: "View comments",
    contexts: ["frame", "video", "link"],
    targetUrlPatterns: [
      "https://www.youtube.com/watch?v=*",
      "https://www.youtube.com/embed/*",
      "https://www.youtube.com/shorts/*",
      "https://youtu.be/*"
    ]
  }),
  chrome.storage.local.set({ "0": [] }),
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