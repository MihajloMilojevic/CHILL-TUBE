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
	description			TEXT,
	type				TEXT,
	released			INT
);

CREATE TABLE IF NOT EXISTS genres (
	id					INT PRIMARY KEY AUTO_INCREMENT,
	name				TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS episodes (
	id					INT PRIMARY KEY AUTO_INCREMENT,
	orderNumber			INT NOT NULL,
	video				TEXT NOT NULL,
	animeId				INT NOT NULL REFERENCES anime(id)
);

CREATE TABLE IF NOT EXISTS lists (
	id					INT PRIMARY KEY AUTO_INCREMENT,
	userId				INT NOT NULL REFERENCES users(id),
	name				TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS animes_genres (
	animeId				INT NOT NULL REFERENCES anime(id),
	genreId				INT NOT NULL REFERENCES genres(id)
);

CREATE TABLE IF NOT EXISTS animes_lists (
	animeId				INT NOT NULL REFERENCES anime(id),
	listId				INT NOT NULL REFERENCES lists(id)
);

CREATE TABLE IF NOT EXISTS watches (
	userId 				INT NOT NULL REFERENCES users(id),
	episodeId			INT NOT NULL REFERENCES episodes(id),
	completed			BOOLEAN NOT NULL DEFAULT FALSE,
	timestamp			INT,
	PRIMARY KEY(userId, episodeId)
);

CREATE TABLE IF NOT EXISTS comments (
	id					BIGINT PRIMARY KEY AUTO_INCREMENT,
	userId 				INT NOT NULL REFERENCES users(id),
	episodeId			INT NOT NULL REFERENCES episodes(id),
	timestamp			DATETIME NOT NULL,
	commentText			TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
	userId 				INT NOT NULL REFERENCES users(id),
	animeId				INT NOT NULL REFERENCES anime(id),
	rating 				INT NOT NULl,
	PRIMARY KEY(userId, animeId)
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

DELIMITER ;

-- INSERT DATA

INSERT INTO users(email, username, admin, password) VALUES
('spasicn032@gmail.com', 'Nikola Spasic', TRUE, '$2a$10$XGt3PKZtQ53rIiwTi3fw..x5nnL.izZ9dF8Ddsm4CwXogIKUgPQpG'); 			-- ID: 1

INSERT INTO users(id, email, username, admin, password) VALUES
(100, 'milojevicm374@gmail.com', 'Mihajlo Milojevic', TRUE, '$2a$10$gyOL.zzdddWS18n4x8Uv..bs53fXGYQTNC4vwcfF7JzlhTFGgahXq'); 			-- ID: 1

