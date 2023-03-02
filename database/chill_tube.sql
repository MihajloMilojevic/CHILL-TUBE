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

CREATE TABLE IF NOT EXISTS animes (
	id 					INT PRIMARY KEY AUTO_INCREMENT,
	name				TEXT NOT NULL,
	picture				TEXT NOT NULL,
	description			TEXT
);

-- INSERT DATA

INSERT INTO users(email, username, admin, password) VALUES
('spasicn032@gmail.com', 'Nikola Spasic', TRUE, '$2a$10$XGt3PKZtQ53rIiwTi3fw..x5nnL.izZ9dF8Ddsm4CwXogIKUgPQpG'), 			-- ID: 1
('milojevicm374@gmail.com', 'Mihajlo Milojevic', TRUE, '$2a$10$gyOL.zzdddWS18n4x8Uv..bs53fXGYQTNC4vwcfF7JzlhTFGgahXq'); 	-- ID: 2
