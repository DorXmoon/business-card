/* ============================================================================
   content.js — СОДЕРЖИМОЕ БЛОКОВ / SECTION CONTENT
   ----------------------------------------------------------------------------
   Каждый блок сайта — это массив. Добавить карточку = добавить объект.
   Убрать карточку = удалить объект. Переставить = переставить строки.
   Вёрстка подстраивается сама, ничего в HTML править не нужно.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1. ПОЧЕМУ Я — боли заказчика и ответ на каждую
   Шаблон: { icon, en:{ pain, fact, answer }, ru:{ pain, fact, answer } }
   ------------------------------------------------------------------------- */
window.WHY = [
  {
    en: {
      pain: '"My developer vanished — and I can\'t touch my own site."',
      fact: 'The classic small-business horror story: an invoice just to change a phone number, or a site nobody can log into anymore.',
      lead: 'Solved by architecture, not by a promise',
      answer: 'Structural, not a promise: source code, database and admin credentials are handed over at launch, in your own hosting account, under your own domain. One button in the admin panel exports the whole project as an encrypted archive. If I disappeared tomorrow, any developer could pick it up.'
    },
    ru: {
      pain: '«Разработчик пропал — а я не могу тронуть собственный сайт».',
      fact: 'Классика: счёт за то, чтобы поменять телефон на странице, или сайт, в который никто уже не может войти.',
      answer: 'Решено архитектурой, а не обещанием: код, база и доступы к админке отдаются на запуске, хостинг и домен оформлены на Вас. Кнопка в админке выгружает весь проект зашифрованным архивом. Пропади я завтра — любой разработчик подхватит.'
    }
  },
  {
    en: {
      pain: 'Platform rent, forever.',
      fact: 'Wix, Squarespace and Shopify give you no code export — your design and pages live inside their editor. Moving means rebuilding by hand, and renewal pricing jumps after the first term.',
      answer: 'Hand-written code on standard, boring, portable technology. Your only recurring costs are a domain and hosting, paid by you, to your provider, in your name. Nothing is rented from me.'
    },
    ru: {
      pain: 'Tilda и GetCourse — аренда. WordPress — чужая стройка.',
      fact: 'Tilda и GetCourse: платите, пока пользуетесь; перестали платить — сайт выключился. Экспорт на старших тарифах отдаёт статичные страницы, вместе с ними теряются формы, личные кабинеты и сама админка — редактировать это больше нечем.',
      answer: 'У меня Вы платите один раз за работу, дальше только домен и хостинг — напрямую провайдеру и на своё имя. Выключить сайт снаружи некому.'
    }
  },
  {
    en: {
      pain: 'The bill that keeps arriving after launch.',
      fact: 'A small-business WordPress site commonly runs $200-400 a year in plugin licences and $30-500 a month in maintenance on top of the build — and a form tool, a CRM seat, a booking app and a review widget routinely cost more per month than the site did.',
      lead: 'Everything in one database, behind one panel',
      answer: 'Leads, statuses, customers, content, media and reports live in one database behind one admin panel — built in, not bolted on, with nothing to subscribe to. Nothing renews but a domain and hosting, and a care plan is there only if You want it.'
    },
    ru: {
      pain: 'Деньги, которые уходят уже после запуска.',
      fact: 'Платные плагины, тариф конструктора, место в CRM, сервис записи, виджет отзывов — в сумме это больше в месяц, чем стоила разработка. А сверху идёт реклама, которая на слабой странице просто показывает её большему числу людей за Ваши деньги.',
      lead: 'Всё в одной базе за одной админкой',
      answer: 'Заявки, статусы, клиенты, контент, медиа и отчёты — в одной базе за одной админкой: ни одной сторонней подписки, которая капает каждый месяц. А рекламу не запускаю раньше, чем страница начнёт доводить до заявки и встанет измерение, — иначе бюджет тратится вслепую.'
    }
  },
  {
    en: {
      pain: 'What happens after launch — the site keeps living.',
      fact: 'Prices change, services change, photos change, new ideas appear. This is usually the point where the developer either goes quiet or starts invoicing every small edit separately.',
      lead: 'Staying in touch is part of the price',
      answer: 'Thirty days of warranty, and after that I am still here — small questions get answered, not billed. Meanwhile the site depends on nobody: content is yours to run from the admin panel and the bot. If you would rather I looked after the technical side too — updates, backups, keeping an eye on things, priority response and a regular pass of changes — there is a care plan for exactly that. It is optional, and skipping it costs you nothing: the site stays yours and keeps working either way.'
    },
    ru: {
      pain: 'А что будет после запуска — сайт ведь живёт дальше.',
      fact: 'Меняются цены, услуги, фотографии, появляются новые идеи. Обычно ровно на этом месте подрядчик или замолкает, или начинает выставлять счёт за каждую мелочь.',
      lead: 'Быть на связи — часть стоимости',
      answer: 'Часть стоимости, а не отдельная опция: 30 дней гарантии, а дальше я никуда не деваюсь, и на мелкие вопросы отвечаю, а не выставляю за них счёт. Сам сайт при этом ни от кого не зависит: контент Вы ведёте сами из панели и бота. А если удобнее, чтобы техническую сторону вёл я — обновления, резервные копии, присмотр за тем, что всё живо, ответ вне очереди и регулярный заход с правками, — для этого есть подписка на сопровождение. Она по желанию: не подключите — ничего не потеряете, сайт остаётся Вашим и работает так же.'
    }
  }
];

