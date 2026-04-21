-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 21, 2026 at 01:13 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lks_darren`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrators`
--

CREATE TABLE `administrators` (
  `id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `administrators`
--

INSERT INTO `administrators` (`id`, `username`, `password`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 'admin1', '$2y$12$cZRzJxYQRGudX7rYwqBp2ODex6anerTxj47jNzKmc6h5ne4GSxiUW', NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40'),
(2, 'admin2', '$2y$12$T8dP4tM92DwTQ3KBPG2RVedQWJ9BKNdWFPW.6vm3VsRv3P1jAAQl2', NULL, '2024-04-05 08:27:52', '2024-04-05 08:27:52');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `title`, `slug`, `description`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Demo Game 1', 'demo-game-1', 'This is demo game 1', 3, '2024-04-09 08:32:41', '2024-04-09 08:32:41', NULL),
(2, 'Demo Game 2', 'demo-game-2', 'This is demo game 2', 3, '2024-04-09 09:50:36', '2024-04-09 09:50:36', NULL),
(3, 'Demo Game 3', 'demo-game-3', 'This is demo game 3', 3, '2024-04-09 09:45:29', '2024-04-09 09:45:29', NULL),
(4, 'Demo Game 4', 'demo-game-4', 'This is demo game 4', 3, '2024-04-09 10:43:25', '2024-04-09 10:43:25', NULL),
(5, 'Demo Game 5', 'demo-game-5', 'This is demo game 5', 3, '2024-04-09 10:41:21', '2024-04-09 10:41:21', NULL),
(6, 'Demo Game 6', 'demo-game-6', 'This is demo game 6', 3, '2024-04-09 10:39:17', '2024-04-09 10:39:17', NULL),
(7, 'Demo Game 7', 'demo-game-7', 'This is demo game 7', 3, '2024-04-09 10:37:13', '2024-04-09 10:37:13', NULL),
(8, 'Demo Game 8', 'demo-game-8', 'This is demo game 8', 3, '2024-04-09 11:35:09', '2024-04-09 11:35:09', NULL),
(9, 'Demo Game 9', 'demo-game-9', 'This is demo game 9', 3, '2024-04-09 11:33:05', '2024-04-09 11:33:05', NULL),
(10, 'Demo Game 10', 'demo-game-10', 'This is demo game 10', 3, '2024-04-09 11:31:01', '2024-04-09 11:31:01', NULL),
(11, 'Demo Game 11', 'demo-game-11', 'This is demo game 11', 3, '2024-04-09 11:28:57', '2024-04-09 11:28:57', NULL),
(12, 'Demo Game 12', 'demo-game-12', 'This is demo game 12', 3, '2024-04-09 12:26:53', '2024-04-09 12:26:53', NULL),
(13, 'Demo Game 13', 'demo-game-13', 'This is demo game 13', 3, '2024-04-09 12:24:49', '2024-04-09 12:24:49', NULL),
(14, 'Demo Game 14', 'demo-game-14', 'This is demo game 14', 3, '2024-04-09 12:22:45', '2024-04-09 12:22:45', NULL),
(15, 'Demo Game 15', 'demo-game-15', 'This is demo game 15', 3, '2024-04-09 12:20:41', '2024-04-09 12:20:41', NULL),
(16, 'Demo Game 16', 'demo-game-16', 'This is demo game 16', 4, '2024-04-09 13:18:37', '2024-04-09 13:18:37', NULL),
(17, 'Demo Game 17', 'demo-game-17', 'This is demo game 17', 4, '2024-04-09 13:16:33', '2024-04-09 13:16:33', NULL),
(18, 'Demo Game 18', 'demo-game-18', 'This is demo game 18', 4, '2024-04-09 13:14:29', '2024-04-09 13:14:29', NULL),
(19, 'Demo Game 19', 'demo-game-19', 'This is demo game 19', 4, '2024-04-09 13:12:25', '2024-04-09 13:12:25', NULL),
(20, 'Demo Game 20', 'demo-game-20', 'This is demo game 20', 4, '2024-04-09 14:10:21', '2024-04-09 14:10:21', NULL),
(21, 'Demo Game 21', 'demo-game-21', 'This is demo game 21', 4, '2024-04-09 14:08:17', '2024-04-09 14:08:17', NULL),
(22, 'Demo Game 22', 'demo-game-22', 'This is demo game 22', 4, '2024-04-09 14:06:13', '2024-04-09 14:06:13', NULL),
(23, 'Demo Game 23', 'demo-game-23', 'This is demo game 23', 4, '2024-04-09 14:04:09', '2024-04-09 14:04:09', NULL),
(24, 'Demo Game 24', 'demo-game-24', 'This is demo game 24', 4, '2024-04-09 15:02:05', '2024-04-09 15:02:05', NULL),
(25, 'Demo Game 25', 'demo-game-25', 'This is demo game 25', 4, '2024-04-09 15:00:01', '2024-04-09 15:00:01', NULL),
(26, 'Demo Game 26', 'demo-game-26', 'This is demo game 26', 4, '2024-04-09 14:57:57', '2024-04-09 14:57:57', NULL),
(27, 'Demo Game 27', 'demo-game-27', 'This is demo game 27', 4, '2024-04-09 14:55:53', '2024-04-09 14:55:53', NULL),
(28, 'Demo Game 28', 'demo-game-28', 'This is demo game 28', 4, '2024-04-09 15:53:49', '2024-04-09 15:53:49', NULL),
(29, 'Demo Game 29', 'demo-game-29', 'This is demo game 29', 4, '2024-04-09 15:51:45', '2024-04-09 15:51:45', NULL),
(30, 'Demo Game 30', 'demo-game-30', 'This is demo game 30', 4, '2024-04-09 15:49:41', '2024-04-09 15:49:41', NULL),
(31, 'asdasdasd', 'asdasdasd', 'saddsadsa', 11, '2026-04-20 00:59:05', '2026-04-20 00:59:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `game_versions`
--

CREATE TABLE `game_versions` (
  `id` bigint UNSIGNED NOT NULL,
  `game_id` bigint UNSIGNED NOT NULL,
  `version` int NOT NULL,
  `storage_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `game_versions`
--

INSERT INTO `game_versions` (`id`, `game_id`, `version`, `storage_path`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'games/demo-game-1/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(2, 2, 1, 'games/demo-game-2/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(3, 3, 1, 'games/demo-game-3/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(4, 4, 1, 'games/demo-game-4/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(5, 5, 1, 'games/demo-game-5/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(6, 6, 1, 'games/demo-game-6/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(7, 7, 1, 'games/demo-game-7/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(8, 8, 1, 'games/demo-game-8/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(9, 9, 1, 'games/demo-game-9/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(10, 10, 1, 'games/demo-game-10/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(11, 11, 1, 'games/demo-game-11/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(12, 12, 1, 'games/demo-game-12/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(13, 13, 1, 'games/demo-game-13/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(14, 14, 1, 'games/demo-game-14/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(15, 15, 1, 'games/demo-game-15/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(16, 16, 1, 'games/demo-game-16/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(17, 17, 1, 'games/demo-game-17/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(18, 18, 1, 'games/demo-game-18/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(19, 19, 1, 'games/demo-game-19/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(20, 20, 1, 'games/demo-game-20/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(21, 21, 1, 'games/demo-game-21/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(22, 22, 1, 'games/demo-game-22/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(23, 23, 1, 'games/demo-game-23/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(24, 24, 1, 'games/demo-game-24/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(25, 25, 1, 'games/demo-game-25/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(26, 26, 1, 'games/demo-game-26/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(27, 27, 1, 'games/demo-game-27/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(28, 28, 1, 'games/demo-game-28/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(29, 29, 1, 'games/demo-game-29/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(30, 30, 1, 'games/demo-game-30/1', '2024-04-09 08:32:41', '2024-04-09 08:32:41'),
(31, 31, 1, 'games/asdasdasd/1', '2026-04-20 00:59:15', '2026-04-20 00:59:15');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2026_04_19_000001_create_administrators_table', 1),
(4, '2026_04_19_000002_create_users_table', 1),
(5, '2026_04_19_000003_create_personal_access_tokens_table', 1),
(6, '2026_04_19_000004_create_games_table', 1),
(7, '2026_04_19_000005_create_game_versions_table', 1),
(8, '2026_04_19_000006_create_scores_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 11, 'auth_token', '9c4e421703df4c024283f22558958829f4e066536fb3353a5307443626bde3f4', '[\"*\"]', NULL, NULL, '2026-04-20 00:57:45', '2026-04-20 00:57:45');

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `game_version_id` bigint UNSIGNED NOT NULL,
  `score` double NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `user_id`, `game_version_id`, `score`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 10, '2024-04-09 08:35:41', '2024-04-09 08:35:41'),
(2, 1, 1, 15, '2024-04-09 08:36:41', '2024-04-09 08:36:41'),
(3, 1, 2, 12, '2024-04-09 08:54:27', '2024-04-09 08:54:27'),
(4, 2, 2, 20, '2024-04-09 08:55:39', '2024-04-09 08:55:39'),
(5, 2, 3, 30, '2024-04-09 09:53:41', '2024-04-09 09:53:41'),
(6, 3, 2, 1000, '2024-04-09 09:53:41', '2024-04-09 09:53:41'),
(7, 3, 2, -300, '2024-04-09 09:54:41', '2024-04-09 09:54:41'),
(8, 4, 2, 5, '2024-04-09 09:56:41', '2024-04-09 09:56:41'),
(9, 4, 3, 200, '2024-04-09 09:57:41', '2024-04-09 09:57:41'),
(10, 5, 4, 135, '2024-04-09 09:45:38', '2024-04-09 09:45:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `delete_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `last_login_at`, `delete_reason`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'player1', '$2y$12$d7T19pPfgFZmJbUjEOKNl.gzQuQJWSTxwJBMOsdRkA.VrpRbQI4S2', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(2, 'player2', '$2y$12$fdddgFnwTzu3Fnfca7rC.eFfUtaa.OQQYFBo2iau9RQr7avndMemG', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(3, 'dev1', '$2y$12$0aA6L/crdfbKkpwT00MTau1ib0OSbfOPxKfUAZjh1BAF5A6UlkBjy', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(4, 'dev2', '$2y$12$ponLLQVOTifdNFmIeCiOWet7G71dLC9s/bKrj4rkzDYZ0F87/MiFi', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(5, 'player3', '$2y$12$Pbg2pT3lLDPqEg9tXoaRBu80oEvnH3GOyI0hRr7y/1Ra2QSgTYJ5.', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(6, 'player4', '$2y$12$DRrucvu2LCZBe2yH6A.kWewUw4TGTS7X8Egn5AzG.r2S6Ir5d8rN6', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(7, 'player5', '$2y$12$3QpC1j1MkZ6yHSEwjQfS7uakrNCYtPOBVIyxklrxLvRdbxuVb2Ofq', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(8, 'player6', '$2y$12$R4tVmwvXynnM81FlEEootOyy3nxKu0GDUBz8XBUCORUN4UMDiDS2O', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(9, 'player7', '$2y$12$yOGo8HMlUch8xLXpq0R5ouaWsY4nRqhDV9qU7DHRBmRYcJw7gV35G', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(10, 'player8', '$2y$12$B91r3lmumv3hL7PJ4lg8KOBGqOFYfVpWlIm47CM9Xwoivgn7F8oqC', NULL, NULL, '2024-04-05 06:55:40', '2024-04-05 06:55:40', NULL),
(11, 'darren', '$2y$12$6NosLFLY/Y.2jY9ThmAMEuKPmKLFV0B6DksM0KLm1x2TMikpJSB8i', NULL, NULL, '2026-04-20 00:57:45', '2026-04-20 00:57:45', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `administrators_username_unique` (`username`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `games_slug_unique` (`slug`),
  ADD KEY `games_created_by_foreign` (`created_by`);

--
-- Indexes for table `game_versions`
--
ALTER TABLE `game_versions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_versions_game_id_foreign` (`game_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scores_user_id_foreign` (`user_id`),
  ADD KEY `scores_game_version_id_foreign` (`game_version_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administrators`
--
ALTER TABLE `administrators`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `game_versions`
--
ALTER TABLE `game_versions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `game_versions`
--
ALTER TABLE `game_versions`
  ADD CONSTRAINT `game_versions_game_id_foreign` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`);

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_game_version_id_foreign` FOREIGN KEY (`game_version_id`) REFERENCES `game_versions` (`id`),
  ADD CONSTRAINT `scores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
