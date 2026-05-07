# Task Tracker

## 1. Варіант індивідуального завдання

Мій номер у групі (N) - **19** . Тоді:

> V2 = (N % 2) + 1 = (19 % 2) + 1 = 1 + 1 = **2**
>
> V3 = (N % 3) + 1 = (19 % 3) + 1 = 1 + 1 = **2**
>
> V5 = (N % 5) + 1 = (19 % 5) + 1 = 4 + 1 = **5**

Відповідно до цих значень, характеристиками мого проєкту будуть:

**Застосунок (V3):** Назва застосунку незалежно від варіанту — `mywebapp`. Тематика застосунку — `Task Tracker`.

**Спосіб конфігурації (V2):** Конфігураційний файл за шляхом `/etc/mywebapp/config.json`

**Порт застосунку (V5):** `5000`

**База даних (V2):** `PostgreSQL`

---

## 2. Документація веб-застосунку

### Призначення

Task Tracker (mywebapp) — це сервіс для керування задачами. Він дозволяє створювати нові задачі, переглядати список існуючих та позначати їх як виконані. Об'єкт задачі містить поля:

- `id` — унікальний ідентифікатор
- `title` — назва задачі
- `status` — статус (`in progress` або `done`)
- `created_at` — дата створення

### АРІ Ендпоінти

**Бізнес-логіка:**

- **`GET /`** — кореневий ендпоінт, що повертає список усіх ендпоінтів бізнес-логіки у форматі `text/html`.
- **`GET /tasks`** — отримати список усіх задач (id, title, status, created_at). Підтримує Content Negotiation: повертає `text/html` або `application/json` залежно від заголовку `Accept`. Якщо клієнт очікує непідтримуваний формат — повертає HTTP 406 Not Acceptable.
- **`POST /tasks`** — створити нову задачу. Приймає параметр `title` у JSON форматі. Валідація: `title` не може бути порожнім (інакше повертає 400 Bad Request).
- **`POST /tasks/<id>/done`** — змінити статус задачі на `done`. Якщо задача не знайдена — повертає 404 Not Found.

**Перевірка стану (Healthchecks):**

> Ці ендпоінти доступні тільки локально (127.0.0.1:5000) і не проксіюються через Nginx назовні.

- **`GET /health/alive`** — завжди повертає HTTP 200 OK.
- **`GET /health/ready`** — повертає HTTP 200 OK, якщо підключення до БД успішне, інакше HTTP 500.

### Налаштування середовища (для локальної розробки)

Щоб запустити проєкт локально, потрібно виконати наступні кроки:

1. Оновити пакети та встановити Node.js і PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql
   ```
2. Створити користувача та базу даних у PostgreSQL:
   ```bash
   sudo su - postgres -c "psql -c \"CREATE USER task_user WITH PASSWORD 'PassTask1234';\""
   sudo su - postgres -c "psql -c \"CREATE DATABASE task_tracker OWNER task_user;\""
   ```
3. Виконати інсталяцію залежностей у папці проєкту:
   ```bash
   npm install
   ```
4. Створити локальний конфігураційний файл `config.json` та запустити міграцію:
   ```bash
   CONFIG_PATH=./config.json node db/migrate.js
   ```
5. Запустити застосунок:
   ```bash
   CONFIG_PATH=./config.json node server.js
   ```

---

## 3. Документація по розгортанню

### Базовий образ та вимоги до ВМ

**Базовий образ:** Офіційний образ ([Ubuntu Server 24.04.4 LTS](https://ubuntu.com/download/server))


**Вимоги до ресурсів:**

- CPU — 2 ядра
- RAM — 2048 MB
- Disk — 25 GB (Dynamic)

**Мережа:** Налаштувати мережевий адаптер у режимі "Bridged Adapter" (Проміжний адаптер).

**Спеціальні налаштування:** Під час інсталяції ОС вибрати встановлення **OpenSSH Server** для доступу через SSH. Якщо цього не зробили, потрібно встановити його вручну з консолі віртуальної машини:

```bash
sudo apt install -y openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh
```

Щоб підключитися до віртуальної машини з основного комп'ютера, спочатку потрібно дізнатися її IP-адресу:

```bash
ip a
```

Після цього треба підключитися через термінал основної ОС (замініть IP та vboxuser на ваші):

```bash
ssh vboxuser@<IP>
```

### Користувачі системи

У процесі розгортання створюються наступні користувачі:

- **student** — адміністратор проєкту з можливістю ескалації до root (пароль `12345678`).
- **teacher** — користувач для перевірки з адміністративними правами. Пароль за замовчуванням `12345678`, який необхідно змінити при першому вході.
- **operator** — користувач для керування веб-застосунком та nginx через обмежений доступ у sudo. Пароль `12345678` (вимагає зміни при першому вході). Може виконувати тільки команди:
  - `sudo systemctl {start|stop|restart|status} mywebapp.service`
  - `sudo systemctl reload nginx`
- **app** — системний користувач (без права входу) із мінімальними правами, від якого запускається застосунок.

### Systemd та Socket Activation

Веб-застосунок керується через systemd з використанням socket activation. Це означає, що сервіс автоматично запускається при першому запиті до порту 5000 та працює від користувача `app`. Перед запуском виконується міграція бази даних.

### Як запустити автоматизацію

Після підключення до віртуальної машини через SSH потрібно виконати наступні команди:

```bash
# 1. Клонування репозиторію
git clone https://github.com/Sotten8/DevOps_labs

