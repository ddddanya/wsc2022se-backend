-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Апр 07 2024 г., 13:04
-- Версия сервера: 10.4.28-MariaDB
-- Версия PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `modules`
--

-- --------------------------------------------------------

--
-- Структура таблицы `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`, `created_at`, `last_login`) VALUES
(1, 'admin1', 'hellouniverse1!', '2024-03-30 19:14:36', '2024-03-30 19:14:36'),
(2, 'admin2', 'hellouniverse2!', '2024-03-30 19:14:54', '2024-03-30 19:14:54');

-- --------------------------------------------------------

--
-- Структура таблицы `app_users`
--

CREATE TABLE `app_users` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `blocked` text NOT NULL DEFAULT 'false',
  `last_login` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `app_users`
--

INSERT INTO `app_users` (`id`, `username`, `password`, `blocked`, `last_login`, `created_at`) VALUES
(1, 'player1', 'helloworld1!', 'true', '2024-03-31 18:53:14', '2024-03-31 18:56:59'),
(2, 'player2', 'helloworld2!', 'false', '2024-03-31 18:53:14', '2024-03-31 18:56:59'),
(10, 'dev1', 'hellobyte1!', 'false', '2024-03-31 18:53:14', '2024-03-31 18:56:59'),
(11, 'dev2', 'hellobyte2!', 'false', '2024-03-31 18:53:14', '2024-03-31 18:56:59');

-- --------------------------------------------------------

--
-- Структура таблицы `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `description` text NOT NULL DEFAULT '',
  `ownerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `games`
--

INSERT INTO `games` (`id`, `title`, `slug`, `description`, `ownerId`) VALUES
(1, 'Demo Game 1', 'demo-game-1', 'This is demo game 1', 10),
(2, 'Demo Game 2', 'demo-game-2', 'This is demo game 2', 11);

-- --------------------------------------------------------

--
-- Структура таблицы `games_scores`
--

CREATE TABLE `games_scores` (
  `id` int(11) NOT NULL,
  `gameId` int(11) NOT NULL,
  `versionId` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `games_scores`
--

INSERT INTO `games_scores` (`id`, `gameId`, `versionId`, `score`, `userId`) VALUES
(1, 1, 1, 10, 1),
(2, 1, 1, 15, 1),
(3, 1, 2, 12, 1),
(4, 1, 2, 20, 2),
(5, 2, 1, 30, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `games_versions`
--

CREATE TABLE `games_versions` (
  `id` int(11) NOT NULL,
  `gameId` int(11) NOT NULL,
  `versionId` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `games_versions`
--

INSERT INTO `games_versions` (`id`, `gameId`, `versionId`, `timestamp`) VALUES
(1, 1, 1, '2024-02-08 18:05:43'),
(2, 1, 2, '2024-03-31 18:05:43'),
(3, 2, 1, '2024-03-09 18:05:43');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `app_users`
--
ALTER TABLE `app_users`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `games_scores`
--
ALTER TABLE `games_scores`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `games_versions`
--
ALTER TABLE `games_versions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `app_users`
--
ALTER TABLE `app_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `games_scores`
--
ALTER TABLE `games_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `games_versions`
--
ALTER TABLE `games_versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
