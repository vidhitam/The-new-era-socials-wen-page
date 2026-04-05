/**
 * Injects reusable site header and footer.
 * Set document.body.dataset.page to: home | mission | join | contact | community | gallery
 */
(function () {
  var page = document.body.dataset.page || "";

  var nav = [
    { href: "index.html#home-page-1", id: "home", label: "Home", dataNav: "home" },
    { href: "index.html#home-page-2", id: "mission", label: "Mission", dataNav: "mission" },
    { href: "index.html#home-page-3", id: "join", label: "Join Us", dataNav: "join" },
    { href: "index.html#home-page-4", id: "contact", label: "Contact", dataNav: "contact" },
    { href: "community.html", id: "community", label: "Our Community", dataNav: "community" },
    { href: "gallery.html", id: "gallery", label: "Gallery", dataNav: "gallery" },
  ];

  function navLinks() {
    return nav
      .map(function (item) {
        var active = page === item.id ? " is-active" : "";
        var cls = active.trim();
        return (
          '<a href="' +
          item.href +
          '" data-nav="' +
          item.dataNav +
          '"' +
          (cls ? ' class="' + cls + '"' : "") +
          ">" +
          item.label +
          "</a>"
        );
      })
      .join("");
  }

  var sectionPagerHtml =
    '<nav class="section-pager" aria-label="Jump to home sections">' +
    '<span class="section-pager__title">Explore</span>' +
    '<span class="section-pager__rail" aria-hidden="true"></span>' +
    '<a href="index.html#home-page-1" class="section-pager__dot" data-home-panel="1" title="Welcome — page 1"><span class="visually-hidden">Welcome</span></a>' +
    '<a href="index.html#home-page-2" class="section-pager__dot" data-home-panel="2" title="Mission &amp; about — page 2"><span class="visually-hidden">Mission and about</span></a>' +
    '<a href="index.html#home-page-3" class="section-pager__dot" data-home-panel="3" title="Join us — page 3"><span class="visually-hidden">Join us</span></a>' +
    '<a href="index.html#home-page-4" class="section-pager__dot" data-home-panel="4" title="Contact — page 4"><span class="visually-hidden">Contact</span></a>' +
    "</nav>";

  var hideSectionPager = page === "community" || page === "gallery";

  var headerHtml =
    '<header class="site-header" id="site-header">' +
    '<div class="container header-inner">' +
    '<a href="index.html#home-page-1" class="logo" aria-label="New Era Socials — Home"><span class="logo-mark">T</span></a>' +
    '<nav class="nav-primary" id="nav-primary" aria-label="Main">' +
    navLinks() +
    "</nav>" +
    "</div>" +
    "</header>" +
    (hideSectionPager ? "" : sectionPagerHtml);

  var footerHtml =
    '<footer class="site-footer">' +
    '<div class="container footer-inner">' +
    "<p>© " +
    new Date().getFullYear() +
    " New Era Socials. Making a difference together.</p>" +
    "</div>" +
    "</footer>";

  var ph = document.getElementById("header-placeholder");
  var pf = document.getElementById("footer-placeholder");
  if (ph) ph.outerHTML = headerHtml;
  if (pf) pf.outerHTML = footerHtml;
})();
