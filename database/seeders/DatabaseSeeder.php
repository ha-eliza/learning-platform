<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Material;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Сидоров Сергей Алексеевич',
            'department' => 'Информационные системы и среды',
            'login' => 'teacher2026',
            'password' => '12345678',
            'role' => 'teacher',
        ]);
        User::create([
            'name' => 'Иванова Анна Сергеевна',
            'department' => 'Дизайн',
            'login' => 'teacher2026_2',
            'password' => '12345678',
            'role' => 'teacher',
        ]);
        User::create([
            'name' => 'Харитонова Елизавета Аркадьевна',
            'group' => 'ИС-3-22',
            'login' => 'student2026',
            'password' => '12345678',
        ]);
        User::create([
            'name' => 'Петров Петр Алексеевич',
            'group' => 'ИС-1-22',
            'login' => 'student2026_2',
            'password' => '12345678',
        ]);

        Category::create([
            'id' => 1,
            'name' => 'ОСНОВЫ WEB-ТЕХНОЛОГИЙ'
        ]);
        Category::create([
            'id' => 2,
            'name' => 'WEB-ДИЗАЙН'
        ]);

        $title1 = 'Введение. Язык разметки HTML. Синтаксис HTML';
        Material::create([
            'title' => $title1,
            'url' => Str::slug($title1),
            'content' => File::get(database_path('seeders/markdown/manual1.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['html', 'введение'],
        ]);
        $title3 = 'Практическое занятие № 1. Составление технического задания на разработку web-сайта';
        Material::create([
            'title' => $title3,
            'url' => Str::slug($title3),
            'content' => File::get(database_path('seeders/markdown/practic1.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['тз'],
        ]);
        $title2 = 'Гиперссылки. Использование изображений на странице. Форматирование текста и фона';
        Material::create([
            'title' => $title2,
            'url' => Str::slug($title2),
            'content' => File::get(database_path('seeders/markdown/manual2.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['html', 'a', 'img', 'bg', 'text'],
        ]);
        $title20 = 'Практическое занятие № 2. Применение тегов HTML при создании web-страниц';
        Material::create([
            'title' => $title20,
            'url' => Str::slug($title20),
            'content' => File::get(database_path('seeders/markdown/practic2.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['html'],
        ]);
        $title4 = 'Списки. Таблицы. Фреймы, плавающие фреймы, формы';
        Material::create([
            'title' => $title4,
            'url' => Str::slug($title4),
            'content' => File::get(database_path('seeders/markdown/manual3.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['list', 'html', 'table', 'фреймы', 'form'],
        ]);
        $title21 = 'Практическое занятие № 3. Создание формы на html-странице';
        Material::create([
            'title' => $title21,
            'url' => Str::slug($title21),
            'content' => File::get(database_path('seeders/markdown/practic3.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['html', 'form'],
        ]);
        $title5 = 'Каскадные таблицы стилей (CSS). Использование стилей при создании сайта';
        Material::create([
            'title' => $title5,
            'url' => Str::slug($title5),
            'content' => File::get(database_path('seeders/markdown/manual4.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['css'],
        ]);
        $title22 = 'Практическое занятие № 4. Форматирование web-страниц с использованием каскадных таблиц стилей';
        Material::create([
            'title' => $title22,
            'url' => Str::slug($title22),
            'content' => File::get(database_path('seeders/markdown/practic4.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['css'],
        ]);
        $title6 = 'Веб-стандарты и их поддержка. Элементы и атрибуты HTML5 и структура страницы';
        Material::create([
            'title' => $title6,
            'url' => Str::slug($title6),
            'content' => File::get(database_path('seeders/markdown/manual5.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['html', 'структура', 'веб-стандарты'],
        ]);
        $title23 = 'Практическое занятие № 5. Градиент CSS3, трансформация, анимация и переходы';
        Material::create([
            'title' => $title23,
            'url' => Str::slug($title23),
            'content' => File::get(database_path('seeders/markdown/practic5.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['css', 'animation'],
        ]);
        $title7 = 'Селекторы в HTML5';
        Material::create([
            'title' => $title7,
            'url' => Str::slug($title7),
            'content' => File::get(database_path('seeders/markdown/manual6.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['html', 'селекторы'],
        ]);
        $title24 = 'Практическое занятие № 6. Двухколоночная и Трехколоночная верстка сайтов';
        Material::create([
            'title' => $title24,
            'url' => Str::slug($title24),
            'content' => File::get(database_path('seeders/markdown/practic6.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['css', 'flex'],
        ]);
        $title13 = 'WEB-дизайн. Способности необходимые web-дизайнеру. Специализация в web-дизайне. Юзабилити ';
        Material::create([
            'title' => $title13,
            'url' => Str::slug($title13),
            'content' => File::get(database_path('seeders/markdown/manual12.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['юзабилити'],
        ]);
        $title25 = 'Практическое занятие № 9. Разработка эскизов веб-приложения';
        Material::create([
            'title' => $title25,
            'url' => Str::slug($title25),
            'content' => File::get(database_path('seeders/markdown/practic9.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['figma'],
        ]);
        $title8 = 'Использование свойств CSS2 и CSS3';
        Material::create([
            'title' => $title8,
            'url' => Str::slug($title8),
            'content' => File::get(database_path('seeders/markdown/manual7.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['css', 'css2', 'css3'],
        ]);
        $title14 = 'Основные этапы разработки сайта. Техническое задание. Файловая структура сайта. Два типа графики на web-сайтах. Имена файлов';
        Material::create([
            'title' => $title14,
            'url' => Str::slug($title14),
            'content' => File::get(database_path('seeders/markdown/manual13.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['жц', 'тз', 'графика'],
        ]);
        $title28 = 'Практическое занятие № 10. Составление брифа на разработку веб-сайта ';
        Material::create([
            'title' => $title28,
            'url' => Str::slug($title28),
            'content' => File::get(database_path('seeders/markdown/practic10.md')),
            'user_id' => 2,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['бриф'],
        ]);
        $title15 = 'Концептуальное, логическое и физическое проектирование сайта. Цвет в дизайне. Фоновые цвета. Цветовой круг. Модели цвета';
        Material::create([
            'title' => $title15,
            'url' => Str::slug($title15),
            'content' => File::get(database_path('seeders/markdown/manual14.md')),
            'user_id' => 2,
            'category_id' => 2,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['цвет', 'модели цвета', 'цветовой круг'],
        ]);
        $title29 = 'Практическое занятие № 11. Комплексное проектирование веб-приложения: от жизненного цикла до интерактивного прототипа';
        Material::create([
            'title' => $title29,
            'url' => Str::slug($title29),
            'content' => File::get(database_path('seeders/markdown/practic11.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['жц', 'прототип'],
        ]);
        $title9 = 'Вёрстка страниц веб-сайта';
        Material::create([
            'title' => $title9,
            'url' => Str::slug($title9),
            'content' => File::get(database_path('seeders/markdown/manual8.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['html'],
        ]);
        $title26 = 'Практическое занятие № 7. Вёрстка';
        Material::create([
            'title' => $title26,
            'url' => Str::slug($title26),
            'content' => File::get(database_path('seeders/markdown/practic7.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['css', 'html'],
        ]);
        $title16 = 'Взаимодействие пользователя с сайтом. Вопросы разработки интерфейса';
        Material::create([
            'title' => $title16,
            'url' => Str::slug($title16),
            'content' => File::get(database_path('seeders/markdown/manual15.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['UI'],
        ]);
        $title30 = 'Практическое занятие № 12. Применение CSS3 flexbox';
        Material::create([
            'title' => $title30,
            'url' => Str::slug($title30),
            'content' => File::get(database_path('seeders/markdown/practic12.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['flex', 'css'],
        ]);
        $title10 = 'CSS-фреймворки. Динамический CSS (на примере LESS). Шаблоны CMS. Типовые решения';
        Material::create([
            'title' => $title10,
            'url' => Str::slug($title10),
            'content' => File::get(database_path('seeders/markdown/manual9.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['css', 'less', 'cms'],
        ]);
        $title31 = 'Практическое занятие № 13. Применение CSS3 Grid Layout';
        Material::create([
            'title' => $title31,
            'url' => Str::slug($title31),
            'content' => File::get(database_path('seeders/markdown/practic13.md')),
            'user_id' => 2,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['grid', 'css'],
        ]);
        $title17 = 'Визуализация элементов интерфейса';
        Material::create([
            'title' => $title17,
            'url' => Str::slug($title17),
            'content' => File::get(database_path('seeders/markdown/manual16.md')),
            'user_id' => 2,
            'category_id' => 2,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['UI'],
        ]);
        $title32 = 'Практическое занятие № 14. Применение CSS-фреймворки. Bootstrap 4';
        Material::create([
            'title' => $title32,
            'url' => Str::slug($title32),
            'content' => File::get(database_path('seeders/markdown/practic14.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['bootstrap'],
        ]);
        $title11 = 'Размещение сайта на сервере и поддержка сайта ';
        Material::create([
            'title' => $title11,
            'url' => Str::slug($title11),
            'content' => File::get(database_path('seeders/markdown/manual10.md')),
            'user_id' => 1,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['хостин', 'seo'],
        ]);
        $title33 = 'Практическое занятие № 15. Динамический CSS. LESS';
        Material::create([
            'title' => $title33,
            'url' => Str::slug($title33),
            'content' => File::get(database_path('seeders/markdown/practic15.md')),
            'user_id' => 2,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['css', 'less'],
        ]);
        $title18 = 'Юзабилити web-сайтов и приложений для мобильных устройств';
        Material::create([
            'title' => $title18,
            'url' => Str::slug($title18),
            'content' => File::get(database_path('seeders/markdown/manual17.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['юзабилити'],
        ]);
        $title12 = 'Язык сценариев JavaScript';
        Material::create([
            'title' => $title12,
            'url' => Str::slug($title12),
            'content' => File::get(database_path('seeders/markdown/manual11.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['javascript'],
        ]);
        $title35 = 'Практическое занятие № 17. Комплексная адаптация веб-страниц под мобильные устройства (планшеты и смартфоны)';
        Material::create([
            'title' => $title35,
            'url' => Str::slug($title35),
            'content' => File::get(database_path('seeders/markdown/practic17.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['media', 'css'],
        ]);
        $title27 = 'Практическое занятие № 8. Использование языка сценариев JavaScript при создании web-сайта';
        Material::create([
            'title' => $title27,
            'url' => Str::slug($title27),
            'content' => File::get(database_path('seeders/markdown/practic8.md')),
            'user_id' => 2,
            'category_id' => 1,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['js', 'баннер'],
        ]);
        $title19 = 'Аудит юзабилити web-сайта, тестирование и документирование';
        Material::create([
            'title' => $title19,
            'url' => Str::slug($title19),
            'content' => File::get(database_path('seeders/markdown/manual18.md')),
            'user_id' => 2,
            'category_id' => 2,
            'type' => 'manual',
            'is_published' => true,
            'tags' => ['юзабилити', 'тестирование', 'аудит'],
        ]);
        $title34 = 'Практическое занятие № 16. Аудит юзабилити web-сайта, тестирование и документирование';
        Material::create([
            'title' => $title34,
            'url' => Str::slug($title34),
            'content' => File::get(database_path('seeders/markdown/practic16.md')),
            'user_id' => 1,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['аудит', 'тестирование'],
        ]);
        $title36 = 'Практическое занятие № 18. Размещение сайта на сервере и поддержка сайта';
        Material::create([
            'title' => $title36,
            'url' => Str::slug($title36),
            'content' => File::get(database_path('seeders/markdown/practic18.md')),
            'user_id' => 2,
            'category_id' => 2,
            'type' => 'practic',
            'is_published' => true,
            'tags' => ['хостинг'],
        ]);
    }
}
