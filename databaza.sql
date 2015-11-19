-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Temy's
-- tabulka tem
-- ---

DROP TABLE IF EXISTS `Temy`;
		
CREATE TABLE `Temy` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `nazov` VARCHAR NULL DEFAULT NULL,
  `dir` VARCHAR NULL DEFAULT NULL,
  `datum` TIMESTAMP NULL DEFAULT NULL,
  `id_Objekt` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'tabulka tem';

-- ---
-- Table 'Avatar'
-- tabulka Avatarov
-- ---

DROP TABLE IF EXISTS `Avatar`;
		
CREATE TABLE `Avatar` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `nazov` VARCHAR NULL DEFAULT NULL,
  `json` MEDIUMTEXT NULL DEFAULT NULL,
  `id_pouzivatel` INTEGER NULL DEFAULT NULL,
  `datum` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'tabulka Avatarov';

-- ---
-- Table 'Objekt'
-- tabulka objektov
-- ---

DROP TABLE IF EXISTS `Objekt`;
		
CREATE TABLE `Objekt` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `id_temy` INTEGER NULL DEFAULT NULL,
  `dir` VARCHAR NULL DEFAULT NULL,
  `datum` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'tabulka objektov';

-- ---
-- Foreign Keys 
-- ---


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Temy` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Avatar` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Objekt` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Temy` (`id`,`nazov`,`dir`,`datum`,`id_Objekt`) VALUES
-- ('','','','','');
-- INSERT INTO `Avatar` (`id`,`nazov`,`json`,`id_pouzivatel`,`datum`) VALUES
-- ('','','','','');
-- INSERT INTO `Objekt` (`id`,`id_temy`,`dir`,`datum`) VALUES
-- ('','','','');
