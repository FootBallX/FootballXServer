CREATE DATABASE  IF NOT EXISTS `footballxdb` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `FootBallXDB`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: 127.0.0.1    Database: FootBallXDB
-- ------------------------------------------------------
-- Server version	5.1.63

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Cards`
--

DROP TABLE IF EXISTS `Cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cards` (
  `idCards` int(11) unsigned NOT NULL,
  `icon` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `quality` tinyint(3) unsigned NOT NULL,
  `strength` float NOT NULL,
  `speed` float NOT NULL,
  `dribbleSkill` float NOT NULL,
  `passSkill` float NOT NULL,
  `shootSkill` float NOT NULL,
  `defenceSkill` float NOT NULL,
  `attackSkill` float NOT NULL,
  `groundSkill` float NOT NULL,
  `airSkill` float NOT NULL,
  `growthId` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`idCards`),
  UNIQUE KEY `idCards_UNIQUE` (`idCards`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cards`
--

LOCK TABLES `Cards` WRITE;
/*!40000 ALTER TABLE `Cards` DISABLE KEYS */;
INSERT INTO `Cards` VALUES (0,'',0,0,0,0,0,0,0,100,100,100,0),(1,'',0,1000,100,100,100,100,100,0,100,100,1);
/*!40000 ALTER TABLE `Cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CardsGrowth`
--

DROP TABLE IF EXISTS `CardsGrowth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CardsGrowth` (
  `idGrowth` int(11) unsigned NOT NULL,
  `strength` float NOT NULL,
  `speed` float NOT NULL,
  `dribbleSkill` float NOT NULL,
  `passSkill` float NOT NULL,
  `shootSkill` float NOT NULL,
  `defenceSkill` float NOT NULL,
  `attackSkill` float NOT NULL,
  `groundSkill` float NOT NULL,
  `airSkill` float NOT NULL,
  `param1` float NOT NULL DEFAULT '1',
  `param2` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`idGrowth`),
  UNIQUE KEY `idGrowth_UNIQUE` (`idGrowth`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CardsGrowth`
--

LOCK TABLES `CardsGrowth` WRITE;
/*!40000 ALTER TABLE `CardsGrowth` DISABLE KEYS */;
INSERT INTO `CardsGrowth` VALUES (0,1,1,1,1,1,1,1,1,1,1,0),(1,2,2,2,2,2,2,2,2,2,1,0);
/*!40000 ALTER TABLE `CardsGrowth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OnlineUser`
--

DROP TABLE IF EXISTS `OnlineUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OnlineUser` (
  `uid` int(11) unsigned NOT NULL,
  `loginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `state` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OnlineUser`
--

LOCK TABLES `OnlineUser` WRITE;
/*!40000 ALTER TABLE `OnlineUser` DISABLE KEYS */;
/*!40000 ALTER TABLE `OnlineUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Player`
--

DROP TABLE IF EXISTS `Player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Player` (
  `pid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nickname` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `uid` int(11) NOT NULL,
  `level` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `money` int(10) unsigned NOT NULL,
  `formationId` tinyint(3) unsigned DEFAULT '0',
  PRIMARY KEY (`pid`),
  UNIQUE KEY `pid_UNIQUE` (`pid`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Player`
--

LOCK TABLES `Player` WRITE;
/*!40000 ALTER TABLE `Player` DISABLE KEYS */;
INSERT INTO `Player` VALUES (3,NULL,3,1,0,0),(4,NULL,4,1,0,0),(5,NULL,5,1,0,0),(6,NULL,6,1,0,0),(7,NULL,7,1,0,0),(8,NULL,11,1,0,0),(9,NULL,13,1,0,0),(10,NULL,14,1,0,0),(11,NULL,15,1,0,0),(12,NULL,25,1,0,0),(13,NULL,17,1,0,0),(14,NULL,8,1,0,0),(15,NULL,2,1,0,0);
/*!40000 ALTER TABLE `Player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlayerCards`
--

DROP TABLE IF EXISTS `PlayerCards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlayerCards` (
  `pcId` int(10) unsigned NOT NULL,
  `pid` int(10) unsigned NOT NULL,
  `cid` int(10) unsigned NOT NULL,
  `level` tinyint(3) unsigned NOT NULL,
  `formationId` tinyint(3) unsigned NOT NULL DEFAULT '255',
  PRIMARY KEY (`pcId`),
  UNIQUE KEY `pcId_UNIQUE` (`pcId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlayerCards`
--

LOCK TABLES `PlayerCards` WRITE;
/*!40000 ALTER TABLE `PlayerCards` DISABLE KEYS */;
INSERT INTO `PlayerCards` VALUES (10,3,1,3,9),(1,3,0,1,0),(2,3,1,1,1),(3,3,1,1,2),(4,3,1,1,3),(5,3,1,1,4),(6,3,1,1,5),(7,3,1,2,6),(8,3,1,2,7),(9,3,1,2,8),(11,3,1,3,10),(12,4,0,4,0),(13,4,1,4,1),(14,4,1,4,2),(15,4,1,4,3),(16,4,1,4,4),(17,4,1,4,5),(18,4,1,4,6),(19,4,1,4,7),(20,4,1,4,8),(21,4,1,4,9),(22,4,1,4,10);
/*!40000 ALTER TABLE `PlayerCards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `authority` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`,`userName`),
  UNIQUE KEY `uid_UNIQUE` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'raymondma','at123',1),(2,'test0','123',0),(3,'test1','123',1),(4,'test2','123',0),(5,'test3','123',0),(6,'test4','123',0),(7,'test5','123',0),(8,'test6','123',0),(9,'test7','123',0),(10,'test8','123',0),(11,'test9','123',0),(12,'test10','123',0),(13,'test11','123',0),(14,'test12','123',0),(15,'test13','123',0),(16,'test14','123',0),(17,'test15','123',0),(18,'test16','123',0),(19,'test17','123',0),(20,'test18','123',0),(21,'test19','123',0),(22,'test20','123',0),(23,'test21','123',0),(24,'test22','123',0),(25,'test23','123',0),(26,'test24','123',0),(27,'test25','123',0),(28,'test26','123',0),(29,'test27','123',0),(30,'test28','123',0),(31,'test29','123',0),(32,'test30','123',0),(33,'test31','123',0),(34,'test32','123',0),(35,'test33','123',0),(36,'test34','123',0),(37,'test35','123',0),(38,'test36','123',0),(39,'test37','123',0),(40,'test38','123',0),(41,'test39','123',0),(42,'test40','123',0),(43,'test41','123',0),(44,'test42','123',0),(45,'test43','123',0),(46,'test44','123',0),(47,'test45','123',0),(48,'test46','123',0),(49,'test47','123',0),(50,'test48','123',0),(51,'test49','123',0),(52,'test50','123',0),(53,'test51','123',0),(54,'test52','123',0),(55,'test53','123',0),(56,'test54','123',0),(57,'test55','123',0),(58,'test56','123',0),(59,'test57','123',0),(60,'test58','123',0),(61,'test59','123',0),(62,'test60','123',0),(63,'test61','123',0),(64,'test62','123',0),(65,'test63','123',0),(66,'test64','123',0),(67,'test65','123',0),(68,'test66','123',0),(69,'test67','123',0),(70,'test68','123',0),(71,'test69','123',0),(72,'test70','123',0),(73,'test71','123',0),(74,'test72','123',0),(75,'test73','123',0),(76,'test74','123',0),(77,'test75','123',0),(78,'test76','123',0),(79,'test77','123',0),(80,'test78','123',0),(81,'test79','123',0),(82,'test80','123',0),(83,'test81','123',0),(84,'test82','123',0),(85,'test83','123',0),(86,'test84','123',0),(87,'test85','123',0),(88,'test86','123',0),(89,'test87','123',0),(90,'test88','123',0),(91,'test89','123',0),(92,'test90','123',0),(93,'test91','123',0),(94,'test92','123',0),(95,'test93','123',0),(96,'test94','123',0),(97,'test95','123',0),(98,'test96','123',0),(99,'test97','123',0),(100,'test98','123',0),(101,'test99','123',0),(102,'test100','123',0),(103,'test101','123',0),(104,'test102','123',0),(105,'test103','123',0),(106,'test104','123',0),(107,'test105','123',0),(108,'test106','123',0),(109,'test107','123',0),(110,'test108','123',0),(111,'test109','123',0),(112,'test110','123',0),(113,'test111','123',0),(114,'test112','123',0),(115,'test113','123',0),(116,'test114','123',0),(117,'test115','123',0),(118,'test116','123',0),(119,'test117','123',0),(120,'test118','123',0),(121,'test119','123',0),(122,'test120','123',0),(123,'test121','123',0),(124,'test122','123',0),(125,'test123','123',0),(126,'test124','123',0),(127,'test125','123',0),(128,'test126','123',0),(129,'test127','123',0),(130,'test128','123',0),(131,'test129','123',0),(132,'test130','123',0),(133,'test131','123',0),(134,'test132','123',0),(135,'test133','123',0),(136,'test134','123',0),(137,'test135','123',0),(138,'test136','123',0),(139,'test137','123',0),(140,'test138','123',0),(141,'test139','123',0),(142,'test140','123',0),(143,'test141','123',0),(144,'test142','123',0),(145,'test143','123',0),(146,'test144','123',0),(147,'test145','123',0),(148,'test146','123',0),(149,'test147','123',0),(150,'test148','123',0),(151,'test149','123',0),(152,'test150','123',0),(153,'test151','123',0),(154,'test152','123',0),(155,'test153','123',0),(156,'test154','123',0),(157,'test155','123',0),(158,'test156','123',0),(159,'test157','123',0),(160,'test158','123',0),(161,'test159','123',0),(162,'test160','123',0),(163,'test161','123',0),(164,'test162','123',0),(165,'test163','123',0),(166,'test164','123',0),(167,'test165','123',0),(168,'test166','123',0),(169,'test167','123',0),(170,'test168','123',0),(171,'test169','123',0),(172,'test170','123',0),(173,'test171','123',0),(174,'test172','123',0),(175,'test173','123',0),(176,'test174','123',0),(177,'test175','123',0),(178,'test176','123',0),(179,'test177','123',0),(180,'test178','123',0),(181,'test179','123',0),(182,'test180','123',0),(183,'test181','123',0),(184,'test182','123',0),(185,'test183','123',0),(186,'test184','123',0),(187,'test185','123',0),(188,'test186','123',0),(189,'test187','123',0),(190,'test188','123',0),(191,'test189','123',0),(192,'test190','123',0),(193,'test191','123',0),(194,'test192','123',0),(195,'test193','123',0),(196,'test194','123',0),(197,'test195','123',0),(198,'test196','123',0),(199,'test197','123',0),(200,'test198','123',0),(201,'test199','123',0),(202,'test200','123',0),(203,'test201','123',0),(204,'test202','123',0),(205,'test203','123',0),(206,'test204','123',0),(207,'test205','123',0),(208,'test206','123',0),(209,'test207','123',0),(210,'test208','123',0),(211,'test209','123',0),(212,'test210','123',0),(213,'test211','123',0),(214,'test212','123',0),(215,'test213','123',0),(216,'test214','123',0),(217,'test215','123',0),(218,'test216','123',0),(219,'test217','123',0),(220,'test218','123',0),(221,'test219','123',0),(222,'test220','123',0),(223,'test221','123',0),(224,'test222','123',0),(225,'test223','123',0),(226,'test224','123',0),(227,'test225','123',0),(228,'test226','123',0),(229,'test227','123',0),(230,'test228','123',0),(231,'test229','123',0),(232,'test230','123',0),(233,'test231','123',0),(234,'test232','123',0),(235,'test233','123',0),(236,'test234','123',0),(237,'test235','123',0),(238,'test236','123',0),(239,'test237','123',0),(240,'test238','123',0),(241,'test239','123',0),(242,'test240','123',0),(243,'test241','123',0),(244,'test242','123',0),(245,'test243','123',0),(246,'test244','123',0),(247,'test245','123',0),(248,'test246','123',0),(249,'test247','123',0),(250,'test248','123',0),(251,'test249','123',0),(252,'test250','123',0),(253,'test251','123',0),(254,'test252','123',0),(255,'test253','123',0),(256,'test254','123',0),(257,'test255','123',0),(258,'test256','123',0),(259,'test257','123',0),(260,'test258','123',0),(261,'test259','123',0),(262,'test260','123',0),(263,'test261','123',0),(264,'test262','123',0),(265,'test263','123',0),(266,'test264','123',0),(267,'test265','123',0),(268,'test266','123',0),(269,'test267','123',0),(270,'test268','123',0),(271,'test269','123',0),(272,'test270','123',0),(273,'test271','123',0),(274,'test272','123',0),(275,'test273','123',0),(276,'test274','123',0),(277,'test275','123',0),(278,'test276','123',0),(279,'test277','123',0),(280,'test278','123',0),(281,'test279','123',0),(282,'test280','123',0),(283,'test281','123',0),(284,'test282','123',0),(285,'test283','123',0),(286,'test284','123',0),(287,'test285','123',0),(288,'test286','123',0),(289,'test287','123',0),(290,'test288','123',0),(291,'test289','123',0),(292,'test290','123',0),(293,'test291','123',0),(294,'test292','123',0),(295,'test293','123',0),(296,'test294','123',0),(297,'test295','123',0),(298,'test296','123',0),(299,'test297','123',0),(300,'test298','123',0),(301,'test299','123',0),(302,'test300','123',0),(303,'test301','123',0),(304,'test302','123',0),(305,'test303','123',0),(306,'test304','123',0),(307,'test305','123',0),(308,'test306','123',0),(309,'test307','123',0),(310,'test308','123',0),(311,'test309','123',0),(312,'test310','123',0),(313,'test311','123',0),(314,'test312','123',0),(315,'test313','123',0),(316,'test314','123',0),(317,'test315','123',0),(318,'test316','123',0),(319,'test317','123',0),(320,'test318','123',0),(321,'test319','123',0),(322,'test320','123',0),(323,'test321','123',0),(324,'test322','123',0),(325,'test323','123',0),(326,'test324','123',0),(327,'test325','123',0),(328,'test326','123',0),(329,'test327','123',0),(330,'test328','123',0),(331,'test329','123',0),(332,'test330','123',0),(333,'test331','123',0),(334,'test332','123',0),(335,'test333','123',0),(336,'test334','123',0),(337,'test335','123',0),(338,'test336','123',0),(339,'test337','123',0),(340,'test338','123',0),(341,'test339','123',0),(342,'test340','123',0),(343,'test341','123',0),(344,'test342','123',0),(345,'test343','123',0),(346,'test344','123',0),(347,'test345','123',0),(348,'test346','123',0),(349,'test347','123',0),(350,'test348','123',0),(351,'test349','123',0),(352,'test350','123',0),(353,'test351','123',0),(354,'test352','123',0),(355,'test353','123',0),(356,'test354','123',0),(357,'test355','123',0),(358,'test356','123',0),(359,'test357','123',0),(360,'test358','123',0),(361,'test359','123',0),(362,'test360','123',0),(363,'test361','123',0),(364,'test362','123',0),(365,'test363','123',0),(366,'test364','123',0),(367,'test365','123',0),(368,'test366','123',0),(369,'test367','123',0),(370,'test368','123',0),(371,'test369','123',0),(372,'test370','123',0),(373,'test371','123',0),(374,'test372','123',0),(375,'test373','123',0),(376,'test374','123',0),(377,'test375','123',0),(378,'test376','123',0),(379,'test377','123',0),(380,'test378','123',0),(381,'test379','123',0),(382,'test380','123',0),(383,'test381','123',0),(384,'test382','123',0),(385,'test383','123',0),(386,'test384','123',0),(387,'test385','123',0),(388,'test386','123',0),(389,'test387','123',0),(390,'test388','123',0),(391,'test389','123',0),(392,'test390','123',0),(393,'test391','123',0),(394,'test392','123',0),(395,'test393','123',0),(396,'test394','123',0),(397,'test395','123',0),(398,'test396','123',0),(399,'test397','123',0),(400,'test398','123',0),(401,'test399','123',0),(402,'test400','123',0),(403,'test401','123',0),(404,'test402','123',0),(405,'test403','123',0),(406,'test404','123',0),(407,'test405','123',0),(408,'test406','123',0),(409,'test407','123',0),(410,'test408','123',0),(411,'test409','123',0),(412,'test410','123',0),(413,'test411','123',0),(414,'test412','123',0),(415,'test413','123',0),(416,'test414','123',0),(417,'test415','123',0),(418,'test416','123',0),(419,'test417','123',0),(420,'test418','123',0),(421,'test419','123',0),(422,'test420','123',0),(423,'test421','123',0),(424,'test422','123',0),(425,'test423','123',0),(426,'test424','123',0),(427,'test425','123',0),(428,'test426','123',0),(429,'test427','123',0),(430,'test428','123',0),(431,'test429','123',0),(432,'test430','123',0),(433,'test431','123',0),(434,'test432','123',0),(435,'test433','123',0),(436,'test434','123',0),(437,'test435','123',0),(438,'test436','123',0),(439,'test437','123',0),(440,'test438','123',0),(441,'test439','123',0),(442,'test440','123',0),(443,'test441','123',0),(444,'test442','123',0),(445,'test443','123',0),(446,'test444','123',0),(447,'test445','123',0),(448,'test446','123',0),(449,'test447','123',0),(450,'test448','123',0),(451,'test449','123',0),(452,'test450','123',0),(453,'test451','123',0),(454,'test452','123',0),(455,'test453','123',0),(456,'test454','123',0),(457,'test455','123',0),(458,'test456','123',0),(459,'test457','123',0),(460,'test458','123',0),(461,'test459','123',0),(462,'test460','123',0),(463,'test461','123',0),(464,'test462','123',0),(465,'test463','123',0),(466,'test464','123',0),(467,'test465','123',0),(468,'test466','123',0),(469,'test467','123',0),(470,'test468','123',0),(471,'test469','123',0),(472,'test470','123',0),(473,'test471','123',0),(474,'test472','123',0),(475,'test473','123',0),(476,'test474','123',0),(477,'test475','123',0),(478,'test476','123',0),(479,'test477','123',0),(480,'test478','123',0),(481,'test479','123',0),(482,'test480','123',0),(483,'test481','123',0),(484,'test482','123',0),(485,'test483','123',0),(486,'test484','123',0),(487,'test485','123',0),(488,'test486','123',0),(489,'test487','123',0),(490,'test488','123',0),(491,'test489','123',0),(492,'test490','123',0),(493,'test491','123',0),(494,'test492','123',0),(495,'test493','123',0),(496,'test494','123',0),(497,'test495','123',0),(498,'test496','123',0),(499,'test497','123',0),(500,'test498','123',0),(501,'test499','123',0),(502,'test500','123',0),(503,'test501','123',0),(504,'test502','123',0),(505,'test503','123',0),(506,'test504','123',0),(507,'test505','123',0),(508,'test506','123',0),(509,'test507','123',0),(510,'test508','123',0),(511,'test509','123',0),(512,'test510','123',0),(513,'test511','123',0),(514,'test512','123',0),(515,'test513','123',0),(516,'test514','123',0),(517,'test515','123',0),(518,'test516','123',0),(519,'test517','123',0),(520,'test518','123',0),(521,'test519','123',0),(522,'test520','123',0),(523,'test521','123',0),(524,'test522','123',0),(525,'test523','123',0),(526,'test524','123',0),(527,'test525','123',0),(528,'test526','123',0),(529,'test527','123',0),(530,'test528','123',0),(531,'test529','123',0),(532,'test530','123',0),(533,'test531','123',0),(534,'test532','123',0),(535,'test533','123',0),(536,'test534','123',0),(537,'test535','123',0),(538,'test536','123',0),(539,'test537','123',0),(540,'test538','123',0),(541,'test539','123',0),(542,'test540','123',0),(543,'test541','123',0),(544,'test542','123',0),(545,'test543','123',0),(546,'test544','123',0),(547,'test545','123',0),(548,'test546','123',0),(549,'test547','123',0),(550,'test548','123',0),(551,'test549','123',0),(552,'test550','123',0),(553,'test551','123',0),(554,'test552','123',0),(555,'test553','123',0),(556,'test554','123',0),(557,'test555','123',0),(558,'test556','123',0),(559,'test557','123',0),(560,'test558','123',0),(561,'test559','123',0),(562,'test560','123',0),(563,'test561','123',0),(564,'test562','123',0),(565,'test563','123',0),(566,'test564','123',0),(567,'test565','123',0),(568,'test566','123',0),(569,'test567','123',0),(570,'test568','123',0),(571,'test569','123',0),(572,'test570','123',0),(573,'test571','123',0),(574,'test572','123',0),(575,'test573','123',0),(576,'test574','123',0),(577,'test575','123',0),(578,'test576','123',0),(579,'test577','123',0),(580,'test578','123',0),(581,'test579','123',0),(582,'test580','123',0),(583,'test581','123',0),(584,'test582','123',0),(585,'test583','123',0),(586,'test584','123',0),(587,'test585','123',0),(588,'test586','123',0),(589,'test587','123',0),(590,'test588','123',0),(591,'test589','123',0),(592,'test590','123',0),(593,'test591','123',0),(594,'test592','123',0),(595,'test593','123',0),(596,'test594','123',0),(597,'test595','123',0),(598,'test596','123',0),(599,'test597','123',0),(600,'test598','123',0),(601,'test599','123',0),(602,'test600','123',0),(603,'test601','123',0),(604,'test602','123',0),(605,'test603','123',0),(606,'test604','123',0),(607,'test605','123',0),(608,'test606','123',0),(609,'test607','123',0),(610,'test608','123',0),(611,'test609','123',0),(612,'test610','123',0),(613,'test611','123',0),(614,'test612','123',0),(615,'test613','123',0),(616,'test614','123',0),(617,'test615','123',0),(618,'test616','123',0),(619,'test617','123',0),(620,'test618','123',0),(621,'test619','123',0),(622,'test620','123',0),(623,'test621','123',0),(624,'test622','123',0),(625,'test623','123',0),(626,'test624','123',0),(627,'test625','123',0),(628,'test626','123',0),(629,'test627','123',0),(630,'test628','123',0),(631,'test629','123',0),(632,'test630','123',0),(633,'test631','123',0),(634,'test632','123',0),(635,'test633','123',0),(636,'test634','123',0),(637,'test635','123',0),(638,'test636','123',0),(639,'test637','123',0),(640,'test638','123',0),(641,'test639','123',0),(642,'test640','123',0),(643,'test641','123',0),(644,'test642','123',0),(645,'test643','123',0),(646,'test644','123',0),(647,'test645','123',0),(648,'test646','123',0),(649,'test647','123',0),(650,'test648','123',0),(651,'test649','123',0),(652,'test650','123',0),(653,'test651','123',0),(654,'test652','123',0),(655,'test653','123',0),(656,'test654','123',0),(657,'test655','123',0),(658,'test656','123',0),(659,'test657','123',0),(660,'test658','123',0),(661,'test659','123',0),(662,'test660','123',0),(663,'test661','123',0),(664,'test662','123',0),(665,'test663','123',0),(666,'test664','123',0),(667,'test665','123',0),(668,'test666','123',0),(669,'test667','123',0),(670,'test668','123',0),(671,'test669','123',0),(672,'test670','123',0),(673,'test671','123',0),(674,'test672','123',0),(675,'test673','123',0),(676,'test674','123',0),(677,'test675','123',0),(678,'test676','123',0),(679,'test677','123',0),(680,'test678','123',0),(681,'test679','123',0),(682,'test680','123',0),(683,'test681','123',0),(684,'test682','123',0),(685,'test683','123',0),(686,'test684','123',0),(687,'test685','123',0),(688,'test686','123',0),(689,'test687','123',0),(690,'test688','123',0),(691,'test689','123',0),(692,'test690','123',0),(693,'test691','123',0),(694,'test692','123',0),(695,'test693','123',0),(696,'test694','123',0),(697,'test695','123',0),(698,'test696','123',0),(699,'test697','123',0),(700,'test698','123',0),(701,'test699','123',0),(702,'test700','123',0),(703,'test701','123',0),(704,'test702','123',0),(705,'test703','123',0),(706,'test704','123',0),(707,'test705','123',0),(708,'test706','123',0),(709,'test707','123',0),(710,'test708','123',0),(711,'test709','123',0),(712,'test710','123',0),(713,'test711','123',0),(714,'test712','123',0),(715,'test713','123',0),(716,'test714','123',0),(717,'test715','123',0),(718,'test716','123',0),(719,'test717','123',0),(720,'test718','123',0),(721,'test719','123',0),(722,'test720','123',0),(723,'test721','123',0),(724,'test722','123',0),(725,'test723','123',0),(726,'test724','123',0),(727,'test725','123',0),(728,'test726','123',0),(729,'test727','123',0),(730,'test728','123',0),(731,'test729','123',0),(732,'test730','123',0),(733,'test731','123',0),(734,'test732','123',0),(735,'test733','123',0),(736,'test734','123',0),(737,'test735','123',0),(738,'test736','123',0),(739,'test737','123',0),(740,'test738','123',0),(741,'test739','123',0),(742,'test740','123',0),(743,'test741','123',0),(744,'test742','123',0),(745,'test743','123',0),(746,'test744','123',0),(747,'test745','123',0),(748,'test746','123',0),(749,'test747','123',0),(750,'test748','123',0),(751,'test749','123',0),(752,'test750','123',0),(753,'test751','123',0),(754,'test752','123',0),(755,'test753','123',0),(756,'test754','123',0),(757,'test755','123',0),(758,'test756','123',0),(759,'test757','123',0),(760,'test758','123',0),(761,'test759','123',0),(762,'test760','123',0),(763,'test761','123',0),(764,'test762','123',0),(765,'test763','123',0),(766,'test764','123',0),(767,'test765','123',0),(768,'test766','123',0),(769,'test767','123',0),(770,'test768','123',0),(771,'test769','123',0),(772,'test770','123',0),(773,'test771','123',0),(774,'test772','123',0),(775,'test773','123',0),(776,'test774','123',0),(777,'test775','123',0),(778,'test776','123',0),(779,'test777','123',0),(780,'test778','123',0),(781,'test779','123',0),(782,'test780','123',0),(783,'test781','123',0),(784,'test782','123',0),(785,'test783','123',0),(786,'test784','123',0),(787,'test785','123',0),(788,'test786','123',0),(789,'test787','123',0),(790,'test788','123',0),(791,'test789','123',0),(792,'test790','123',0),(793,'test791','123',0),(794,'test792','123',0),(795,'test793','123',0),(796,'test794','123',0),(797,'test795','123',0),(798,'test796','123',0),(799,'test797','123',0),(800,'test798','123',0),(801,'test799','123',0),(802,'test800','123',0),(803,'test801','123',0),(804,'test802','123',0),(805,'test803','123',0),(806,'test804','123',0),(807,'test805','123',0),(808,'test806','123',0),(809,'test807','123',0),(810,'test808','123',0),(811,'test809','123',0),(812,'test810','123',0),(813,'test811','123',0),(814,'test812','123',0),(815,'test813','123',0),(816,'test814','123',0),(817,'test815','123',0),(818,'test816','123',0),(819,'test817','123',0),(820,'test818','123',0),(821,'test819','123',0),(822,'test820','123',0),(823,'test821','123',0),(824,'test822','123',0),(825,'test823','123',0),(826,'test824','123',0),(827,'test825','123',0),(828,'test826','123',0),(829,'test827','123',0),(830,'test828','123',0),(831,'test829','123',0),(832,'test830','123',0),(833,'test831','123',0),(834,'test832','123',0),(835,'test833','123',0),(836,'test834','123',0),(837,'test835','123',0),(838,'test836','123',0),(839,'test837','123',0),(840,'test838','123',0),(841,'test839','123',0),(842,'test840','123',0),(843,'test841','123',0),(844,'test842','123',0),(845,'test843','123',0),(846,'test844','123',0),(847,'test845','123',0),(848,'test846','123',0),(849,'test847','123',0),(850,'test848','123',0),(851,'test849','123',0),(852,'test850','123',0),(853,'test851','123',0),(854,'test852','123',0),(855,'test853','123',0),(856,'test854','123',0),(857,'test855','123',0),(858,'test856','123',0),(859,'test857','123',0),(860,'test858','123',0),(861,'test859','123',0),(862,'test860','123',0),(863,'test861','123',0),(864,'test862','123',0),(865,'test863','123',0),(866,'test864','123',0),(867,'test865','123',0),(868,'test866','123',0),(869,'test867','123',0),(870,'test868','123',0),(871,'test869','123',0),(872,'test870','123',0),(873,'test871','123',0),(874,'test872','123',0),(875,'test873','123',0),(876,'test874','123',0),(877,'test875','123',0),(878,'test876','123',0),(879,'test877','123',0),(880,'test878','123',0),(881,'test879','123',0),(882,'test880','123',0),(883,'test881','123',0),(884,'test882','123',0),(885,'test883','123',0),(886,'test884','123',0),(887,'test885','123',0),(888,'test886','123',0),(889,'test887','123',0),(890,'test888','123',0),(891,'test889','123',0),(892,'test890','123',0),(893,'test891','123',0),(894,'test892','123',0),(895,'test893','123',0),(896,'test894','123',0),(897,'test895','123',0),(898,'test896','123',0),(899,'test897','123',0),(900,'test898','123',0),(901,'test899','123',0),(902,'test900','123',0),(903,'test901','123',0),(904,'test902','123',0),(905,'test903','123',0),(906,'test904','123',0),(907,'test905','123',0),(908,'test906','123',0),(909,'test907','123',0),(910,'test908','123',0),(911,'test909','123',0),(912,'test910','123',0),(913,'test911','123',0),(914,'test912','123',0),(915,'test913','123',0),(916,'test914','123',0),(917,'test915','123',0),(918,'test916','123',0),(919,'test917','123',0),(920,'test918','123',0),(921,'test919','123',0),(922,'test920','123',0),(923,'test921','123',0),(924,'test922','123',0),(925,'test923','123',0),(926,'test924','123',0),(927,'test925','123',0),(928,'test926','123',0),(929,'test927','123',0),(930,'test928','123',0),(931,'test929','123',0),(932,'test930','123',0),(933,'test931','123',0),(934,'test932','123',0),(935,'test933','123',0),(936,'test934','123',0),(937,'test935','123',0),(938,'test936','123',0),(939,'test937','123',0),(940,'test938','123',0),(941,'test939','123',0),(942,'test940','123',0),(943,'test941','123',0),(944,'test942','123',0),(945,'test943','123',0),(946,'test944','123',0),(947,'test945','123',0),(948,'test946','123',0),(949,'test947','123',0),(950,'test948','123',0),(951,'test949','123',0),(952,'test950','123',0),(953,'test951','123',0),(954,'test952','123',0),(955,'test953','123',0),(956,'test954','123',0),(957,'test955','123',0),(958,'test956','123',0),(959,'test957','123',0),(960,'test958','123',0),(961,'test959','123',0),(962,'test960','123',0),(963,'test961','123',0),(964,'test962','123',0),(965,'test963','123',0),(966,'test964','123',0),(967,'test965','123',0),(968,'test966','123',0),(969,'test967','123',0),(970,'test968','123',0),(971,'test969','123',0),(972,'test970','123',0),(973,'test971','123',0),(974,'test972','123',0),(975,'test973','123',0),(976,'test974','123',0),(977,'test975','123',0),(978,'test976','123',0),(979,'test977','123',0),(980,'test978','123',0),(981,'test979','123',0),(982,'test980','123',0),(983,'test981','123',0),(984,'test982','123',0),(985,'test983','123',0),(986,'test984','123',0),(987,'test985','123',0),(988,'test986','123',0),(989,'test987','123',0),(990,'test988','123',0),(991,'test989','123',0),(992,'test990','123',0),(993,'test991','123',0),(994,'test992','123',0),(995,'test993','123',0),(996,'test994','123',0),(997,'test995','123',0),(998,'test996','123',0),(999,'test997','123',0),(1000,'test998','123',0),(1001,'test999','123',0),(1002,'autoTest','at123',1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `ondutycards`
--

DROP TABLE IF EXISTS `ondutycards`;
/*!50001 DROP VIEW IF EXISTS `ondutycards`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `ondutycards` (
  `pcId` tinyint NOT NULL,
  `pid` tinyint NOT NULL,
  `icon` tinyint NOT NULL,
  `strength` tinyint NOT NULL,
  `speed` tinyint NOT NULL,
  `dribbleSkill` tinyint NOT NULL,
  `passSkill` tinyint NOT NULL,
  `shootSkill` tinyint NOT NULL,
  `defenceSkill` tinyint NOT NULL,
  `attackSkill` tinyint NOT NULL,
  `groundSkill` tinyint NOT NULL,
  `airSkill` tinyint NOT NULL,
  `formationId` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'FootBallXDB'
--

--
-- Dumping routines for database 'FootBallXDB'
--
/*!50003 DROP PROCEDURE IF EXISTS `getCardsOnDuty` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCardsOnDuty`(in_pid int)
BEGIN
	select 
        `ondutycards`.`strength`,
        `ondutycards`.`speed`,
        `ondutycards`.`dribbleSkill`,
        `ondutycards`.`passSkill`,
        `ondutycards`.`shootSkill`,
        `ondutycards`.`defenceSkill`,
        `ondutycards`.`attackSkill`,
        `ondutycards`.`groundSkill`,
        `ondutycards`.`airSkill`
	from ondutycards where pid = in_pid and formationId>=0 and formationId<11 order by formationId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getORcreatePlayerInfo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getORcreatePlayerInfo`(in_uid int)
BEGIN
	if not exists (select 1 from Player where uid = in_uid) then
		INSERT INTO Player (`uid`) VALUES (in_uid);
	end if;

	select * from Player where uid = in_uid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `kickAll` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `kickAll`()
BEGIN
delete from OnlineUser where uid > 0;
select * from OnlineUser;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `login`(in_username varchar(45), in_pwd varchar(80))
BEGIN
	declare out_uid int default -1;
	declare out_auth int default -1;
	declare p int;

	if exists(select 1 from Users where userName = in_username and password = in_pwd) then
		select uid into out_uid from Users where userName = in_username;
		select authority into out_auth from Users where uid = out_uid;
		if not exists(select 1 from OnlineUser where uid = out_uid) then
			INSERT INTO OnlineUser (`uid`, `state`) values(out_uid, 0);
		else
			set out_uid = -1;
		end if;
	end if;

	select out_uid;
	select out_auth;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `ondutycards`
--

/*!50001 DROP TABLE IF EXISTS `ondutycards`*/;
/*!50001 DROP VIEW IF EXISTS `ondutycards`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `ondutycards` AS select `playercards`.`pcId` AS `pcId`,`playercards`.`pid` AS `pid`,`cards`.`icon` AS `icon`,((`cards`.`strength` + ((`cardsgrowth`.`strength` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `strength`,((`cards`.`speed` + ((`cardsgrowth`.`speed` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `speed`,((`cards`.`dribbleSkill` + ((`cardsgrowth`.`dribbleSkill` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `dribbleSkill`,((`cards`.`passSkill` + ((`cardsgrowth`.`passSkill` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `passSkill`,((`cards`.`shootSkill` + ((`cardsgrowth`.`shootSkill` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `shootSkill`,((`cards`.`defenceSkill` + ((`cardsgrowth`.`defenceSkill` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `defenceSkill`,((`cards`.`attackSkill` + ((`cardsgrowth`.`attackSkill` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `attackSkill`,((`cards`.`groundSkill` + ((`cardsgrowth`.`groundSkill` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `groundSkill`,((`cards`.`airSkill` + ((`cardsgrowth`.`airSkill` * `playercards`.`level`) * `cardsgrowth`.`param1`)) + `cardsgrowth`.`param2`) AS `airSkill`,`playercards`.`formationId` AS `formationId` from ((`cards` join `playercards`) join `cardsgrowth`) where ((`cards`.`idCards` = `playercards`.`cid`) and (`cards`.`growthId` = `cardsgrowth`.`idGrowth`)) order by `playercards`.`pcId` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-05-12 23:07:43
