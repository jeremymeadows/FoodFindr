-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `food-truck-finder`;
CREATE DATABASE `food-truck-finder` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `food-truck-finder`;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` varchar(8) NOT NULL,
  `email` varchar(32) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(64) NOT NULL,
  `owner` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `trucks`;
CREATE TABLE `trucks` (
  `truck_id` varchar(8) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` text NOT NULL,
  `ratings` int unsigned DEFAULT 0,
  `rating` float unsigned DEFAULT 0,
  `menu` text DEFAULT NULL,
  `schedule` blob DEFAULT NULL,
  `location` text DEFAULT NULL,
  PRIMARY KEY (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `user_id` varchar(8) NOT NULL,
  `truck_id` varchar(8) NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `truck_id` (`truck_id`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`truck_id`) REFERENCES `trucks` (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `ownerships`;
CREATE TABLE `ownerships` (
  `user_id` varchar(8) NOT NULL,
  `truck_id` varchar(8) NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `truck_id` (`truck_id`),
  CONSTRAINT `ownerships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `ownerships_ibfk_2` FOREIGN KEY (`truck_id`) REFERENCES `trucks` (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `inbox`;
CREATE TABLE `inbox` (
    `recipientID` varchar(8),
    `messageContent` varchar(255),
    `messageRead` bit(1),
    KEY `recipientID` (`recipientID`),
    CONSTRAINT `inbox_ibfk_1` FOREIGN KEY (`recipientID`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `preferences`;
CREATE TABLE `preferences` (
    `userID` varchar(8),
    `price` int DEFAULT NULL,
    `rating` int DEFAULT NULL,
    `type` varchar(20) DEFAULT NULL,
    KEY `userID` (`userID`),
    CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `user_id` varchar(8) NOT NULL,
  `truck_id` varchar(8) NOT NULL,
  `rating` float NOT NULL,
  `body` text,
  KEY `user_id` (`user_id`),
  KEY `truck_id` (`truck_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`truck_id`) REFERENCES `trucks` (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- some dummy truck data
INSERT INTO `trucks` (`truck_id`, `name`, `description`, `ratings`, `rating`, `menu`, `schedule`, `location`) VALUES
('5hfjf', 'Texas Road House on the Road', 'Texas Roadhouse is a legendary steak restaurant serving American cuisine from the best steaks and ribs to made-from-scratch sides & fresh-baked rolls.', 0, 0, 'https://www.texasroadhouse.com/texas-roadhouse-master-menu.pdf', NULL, '31,-97'),
('8fjelsj', 'Mod Pizza GO', 'MOD Pizza is a business, but our real purpose is creating positive social impact in the lives of our employees and their communities. Yes, we make pizza, but our pizza makes people. Our measure for success isn\'t the number of MOD locations - it\'s the number of people employed and their well being.', 0, 0, 'https://modpizza.com/menu/', NULL, NULL),
('cjeks', 'Jimmy John\'s (Freakier and Faster)', 'Enjoy all Jimmy John\'s® has to offer when you order online for delivery or catering or stop by a location near you. Jimmy John\'s® is the ultimate local Sandwich shop with gourmet Sandwiches made from ingredients that are always freaky fresh.', 0, 0, 'https://www.jimmyjohns.com/menu/', NULL, '31.5365676,-97.127043'),
('kjh89', 'Dutch Bros Coffee Shack', 'Dutch Bros Coffee is a privately held drive-through coffee chain headquartered in Grants Pass, Oregon, United States, with company-owned and franchise locations throughout the western United States.', 1, 5, 'https://dutchbros.com/menu/', NULL, NULL);

-- 2020-11-18 5:00
