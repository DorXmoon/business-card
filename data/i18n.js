/* ============================================================================
   i18n.js — ВСЕ ТЕКСТЫ ИНТЕРФЕЙСА / ALL UI TEXT
   ----------------------------------------------------------------------------
   Один ключ = одна фраза, сразу на двух языках. Правишь текст ЗДЕСЬ и только
   здесь — в разметке текста нет вообще.

   Ключ вида 'nav.works' попадает в HTML через атрибут data-i18n="nav.works".
   Добавил новый ключ сюда — сразу можешь использовать его в index.html.
   ========================================================================== */

window.I18N = {

  /* ---------- Общее / Common ---------- */
  /* ЗАПАСНОЙ вариант. Рабочие заголовок и описание живут в site.config.js →
     SITE.meta: оттуда их берёт и сборщик страниц, и app.js. Здесь они лежат
     на случай пустого конфига, чтобы вкладка не осталась без имени. */
  'meta.title':        { en: 'Custom websites you actually own — DorXmoon',
                         ru: 'Сайт с управлением из Telegram — разработка под ключ | DorXmoon' },
  'meta.description':  { en: 'Hand-coded websites with a deep admin panel and a chat bot as a second control panel. You own the code, the database and the admin from day one.',
                         ru: 'Самописные сайты с админ-панелью и Telegram-ботом как второй панелью управления. Код, база и админка — Ваши с первого дня.' },

  'nav.why':           { en: 'Why me',        ru: 'Почему я' },
  'nav.services':      { en: 'What I do',     ru: 'Что делаю' },
  'nav.works':         { en: 'Work',          ru: 'Работы' },
  'nav.stack':         { en: 'Stack',         ru: 'Стек' },
  'nav.partnership':   { en: 'Working together', ru: 'Сотрудничество' },

  'nav.label':         { en: 'Sections',       ru: 'Разделы' },
  'nav.partners':      { en: 'Clients',        ru: 'С кем работаю' },
  'nav.promo':         { en: 'Promotion',     ru: 'Продвижение' },
  'nav.reviews':       { en: 'Testimonials',  ru: 'Отзывы' },

  'lang.switchTo':     { en: 'Переключить на русский', ru: 'Switch to English' },
  'theme.toLight':     { en: 'Switch to light theme',  ru: 'Включить светлую тему' },
  'theme.toDark':      { en: 'Switch to dark theme',   ru: 'Включить тёмную тему' },

  /* ---------- Hero ---------- */
  'hero.available':    { en: 'Available for new work', ru: 'Открыт для новых проектов' },

  'hero.headline':     { en: 'A website you actually own',
                         ru: 'Сайт, которым Вы управляете с телефона' },

  /* В этом ключе разрешён <b> — он подставляется как HTML (data-i18n-html) */
  'hero.who':          { en: '<b>Eduard Dorofeev</b> — full-stack developer. Custom websites, deep admin panels and bots.',
                         ru: '<b>Эдуард Дорофеев</b> — full-stack разработчик. Самописные сайты, глубокие админ-панели и Telegram-боты.' },

  'hero.tagline':      { en: 'Hand-coded sites with an admin panel tuned to how your business actually runs. Code, database and admin credentials are yours from launch — and the only bill that repeats is a domain and hosting, paid by you, to your provider.',
                         ru: 'Правка цены, новость, фото, ответ на заявку — из Telegram, за десять секунд, без пароля и без ноутбука. Та же база, что и у веб-админки: что сделано в боте, на сайте видно в ту же секунду.' },

  'hero.claim':        { en: 'No platform rent. No plugin licences. No subscription stack.',
                         ru: 'Код, база и админ-панель — Ваши с первого дня.' },
  'hero.claimTail':    { en: 'A small-business WordPress site quietly costs $200–400 a year in plugin licences and $30–500 a month in maintenance — before the first emergency invoice. Here the only bill that repeats is a domain and hosting; having me look after it is a plan you can take or skip, and the site runs either way.',
                         ru: 'Никакой аренды платформы. Никаких подписок на плагины. Никакого счёта за то, чтобы поменять телефон на странице.' },

  'hero.cta':          { en: 'Message me on Telegram', ru: 'Написать в Telegram' },
  'hero.cta2':         { en: 'See the work',          ru: 'Смотреть работы' },
  'hero.cta2demo':     { en: 'My bot: services and contact ↗', ru: 'Мой бот: услуги и связь ↗' },
  'hero.ctaSub':       { en: 'Straight to me — no agency, no sales team. Prefer email? It is at the bottom.',
                         ru: 'Отвечаю сам и быстро. Не любите мессенджеры — внизу есть почта.' },
  'hero.stat1':        { en: 'systems running in production', ru: 'системы работают в бою' },
  'hero.stat2':        { en: 'control panels on every project — web and messenger',
                         ru: 'панели управления на каждом проекте — веб и Telegram' },
  'hero.stat3':        { en: 'days of warranty on everything shipped',
                         ru: 'дней гарантии на весь запущенный функционал' },

  /* ---------- Секции: заголовки ---------- */
  'why.title':         { en: 'Why me',        ru: 'Почему я' },
  /* Счёт в подзаголовке обязан совпадать с фактическим числом карточек ЭТОГО
     языка (window.WHY с учётом langs). Сейчас: EN — 6, RU — 7 (на RU живут
     карточка про WordPress и денежная про рекламу, на EN — денежная про
     стоимость владения). Проверять после каждой правки WHY скриптом по
     массиву с тем же фильтром, что и рендер, а не глазами: это уже третий
     раз, когда число в тексте расходится с фактом. */
  'why.subtitle':      { en: 'The four things that usually go wrong when you hire a web developer — and how each is engineered out',
                         ru: 'Четыре вещи, которые обычно ломаются при найме разработчика, — и как каждая закрыта на уровне архитектуры' },

  'services.title':    { en: 'What I do',     ru: 'Что делаю' },
  /* Число здесь обязано совпадать с длиной window.SERVICES (та же грабля,
     что была с «четыре вещи» при пяти карточках в «Почему я»). */
  'services.subtitle': { en: 'A few things done properly, rather than everything done thinly',
                         ru: 'Несколько вещей, сделанных как следует, вместо всего понемногу' },

  'services.more':     { en: 'Also:', ru: 'Ещё делаю:' },

  'promo.title':       { en: 'Promotion',     ru: 'Продвижение и SEO' },
  'promo.subtitle':    { en: '',
                         /* Число в тексте обязано совпадать с длиной window.PROMO.
                            Добавили услугу — правим и здесь (та же грабля, что была
                            с «четыре вещи» при пяти карточках в «Почему я»). */
                         ru: 'Шесть разных услуг — их постоянно путают между собой. Сайт можно сделать идеально и всё равно остаться незаметным, поэтому разделяю честно: что входит в пакет разработки, а что считается отдельно.' },
  'promo.note':        { en: '',
                         ru: '* Что именно уже входит в Ваш пакет, а что считается отдельно — поясню по запросу, под Вашу задачу. Остальное — по задаче и бюджету, считаю прозрачно и заранее: тарифы и подписку пришлю в Telegram.\n** Instagram — продукт компании Meta, признанной экстремистской организацией и запрещённой на территории Российской Федерации. TikTok и YouTube под этот запрет не подпадают.' },

  /* ---- свой видеоплеер (подписи для читалок и подсказок) ---- */
  'player.play':       { en: 'Play',            ru: 'Смотреть' },
  'player.pause':      { en: 'Pause',           ru: 'Пауза' },
  'player.seek':       { en: 'Seek',            ru: 'Перемотка' },
  'player.mute':       { en: 'Mute',            ru: 'Выключить звук' },
  'player.unmute':     { en: 'Unmute',          ru: 'Включить звук' },
  'player.volume':     { en: 'Volume',          ru: 'Громкость' },
  'player.subs':       { en: 'Subtitles',       ru: 'Субтитры' },
  'player.subsHide':   { en: 'Subtitles on',    ru: 'Субтитры включены' },
  'player.subsOff':    { en: 'Off',             ru: 'Выкл' },
  'player.full':       { en: 'Full screen',     ru: 'Во весь экран' },
  'player.exitFull':   { en: 'Exit full screen', ru: 'Выйти из полноэкранного' },

  'works.title':       { en: 'Selected work', ru: 'Работы' },
  'works.subtitle':    { en: 'Production systems — site and bot both built by me',
                         ru: 'Работающие системы — сайт и бот сделаны мной' },
  'works.emptyLabel':  { en: 'In preparation', ru: 'Готовится' },
  'works.emptyTitle':  { en: 'Case studies are being prepared',
                         ru: 'Кейсы готовятся' },
  'works.emptyText':   { en: 'Live projects exist and are running — I am putting the write-ups together. Want to see them now? Message or email me and I will send links and screenshots straight away.',
                         ru: 'Проекты работают в бою — сейчас довожу описания. Хотите посмотреть прямо сейчас? Напишите в Telegram, пришлю ссылки и скриншоты сразу.' },
  'works.emptyCta':    { en: 'Ask for examples',   ru: 'Запросить примеры' },
  'works.open':        { en: 'Details',        ru: 'Подробнее' },
  'works.visit':       { en: 'Open the site ↗', ru: 'Открыть сайт ↗' },
  'works.bot':         { en: 'Open the bot ↗',  ru: 'Открыть бот ↗' },
  'works.challenge':   { en: 'The problem',    ru: 'Задача' },
  'works.solution':    { en: 'What I built',   ru: 'Что сделал' },
  'works.result':      { en: 'Result',         ru: 'Результат' },
  'shots.unit':        { en: 'shots',  ru: 'фото' },
  'shots.hint':        { en: 'Wheel — zoom · drag — pan · double click — reset · Esc — close',
                         ru: 'Колесо — приблизить · перетащить — сдвинуть · двойной клик — сброс · Esc — закрыть' },
  'works.mobile':      { en: 'Open the mobile version', ru: 'Открыть мобильную версию' },
  'works.close':       { en: 'Close',          ru: 'Закрыть' },

  'reviews.title':     { en: 'Client testimonials', ru: 'Отзывы клиентов' },
  'reviews.subtitle':  { en: 'On camera, with the channel and the chat to check it against',
                         ru: 'Под запись, со ссылками где и как это проверить' },
  /* Текстовой подсказки под телефоном нет намеренно: кнопка Play на экране
     говорит сама за себя — круг с треугольником не нуждается в подписи. */
  'reviews.play':      { en: 'Play testimonial',   ru: 'Смотреть отзыв' },
  'reviews.close':     { en: 'Close',              ru: 'Закрыть' },
  'reviews.verify':    { en: 'Every testimonial here links to a live channel and an open chat — check it before you believe it.',
                         ru: 'Каждый отзыв здесь ведёт на живой канал и открытый чат — проверьте, прежде чем поверить.' },

  'partners.title':    { en: 'Ongoing clients', ru: 'С кем работаю' },
  'partners.subtitle': { en: 'Ongoing collaboration, not a one-off project',
                         ru: 'Постоянное сотрудничество, а не разовый проект' },
  'partners.note':     { en: 'Audience figures are as of the date this page was published.',
                         ru: 'Цифры — размер аудитории на момент публикации страницы.' },

  'stack.title':       { en: 'Technical stack', ru: 'Технический стек' },
  'stack.subtitle':    { en: 'Chosen to be portable and boring — so any developer can take it over',
                         ru: 'Выбран портируемым и скучным — чтобы любой разработчик мог его подхватить' },

  'partnership.title':    { en: 'Working together', ru: 'Как мы работаем' },
  'partnership.subtitle': { en: 'What happens after launch matters more than the launch',
                            ru: 'Что происходит после запуска, важнее самого запуска' },

  'nav.faq':           { en: 'FAQ',            ru: 'Вопросы' },
  'faq.title':         { en: 'Frequently asked', ru: 'Частые вопросы' },
  'faq.subtitle':      { en: 'The things people actually ask before we start — answered here rather than in a first call',
                         ru: 'То, что действительно спрашивают до старта, — отвечаю здесь, а не в первом разговоре' },

  /* Подпись на свёрнутой секции. Перечисление того, что внутри, собирается
     из самих карточек — руками его дублировать нельзя, разъедется. */
  'fold.open':         { en: 'Show details', ru: 'Раскрыть подробности' },
  /* Обязательная пара к предыдущему ключу: в раскрытом состоянии подпись
     пряталась целиком, вместе с ней исчезала кликабельная область, и
     свернуть блок обратно было нечем. */
  'fold.close':        { en: 'Hide', ru: 'Свернуть' },

  /* ---------- Контакт ---------- */
  'contact.title':     { en: "Let's talk",     ru: 'Давайте обсудим' },
  'contact.text':      { en: 'Tell me what the business needs to do — not what technology you think it needs. The stack is my problem. One message is enough to start.',
                         ru: 'Расскажите, что должен делать бизнес, — а не какая технология для этого нужна. Стек — моя забота. Для старта хватит одного сообщения.' },
  'contact.cta':       { en: 'Write to me on Telegram', ru: 'Написать в Telegram' },
  'contact.or':        { en: 'or by email', ru: 'или на почту' },

  'contact.offer':     { en: 'Not ready to talk yet? Send the address of your current site — I will record a 30-minute teardown: what is broken and what to fix first. The teardown is free; fixing it is priced normally.',
                         ru: 'Пока не готовы обсуждать? Пришлите адрес Вашего сайта — запишу видеоразбор на 30 минут: что на нём сломано и что чинить первым. Разбор бесплатный, починка по прайсу.' },
  'contact.offer2':    { en: 'No site yet? Then let me show you the admin panel and the second control panel in ten minutes, on a system that is already running.',
                         ru: 'Сайта ещё нет? Тогда за десять минут покажу на живой системе, как Вы будете вести свой сайт с телефона.' },

  'footer.rights':     { en: 'Eduard Dorofeev', ru: 'Эдуард Дорофеев' },
  'footer.built':      { en: 'This site is hand-coded too — no builder, no template.',
                         ru: 'Этот сайт тоже написан руками — без конструктора и шаблона.' }

};
