chrome.contentSettings.javascript.set({
  primaryPattern: "https://www.youtube.com/*",
  setting: "allow"
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
    delayInMinutes: .05
  })
));
chrome.runtime.onUserScriptMessage.addListener((m, s, r) => {
  chrome.storage.local.get("0", v => {
    let videoIds = v[0];
    let targetVideoId = s.tab.url.slice(-11);
    if (m === 0)
      r(videoIds.includes(targetVideoId))
    else {
      let index = videoIds.indexOf(targetVideoId);
      index < 0
        ? m && videoIds.push(targetVideoId)
        : m || videoIds.splice(index, 1);
      chrome.storage.local.set({
        0: videoIds
      });
    }
  });
  return !0
});
chrome.contextMenus.onClicked.addListener((a, { windowId, url: windowUrl }) =>
  chrome.system.display.getInfo((infos =>
    chrome.windows.get(windowId, window => {
      let workArea = infos[0].workArea;
      let workAreaWidth = workArea.width;
      let maxWindowWidth = workAreaWidth - 500;
      let windowWidth = window.width;
      let url = a.linkUrl || a.frameUrl || windowUrl;
      chrome.windows.create({
        width: 500,
        height: workArea.height,
        left: maxWindowWidth - 12,
        top: 0,
        type: "popup",
        url:
        "https://www.youtube.com/watch?app=desktop&hl=de&persist_hl=1&v=" +
        url.substr(url[8] != "y" ? url[24] == "w" ? 32 : url[24] == "e" ? 30 : 31 : 17, 11) +
        "/"
      });
      chrome.windows.update(windowId, {
        width: maxWindowWidth < windowWidth ? maxWindowWidth : windowWidth,
        left: 0,
        top: 0,
        state: "normal"
      });
    })
  ))
);
{
  let onStartup = () => {
    let userScripts = chrome.userScripts;
    userScripts &&
    userScripts.getScripts(scripts =>
      scripts.length || (
        userScripts.configureWorld({ messaging: !0 }),
        userScripts.register([{
          id: "0",
          js: [{ file: "main.js" }],
          matches: ["https://www.youtube.com/watch?app=desktop&hl=de&persist_hl=1&v=*"],
          runAt: "document_start"
        }]),
        chrome.runtime.onStartup.removeListener(onStartup)
      )
    );
  }
  chrome.runtime.onStartup.addListener(onStartup);
  chrome.runtime.onInstalled.addListener(() => (
    chrome.contextMenus.create({
      id: "",
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
    chrome.storage.local.set({
      0: []
    }),
    onStartup()
  ));
}