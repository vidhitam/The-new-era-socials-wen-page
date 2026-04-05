(function () {
  if (!document.querySelector(".ambient-orbs")) {
    var amb = document.createElement("div");
    amb.className = "ambient-orbs";
    amb.setAttribute("aria-hidden", "true");
    amb.innerHTML =
      '<span class="ambient-orb ambient-orb--red"></span>' +
      '<span class="ambient-orb ambient-orb--green"></span>' +
      '<span class="ambient-orb ambient-orb--blue"></span>';
    document.body.insertBefore(amb, document.body.firstChild);
  }

  var header = document.getElementById("site-header");

  function syncHeaderOffset() {
    if (header) {
      document.documentElement.style.setProperty(
        "--header-offset",
        header.offsetHeight + "px"
      );
    }
  }

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) {
      header.classList.toggle("is-scrolled", y > 12);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", syncHeaderOffset);
  window.addEventListener("load", syncHeaderOffset);
  syncHeaderOffset();
  requestAnimationFrame(syncHeaderOffset);
  onScroll();

  function scrollToHashId(hashId, smooth) {
    if (!hashId || hashId === "#") return;
    var id = hashId.charAt(0) === "#" ? hashId.slice(1) : hashId;
    var target = document.getElementById(id);
    if (!target) return;
    var headerEl = document.getElementById("site-header");
    var offset = headerEl ? headerEl.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top: top, behavior: smooth === false ? "auto" : "smooth" });
  }

  function isHomePath() {
    var p = window.location.pathname || "";
    return /index\.html$/i.test(p) || p === "/" || p.endsWith("/");
  }

  function setHomeNavFromPanelId(panelId) {
    var map = {
      "home-page-1": "home",
      "home-page-2": "mission",
      "home-page-3": "join",
      "home-page-4": "contact",
    };
    var key = map[panelId] || "home";
    var navEl = document.getElementById("nav-primary");
    if (navEl) {
      navEl.querySelectorAll("a").forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("data-nav") === key);
      });
    }
    var num = { "home-page-1": "1", "home-page-2": "2", "home-page-3": "3", "home-page-4": "4" };
    var d = num[panelId] || "1";
    document.querySelectorAll(".section-pager__dot").forEach(function (dot) {
      dot.classList.toggle("is-active", dot.getAttribute("data-home-panel") === d);
    });
  }

  function syncHomeFromHash() {
    if (!document.body.classList.contains("page-home")) return;
    var id = (window.location.hash || "#home-page-1").slice(1);
    if (!document.getElementById(id)) id = "home-page-1";
    setHomeNavFromPanelId(id);
  }

  if (document.body.classList.contains("page-home")) {
    window.addEventListener("hashchange", syncHomeFromHash);
    document.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest("a");
        if (!a) return;
        var href = a.getAttribute("href");
        if (!href || href.indexOf("index.html#") === -1) return;
        var parts = href.split("#");
        if (parts.length < 2) return;
        var hash = "#" + parts[1];
        if (!isHomePath()) return;
        e.preventDefault();
        if (history.pushState) history.pushState(null, "", hash);
        else window.location.hash = hash;
        scrollToHashId(hash);
        syncHomeFromHash();
      },
      true
    );

    var homeScrollT;
    window.addEventListener(
      "scroll",
      function () {
        if (!document.body.classList.contains("page-home")) return;
        clearTimeout(homeScrollT);
        homeScrollT = setTimeout(function () {
          var panels = document.querySelectorAll(".home-panel[id]");
          var refY = window.innerHeight * 0.32;
          var chosen = "home-page-1";
          panels.forEach(function (p) {
            var r = p.getBoundingClientRect();
            if (r.top <= refY && r.bottom > 80) chosen = p.id;
          });
          if (history.replaceState && window.location.hash !== "#" + chosen) {
            history.replaceState(null, "", "#" + chosen);
          }
          setHomeNavFromPanelId(chosen);
        }, 120);
      },
      { passive: true }
    );

    window.addEventListener("load", function () {
      var h = window.location.hash;
      if (h && document.querySelector(h)) {
        scrollToHashId(h, false);
      }
      syncHomeFromHash();
    });
    syncHomeFromHash();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (id === "#") return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        if (document.body.classList.contains("page-home") && history.pushState) {
          history.pushState(null, "", id);
          syncHomeFromHash();
        }
        scrollToHashId(id);
      }
    });
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 0.07, 0.56) + "s";
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  document.querySelectorAll("a[href]").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
    if (link.hostname && link.hostname !== location.hostname) return;
    if (!href.endsWith(".html") && !href.includes("index.html")) return;

    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var h = link.getAttribute("href") || "";
      if (h.indexOf("index.html#") !== -1 && isHomePath()) return;
      document.body.style.opacity = "0.92";
      document.body.style.transition = "opacity 0.2s ease";
    });
  });

  window.addEventListener("pageshow", function () {
    document.body.style.opacity = "";
    document.body.style.transition = "";
  });

  var volBtn = document.getElementById("toggle-volunteer-form");
  var volPanel = document.getElementById("volunteer-interest-panel");
  if (volBtn && volPanel) {
    volBtn.addEventListener("click", function () {
      if (volPanel.hidden) {
        volPanel.hidden = false;
        volBtn.setAttribute("aria-expanded", "true");
        volBtn.textContent = "Hide volunteer interest form";
        requestAnimationFrame(function () {
          volPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
        var firstField = volPanel.querySelector("input, select, textarea");
        if (firstField) {
          setTimeout(function () {
            firstField.focus();
          }, 450);
        }
      } else {
        volPanel.hidden = true;
        volBtn.setAttribute("aria-expanded", "false");
        volBtn.textContent = "Open volunteer interest form";
      }
    });
  }

  function initGalleryLightbox() {
    var root = document.getElementById("gallery-marquee-root");
    var lb = document.getElementById("gallery-lightbox");
    if (!root || !lb) return;

    var lbImg = lb.querySelector(".gallery-lightbox__img");
    var btnClose = lb.querySelector(".gallery-lightbox__close");
    var frame = lb.querySelector(".gallery-lightbox__frame");
    if (!lbImg) return;

    function closeLb() {
      lb.hidden = true;
      lbImg.src = "";
      lbImg.alt = "";
      document.body.style.overflow = "";
    }

    function openLb(imgEl) {
      var src = imgEl.currentSrc || imgEl.src || "";
      if (src.indexOf("images.unsplash.com") !== -1) {
        lbImg.src = /w=\d+/.test(src) ? src.replace(/w=\d+/g, "w=1600") : src + (src.indexOf("?") === -1 ? "?" : "&") + "w=1600&q=85";
      } else {
        lbImg.src = src;
      }
      lbImg.alt = imgEl.alt || "Enlarged photo";
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      if (btnClose) btnClose.focus();
    }

    root.addEventListener("click", function (e) {
      var t = e.target;
      if (t.tagName !== "IMG") return;
      e.preventDefault();
      openLb(t);
    });

    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("gallery-lightbox__backdrop")) {
        closeLb();
      }
    });

    if (frame) {
      frame.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    if (btnClose) {
      btnClose.addEventListener("click", function (e) {
        e.stopPropagation();
        closeLb();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) closeLb();
    });
  }

  function initGalleryMarqueeWheel() {
    var root = document.getElementById("gallery-marquee-root");
    var track = document.getElementById("gallery-marquee-track");
    if (!root || !track) return;

    var collage = track.querySelector(".gallery-marquee__collage");
    if (!collage) return;

    var pos = 0;
    var extraVel = 0;
    var basePxPerFrame = 32 / 60;

    function measureW() {
      return collage.offsetWidth || collage.scrollWidth || 0;
    }

    track.classList.add("is-js-driven");

    function tick() {
      var W = measureW();
      if (W > 0) {
        pos += basePxPerFrame + extraVel;
        extraVel *= 0.92;
        pos = ((pos % W) + W) % W;
        track.style.transform = "translateX(" + -pos + "px)";
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    root.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        var dy = Math.min(48, Math.abs(e.deltaY)) * (e.deltaY > 0 ? 1 : -1);
        extraVel += dy * 0.11;
      },
      { passive: false }
    );

    window.addEventListener("resize", function () {
      var W = measureW();
      if (W > 0) pos = ((pos % W) + W) % W;
    });
  }

  if (document.body.getAttribute("data-page") === "gallery") {
    var galleryReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function runGalleryInit() {
      initGalleryLightbox();
      if (!galleryReducedMotion) initGalleryMarqueeWheel();
    }
    if (document.readyState === "complete") {
      runGalleryInit();
    } else {
      window.addEventListener("load", runGalleryInit);
    }
  }
})();
