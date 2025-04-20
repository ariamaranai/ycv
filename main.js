{
  let d = document;

  let newRoot = d.createElement("body");
  let oldRoot = d.replaceChild(newRoot, d.lastChild);

  let _commentBlock = d.createElement("i");
  _commentBlock.append(new Image, "", d.createElement("s"), "", d.createElement("u"));

  let continuationNewest;
  let continuationNext;

  let isAutoLikes;
  chrome.runtime.onMessage.addListener(m => {
    if (isAutoLikes = m) {
      let targets = d.getElementsByTagName("u");
      let i = 0;
      while (i < targets.length) {
        let target = targets[i];
        let { nonce } = target;
        if (nonce) {
          fetch ("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
            body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + nonce + '"}',
            headers,
            method: "POST"
          });
          target.textContent = "🧡 " + (+target.textContent.slice(2) + 1);
          target.nonce = "";
        }
        ++i;
      }
    }
  });
  chrome.runtime.sendMessage(0, m => isAutoLikes = m);

  d.addEventListener("DOMContentLoaded", async () => {
    let bodyChilds = oldRoot.lastChild.childNodes;
    let e = bodyChilds[0].childNodes;
    let code = bodyChilds[bodyChilds.length - 5].text;
    let p = code.indexOf('viewCount', 3000) + 65;

    newRoot.innerHTML =
      "<img src=//i.ytimg.com/vi/" +
      location.href.slice(-11) +
      "/hqdefault.jpg style=width:120px;margin-bottom:-76px;border-radius:0><title>" +
      e[1].content +
      "</title><a href=/@" +
      (e = e[6]).firstChild.href.slice(24) +
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
      );

    continuationNewest = code.substr(code.indexOf("Eg0SC", p + 700), 100);

    if (+e[0]) {
      let cookie = d.cookie;
      let n = cookie.indexOf("SAPISID=");
      let headers = { "content-type": "" };

      if (n >= 0) {
        p = 3000;
        let txt = oldRoot.firstChild.textContent;
        let hash = new Uint8Array(
          await crypto.subtle.digest("SHA-1", (new TextEncoder).encode(
            txt.substr(txt.indexOf("USER_SESSION_ID", 450000) + 18, 21) +
            " 1 " +
            cookie.substr(n + 8, 34) +
            " https://www.youtube.com"
          ))
        );
        let key = "_u";
        let i = 20;
        while (
          key = "0123456789abcdef"[(n = hash[--i]) >> 4] + "0123456789abcdef"[n % 16] + key,
          i
        );
        headers = {
          authorization: "SAPISIDHASH 1_" + key + " SAPISID1PHASH 1_" + key + " SAPISID3PHASH 1_" + key,
          "content-type": ""
        };
      }

      let observer = new IntersectionObserver(entries =>
        newRoot.scrollTop && entries[0].intersectionRect.height == newRoot.offsetHeight && fetchNext(continuationNext, 0, 0),
        { rootMargin: "16776399px 0px 80px", threshold: 1 }
      );
      observer.observe(newRoot);

      let t = 0;
      let delay = 0;

      let fetchNext = async (continuation, isFirst, isReply) => {
        let r = await (await fetch ("https://www.youtube.com/youtubei/v1/next?prettyPrint=0", {
          body: '{"context":{"client":{"hl":"en","clientName":1,"clientVersion":"2.1111111"}},"continuation":"' + continuation + '"}',
          headers,
          method: "POST"
        })).json();

        let { mutations } = r.frameworkUpdates.entityBatchUpdate;
        let { continuationItems } = r.onResponseReceivedEndpoints.at(-1)[isFirst ? "reloadContinuationItemsCommand" : "appendContinuationItemsAction"];
        let i = isFirst;

        do {
          let commentBlock = _commentBlock.cloneNode(1);
          let commentBlockNodes = commentBlock.childNodes;
          let { commentEntityPayload } = mutations[i].payload;
          let { properties, toolbar } = commentEntityPayload;
          let { publishedTime } = properties;
          let { likeCountLiked } = toolbar;
          let likedBlock = commentBlockNodes[4];
          commentBlockNodes[0].src = commentEntityPayload.avatar.image.sources[0].url;
          commentBlockNodes[1].data = commentEntityPayload.author.displayName + "  ";
          commentBlockNodes[2].textContent = publishedTime.length < 18 ? publishedTime : publishedTime.slice(0, -9);
          commentBlockNodes[3].data = "\n" + properties.content.content + "\n";

          if (mutations[i + 4].payload.engagementToolbarStateEntityPayload.likeState != "TOOLBAR_LIKE_STATE_LIKED") {
            let { action } = mutations[i + 3].payload.engagementToolbarSurfaceEntityPayload.likeCommand.innertubeCommand.performCommentActionEndpoint;
            if (isAutoLikes) {
              fetchLater("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
                body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + action + '"}',
                headers,
                method: "POST",
                activateAfter: delay = (t - (t = performance.now())) > -127 ? delay + 127 : 0
              });
              likedBlock.textContent = "🧡 " + likeCountLiked;
            } else {
              likedBlock.nonce = action;
              likedBlock.textContent = likeCountLiked ? "🤍 " + toolbar.likeCountNotliked : "🤍";
            }
          } else
            likedBlock.textContent = "❤️ " + likeCountLiked;

          newRoot.appendChild(commentBlock);

          if (!isReply) {
            if (mutations[i].payload.commentEntityPayload.toolbar.replyCount) {
              await fetchNext(continuationItems[Math.floor(i / 5)].commentThreadRenderer.replies.commentRepliesRenderer.contents[0].continuationItemRenderer.continuationEndpoint.continuationCommand.token, 0, 1);
            }
          } else
            commentBlock.className = "r";
        } while ((i += 5) < mutations.length);

        if (!isReply) {
          let { continuationItemRenderer } = continuationItems.at(-1);
          if (continuationItemRenderer) {
            continuationNext = continuationItemRenderer.continuationEndpoint.continuationCommand.token;
          } else
            return observer.disconnect();
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
          if (src[8] == "i") {
            open("?v=" + src.slice(23, 34));
          } else {
      
          }
        }
      }
      fetchNext(continuationNewest, 1, 0);
    }
  });
}
ondragstart = () => !1;