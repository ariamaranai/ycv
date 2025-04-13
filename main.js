{
  let d = document;

  let newRoot = d.createElement("meta");
  newRoot.name = "viewport";
  newRoot.content = "initial-scale=yes";

  let oldRoot = d.replaceChild(newRoot, d.lastChild);

  d.addEventListener("DOMContentLoaded", () => {
    let bodyChilds = oldRoot.lastChild.childNodes;
    let e = bodyChilds[0].childNodes;
    let code = bodyChilds[29].text;
    let p = code.indexOf("viewCount", 4400) + 65;

    newRoot.innerHTML =
      "<img style=width:120px;border-radius:0 src=//i.ytimg.com/vi/" +
      location.href.slice(-12) +
      "hqdefault.jpg><title>" +
      e[1].content +
      "</title><a target=_blank href=" +
      (e = e[6]).firstChild.href +
      ">" +
      e.lastChild.getAttribute("content") +
      "</a>\t 👁‍🗨 " +
      code.slice(p, p = code.indexOf(" ", p)) +
      "  ❤️ " +
      (e = (code[p = code.indexOf("yText", p + 1300) + 8] == "l") ? code.slice(p += 27, code.indexOf(" ", p)) : "-") +
      "  💬 -\n\n"
  });
}