-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 11, 2026 at 02:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lgu4_traffic_transport`
--

-- --------------------------------------------------------

--
-- Table structure for table `accident_cases`
--

CREATE TABLE `accident_cases` (
  `accident_id` int(11) NOT NULL,
  `officer_id` int(11) DEFAULT NULL,
  `public_accident_id` varchar(35) DEFAULT NULL,
  `status_id` int(11) NOT NULL,
  `road_id` int(11) DEFAULT NULL,
  `accident_type` varchar(255) DEFAULT NULL,
  `accident_description` varchar(255) NOT NULL,
  `status_of_accident` varchar(50) DEFAULT NULL,
  `time_of_accident` time DEFAULT NULL,
  `date_of_accident` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accident_cases`
--

INSERT INTO `accident_cases` (`accident_id`, `officer_id`, `public_accident_id`, `status_id`, `road_id`, `accident_type`, `accident_description`, `status_of_accident`, `time_of_accident`, `date_of_accident`) VALUES
(9, 2, 'ACC-1769863852132', 2, 3, 'single', 'The driver hit a pillar because he is drunk.', 'severe', '20:50:00', '2026-01-31'),
(10, 1, 'ACC-1770026898207', 2, 5, 'collision', 'Two Vehicles Collided', 'severe', '18:08:00', '2026-02-02'),
(11, 3, 'ACC-1770027059167', 2, 3, 'pedestrian', 'TESARAW', 'severe', '18:10:00', '2026-02-02'),
(12, 1, 'ACC-1770027713600', 2, 6, 'property', 'Collided on a building', 'severe', '18:21:00', '2026-02-02'),
(13, NULL, 'ACC-1770027979185', 1, 2, 'property', 'TEST', 'severe', '18:26:00', '2026-02-02'),
(14, NULL, 'ACC-1770602806672', 1, 4, 'collision', 'Collision of vehicles, one is overspeeding.', 'critical', '10:06:00', '2026-02-09'),
(15, NULL, 'ACC-1770690769185', 1, 5, 'collision', 'Collision between two vehicles\n', 'critical', '10:32:00', '2026-02-10'),
(16, NULL, 'ACC-1770693372913', 1, 1, 'pedestrian', 'A car accidentically ran a middle aged man on the dome street', 'severe', '11:16:00', '2026-02-10'),
(18, 3, 'ACC-1770693626000', 2, 1, 'pedestrian', 'Driver accidentically a boy on a dome street', 'severe', '11:20:00', '2026-02-10');

-- --------------------------------------------------------

--
-- Table structure for table `accident_peoples`
--

