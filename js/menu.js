/* ============================================================
   LOS CUCHILLOS — Carta y Menú del día desde Google Sheets
   ------------------------------------------------------------
   El dueño edita una hoja de Google (publicada como CSV) y esta
   lógica la lee y la pinta con el diseño del sitio. Sin tocar código.

   👉 CÓMO CONECTAR EL GOOGLE SHEET (una sola vez):
   1. En tu hoja: Archivo → Compartir → Publicar en la web.
   2. Elige la pestaña y formato "Valores separados por comas (.csv)".
   3. Copia la URL y pégala abajo, sustituyendo la ruta data/...csv.
      (Una URL por pestaña: una para "Carta" y otra para "Menú del día".)
   ============================================================ */
(function () {
  "use strict";

  var MENU_SOURCES = {
    carta:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRuOVm2PNlefzPC1ZZorcjE7y9tE5HTZ_bdj2RNmDmlfxRAAd2JPMfep7TlA_3bNb8b7KhDNdtLrGyS/pub?gid=822487194&single=true&output=csv",     // ← sustituir por la URL CSV publicada de la pestaña "Carta"
    menuDia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS22LeUnF1Z6t5Iu1doKccLJNPAbJJrjlncNAuMzqkkk_nVihEakBSTuWylAlmkarIVwbWkVUnJ0UzN/pub?gid=1026764020&single=true&output=csv"   // ← sustituir por la URL CSV publicada de la pestaña "Menú del día"
  };

  /* ---------- utilidades ---------- */
  function bust(url) { return url + (url.indexOf("?") > -1 ? "&" : "?") + "_t=" + Date.now(); }
  function stripD(s) { return (s == null ? "" : s).toString().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function slug(s) { return stripD(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  function norm(s) { return stripD(s).trim().toLowerCase(); }
  function roman(n) {
    var map = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
    var r = ""; for (var i = 0; i < map.length; i++) { while (n >= map[i][0]) { r += map[i][1]; n -= map[i][0]; } } return r;
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }

  /* ---------- parser CSV robusto (comillas, comas, saltos) ---------- */
  function parseCSV(text) {
    text = text.replace(/^﻿/, ""); // quita BOM
    var rows = [], row = [], field = "", i = 0, inQ = false, c;
    while (i < text.length) {
      c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (c === "\r") { /* ignora */ }
        else field += c;
      }
      i++;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // CSV -> array de objetos {clave normalizada: valor}, usando la 1ª fila como cabecera
  function toObjects(rows) {
    if (!rows.length) return [];
    var head = rows[0].map(norm);
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      if (!cells.length || cells.every(function (x) { return (x || "").trim() === ""; })) continue;
      var obj = {};
      for (var c = 0; c < head.length; c++) obj[head[c]] = (cells[c] || "").trim();
      out.push(obj);
    }
    return out;
  }

  function fetchCSV(url) {
    return fetch(bust(url), { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    }).then(function (t) { return toObjects(parseCSV(t)); });
  }

  function pick(o, keys) { for (var i = 0; i < keys.length; i++) if (o[keys[i]] != null && o[keys[i]] !== "") return o[keys[i]]; return ""; }

  /* ============================================================
     CARTA
     ============================================================ */
  function itemHTML(it) {
    var tag = it.tag ? '<span class="tag-v">' + esc(it.tag) + "</span>" : "";
    var desc = it.desc ? '<span class="mitem__desc">' + esc(it.desc) + "</span>" : "";
    var price = it.price ? '<span class="mitem__price">' + esc(it.price) + "</span>" : "";
    return '<div class="mitem"><div><span class="mitem__name">' + esc(it.name) + "</span>" + tag + desc + "</div>" + price + "</div>";
  }

  function renderCarta(objs) {
    var order = [], groups = {};
    objs.forEach(function (o) {
      var sec = pick(o, ["seccion", "section", "apartado"]);
      var name = pick(o, ["plato", "nombre", "name"]);
      if (!sec || !name) return;
      if (!groups[sec]) { groups[sec] = []; order.push(sec); }
      groups[sec].push({
        name: name,
        desc: pick(o, ["descripcion", "description", "desc"]),
        price: pick(o, ["precio", "price"]),
        tag: pick(o, ["etiqueta", "tag", "label"])
      });
    });

    var root = document.getElementById("carta-root");
    var html = "", indexLinks = [];
    order.forEach(function (sec) {
      var id = "sec-" + slug(sec);
      indexLinks.push({ id: id, label: sec });
      var items = groups[sec], list;
      if (items.length > 6) {
        var half = Math.ceil(items.length / 2);
        list = '<div class="menu-cols"><div class="menu-list">' +
          items.slice(0, half).map(itemHTML).join("") +
          '</div><div class="menu-list">' +
          items.slice(half).map(itemHTML).join("") + "</div></div>";
      } else {
        list = '<div class="menu-list">' + items.map(itemHTML).join("") + "</div>";
      }
      html += '<section class="section wrap menu-section" id="' + id + '" style="padding-top:0;padding-bottom:clamp(40px,6vw,72px)">' +
        '<div class="menu-block in">' +
          '<div class="menu-head"><span class="idx"></span><h2>' + esc(sec) + '</h2><span class="line"></span></div>' +
          list +
        "</div></section>";
    });
    root.innerHTML = html;

    buildIndex(indexLinks);
    renumber();
    injectMenuJsonLd(order, groups);
  }

  function buildIndex(links) {
    var nav = document.getElementById("carta-index");
    if (!nav) return;
    var items = [];
    if (document.getElementById("menudia")) items.push('<li><a href="#menudia">Menú del día</a></li>');
    links.forEach(function (l) { items.push('<li><a href="#' + l.id + '">' + esc(l.label) + "</a></li>"); });
    if (document.getElementById("bodega")) items.push('<li><a href="#bodega">Bodega</a></li>');
    nav.innerHTML = '<nav class="menu-nav" aria-label="Secciones de la carta"><ul>' + items.join("") + "</ul></nav>";
    initSpy(nav.querySelectorAll(".menu-nav a"));
  }

  // numera todos los .idx en orden de aparición (carta dinámica + bodega estática)
  function renumber() {
    var idxs = document.querySelectorAll(".menu-block .menu-head .idx");
    for (var i = 0; i < idxs.length; i++) idxs[i].textContent = roman(i + 1);
  }

  function initSpy(linksNL) {
    var links = [].slice.call(linksNL);
    if (!links.length) return;
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
    var tick = false;
    function spy() {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var best = 0, bestTop = -Infinity, mark = 180;
        for (var i = 0; i < targets.length; i++) {
          if (!targets[i]) continue;
          var top = targets[i].getBoundingClientRect().top;
          if (top <= mark && top > bestTop) { bestTop = top; best = i; }
        }
        links.forEach(function (a, i) { a.classList.toggle("active", i === best); });
        tick = false;
      });
    }
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  function injectMenuJsonLd(order, groups) {
    var sections = order.map(function (sec) {
      return {
        "@type": "MenuSection", "name": sec,
        "hasMenuItem": groups[sec].map(function (it) {
          var m = { "@type": "MenuItem", "name": it.name };
          if (it.desc) m.description = it.desc;
          var pm = (it.price || "").match(/(\d+(?:[.,]\d+)?)/);
          if (pm) m.offers = { "@type": "Offer", "price": pm[1].replace(",", "."), "priceCurrency": "EUR" };
          return m;
        })
      };
    });
    var data = { "@context": "https://schema.org", "@type": "Menu", "name": "Carta · Restaurante Los Cuchillos", "inLanguage": "es", "hasMenuSection": sections };
    var old = document.getElementById("menu-jsonld");
    if (old) old.remove();
    var s = document.createElement("script");
    s.type = "application/ld+json"; s.id = "menu-jsonld";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ============================================================
     MENÚ DEL DÍA
     ============================================================ */
  function renderMenuDia(objs, el, opts) {
    opts = opts || {};
    var price = "", note = "", order = [], groups = {};
    objs.forEach(function (o) {
      var grp = pick(o, ["grupo", "seccion", "section", "tipo"]);
      var plato = pick(o, ["plato", "nombre", "name"]);
      var desc = pick(o, ["descripcion", "description", "desc"]);
      var g = norm(grp);
      if (g === "precio") { price = plato; return; }
      if (g === "nota") { note = plato; return; }
      if (!grp || !plato) return;
      if (!groups[grp]) { groups[grp] = []; order.push(grp); }
      groups[grp].push({ name: plato, desc: desc });
    });
    if (!order.length && !price) { el.style.display = "none"; return; }

    var cols = order.map(function (grp) {
      var lis = groups[grp].map(function (it) {
        return "<li>" + esc(it.name) + (it.desc ? ' <span class="menudia__desc">· ' + esc(it.desc) + "</span>" : "") + "</li>";
      }).join("");
      return '<div class="menudia__group"><h3>' + esc(grp) + "</h3><ul>" + lis + "</ul></div>";
    }).join("");

    var cta = opts.cta ? '<div style="margin-top:28px"><a class="link-line" href="carta.html#menudia">Ver carta y menú del día</a></div>' : "";
    el.innerHTML =
      '<div class="menudia in">' +
        '<div class="menudia__top">' +
          '<span class="eyebrow">Menú del día</span>' +
          (price ? '<span class="menudia__price">' + esc(price) + "</span>" : "") +
        "</div>" +
        (note ? '<p class="menudia__note">' + esc(note) + "</p>" : "") +
        '<div class="menudia__cols">' + cols + "</div>" +
        cta +
      "</div>";
    el.style.display = "";
  }

  /* ============================================================
     ARRANQUE
     ============================================================ */
  function fail(el, msg) {
    if (!el) return;
    el.innerHTML = '<div class="wrap center" style="padding:40px 0;color:var(--ink-mut)"><p>' +
      esc(msg) + '</p><p style="margin-top:10px"><a class="link-line" href="tel:+34611462382">Consúltanos · 611 46 23 82</a></p></div>';
  }

  var cartaRoot = document.getElementById("carta-root");
  var menuDiaEl = document.getElementById("menudia");
  var menuDiaHome = document.getElementById("menudia-home");

  if (cartaRoot) {
    cartaRoot.innerHTML = '<div class="wrap center" style="padding:60px 0;color:var(--ink-mut)">Cargando carta…</div>';
    fetchCSV(MENU_SOURCES.carta)
      .then(function (objs) { renderCarta(objs); })
      .catch(function () { fail(cartaRoot, "No hemos podido cargar la carta en este momento."); });
  }

  if (menuDiaEl || menuDiaHome) {
    fetchCSV(MENU_SOURCES.menuDia)
      .then(function (objs) {
        if (menuDiaEl) renderMenuDia(objs, menuDiaEl, {});
        if (menuDiaHome) renderMenuDia(objs, menuDiaHome, { cta: true });
      })
      .catch(function () {
        if (menuDiaEl) menuDiaEl.style.display = "none";
        if (menuDiaHome) menuDiaHome.style.display = "none";
      });
  }
})();
