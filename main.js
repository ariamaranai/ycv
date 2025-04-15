{
  let d = document;

  let newRoot = d.createElement("meta");
  newRoot.name = "viewport";
  newRoot.content = "initial-scale=yes";

  let oldRoot = d.replaceChild(newRoot, d.lastChild);
  
  let continuation;
  let body;
  let accountsHeaders = [];

  
  d.addEventListener("DOMContentLoaded", async () => {
    let bodyChilds = oldRoot.lastChild.childNodes;
    let e = bodyChilds[0].childNodes;
    let code = bodyChilds[bodyChilds.length - 5].text;
    let p = code.indexOf("viewCount", 4400) + 65;

    newRoot.innerHTML =
      "<img style=width:120px;border-radius:0 src=//i.ytimg.com/vi/" +
      location.href.slice(-11) +
      "/hqdefault.jpg><title>" +
      e[1].content +
      "</title><a target=_blank href=" +
      (e = e[6]).firstChild.href +
      ">" +
      e.lastChild.getAttribute("content") +
      "</a>\t ⚡ " +
      code.slice(p, p = code.indexOf(" ", p)) +
      "  ❤️ " +
      ((code[p = code.indexOf("yText", p + 1300) + 8] == "l") ? code.slice(p += 27, code.indexOf(" ", p)) : "-") +
      "  💬 " +
      (e = (p = code.indexOf("contextualInfo", 300000)) > 0 ? code.slice(p += 34, p = code.indexOf('"', p)) : "-") +
      "\n\n";

    continuation = code.substr(p + 1305, 100);
    body = '{"context":{"client":{"hl":"en","gl":"US","clientName":1,"clientVersion":"2.2025011"}},"continuation":"' + continuation + '"}';
    if (+e[0]) {
      let cookie = d.cookie;
      let n = cookie.indexOf("SAPISID=");
      
      if (n >= 0) {
        let SAPISID = " 1 " + cookie.substr(n + 8, 34) + " https://www.youtube.com";
        let txt = await (await fetch ("/getAccountSwitcherEndpoint")).text();
        p = 3000;
        while ((p = txt.indexOf('Selected":', p)) > 0) {
          let isSelected = txt[p + 10] != "f";
          let url = txt.slice(p = txt.indexOf("/", p + 200), txt.indexOf('"', p));
          let thtml = isSelected ? oldRoot.firstChild.textContent : await (await fetch(url)).text();
          let hash = new Uint8Array(await crypto.subtle.digest("SHA-1", (new TextEncoder).encode(
            thtml.substr(thtml.indexOf("USER_SESSION_ID", 400000) + 18, + 21) + SAPISID
          )));
          let key = "_u";
          let i = 20;
          let n;
          while (
            key = "0123456789abcdef"[(n = hash[--i]) >> 4] + "0123456789abcdef"[n % 16] + key,
            i
          );
          let authorization = "SAPISIDHASH 1_" + key + " SAPISID1PHASH 1_" + key + " SAPISID3PHASH 1_" + key;
          accountsHeaders.push(
            url.length > 210
              ? { authorization,
                  "x-goog-authuser": i = url.slice(43, url.indexOf("&", 44)),
                  "x-goog-pageid": url.substr(i.length + 51, 21)
                }
              : { authorization }
            /*isSelected
              ? code.substr(p + 1305, 100)
              : thtml.substr(thtml.indexOf("Newest first", 900000) + 235, 100),*/
          );
          p += 300;
        }
      }
      accountsHeaders[0] ??= null;
      for (let i = 0; i < accountsHeaders.length; ++i) {
        fetch ("https://www.youtube.com/youtubei/v1/next?prettyPrint=0", {
          body,
          headers: accountsHeaders[i],
          method: "POST"
        });
      }
    }
  });
}