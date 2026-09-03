/* ============================================================================
   site.config.js — ГЛАВНЫЙ ФАЙЛ НАСТРОЙКИ / MAIN CONFIG
   ----------------------------------------------------------------------------
   Здесь: язык по умолчанию, контакты, и ПОРЯДОК + ВКЛ/ВЫКЛ секций сайта.
   Чтобы убрать секцию со страницы — поставь enabled: false. Больше НИЧЕГО
   трогать не нужно: и сама секция, и пункт в меню исчезнут автоматически.
   Чтобы поменять порядок секций — просто переставь строки местами.
   ========================================================================== */

window.SITE = {

  // Все языки сайта. Основной лежит в корне (/), остальные — в папках (/ru/).
  // После изменения этого списка: node tools/build-langs.js
  languages: ['en', 'ru'],
  defaultLang: 'en',

  /* Адрес сайта целиком — нужен для sitemap.xml и канонических ссылок.
     Со слэшем на конце. Появится свой домен — меняется только здесь. */
  baseUrl: 'https://dorxmoon.github.io/business-card/',

  // Основной контакт.
  telegram: {
    handle: '@DorofeevEY',
    url: 'https://t.me/DorofeevEY'
  },

  email: {
    ru: 'dorofeef742@gmail.com',
    en: 'dorofeef742@gmail.com'
  },

  demoBot: {
    url: 'https://t.me/DorXmoon_bot',
    langs: ['ru']
  },

  analytics: {
    metrikaId: null
  },

  /* Заголовок и описание страницы для КАЖДОГО языка. До этого RU-страница
     собиралась с английскими <title> и <meta description> — в русской выдаче
     сниппет был на английском. Подставляет tools/build-langs.js. */
  meta: {
    en: {
      title: 'Custom websites you actually own — DorXmoon',
      description: 'Hand-coded websites with a deep admin panel and an optional bot as a second control panel. You own the code, the database and the admin from day one — no platform rent, no plugin subscriptions.'
    },
    ru: {
      title: 'Сайт с управлением из Telegram — разработка под ключ | DorXmoon',
      description: 'Самописные сайты с админ-панелью и Telegram-ботом как второй панелью управления: правки с телефона, без пароля и без счёта за каждую мелочь. Код, база и админка — ваши с первого дня.'
    }
  },

  brand: {
    name: 'DorXmoon',
    initials: 'DX'
  },

  sections: [
    { id: 'works',       enabled: true,  nav: true  },
    { id: 'reviews',     enabled: true,  nav: true  },
    { id: 'why',         enabled: true,  nav: true  },
    { id: 'services',    enabled: true,  nav: true  },
    { id: 'promo',       enabled: true,  nav: true,  langs: ['ru'], collapsed: true },
    { id: 'partners',    enabled: true,  nav: true,  langs: ['ru'] },
    { id: 'stack',       enabled: true,  nav: true,  collapsed: true },
    { id: 'partnership', enabled: true,  nav: true,  collapsed: true },
    { id: 'faq',         enabled: true,  nav: true  },
    { id: 'contact',     enabled: true,  nav: false }
  ]

};
