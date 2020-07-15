-- Создание схемы базы

-- Удаляет базу BUY_AND_SELL, если она существует
DROP DATABASE IF EXISTS BUY_AND_SELL;

-- Если нет пользователя user_buy_and_sell, то добавляет его
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
      WHERE  rolname = 'user_buy_and_sell') THEN

      CREATE ROLE user_buy_and_sell LOGIN PASSWORD '@User123';
   END IF;
END
$do$;

-- Создает базу BUY_AND_SELL
CREATE DATABASE BUY_AND_SELL WITH OWNER user_buy_and_sell;

\c buy_and_sell user_buy_and_sell;

--Создает таблицу types
CREATE TABLE types (
    id bigserial PRIMARY KEY NOT NULL,
    type VARCHAR(50) NOT NULL
);
ALTER TABLE types OWNER TO user_buy_and_sell;

--Создает таблицу categories
CREATE TABLE categories (
    id bigserial PRIMARY KEY NOT NULL,
    category VARCHAR(50) NOT NULL
);
ALTER TABLE categories OWNER TO user_buy_and_sell;

-- Создает таблицу users
CREATE TABLE users (
    id bigserial PRIMARY KEY NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(50) NOT NULL
);
ALTER TABLE users OWNER TO user_buy_and_sell;
CREATE UNIQUE INDEX email_idx ON users (email);

-- Создает таблицу announcements
CREATE TABLE announcements (
    id bigserial PRIMARY KEY NOT NULL,
    regdate date NOT NULL,
    title varchar(100) NOT NULL,
    description varchar(1000) NOT NULL,
    sum INTEGER NOT NULL,
    type_id INTEGER NOT NULL REFERENCES types,
    user_id INTEGER NOT NULL REFERENCES users
);
ALTER TABLE announcements OWNER TO user_buy_and_sell;

--Создает таблицу images
CREATE TABLE images (
    id bigserial PRIMARY KEY NOT NULL,
    announcement_id INTEGER NOT NULL REFERENCES announcements,
    image text NOT NULL
);
ALTER TABLE images OWNER TO user_buy_and_sell;

 --Создает таблицу comments
 CREATE TABLE comments (
    id bigserial PRIMARY KEY NOT NULL,
    regdate date NOT NULL,
    announcement_id INTEGER NOT NULL REFERENCES announcements,
    user_id INTEGER NOT NULL REFERENCES users,
    comment text NOT NULL
 );
ALTER TABLE comments OWNER TO user_buy_and_sell;

--Создает таблицу announcements_to_categories
CREATE TABLE announcements_to_categories (
    announcement_id INTEGER NOT NULL REFERENCES announcements,
    category_id INTEGER NOT NULL REFERENCES categories,
    PRIMARY KEY (announcement_id, category_id)
);
ALTER TABLE announcements_to_categories OWNER TO user_buy_and_sell;