/* ---------------------------------------------------------------------------
   2. ЧТО ДЕЛАЮ
   Шаблон: { icon, en:{ title, text, points:[] }, ru:{ ... } }
   ------------------------------------------------------------------------- */
window.SERVICES = [
  {
    en: {
      title: 'Custom websites, turnkey',
      text: 'From a one-page card to a full multi-page site — hand-coded from an empty folder, with no builder, no template and no theme to fight with.',
      points: ['Design, code, hosting setup, domain, SSL, launch', 'Responsive and keyboard-accessible', 'Clean semantics, correct URLs and speed — the SEO foundation is in the build', 'Zero-downtime updates — the site stays online while it ships']
    },
    ru: {
      title: 'Самописные сайты под ключ',
      text: 'От визитки до многостраничного — пишутся с пустой папки, без конструктора, без шаблона и без борьбы с чужой темой.',
      points: ['Дизайн, код, настройка хостинга, домен, SSL, запуск', 'Адаптив и работа с клавиатуры', 'Чистая семантика, корректные адреса и скорость — фундамент под SEO', 'Обновления без остановки — сайт продолжает работать']
    }
  },
  {
    tier: 2,
    en: {
      title: 'Landing pages and one-page cards',
      text: 'One page, one goal, one button: for a campaign, a product launch or a single service. A personal or company one-pager belongs here too. Not a smaller website — a different product.',
      points: ['Structure driven by the objection order, not by taste', 'Analytics and goals from day one — a landing without measurement is money spent blind', 'A/B-ready: headline, offer and button are content, not code', 'Same speed and accessibility baseline as a full build']
    },
    ru: {
      title: 'Лендинги и сайты-визитки',
      text: 'Одна страница, одна цель, одна кнопка: под рекламную кампанию, запуск продукта или отдельную услугу. Сюда же сайт-визитка — коротко о себе, услугах и контактах. Это не «сайт поменьше», а другой продукт.',
      points: ['Структура строится по порядку возражений, а не по вкусу', 'Аналитика и цели с первого дня — лендинг без замера это деньги вслепую', 'Заголовок, оффер и кнопка правятся как контент, без программиста — можно тестировать варианты', 'Скорость и доступность те же, что и на полном проекте']
    }
  },
  {
    en: {
      title: 'The admin panel — my core strength',
      text: 'Not a generic dashboard. A control panel written for how that business actually runs.',
      points: ['Every page, price, photo, service and person editable by the owner', 'Lead pipeline with statuses, so nothing is lost in an inbox', 'Role-based access, and approval flows for high-impact actions', 'Encrypted self-service backups and Excel export']
    },
    ru: {
      title: 'Админ-панель — моя сильная сторона',
      text: 'Не типовой дашборд. Панель, написанная под то, как реально работает этот бизнес.',
      points: ['Владелец сам правит любую страницу, цену, фото, услугу и сотрудника', 'Заявки со статусами — ничего не теряется в почте', 'Права по ролям и согласование важных действий', 'Зашифрованные бэкапы по кнопке и выгрузка в Excel']
    }
  },
  {
    en: {
      title: 'A chat bot as a second control panel',
      text: 'The same database, a second interface. Run the whole site from your phone, in the messenger your team already uses — no laptop, no password.',
      points: ['Full parity with the web panel — publish, edit, answer leads', 'An edit in the bot is live on the site the same second', 'Passwordless sign-in, plus per-admin passwords for sensitive actions', 'You pick the channel: Slack, Discord, WhatsApp Business or Telegram — same design underneath']
    },
    ru: {
      title: 'Telegram-бот как вторая панель',
      text: 'Та же база, второй интерфейс. Управление всем сайтом с телефона, без ноутбука.',
      points: ['Полный паритет с веб-админкой — публикация, правки, ответы на заявки', 'Правка в боте видна на сайте в ту же секунду', 'Вход без пароля плюс личные пароли на важные действия', 'Канал не принципиален: то же решение ставится на Slack, Discord, WhatsApp']
    }
  },
  {
    tier: 2,
    en: {
      title: 'Online stores and e-commerce platforms',
      text: 'A shop is not a site with a "buy" button: it is a catalogue, a warehouse, money and order statuses in one system.',
      points: ['Catalogue with categories, filters, search and product options', 'Cart, checkout, online payment and delivery calculation', 'Stock levels, reservations and order statuses — the owner sees every stage', 'The bot pings you the second an order lands; sales reports export to Excel']
    },
    ru: {
      title: 'Интернет-магазин и e-commerce платформа',
      text: 'Магазин — это не сайт с кнопкой «купить»: это каталог, склад, деньги и статусы заказов в одной системе.',
      points: ['Каталог с категориями, фильтрами, поиском и вариантами товара', 'Корзина, оформление, онлайн-оплата и расчёт доставки', 'Остатки, резервы и статусы заказов — владелец видит каждый этап', 'Бот пишет о заказе в ту же секунду; отчёты по продажам выгружаются в Excel']
    }
  },
  {
    tier: 2,
    en: {
      title: 'AI, wired in properly',
      text: 'An assistant that answers from your services, prices and policies — not from the open internet.',
      points: ['Qualifies inbound leads, drafts replies, routes what needs a human', 'Helps in the admin too: draft a post, rewrite a description', 'Anthropic Claude or OpenAI — your account, your key', 'Wires your tools together with no copy-paste in between: a lead lands in the CRM and in chat by itself, reports build on a schedule, the AI reads an enquiry and drafts the reply — built on n8n', 'No token markup, ever — usage is billed to you directly, at cost']
    },
    ru: {
      title: 'ИИ, подключённый как надо',
      text: 'Помощник отвечает по Вашим услугам, ценам и правилам — а не по интернету вообще.',
      points: ['Разбирает входящие заявки, готовит ответы, передаёт человеку что нужно', 'Помогает и в админке: черновик поста, переписать описание', 'Anthropic Claude или OpenAI — Ваш аккаунт, Ваш ключ', 'Связываю сервисы между собой без ручной работы: заявка сама уходит в CRM и в Telegram, отчёт собирается по расписанию, ИИ читает обращение и готовит ответ — на n8n', 'Никакой наценки на токены — расход биллится Вам напрямую, по себестоимости']
    }
  }
];

