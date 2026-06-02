/* ============================================================
   LOS CUCHILLOS — script compartido
   ============================================================ */
(function () {
  "use strict";

  /* ---------- NAV: estado scrolled ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var burger = document.querySelector(".burger");
  var mm = document.querySelector(".mobile-menu");
  if (burger && mm) {
    burger.addEventListener("click", function () {
      var open = mm.classList.toggle("open");
      burger.classList.toggle("on", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mm.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mm.classList.remove("open");
        burger.classList.remove("on");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Nav link activo ---------- */
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    if (a.getAttribute("data-nav") === page) a.classList.add("active");
  });

  /* ---------- Índice de carta: enlace activo según scroll ---------- */
  var menuNavLinks = [].slice.call(document.querySelectorAll(".menu-nav a"));
  if (menuNavLinks.length) {
    var targets = menuNavLinks.map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    });
    var spyTick = false;
    function menuSpy() {
      if (spyTick) return;
      spyTick = true;
      requestAnimationFrame(function () {
        var best = 0, bestTop = -Infinity, mark = 180;
        for (var i = 0; i < targets.length; i++) {
          if (!targets[i]) continue;
          var top = targets[i].getBoundingClientRect().top;
          if (top <= mark && top > bestTop) { bestTop = top; best = i; }
        }
        menuNavLinks.forEach(function (a, i) { a.classList.toggle("active", i === best); });
        spyTick = false;
      });
    }
    window.addEventListener("scroll", menuSpy, { passive: true });
    menuSpy();
  }

  /* ---------- Slideshow del hero (crossfade tipo Zimmerl) ---------- */
  document.querySelectorAll("[data-hero-slideshow]").forEach(function (box) {
    var slides = box.querySelectorAll(".hero__slide");
    if (slides.length < 2) return;
    var idx = 0;
    slides[0].style.zIndex = 2;
    setInterval(function () {
      var prev = slides[idx];
      idx = (idx + 1) % slides.length;
      var next = slides[idx];
      // la nueva entra POR ENCIMA y se funde; la anterior permanece debajo
      next.style.zIndex = 3;
      prev.style.zIndex = 2;
      next.classList.add("is-active");
      // al terminar el fundido, ocultamos la anterior sin saltos
      window.setTimeout(function () {
        prev.classList.remove("is-active");
        prev.style.zIndex = 1;
      }, 2050);
    }, 4500);
  });

  /* ---------- Horario: resaltar día actual ---------- */
  var today = new Date().getDay(); // 0=domingo … 6=sábado
  document.querySelectorAll(".hours .hrow").forEach(function (row) {
    if (parseInt(row.getAttribute("data-day"), 10) === today) row.classList.add("today");
  });

  /* ---------- Idioma ES / EN ---------- */
  var LANG_KEY = "lc-lang";
  function applyLang(lang) {
    if (lang !== "en") lang = "es";
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-es]").forEach(function (el) {
      var v = el.getAttribute("data-" + lang);
      if (v != null) el.textContent = v;
    });
    // título de página
    var t = document.querySelector("title");
    if (t && t.getAttribute("data-" + lang)) document.title = t.getAttribute("data-" + lang);
    // botones
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });
  var savedLang = "es";
  try { savedLang = localStorage.getItem(LANG_KEY) || "es"; } catch (e) {}
  applyLang(savedLang);
  window.LC_applyLang = applyLang;

  /* ---------- Reveal al hacer scroll (basado en posición) ---------- */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add("in");
        reveals.splice(i, 1);
      }
    }
  }
  if (reveals.length) {
    checkReveals();
    // re-ejecuta tras el primer pintado y la carga (las medidas iniciales
    // pueden fallar antes de que el layout/imágenes se estabilicen)
    requestAnimationFrame(function () { checkReveals(); requestAnimationFrame(checkReveals); });
    [120, 350, 700].forEach(function (ms) { setTimeout(checkReveals, ms); });
    window.addEventListener("load", checkReveals);
    window.addEventListener("scroll", checkReveals, { passive: true });
    window.addEventListener("resize", checkReveals);
    // red de seguridad
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add("in"); }); }, 1600);
  }

  /* ---------- Parallax suave en heros ---------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        parallaxEls.forEach(function (el) {
          var sp = parseFloat(el.getAttribute("data-parallax")) || 0.18;
          el.style.transform = "translate3d(0," + (y * sp).toFixed(1) + "px,0) scale(1.08)";
        });
        ticking = false;
      });
    }, { passive: true });
  }
})();
