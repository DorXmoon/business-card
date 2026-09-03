/* ============================================================================
   app.js — движок сайта. Обычно править НЕ нужно: весь контент лежит в data/.
   Что он делает:
     1) включает/выключает секции по site.config.js, строит меню и нумерацию
     2) переключает язык (EN/RU) и запоминает выбор
     3) рендерит списки из content.js и projects.js
     4) открывает модалку кейса
     5) показывает блоки при прокрутке со стаггером

   Моушн здесь по правилам Emil Kowalski: только transform/opacity,
   transitions вместо keyframes (их можно перехватить на полпути),
   стаггер 40 мс, всё под 300 мс, prefers-reduced-motion уважается.
   ========================================================================== */
(function () {
  'use strict';

  var LANGS = ['en', 'ru'];
  var STAGGER = 40;          // мс между соседними элементами (Emil: 30–80)

  /* Язык живёт в АДРЕСЕ, а не в параметре:
       site.com/      → EN   (index.html)
       site.com/ru/   → RU   (ru/index.html)
     Файл ru/index.html выставляет window.FORCE_LANG = 'ru' до подключения
     этого скрипта. Ссылка получается чистой и индексируется поисковиками
     как отдельная страница. Пересобрать ru/ после правки index.html:
     node tools/build-langs.js */
  /* Язык берём из флага, а если его нет — из адреса (.../ru/...). Второй
     рубеж намеренный: однажды сборщик перестал вставлять флаг, и русская
     страница молча отрисовалась английской — по адресу это ловится всегда. */
  function langFromPath() {
    var m = location.pathname.match(/\/([a-z]{2})(?:\/|\/index\.html)?$/);
    return m && LANGS.indexOf(m[1]) !== -1 ? m[1] : null;
  }
  var lang = (window.FORCE_LANG && LANGS.indexOf(window.FORCE_LANG) !== -1)
    ? window.FORCE_LANG
    : (langFromPath() || (window.SITE && window.SITE.defaultLang) || 'en');

  /* Префикс до корня сайта: со страницы /ru/ это '../', с корня — ''. */
  var ROOT = (lang !== ((window.SITE && window.SITE.defaultLang) || 'en')) ? '../' : '';

  var REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- утилиты ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function t(key) {
    var row = window.I18N && window.I18N[key];
    return row ? (row[lang] || row.en || '') : '';
  }

  /* Текст из data/ ставим через textContent: случайный < или & в описании
     не сломает разметку и не станет исполняемым. */
  function setText(el, v) { el.textContent = v == null ? '' : String(v); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function loc(obj) { return !obj ? {} : (obj[lang] || obj.en || {}); }

  /* Адрес проекта для показа НЕ на русской странице. Кириллический домен
     (шрс-сервис.рф) у иностранного посетителя выглядит сломанным или
     подозрительным, поэтому вне RU отдаём его машинную форму (punycode) —
     ведёт туда же, но читается как обычный адрес. new URL сам переводит
     имя хоста; не получилось — оставляем как есть, ссылка важнее красоты. */
  function siteUrl(u) {
    if (!u || lang === 'ru') return u;
    try { return new URL(u).href; } catch (e) { return u; }
  }

  /* Карточка может существовать только на одном языке (например, разбор
     «почему не WordPress» нужен на RU и не нужен на EN). Такую помечаем
     полем langs: ['ru'] — и пропускаем на остальных языках, чтобы в списке
     не оставалась пустая пронумерованная строка. */
  function skip(item, L) {
    if (item.langs && item.langs.indexOf(lang) === -1) return true;
    /* ВНИМАНИЕ при добавлении нового типа блока: список полей ниже — белый,
       и поле, которого в нём нет, для этой проверки не существует. Карточка
       с новыми именами полей молча признаётся пустой и не рисуется вообще —
       без ошибки в консоли и без пустого места на странице. Ровно так при
       добавлении раздела вопросов исчезли все пять карточек (`q` и `a` в
       списке отсутствовали). Тот же класс дефекта, что и «генератор файла
       данных удаляет поля, которых не знает»: белый список полей всегда
       обязан пополняться в том же заходе, что и новый формат данных. */
    var txt = (L.pain || '') + (L.title || '') + (L.text || '') + (L.answer || '') +
              (L.q || '') + (L.a || '') + (L.lead || '');
    return txt.trim() === '';
  }

  /* Адрес страницы на другом языке. EN — корень, остальные — папка /<код>/
     Открыли файл двойным кликом (file://)? Тогда папка сама index.html не
     отдаст — дописываем имя файла явно, иначе ссылка на язык не работает. */
  function urlFor(code) {
    var def = (window.SITE && window.SITE.defaultLang) || 'en';
    var isFile = location.protocol === 'file:';
    var tail = isFile ? 'index.html' : '';
    return code === def ? ((ROOT || './') + tail) : (ROOT + code + '/' + tail);
  }

  /* ---------- 1. секции, меню, нумерация ---------- */
  function applySections() {
    var cfg = (window.SITE && window.SITE.sections) || [];
    var main = $('#main');
    var track = $('#pillnavTrack');
    track.innerHTML = '';
    var num = 0;

    cfg.forEach(function (s) {
      var node = $('[data-section="' + s.id + '"]');
      if (!node) return;
      /* langs задан — секция живёт только на перечисленных языках */
      var okLang = !s.langs || s.langs.indexOf(lang) !== -1;
      if (!s.enabled || !okLang) { node.remove(); return; }

      node.hidden = false;
      main.appendChild(node);            // порядок в конфиге = порядок на странице

      num += 1;
      var slot = $('[data-sec-num]', node);
      if (slot) setText(slot, (num < 10 ? '0' : '') + num);

      if (s.nav) {
        var a = el('a', null, t('nav.' + s.id));
        a.href = '#' + s.id;
        a.setAttribute('data-i18n', 'nav.' + s.id);
        a.setAttribute('data-for', s.id);
        track.appendChild(a);
      }
    });
  }

  /* ---------- 2. контакты и мелочи из конфига ---------- */
  function applyConfig() {
    var S = window.SITE || {};
    var tg = S.telegram || {};
    $$('[data-tg]').forEach(function (a) { if (tg.url) a.href = tg.url; });
    $$('[data-tg-handle]').forEach(function (n) { setText(n, tg.handle || ''); });
    $$('[data-brand-name]').forEach(function (n) { setText(n, (S.brand && S.brand.name) || ''); });
    $$('[data-brand-initials]').forEach(function (n) { setText(n, (S.brand && S.brand.initials) || ''); });
    $$('[data-year]').forEach(function (n) { setText(n, new Date().getFullYear()); });

    var mail = (S.email && (S.email[lang] || S.email.en)) || '';
    $$('[data-email]').forEach(function (a) {
      var row = a.closest ? a.closest('.contact-mail') : null;
      if (!mail) { if (row) row.hidden = true; return; }
      a.href = 'mailto:' + mail;
      setText(a, mail);
      a.setAttribute('data-goal', 'contact_mail');
    });

    var demo = S.demoBot || {};
    var demoOn = demo.url && (!demo.langs || demo.langs.indexOf(lang) !== -1);
    $$('[data-cta2]').forEach(function (a) {
      if (!demoOn) return;
      a.href = demo.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('data-i18n', 'hero.cta2demo');
      a.setAttribute('data-goal', 'demo_bot');
    });

    /* Почта на первом экране — только там, где мессенджер не норма рынка.
       На RU второй кнопкой стоит бот и почта не нужна так высоко; на EN
       Telegram есть примерно у 9% читателей, и единственный работающий канал
       связи нельзя оставлять на 92% глубины страницы. */
    $$('[data-hero-mail]').forEach(function (a) {
      a.hidden = !(mail && !demoOn);
    });

    $$('[data-tg]').forEach(function (a) { a.setAttribute('data-goal', 'contact_tg'); });
  }

  function initAnalytics() {
    var id = (window.SITE && window.SITE.analytics && window.SITE.analytics.metrikaId) || null;

    /* Клики слушаем ВСЕГДА, даже без счётчика: цель уедет в никуда, но
       разметка целей проверяется до того, как счётчик заведён. */
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('[data-goal]') : null;
      if (a) reachGoal(a.getAttribute('data-goal'));
    }, true);

    if (!id) return;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(id, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
  }

  function reachGoal(name) {
    var id = (window.SITE && window.SITE.analytics && window.SITE.analytics.metrikaId) || null;
    if (id && typeof window.ym === 'function') window.ym(id, 'reachGoal', name);
  }
  /* Отдаём наружу: модалка кейса и другие места зовут цель напрямую. */
  window.dxGoal = reachGoal;

  /* ---------- 3. рендер списков ---------- */
  function renderWhy() {
    var box = $('#whyList'); if (!box) return;
    box.innerHTML = '';
    (window.WHY || []).forEach(function (item) {
      var L = loc(item);
      if (skip(item, L)) return;
      /* Первую колонку занимает ::before со счётчиком — он тоже grid-элемент,
         поэтому здесь добавляем ТОЛЬКО тело, иначе текст уедет в узкую колонку. */
      var li = el('li', 'why-item reveal');
      var body = el('div');
      body.appendChild(el('strong', 'pain', L.pain));
      body.appendChild(el('span', 'fact', L.fact));
      /* Ответ раскрывается по светящейся линии: на ней остаётся короткая
         формулировка решения, полный текст открывается и сворачивается
         обратно. Развязка видна сразу — прятать её целиком нельзя. */
      if (L.lead) {
        var d = document.createElement('details');
        d.className = 'why-fold';
        var sum = document.createElement('summary');
        sum.className = 'why-lead';
        sum.appendChild(el('span', 'why-lead-txt', L.lead));
        sum.appendChild(el('span', 'why-lead-more', t('fold.open')));
        sum.appendChild(el('span', 'why-lead-less', t('fold.close')));
        d.appendChild(sum);
        d.appendChild(el('span', 'ans', L.answer));
        body.appendChild(d);
      } else {
        body.appendChild(el('span', 'ans', L.answer));
      }
      li.appendChild(body);
      box.appendChild(li);
    });
  }

  function renderServices() {
    var box = $('#svcList'); if (!box) return;
    box.innerHTML = '';
    var extra = [];

    function card(item) {
      var L = loc(item);
      if (skip(item, L)) return null;
      var li = el('li', 'svc-item reveal');
      var b = el('div');
      b.appendChild(el('h3', null, L.title));
      b.appendChild(el('p', 'txt', L.text));
      if (L.points && L.points.length) {
        var ul = el('ul');
        L.points.forEach(function (pt) { ul.appendChild(el('li', null, pt)); });
        b.appendChild(ul);
      }
      li.appendChild(b);
      return li;
    }

    (window.SERVICES || []).forEach(function (item) {
      var li = card(item);
      if (!li) return;
      if (item.tier === 2) extra.push({ el: li, title: loc(item).title });
      else box.appendChild(li);
    });

    if (!extra.length) return;
    var d = document.createElement('details');
    d.className = 'sec-fold svc-more';
    var sum = document.createElement('summary');
    sum.className = 'sec-fold-sum';
    sum.appendChild(el('span', 'sec-fold-list',
      t('services.more') + ' ' + extra.map(function (x) { return x.title.split(' \u2014 ')[0]; }).join(' · ')));
    sum.appendChild(el('span', 'sec-fold-hint', t('fold.open')));
    sum.appendChild(el('span', 'sec-fold-hide', t('fold.close')));
    d.appendChild(sum);
    var ul = el('ul', 'svc-list');
    extra.forEach(function (x) { ul.appendChild(x.el); });
    d.appendChild(ul);
    box.parentNode.appendChild(d);
  }


  function renderStack() {
    var box = $('#stackList'); if (!box) return;
    box.innerHTML = '';
    (window.STACK || []).forEach(function (item) {
      var L = loc(item);
      var row = el('div', 'stack-row reveal');
      row.appendChild(el('div', 'k', L.k));
      row.appendChild(el('div', 'v', L.v));
      box.appendChild(row);
    });
  }

  function renderPartnership() {
    var box = $('#ptList'); if (!box) return;
    box.innerHTML = '';
    (window.PARTNERSHIP || []).forEach(function (item) {
      var L = loc(item);
      if (skip(item, L)) return;
      var row = el('div', 'pt-row reveal');
      var badge = item.badge ? (item.badge[lang] || item.badge.en) : '';
      row.appendChild(badge ? el('span', 'pt-badge', badge) : el('span'));
      var body = el('div');
      body.appendChild(el('h3', null, L.title));
      body.appendChild(el('p', null, L.text));
      row.appendChild(body);
      box.appendChild(row);
    });
  }

  /* С кем работаю: логотипов-файлов нет, поэтому марка — моно-инициалы.
     Пустая рамка под несуществующую картинку выглядит хуже, чем буквы. */
  function renderPartners() {
    var box = $('#partnersList'); if (!box) return;
    box.innerHTML = '';
    (window.PARTNERS || []).forEach(function (item) {
      var L = loc(item);
      if (!L.name) return;
      var row = el(item.url ? 'a' : 'div', 'pn-row reveal');
      if (item.url) { row.href = item.url; row.target = '_blank'; row.rel = 'noopener'; }
      if (item.logo) {
        var lg = el('img', 'pn-logo');
        lg.src = ROOT + item.logo; lg.alt = L.name; lg.decoding = 'async';
        lg.width = 44; lg.height = 44;
        row.appendChild(lg);
      } else {
        row.appendChild(el('span', 'pn-mark', item.mark || ''));
      }
      var body = el('div');
      body.appendChild(el('span', 'pn-name', L.name));
      body.appendChild(el('span', 'pn-kind', L.kind));
      row.appendChild(body);
      row.appendChild(el('span', 'pn-meta', L.meta));
      box.appendChild(row);
    });
  }

  /* ---------- ОТЗЫВЫ: видео в рамке телефона ----------
     Рамка нарисована CSS-ом, а не картинкой и не 3D-движком: у сайта заявлен
     ноль зависимостей, и тащить WebGL ради корпуса телефона — 150 КБ ради
     скруглённых углов. Объём даёт perspective + тень, «живость» — hover.

     Звук. Браузер разрешает автозапуск ТОЛЬКО без звука, поэтому наведение
     запускает немой предпросмотр, а звук появляется по клику — это уже жест
     пользователя, и он же открывает модалку с контролами.

     preload="none" обязателен: иначе 4 МБ уезжают посетителю до того, как он
     вообще доскроллил до секции. */
  /* Подписи языков в меню субтитров плеера — на своём языке, как принято:
     русский пункт называется «Русские», английский — «English», независимо
     от того, на какой языковой версии сайта открыт отзыв. */
  var SUB_LABEL = { ru: 'Русские', en: 'English' };

  /* Субтитры включаем скриптом, а не атрибутом default: при программном
     создании <track> браузер отдаёт дорожку в режиме 'disabled', и default
     на неё уже не действует.
     Дорожки добавляем ВСЕ, какие есть, а не только для языка страницы —
     иначе в меню плеера нечего выбирать. Активна по умолчанию та, что
     совпадает с языком страницы. */
  function addSubs(v, item, all) {
    var subs = item.subs; if (!subs) return;
    var codes = all ? Object.keys(subs) : [subs[lang] ? lang : 'en'];
    codes.forEach(function (code) {
      if (!subs[code]) return;
      var tr = document.createElement('track');
      tr.kind = 'subtitles'; tr.srclang = code; tr.src = ROOT + subs[code];
      tr.label = SUB_LABEL[code] || code.toUpperCase();
      v.appendChild(tr);
      var on = (code === lang) || codes.length === 1;
      var apply = function () { if (tr.track) tr.track.mode = on ? 'showing' : 'disabled'; };
      tr.addEventListener('load', apply);
      apply();
    });
  }

  function playSafe(v) {
    var pr = v.play();
    /* play() отклоняется, если элемент убрали с экрана раньше старта —
       это не ошибка, но без catch она валится в консоль красным. */
    if (pr && pr.catch) pr.catch(function () {});
  }


  /* ---------- СВОЙ ПЛЕЕР ----------
     Зачем свой, а не штатный `controls`. Меню штатного плеера Chrome —
     белая системная плашка, которая вываливается поверх кадра и никак не
     стилизуется: ни рамки, ни анимации, ни языка интерфейса. На сайте, где
     всё остальное нарисовано вручную, она читается как чужая деталь.

     Что важно НЕ потерять при своём плеере:
     1) Дорожки <track> остаются на месте. Меню только переключает
        track.mode — значит субтитры по-прежнему рисует браузер, работает
        оформление ::cue и они не пропадают в полноэкранном режиме на iOS.
        Разбирать VTT руками ради «своего» рендера было бы шагом назад.
     2) Полноэкранный режим запрашиваем у КОНТЕЙНЕРА, а не у <video>.
        Chrome на Android, получив fullscreen от самого видеоэлемента,
        принудительно доворачивает экран в альбом и оставляет ориентацию
        перевёрнутой после выхода. У контейнера этого поведения нет:
        портретное видео разворачивается портретом, повернул телефон —
        стало альбомом. Ровно как в YouTube. screen.orientation.lock()
        не трогаем НИКОГДА — это и есть источник той самой ошибки.
     3) Никакого backdrop-filter в панели: размытие поверх играющего кадра
        роняет fps (та же грабля, из-за которой на странице есть .vm-open).
        Панель — градиент, он бесплатный. */
  var PL_HIDE = 2600;        /* мс бездействия до скрытия панели */

  function svg(inner) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  var STROKE = ' fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var PL_ICON = {
    play:  svg('<path d="M8 5.4v13.2L19 12z"/>'),
    pause: svg('<path d="M7 5h3.2v14H7zM13.8 5H17v14h-3.2z"/>'),
    vol:   svg('<path d="M4 9.4h3.3L11.5 5.8v12.4L7.3 14.6H4z"/><path d="M14.8 9.5a3.6 3.6 0 0 1 0 5M17.4 7.1a7.2 7.2 0 0 1 0 9.8"' + STROKE + '/>'),
    mute:  svg('<path d="M4 9.4h3.3L11.5 5.8v12.4L7.3 14.6H4z"/><path d="M15.2 9.6l4.6 4.8M19.8 9.6l-4.6 4.8"' + STROKE + '/>'),
    cc:    svg('<rect x="2.4" y="5.2" width="19.2" height="13.6" rx="2.6"' + STROKE + '/><path d="M10 10.6a2.6 2.6 0 1 0 0 2.8M18.2 10.6a2.6 2.6 0 1 0 0 2.8"' + STROKE + '/>'),
    full:  svg('<path d="M4 9V4.6h4.6M20 9V4.6h-4.6M4 15v4.4h4.6M20 15v4.4h-4.6"' + STROKE + '/>'),
    small: svg('<path d="M8.6 4.6V9H4M15.4 4.6V9H20M8.6 19.4V15H4M15.4 19.4V15H20"' + STROKE + '/>'),
    check: svg('<path d="M5 12.6l4.4 4.4L19 7.4"' + STROKE + ' stroke-width="2.2"/>')
  };

  function clock(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* Собирает панель управления внутри box (у него уже position:relative и
     overflow:hidden) и возвращает { reset } для повторного использования. */
  function player(v, box) {
    if (!v || !box) return null;
    box.classList.add('pl-host');

    var shade = el('div', 'pl-shade');
    var big   = el('button', 'pl-big'); big.type = 'button';
    big.innerHTML = PL_ICON.play;
    big.setAttribute('aria-label', t('player.play'));
    var bar   = el('div', 'pl-bar');

    var seek = el('div', 'pl-seek');
    seek.setAttribute('role', 'slider');
    seek.setAttribute('aria-label', t('player.seek'));
    seek.tabIndex = 0;
    var buf = el('div', 'pl-buf'), fill = el('div', 'pl-fill');
    fill.appendChild(el('span', 'pl-knob'));
    seek.appendChild(buf); seek.appendChild(fill);

    var row = el('div', 'pl-row');
    function btn(cls, icon, label) {
      var b = el('button', 'pl-b ' + cls); b.type = 'button';
      b.innerHTML = icon; b.setAttribute('aria-label', label);
      return b;
    }
    var bPlay = btn('pl-play', PL_ICON.play, t('player.play'));
    var time  = el('span', 'pl-time', '0:00 / 0:00');
    var vol   = el('div', 'pl-vol');
    var bMute = btn('pl-mute', PL_ICON.vol, t('player.mute'));
    var range = el('input', 'pl-range');
    range.type = 'range'; range.min = 0; range.max = 1; range.step = 0.05;
    range.value = 1; range.setAttribute('aria-label', t('player.volume'));
    vol.appendChild(bMute); vol.appendChild(range);
    var bCC = btn('pl-cc', PL_ICON.cc, t('player.subs'));
    var bFS = btn('pl-fs', PL_ICON.full, t('player.full'));

    row.appendChild(bPlay); row.appendChild(time); row.appendChild(vol);
    row.appendChild(el('span', 'pl-sp'));
    row.appendChild(bCC); row.appendChild(bFS);
    bar.appendChild(seek); bar.appendChild(row);

    /* Меню субтитров. Живёт ВНУТРИ box, а не в body: на .vm-phone во время
       FLIP-анимации висит transform, а position:fixed внутри трансформи-
       рованного предка считается от предка — меню уехало бы мимо. */
    var menu = el('div', 'pl-menu');
    menu.hidden = true;
    menu.setAttribute('role', 'menu');

    box.appendChild(shade); box.appendChild(big);
    box.appendChild(bar); box.appendChild(menu);

    /* ---- субтитры ---- */
    function tracks() {
      return Array.prototype.filter.call(v.textTracks || [], function (tr) {
        return tr.kind === 'subtitles' || tr.kind === 'captions';
      });
    }
    function activeCode() {
      var on = null;
      tracks().forEach(function (tr) { if (tr.mode === 'showing') on = tr.language || ''; });
      return on;
    }
    function pickSubs(code) {
      tracks().forEach(function (tr) {
        tr.mode = (code && (tr.language || '') === code) ? 'showing' : 'disabled';
      });
      buildMenu();
      liftCues();
    }
    /* Пока панель на экране, поднимаем строку субтитров на пару рядов выше —
       иначе она читается сквозь кнопки. Так же ведёт себя YouTube. */
    function liftCues() {
      var up = box.classList.contains('pl-live');
      tracks().forEach(function (tr) {
        var cues = tr.cues; if (!cues) return;
        for (var i = 0; i < cues.length; i++) {
          try { cues[i].line = up ? -4 : -2; } catch (e) { /* старый Safari */ }
        }
      });
    }
    function buildMenu() {
      var list = tracks();
      bCC.hidden = list.length === 0;
      if (!list.length) { menu.hidden = true; box.classList.remove('pl-menu-on'); return; }
      menu.innerHTML = '';
      menu.appendChild(el('div', 'pl-menu-h', t('player.subs')));
      var cur = activeCode();
      var rows = [{ code: null, label: t('player.subsOff') }];
      list.forEach(function (tr) { rows.push({ code: tr.language || '', label: tr.label || tr.language }); });
      rows.forEach(function (r) {
        var b = el('button', 'pl-mi' + ((r.code || null) === cur ? ' on' : ''));
        b.type = 'button'; b.setAttribute('role', 'menuitemradio');
        b.setAttribute('aria-checked', (r.code || null) === cur ? 'true' : 'false');
        b.innerHTML = '<span class="pl-mi-c">' + PL_ICON.check + '</span>';
        b.appendChild(el('span', 'pl-mi-t', r.label));
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          pickSubs(r.code);
          closeMenu();
        });
        menu.appendChild(b);
      });
      bCC.classList.toggle('on', !!cur);
      bCC.setAttribute('aria-label', cur ? t('player.subsHide') : t('player.subs'));
    }
    function openMenu() {
      buildMenu();
      menu.hidden = false;
      void menu.offsetWidth;              /* стартовый кадр — см. flipFrom */
      box.classList.add('pl-menu-on');
      show(true);
    }
    function closeMenu() {
      if (menu.hidden) return;
      box.classList.remove('pl-menu-on');
      if (REDUCED) { menu.hidden = true; return; }
      setTimeout(function () {
        if (!box.classList.contains('pl-menu-on')) menu.hidden = true;
      }, 190);
    }
    bCC.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });

    /* ---- показ и скрытие панели ---- */
    /* Есть ли у устройства наведение. Считается один раз при сборке плеера
       и решает две вещи: слушать ли mousemove и что делает тап по кадру. */
    var HOVERABLE = !(window.matchMedia && window.matchMedia('(hover: none)').matches);
    /* Ширину меряем не только через ResizeObserver: он молчит, когда элемент
       переходит из скрытого предка в видимый — а модалка открывается именно
       так, и панель осталась бы в «узком» режиме на широком экране. */
    function measure() { box.classList.toggle('pl-narrow', box.clientWidth < 340); }
    var hideT = null;
    function idle() {
      if (!v.paused && menu.hidden) { box.classList.remove('pl-live'); liftCues(); }
    }
    /* Тяжёлую часть (замер ширины и перестановку субтитров) делаем ТОЛЬКО на
       переходе «скрыта → видна». Иначе каждый mousemove поверх играющего
       видео читал бы clientWidth и переписывал line у всех реплик — то же
       семейство тормозов, ради которого на странице есть .vm-open. */
    function show(sticky) {
      if (!box.classList.contains('pl-live')) {
        box.classList.add('pl-live');
        measure();
        liftCues();
      }
      if (hideT) { clearTimeout(hideT); hideT = null; }
      if (sticky || v.paused) return;
      hideT = setTimeout(idle, PL_HIDE);
    }
    /* ПАНЕЛЬ ПО НАВЕДЕНИЮ — ТОЛЬКО ТАМ, ГДЕ НАВЕДЕНИЕ ЕСТЬ.
       Баг, который это лечит (найден владельцем 2026-08-29, только на телефоне):
       тап по кадру не показывал панель, а «работала» будто бы невидимая
       полоса внизу. Механика была такая. Браузер на тап синтезирует
       mousemove ДО click. Сначала срабатывал mousemove → show() → панель
       появлялась, класс pl-live встал. Следом приходил click по кадру, видел
       pl-live и честно выполнял вторую половину переключателя — idle(),
       то есть прятал панель обратно. Пользователь видел, что тап не работает.
       А внизу «работало» потому, что к моменту click панель уже была видимой
       и получила pointer-events:auto — click доставался ей, до <video> не
       доходил, гасить было некому, и панель оставалась на экране.
       Отсюда лечение: на устройствах без наведения mousemove не слушаем
       вовсе — тап остаётся единственным и однозначным переключателем. */
    if (HOVERABLE) {
      box.addEventListener('mousemove', function () { show(); });
      box.addEventListener('mouseleave', idle);
    }

    /* ---- воспроизведение ---- */
    function toggle() { if (v.paused) playSafe(v); else v.pause(); }
    bPlay.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    big.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    /* Клик по кадру. С мышью это пауза, как в любом плеере. ПАЛЬЦЕМ — нет:
       на телефоне нет наведения, и единственный способ вызвать панель — тап
       по кадру. Если бы он же ставил паузу, показать управление, не остановив
       ролик, было бы нечем. Поэтому на тач-экране кадр только показывает и
       прячет панель, а пауза живёт на кнопке — ровно как в YouTube.
       Открытое меню закрывается первым кликом в любом случае: иначе промах
       мимо пункта останавливал бы ролик. */
    v.addEventListener('click', function () {
      if (!menu.hidden) { closeMenu(); return; }
      if (!HOVERABLE) {
        if (box.classList.contains('pl-live')) idle(); else show();
        return;
      }
      toggle();
    });

    function syncPlay() {
      var p = v.paused;
      box.classList.toggle('pl-paused', p);
      bPlay.innerHTML = p ? PL_ICON.play : PL_ICON.pause;
      bPlay.setAttribute('aria-label', p ? t('player.play') : t('player.pause'));
      if (p) show(true); else show();
    }
    v.addEventListener('play', syncPlay);
    v.addEventListener('pause', syncPlay);
    v.addEventListener('ended', syncPlay);

    function syncTime() {
      var d = v.duration;
      var k = (isFinite(d) && d > 0) ? (v.currentTime / d) : 0;
      fill.style.width = (k * 100) + '%';
      time.textContent = clock(v.currentTime) + ' / ' + clock(isFinite(d) ? d : 0);
      seek.setAttribute('aria-valuenow', Math.round(k * 100));
      try {
        if (v.buffered && v.buffered.length && isFinite(d) && d > 0) {
          buf.style.width = (v.buffered.end(v.buffered.length - 1) / d * 100) + '%';
        }
      } catch (e) { /* buffered кидается, пока поток не открыт */ }
    }
    v.addEventListener('timeupdate', syncTime);
    v.addEventListener('progress', syncTime);
    v.addEventListener('loadedmetadata', function () { syncTime(); buildMenu(); });

    /* ---- перемотка ---- */
    var dragging = false;
    function seekTo(clientX) {
      var r = seek.getBoundingClientRect();
      if (!r.width || !isFinite(v.duration)) return;
      var k = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      v.currentTime = k * v.duration;
      syncTime();
    }
    seek.addEventListener('pointerdown', function (e) {
      dragging = true;
      try { seek.setPointerCapture(e.pointerId); } catch (err) {}
      seekTo(e.clientX); show(true); e.stopPropagation();
    });
    seek.addEventListener('pointermove', function (e) { if (dragging) seekTo(e.clientX); });
    seek.addEventListener('pointerup', function (e) {
      dragging = false;
      try { seek.releasePointerCapture(e.pointerId); } catch (err) {}
      show();
    });
    seek.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { v.currentTime = Math.min(v.duration || 0, v.currentTime + 5); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { v.currentTime = Math.max(0, v.currentTime - 5); e.preventDefault(); }
    });

    /* ---- громкость ---- */
    function syncVol() {
      var off = v.muted || v.volume === 0;
      bMute.innerHTML = off ? PL_ICON.mute : PL_ICON.vol;
      bMute.setAttribute('aria-label', off ? t('player.unmute') : t('player.mute'));
      range.value = off ? 0 : v.volume;
    }
    bMute.addEventListener('click', function (e) {
      e.stopPropagation();
      var off = v.muted || v.volume === 0;
      v.muted = !off;
      if (off && v.volume === 0) v.volume = 1;
      syncVol();
    });
    range.addEventListener('input', function (e) {
      e.stopPropagation();
      v.volume = +range.value; v.muted = +range.value === 0; syncVol();
    });
    range.addEventListener('click', function (e) { e.stopPropagation(); });
    v.addEventListener('volumechange', syncVol);

    /* ---- полноэкранный режим ---- */
    function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
    function fsOn() { return fsEl() === box; }
    function syncFS() {
      var on = fsOn();
      box.classList.toggle('pl-fs-on', on);
      bFS.innerHTML = on ? PL_ICON.small : PL_ICON.full;
      bFS.setAttribute('aria-label', on ? t('player.exitFull') : t('player.full'));
    }
    bFS.addEventListener('click', function (e) {
      e.stopPropagation();
      if (fsOn()) {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document);
        return;
      }
      var req = box.requestFullscreen || box.webkitRequestFullscreen;
      if (req) {
        var p = req.call(box);
        if (p && p.catch) p.catch(function () {});
      } else if (v.webkitEnterFullscreen) {
        /* iPhone до 16.4: полноэкранный режим умеет только сам <video>.
           Там это встроенный плеер Apple, наша панель в нём не участвует —
           зато дорожки <track> он показывает, потому мы их и не выбрасывали. */
        v.webkitEnterFullscreen();
      }
    });
    /* Слушаем на самом box, а не на document: модалка кейса пересобирает
       ноутбук (а с ним и плеер) на каждое открытие, и документные обработчики
       копились бы пачками. Событие всплывает от элемента, который вошёл или
       вышел из полноэкранного режима, — этого достаточно. */
    box.addEventListener('fullscreenchange', syncFS);
    box.addEventListener('webkitfullscreenchange', syncFS);

    /* ---- узкий корпус: слайдер громкости не влезает ---- */
    if (window.ResizeObserver) { new ResizeObserver(measure).observe(box); }
    measure();

    function reset() {
      closeMenu();
      menu.hidden = true;
      box.classList.remove('pl-menu-on');
      buildMenu();
      syncPlay(); syncTime(); syncVol(); syncFS(); measure();
      show(true);
    }
    reset();
    return { reset: reset, isMenuOpen: function () { return !menu.hidden; }, closeMenu: closeMenu };
  }

  function renderReviews() {
    var box = $('#reviewsList'); if (!box) return;
    box.innerHTML = '';
    var hoverable = !(window.matchMedia && window.matchMedia('(hover: none)').matches);

    (window.REVIEWS || []).forEach(function (item) {
      var L = loc(item);
      if (!L.name) return;

      var card = el('div', 'rv-card reveal');

      /* ---- сам «телефон» ---- */
      var phone = el('button', 'rv-phone');
      phone.type = 'button';
      phone.setAttribute('aria-label', t('reviews.play') + ' — ' + L.name);

      var screen = el('span', 'rv-screen');
      var v = document.createElement('video');
      v.className = 'rv-video';
      v.src = ROOT + item.video;
      if (item.poster) v.poster = ROOT + item.poster;
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline', '');       /* старый iOS читает только атрибут */
      v.preload = 'none';
      v.tabIndex = -1;
      addSubs(v, item, false);   /* в превью контролов нет — вторая дорожка там мертвый груз */
      screen.appendChild(v);

      screen.appendChild(el('span', 'rv-island'));   /* «остров» фронталки */
      screen.appendChild(el('span', 'rv-glare'));    /* блик стекла */

      var play = el('span', 'rv-play');
      play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
      screen.appendChild(play);
      screen.appendChild(el('span', 'rv-home'));   /* полоска-индикатор дома */

      phone.appendChild(el('span', 'rv-btn rv-btn-vol1'));
      phone.appendChild(el('span', 'rv-btn rv-btn-vol2'));
      phone.appendChild(el('span', 'rv-btn rv-btn-pwr'));
      phone.appendChild(screen);


      if (hoverable) {
        phone.addEventListener('mouseenter', function () { playSafe(v); });
        phone.addEventListener('mouseleave', function () { v.pause(); });
        /* Клавиатура: фокус = то же, что наведение, иначе виджет мёртв без мыши */
        phone.addEventListener('focus', function () { playSafe(v); });
        phone.addEventListener('blur', function () { v.pause(); });
      }
      phone.addEventListener('click', function () { openVideo(item, L, v); });

      /* ---- текст рядом ---- */
      var body = el('div', 'rv-body');
      if (item.avatar) {
        var av = el('img', 'rv-avatar');
        av.src = ROOT + item.avatar; av.alt = L.name;
        av.width = 48; av.height = 48; av.decoding = 'async';
        body.appendChild(av);
      }
      body.appendChild(el('span', 'rv-name', L.name));
      body.appendChild(el('span', 'rv-role', L.role));
      if (L.note) body.appendChild(el('p', 'rv-note', L.note));
      if (L.lang) body.appendChild(el('span', 'rv-lang', L.lang));
      if (L.quote) body.appendChild(el('p', 'rv-quote', L.quote));

      /* Ссылки «где проверить» — отзыв без проверки не стоит ничего */
      var links = el('div', 'rv-links');
      var LN = L.links || {};
      [['youtube', item.youtube], ['channel', item.tg && item.tg.channel],
       ['chat', item.tg && item.tg.chat], ['bot', item.tg && item.tg.bot]]
        .forEach(function (pair) {
          if (!pair[1] || !LN[pair[0]]) return;
          var a = el('a', 'rv-link rv-link-' + pair[0], LN[pair[0]]);
          a.href = pair[1]; a.target = '_blank'; a.rel = 'noopener';
          links.appendChild(a);
        });
      body.appendChild(links);

      card.appendChild(phone);
      card.appendChild(body);
      box.appendChild(card);
    });
  }

  /* Модалка отзыва — своя, не общая с кейсом: здесь есть звук, и видео обязано
     останавливаться при закрытии, иначе продолжает говорить за кадром. */
  var vmodal = $('#vmodal');
  var vmPhone = $('#vmodalPhone');
  var vmVideo = $('#vmodalVideo');
  var vmLast = null;
  var vmPreview = null;
  var vmTimer = null;
  /* Плеер модалки строим один раз и переиспользуем: сам <video> тоже один
     на все отзывы, пересоздавать панель на каждое открытие незачем. */
  var vmPlayer = null;

  /* FLIP: телефон «подъезжает» к экрану из своего места на странице.
     Сначала ставим большой корпус ровно туда и в тот размер, где стоит
     маленький в карточке, затем снимаем трансформацию — и браузер сам
     проигрывает переход. Так это читается как «телефон взяли и поднесли»,
     а не как «выскочило окно с видео». Всё на transform: композитор
     справляется даже пока рядом декодируется ролик. */
  function flipFrom(sourceEl) {
    if (!vmPhone || !sourceEl || REDUCED) return;
    var to = vmPhone.getBoundingClientRect();
    var from = sourceEl.getBoundingClientRect();
    if (!to.width || !from.width) return;
    var k = from.width / to.width;
    vmPhone.style.transition = 'none';
    vmPhone.style.transform =
      'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px)' +
      ' scale(' + k + ')';
    /* Принудительный reflow вместо двойного requestAnimationFrame: rAF не
       выполняется, пока вкладка в фоне, и телефон навсегда застывал бы в
       стартовом, уменьшенном положении. Чтение offsetWidth заставляет браузер
       применить стартовый кадр здесь и сейчас — переход запускается всегда. */
    void vmPhone.offsetWidth;
    vmPhone.style.transition = 'transform 340ms cubic-bezier(0.23, 1, 0.32, 1)';
    vmPhone.style.transform = 'none';
  }

  function openVideo(item, L, previewVideo) {
    if (!vmodal || !vmVideo) return;
    vmLast = document.activeElement;
    vmPreview = previewVideo || null;
    if (vmPreview) vmPreview.pause();

    /* Корпус модалки подгоняем под пропорцию записи: отзывы сняты 9:16, а
       демо мобильной версии — 1080x2324. С жёсткими 9:16 запись пришлось бы
       обрезать сверху и снизу. */
    var shape = item.screen && item.screen[0] && item.screen[1]
      ? item.screen[0] / item.screen[1] : 9 / 16;
    if (vmPhone) vmPhone.style.setProperty('--vm-ratio', shape);
    var vmScreen = $('.vm-phone .rv-screen');
    if (vmScreen) vmScreen.style.aspectRatio = String(shape);

    vmVideo.src = ROOT + item.video;
    if (item.poster) vmVideo.poster = ROOT + item.poster;
    vmVideo.muted = false;
    vmVideo.currentTime = 0;
    vmVideo.setAttribute('aria-label', L.name);
    /* Дорожку пересоздаём на каждое открытие: модалка одна на все отзывы */
    while (vmVideo.firstChild) vmVideo.removeChild(vmVideo.firstChild);
    addSubs(vmVideo, item, true);   /* в модалке есть меню — даём оба языка на выбор */
    if (!vmPlayer) vmPlayer = player(vmVideo, $('.vm-phone .rv-screen'));
    vmPlayer.reset();
    var x = $('.vmodal-x'); if (x) x.setAttribute('aria-label', t('reviews.close'));

    /* Успели нажать снова, пока идёт анимация закрытия? Отложенный обработчик
       иначе догонит уже открытую модалку, спрячет её и оставит страницу
       заблокированной (body.overflow) до перезагрузки. */
    if (vmTimer) { clearTimeout(vmTimer); vmTimer = null; }

    vmodal.hidden = false;
    document.body.style.overflow = 'hidden';
    flipFrom(previewVideo && previewVideo.closest('.rv-phone'));
    /* Пока играет видео, гасим ОСТАЛЬНЫЕ размытые слои страницы: каждый из них
       композитор пересчитывает, а видео меняет картинку 30 раз в секунду. */
    document.documentElement.classList.add('vm-open');
    void vmodal.offsetWidth;          /* см. пояснение в flipFrom */
    vmodal.classList.add('is-open');
    playSafe(vmVideo);
  }

  function closeVideo() {
    if (!vmodal || vmodal.hidden) return;
    vmVideo.pause();
    document.documentElement.classList.remove('vm-open');
    vmodal.classList.remove('is-open');
    document.body.style.overflow = '';
    var done = function () {
      vmodal.hidden = true;
      /* src снимаем, чтобы браузер отпустил поток: без этого вкладка держит
         декодер и на слабой машине следующая прокрутка дёргается. */
      vmVideo.removeAttribute('src'); vmVideo.load();
      if (vmPhone) { vmPhone.style.transition = 'none'; vmPhone.style.transform = 'none'; }
      if (vmLast && vmLast.focus) vmLast.focus();
    };
    if (REDUCED) done(); else vmTimer = setTimeout(done, 240);
  }

  $$('[data-vclose]').forEach(function (n) { n.addEventListener('click', closeVideo); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    /* Первый Escape в полноэкранном режиме принадлежит браузеру: он выходит
       из fullscreen. Закрыв заодно и модалку, мы бы выкинули человека из
       видео целиком с одного нажатия. */
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    if (lbOpen()) return;
    if (vmPlayer && vmPlayer.isMenuOpen()) { vmPlayer.closeMenu(); return; }
    closeVideo();
  });
  document.addEventListener('focusin', function (e) {
    if (!vmodal || vmodal.hidden) return;
    if (!vmodal.contains(e.target)) {
      var x = $('.vmodal-x'); if (x) x.focus();
    }
  });

  function renderPromo() {
    var box = $('#promoList'); if (!box) return;
    box.innerHTML = '';
    (window.PROMO || []).forEach(function (item) {
      var L = loc(item);
      if (skip(item, L)) return;
      var row = el('div', 'promo-row reveal');
      /* Заголовок и тег — одной строкой в общей обёртке. Раньше это были два
         прямых потомка сетки «1fr auto», и в две колонки тег уезжал к правому
         краю колонки — то есть вплотную к заголовку СОСЕДНЕЙ услуги, и читался
         как её плашка. */
      var head = el('div', 'promo-head');
      head.appendChild(el('h3', null, L.title));
      var tag = item.tag ? (item.tag[lang] || item.tag.ru || '') : '';
      if (tag) head.appendChild(el('span', 'promo-tag', tag));
      row.appendChild(head);
      row.appendChild(el('p', 'txt', L.text));
      box.appendChild(row);
    });
  }

  /* Работы: пустой массив → заглушка вместо пустого места */
  /* ---------- РАМКА НОУТБУКА ----------
     Тот же приём, что и с телефоном в отзывах, но горизонтальный: запись
     сделана с ноутбука, и в рамке телефона она читалась бы неправильно.
     Экран строится по РЕАЛЬНОЙ пропорции записи (поле demo.screen), иначе
     16:9 обрезало бы кадр или добавляло поля. */
  function laptop(demo, opts) {
    opts = opts || {};
    var box = el('div', 'lp' + (opts.big ? ' lp-big' : ''));

    var lid = el('div', 'lp-lid');
    var screen = el('div', 'lp-screen');
    if (demo.screen && demo.screen[0] && demo.screen[1]) {
      screen.style.aspectRatio = demo.screen[0] + ' / ' + demo.screen[1];
    }

    var v = document.createElement('video');
    v.className = 'lp-video';
    v.src = ROOT + demo.video;
    if (demo.poster) v.poster = ROOT + demo.poster;
    v.loop = true; v.playsInline = true; v.setAttribute('playsinline', '');
    v.preload = 'none';
    if (opts.big) {
      /* Штатные controls не ставим — панель рисует player() (см. выше) */
      v.disablePictureInPicture = true;
      v.muted = false;
    } else {
      v.muted = true; v.tabIndex = -1;
    }
    screen.appendChild(v);
    screen.appendChild(el('span', 'lp-cam'));      /* глазок камеры в рамке */
    if (!opts.big) screen.appendChild(el('span', 'lp-glare'));
    lid.appendChild(screen);

    box.appendChild(lid);
    box.appendChild(el('div', 'lp-base'));         /* основание с вырезом-выемкой */
    box.video = v;
    /* Панель управления собирается ПОСЛЕ вставки экрана в корпус: player()
       дописывает в .lp-screen свои узлы и меряет его ширину. */
    if (opts.big) box.player = player(v, screen);
    return box;
  }

  /* ---------- ТЕЛЕФОН РЯДОМ С НОУТОМ ----------
     Тот же корпус, что в отзывах (.rv-phone), только маленький, неинтерактивный
     и без кнопки Play: кликом обрабатывается вся строка работы целиком.
     Смысл пары — показать, что система живёт на обоих экранах. */
  function miniPhone(mob, title) {
    /* НЕ <button>: корпус лежит внутри строки работы, а она сама кнопка, и
       кнопка в кнопке — невалидная разметка. Роль и обработчик клавиатуры
       дают то же поведение без вложенной кнопки. */
    var box = el('div', 'rv-phone wk-phone');
    box.setAttribute('role', 'button');
    box.tabIndex = 0;
    box.setAttribute('aria-label', t('works.mobile') + ' — ' + (title || ''));

    var screen = el('span', 'rv-screen');
    if (mob.screen && mob.screen[0] && mob.screen[1]) {
      screen.style.aspectRatio = mob.screen[0] + ' / ' + mob.screen[1];
    }

    var v = document.createElement('video');
    v.className = 'rv-video';
    if (mob.poster) v.poster = ROOT + mob.poster;
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.preload = 'none';
    v.tabIndex = -1;
    /* src НЕ ставим здесь: файл подхватывается только когда запись с ноутбука
       уже пошла (см. renderWorks). Иначе браузер тянет два ролика разом и
       главный — десктопный — стартует медленнее. */
    v.dataset.src = ROOT + mob.video;
    screen.appendChild(v);
    screen.appendChild(el('span', 'rv-island'));
    screen.appendChild(el('span', 'rv-glare'));
    var play = el('span', 'rv-play');
    play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
    screen.appendChild(play);
    screen.appendChild(el('span', 'rv-home'));

    box.appendChild(el('span', 'rv-btn rv-btn-vol1'));
    box.appendChild(el('span', 'rv-btn rv-btn-vol2'));
    box.appendChild(el('span', 'rv-btn rv-btn-pwr'));
    box.appendChild(screen);
    box.video = v;
    return box;
  }

  /* Экономный режим связи: второй ролик в таких условиях только мешает
     первому — телефон остаётся картинкой-постером. */
  function thinPipe() {
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return false;
    return !!c.saveData || /(^|-)(2g|slow-2g|3g)$/.test(c.effectiveType || '');
  }

  /* ---------- ТЕЛЕФОН/НОУТ НА СЕНСОРНОМ ЭКРАНЕ ----------
     На мышке запись включает наведение. На телефоне наводить нечем, и раньше
     в портфолио стояли просто постеры. Включаем по прокрутке, но с двумя
     жёсткими условиями, иначе это дорого по трафику:
       1) играет РОВНО ОДНА работа — та, которую посетитель сейчас смотрит
          (самая заметная на экране). Соседи не просто на паузе — они и не
          начинали грузиться: у <video> стоит preload="none", а байты
          тянутся только с первого play().
       2) ушла с экрана — сразу пауза. Не долистал до работы или пролистнул
          дальше — её ролик не скачивается вообще.
     Порог 0.55: карточка должна занять больше половины своей высоты в кадре,
     иначе на границе двух работ звук... точнее картинка прыгала бы туда-сюда. */
  var liveIO = null, liveCells = [], liveOn = null;

  function liveStop(cell) {
    if (!cell) return;
    cell.row.classList.remove('is-live');
    try { cell.lv.pause(); } catch (e) {}
    if (cell.pv) { try { cell.pv.pause(); } catch (e) {} }
  }

  function liveStart(cell) {
    if (!cell || liveOn === cell) return;
    liveStop(liveOn);
    liveOn = cell;
    cell.row.classList.add('is-live');
    playSafe(cell.lv);          /* звука нет: ролик в карточке всегда muted */
  }

  function observeLiveDemos() {
    if (liveIO) { liveIO.disconnect(); liveIO = null; }
    liveOn = null;
    if (!liveCells.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) return;

    var ratios = [];
    liveIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        for (var i = 0; i < liveCells.length; i++) {
          if (liveCells[i].row === en.target) { ratios[i] = en.intersectionRatio; break; }
        }
      });
      /* Кто виден лучше всех — тот и играет. Считаем по всем карточкам сразу,
         а не по одному событию: иначе при быстрой прокрутке «победителем»
         оказывалась случайная работа, попавшая в последнюю пачку. */
      var best = -1, bestAt = -1;
      for (var k = 0; k < liveCells.length; k++) {
        var r = ratios[k] || 0;
        if (r > best) { best = r; bestAt = k; }
      }
      if (best >= 0.55 && bestAt >= 0) liveStart(liveCells[bestAt]);
      else { liveStop(liveOn); liveOn = null; }
    }, { threshold: [0, 0.25, 0.55, 0.75, 1] });

    liveCells.forEach(function (c) { liveIO.observe(c.row); });
  }

  /* Ушли со вкладки — глушим: фоновая вкладка не должна доигрывать трафик. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { liveStop(liveOn); liveOn = null; }
  });

  function renderWorks() {
    var list = $('#worksList'), empty = $('#worksEmpty');
    if (!list) return;
    list.innerHTML = '';
    liveCells = [];                  /* список пересобирается вместе с карточками */

    /* Портфолио раздельное: у работы поле langs говорит, на каких языках её
       показывать. Нет поля — работа видна везде. */
    var items = (window.PROJECTS || []).filter(function (p) {
      return !p.langs || p.langs.indexOf(lang) !== -1;
    });
    var has = items.length > 0;
    list.hidden = !has;
    if (empty) empty.hidden = has;
    if (!has) return;

    items.forEach(function (p, i) {
      var L = loc(p);
      var row = el('button', 'work reveal');
      row.type = 'button';

      /* Есть демо — показываем его в ноутбуке вместо статичной рамки:
         работающая система убедительнее скриншота. */
      if (p.demo && p.demo.video) {
        row.classList.add('has-demo');
        /* Сцена: ноутбук, а поверх его нижнего угла — телефон. Оба корпуса в
           одном контейнере, чтобы телефон мерился В ДОЛЯХ от ширины ноута и
           пара не разъезжалась ни на одной ширине экрана. */
        var stage = el('div', 'lp-stage');
        var lp = laptop(p.demo, {});
        stage.appendChild(lp);
        var lv = lp.video;

        var ph = null, pv = null;
        if (p.demo.mobile && p.demo.mobile.video) {
          stage.classList.add('has-phone');
          ph = miniPhone(p.demo.mobile, L.title);
          pv = ph.video;
          stage.appendChild(ph);
          /* Клик по телефону открывает МОБИЛЬНУЮ запись отдельно, в том же
             окне, что и видео-отзывы. Всплытие гасим: иначе следом откроется
             ещё и модалка кейса, и одно окно накроет другое. */
          var openPhone = function (e) {
            e.stopPropagation();
            if (!pv.src) pv.src = pv.dataset.src;
            openVideo({ video: p.demo.mobile.video, poster: p.demo.mobile.poster,
                        screen: p.demo.mobile.screen },
                      { name: L.title }, pv);
          };
          ph.addEventListener('click', openPhone);
          ph.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
            e.preventDefault();
            openPhone(e);
          });
          /* Приоритет у ПК-записи: телефон включается только ПОСЛЕ того, как
             ноутбучное видео реально пошло (событие playing, а не вызов play).
             Узкий канал — телефон вообще не грузим. */
          lv.addEventListener('playing', function () {
            if (!row.classList.contains('is-live') || thinPipe()) return;
            if (!pv.src) pv.src = pv.dataset.src;
            playSafe(pv);
          });
        }
        row.appendChild(stage);

        if (!(window.matchMedia && window.matchMedia('(hover: none)').matches)) {
          var enter = function () { row.classList.add('is-live'); playSafe(lv); };
          var leave = function () {
            row.classList.remove('is-live');
            lv.pause();
            if (pv) pv.pause();
          };
          row.addEventListener('mouseenter', enter);
          row.addEventListener('mouseleave', leave);
          row.addEventListener('focus', enter);
          row.addEventListener('blur', leave);
        } else {
          /* Сенсорный экран: наводить нечем — роль наведения играет прокрутка,
             см. observeLiveDemos(). */
          liveCells.push({ row: row, lv: lv, pv: pv });
        }
      } else {
      var wrap = el('div', 'shot-wrap');
      if (p.cover) {
        var img = el('img', 'shot');
        img.src = p.cover; img.alt = L.title || ''; img.loading = 'lazy';
        wrap.appendChild(img);
      } else {
        /* «NO IMAGE» в портфолио читается как недоделка. Домен — как факт:
           систему можно открыть прямо сейчас и посмотреть. */
        wrap.appendChild(el('div', 'shot-none',
          p.url ? siteUrl(p.url).replace(/^https?:\/\//, '').replace(/\/$/, '') : ''));
      }
      row.appendChild(wrap);
      }

      var body = el('div');
      if (L.kicker) body.appendChild(el('div', 'kicker', L.kicker + (p.year ? ' · ' + p.year : '')));
      body.appendChild(el('h3', null, L.title));
      if (L.summary) body.appendChild(el('p', 'summary', L.summary));
      if (p.tags && p.tags.length) {
        var tags = el('div', 'tags');
        p.tags.forEach(function (tg) { tags.appendChild(el('span', 'tag', tg)); });
        body.appendChild(tags);
      }
      row.appendChild(body);
      /* Прямая проверка без открытия окна. stopPropagation обязателен:
         ссылка лежит внутри кликабельной карточки. */
      if (p.url) {
        var go = el('a', 'work-live', t('works.visit'));
        go.href = siteUrl(p.url);
        go.target = '_blank';
        go.rel = 'noopener';
        go.setAttribute('data-goal', 'work_live');
        go.addEventListener('click', function (e) { e.stopPropagation(); });
        body.appendChild(go);
      }
      row.appendChild(el('span', 'work-go', '→'));

      row.addEventListener('click', function () { openModal(p); });
      list.appendChild(row);
    });

    observeLiveDemos();
  }

  /* ---------- ПРОСМОТР СКРИНШОТА (зум и перетаскивание) ----------
     Один слой на весь сайт: фото открываются из виджетов кейса, а их там
     десятки — держать по просмотрщику на каждый было бы расточительно. */
  var lbox = $('#lbox'), lboxImg = $('#lboxImg'), lboxCap = $('#lboxCap');
  var lbShots = [], lbAt = 0, lbScale = 1, lbX = 0, lbY = 0;
  var lbDrag = false, lbPX = 0, lbPY = 0, lbBack = null;
  var lbPts = {}, lbPinch = 0;      /* активные пальцы и база для пинча */

  function lbApply() {
    lboxImg.style.transform = 'translate(' + lbX + 'px,' + lbY + 'px) scale(' + lbScale + ')';
    lboxImg.classList.toggle('is-zoomed', lbScale > 1.01);
  }
  function lbReset() { lbScale = 1; lbX = 0; lbY = 0; lbApply(); }
  function lbZoom(delta, cx, cy) {
    var was = lbScale;
    lbScale = Math.min(6, Math.max(1, lbScale + delta));
    if (lbScale === was) return;
    if (lbScale === 1) { lbX = 0; lbY = 0; lbApply(); return; }
    /* Приближаем к точке под курсором, а не к центру кадра: иначе интересный
       угол снимка уезжает с экрана ровно в тот момент, когда его разглядывают. */
    if (cx != null) {
      var r = lboxImg.getBoundingClientRect();
      var ox = cx - (r.left + r.width / 2), oy = cy - (r.top + r.height / 2);
      var k = lbScale / was;
      lbX -= ox * (k - 1); lbY -= oy * (k - 1);
    }
    lbApply();
  }
  function lbShow(i) {
    if (!lbShots.length) return;
    lbAt = (i + lbShots.length) % lbShots.length;
    var sh = lbShots[lbAt];
    lboxImg.src = ROOT + sh.src;
    var cap = sh[lang] || sh.ru || sh.en || '';
    lboxImg.alt = cap;
    if (lboxCap) lboxCap.textContent = cap;
    var nav = lbShots.length > 1;
    ['#lboxPrev', '#lboxNext'].forEach(function (sel) { var n = $(sel); if (n) n.hidden = !nav; });
    lbReset();
  }
  function openShot(shots, i, from) {
    if (!lbox) return;
    lbShots = shots || []; lbBack = from || document.activeElement;
    var hint = $('#lboxHint'); if (hint) hint.textContent = t('shots.hint');
    lbShow(i || 0);
    lbox.hidden = false;
    void lbox.offsetWidth;
    lbox.classList.add('is-open');
  }
  function closeShot() {
    if (!lbox || lbox.hidden) return;
    lbox.classList.remove('is-open');
    var done = function () {
      lbox.hidden = true; lboxImg.removeAttribute('src');
      if (lbBack && lbBack.focus) lbBack.focus();
    };
    if (REDUCED) done(); else setTimeout(done, 200);
  }
  function lbOpen() { return !!lbox && !lbox.hidden; }

  if (lbox) {
    $$('[data-lclose]').forEach(function (n) { n.addEventListener('click', closeShot); });
    var lbPrev = $('#lboxPrev'), lbNext = $('#lboxNext');
    if (lbPrev) lbPrev.addEventListener('click', function () { lbShow(lbAt - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { lbShow(lbAt + 1); });

    lbox.addEventListener('wheel', function (e) {
      e.preventDefault();
      lbZoom(e.deltaY < 0 ? 0.2 : -0.2, e.clientX, e.clientY);
    }, { passive: false });

    lboxImg.addEventListener('dblclick', lbReset);
    /* Перетаскивание и пинч — на pointer-событиях: одна ветка кода и для мыши,
       и для пальцев. touch-action:none на сцене обязателен, иначе браузер
       забирает жест себе и картинка стоит на месте. */
    lboxImg.addEventListener('pointerdown', function (e) {
      lbPts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(lbPts);
      if (ids.length === 2) {
        var a = lbPts[ids[0]], b = lbPts[ids[1]];
        lbPinch = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
      } else if (lbScale > 1) {
        lbDrag = true; lbPX = e.clientX; lbPY = e.clientY;
        if (lboxImg.setPointerCapture) lboxImg.setPointerCapture(e.pointerId);
      }
    });
    lboxImg.addEventListener('pointermove', function (e) {
      if (!lbPts[e.pointerId]) return;
      lbPts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(lbPts);
      if (ids.length === 2 && lbPinch) {
        var a = lbPts[ids[0]], b = lbPts[ids[1]];
        var d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        lbZoom((d - lbPinch) / 160, (a.x + b.x) / 2, (a.y + b.y) / 2);
        lbPinch = d;
        return;
      }
      if (!lbDrag) return;
      lbX += e.clientX - lbPX; lbY += e.clientY - lbPY;
      lbPX = e.clientX; lbPY = e.clientY;
      lbApply();
    });
    var lbUp = function (e) {
      delete lbPts[e.pointerId];
      if (Object.keys(lbPts).length < 2) lbPinch = 0;
      lbDrag = false;
    };
    lboxImg.addEventListener('pointerup', lbUp);
    lboxImg.addEventListener('pointercancel', lbUp);

    /* Фаза перехвата: Escape не должен доходить до модалки кейса под низом */
    document.addEventListener('keydown', function (e) {
      if (!lbOpen()) return;
      if (e.key === 'Escape') { e.stopPropagation(); closeShot(); }
      else if (e.key === 'ArrowLeft') lbShow(lbAt - 1);
      else if (e.key === 'ArrowRight') lbShow(lbAt + 1);
    }, true);
  }

  function widgets(p) {
    var list = (p.widgets || []).filter(function (w) {
      return !w.langs || w.langs.indexOf(lang) !== -1;
    });
    if (!list.length) return null;

    var box = el('div', 'wg-list');
    list.forEach(function (w) {
      var L = loc(w);
      var shots = w.shots || [];
      var item = el('div', 'wg');

      var head = el('button', 'wg-head');
      head.type = 'button';
      head.setAttribute('aria-expanded', 'false');
      head.appendChild(el('span', 'wg-title', L.title || ''));
      if (shots.length) head.appendChild(el('span', 'wg-count', shots.length + ' ' + t('shots.unit')));
      head.appendChild(el('span', 'wg-chev', '\u2304'));

      var body = el('div', 'wg-body');
      body.hidden = true;
      if (L.note) body.appendChild(el('p', 'wg-note', L.note));

      var grid = el('div', 'wg-grid');
      shots.forEach(function (sh, i) {
        var cell = el('button', 'wg-shot');
        cell.type = 'button';
        var im = el('img');
        im.src = ROOT + sh.src;
        im.alt = sh[lang] || sh.ru || '';
        im.loading = 'lazy'; im.decoding = 'async';
        cell.appendChild(im);
        var cap = sh[lang] || sh.ru || '';
        if (cap) cell.appendChild(el('span', 'wg-cap', cap));
        cell.addEventListener('click', function () { openShot(shots, i, cell); });
        grid.appendChild(cell);
      });
      body.appendChild(grid);

      head.addEventListener('click', function () {
        var open = body.hidden;
        body.hidden = !open;
        item.classList.toggle('is-open', open);
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      item.appendChild(head);
      item.appendChild(body);
      box.appendChild(item);
    });
    return box;
  }

  /* ---------- 4. модалка ---------- */
  var modal = $('#modal'), modalBody = $('#modalBody'), lastFocus = null;

  function block(labelKey, value) {
    if (!value) return null;
    var b = el('div', 'm-block');
    b.appendChild(el('span', 'lbl', t(labelKey)));
    b.appendChild(el('p', null, value));
    return b;
  }

  function openModal(p) {
    if (!p) return;
    var L = loc(p);
    lastFocus = document.activeElement;
    modalBody.innerHTML = '';

    var lp = null;
    if (p.demo && p.demo.video) {
      lp = laptop(p.demo, { big: true });
      modalBody.appendChild(lp);
    } else if (p.cover) {
      var img = el('img', 'm-shot');
      img.src = p.cover; img.alt = L.title || '';
      modalBody.appendChild(img);
    }

    var body = el('div', 'm-body');
    if (L.kicker) body.appendChild(el('div', 'm-kicker', L.kicker + (p.year ? ' · ' + p.year : '')));
    body.appendChild(el('h3', null, L.title));
    if (L.summary) body.appendChild(el('p', 'm-summary', L.summary));

    [['works.challenge', L.challenge], ['works.solution', L.solution], ['works.result', L.result]]
      .forEach(function (pair) {
        var b = block(pair[0], pair[1]);
        if (b) body.appendChild(b);
      });

    if (p.tags && p.tags.length) {
      var tags = el('div', 'tags');
      p.tags.forEach(function (tg) { tags.appendChild(el('span', 'tag', tg)); });
      body.appendChild(tags);
    }

    if (p.gallery && p.gallery.length) {
      var g = el('div', 'm-gallery');
      p.gallery.forEach(function (src) {
        var im = el('img'); im.src = src; im.alt = ''; im.loading = 'lazy';
        g.appendChild(im);
      });
      body.appendChild(g);
    }

    var wg = widgets(p);
    if (wg) body.appendChild(wg);

    var act = el('div', 'm-actions');
    if (p.url) {
      var a = el('a', 'btn solid', t('works.visit'));
      a.href = siteUrl(p.url); a.target = '_blank'; a.rel = 'noopener';
      act.appendChild(a);
    }
    if (p.bot) {
      var b = el('a', 'btn', t('works.bot'));
      b.href = p.bot; b.target = '_blank'; b.rel = 'noopener';
      act.appendChild(b);
    }
    var close = el('button', 'btn', t('works.close'));
    close.type = 'button';
    close.addEventListener('click', closeModal);
    act.appendChild(close);
    body.appendChild(act);

    modalBody.appendChild(body);

    /* hidden снимаем, ждём кадр, потом ставим класс — иначе браузер
       не увидит стартовое состояние и transition не проиграется. */
    /* Есть демо — значит внутри играет видео: гасим размытые слои страницы,
       иначе композитор пересчитывает их на каждый кадр (см. .vm-open в CSS). */
    if (p.demo && p.demo.video) document.documentElement.classList.add('vm-open');
    if (window.dxGoal) window.dxGoal('case_open');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    /* Плеер настраиваем СРАЗУ после снятия hidden: ширина у .lp-screen тут уже
       настоящая. Внутрь requestAnimationFrame это класть нельзя — в фоновой
       вкладке кадры не идут, и панель зависла бы в «узком» режиме (та же
       грабля, из-за которой в flipFrom стоит void offsetWidth). */
    if (lp && lp.player) lp.player.reset();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
      });
    });
    var x = $('.modal-x'); if (x) x.focus();
  }

  /* Скрытая модалка НЕ останавливает видео: элемент остаётся в дереве и
     продолжает играть со звуком за кадром. Поэтому при закрытии глушим и
     выгружаем каждое видео внутри — pause() мало, нужен ещё снятый src,
     иначе вкладка держит поток и декодер. */
  function stopVideos(root) {
    if (!root) return;
    $$('video', root).forEach(function (v) {
      try {
        v.pause();
        v.removeAttribute('src');
        while (v.firstChild) v.removeChild(v.firstChild);   /* и дорожки субтитров */
        v.load();
      } catch (e) {}
    });
  }

  function closeModal() {
    if (modal.hidden) return;
    stopVideos(modalBody);
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('vm-open');
    document.body.style.overflow = '';
    /* Фокус возвращаем ТОЛЬКО после hidden = true: пока модалка ещё не скрыта,
       ловушка фокуса ниже утащила бы его обратно на крестик. */
    var done = function () {
      modal.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    if (REDUCED) done(); else setTimeout(done, 240);   // = --t-modal
  }

  $$('[data-close]').forEach(function (n) { n.addEventListener('click', closeModal); });
  document.addEventListener('keydown', function (e) {
    /* Открыт просмотрщик фото — Escape принадлежит ему: он лежит поверх */
    if (e.key === 'Escape' && !lbOpen()) closeModal();
  });

  /* Фокус не должен уходить за пределы открытой модалки */
  document.addEventListener('focusin', function (e) {
    if (modal.hidden || lbOpen()) return;
    if (!modal.contains(e.target)) {
      var x = $('.modal-x'); if (x) x.focus();
    }
  });

  /* ---------- 5. появление блоков при прокрутке ---------- */
  var io = null;
  function observeReveals() {
    var nodes = $$('.reveal:not(.in)');

    if (REDUCED || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        /* Стаггер считаем внутри пачки, попавшей в кадр одновременно:
           соседи проявляются каскадом, а не все разом. */
        var shown = 0;
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var node = en.target;
          node.style.transitionDelay = (shown * STAGGER) + 'ms';
          node.classList.add('in');
          shown += 1;
          io.unobserve(node);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 6. язык ---------- */
  function paintLang() {
    document.documentElement.lang = lang;

    $$('[data-i18n]').forEach(function (n) {
      var v = t(n.getAttribute('data-i18n'));
      if (v) setText(n, v);
    });
    /* Отдельный атрибут для ключей, где намеренно разрешена разметка.
       Источник — только собственный файл i18n.js, не пользовательский ввод. */
    /* alt картинки — тоже текст, и он тоже обязан переводиться:
       на EN-странице «Эдуард Дорофеев» в alt читалось бы скринридером по-русски. */
    $$('[data-i18n-alt]').forEach(function (n) {
      n.alt = t(n.getAttribute('data-i18n-alt'));
    });
    $$('[data-i18n-html]').forEach(function (n) {
      n.innerHTML = t(n.getAttribute('data-i18n-html'));
    });

    /* Заголовок и описание берём из site.config.js → SITE.meta: там же их
       читает tools/build-langs.js, когда собирает <head> статикой. Источник
       обязан быть ОДИН — иначе краулер видит одно (из head), а посетитель и
       браузерная вкладка другое (переписанное скриптом). Ключи meta.* в
       i18n.js оставлены запасным вариантом на случай пустого конфига. */
    var pageMeta = (window.SITE && window.SITE.meta && window.SITE.meta[lang]) || {};
    document.title = pageMeta.title || t('meta.title');
    var d = $('meta[name="description"]');
    if (d) d.setAttribute('content', pageMeta.description || t('meta.description'));

    setupLangSwitch();
    paintThemeBtn();
    setupPillNav();
    renderWhy(); renderServices(); renderPromo(); renderWorks();
    renderReviews(); renderPartners(); renderStack(); renderPartnership();
    renderFaq();
    foldSections();
    observeReveals();
  }

  /* Тумблер языка — обычная ссылка на соседнюю страницу.
     Это переход, а не подмена текста на месте: адрес честный, ссылкой можно
     поделиться, поисковик видит две страницы. Страницы статические и мелкие,
     переход мгновенный. */
  function setupLangSwitch() {
    var btn = $('#langBtn');
    if (!btn) return;
    var other = lang === 'en' ? 'ru' : 'en';
    btn.setAttribute('href', urlFor(other));
    btn.setAttribute('hreflang', other);
    btn.setAttribute('data-on', lang === 'en' ? 'a' : 'b');
    btn.setAttribute('aria-label', t('lang.switchTo'));
  }

  /* ---------- тема ----------
     По умолчанию тёмная. Светлая — выбор пользователя, живёт в localStorage.
     Атрибут ставится и до отрисовки инлайн-скриптом в <head>, здесь только
     переключение и подписи. */
  var THEME_KEY = 'dorxmoon.theme';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(next) {
    var root = document.documentElement;
    if (next === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');

    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}

    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#fbfaf8' : '#0d0f12');

    paintThemeBtn();
  }

  function paintThemeBtn() {
    var btn = $('#themeBtn');
    if (!btn) return;
    var dark = currentTheme() === 'dark';
    btn.setAttribute('data-on', dark ? 'a' : 'b');
    btn.setAttribute('aria-label', t(dark ? 'theme.toLight' : 'theme.toDark'));
  }

  var themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- 6.5 плавающий навигатор: показ и подсветка ----------
     Показывается, когда посетитель ушёл ниже первого экрана: на самом верху
     он перекрывал бы кнопку в hero, а навигация там ещё не нужна.
     Активный раздел определяется отдельным наблюдателем с узкой полосой
     срабатывания посередине экрана — так подсветка не прыгает на границах. */
  var pill = $('#pillnav');
  var spy = null;

  function setupPillNav() {
    var links = $$('#pillnavTrack a');
    if (!links.length) { pill.hidden = true; return; }
    pill.hidden = false;

    if (spy) spy.disconnect();
    if (!('IntersectionObserver' in window)) return;

    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) {
          var on = a.getAttribute('data-for') === id;
          a.classList.toggle('on', on);
          a.setAttribute('aria-current', on ? 'true' : 'false');
          /* активный сегмент подтягиваем в видимую часть дорожки —
             иначе на телефоне подсветка уезжает за край и её не видно */
          if (on && a.scrollIntoView) {
            a.scrollIntoView({ block: 'nearest', inline: 'nearest',
                               behavior: REDUCED ? 'auto' : 'smooth' });
          }
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    links.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('data-for'));
      if (sec) spy.observe(sec);
    });
  }

  function togglePill() {
    if (pill.hidden) return;
    pill.classList.toggle('show', window.scrollY > window.innerHeight * 0.5);
  }

  /* ---------- вопросы и ответы ----------
     Раскрывающиеся <details>: работают без единой строки JS, доступны с
     клавиатуры и читаются скринридером как есть. Первый вопрос открыт —
     иначе блок выглядит как список ссылок, и его пролистывают не открыв. */
  function renderFaq() {
    var box = $('#faqList'); if (!box) return;
    box.innerHTML = '';
    var shown = 0;
    (window.FAQ || []).forEach(function (item) {
      var L = loc(item);
      if (skip(item, L)) return;
      var d = document.createElement('details');
      d.className = 'faq-item reveal';
      if (shown === 0) d.open = true;
      var sum = document.createElement('summary');
      sum.className = 'faq-q';
      setText(sum, L.q);
      d.appendChild(sum);
      d.appendChild(el('p', 'faq-a', L.a));
      box.appendChild(d);
      shown++;
    });
  }

  /* ---------- сворачивание тяжёлых секций ----------
     Вызывается ПОСЛЕ рендера всех списков: оборачивает содержимое секции,
     помеченной collapsed, в <details> и собирает подпись из заголовков
     карточек внутри. Без JS-состояния: раскрытие штатное, браузерное. */
  function foldSections() {
    var S = window.SITE || {};
    (S.sections || []).forEach(function (sec) {
      if (!sec.collapsed) return;
      /* Контейнер списка обычно зовётся <id>List, но не всегда: у секции
         «Сотрудничество» он исторически ptList. Промах именно на этом и
         вышел — секция молча не свернулась, потому что элемент не нашёлся. */
      var FOLD_BOX = { partnership: 'ptList' };
      var box = document.getElementById(FOLD_BOX[sec.id] || (sec.id + 'List'));
      if (!box || box.parentNode.tagName === 'DETAILS') return;

      /* Подпись — перечисление того, что внутри. Берём заголовки карточек,
         а на стеке — названия рядов: это первые ячейки строк. */
      /* Берём заголовок ДО тире: у карточек он часто с пояснением
         («Органическое продвижение — алгоритмы …»), и в перечислении из
         шести таких строк подпись превращается в абзац, то есть ровно в то,
         от чего мы уходим. */
      var names = $$('h3, .k', box).map(function (n) {
        return (n.textContent || '').trim().split(' — ')[0];
      }).filter(Boolean);
      /* На всякий случай: если разметка карточек изменится и заголовков не
         найдётся, подпись всё равно будет осмысленной, а не пустой. */
      var label = names.length ? names.join(' · ') : t('fold.open');

      var d = document.createElement('details');
      d.className = 'sec-fold';
      var sum = document.createElement('summary');
      sum.className = 'sec-fold-sum';
      var strong = el('span', 'sec-fold-list', label);
      var hint = el('span', 'sec-fold-hint', t('fold.open'));
      sum.appendChild(strong); sum.appendChild(hint);
      sum.appendChild(el('span', 'sec-fold-hide', t('fold.close')));
      box.parentNode.insertBefore(d, box);
      d.appendChild(sum);
      d.appendChild(box);
    });
  }

  /* ---------- 7. линия под шапкой только после прокрутки ---------- */
  var topbar = $('#topbar');
  function onScroll() {
    topbar.classList.toggle('is-stuck', window.scrollY > 8);
    togglePill();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- старт ---------- */
  applyConfig();
  applySections();
  paintLang();
  initAnalytics();

})();