/* ---------------------------------------------------------------------------
   3. СТЕК
   Шаблон: { en:{ k, v }, ru:{ k, v } }  — k = категория, v = перечисление
   ------------------------------------------------------------------------- */
window.STACK = [
  { en: { k: 'Backend',        v: 'PHP 8 (framework-free), Node.js / Express, Python' },
    ru: { k: 'Бэкенд',         v: 'PHP 8 (без фреймворков), Node.js / Express, Python' } },
  { en: { k: 'Databases',      v: 'MySQL, SQLite — schema migrations, no proprietary storage' },
    ru: { k: 'Базы данных',    v: 'MySQL, SQLite — миграции схемы, без проприетарных хранилищ' } },
  { en: { k: 'Frontend',       v: 'Semantic HTML, modern CSS, vanilla JS, Three.js / WebGL for 3D scenes' },
    ru: { k: 'Фронтенд',       v: 'Семантичный HTML, современный CSS, чистый JS, Three.js / WebGL для 3D' } },
  { en: { k: 'Telegram Bot API', v: 'Database-backed conversation state machine, inline keyboards, Login Widget auth, webhook and polling' },
    ru: { k: 'Telegram Bot API', v: 'Машина состояний диалога на базе, инлайн-клавиатуры, авторизация через Login Widget, webhook и polling' } },
  { en: { k: 'Infrastructure', v: "Docker Compose, scripted deploys to VPS (Ubuntu), nginx, Let's Encrypt, systemd, Cloudflare" },
    ru: { k: 'Инфраструктура', v: "Docker Compose, скриптовый деплой на VPS (Ubuntu), nginx, Let's Encrypt, systemd, Cloudflare" } },
  { en: { k: 'Security',       v: 'CSRF tokens, rate limiting, automated IP blocklisting, CSP / HSTS, upload verification, encrypted backups' },
    ru: { k: 'Безопасность',   v: 'CSRF-токены, ограничение частоты, автобан IP, CSP / HSTS, проверка загружаемых файлов, шифрованные бэкапы' } },
  { en: { k: 'AI',             v: 'Anthropic Claude & OpenAI APIs — assistants grounded in your own content' },
    ru: { k: 'ИИ',             v: 'API Anthropic Claude и OpenAI — помощники, отвечающие по Вашему контенту' } },
  { en: { k: 'Also',           v: 'Python scrapers and automation, headless-browser PDF generation, Core Web Vitals' },
    ru: { k: 'Ещё',            v: 'Парсеры и автоматизация на Python, генерация PDF через headless-браузер, Core Web Vitals' } }
];

