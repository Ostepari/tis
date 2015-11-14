-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Temy'
-- tabulka tem
-- ---

DROP TABLE IF EXISTS `Temy`;
		
CREATE TABLE `Temy` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `nazov` VARCHAR NULL DEFAULT NULL,
  `dir` VARCHAR NULL DEFAULT NULL,
  `datum` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
KEY ()
) COMMENT 'tabulka tem';

-- ---
-- Table 'Avatar'
-- tabulka avatarov
-- ---

DROP TABLE IF EXISTS `Avatar`;
		
CREATE TABLE `Avatar` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `nazov` VARCHAR NULL DEFAULT NULL,
  `json` MEDIUMTEXT NULL DEFAULT NULL,
  `id_pouzivatel` INTEGER NULL DEFAULT NULL,
  `datum` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'tabulka avatarov';

-- ---
-- Foreign Keys 
-- ---


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Temy` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Avatar` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Temy` (`id`,`nazov`,`dir`,`datum`) VALUES
-- ('','','','');
-- INSERT INTO `Avatar` (`id`,`nazov`,`json`,`id_pouzivatel`,`datum`) VALUES
-- ('','','','','');
