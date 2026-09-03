/* ============================================================================
   build-langs.js — собирает языковые страницы из index.html
   ----------------------------------------------------------------------------
   Запуск:  node tools/build-langs.js
   Что делает: берёт index.html (это EN и он же эталон разметки) и на каждый
   дополнительный язык кладёт <код>/index.html — ту же страницу, но с путями
   через ../ и с window.FORCE_LANG.

   ЗАЧЕМ: чтобы адрес был site.com/ru/, а не site.com/?lang=ru. На статическом
   хостинге (GitHub Pages) переписывать адреса некому — папка должна физически
   существовать. Заодно поисковик видит два отдельных документа.

   КОГДА ЗАПУСКАТЬ: только если правил САМ index.html (каркас разметки).
   Правки текстов и работ (data/*.js) пересборки НЕ требуют — файлы общие.
   ========================================================================== */

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');

/* Языки читаем из site.config.js, чтобы не держать список в двух местах */
const cfgSrc = fs.readFileSync(path.join(ROOT, 'data', 'site.config.js'), 'utf8');
const sandbox = { window: {} };
new Function('window', cfgSrc)(sandbox.window);
const SITE = sandbox.window.SITE;

const DEFAULT_LANG = SITE.defaultLang || 'en';
const ALL = SITE.languages || ['en', 'ru'];
const EXTRA = ALL.filter(function (l) { return l !== DEFAULT_LANG; });

/* ── Метка версии против кэша ────────────────────────────────────────────
   GitHub Pages отдаёт css/js с Cache-Control до 10 минут. Правишь стиль —
   у посетителя (и у тебя) ещё некоторое время старая версия, и кажется,
   что «правка не приехала». Лечим тем же приёмом, что и на ШРС: к каждой
   локальной ссылке дописывается ?v=<хэш содержимого>. Меняется файл —
   меняется адрес — браузер обязан скачать заново. */
const assets = ['css/style.css', 'js/app.js',
                'data/site.config.js', 'data/i18n.js', 'data/content.js', 'data/projects.js'];
const stamp = crypto
  .createHash('sha1')
  .update(assets.map(function (f) {
    try { return fs.readFileSync(path.join(ROOT, f)); } catch (e) { return ''; }
  }).join('|'))
  .digest('hex')
  .slice(0, 8);

function stampLinks(html, prefix) {
  return html.replace(
    new RegExp('((?:src|href)="' + prefix + '(?:css|js|data)/[^"?]+)(\\?v=[a-f0-9]+)?"', 'g'),
    '$1?v=' + stamp + '"'
  );
}

/* ── Заголовок и описание страницы на своём языке ────────────────────────
   Раньше head не переводился вовсе: /ru/index.html уезжал на прод с
   английскими <title> и <meta description>, и в русской выдаче сниппет
   был на английском. Тексты лежат в site.config.js → SITE.meta.<код>,
   в одном месте с остальным содержимым. */
