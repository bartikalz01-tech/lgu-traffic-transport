-- Create traffic_flow table
-- This table was missing from the original SQL dump

CREATE TABLE IF NOT EXISTS `traffic_flow` (
  `traffic_flow_id` int(11) NOT NULL AUTO_INCREMENT,
  `road_id` int(11) DEFAULT NULL,
  `traffic_condition` varchar(50) DEFAULT NULL,
  `start_traffic_time` time DEFAULT NULL,
  `traffic_date` date DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`traffic_flow_id`),
  KEY `road_id` (`road_id`),
  CONSTRAINT `traffic_flow_ibfk_1` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert some sample data (optional)
-- INSERT INTO `traffic_flow` (`road_id`, `traffic_condition`, `start_traffic_time`, `traffic_date`) VALUES
-- (1, 'High Traffic', '08:00:00', '2026-02-11'),
-- (2, 'Moderate Traffic', '09:00:00', '2026-02-11'),
-- (3, 'Low Traffic', '10:00:00', '2026-02-11');