/* ---------------------------------------------------------------------------
   4. СОТРУДНИЧЕСТВО
   Шаблон: { badge, en:{ title, text }, ru:{ title, text } }
   badge — короткая надпись-плашка; '' если не нужна
   ------------------------------------------------------------------------- */
window.PARTNERSHIP = [
  {
    badge: { en: '30 days', ru: '30 дней' },
    en: { title: 'Warranty on everything shipped',
          text: 'If it does not work the way we agreed, I fix it — fast, at no charge. Not "report a ticket": you message or email me and I get on it.' },
    ru: { title: 'Гарантия на весь запущенный функционал',
          text: 'Работает не так, как договаривались — чиню быстро и бесплатно. Не «оставьте обращение»: пишете в Telegram, я берусь.' }
  },
  {
    badge: { en: 'Included', ru: 'Входит в цену' },
    en: { title: 'One free revision pass after the warranty month',
          text: 'Wanting to adjust something inside the functionality already built is normal — you cannot always tell up front what serves the business best. I collect every such request and do them in a single pass, included in the price.' },
    ru: { title: 'Пакет доработок после гарантийного месяца',
          text: 'Захотеть поправить что-то внутри уже готового функционала — нормально: сразу не всегда понятно, что бизнесу лучше. Я собираю все такие пожелания и вношу одним заходом, это входит в стоимость.' }
  },
  {
    badge: { en: '−25%', ru: '−25%' },
    en: { title: 'Ongoing work at 75% of rate — for my own clients',
          text: 'The first project is at normal rate. Every later improvement or addition, once the warranty month is over, is always 75% of rate — never priced as if we were starting from scratch. The longer we work together, the cheaper each step gets.' },
    ru: { title: 'Дальнейшая работа — 75% от прайса, для своих',
          text: 'Первый заказ по обычной цене. Любая последующая доработка или улучшение после гарантийного месяца — всегда 75% от прайса, а не «как с нуля». Чем дольше работаем вместе, тем дешевле каждый следующий шаг.' }
  },
  {
    badge: { en: 'On paper', ru: 'На бумаге' },
    en: { title: 'A contract, not a handshake',
          text: 'We sign before work starts: scope, deadlines, payment stages and an acceptance act, in the edition that fits how you are registered. The 30-day warranty is a clause in it, not a line on a website — which is the difference between a promise and something you can hold me to.' },
    ru: { title: 'Договор, а не «на словах»',
          text: 'Подписываем до начала работ: объём, сроки, этапы оплаты и акт приёмки — в редакции под Вашу форму (физлицо, ИП, ООО, АО, субподряд), с приложением по обработке персональных данных. Гарантия 30 дней — пункт договора, а не строчка на сайте. Это и есть разница между обещанием и обязательством.' }
  },
  {
    badge: { en: 'Always', ru: 'Всегда' },
    en: { title: 'You are never locked in',
          text: 'Want to extend the site yourself, hand it to another developer, or have an AI tool modify it? You can, at any moment, without asking me. That is what ownership actually means — and it is why I would rather earn the next project than trap you into it.' },
    ru: { title: 'Вы не привязаны ко мне',
          text: 'Захотели дорабатывать сами, отдать другому разработчику или доверить правки ИИ — можете в любой момент, не спрашивая меня. Это и есть владение. Мне важнее заслужить следующий заказ, чем запереть Вас в текущем.' }
  }
];


