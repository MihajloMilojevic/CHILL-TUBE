CREATE DATABASE IF NOT EXISTS chill_tube;

USE chill_tube;

CREATE TABLE IF NOT EXISTS users (
	id 					INT PRIMARY KEY AUTO_INCREMENT,
	email		 		TEXT UNIQUE NOT NULL,
	password 			TEXT NOT NULL,
	username 			TEXT UNIQUE NOT NULL,
	picture 			TEXT DEFAULT '/files/users/default.jpg' NOT NULL,
	admin				BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS anime (
	id 					INT PRIMARY KEY AUTO_INCREMENT,
	name				TEXT NOT NULL,
	picture				TEXT NOT NULL,
	description			TEXT
);

CREATE TABLE IF NOT EXISTS episodes (
	id					INT PRIMARY KEY AUTO_INCREMENT,
	orderNumber			INT NOT NULL,
	video				TEXT NOT NULL,
	animeId				INT NOT NULL REFERENCES anime(id)
);

-- PL/SQL

DELIMITER //

CREATE FUNCTION getEpisodes(animeId_input INT) RETURNS TEXT
BEGIN
	RETURN CONCAT(
    	'[',
        (SELECT GROUP_CONCAT(JSON_OBJECT('id', id, 'orderNumber', orderNumber, 'video', video) SEPARATOR ', ' ) FROM episodes WHERE animeId = animeId_input ORDER BY orderNumber),
        ']'
    );
END //

-- INSERT DATA

INSERT INTO users(email, username, admin, password) VALUES
('spasicn032@gmail.com', 'Nikola Spasic', TRUE, '$2a$10$XGt3PKZtQ53rIiwTi3fw..x5nnL.izZ9dF8Ddsm4CwXogIKUgPQpG'); 			-- ID: 1

