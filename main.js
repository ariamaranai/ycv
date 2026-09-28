{
  let d = document;
  let newRoot = d.createElement("layer");
  let oldRoot = d.replaceChild(newRoot, d.lastChild);
  let headers;
  let continuationNewest;
  let continuationNext;
  let _commentBlock = d.createElement("rb");
  _commentBlock.append("", d.createElement("abbr"), new Image, "", d.createElement("rtc"));

  let commentFragment = new DocumentFragment;
  let endCommentId;
  let firstCommentId;

  let fetchNext = (continuation, isNewest, isReply) =>
    new Promise(async resolve => {
      let r = await (await fetch("https://www.youtube.com/youtubei/v1/next?prettyPrint=0", {
        body: '{"context":{"client":{"clientName":1,"clientVersion":"2.1111111"}},"continuation":"' + continuation + '"}',
        headers,
        method: "POST"
      })).json();
      let { continuationItems } = r.onResponseReceivedEndpoints.at(-1)[isNewest ? "reloadContinuationItemsCommand" : "appendContinuationItemsAction"];
      if (isReply === 0) {
        let { continuationItemRenderer } = continuationItems.at(-1);
        continuationItemRenderer
          ? continuationNext = continuationItemRenderer.continuationEndpoint.continuationCommand.token
          : oncontentvisibilityautostatechange = 0;
      }
      let { mutations } = r.frameworkUpdates.entityBatchUpdate;
      let i = isNewest;
      while (i < mutations.length) {
        let { commentEntityPayload } = mutations[i].payload;
        let { properties } = commentEntityPayload;
        let commentBlock = _commentBlock.cloneNode(1);

        if (isNewest) {
          let { commentId } = properties;
          if (commentId === endCommentId)
            break;
          i < 2 && (firstCommentId = commentId);
          commentFragment.appendChild(commentBlock);
        } else
          commentFragment.childElementCount && newRoot.appendChild(commentFragment),
          newRoot.appendChild(commentBlock);

        let node = commentBlock.firstChild;
        node.data = commentEntityPayload.author.displayName + "　";
        let { publishedTime } = properties;
        (node = node.nextSibling).textContent = publishedTime.length < 18 ? publishedTime : publishedTime.slice(0, -9);
        (node = node.nextSibling).src = commentEntityPayload.author.avatarThumbnailUrl;
        node.nextSibling.data = "\n" + properties.content.content + "\n";

        let { toolbar } = commentEntityPayload;
        let { likeCountLiked } = toolbar;
        let likeBlock = commentBlock.lastChild;
        if (mutations[i + 4].payload.engagementToolbarStateEntityPayload.likeState === "TOOLBAR_LIKE_STATE_LIKED")
          likeBlock.textContent = "\1" + likeCountLiked;
        else {
          let endpoint =  mutations[i + 3].payload.engagementToolbarSurfaceEntityPayload.likeCommand.innertubeCommand.performCommentActionEndpoint.action;
          likeBlock.textContent = (likeBlock[0] = endpoint, likeCountLiked ? "\0" + toolbar.likeCountNotliked : "\0");
        }

        isReply
          ? commentBlock.className = "c"
          : mutations[i].payload.commentEntityPayload.toolbar.replyCount &&
            await fetchNext(continuationItems[i * .2 ^ 0].commentThreadRenderer.replies.commentRepliesRenderer.contents[0].continuationItemRenderer.continuationEndpoint.continuationCommand.token, 0, 1);
        i += 5;
      }
      let { childElementCount } = commentFragment;
      isNewest
        ? (newRoot.insertBefore(commentFragment, childElementCount ? null : newRoot.querySelector("rb")), endCommentId = firstCommentId)
        : childElementCount && newRoot.appendChild(commentFragment);
      resolve();
    });

  d.addEventListener("DOMContentLoaded", () => {
    let elm = new Image;
    elm.src = "//i.ytimg.com/vi/" + location.href.slice(-11) + "/hqdefault.jpg";

    let n = oldRoot.lastChild.childNodes;
    let e = n[0].childNodes;
    let t = n[n.length - 5].text;
    let p = t.indexOf('"viewCount"', 2500) + 66;

    newRoot.appendChild(elm).setAttribute("style", "position:relative;z-index:1;width:120px;height:90px;border-radius:0");
    newRoot.appendChild(d.createElement("title")).textContent = e[1].content;
    newRoot.appendChild(elm = d.createElement("a")).href = (e = e[6]).firstChild.href;
    elm.target = "_blank";
    elm.textContent = "\t" + e.lastChild.getAttribute("content");

    newRoot.append(
      "\n\t\2" +
      t.slice(p, p = t.indexOf(" ", p)).replaceAll(".", ",") +
      " \1" +
      (t.slice(p = t.indexOf('"LIKE","titl', p) + 16, t.indexOf('"', p)).replace("Mag ich", "").replaceAll(".", ",")) +
      "\3" + (
        e = (p = t.indexOf("contextualIn", 300000)) > 0
          ? (e = t.slice(p += 34, p = t.indexOf('"', p))).length == 4
            ? e[0] + "," + e.slice(1)
            : e.replaceAll(".", ",")
          : "-"
      )
    );

    if (e === "-") return;
    crypto.subtle.digest("SHA-1", (new TextEncoder).encode(
      (n = oldRoot.firstChild.textContent).substr(n.indexOf("USER_SESSION", 450000) + 18, 21) +
      " 1 " +
      (n = d.cookie).substr(n.indexOf("SAPISID") + 8, 34) +
      " https://www.youtube.com"
    )).then(r => {
      t = new Uint8Array(r);
      while (
        n = "0123456789abcdef"[(e = t[--p]) >> 4] + "0123456789abcdef"[e % 16] + n,
        p
      );
      headers = {
        authorization: "SAPISIDHASH 1_" + n + " SAPISID1PHASH 1_" + n + " SAPISID3PHASH 1_" + n,
        "content-type": ""
      };
      oncontentvisibilityautostatechange = e => e.skipped || fetchNext(continuationNext, 0, 0);
      return fetchNext(continuationNewest, 1, 0);
    });
    continuationNewest = t.slice(p = t.indexOf("Eg0SC", t.indexOf('"title":"Neueste"')), t.indexOf('"', p));
    n = "_u";
    p = 20;
  }, { once: !0 });

  onscrollend = () => newRoot.scrollTop || fetchNext(continuationNewest, 1, newRoot.scrollTop = 0);

  onclick = ({ target }) => {
    let { localName } = target;
    if (localName === "rtc") {
      let key = target[0];
      return key && (
        fetch("https://www.youtube.com/youtubei/v1/comment/perform_comment_action?prettyPrint=0", {
          body: '{"context":{"client":{"clientName":1,"clientVersion":"1.1111111"}},"actions":"' + key + '"}',
          headers,
          method: "POST"
        }),
        target.textContent = "\1" + (+target.textContent.slice(1) + 1),
        target[0] = ""
      );
   } else if (localName == "img")
      return open(newRoot.firstChild == target ? "?v=" + target.src.slice(23, 34) : "/" + target.nextSibling.data);
  }
}
ondragstart = () => !1;
