-- DROP DATABASE dircetur;

CREATE DATABASE dircetur CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE dircetur;

CREATE TABLE t_londges_clases (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(60),
    active BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE t_departments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cod_sunat VARCHAR(3) NOT NULL,
    department VARCHAR(80) NOT NULL,
    active BOOLEAN NOT NULL
);

CREATE TABLE t_provinces (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_id INT UNSIGNED NOT NULL,
    cod_sunat VARCHAR(3) NOT NULL,
    province VARCHAR(80) NOT NULL,
    active BOOLEAN NOT NULL,
    CONSTRAINT fk_province_department FOREIGN KEY (department_id) REFERENCES t_departments(id)
);

CREATE TABLE t_cities (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    province_id INT UNSIGNED NOT NULL,
    cod_sunat VARCHAR(3) NOT NULL,
    city VARCHAR(80) NOT NULL,
    ubigeo_sunat VARCHAR(7) NOT NULL,
    active BOOLEAN NOT NULL,
    CONSTRAINT fk_city_province FOREIGN KEY (province_id) REFERENCES t_provinces(id)
);

CREATE TABLE t_reasons(
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(90),
    active BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE t_locations(
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(90),
    active BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE t_users(
	id BIGINT UNSIGNED PRIMARY KEY,
    first_name VARCHAR(90) NOT NULL,
    last_name VARCHAR(90) DEFAULT NULL,
    dni VARCHAR(8) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(130) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    active BOOLEAN NOT NULL DEFAULT 1,
    last_login TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    UNIQUE INDEX(email)
);

CREATE TABLE t_londges (
	id BIGINT UNSIGNED PRIMARY KEY,
    city_id INT UNSIGNED NOT NULL,
    clase_id INT UNSIGNED NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    certificate VARCHAR(13) NOT NULL,
    ruc BIGINT(11) UNSIGNED NOT NULL,
    stars TINYINT UNSIGNED NOT NULL,
    street TEXT NOT NULL,
    phone VARCHAR(9) DEFAULT NULL,
    latitude VARCHAR(9) DEFAULT NULL,
    longitude VARCHAR(10) DEFAULT NULL,
    web_page VARCHAR(255) DEFAULT NULL,
    reservation_email VARCHAR(140) DEFAULT NULL,
    last_login TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_londges_user FOREIGN KEY(id) REFERENCES t_users(id),
    CONSTRAINT fk_londge_city FOREIGN KEY(city_id) REFERENCES t_cities(id),
    CONSTRAINT fk_londge_clase FOREIGN KEY(clase_id) REFERENCES t_londges_clases(id)
);

CREATE TABLE t_forms(
	id BIGINT UNSIGNED PRIMARY KEY,
    londge_id BIGINT UNSIGNED NOT NULL,
    chapter_2 JSON NOT NULL,
    chapter_3 JSON NOT NULL,
    chapter_4_1 JSON NOT NULL,
    chapter_4_2 JSON NOT NULL,
    chapter_5 JSON NOT NULL,
    chapter_6 JSON NOT NULL,
    active BOOLEAN NOT NULL,
    documented_at DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_form_londge FOREIGN KEY(londge_id) REFERENCES t_londges(id)
);

DELIMITER //
CREATE FUNCTION UUID_BIGINT_V1()
RETURNS BIGINT UNSIGNED
DETERMINISTIC
BEGIN
	RETURN MOD(UUID_SHORT(), 1000000000000000);
END //
DELIMITER;

DELIMITER //
CREATE PROCEDURE sp_users_save (
	IN in_first_name VARCHAR(90),
    IN in_last_name VARCHAR(90),
    IN in_dni VARCHAR(8),
    IN in_email VARCHAR(150),
    IN in_password VARCHAR(130),
    IN in_image VARCHAR(255)
)
BEGIN
	DECLARE v_id_user BIGINT;
    SET v_id_user = UUID_BIGINT_V1();
	INSERT INTO t_users (id, first_name, last_name, dni, email, password, image, active)
	VALUES (v_id_user, in_first_name, in_last_name, in_dni, in_email, in_password, in_image, 1);

	SELECT * FROM t_users WHERE id = v_id_user;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_get_all ()
BEGIN
	SELECT * FROM t_users usr
    WHERE NOT EXISTS (SELECT id FROM t_londges ldg WHERE ldg.id = usr.id)
    AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_get_by_id ( IN in_id BIGINT )
BEGIN
	SELECT * FROM t_users WHERE id = in_id AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_get_by_email ( IN in_email VARCHAR(150) )
BEGIN
	SELECT * FROM t_users WHERE email = in_email AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_update (
	IN in_id BIGINT,
	IN in_first_name VARCHAR(90),
    IN in_last_name VARCHAR(90),
    IN in_dni VARCHAR(8),
    IN in_image VARCHAR(255)
)
BEGIN
	UPDATE t_users
    SET first_name = in_first_name,
		last_name = in_last_name,
		dni = in_dni,
        image = in_image
	WHERE id = in_id;
    -- SELECT 'La base solo devuelve el numero de registros que fueron afectados';
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_delete ( IN in_id BIGINT )
BEGIN
	UPDATE t_users SET active = 0, deleted_at = NOW() WHERE id = in_id;
    -- SELECT 'La base solo devuelve el número de registros que fueron afectados';
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_change_password_by_id (
	IN in_id BIGINT,
    IN in_password VARCHAR(130)
)
BEGIN
	UPDATE t_users SET password = in_password WHERE id = in_id;
	-- SELECT 'La base solo devuelve el numero registros que fueron afectados';
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_clases_get_all ()
BEGIN
	SELECT id, description FROM t_londges_clases WHERE active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_clases_get_by_id ( IN in_id INT )
BEGIN
	SELECT id, description FROM t_londges_clases WHERE id = in_id AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_cities_get_all ()
BEGIN
	SELECT id, city FROM t_cities WHERE province_id = 184 AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_cities_get_by_id ( IN in_id INT )
BEGIN
	SELECT id, city FROM t_cities WHERE id = in_id AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_countries_get_all ()
BEGIN
	SELECT id, description FROM t_locations WHERE active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_countries_get_by_id ( IN in_id INT )
BEGIN
	SELECT id, description FROM t_locations WHERE id = in_id AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_departments_get_all ()
BEGIN
	SELECT * FROM t_departments WHERE active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_departments_get_by_id ( IN in_id INT )
BEGIN
	SELECT * FROM t_departments WHERE id = in_id AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_londges_save (
	IN in_email VARCHAR(150),
    IN in_password VARCHAR(130),
    IN in_city_id INT,
    IN in_clase_id INT,
    IN in_trade_name VARCHAR(255),
    IN in_legal_name VARCHAR(255),
    IN in_certificate VARCHAR(13),
    IN in_ruc BIGINT(11),
	IN in_stars TINYINT,
    IN in_street TEXT,
    IN in_phone VARCHAR(9),
    IN in_latitude VARCHAR(9),
    IN in_longitude VARCHAR(10),
    IN in_web_page VARCHAR(255),
    IN in_reservation_email VARCHAR(140)
)
BEGIN
	DECLARE v_id_user BIGINT;
    SET v_id_user = UUID_BIGINT_V1();
	INSERT INTO t_users (id, first_name, last_name, dni, email, password, image, active)
	VALUES (v_id_user, 'londge', 'londge', '99999999', in_email, in_password, null, 1);
    INSERT INTO t_londges (id, city_id, clase_id, trade_name, legal_name,
		certificate, ruc, stars, street, phone, latitude, longitude,
        web_page, reservation_email)
	VALUES (v_id_user, in_city_id, in_clase_id, in_trade_name, in_legal_name,
		in_certificate, in_ruc, in_stars, in_street, in_phone, in_latitude,
        in_longitude, in_web_page, in_reservation_email);

	SELECT usr.id, JSON_OBJECT(
		'id', cty.id,
        'city', cty.city
    ) AS city,
    JSON_OBJECT(
		'id', cls.id,
        'description', cls.description
    ) AS clase,
	usr.email, ldg.trade_name, ldg.legal_name,
    ldg.certificate, ldg.ruc, usr.image, ldg.stars,
    ldg.street, ldg.phone, ldg.latitude, ldg.longitude, ldg.web_page,
    ldg.reservation_email
    FROM t_users usr
    INNER JOIN t_londges ldg ON ldg.id = usr.id
    INNER JOIN t_londges_clases cls ON cls.id = ldg.clase_id
    INNER JOIN t_cities cty ON cty.id = ldg.city_id
    WHERE usr.id = v_id_user;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_londges_get_all ()
BEGIN
	SELECT usr.id, JSON_OBJECT(
		'id', cty.id,
        'city', cty.city
    ) AS city,
    JSON_OBJECT(
		'id', cls.id,
        'description', cls.description
    ) AS clase,
	usr.email, ldg.trade_name, ldg.legal_name,
    ldg.certificate, ldg.ruc, usr.image, ldg.stars,
    ldg.street, ldg.phone, ldg.latitude, ldg.longitude, ldg.web_page,
    ldg.reservation_email
    FROM t_users usr
    INNER JOIN t_londges ldg ON ldg.id = usr.id
    INNER JOIN t_londges_clases cls ON cls.id = ldg.clase_id
    INNER JOIN t_cities cty ON cty.id = ldg.city_id
    WHERE usr.active = 1 AND EXISTS (
		SELECT ldg.id FROM t_londges ldg WHERE ldg.id = usr.id
    );
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_londges_get_by_id ( IN in_id BIGINT )
BEGIN
	SELECT usr.id, JSON_OBJECT(
		'id', cty.id,
        'city', cty.city
    ) AS city,
    JSON_OBJECT(
		'id', cls.id,
        'description', cls.description
    ) AS clase,
	usr.email, ldg.trade_name, ldg.legal_name,
    ldg.certificate, ldg.ruc, usr.image, ldg.stars,
    ldg.street, ldg.phone, ldg.latitude, ldg.longitude, ldg.web_page,
    ldg.reservation_email
    FROM t_users usr
    INNER JOIN t_londges ldg ON ldg.id = usr.id
    INNER JOIN t_londges_clases cls ON cls.id = ldg.clase_id
    INNER JOIN t_cities cty ON cty.id = ldg.city_id
    WHERE usr.id = in_id AND EXISTS (
		SELECT ldg.id FROM t_londges ldg WHERE ldg.id = usr.id
    );
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_londges_get_by_email ( IN in_email VARCHAR(140) )
BEGIN
	SELECT usr.id, JSON_OBJECT(
		'id', cty.id,
        'city', cty.city
    ) AS city,
    JSON_OBJECT(
		'id', cls.id,
        'description', cls.description
    ) AS clase,
	usr.password, usr.email, ldg.trade_name, ldg.legal_name,
    ldg.certificate, ldg.ruc, usr.image, ldg.stars,
    ldg.street, ldg.phone, ldg.latitude, ldg.longitude, ldg.web_page,
    ldg.reservation_email
    FROM t_users usr
    INNER JOIN t_londges ldg ON ldg.id = usr.id
    INNER JOIN t_londges_clases cls ON cls.id = ldg.clase_id
    INNER JOIN t_cities cty ON cty.id = ldg.city_id
    WHERE usr.email = in_email AND EXISTS (
		SELECT ldg.id FROM t_londges ldg WHERE ldg.id = usr.id
    );
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_londge_update (
	IN in_id BIGINT,
	IN in_city_id INT,
    IN in_clase_id INT,
    IN in_trade_name VARCHAR(255),
    IN in_legal_name VARCHAR(255),
    IN in_certificate VARCHAR(13),
    IN in_ruc VARCHAR(255),
    IN in_stars TINYINT,
    IN in_street TEXT,
    IN in_phone VARCHAR(9),
    IN in_latitude VARCHAR(9),
    IN in_longitude VARCHAR(10),
    IN in_web_page VARCHAR(255),
    IN in_reservation_email VARCHAR(140)
)
BEGIN
	UPDATE t_londges
    SET city_id = in_city_id, clase_id = in_clase_id, trade_name = in_trade_name,
        legal_name = in_legal_name, certificate = in_certificate,
        ruc = in_ruc, stars = in_stars, street = in_street, phone = in_phone,
        latitude = in_latitude, longitude = in_longitude, web_page = in_web_page,
        reservation_email = in_reservation_email
	WHERE id = in_id;
    -- SELECT 'La base solo devuelve el numero de registros que fueron afectados';
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_forms_get_all_by_date(
	IN in_start_date DATE,
    IN in_end_date DATE
)
BEGIN
	SELECT
    ldg.id AS londge_id,
    ldg.trade_name,
    ldg.ruc,
    cty.city,
    cls.description AS clase,
    frm.documented_at,
    true AS status
    FROM t_londges ldg
    INNER JOIN t_cities cty ON cty.id = ldg.city_id
    INNER JOIN t_londges_clases cls ON cls.id = ldg.clase_id
    INNER JOIN t_forms frm ON frm.londge_id = ldg.id
    WHERE frm.documented_at BETWEEN in_start_date AND in_end_date
    AND ldg.active = 1 AND frm.active = 1
    UNION ALL
    SELECT
    ldg.id AS londge_id,
    ldg.trade_name,
    ldg.ruc,
    cty.city,
    cls.description AS clase,
    null as documented_at,
    false AS status
    FROM t_londges ldg
    INNER JOIN t_cities cty ON cty.id = ldg.city_id
    INNER JOIN t_londges_clases cls ON cls.id = ldg.clase_id
    INNER JOIN t_users usr ON usr.id = ldg.id
    WHERE ldg.id NOT IN (
		SELECT londge_id FROM t_forms
        WHERE documented_at BETWEEN in_start_date AND in_end_date
        AND active = 1
    )
   AND usr.active = 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_forms_get_by_londge_id (
	IN in_londge_id BIGINT
)
BEGIN
	SELECT
    frm.id AS form_id,
    ldg.trade_name,
    frm.documented_at
    FROM t_forms frm
    INNER JOIN t_londges ldg ON ldg.id = frm.londge_id
    INNER JOIN t_users usr ON usr.id = ldg.id
    WHERE frm.londge_id = in_londge_id
   	AND frm.active = 1 AND usr.active = 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_forms_get_by_id (
	IN in_form_id BIGINT
)
BEGIN
	SELECT
    frm.id,
    ldg.legal_name,
    ldg.trade_name,
    ldg.ruc,
    cls.description AS clase,
    ldg.stars,
    ldg.certificate,
    ldg.street,
    ldg.phone,
    ldg.latitude,
    ldg.longitude,
    cty.city,
    ldg.web_page,
    ldg.reservation_email,
    frm.chapter_2,
    frm.chapter_3,
    frm.chapter_4_1,
    frm.chapter_4_2,
    frm.chapter_5,
    frm.chapter_6
    FROM t_forms frm
    INNER JOIN t_londges ldg ON ldg.id = frm.londge_id
    INNER JOIN t_londges_clases cls ON cls.id = ldg.clase_id
    INNER JOIN t_cities cty ON cty.id = ldg.city_id
    INNER JOIN t_users usr ON usr.id = ldg.id
    WHERE frm.id = in_form_id AND frm.active = 1
   	AND usr.active = 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_forms_save (
	IN in_londge_id BIGINT,
	IN in_chapter_2 JSON,
	IN in_chapter_3 JSON,
	IN in_chapter_4_1 JSON,
	IN in_chapter_4_2 JSON,
	IN in_chapter_5 JSON,
	IN in_chapter_6 JSON,
	IN in_date_documented DATE
)
BEGIN
	INSERT INTO t_forms (id, londge_id, chapter_2, chapter_3, chapter_4_1, chapter_4_2,
	chapter_5, chapter_6, active, documented_at)
	VALUES (UUID_BIGINT_V1(), in_londge_id, in_chapter_2, in_chapter_3, in_chapter_4_1, in_chapter_4_2,
	in_chapter_5, in_chapter_6, 1, in_date_documented);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_forms_delete (
	IN in_id BIGINT
)
BEGIN
	UPDATE t_forms SET active = 0 WHERE id = in_id;
END //
DELIMITER ;

INSERT INTO t_users (id, first_name, last_name, dni, email, password, image, active)
VALUES (UUID_BIGINT_V1(), 'Renato', 'Bartra Reátegui', '71721506', 'rbr1594@gmail.com', '$2a$11$g4FwaGEKeNtqmdyLPwe63earhTcLAeUNqCVC6AscNynW.2ENHxHfW', null, 1),
(UUID_BIGINT_V1(), 'Sharon Julvic', 'Pinedo Arce', '99999999', 'sjpa@gmail.com', '$2a$11$SrxrwnhhFhDAVt9zy/is6O7Q9rFbNDWy8btpA5o8.tcN/B2c9YTdK', null, 1);

INSERT INTO t_londges_clases(id, description, active) VALUES
(1, 'Hotel', 1),
(2, 'Apart Hotel', 1),
(3, 'Hostal', 1),
(4, 'Albergue', 1),
(5, 'N/C', 1);

INSERT INTO t_locations (id, description, active) VALUES
(1, 'Argentina', 1),
(2, 'Alemania', 1),
(3, 'Bielorrusia', 1),
(4, 'Bolivia', 1),
(5, 'Brasil', 1),
(6, 'Canada', 1),
(7, 'Colombia', 1),
(8, 'Corea del Sur', 1),
(9, 'Costa Rica', 1),
(10, 'Chile', 1),
(11, 'China (Rep. Popular)', 1),
(12, 'Ecuador', 1),
(13, 'Estados Unidos-USA', 1),
(14, 'España', 1),
(15, 'Francia', 1),
(16, 'Holanda (Paises Bajos)', 1),
(17, 'India', 1),
(18, 'Israel', 1),
(19, 'Italia', 1),
(20, 'Japón', 1),
(21, 'México', 1),
(22, 'Panamá', 1),
(23, 'Reino Unido (Inglaterra & .)', 1),
(24, 'Rusia', 1),
(25, 'Suiza', 1),
(26, 'Turquía', 1),
(27, 'Uruguay', 1),
(28, 'Venezuela', 1),
(29, 'África(Gana/Marruecos/Sudáfrica &.)', 1),
(30, 'Oceanía (Australia & ...', 1),
(31, 'Otros Paises de América', 1),
(32, 'Otros Paises de Asia', 1),
(33, 'Otros paises de Europa', 1);

INSERT INTO t_users (id, first_name, last_name, dni, email, password, image, active)
VALUES (984499475546114, 'londge', 'londge', '99999999', 'hospedaje_trujillano@hotmail.com', '$2a$11$XLUUhkBMdI9gpFZtq21Gq.sYiWRqEiVbiBXoJGEEjTmbjNxlnLVbC', null, 1);
INSERT INTO t_londges (id, city_id, clase_id, trade_name, legal_name, certificate, ruc, stars, street, phone, latitude, longitude, web_page, reservation_email)
VALUES (984499475546114, 1798, 5, 'Hospedaje El Trujillano', 'Inversiones Turísticas Carel EIRL', '006941', 20542283336, 0, 'Jr. Alonso de Alvarado Nº 444', '042531073', NULL, NULL, NULL, 'hospedaje_trujillano@hotmail.com');