/* ---------------------------------------------------------------------------
   5. ПРОДВИЖЕНИЕ (только RU — секция включается в site.config.js полем langs)
   Шаблон: { tag, price, ru:{ title, text } }
   price — короткая приписка справа; '' если не нужна
   ------------------------------------------------------------------------- */
window.PROMO = [
  {
    tag: { ru: '* зависит от пакета' },
    ru: {
      title: 'Техническое SEO',
      text: 'Настраиваю сайт так, чтобы Яндекс и Google правильно его понимали: структура заголовков, микроразметка, карта сайта, скорость загрузки и Core Web Vitals, корректные адреса страниц. Это фундамент — без него любое платное продвижение просто дороже стоит. Входит в старшие пакеты разработки; на младших считается отдельно. Разбор уже существующего чужого сайта — отдельная услуга, цена по объёму.'
    }
  },
  {
    tag: { ru: 'по договорённости' },
    ru: {
      title: 'Гео-SEO — охват городов',
      text: 'Если бизнес реально работает в нескольких городах, у каждого должна быть своя посадочная страница, иначе Вас находят только там, где зарегистрирован домен. Каждому городу — свой адрес страницы, свои тексты и своя карточка на картах, а не одна страница «мы работаем по всей России».'
    }
  },
  {
    tag: { ru: '* в составе тех. SEO' },
    ru: {
      title: 'Яндекс Вебмастер и Метрика',
      text: 'Подключаю и настраиваю оба сервиса на старте: Вебмастер показывает, как Яндекс видит сайт — что проиндексировано, где ошибки, почему страница выпала из поиска. Метрика показывает людей: откуда пришли, куда нажали, на каком шаге ушли, сколько стоила заявка. Настраиваю цели на реальные действия (заявка, звонок, переход в Telegram), а не «просмотры». Без этих двух вещей продвижение — это трата вслепую, потому что нечем измерить результат.'
    }
  },
  {
    tag: { ru: '* по договорённости' },
    ru: {
      title: 'Яндекс Бизнес и Карты',
      text: 'Регистрирую и веду карточку организации: вывод на Яндекс Карты и в Навигатор, 2ГИС, заполнение по максимуму — адрес и зона обслуживания, часы, услуги с ценами, фото, ответы на отзывы. Для локального бизнеса — автосервис, стройка, клиника — карта часто даёт больше звонков, чем сам сайт: человек ищет «рядом со мной» и звонит прямо из карточки. Здесь же — работа с отзывами и рейтингом, потому что позиция в выдаче карт зависит и от них.'
    }
  },
  {
    tag: { ru: 'по бюджету' },
    ru: {
      title: 'Платная реклама',
      text: 'Простыми словами — это когда Вы платите за то, чтобы Вас показали. Три вида, и они разные. Яндекс Директ — объявления в поиске, их видит тот, кто прямо сейчас ищет Вашу услугу словами. РСЯ — блоки и баннеры на сайтах-партнёрах Яндекса, куда человек зашёл читать новости или рецепт. Таргет в соцсетях — показ не по запросу, а по признакам: город, возраст, интересы, поведение. Настраиваю кампании, пишу тексты объявлений и посадочные под конкретную цель. Работает сразу, но платите за каждый показ — поэтому сначала считаю, окупается ли это на Вашей марже, а не запускаю «чтобы было».'
    }
  },
  {
    tag: { ru: 'вдолгую' },
    ru: {
      title: 'Органическое продвижение — алгоритмы Instagram**, TikTok и YouTube',
      text: 'Простыми словами — это когда Вас показывают бесплатно, потому что алгоритм площадки сам решил понести Вас дальше: ролик зашёл, его досмотрели и переслали. Не реклама: за показы Вы не платите, но и включить это кнопкой нельзя — работает только контент. Медленнее рекламы, зато не выключается вместе с бюджетом: снятое видео приводит людей и через полгода. Сюда же съёмка по сценарию — снимаем у Вас или у нас, на своей аппаратуре.'
    }
  }
];

