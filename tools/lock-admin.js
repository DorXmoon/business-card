/* ============================================================================
   lock-admin.js — запирает редактор портфолио паролем.
   ----------------------------------------------------------------------------
   Запуск:  node tools/lock-admin.js
   Спросит пароль (ввод не отображается), зашифрует admin.html и положит
   шифротекст в studio.data. На сайт уезжает ТОЛЬКО шифротекст: сам admin.html
   остаётся локальным (он в .gitignore).

   ЧЕСТНО О ЗАЩИТЕ. Статический хостинг не умеет проверять пароль — сервера,
   который сказал бы «нет», там нет. Поэтому пароль здесь не «проверяется», а
   служит КЛЮЧОМ: без него файл невозможно расшифровать, в нём лежит шум.
   Это настоящая криптография (AES-256-GCM, ключ из пароля через PBKDF2,
   310 000 итераций SHA-256), а не «if (пароль === '1234')», который любой
   прочитает в исходнике страницы.
   Чего она НЕ может: помешать скачать studio.data и подбирать пароль офлайн,
   сколько угодно долго. Отсюда единственное требование — пароль длинный.
   Короткий словарный подберут, каким бы стойким ни был шифр.

   ПОСЛЕ ЗАПУСКА:  git add studio.data && git commit && git push
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'admin.html');
const OUT = path.join(ROOT, 'studio.data');
const ITER = 310000;

if (!fs.existsSync(SRC)) {
  console.error('Не нашёл admin.html рядом со скриптом. Запускать из папки сайта:');
  console.error('  node tools/lock-admin.js');
  process.exit(1);
}

/* Пароль читаем без эха: иначе он остаётся на экране и в истории терминала */
function askPassword(prompt) {
  return new Promise(function (resolve) {
    const stdin = process.stdin;
    process.stdout.write(prompt);
    const wasRaw = stdin.isRaw;
    if (stdin.setRawMode) stdin.setRawMode(true);
    stdin.resume();
    let buf = '';
    const onData = function (chunk) {
      const s = String(chunk);
      const code = s.charCodeAt(0);
      if (s === '\n' || s === '\r' || code === 4) {          // Enter или Ctrl+D
        if (stdin.setRawMode) stdin.setRawMode(wasRaw || false);
        stdin.removeListener('data', onData);
        stdin.pause();
        process.stdout.write('\n');
        resolve(buf);
      } else if (code === 3) {                                // Ctrl+C
        process.stdout.write('\n');
        process.exit(1);
      } else if (code === 127 || code === 8) {                // Backspace
        buf = buf.slice(0, -1);
      } else {
        buf += s;
      }
    };
    stdin.on('data', onData);
  });
}

(async function () {
  const pass = await askPassword('Пароль для входа в редактор: ');
  if (pass.length < 12) {
    console.error('\nПароль короче 12 знаков. Здесь это важнее обычного: подбор идёт');
    console.error('офлайн, по скачанному файлу, и остановить его некому.');
    process.exit(1);
  }
  const again = await askPassword('Повторите пароль: ');
  if (pass !== again) { console.error('\nПароли не совпали.'); process.exit(1); }

  const html = fs.readFileSync(SRC);
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(pass, salt, ITER, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(html), cipher.final()]);
  const tag = cipher.getAuthTag();

  fs.writeFileSync(OUT, JSON.stringify({
    v: 1, alg: 'AES-GCM', hash: 'SHA-256', iter: ITER,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    /* WebCrypto ждёт тег аутентификации в хвосте шифротекста */
    data: Buffer.concat([ct, tag]).toString('base64')
  }));

  console.log('\nГотово: studio.data (' + (fs.statSync(OUT).size / 1024).toFixed(0) +
              ' КБ), исходник ' + (html.length / 1024).toFixed(0) + ' КБ.');
  console.log('Дальше:  git add studio.data && git commit -m "редактор" && git push');
  console.log('Адрес на сайте: /studio.html');
})();