CREATE TABLE `accident_peoples` (
  `accident_ppl_id` int(11) NOT NULL,
  `accident_id` int(11) DEFAULT NULL,
  `people_id` int(11) DEFAULT NULL,
  `role` varchar(60) DEFAULT NULL,
  `status_level` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accident_peoples`
--

INSERT INTO `accident_peoples` (`accident_ppl_id`, `accident_id`, `people_id`, `role`, `status_level`) VALUES
(8, 9, 8, 'driver', 'serious_injuries'),
(9, 9, 9, 'witness', 'uninjured'),
(10, 10, 10, 'driver', 'serious_injuries'),
(11, 10, 11, 'driver', 'critical'),
(12, 11, 12, 'driver', 'serious_injuries'),
(13, 11, 13, 'driver', 'uninjured'),
(14, 12, 14, 'driver', 'critical'),
(15, 13, 15, 'driver', 'critical'),
(16, 14, 16, 'driver', 'critical'),
(17, 14, 17, 'driver', 'serious_injuries'),
(18, 15, 18, 'driver', 'critical'),
(19, 15, 19, 'driver', 'fatal'),
(20, 16, 20, 'driver', 'uninjured'),
(21, 16, 21, 'pedestrian', 'critical'),
(22, 16, 22, 'witness', 'uninjured'),
(23, 18, 23, 'pedestrian', 'serious_injuries'),
(24, 18, 24, 'driver', 'uninjured');

-- --------------------------------------------------------

--
-- Table structure for table `accident_vehicles`
--

CREATE TABLE `accident_vehicles` (
  `accident_vehicle_id` int(11) NOT NULL,
  `accident_id` int(11) DEFAULT NULL,
  `people_id` int(11) DEFAULT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `damage_level` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accident_vehicles`
--

INSERT INTO `accident_vehicles` (`accident_vehicle_id`, `accident_id`, `people_id`, `vehicle_id`, `damage_level`) VALUES
(4, 9, 8, 4, 'severe'),
(5, 10, 10, 5, 'severe'),
(6, 10, 11, 6, 'severe'),
(7, 11, 13, 7, 'moderate'),
(8, 12, 14, 8, 'severe'),
(9, 13, 15, 9, 'severe'),
(10, 14, 16, 10, 'severe'),
(11, 14, 17, 11, 'moderate'),
(12, 15, 18, 12, 'totaled'),
(13, 15, 19, 13, 'severe'),
(14, 18, 24, 14, 'minor');

-- --------------------------------------------------------

--
-- Table structure for table `officers`
--

CREATE TABLE `officers` (
  `officer_id` int(11) NOT NULL,
  `officer_name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `officers`
--

INSERT INTO `officers` (`officer_id`, `officer_name`) VALUES
(1, 'kamado'),
(2, 'tomioka'),
(3, 'rengoku');

-- --------------------------------------------------------

--
-- Table structure for table `people_involved`
--

CREATE TABLE `people_involved` (
  `people_id` int(11) NOT NULL,
  `full_name` varchar(60) NOT NULL,
  `contact_num` varchar(25) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `people_involved`
--

INSERT INTO `people_involved` (`people_id`, `full_name`, `contact_num`, `address`) VALUES
(8, 'Mikko Cruz', '0921341235', '632 Tagaytay Street'),
(9, 'Mark Joseph C. Morana', '0923464364', '640 Tagaytay Street'),
(10, 'Ezekiel Paulino', '09522351234', 'Example Stereet 124'),
(11, 'Jian Paulino', '09623572123', 'Other USA example street 125'),
(12, 'TEST', '096235325', '632 Tagaytay Street'),
(13, 'Vincent Cruz', 'TEST', 'TEST STREET'),
(14, 'Mikko Cruz', '', '632 Tagaytay Street'),
(15, 'TEST', 'TEST', 'TEST'),
(16, 'Robert Lumactod', '09123456789', 'San Jose Del Monte Bulacan'),
(17, 'Mark Justin Beltran', '09987654321', 'North Caloocan'),
(18, 'Test Example', '09222222222', '89 Test Street Example'),
(19, 'Juan Dela Cruz', '09333333333', 'Quiapo Tondo'),
(20, 'Jason', '0944444444444', '632 Tagaytay Street'),
(21, 'Mikko Cruz', '0921341235', '123 Test Example City'),
(22, 'Cecil Paulino', '09642124643', 'N/A'),
(23, 'Jason Del Rosario', 'N/A', '632 Tagaytay Street'),
(24, 'Mikko Cruz', '0921341235', 'Test nga ehh jusko street');

-- --------------------------------------------------------

--
-- Table structure for table `roads`
--

CREATE TABLE `roads` (
  `road_id` int(11) NOT NULL,
  `road_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roads`
--

INSERT INTO `roads` (`road_id`, `road_name`) VALUES
(1, 'Dome'),
(2, 'Mt. Natib'),
(3, 'Klawit'),
(4, 'Kalandang'),
(5, 'Mauban'),
(6, 'Tagaytay street');

-- --------------------------------------------------------

--
-- Table structure for table `status_of_reports`
--

CREATE TABLE `status_of_reports` (
  `status_id` int(11) NOT NULL,
  `status_definition` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_of_reports`
--

INSERT INTO `status_of_reports` (`status_id`, `status_definition`) VALUES
(1, 'Open Case'),
(2, 'Under Investigation'),
(3, 'Resolved');

-- --------------------------------------------------------

--
-- Table structure for table `traffic_flow`
--
-- Error reading structure for table lgu4_traffic_transport.traffic_flow: #1932 - Table &#039;lgu4_traffic_transport.traffic_flow&#039; doesn&#039;t exist in engine
-- Error reading data for table lgu4_traffic_transport.traffic_flow: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `lgu4_traffic_transport`.`traffic_flow`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_reported`
--

CREATE TABLE `vehicle_reported` (
  `vehicle_id` int(11) NOT NULL,
  `vehicle_name` varchar(60) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `plate_number` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle_reported`
--

INSERT INTO `vehicle_reported` (`vehicle_id`, `vehicle_name`, `vehicle_type`, `plate_number`) VALUES
(4, 'Lambogini', '', '21ws51'),
(5, 'Honda Click Motor', '', '21ws51'),
(6, 'Lambogini', '', '512av21'),
(7, 'HONDA PCX', '', 'ABC091'),
(8, 'Ferarri', '', '21ws51'),
(9, 'Honda', '', 'smaoa12'),
(10, 'Aerox', 'private', 'GHF-G132'),
(11, 'Honda', 'private', 'KHO-O212'),
(12, 'Toyota everest', 'private', 'ORW-0163'),
(13, 'Jeepney', 'public', 'KTE-1516s'),
(14, 'Lambogini', 'private', '21ws51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accident_cases`
--
ALTER TABLE `accident_cases`
  ADD PRIMARY KEY (`accident_id`),
  ADD UNIQUE KEY `public_accident_id` (`public_accident_id`),
  ADD UNIQUE KEY `public_accident_id_2` (`public_accident_id`),
  ADD KEY `road_id` (`road_id`),
  ADD KEY `fk_accident_officer` (`officer_id`),
  ADD KEY `fk_accident_status` (`status_id`);

--
-- Indexes for table `accident_peoples`
--
ALTER TABLE `accident_peoples`
  ADD PRIMARY KEY (`accident_ppl_id`),
  ADD KEY `fk_accident_people` (`accident_id`),
  ADD KEY `fk_people_involved` (`people_id`);

--
-- Indexes for table `accident_vehicles`
--
ALTER TABLE `accident_vehicles`
  ADD PRIMARY KEY (`accident_vehicle_id`),
  ADD KEY `fk_vehicle_accident_id` (`accident_id`),
  ADD KEY `fk_vehicle_accident_people_id` (`people_id`),
  ADD KEY `fk_vehicle_accident` (`vehicle_id`);

--
-- Indexes for table `officers`
--
ALTER TABLE `officers`
  ADD PRIMARY KEY (`officer_id`);

--
-- Indexes for table `people_involved`
--
ALTER TABLE `people_involved`
  ADD PRIMARY KEY (`people_id`);

--
-- Indexes for table `roads`
--
ALTER TABLE `roads`
  ADD PRIMARY KEY (`road_id`);

--
-- Indexes for table `status_of_reports`
--
ALTER TABLE `status_of_reports`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `vehicle_reported`
--
ALTER TABLE `vehicle_reported`
  ADD PRIMARY KEY (`vehicle_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accident_cases`
--
ALTER TABLE `accident_cases`
  MODIFY `accident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `accident_peoples`
--
ALTER TABLE `accident_peoples`
  MODIFY `accident_ppl_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `accident_vehicles`
--
ALTER TABLE `accident_vehicles`
  MODIFY `accident_vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `officers`
--
ALTER TABLE `officers`
  MODIFY `officer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `people_involved`
--
ALTER TABLE `people_involved`
  MODIFY `people_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `roads`
--
ALTER TABLE `roads`
  MODIFY `road_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `status_of_reports`
--
ALTER TABLE `status_of_reports`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `vehicle_reported`
--
ALTER TABLE `vehicle_reported`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accident_cases`
--
ALTER TABLE `accident_cases`
  ADD CONSTRAINT `accident_cases_ibfk_1` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`),
  ADD CONSTRAINT `fk_accident_officer` FOREIGN KEY (`officer_id`) REFERENCES `officers` (`officer_id`),
  ADD CONSTRAINT `fk_accident_status` FOREIGN KEY (`status_id`) REFERENCES `status_of_reports` (`status_id`);

--
-- Constraints for table `accident_peoples`
--
ALTER TABLE `accident_peoples`
  ADD CONSTRAINT `fk_accident_people` FOREIGN KEY (`accident_id`) REFERENCES `accident_cases` (`accident_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_people_involved` FOREIGN KEY (`people_id`) REFERENCES `people_involved` (`people_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `accident_vehicles`
--
ALTER TABLE `accident_vehicles`
  ADD CONSTRAINT `fk_vehicle_accident` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle_reported` (`vehicle_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vehicle_accident_id` FOREIGN KEY (`accident_id`) REFERENCES `accident_cases` (`accident_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vehicle_accident_people_id` FOREIGN KEY (`people_id`) REFERENCES `people_involved` (`people_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