/* ---------------------------------------------------------------------------
   6. С КЕМ РАБОТАЮ — постоянные партнёры
   Шаблон: { mark, logo, url, en:{ name, kind, meta }, ru:{ ... } }
   logo — официальный логотип партнёра, 96x96 webp (3-6 КБ). Файл лежит СВОЙ,
   а не ссылкой на чужой хост: у сайта заявлено «ноль внешних доменов» — та же
   причина, по которой Inter не подключён с Google Fonts.
   mark — моно-инициалы, запасной вариант для партнёра без файла логотипа.
   ------------------------------------------------------------------------- */
window.PARTNERS = [
  {
    mark: 'БД',
    logo: 'img/partners/africa.webp',
    url: 'https://t.me/wagner_group2022',
    en: { name: 'Belye Dyadi v Afrike', kind: 'Telegram channel', meta: '121,600 subscribers' },
    ru: { name: 'Белые дяди в Африке', kind: 'Telegram-канал', meta: '121 600 подписчиков' }
  },
  {
    mark: 'ОШ',
    logo: 'img/partners/schaman.webp',
    url: 'https://www.youtube.com/@olegschaman',
    en: { name: 'Oleg Schaman', kind: 'YouTube and Telegram', meta: '60,000 subscribers' },
    ru: { name: 'Олег Шаман', kind: 'YouTube и Telegram', meta: '60 000 подписчиков' }
  },
  {
    mark: 'БВ',
    logo: 'img/partners/east.webp',
    url: 'https://t.me/whitemaninafrica',
    en: { name: 'Belye Dyadi na Blizhnem', kind: 'Telegram channel', meta: '6,700 subscribers' },
    ru: { name: 'Белые дяди на Ближнем', kind: 'Telegram-канал', meta: '6 700 подписчиков' }
  },
  {
    mark: 'АК',
    logo: 'img/partners/alpha.webp',
    url: 'https://alpha-cosine.ru',
    en: { name: 'Alpha-Cosine', kind: 'Construction company', meta: 'site, bot and estimate calculator' },
    ru: { name: 'Альфа-косинус', kind: 'Строительная компания', meta: 'сайт, бот и калькулятор смет' }
  }
];

