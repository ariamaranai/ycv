chrome.contextMenus.onClicked.addListener((info, { windowId, url: windowUrl }) =>
  chrome.system.display.getInfo((infos =>
    chrome.windows.get(windowId, window => {
      let workArea = infos[0].workArea;
      let workAreaWidth = workArea.width;
      let maxWindowWidth = workAreaWidth - 500;
      let windowWidth = window.width;
      let url = info.linkUrl || info.frameUrl || windowUrl;
      chrome.windows.create({
        width: 500,
        height: workArea.height,
        left: maxWindowWidth - 12,
        top: 0,
        type: "popup",
        url:
        "https://www.youtube.com/watch?app=desktop&hl=de&persist_hl=1&v=" +
        url.substr(url.charCodeAt(8) == 121 ? 17 : url.charCodeAt(24) == 119 ? 32 : url.charCodeAt(24) == 101 ? 30 : 31, 11) +
        "/"
      });
      return chrome.windows.update(windowId, {
        width: maxWindowWidth < windowWidth ? maxWindowWidth : windowWidth,
        left: 0,
        top: 0,
        state: "normal"
      });
    })
  ))
);
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
    contexts: ["video", "link"],
    targetUrlPatterns: [
      "https://www.youtube.com/watch?v=*",
      "https://www.youtube.com/embed/*",
      "https://www.youtube.com/shorts/*",
      "https://youtu.be/*"
    ]
  })
));
