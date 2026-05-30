## 1. Списки в HTML

Списки используются для структурирования информации на веб‑страницах. Существует три типа списков.

### 1.1. Маркированный список (`<ul>`)

Используется для неупорядоченных данных. Каждый элемент списка оборачивается в тег `<li>`.

**Синтаксис:**
```html
<ul>
  <li>Элемент 1</li>
  <li>Элемент 2</li>
  <li>Элемент 3</li>
</ul>
```

**Пример:**
```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

### 1.2. Нумерованный список (`<ol>`)

Используется для упорядоченных данных — элементы нумеруются автоматически.

**Синтаксис:**
```html
<ol>
  <li>Первый элемент</li>
  <li>Второй элемент</li>
  <li>Третий элемент</li>
</ol>
```

**Атрибуты:**
* `type` — тип нумерации (`1`, `A`, `a`, `I`, `i`);
* `start` — начальное значение нумерации.

**Пример:**
```html
<ol type="A" start="3">
  <li>Третий пункт</li>
  <li>Четвёртый пункт</li>
</ol>
```

### 1.3. Список определений (`<dl>`)

Используется для пар «термин — определение».

**Синтаксис:**
```html
<dl>
  <dt>Термин 1</dt>
  <dd>Определение термина 1</dd>
  <dt>Термин 2</dt>
  <dd>Определение термина 2</dd>
</dl>
```

**Пример:**
```html
<dl>
  <dt>HTML</dt>
  <dd>Язык разметки гипертекста</dd>
  <dt>CSS</dt>
  <dd>Каскадные таблицы стилей</dd>
</dl>
```

---

## 2. Таблицы в HTML

Таблицы используются для отображения данных в структурированном виде (строки и столбцы).

### 2.1. Основные теги

* `<table>` — контейнер таблицы;
* `<tr>` — строка таблицы;
* `<td>` — ячейка данных;
* `<th>` — ячейка заголовка;
* `<thead>` — шапка таблицы;
* `<tbody>` — тело таблицы;
* `<tfoot>` — подвал таблицы;
* `<caption>` — заголовок таблицы.

### 2.2. Пример простой таблицы

```html
<table border="1">
  <caption>Расписание занятий</caption>
  <thead>
    <tr>
      <th>День</th>
      <th>Предмет</th>
      <th>Время</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Понедельник</td>
      <td>Математика</td>
      <td>10:00–11:30</td>
    </tr>
    <tr>
      <td>Вторник</td>
      <td>Физика</td>
      <td>09:00–10:30</td>
    </tr>
  </tbody>
</table>
```

### 2.3. Атрибуты таблиц

* `border` — толщина рамки;
* `colspan` — объединение ячеек по горизонтали;
* `rowspan` — объединение ячеек по вертикали;
* `width`, `height` — размеры таблицы/ячеек.

**Пример объединения ячеек:**
```html
<tr>
  <td rowspan="2">Объединённая ячейка</td>
  <td>Ячейка 1</td>
</tr>
<tr>
  <td>Ячейка 2</td>
</tr>
```

---

## 3. Фреймы (`<frame>`)

Фреймы позволяют разделить окно браузера на несколько областей, каждая из которых отображает отдельную HTML‑страницу.

> **Важно:** фреймы (`frameset`) устарели и не поддерживаются в HTML5. Вместо них рекомендуется использовать `<iframe>`.

### 3.1. Синтаксис фреймов

```html
<frameset cols="25%,75%">
  <frame src="menu.html" name="menu">
  <frame src="content.html" name="content">
</frameset>
```

**Основные атрибуты:**
* `cols` — ширина колонок (в %, px или *);
* `rows` — высота строк;
* `src` — адрес загружаемой страницы;
* `name` — имя фрейма для ссылок.

### 3.2. Ссылки между фреймами

```html
<a href="page.html" target="menu">Открыть в меню</a>
```

---

## 4. Плавающие фреймы (`<iframe>`)

`<iframe>` (inline frame) — современный аналог фреймов, позволяющий встраивать одну веб‑страницу в другую.

### 4.1. Синтаксис

```html
<iframe src="https://example.com" width="600" height="400" title="Пример фрейма"></iframe>
```

### 4.2. Основные атрибуты

* `src` — URL встраиваемой страницы;
* `width`, `height` — размеры фрейма;
* `title` — описание для доступности;
* `sandbox` — ограничения безопасности;
* `loading` — отложенная загрузка (`lazy`).

### 4.3. Примеры использования

**Встраивание карты:**
```html
<iframe
  src="https://maps.google.com/embed?q=Москва"
  width="100%"
  height="300"
  title="Карта Москвы"
></iframe>
```

**Встраивание видео:**
```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  width="560"
  height="315"
  title="Видео на YouTube"
></iframe>
```

---

## 5. Формы в HTML

Формы используются для сбора данных от пользователей.

### 5.1. Базовый синтаксис

```html
<form action="/submit" method="POST">
  <!-- Поля формы -->
  <input type="text" name="username">
  <button type="submit">Отправить</button>
</form>
```

**Основные атрибуты:**
* `action` — URL для отправки данных;
* `method` — метод отправки (`GET` или `POST`).

### 5.2. Типы полей ввода (`<input>`)

| Тип | Описание | Пример |
|------|----------|--------|
| `text` | Текстовое поле | `<input type="text">` |
| `password` | Поле для пароля | `<input type="password">` |
| `email` | Поле для email | `<input type="email">` |
| `number` | Числовое поле | `<input type="number">` |
| `checkbox` | Флажок | `<input type="checkbox">` |
| `radio` | Радиокнопка | `<input type="radio">` |
| `file` | Загрузка файлов | `<input type="file">` |
| `submit` | Кнопка отправки | `<input type="submit">` |

### 5.3. Другие элементы форм

* `<textarea>` — многострочное текстовое поле;
* `<select>` и `<option>` — выпадающий список;
* `<label>` — подпись к полю;
* `<button>` — кнопка.

### 5.4. Пример формы регистрации

```html
<form action="/register" method="POST">
  <label for="name">Имя:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="password">Пароль:</label>
  <input type="password" id="password" name="password" required>

  <label>Пол:</label>
  <input type="radio" id="male" name="gender" value="male">
  <label for="male">Мужской</label>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">Женский</label>

  <label for="interests">Интересы:</label>
  <select id="interests" name="interests" multiple>
    <option value="web">Веб‑разработка</option>
		<option value="c">C++</option>
	</select>
</form>
```