window.REVIEWS = [
  {
    video:   'media/reviews/schaman.mp4',
    poster:  'media/reviews/schaman-poster.jpg',
    /* Субтитры на каждый язык страницы. Русские — расшифровка речи, английские —
       машинный перевод той же речи (отзыв записан по-русски). Дорожкой, а не
       выжженные в кадр: только так ими управляет CSS (::cue) и только так они
       читаемы и на превью 236px, и в модалке. */
    subs: { ru: 'media/reviews/schaman.ru.vtt', en: 'media/reviews/schaman.en.vtt' },
    avatar:  'img/partners/schaman.webp',
    youtube: 'https://www.youtube.com/@olegschaman',
    tg: {
      channel: 'https://t.me/oleg_schaman_audi',
      chat:    'https://t.me/OlegSchamanGroup',
      bot:     'https://t.me/OlegSchaman_bot'
    },
    en: {
      name: 'Oleg Schaman',
      role: 'YouTube blogger · Audi TDI repair · 60,000 subscribers',
      note: 'Partner and client: Telegram bot for feedback, group moderation and publishing to the channel.',
      lang: 'Video is in Russian',
      quote: 'Ask him yourself — the channel, the chat and his bot are all right here.',
      links: { youtube: 'YouTube channel', channel: 'Telegram channel', chat: 'Open chat', bot: 'His bot — ask directly' }
    },
    ru: {
      name: 'Олег Шаман',
      role: 'YouTube-блогер · ремонт Audi TDI · 60 000 подписчиков',
      note: 'Партнёр и клиент: Telegram-бот для обратной связи, модерации группы и публикации в канал.',
      lang: '',
      quote: 'Спросите у него напрямую — канал, чат и его бот здесь же.',
      links: { youtube: 'Канал на YouTube', channel: 'Telegram-канал', chat: 'Открытый чат', bot: 'Его бот — спросить напрямую' }
    }
  }
];

