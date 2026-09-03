/* ============================================================================
   projects.js — РАБОТЫ / PORTFOLIO
   ----------------------------------------------------------------------------
   В массиве три кейса. Если его опустошить — на сайте автоматически
   показывается аккуратная заглушка «Кейсы готовятся» с кнопкой связи.

   ЧТОБЫ ДОБАВИТЬ РАБОТУ: скопируй шаблон из комментария ниже, вставь объект
   внутрь [ ] и заполни. Больше НИЧЕГО менять не надо — карточка, модалка
   с подробностями и галерея соберутся сами, на обоих языках.

   Порядок в массиве = порядок на сайте.

   ---------------------------------------------------------------------------
   ШАБЛОН (скопируй всё между ///// и вставь внутрь скобок массива):
   /////
   {
     id: 'alpha-cosine',                     // латиницей, уникальный
     cover: 'img/works/alpha-cover.jpg',     // скрин карточки (~1200x750)
     url: 'https://alpha-cosine.ru',         // ссылка на сайт; '' — если нет
     year: 2026,
     tags: ['Node.js', 'Express', 'SQLite', 'Telegram bot', 'Three.js'],
     gallery: [                              // доп. скрины в модалке; [] — если нет
       'img/works/alpha-1.jpg',
       'img/works/alpha-2.jpg'
     ],
     en: {
       title: 'Alpha-Cosine',
       kicker: 'Construction · Moscow',
       summary: 'Website + Telegram bot + live estimate calculator.',
       challenge: 'Customers had to wait for a callback to learn the price.',
       solution:  'A calculator that pulls current material prices from the admin panel.',
       result:    'Leads arrive pre-qualified with a budget already in mind.'
     },
     ru: {
       title: 'Альфа-косинус',
       kicker: 'Стройка · Москва',
       summary: 'Сайт + Telegram-бот + калькулятор смет.',
       challenge: 'Клиент не знал цену, пока не дозвонится до мастера.',
       solution:  'Калькулятор, который тянет актуальные цены материалов из админки.',
       result:    'Заявки приходят уже с понятным бюджетом.'
     }
   },
   /////
   Поля challenge / solution / result можно оставить пустыми ('') —
   в модалке они просто не появятся.
   ========================================================================== */

