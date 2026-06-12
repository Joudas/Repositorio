-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: tickets
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_id` (`ticket_id`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (17,15,'Mostrar: \nTickets completados\nTickets en progreso\nTickets pendientes','2026-06-01 18:16:24','2026-06-01 18:16:24'),(18,16,'Graficas de los estados de los tickets','2026-06-01 18:23:07','2026-06-01 18:23:07'),(19,16,'O mejor total tickets, completados, etc, cada uno en un recuadro','2026-06-01 18:24:04','2026-06-01 18:24:04'),(20,16,'Grafica progreso del proyecto','2026-06-01 18:24:13','2026-06-01 18:24:13'),(21,16,'Traer los proyectos y mostrar cual tiene más completados o tickets creados','2026-06-01 18:25:19','2026-06-01 18:25:19'),(22,17,'Como hay m uchos colores diferentes, es dificil que predomine uno','2026-06-01 18:33:19','2026-06-01 18:33:19'),(23,17,'Creo que el negro de los botones','2026-06-01 20:09:24','2026-06-01 20:09:24'),(24,18,'Primero aprender como usar bien redux','2026-06-04 05:48:12','2026-06-04 05:48:12'),(25,19,'Aprender react Memo','2026-06-08 06:06:34','2026-06-08 06:06:34'),(26,19,'Aprender react reducer\n','2026-06-08 06:06:44','2026-06-08 06:06:44'),(27,21,'Feature-Driven Development (FDD) o Bulletproof React','2026-06-08 19:35:55','2026-06-08 19:35:55'),(28,18,'Seguir usando zustand en proyectos','2026-06-09 02:56:46','2026-06-09 02:56:46'),(29,20,'useQuery para simular el useEffect y traer los datos de la api o fetch','2026-06-09 04:28:08','2026-06-09 04:28:08'),(30,20,'mutation para realizar los post, lo ejecuto en el boton o submit, le paso los parametros y como onSucession ejecuto el useQuery nuevamente','2026-06-09 04:29:43','2026-06-09 04:29:43'),(31,20,'https://www.youtube.com/watch?v=8K1N3fE-cDs','2026-06-09 05:06:21','2026-06-09 05:06:21'),(32,18,'Zustand ayuda a remplazar useState, y permite almacenar los metodos en un store','2026-06-09 05:07:01','2026-06-09 05:07:01'),(33,18,'Zustand permite hacer persistencia y guardar los datos en el localstorage','2026-06-09 05:09:20','2026-06-09 05:09:20'),(34,21,'Investigue y deje las notas en la base de conocimiento de notion','2026-06-10 00:10:34','2026-06-10 00:10:34'),(35,21,'Me quedo con Bulletproof React','2026-06-10 00:10:52','2026-06-10 00:10:52'),(36,22,'Conocer más sobre Client-Side Rendering o CSR','2026-06-10 00:18:10','2026-06-10 00:18:10'),(37,22,'Su diferencia fundamental es que introduce el Server-Side Rendering (SSR) y componentes de servidor. Esto significa que cuando un usuario entra a tu página, el servidor procesa el código React, genera el HTML real ya armado con los datos y se lo envía instantáneamente al navegador.','2026-06-10 00:18:36','2026-06-10 00:18:36'),(38,24,'Pasar todo el progreso a TSX antes de empezar con next js','2026-06-10 01:24:52','2026-06-10 01:24:52'),(39,24,'Cambiar a react query','2026-06-11 01:38:57','2026-06-11 01:38:57'),(40,24,'Cambiar a react query hace el codigo más limpio','2026-06-11 22:57:36','2026-06-11 22:57:36'),(41,25,'Prueba despues de cambiar a react query las notas\n','2026-06-11 23:00:57','2026-06-11 23:00:57'),(42,25,'aa','2026-06-11 23:01:28','2026-06-11 23:01:28'),(43,25,'aa','2026-06-12 00:02:30','2026-06-12 00:02:30'),(44,25,'bbb','2026-06-12 00:05:25','2026-06-12 00:05:25'),(45,25,'cc','2026-06-12 01:03:22','2026-06-12 01:03:22'),(46,25,'gg','2026-06-12 01:04:03','2026-06-12 01:04:03'),(47,25,'ff','2026-06-12 01:05:11','2026-06-12 01:05:11'),(48,25,'tt','2026-06-12 01:08:19','2026-06-12 01:08:19'),(49,26,'cc','2026-06-12 01:10:02','2026-06-12 01:10:02'),(50,25,'hh','2026-06-12 01:13:00','2026-06-12 01:13:00'),(51,24,'Notas','2026-06-12 01:13:36','2026-06-12 01:13:36'),(52,24,'Crear Notas','2026-06-12 01:13:43','2026-06-12 01:13:43');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `ix_projects_id` (`id`),
  KEY `ix_projects_name` (`name`),
  KEY `ix_projects_user_id` (`user_id`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,1,'Sistema Tickets',NULL),(2,1,'Ruta Aprendizaje',NULL),(3,1,'Look',NULL),(4,1,'saaa',NULL),(5,1,'test',NULL),(6,1,'test2',NULL),(7,1,'test3',NULL),(8,1,'test4',NULL),(9,1,'test5',NULL),(10,1,'tes6',NULL);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `state` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `priority` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_tickets_id` (`id`),
  KEY `ix_tickets_project_id` (`project_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (9,1,'Corregir el inicio de session','Cuando se entra despues de un tiempo a la pagina, la base de datos ya no autentifica','completed','low'),(10,1,'Solucinar Invalid Ticket','Cuando inicia session a veces aparece como si no hubieran tickets','completed','low'),(15,1,'DashBoard','Crear un dashboard que muestren todos los tickets del usuario','pending','medium'),(16,1,'Diseñar la interfaz de dashboard','Usar figma','in_progress','high'),(17,1,'Color principal','Escoger color principal de la pagina','completed','low'),(18,2,'Aprender Zustand','Cambiar el react nativo por Zustand','completed','medium'),(19,2,'Aprender TSX','Aprender lo basico sobre','in_progress','high'),(20,2,'Data Fetching Eficiente','Aprende TanStack Query (React Query).','completed','medium'),(21,2,'Arquitectura de Carpetas','Organizar el código por características y no solo por \"componentes/vistas\"','completed','low'),(22,2,'Next.js','Echarle un vistazo a next js','pending','medium'),(23,2,'Principios SOLID y Clean Code','Aplicados al frontend. Saber separar la lógica de negocio (hooks personalizados) de la capa de presentación (componentes visuales).','pending','low'),(24,2,'Trasladar Sistema Tickets a TSX','Trasladar todo el sistema a TSX','in_progress','high'),(25,5,'a','a','completed','low'),(26,5,'Hola','Chao','pending','low');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `country` varchar(80) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `hashed_password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  UNIQUE KEY `UQ_phone` (`phone`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Jose','Angarita','Estudiante','j@gmail.com','Colombia','32212321','$argon2id$v=19$m=65536,t=3,p=4$HDQGJuHzzKLiS5E50I8ytA$BE11pHIwlUxAIG+2ladn3fp6QGe6oiekQ2mZjR4c2Ak'),(2,'Elian','Angarita','Ingeniero','e@gmail.com','Colombia','32223412','$argon2id$v=19$m=65536,t=3,p=4$5N/YUpc/LsQiI9tWFnmguQ$2NaHphsyeUfSDBDxJBtuRHaO/wYpKSOqmQ9GYUQw2eI');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'tickets'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-12 12:14:16
