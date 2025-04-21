{
  let d = document;
  let newRoot = d.createElement("body");
  let oldRoot = d.replaceChild(newRoot, d.lastChild);
  let isAutoLike;
  let continuationNewest;
  let continuationNext;
  let _commentBlock = d.createElement("i");
  _commentBlock.append(new Image, "", d.createElement("s"), "", d.createElement("u"));

  chrome.runtime.sendMessage(9, m => isAutoLike = m);

  d.addEventListener("DOMContentLoaded", async () => {
    let n = oldRoot.lastChild.childNodes;
    let e = n[0].childNodes;
    let code = n[n.length - 5].text;
    let p = code.indexOf('viewCount', 3000) + 65;

    newRoot.innerHTML =
      "<img src=//i.ytimg.com/vi/" +
      location.href.slice(-11) +
      "/hqdefault.jpg style=width:120px;height:90px;margin-bottom:-76px;border-radius:0><title>" +
      e[1].content +
      "</title><a href=" +
      (e = e[6]).firstChild.href +
      " target=_blank>\t" +
      e.lastChild.getAttribute("content") +
      "</a>\n\t⚡ " +
      code.slice(p, p = code.indexOf(" ", p)).replaceAll(".", ",") +
      "　❤️ " +
      ((code[p = code.indexOf("yText", p + 1300) + 8] == "I")
        ? code.slice(p += 23, code.indexOf(" ", p)).replaceAll(".", ",")
        : "-") +
      "　💬 " +
      (
        e = (p = code.indexOf("contextualInfo", 300000)) > 0
          ? (e = code.slice(p += 34, p = code.indexOf('"', p))).length != 4
            ? e.replaceAll(".", ",")
            : e[0] + "," + e.slice(1)
        : "-"
      ) +
      (isAutoLike ? "<rt class=e>💞</rt>" : "<rt>💞</rt>");

    if (e == "-") return;

    continuationNewest = code.substr(code.indexOf("Eg0SC", p + 700), 100);
    p = 3000;

    let txt = oldRoot.firstChild.textContent;
    let hash = new Uint8Array(
      await crypto.subtle.digest("SHA-1", (new TextEncoder).encode(
        txt.substr(txt.indexOf("USER_SESSION_ID", 450000) + 18, 21) +
        " 1 " +
        (n = d.cookie).substr(n.indexOf("SAPISID=") + 8, 34) +
        " https://www.youtube.com"
      ))
    );
    let key = "_u";
    let i = 20;
    while (
      key = "0123456789abcdef"[(n = hash[--i]) >> 4] + "0123456789abcdef"[n % 16] + key,
      i
    );

    let headers = {
      authorization: "SAPISIDHASH 1_" + key + " SAPISID1PHASH 1_" + key + " SAPISID3PHASH 1_" + key,
      "content-type": ""
    };

    let observer = new IntersectionObserver(entries =>
      newRoot.scrollTop &&
      entries[0].intersectionRect.height == newRoot.offsetHeight &&
      fetchNext(continuationNext, 0, 0),
      { rootMargin: "16776399px 0px 80px", threshold: 1 }
    );
    observer.observe(newRoot);

    let delay = n = 0;
    let fetchNext = async (continuation, isFirst, isReply) => {
      let r = await (await fetch ("https://www.youtube.com/youtubei/v1/next?prettyPrint=0", {
        body: '{"context":{"client":{"clientName":1,"clientVersion":"2.1111111"}},"continuation":"' + continuation + '"}',
        headers,
        method: "POST"
      })).json();
      let { mutations } = r.frameworkUpdates.entityBatchUpdate;
      let { continuationItems } = r.onResponseReceivedEndpoints.at(-1)[isFirst ? "reloadContinuationItemsCommand" : "appendContinuationItemsAction"];
      let i = isFirst;

      do {
        let commentBlock = _commentBlock.cloneNode(1);
        let nodes = commentBlock.childNodes;
        let { commentEntityPayload } = mutations[i].payload;
        let { properties, toolbar } = commentEntityPayload;
        let { publishedTime } = properties;
        let { likeCountLiked } = toolbar;
        let likeBlock = nodes[4];
        
        nodes[0].src = commentEntityPayload.avatar.image.sources[0].url;
        nodes[1].data = commentEntityPayload.author.displayName + "  ";
        nodes[2].textContent = publishedTime.length < 18 ? publishedTime : publishedTime.slice(0, -9);
        nodes[3].data = "\n" + properties.content.content + "\n";

        likeBlock.textContent =
          mutations[i + 4].payload.engagementToolbarStateEntityPayload.likeState != "TOOLBAR_LIKE_STATE_LIKED"
            ? (nodes = mutations[i + 3].payload.engagementToolbarSurfaceEntityPayload.likeCommand.innertubeCommand.performCommentActionEndpoint.action, isAutoLike)
              ? (
                fetchLater("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
                  body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + nodes + '"}',
                  headers,
                  method: "POST",
                  activateAfter: delay = (n - (n = performance.now())) > -127 ? delay + 127 : 0
                }),
                "🧡 " + likeCountLiked
              )
              : (
                likeBlock.nonce = nodes,
                likeCountLiked ? "🤍 " + toolbar.likeCountNotliked : "🤍"
              )
            : "❤️ " + likeCountLiked;

        newRoot.appendChild(commentBlock);

        isReply
          ? commentBlock.className = "r"
          : mutations[i].payload.commentEntityPayload.toolbar.replyCount && await fetchNext(
              continuationItems[Math.floor(i / 5)].commentThreadRenderer.replies.commentRepliesRenderer.contents[0].continuationItemRenderer.continuationEndpoint.continuationCommand.token,
              0,
              1
            );
      } while ((i += 5) < mutations.length);

      if (!isReply) {
        let { continuationItemRenderer } = continuationItems.at(-1);
        continuationItemRenderer
          ? continuationNext = continuationItemRenderer.continuationEndpoint.continuationCommand.token
          : observer.disconnect();
      }
    }

    onclick = e => {
      let { target } = e;
      let { tagName } = target;
      if (tagName == "U") {
        let { nonce } = target;
        if (nonce) {
          fetch ("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
            body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + nonce + '"}',
            headers,
            method: "POST"
          });
          target.textContent = "❤️ " + (+target.textContent.slice(2) + 1);
          target.nonce = "";
        }
      } else if (tagName == "IMG") {
        let { src } = target;
        open(src[8] == "y" ? "/" + target.nextSibling.data : "?v=" + src.slice(23, 34));
      } else if (tagName == "RT") {
        if (target.className) {
          chrome.runtime.sendMessage(isAutoLike = 0);
          target.className = "";
         } else {
          chrome.runtime.sendMessage(isAutoLike = 1);
          target.className = "e";
          let targets = newRoot.getElementsByTagName("u");
          let i = 0;
          while (i < targets.length) {
            let target = targets[i];
            let { nonce } = target;
            if (nonce) {
              fetchLater ("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
                body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + nonce + '"}',
                headers,
                method: "POST",
                activateAfter: delay = (n - (n = performance.now())) > -127 ? delay + 127 : 0
              });
              target.textContent = "🧡 " + (+target.textContent.slice(2) + 1);
              target.nonce = "";
            }
            ++i;
          }
        }
      }
    }
    fetchNext(continuationNewest, 1, 0);
  });
}
ondragstart = () => !1;