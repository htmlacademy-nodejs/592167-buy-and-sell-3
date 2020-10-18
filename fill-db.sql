-- Добавляет типы объявлений
insert into "Types" values (default, 'Купить'),
                         (default, 'Продать');

-- Добавляет пользователей
insert into "Users" values (default, 'Иванов', 'Иван', 'my@mail.ru', '123455'),
                         (default, 'Петров', 'Петр', 'petrov@gmail.com', '34523'),
                         (default, 'Сидоров', 'Илья', 'sidorov.iliya@yahoo.com', 'I8e#8d');

-- Добавляет категории
insert into "Categories" values (default, 'Разное'),
                              (default, 'Журналы'),
                              (default, 'Программирование'),
                              (default, 'Психология'),
                              (default, 'Искусство');

-- Добавляет объявления
insert into "Announcements" values (
      default,
      '10/5/2020, 8:22:59 PM',
      'Продам книги Стивена Кинга.',
      'Не пытайтесь торговаться. Цену вещам я знаю. ',
      16567,
      1,
      1);

-- Добавляет связи между объявлениями и категориями
insert into "AnnouncementsToCategories" values (1, 1);

-- Добавляет картинки
insert into "Images" values (default, 1, 'image1');

-- Добавляет комментарии
insert into "Comments" values (default, '9/30/2020, 8:22:59 PM', 1, 2, 'comment text1');
