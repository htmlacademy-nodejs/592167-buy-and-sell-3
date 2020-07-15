-- Получить список всех категорий (идентификатор, наименование категории);
select * from categories;

-- Получить список категорий для которых создано минимум одно объявление
-- (идентификатор, наименование категории);
select distinct c.id, c.category
from announcements_to_categories ac left join categories c
on ac.category_id=c.id
order by c.id;

-- Получить список категорий с количеством объявлений
-- (идентификатор, наименование категории, количество объявлений в категории)
select c.id, c.category, count(ac.announcement_id) as announcements
from announcements_to_categories ac, categories c
where ac.category_id=c.id
group by c.id, c.category
order by c.id;

-- Получить список объявлений
-- (идентификатор объявления, заголовок объявления, стоимость,
-- тип объявления, текст объявления, дата публикации, имя и фамилия автора,
-- контактный email, количество комментариев, наименование категорий).
-- Сначала свежие объявления;
select a.id, a.title, a.sum, t.type, a.description, a.regdate,
       concat(u.last_name, ' ', u.first_name) as "user", u.email,
       count(cm.announcement_id) as comments,
       string_agg(c.category, ', ') as categories
from announcements_to_categories ac
left join announcements a
    on ac.announcement_id = a.id
left join comments cm
          on a.id = cm.announcement_id
left join types t
    on a.type_id = t.id
left join categories c
    on ac.category_id = c.id
left join users u
    on a.user_id = u.id
group by a.id, a.title, a.sum, t.type, a.description, a.regdate,
         u.last_name, u.first_name, u.email
order by a.regdate desc;

-- Получить полную информацию определённого объявления
-- (идентификатор объявления, заголовок объявления, стоимость, тип объявления,
-- текст объявления, дата публикации, имя и фамилия автора, контактный email,
-- количество комментариев, наименование категорий)
select a.id, a.title, a.sum, t.type, a.description, a.regdate,
       concat(u.last_name, ' ', u.first_name) as "user", u.email,
       count(cm.announcement_id) as comments,
       string_agg(c.category, ', ') as categories
from announcements_to_categories ac
         left join announcements a
                   on ac.announcement_id = a.id and a.id = 3
         left join comments cm
                   on a.id = cm.announcement_id
         left join types t
                   on a.type_id = t.id
         left join categories c
                   on ac.category_id = c.id
         left join users u
                   on a.user_id = u.id
group by a.id, a.title, a.sum, t.type, a.description, a.regdate,
         u.last_name, u.first_name, u.email;

-- Получить список из 5 свежих комментариев
-- (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария)
select c.id, c.announcement_id, concat(u.last_name, ' ', u.first_name) as "user", c.comment
from comments c, users u
where c.user_id=u.id
group by c.id, c.regdate, c.announcement_id, u.last_name, u.first_name
order by c.regdate desc
limit 5


-- Получить список комментариев для определённого объявления
-- (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария).
-- Сначала новые комментарии;
select c.id, c.announcement_id, concat(u.last_name, ' ', u.first_name) as "user", c.comment
from comments c, users u
where c.user_id=u.id and c.announcement_id=2
group by c.id, c.regdate, c.announcement_id, u.last_name, u.first_name
order by c.regdate desc

-- Выбрать 2 объявления, соответствующих типу «куплю»;
select *
from announcements
where type_id=1
limit 2

-- Обновить заголовок определённого объявления на «Уникальное предложение!»;
update announcements set title='Уникальное предложение!' where id=1