# 2. Перехід до папки репозиторію
cd DevOps_labs

# 3. Надання прав на виконання скриптам
chmod +x setup.sh scripts/*.sh

# 4. Запуск автоматизації (від імені користувача з sudo - у моєму випадку це vboxuser)
sudo ./setup.sh
```

Скрипт автоматично встановить необхідні пакети, створить користувачів, налаштує базу даних, systemd-сервіси, nginx, створить файл `/home/student/gradebook` з номером варіанту (19) та заблокує дефолтного користувача.

---

## 4. Інструкція з тестування розгорнутої системи

### А. Розширена перевірка бізнес-логіки

**1. Перевірка Content Negotiation (успішна):**

```bash
# Отримати HTML (для браузерів)
curl -i -H "Accept: text/html" http://127.0.0.1/tasks

# Отримати JSON (для скриптів)
curl -i -H "Accept: application/json" http://127.0.0.1/tasks
```

**2. Перевірка відмови (406 Not Acceptable):**

```bash
curl -i -H "Accept: application/json" http://127.0.0.1/ # Тільки text/html
curl -i -H "Accept: application/xml" http://127.0.0.1/tasks # Тільки text/html або application/json
```

Очікується: HTTP 406 Not Acceptable.

**3. Створення задачі з валідацією:**

```bash
# Успішне створення
curl -X POST -H "Content-Type: application/json" -d '{"title": "Check logic"}' http://127.0.0.1/tasks

# Спроба створити порожню задачу (має повернути помилку 400)
curl -i -X POST -H "Content-Type: application/json" -d '{"title": ""}' http://127.0.0.1/tasks
```

**4. Робота з існуючими даними:**

```bash
# Зміна статусу на виконано (підставте реальний ID)
curl -i -X POST http://127.0.0.1/tasks/1/done

# Спроба змінити статус неіснуючої задачі (має бути 404)
curl -i -X POST http://127.0.0.1/tasks/9999/done
```

### Б. Перевірка прав та обмежень operator

Зайдіть у систему під оператором: `su - operator`.

**1. Що оператору ДОЗВОЛЕНО (sudo без пароля):**

```bash
# Керування основним сервісом
sudo systemctl restart mywebapp.service
sudo systemctl stop mywebapp.service
sudo systemctl start mywebapp.service
sudo systemctl status mywebapp.service

# Перезавантаження конфігурації Nginx
sudo systemctl reload nginx
```

**2. Що оператору заборонено:**

```bash
# Спроба зупинити Nginx повністю (не reload)
sudo systemctl stop nginx

# Спроба керувати базою даних
sudo systemctl restart postgresql

# Спроба встановити новий софт
sudo apt update

# Спроба прочитати системні паролі
sudo cat /etc/shadow

# Спроба залізти в папку студента
ls -la /home/student/
```

Потрібно повернутися назад до користувача `student`:

```bash
exit
```

### В. Перевірка Socket Activation та системних вимог

**1. Перевірка "пробудження" застосунку:**

```bash
sudo systemctl stop mywebapp.service
curl -s http://127.0.0.1/tasks > /dev/null
systemctl is-active mywebapp.service # Має бути 'active'
```

**2. Перевірка Gradebook:**

```bash
cat /home/student/gradebook # Має повернути 19
```

**3. Перевірка ізоляції Healthchecks:**

```bash
# Ззовні (через 80 порт) - має бути 404
curl -i http://127.0.0.1/health/alive

# Локально (через 5000 порт) - має бути 200 OK
curl -i http://127.0.0.1:5000/health/alive
```