window.PROJECTS = [

  {
    id: 'fond-mayak',
    /* Живое демо вместо статичного скрина.
       Экран ноутбука держим в НОРМАЛЬНОЙ пропорции 16:10 — такой у ноутбуков и
       бывает. Раньше сюда подставлялась пропорция самой записи (2.13:1), и
       корпус выглядел сверхшироким монитором, а не ноутбуком.
       Запись же вписывается внутрь целиком (object-fit: contain), с полями
       сверху и снизу — так не срезается ни один край. */
    demo: { video: 'media/works/mayak-demo.mp4',
            poster: 'media/works/mayak-demo-poster.jpg',
            screen: [16, 10],
            /* Вторая запись — та же система с телефона. Телефон рядом с ноутом
               появляется ТОЛЬКО у работ с этим полем: у остальных мобильной
               записи нет, а пустая рамка хуже её отсутствия.
               Пропорция экрана — реальная 1080x2324 (это и есть 19.5:9
               современного телефона), поэтому запись встаёт без обрезки. */
            mobile: { video: 'media/works/mayak-mobile.mp4',
                      poster: 'media/works/mayak-mobile-poster.jpg',
                      screen: [1080, 2324] } },
    cover: '',                                  // скринов пока нет — в рамке стоит домен
    url: 'https://fond-mayak.ru',
    bot: 'https://t.me/fond_mayak_bot',
    year: 2026,
    tags: ['PHP 8', 'MySQL', 'Telegram bot', 'CRM', 'Docker'],
    gallery: [],
    /* Виджеты кейса — раскрывающиеся блоки со скриншотами: что сделано КРОМЕ
       публичного сайта. Закрыты по умолчанию, langs ограничивает аудиторию. */
    widgets: [
      {
        id: 'bot-cms',
        ru: { title: 'Telegram-бот как CMS сайта',
              note: 'Новость пишется в чате и сама уходит в канал и на сайт — отдельной публикации никуда не требуется.' },
        en: { title: 'Telegram bot as the site CMS',
              note: 'A post is written in chat and lands in the channel and on the site at once — no second publishing step.' },
        shots: [
          { src: 'img/works/mayak/cms-new.png',
            ru: 'Создание поста. Заголовок → текст → медиа диалогом с ботом, без веб-интерфейса.',
            en: 'Composing a post. Title, text and media through a chat dialogue — no web interface.' },
          { src: 'img/works/mayak/cms-preview.png',
            ru: 'Когда публиковать и предпросмотр. Занятые символы считаются против лимита Telegram прямо в чате, до отправки.',
            en: 'Scheduling and preview. Characters are counted against the Telegram limit in chat, before sending.' },
          { src: 'img/works/mayak/cms-confirm.png',
            ru: 'Подтверждение публикации. Со звуком, без звука или отмена — последний шаг перед читателями.',
            en: 'Publish confirmation. With sound, silently, or cancel — the last step before readers see it.' },
          { src: 'img/works/mayak/cms-channel.png',
            ru: 'Результат в канале. Готовый пост со ссылками на партнёров и кнопкой «Обратиться».',
            en: 'The result in the channel — partner links and a contact button included.' },
          { src: 'img/works/mayak/cms-site-list.png',
            ru: 'Синхронизация с сайтом. Тот же пост появляется в разделе «Новости» сам.',
            en: 'Site sync. The same post shows up in the site news section on its own.' },
          { src: 'img/works/mayak/cms-site-post.jpg',
            ru: 'Страница новости на сайте. Заголовок, фото, текст, дата — полная публичная карточка.',
            en: 'The news page on the site: title, photos, text and date.' }
        ]
      },
      {
        id: 'admin',
        ru: { title: 'Веб-админка',
              note: 'Вторая панель на той же базе: всё, что делает бот, делается и здесь.' },
        en: { title: 'Web admin panel',
              note: 'A second panel on the same database: everything the bot does can be done here too.' },
        shots: [
          { src: 'img/works/mayak/admin-login.png',
            ru: 'Вход в админку. Только через подтверждённый Telegram-аккаунт — пароля нет, подбирать нечего.',
            en: 'Sign-in through a confirmed Telegram account only — there is no password to guess.' },
          { src: 'img/works/mayak/admin-inside.png',
            ru: 'Панель изнутри. Обзор, контент, заявки, система — весь сайт из одного места.',
            en: 'Inside the panel: overview, content, applications and system in one place.' },
          { src: 'img/works/mayak/admin-bans.png',
            ru: 'Забаненные сканеры и атаки. Автосписок IP с причиной бана — видно в панели, без разбора логов.',
            en: 'Blocked scanners and attacks — an automatic IP list with reasons, no log digging.' }
        ]
      },
      {
        id: 'bot-guard',
        ru: { title: 'Бот: администрирование и защита',
              note: 'Тот же бот ведёт заявки, партнёров и охрану сайта — из телефона, без доступа к серверу.' },
        en: { title: 'Bot: administration and protection',
              note: 'The same bot handles applications, partners and site protection — from a phone, with no server access.' },
        shots: [
          { src: 'img/works/mayak/bot-menu.png',
            ru: 'Главное меню. Новости, заявки, партнёры, защита — все разделы администрирования в одном чате.',
            en: 'Main menu: news, applications, partners and protection in a single chat.' },
          { src: 'img/works/mayak/bot-bans-days.png',
            ru: 'Чёрный список по датам. История банов раскрывается по дням — так же, как в веб-панели.',
            en: 'Blocklist by date — the ban history opens day by day, same as in the web panel.' },
          { src: 'img/works/mayak/bot-bans-ip.png',
            ru: 'Детали бана. IP, причина срабатывания, время, постраничная навигация.',
            en: 'Ban details: IP, trigger reason, time, paged navigation.' },
          { src: 'img/works/mayak/bot-infra.png',
            ru: 'Инфраструктура и код. Экспорт кода, откат на бэкап, рестарт сайта — прямо из Telegram.',
            en: 'Infrastructure and code: export, rollback to a backup, restart — straight from Telegram.' }
        ]
      },
      {
        id: 'search',
        langs: ['ru'],
        ru: { title: 'Поиск: фонд находится среди тёзок',
              note: 'Название «Маяк» носят несколько известных фондов. Сайт всё равно выходит на первый экран по запросу «фонд маяк» — без рекламы.' },
        shots: [
          { src: 'img/works/mayak/yandex-search.jpg',
            ru: 'Яндекс, запрос «фонд маяк». Третья строка — fond-mayak.ru, выше только детский хоспис «Дом с маяком» и платное объявление.' }
        ]
      },
      {
        id: 'cookie',
        langs: ['ru'],
        ru: { title: 'Согласия и 152-ФЗ',
              note: 'Сайт не собирает cookie для рекламы — только технические, и говорит об этом прямо.' },
        shots: [
          { src: 'img/works/mayak/cookie.png',
            ru: 'Cookie-баннер. Одна кнопка вместо выбора трекеров: собирать в фонде нечего, а политика открыта ссылкой рядом.' }
        ]
      }
    ],

    en: {
      title: 'Mayak Foundation',
      kicker: 'Non-profit',
      summary: 'Site + bot on one CMS, plus a small in-house CRM.',
      challenge: 'The director had to reach a developer for every news post and every application, and worked mostly from a phone rather than a desk.',
      solution:  'One database behind two panels: the whole site is run from Telegram with no password and no laptop, and the web admin does exactly the same things. Decisions on applications are approved by a second director, so nothing goes through by mistake.',
      result:    'The foundation publishes and processes applications without me. Site and bot are both my work.'
    },
    ru: {
      title: 'Фонд «Маяк»',
      kicker: 'НКО',
      summary: 'Сайт + бот на одной CMS, плюс своя мини-CRM.',
      challenge: 'На каждую новость и каждую заявку руководителю приходилось искать разработчика, а работает он с телефона, а не из-за стола.',
      solution:  'Одна база под двумя панелями: весь сайт ведётся из Telegram — без пароля и без ноутбука, а веб-админка умеет ровно то же самое. Важные решения по заявкам проходят проверку вторым руководителем — ничего не потеряется и не пройдёт по ошибке.',
      result:    'Фонд публикует новости и разбирает заявки без меня. Сайт и бот — моей разработки.'
    }
  },

  {
    id: 'shrs-service',
    /* Живое демо. Крышку держим в 16:10 — как у Маяка: реальная пропорция
       записи превращала корпус в ультраширокий монитор. Запись вписывается
       внутрь целиком (object-fit: contain), ни один край не срезается. */
    demo: { video: 'media/works/shrs-demo.mp4',
            poster: 'media/works/shrs-demo-poster.jpg',
            screen: [16, 10],
            /* Та же система с телефона — рамка рядом с ноутом. Пропорция
               экрана реальная, 1080x2324, поэтому запись встаёт без обрезки. */
            mobile: { video: 'media/works/shrs-mobile.mp4',
                      poster: 'media/works/shrs-mobile-poster.jpg',
                      screen: [1080, 2324] } },
    cover: '',
    url: 'https://шрс-сервис.рф',
    year: 2026,
    tags: ['Node.js', 'Express', 'SQLite', 'Telegram bot', 'CRM'],
    gallery: [],
    widgets: [
      {
        id: 'yandex',
        langs: ['ru'],
        ru: { title: 'Яндекс: карточка, карты и поиск',
              note: 'Сайта мало — клиент ищет автосервис на картах и в поиске. Карточка организации подтверждена, данные и цены ведутся вместе с сайтом.' },
        shots: [
          { src: 'img/works/shrs/yandex-card.jpg',
            ru: 'Яндекс, запрос «шрс сервис». Сайт — первой строкой, справа подтверждённая карточка организации: адрес, телефон, фото, часы работы и цены.' },
          { src: 'img/works/shrs/google-search.png',
            ru: 'Google — тот же запрос. ИИ-обзор сам собирает телефон и цены на услуги, а вся выдача ведёт на клиента.' },
          { src: 'img/works/shrs/maps-pin.jpg',
            ru: 'Пин на Яндекс.Картах. Название видно прямо на карте, без предварительного поиска.' },
          { src: 'img/works/shrs/maps-card.jpg',
            ru: 'Карточка при клике. Логотип, часы работы, цены услуг и кнопка «Маршрут» — в приложении карт.' }
        ]
      },
      {
        id: 'admin',
        ru: { title: 'Веб-админка',
              note: 'Заявки, цены, фото и права администраторов — без правки кода.' },
        en: { title: 'Web admin panel',
              note: 'Applications, prices, photos and admin rights — with no code changes.' },
        shots: [
          { src: 'img/works/shrs/admin-login.png',
            ru: 'Вход в админку. Секретная ссылка вместо публичного /admin, и она периодически меняется сама.',
            en: 'Admin sign-in through a secret link instead of a public /admin — and the link rotates by itself.' }
        ]
      },
      {
        id: 'cookie',
        langs: ['ru'],
        ru: { title: 'Согласия и 152-ФЗ',
              note: 'Cookie спрашиваются честно: отказаться можно одной кнопкой, и сайт продолжит работать.' },
        shots: [
          { src: 'img/works/shrs/cookie.png',
            ru: 'Cookie-баннер в стиле сайта. «Только необходимые» — равноправная кнопка, а не мелкая ссылка сбоку.' }
        ]
      }
    ],

    en: {
      title: 'SHRS Service',
      kicker: 'Car service · Moscow',
      summary: 'Site + bot + lead pipeline.',
      challenge: 'Edits to the site did not reach customers: browsers kept serving cached images and styles, so a fresh page looked like the old one.',
      solution:  'A gallery of finished jobs with smooth scrolling, and every asset addressed by a content hash — a change is visible the same second. Uploaded photos are verified to actually be images, not a virus wearing a .jpg name, and the secret admin URL rotates on its own.',
      result:    'The owner updates the gallery himself; a stale cache no longer masks a published change.'
    },
    ru: {
      title: 'ШРС Сервис',
      kicker: 'Автосервис · Москва',
      summary: 'Сайт + бот + CRM заявок.',
      challenge: 'Правки сайта не доезжали до клиентов: браузер продолжал отдавать старые картинки и стили, и свежая страница выглядела прежней.',
      solution:  'Красивая галерея работ с плавной прокруткой, а каждый файл адресуется по хэшу содержимого — правка видна в ту же секунду. Загруженные фото дополнительно проверяются, что это точно картинка, а не подделка под вирус. Секретная ссылка на панель управления меняется сама.',
      result:    'Владелец сам ведёт галерею, а кэш больше не прячет опубликованные изменения.'
    }
  },

  {
    id: 'alpha-cosine',
    /* Живое демо. Крышку держим в 16:10 — как у Маяка: реальная пропорция
       записи превращала корпус в ультраширокий монитор. Запись вписывается
       внутрь целиком (object-fit: contain), ни один край не срезается. */
    demo: { video: 'media/works/alpha-demo.mp4',
            poster: 'media/works/alpha-demo-poster.jpg',
            screen: [16, 10],
            /* Та же система с телефона — рамка рядом с ноутом. Пропорция
               экрана реальная, 1080x2324, поэтому запись встаёт без обрезки. */
            mobile: { video: 'media/works/alpha-mobile.mp4',
                      poster: 'media/works/alpha-mobile-poster.jpg',
                      screen: [1080, 2324] } },
    cover: '',
    url: 'https://alpha-cosine.ru',
    year: 2026,
    tags: ['Node.js', 'Express', 'SQLite', 'Telegram bot', 'Three.js', 'Docker'],
    gallery: [],
    widgets: [
      {
        id: 'calc',
        ru: { title: 'Калькулятор сметы',
              note: 'Считает стоимость по актуальным ценам материалов — клиент видит цифру сразу, а не после звонка.' },
        en: { title: 'Estimate calculator',
              note: 'Prices the job from current material costs — the client sees a number immediately instead of waiting for a callback.' },
        shots: [
          { src: 'img/works/alpha/calculator.png',
            ru: 'Онлайн-калькулятор. Цены материалов подтягиваются автоматически, ставки правятся из панели.',
            en: 'The online calculator: material prices update automatically, rates are edited from the panel.' }
        ]
      },
      {
        id: 'search',
        langs: ['ru'],
        ru: { title: 'Поиск: Яндекс и Google',
              note: 'Компанию находят по названию, а нейросети обоих поисковиков берут контакты и услуги прямо с сайта — значит, он им понятен.' },
        shots: [
          { src: 'img/works/alpha/search-alice.png',
            ru: 'Яндекс, быстрый ответ Алисы. Адрес, телефон, график и список услуг собраны с сайта — клиент видит их, ещё не открыв страницу.' },
          { src: 'img/works/alpha/search-organic.png',
            ru: 'Обычная выдача под ответом. Первые две строки — сам сайт: главная и страница контактов.' },
          { src: 'img/works/alpha/google-search.png',
            ru: 'Google, тот же запрос. ИИ-обзор перечисляет услуги компании и ссылается на сайт как на источник.' }
        ]
      },
      {
        id: 'admin',
        ru: { title: 'Веб-админка',
              note: 'Портфолио объектов, цены и заявки — новая работа добавляется в два клика.' },
        en: { title: 'Web admin panel',
              note: 'Project gallery, prices and applications — a new job is added in two clicks.' },
        shots: [
          { src: 'img/works/alpha/admin-login.png',
            ru: 'Вход в админку. Своя палитра под фирменный стиль сайта — не типовая CMS.',
            en: 'Admin sign-in styled to the site brand — not an off-the-shelf CMS.' }
        ]
      },
      {
        id: 'cookie',
        langs: ['ru'],
        ru: { title: 'Согласия и 152-ФЗ',
              note: 'Согласие на обработку данных запрашивается честно, с реальной политикой, а не для галочки.' },
        shots: [
          { src: 'img/works/alpha/cookie.png',
            ru: 'Cookie-баннер. Отказ работает так же, как согласие, — без тёмных приёмов.' }
        ]
      }
    ],

    en: {
      title: 'Alpha-Cosine',
      kicker: 'Construction · Moscow',
      summary: 'Site + bot + live estimate calculator.',
      challenge: 'Customers had to wait for a callback to find out what the job would cost — and most of them did not wait.',
      solution:  'A calculator that pulls current material prices straight from the admin panel, so the figure on screen is never stale. Leads carry statuses, old records stop cluttering the list, and the source of each lead is recorded.',
      result:    'Enquiries arrive with a budget already in mind, and it is visible which advertising actually brings customers rather than merely feeling like it does.'
    },
    ru: {
      title: 'Альфа-косинус',
      kicker: 'Стройка · Москва',
      summary: 'Сайт + Telegram-бот + калькулятор смет.',
      challenge: 'Клиент не знал цену, пока не дозвонится до мастера, — и чаще всего не дозванивался.',
      solution:  'Калькулятор тянет актуальные цены материалов прямо из админки, поэтому цифра на экране не бывает устаревшей. Заявки идут со статусами, старые записи не захламляют список, источник каждой заявки фиксируется.',
      result:    'Заявки приходят уже с понятным бюджетом, и видно, какая реклама реально приводит клиентов, а не просто ощущается работающей.'
    }
  }

];
