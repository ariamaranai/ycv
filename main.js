{
  let d = document;
  let newRoot = d.createElement("body");
  let oldRoot = d.replaceChild(newRoot, d.lastChild);

  let headers;
  let continuationNewest;
  let continuationNext;
  let isReceived = 0;

  let isAutoLike;
  chrome.runtime.sendMessage(0, m => isAutoLike = m);

  let _commentBlock = d.createElement("C");
  _commentBlock.append("", d.createElement("s"), new Image, "", d.createElement("U"));

  let commentFragment = new DocumentFragment;
  let endCommentId;
  let firstCommentId;

  let fetchNext = (continuation, isNewest, isReply, action) =>
    new Promise(async resolve => {
      let r = await (await fetch("https://www.youtube.com/youtubei/v1/next?prettyPrint=0", {
        body: '{"context":{"client":{"clientName":1,"clientVersion":"2.1111111"}},"continuation":"' + continuation + '"}',
        headers,
        method: "POST"
      })).json();
      let { mutations } = r.frameworkUpdates.entityBatchUpdate;
      let { continuationItems } = r.onResponseReceivedEndpoints.at(-1)[isNewest ? "reloadContinuationItemsCommand" : "appendContinuationItemsAction"];
      let i = isNewest;

      if (isReply == 0) {
        let { continuationItemRenderer } = continuationItems.at(-1);
        continuationItemRenderer
          ? continuationNext = continuationItemRenderer.continuationEndpoint.continuationCommand.token
          : observer.disconnect();
      }
      isReceived = 1;

      while (i < mutations.length) {
        let { commentEntityPayload } = mutations[i].payload;
        let { properties, toolbar } = commentEntityPayload;
        let { publishedTime } = properties;
        let commentBlock = _commentBlock.cloneNode(1);
  
        if (isNewest) {
          let { commentId } = properties;
          if (commentId == endCommentId) break;
          i < 2 && (firstCommentId = commentId);
          commentFragment.appendChild(commentBlock);
        } else
          newRoot.appendChild(commentBlock);

        let { likeCountLiked } = toolbar;
        let node = commentBlock.firstChild;
        let likeBlock = commentBlock.lastChild;

        node.data = commentEntityPayload.author.displayName + "  ";
        (node = node.nextSibling).textContent = publishedTime.length < 18 ? publishedTime : publishedTime.slice(0, -9);
        (node = node.nextSibling).src = commentEntityPayload.avatar.image.sources[0].url;
        node.nextSibling.data = "\n" + properties.content.content + "\n";


        likeBlock.textContent =
          mutations[i + 4].payload.engagementToolbarStateEntityPayload.likeState != "TOOLBAR_LIKE_STATE_LIKED"
            ? (action = mutations[i + 3].payload.engagementToolbarSurfaceEntityPayload.likeCommand.innertubeCommand.performCommentActionEndpoint.action, isAutoLike)
              ? (
                fetch("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
                  body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + action + '"}',
                  headers,
                  method: "POST"
                }),
                "\x01" + likeCountLiked
              )
              : (
                likeBlock.nonce = action,
                likeCountLiked ? "\x00" + toolbar.likeCountNotliked : "\x00"
              )
            : "\x01" + likeCountLiked;

        isReply
          ? commentBlock.className = "C"
          : mutations[i].payload.commentEntityPayload.toolbar.replyCount &&
            await fetchNext(continuationItems[Math.floor(i / 5)].commentThreadRenderer.replies.commentRepliesRenderer.contents[0].continuationItemRenderer.continuationEndpoint.continuationCommand.token, 0, 1);
        i += 5;
      }
      isNewest && (
        endCommentId = firstCommentId,
        newRoot.insertBefore(commentFragment, newRoot.querySelector("i"))
      );
      resolve();
    });

  let observer = new IntersectionObserver(entries =>
    isReceived && newRoot.scrollTop && entries[0].intersectionRect.height == newRoot.offsetHeight &&
    fetchNext(continuationNext, isReceived = 0, 0),
    { rootMargin: "16776399px 0px 0px", threshold: 1 }
  );

  d.addEventListener("DOMContentLoaded", async () => {
    let n = oldRoot.lastChild.childNodes;
    let e = n[0].childNodes;
    let t = n[n.length - 5].text;
    let p = t.indexOf('viewCoun', 2500) + 65;

    newRoot.innerHTML =
      "<img src=//i.ytimg.com/vi/" +
      location.href.slice(-11) +
      "/hqdefault.jpg style=position:relative;z-index:1;width:120px;height:90px;border-radius:0><title>" +
      e[1].content +
      "</title><a href=" +
      (e = e[6]).firstChild.href +
      " target=_blank>\t" +
      e.lastChild.getAttribute("content") +
      "</a>\n\t\x02" +
      t.slice(p, p = t.indexOf(" ", p)).replaceAll(".", ",") +
      " \x01" +
      ((t[p = t.indexOf("yTex", p + 1300) + 8] == "I")
        ? t.slice(p += 23, t.indexOf(" ", p)).replaceAll(".", ",")
        : "-") +
      "\x03" +
      (
        e = (p = t.indexOf("contextualIn", 300000)) > 0
          ? (e = t.slice(p += 34, p = t.indexOf('"', p))).length != 4
            ? e.replaceAll(".", ",")
            : e[0] + "," + e.slice(1)
        : "-"
      ) +
      (isAutoLike ? "<p class=P>\x04" : "<p>\x04");

    if (e == "-") return;
    continuationNewest = t.substr(t.indexOf("Eg0SC", p + 700), 100);
    t = new Uint8Array(
      await crypto.subtle.digest("SHA-1", (new TextEncoder).encode(
        (n = oldRoot.firstChild.textContent).substr(n.indexOf("USER_SESSION", 450000) + 18, 21) +
        " 1 " +
        (n = d.cookie).substr(n.indexOf("SAPISID") + 8, 34) +
        " https://www.youtube.com"
      ))
    );
    n = "_u";
    p = 20;
    while (
      n = "0123456789abcdef"[(e = t[--p]) >> 4] + "0123456789abcdef"[e % 16] + n,
      p
    );
    headers = {
      authorization: "SAPISIDHASH 1_" + n + " SAPISID1PHASH 1_" + n + " SAPISID3PHASH 1_" + n,
      "content-type": ""
    };
    fetchNext(continuationNewest, 1, 0);
    observer.observe(newRoot);
  }, { once: !0 });

  onkeydown = async e => e.keyCode != 116 || (
    e.preventDefault(),
    fetchNext(continuationNewest, 1, newRoot.scrollTop = 0)
  );
  onclick = e => {
    let { target } = e;
    let { tagName } = target;
    if (tagName == "U") {
      let { nonce } = target;
      nonce && (
        fetch("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
          body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + nonce + '"}',
          headers,
          method: "POST"
        }),
        target.textContent = "\x01" + (+target.textContent.slice(1) + 1)
      );
      target.nonce = "";
   } else if (tagName == "IMG")
      open(newRoot.firstChild == target ? "?v=" + target.src.slice(23, 34) : "/" + target.nextSibling.data);
    else if (tagName == "P") {
      chrome.runtime.sendMessage(isAutoLike = target.className = target.className ? "" : "P");
      if (isAutoLike) {
        let targets = newRoot.getElementsByTagName("U");
        let i = 0;
        while (i < targets.length) {
          let target = targets[i];
          let { nonce } = target;
          nonce && (
            fetch("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
              body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + nonce + '"}',
              headers,
              method: "POST"
            }),
            target.textContent = "\x01" + (+target.textContent.slice(1) + 1),
            target.nonce = ""
          )
          ++i;
        }
      }
    }
  }
}
ondragstart = () => !1;