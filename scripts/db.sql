CREATE DATABASE  IF NOT EXISTS `javaweb_dtdat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `javaweb_dtdat`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: javaweb_dtdat
-- ------------------------------------------------------
-- Server version	9.3.0

-- Admin Account: (admin, admin), (admin1, admin1), (admin2, admin2)

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin` 
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (2,'admin','21232f297a57a5a743894a0e4a801fc3'),(3,'admin1','e00cf25ad42683b3df678c61f42c6bda'),(4,'admin2','c84258e9c39059a89ab77d846ddab909');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'TP. Hồ Chí Minh'),(2,'Hà Nội'),(3,'Đà Nẵng'),(4,'Cần Thơ'),(5,'Hải Phòng');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('food','drink') NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (1,'food','food1.jpg','Cơm tấm sườn bì','Cơm tấm truyền thống với sườn nướng và bì heo',35000.00,1),(2,'food','food2.jpg','Bún bò Huế','Bún bò cay nồng đậm đà vị miền Trung',40000.00,1),(3,'food','food3.jpg','Phở bò tái','Phở bò với nước dùng thơm ngọt tự nhiên',45000.00,1),(4,'food','food4.jpg','Mì Quảng gà','Mì Quảng đặc sản với thịt gà và đậu phộng rang',38000.00,1),(5,'food','food5.jpg','Cơm chiên Dương Châu','Cơm chiên thập cẩm với lạp xưởng và trứng',30000.00,1),(6,'food','food6.jpg','Hủ tiếu Nam Vang','Hủ tiếu nước ngon, đầy topping: thịt, tôm, trứng cút',42000.00,1),(7,'food','food7.jpg','Bánh mì thịt nướng','Bánh mì giòn thơm kẹp thịt nướng và rau sống',20000.00,1),(8,'food','food8.jpg','Bánh cuốn','Bánh cuốn nóng với chả lụa và nước mắm pha',25000.00,1),(9,'food','food9.jpg','Gỏi cuốn tôm thịt','Món ăn nhẹ cuốn tôm, thịt, rau sống',18000.00,1),(10,'food','food10.jpg','Bún chả Hà Nội','Bún chả nướng và nước mắm pha chuẩn vị Bắc',37000.00,1),(11,'food','food11.jpg','Bò Kho Cô Tư','Thịt bò hầm mềm, gia vị đậm đà, nước sốt thơm ngon',33000.00,1),(12,'food','food12.jpg','Cơm Heo Xù Katsu Phủ Trứng Chan Sốt Cà Ri Nhật','Signature Omurice With Crispy Pork Katsu in Japanese Kare Sauce',134000.00,1),(13,'food','food13.jpg','Cơm bento sườn kho trứng cút mật ong','Gạo st 25,sườn,rau củ cầu vòng,canh theo ngày. Lưu ý độ mặn của món ăn phù hợp cho bé trên 2,5 tuổi. Em bé dưới 2,5 tuổi- mẹ vui lòng ghi chú số tuổi em bé để bếp làm phù hợp vị.',60000.00,1),(14,'food','food14.jpg','Kimbap cầu vồng (7 miếng) + tôm chiên xù (4 miếng)','Gạo st 25,rong biển,tôm,rau củ',60000.00,1),(15,'food','food15.jpg','Cơm Bento Tôm sốt chanh dây','Cơm Bento Tôm sốt chanh dây',65000.00,1),(16,'food','food16.jpg','Mì ý Bò_Spaghetti Bolognese','Mì Ý bò chuẩn vị Âu với sợi mì dai mềm, sốt bò bằm cà chua đậm đà, nêm nếm vừa miệng. Thịt bò thơm béo, quyện cùng sốt sánh mịn, phủ nhẹ phô mai bào – món ăn đơn giản mà cuốn, thích hợp mọi bữa ăn.',89000.00,1),(17,'food','food17.jpg','Salad Kewpie','Salad chuẩn bị Kewpie nhưng không phải làm từ chai sốt Kewpie',71200.00,1),(18,'food','food18.jpg','Salad Lườn Ngỗng_Smoked Duck Breast Salad','Salad lườn ngỗng kiểu Âu thanh mát, kết hợp rau xanh tươi giòn, cà chua bi, trứng lòng đào và lườn ngỗng hun khói thái lát mỏng. Rưới sốt Kewpie chua ngọt nhẹ, cân bằng vị béo – tạo nên món ăn thanh nhẹ mà vẫn đủ chất và hấp dẫn.',79000.00,1),(19,'food','food19.jpg','Mì tương đen','Mì, bò bulgogi/ heo kimchi, dưa leo, trứng ốp la, sốt tương đen',75000.00,1),(20,'food','food20.jpg','Cơm trộn bò bulgogi','Bò, trứng ốp la, rong biển GenKai, hành tây,dưa leo , cà rốt sốt bulgogi',79000.00,1),(21,'food','food21.jpg','Miến trộn Hàn Quốc','Miến, bò bulgogi, trứng, rong biển GenKai, cà rốt, mè rang, hành tây, sốt miến',75000.00,1),(22,'food','food22.jpg','Cơm cuộn truyền thống','Rong biển GenKai, thanh cua, thịt xông khói, trứng, cà rốt, củ cải, dưa leo',54000.00,1),(23,'food','food23.jpg','Hoành Thánh','10 viên hoành thánh , nước hầm xương , cải thìa , hành lá , hành phi + tóp mỡ . Món đi kèm nc tương đã nấu sẵn , sate , ớt batri ngâm chua. Quán ko bán sống, ko có chanh, ko có giá hẹ.',66000.00,1),(24,'food','food24.jpg','Cơm tấm sườn trứng lạp xưởng','Cơm tấm thơm ngon, sườn nướng, trứng ốp la, lạp xưởn thơm',63000.00,1),(25,'food','food25.jpg','Bánh canh chả cá','Sợi và nước dùng bánh canh theo công thức riêng, Vị khác biệt,nước dùng đậm đà, chả cá Quy Nhơn, tô giấy, muỗng đũa đầy đủ, rau đắng, giá , Chanh, ớt, nước mắm',45000.00,1),(26,'food','food26.jpg','Cơm Bò Gân Basmati','Cơm basmati (cơm có hàm lượng đường thấp), Bò gân viên, trứng sợi, salad hỗn hợp, sốt tự chọn. Độc đáo và khác biệt',89000.00,1),(27,'food','food27.jpg','Bánh Mì Que','Bánh mì que hay còn gọi là bánh mì gậy, là một món ăn quen thuộc và được yêu thích trên khắp cả nước. Với nhân pate và chà bông bên trong, siêu hợp với ăn nhẹ buổi sáng cùng ly cà phê',15000.00,1),(28,'food','food28.jpg','Bánh Đa Cua Đầy Đủ','Đặc sản đậm vị, đủ topping tuyệt vời',47000.00,1),(29,'food','food29.jpg','Mì Sủi Cảo Nước','Mì sủi cảo nước thơm ngon, đầy đặn',78000.00,1),(30,'food','f921b8e6-ce48-4d00-a174-e866e7dcb672.jpg','Cơm bò kim chi đen','Cơm + Bò kim chi + Rong biển + Sốt sate ngon cực kì',33000.00,1),(31,'drink','drink1.jpg','Ô Long Nhài Sữa - trà sữa','Trà Ô Long Đặc Sản đậm đà cùng hương nhài thơm tinh tế, thêm chút thơm ngậy từ sữa',54000.00,1),(32,'drink','drink2.jpg','Si Mơ - Cold Brew Ô Long Mơ Đào','Trà Ô Long Đặc Sản ủ lạnh, kết hợp cùng Mơ Má Đào và Đào Hồng dầm, thêm Thạch Trà Vỏ mềm dai mang đến hương vị thanh mát & nhẹ nhàng',64000.00,1),(33,'drink','drink3.jpg','Tấm - trà sữa','Trà Ô Long đậm đà kết hợp hài hoà với gạo rang thơm bùi',53000.00,1),(34,'drink','drink4.jpg','Bòng Bưởi - Ô Long Bưởi Nha Đam','Trà Ô Long Đặc Sản kết hợp cùng vị Bưởi the mát, thêm Vỏ Bưởi sấy và Nha Đam giòn dai sần sật, mang đến hương vị thanh mát & nhẹ nhàng.',64000.00,1),(35,'drink','drink5.jpg','Phê Đen - cà phê','(Sản phẩm không đường) Vị chua nhẹ tự nhiên của hạt Arabica Lạc Dương kết hợp cùng Robusta Lâm Hà được tuyển chọn kỹ lưỡng, tạo nên hương vị đậm mượt đầy tinh tế',39000.00,1),(36,'drink','drink6.jpg','Lụa Đào - Phiên bản Đồng Chill yêu thích','Phiên bản kèm Đào Hồng Dầm và Thạch Trà Đào Hồng. Trà Ô Long Lụa Đào thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng, mang đến trải nghiệm mềm mượt, tươi mát & nhẹ nhàng',54000.00,1),(37,'drink','drink7.jpg','Matcha Phan Xi Păng - đá xay','(Sản phẩm đá xay và có thể bị tan với khoảng cách xa trên 3,5km) Lớp kem Ô Long Matcha kết hợp cùng cốt dừa đá xay mát lạnh, thưởng thức cùng Thạch Ô Long Matcha mềm mượt mang đến trải nghiệm thú vị',64000.00,1),(38,'drink','drink8.jpg','Matcha Coco Latte - sữa','Lớp kem Ô Long Matcha bồng bềnh sánh mịn hoà quyện cùng sữa dừa Bến Tre hữu cơ ngọt thơm',59000.00,1),(39,'drink','drink9.jpg','Lụa Gạo - Ô Long Gạo Sữa Tươi','Trà Ô Long Gạo Rang thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng Phê La, mang đến trải nghiệm mềm mượt, tươi mát & nhẹ nhàng. Sử dụng kèm Ống Hút Bung Hương',54000.00,1),(40,'drink','drink10.jpg','Phong Lan - trà sữa','Trà Ô Long Đặc Sản hòa quyện cùng Vani tự nhiên, thơm nhẹ nhàng và vị ngọt tinh tế',54000.00,1),(41,'drink','drink11.jpg','EARLGREY UJI CERE','Matcha latte đánh bằng bột matcha Uji Cere hoà với nền syrup trà bá tước',44000.00,1),(42,'drink','drink12.jpg','TRÀ GẠO SEN VÀNG','Trà gạo sen vàng thơm mát, vị ngọt nhẹ, thanh khiết',44000.00,1),(43,'drink','drink13.jpg','Lang Biang - trà trái cây','Hương vị thuần khiết của trà Ô Long Đặc Sản cùng mứt hoa nhài thơm nhẹ',54000.00,1),(44,'drink','drink14.jpg','Phan Xi Păng - đá xay','(Sản phẩm đá xay và có thể bị tan với khoảng cách xa trên 3,5km) Trà Ô Long Đỏ Đặc Sản đậm đà kết hợp cùng cốt dừa đá xay mát lạnh',54000.00,1),(45,'drink','drink15.jpg','Phê Nâu - cà phê','Vị chua nhẹ tự nhiên của hạt Arabica Lạc Dương kết hợp cùng Robusta Lâm Hà được tuyển chọn kỹ lưỡng, hoà quyện cùng sữa đặc đem đến hương vị đậm mượt và gần gũi',39000.00,1),(46,'drink','drink16.jpg','Đà Lạt - cà phê','Cà phê Arabica Brazil kết hợp cùng Robusta Việt đậm đà hoà quyện cùng kem whipping thơm ngậy',45000.00,1),(47,'drink','drink17.jpg','Trà Vỏ Cà Phê','Trà ủ từ vỏ cà phê, hương trà thơm nhẹ hoà quyện cùng vị chua dịu của chanh vàng',54000.00,1),(48,'drink','drink18.jpg','Gấm - trà trái cây','Trà Ô Long Vải thơm mát kết hợp với trái vải căng mọng, đem đến dư vị ngọt mát và thanh khiết',54000.00,1),(49,'drink','drink19.jpg','Ô Long Đào Hồng','Phiên bản kèm Đào Hồng Dầm và Thạch Trà Đào Hồng. Trà Ô Long Đào Hồng thanh mát, vị trà nhẹ nhàng, thơm đào ngọt ngào, mang đến trải nghiệm thưởng thức dễ chịll.',69000.00,1),(50,'drink','drink20.jpg','Plus - Khói BLao','Lon 500ml. Trà Ô Long đậm đà cùng nốt hương đầu là khói đậm, hương giữa là khói nhẹ & lại ở hậu vị là hương hoa ngọc lan. HSD 3 ngày từ NSX. Bảo quản 2-5 độ C. Lắc đều trước khi dùng. Sử dụng trong vòng 24h sau khi mở nắp',108000.00,1),(51,'drink','drink21.jpg','Plus -Matcha Coco Latte','Lon 500ml. Trà Ô Long Matcha nhẹ nhàng kết hợp cùng Sữa Dừa Bến Tre hữu cơ ngọt thơm. HSD 3 ngày từ NSX. Bảo quản 2-5 độ C. Lắc đều trước khi dùng. Sử dụng trong vòng 24h sau khi mở nắp',108000.00,1),(52,'drink','drink22.jpg','Plus - Lụa Đào','Lon 500ml. Trà Ô Long Lụa Đào thơm hoa ngọt ngào, kết hợp cùng Sữa Tươi Thanh Trùng, kèm Đào Hồng Dầm. HSD 3 ngày từ NSX. Bảo quản 2-5 độ C. Lắc đều trước khi dùng. Sử dụng trong vòng 24h sau khi mở nắp. Sản phẩm đóng gói theo quy cách tiêu chuẩn, không bao gồm Túi giữ nhiệt Phê La',108000.00,1),(53,'drink','drink23.jpg','Plus - Tấm','Lon 500ml. Trà Ô Long đậm đà kết hợp hài hoà với gạo rang thơm bùi. HSD 3 ngày từ NSX. Bảo quản 2-5 độ C. Lắc đều trước khi dùng. Sử dụng trong vòng 24h sau khi mở nắp',108000.00,1),(54,'drink','drink24.jpg','Plus - Phong Lan','Lon 500ml. Trà Ô Long Đặc Sản hòa quyện cùng Vani tự nhiên, vị nhẹ nhàng, tinh tế. HSD 3 ngày từ NSX. Bảo quản 2-5 độ C. Lắc đều trước khi dùng. Sử dụng trong vòng 24h sau khi mở nắp',108000.00,1),(55,'drink','drink25.jpg','Plus - Đà Lạt','(100% đường) Chai 250ml. Cà phê Arabica Đà Lạt đậm đà hoà quyện cùng kem whipping thơm ngậy. HSD 5 ngày từ NSX. Bảo quản 2-5 độ C. Lắc đều trước khi dùng. Sử dụng trong vòng 24h sau khi mở nắp',138000.00,1);
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `food_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (116,1,8,1),(117,1,10,1),(118,1,3,3),(119,2,13,1),(120,2,31,1),(121,2,8,0),(122,3,7,1),(123,3,36,1),(124,3,40,1),(125,4,1,1),(126,4,12,1),(127,4,35,1),(128,5,1,1),(129,5,35,1),(130,6,3,2),(131,6,31,1),(132,6,42,1),(133,7,2,1),(134,7,12,1),(135,8,5,1),(136,8,16,1),(137,8,38,1),(138,9,4,1),(139,10,6,1),(140,10,18,1),(141,10,30,1),(142,11,7,2),(143,11,19,1),(144,11,35,1),(145,12,9,2),(146,12,20,1),(147,12,39,1),(148,13,2,1),(149,13,21,1),(150,14,1,1),(151,14,22,1),(152,14,30,1),(153,15,10,2),(154,15,23,1),(155,16,8,1),(156,16,10,1),(157,16,24,1),(158,16,34,1),(159,17,3,2),(160,17,25,1),(161,17,43,1),(162,18,6,1),(163,18,26,1),(164,19,7,1),(165,19,27,1),(166,19,35,1),(167,20,4,1),(168,20,28,1),(169,20,44,1),(170,21,5,1),(171,22,1,1),(172,22,29,1),(173,23,2,1),(174,23,30,1),(175,23,33,1),(176,24,3,1),(177,24,10,1),(178,24,30,1),(179,25,7,1),(180,25,30,1),(181,26,8,1),(182,26,30,1),(183,26,31,1),(184,27,9,2),(185,27,6,1),(186,27,30,1),(187,28,5,1),(188,28,35,1),(189,29,10,1),(190,29,34,1),(191,29,35,1),(192,30,1,2),(193,30,30,1),(194,31,3,2),(195,31,30,1),(196,31,31,1),(197,32,10,1),(198,32,46,1),(199,32,42,1),(200,33,29,1),(201,33,55,1);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `ward_id` int NOT NULL,
  `street` varchar(255) NOT NULL,
  `message` text,
  `total` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `state` enum('new','shipping','completed','cancel') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ward_id` (`ward_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ward_id`) REFERENCES `ward` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'Do Thanh Dat','0907150744',15,'Đường số 12','',212000.00,15000.00,'2025-07-29 10:57:32','new'),(2,'Ngoc Van Tran','0907150744',18,'Đường số 312, khu vực A','',128000.00,11000.00,'2025-07-27 10:59:30','new'),(3,'Lam Le','0907150744',13,'Khu vực 4','',142000.00,14000.00,'2025-07-26 13:10:12','new'),(4,'Tran Van Hung','0912345678',1,'123 Nguyen Hue','Deliver before 6 PM',114000.00,15000.00,'2025-06-24 09:30:00','completed'),(5,'Tran Van Hung','0912345678',1,'123 Nguyen Hue','Deliver before 6 PM',89000.00,15000.00,'2025-06-24 09:30:00','completed'),(6,'Nguyen Thi Hoa','0987654321',6,'45 Ly Thuong Kiet','',198000.00,15000.00,'2025-07-20 14:00:00','shipping'),(7,'Le Van Cuong','0901112233',21,'10 Tran Phu','No spicy',134000.00,14000.00,'2025-07-29 08:00:00','new'),(8,'Pham Thi Lan','0903445566',16,'78 Chau Van Liem','',159000.00,10000.00,'2025-06-23 18:00:00','completed'),(9,'Huynh Trung Truc','0777888999',4,'99 Phu My Hung','Changed mind',0.00,0.00,'2025-06-23 10:00:00','cancel'),(10,'Dinh Xuan Thao','0933221100',11,'33 Bach Dang','',165000.00,12000.00,'2025-07-28 11:30:00','cancel'),(11,'Vu Thi Phuong','0966778899',9,'15 Duy Tan','',129000.00,21000.00,'2025-07-29 15:00:00','shipping'),(12,'Phan Quoc Anh','0944556677',5,'8 Vo Van Tan','',142000.00,17000.00,'2025-06-22 09:00:00','completed'),(13,'Truong Cam Tu','0905123456',12,'45 Le Duan','Extra chili',113000.00,13000.00,'2025-07-29 16:30:00','cancel'),(14,'Le Hoang Minh','0907777888',17,'10 Truong Dinh','',128000.00,12000.00,'2025-07-28 11:00:00','completed'),(15,'Do Thi Hang','0919999888',8,'77 Ton Duc Thang','',126000.00,19000.00,'2025-06-23 15:00:00','completed'),(16,'Nguyen Thanh Nam','0933445566',2,'25 Vo Van Tan','Ring bell please',161000.00,18000.00,'2025-07-29 18:00:00','new'),(17,'Vu Dinh Khoi','0977889900',22,'11 Le Hong Phong','',188000.00,16000.00,'2025-06-22 14:00:00','completed'),(18,'Duong Thi Mai','0905556677',14,'2 Hai Ba Trung','',120000.00,16000.00,'2025-07-20 12:00:00','cancel'),(19,'Hoang Van Tuan','0988776655',10,'30 Khuong Dinh','',104000.00,20000.00,'2025-07-29 09:00:00','new'),(20,'Tran Quoc Bao','0907123789',19,'89 Le Loi','',173000.00,13000.00,'2025-06-21 17:00:00','completed'),(21,'Nguyen Anh Minh','0908887766',24,'12 Truong Chinh','Wrong address',0.00,0.00,'2025-06-22 11:00:00','cancel'),(22,'Le Thuy Linh','0906665544',3,'50 Chau Van Liem','',109000.00,20000.00,'2025-07-29 10:00:00','new'),(23,'Tran Quang Dai','0987123456',7,'21 Tran Hung Dao','',151000.00,18000.00,'2025-07-20 16:00:00','completed'),(24,'Bui Thi Thanh','0905999888',15,'7 Le Thanh Nghi','',149000.00,15000.00,'2025-07-29 14:00:00','new'),(25,'Hoang Duc Minh','0907123123',20,'15 Nguyen Van Linh','',99000.00,15000.00,'2025-06-23 08:30:00','completed'),(26,'Doan Thi Mai Anh','0901234567',23,'22 Hang Kenh','',111000.00,15000.00,'2025-07-29 11:45:00','cancel'),(27,'Nguyen Van Hung','0903332211',2,'35 Cach Mang Thang 8','',141000.00,18000.00,'2025-07-20 10:30:00','shipping'),(28,'Pham Ngoc An','0989123123',6,'18 Dinh Tien Hoang','',99000.00,15000.00,'2025-06-22 13:00:00','completed'),(29,'Vu Thi Mai','0905777888',13,'40 Ton Duc Thang','',140000.00,14000.00,'2025-07-29 17:00:00','shipping'),(30,'Le Van Dat','0903999000',16,'65 Nguyen Thai Hoc','',116000.00,10000.00,'2025-07-28 09:45:00','completed'),(31,'Nguyen Thi Huong','0904112233',25,'3 Hai Phong','',198000.00,18000.00,'2025-06-21 16:00:00','completed'),(32,'Do Thanh Dat','0907150744',12,'Đường số 12, khu vực 85','Giao buổi sáng					',126000.00,13000.00,'2025-07-29 16:05:05','cancel'),(33,'Ngan San','0907150744',3,'Đường 32','					',216000.00,20000.00,'2025-07-29 16:28:06','completed');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ward`
--

DROP TABLE IF EXISTS `ward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ward` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `city_id` int NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `ward_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ward`
--

LOCK TABLES `ward` WRITE;
/*!40000 ALTER TABLE `ward` DISABLE KEYS */;
INSERT INTO `ward` VALUES (1,'Quận 1',1,15000.00),(2,'Quận 3',1,18000.00),(3,'Quận 5',1,20000.00),(4,'Quận 7',1,22000.00),(5,'Quận Tân Bình',1,17000.00),(6,'Quận Hoàn Kiếm',2,15000.00),(7,'Quận Hai Bà Trưng',2,18000.00),(8,'Quận Đống Đa',2,19000.00),(9,'Quận Cầu Giấy',2,21000.00),(10,'Quận Thanh Xuân',2,20000.00),(11,'Quận Hải Châu',3,12000.00),(12,'Quận Thanh Khê',3,13000.00),(13,'Quận Liên Chiểu',3,14000.00),(14,'Quận Ngũ Hành Sơn',3,16000.00),(15,'Quận Sơn Trà',3,15000.00),(16,'Quận Ninh Kiều',4,10000.00),(17,'Quận Bình Thủy',4,12000.00),(18,'Quận Cái Răng',4,11000.00),(19,'Quận Ô Môn',4,13000.00),(20,'Huyện Phong Điền',4,15000.00),(21,'Quận Hồng Bàng',5,14000.00),(22,'Quận Ngô Quyền',5,16000.00),(23,'Quận Lê Chân',5,15000.00),(24,'Quận Kiến An',5,17000.00),(25,'Quận Đồ Sơn',5,18000.00);
/*!40000 ALTER TABLE `ward` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29 17:02:15