const META = SITE.meta || {};
const OG_LOCALE = { ru: 'ru_RU', en: 'en_US' };

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function applyMeta(html, code) {
  const m = META[code];
  if (!m) return html;
  if (m.title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + esc(m.title) + '</title>');
    html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + esc(m.title) + '$2');
  }
  if (m.description) {
    html = html.replace(/(<meta name="description" content=")[^"]*(")/, '$1' + esc(m.description) + '$2');
    html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + esc(m.description) + '$2');
  }
  /* og:locale ставим один раз: при повторной сборке заменяем, а не плодим */
  const loc = OG_LOCALE[code] || code;
  if (/<meta property="og:locale"/.test(html)) {
    html = html.replace(/(<meta property="og:locale" content=")[^"]*(")/, '$1' + loc + '$2');
  } else {
    html = html.replace('<meta property="og:type" content="website">',
      '<meta property="og:type" content="website">\n<meta property="og:locale" content="' + loc + '">');
  }
  return html;
}

/* index.html штампуем на месте — он и есть эталон, из которого всё растёт */
const rootOrig = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
let root = applyMeta(rootOrig, DEFAULT_LANG);
const rootStamped = stampLinks(root, '');
/* Сравниваем с ТЕМ, ЧТО ЛЕЖИТ НА ДИСКЕ, а не с промежуточным результатом:
   иначе правка одних только title/description не попала бы в файл. */
if (rootStamped !== rootOrig) {
  fs.writeFileSync(path.join(ROOT, 'index.html'), rootStamped, 'utf8');
  console.log('index.html — head и метка версии ?v=' + stamp);
}
const src = rootStamped;

EXTRA.forEach(function (code) {
  let out = src;

  // 1. пути к ресурсам — на уровень выше
  out = out.replace(/(src|href)="(css\/|js\/|data\/|img\/)/g, '$1="../$2');
  out = stampLinks(out, '\\.\\./');

  // 2. язык документа
  out = out.replace(/<html lang="[^"]*"/, '<html lang="' + code + '"');

  // 3. hreflang: с внутренней страницы корень лежит выше
  out = out.replace(/hreflang="en" href="\.\/"/, 'hreflang="en" href="../"');
  out = out.replace(/hreflang="ru" href="ru\/"/, 'hreflang="ru" href="./"');
  out = out.replace(/hreflang="x-default" href="\.\/"/, 'hreflang="x-default" href="../"');

  // 4. тумблер языка ведёт обратно в корень (JS всё равно перепишет, но
  //    ссылка должна быть верной и до выполнения скрипта)
  out = out.replace('id="langBtn" href="ru/"', 'id="langBtn" href="../"');
  out = out.replace('data-lang="en"', 'data-lang="' + code + '"');

  /* 5. флаг языка — ставим сразу после <meta charset>, а НЕ привязываясь к
        строке подключения site.config.js: к ней позже дописывается ?v=<хэш>,
        и буквальный поиск переставал совпадать — русская страница молча
        собиралась как английская. Якорь должен быть тем, что не меняется. */
  out = out.replace(
    '<meta charset="utf-8">',
    '<meta charset="utf-8">\n<script>window.FORCE_LANG="' + code + '";</script>'
  );

  // 6. заголовок и описание на языке страницы
  out = applyMeta(out, code);

  // 7. предупреждение, что файл сгенерирован
  out = out.replace('<head>',
    '<head>\n<!-- ФАЙЛ СГЕНЕРИРОВАН: node tools/build-langs.js. Правь index.html в корне, не этот файл. -->');

  const dir = path.join(ROOT, code);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), out, 'utf8');
  console.log('собрано: ' + code + '/index.html');
});

/* ── sitemap.xml ─────────────────────────────────────────────────────────
   Собирается из того же списка языков: адрес на язык + перекрёстные
   hreflang, как в <head>. Появится свой домен — правится только baseUrl
   в site.config.js, файл пересоберётся сам.
   Отдельная причина сделать это: страница продаёт «карта сайта входит в
   разработку» — и до этого захода выкладывалась без карты сайта. */
const BASE = (SITE.baseUrl || '').replace(/\/*$/, '/');
if (!BASE) {
  console.log('sitemap.xml пропущен: не задан SITE.baseUrl в data/site.config.js');
} else {
  const urlFor = function (code) { return code === DEFAULT_LANG ? BASE : BASE + code + '/'; };
  /* Дата местная, а не UTC: toISOString() вечером по Москве отдаёт вчерашнее
     число, и в карте сайта стоит дата на день назад. */
  const d = new Date();
  const pad = function (n) { return (n < 10 ? '0' : '') + n; };
  const today = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const alts = ALL.map(function (c) {
    return '    <xhtml:link rel="alternate" hreflang="' + c + '" href="' + urlFor(c) + '"/>';
  }).concat(
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + urlFor(DEFAULT_LANG) + '"/>'
  ).join('\n');

  const body = ALL.map(function (c) {
    return '  <url>\n    <loc>' + urlFor(c) + '</loc>\n' + alts +
           '\n    <lastmod>' + today + '</lastmod>\n' +
           '    <changefreq>monthly</changefreq>\n  </url>';
  }).join('\n');

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + body + '\n</urlset>\n', 'utf8');
  console.log('собрано: sitemap.xml (' + ALL.length + ' адреса)');

  /* Ссылка на карту сайта в robots.txt — иначе поисковик найдёт её только
     через Вебмастер, а не сам. Строка ровно одна, при пересборке заменяется. */
  const robotsPath = path.join(ROOT, 'robots.txt');
  let robots = fs.readFileSync(robotsPath, 'utf8');
  const line = 'Sitemap: ' + BASE + 'sitemap.xml';
  /* Файл лежит с CRLF-переводами строк (Windows), поэтому якорь «пустая
     строка» пишем как \r?\n\r?\n — иначе строка молча не вставлялась. */
  if (/^Sitemap:.*$/m.test(robots)) {
    robots = robots.replace(/^Sitemap:.*$/m, line);
  } else if (/\r?\n\r?\n/.test(robots)) {
    robots = robots.replace(/(\r?\n)(\r?\n)/, '$1' + line + '$1$2');
  } else {
    robots = robots.replace(/\s*$/, '\r\n' + line + '\r\n');
  }
  fs.writeFileSync(robotsPath, robots, 'utf8');
}

console.log('готово. языки: ' + ALL.join(', ') + ' (основной: ' + DEFAULT_LANG + ')');