window.FAQ = [
  {
    en: {
      q: 'Do you do everything yourself?',
      a: 'Development — yes, personally: sites, admin panels and bots. It is my core discipline and the one thing I never hand to anyone. When a task calls for delegating — advertising, design, copy, video — it goes to people I have worked with and vetted. What matters more: I know precisely whether I can carry a task, and I say so before we start rather than halfway through. You never go looking for contractors or coordinating them — the contract, the deadlines and the result stay on me, and You talk to one person.'
    },
    ru: {
      q: 'Я делаю всё один?',
      a: 'Разработку — да, сам: сайты, админ-панели и боты. Это моё основное направление и единственное, что я не передаю никому. Если задачу нужно делегировать — реклама, дизайн, тексты, видео — беру на подряд проверенных людей, с которыми уже работал. Важнее другое: я хорошо понимаю, потяну задачу или нет, и говорю это до начала, а не в процессе. Искать исполнителей и согласовывать их между собой Вам не придётся — договор, сроки и результат на мне, а общаетесь Вы с одним человеком.'
    }
  },
  {
    langs: ['ru'],
    ru: {
      q: 'А почему не WordPress? Его же можно выгрузить.',
      a: 'Честно: можно. WordPress Ваш, файлы скачиваются, хостинг любой. Вопрос не во владении, а в том, ЧЕМ Вы владеете: движок плюс 15-30 плагинов от незнакомых авторов. Функции арендованы у них — платно и ежегодно; автор забросил плагин, и функция умерла; обновление уронило вёрстку. Обновляться приходится по чужому расписанию, а взламывают WordPress чаще всего именно через плагины. У меня в проекте ровно то, что нужно этому бизнесу: нет тридцати чужих плагинов — нечему ломаться при обновлении и негде взяться дыре, а админка написана под Ваши процессы, а не под универсальные «записи и страницы».'
    }
  },
  {
    en: {
      q: 'Are security and accessibility extra?',
      a: 'No — they are in the build from the first commit, on a project of any size: hardened admin panels, protection against the standard form attacks, rate limiting, HTTPS and the WCAG accessibility baseline. Most shops ship the site first and quote protection afterwards, usually after something has already gone wrong. I would rather not have that conversation with You at all.'
    },
    ru: {
      q: 'Безопасность и доступность — это отдельная опция?',
      a: 'Нет, всё это в сборке с первого коммита и на проекте любого размера: закрытые админ-панели, защита от типовых атак на формы, ограничение частоты запросов, HTTPS и базовый уровень доступности (WCAG). Обычно сайт сдают, а защиту считают потом — как правило, уже после того, как что-то случилось. Мне такой разговор с Вами не нужен.'
    }
  },
  {
    en: {
      q: 'How long does it take?',
      a: 'A working prototype takes days, even for a large site: not a picture of a page but something you can open and click through. The exception is e-commerce, which takes longer. After that I finish it to the last detail locally and show you the polished version — so there is no stretch of weeks where nothing visible happens. A full launch with an admin panel and a bot is measured in weeks, and the schedule depends almost entirely on how fast the content comes back from your side. I give a date after the first conversation, not before it — a number named before I understand the task is a number invented to sound good.'
    },
    ru: {
      q: 'Сколько по времени?',
      a: 'Прототип делается за дни, даже у большого сайта: это не картинка, а рабочий каркас, который можно открыть и потыкать. Исключение — интернет-магазин, он дольше. Дальше довожу до идеала локально у себя и показываю уже вычищенное, поэтому недель, когда «вроде что-то делается, а посмотреть нечего», не будет. Полный запуск с админкой и ботом — недели, и срок почти целиком зависит от того, как быстро приходит содержимое с Вашей стороны. Дату называю после первого разговора, а не до него: число, названное до понимания задачи, — это число, придуманное чтобы понравиться.'
    }
  },
  {
    en: {
      q: 'What if I do not know what I need yet?',
      a: 'That is the normal starting point, not a problem. Tell me what the business has to do — get calls, stop losing enquiries, be findable — and the technical part is my job. Most of the first conversation is questions from me, not a pitch from me.'
    },
    ru: {
      q: 'А если я пока не знаю, что мне нужно?',
      a: 'Это нормальная отправная точка, а не проблема. Расскажите, что должен делать бизнес — получать звонки, перестать терять заявки, находиться в поиске, — техническую часть беру на себя. Первый разговор — это в основном мои вопросы, а не мой рассказ о себе.'
    }
  },
  {
    langs: ['ru'],
    ru: {
      q: 'Кому принадлежит сайт после сдачи?',
      a: 'Вам, целиком и с первого дня: код, база, доступы к админке. Хостинг и домен оформляются на Вас, а не на меня, — это принципиально. В админке есть кнопка, которая выгружает весь проект одним архивом, и передать его другому разработчику можно без моего участия и без моего согласия.'
    }
  },
  {
    en: {
      q: 'What do you not promise?',
      a: 'Positions in search and a number of leads — neither from search nor from advertising. My cases are in development, not in traffic, so a promise about traffic would be a promise with nothing behind it. Advertising is even less predictable: with the setup done right, the result still depends on your market, the season and what your competitor is willing to pay per click. What I can genuinely stand behind is the standard of the work — a setup built the way experience says it works, measurement from day one, no budget spent blind, and every effort on my side to make it right. That part is professionalism, and professionalism I do guarantee.'
    },
    ru: {
      q: 'Чего НЕ обещаю?',
      a: 'Позиций в поиске и количества заявок — ни по поиску, ни по рекламе. Кейсы у меня по разработке, а не по трафику, значит обещание про трафик было бы обещанием, за которым ничего не стоит. С рекламой ещё честнее: даже при верной настройке результат зависит от рынка, сезона и того, сколько за клик готов платить конкурент, — предсказать это нельзя, и любой, кто называет цифру заранее, её придумывает. Что я действительно могу гарантировать — уровень работы: настройку по схеме, которая по опыту работает, измерение с первого дня, отсутствие бюджета, потраченного вслепую, и полную выкладку с моей стороны. Это профессионализм, и вот за него я ручаюсь.'
    }
  }
];
