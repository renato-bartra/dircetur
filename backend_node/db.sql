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
	RETURN MOD(UUID_SHORT(), 1000000000);
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

	SELECT 
        id
        ,first_name
        ,last_name
        ,dni
        ,email
        ,password
        ,image
        ,active
        ,created_at
        ,updated_at
        ,deleted_at 
    FROM t_users WHERE id = v_id_user;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_get_all ()
BEGIN
	SELECT 
        id
        ,first_name
        ,last_name
        ,dni
        ,email
        ,password
        ,image
        ,active
        ,created_at
        ,updated_at
        ,deleted_at 
    FROM t_users usr
    WHERE NOT EXISTS (SELECT id FROM t_londges ldg WHERE ldg.id = usr.id)
    AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_get_by_id ( IN in_id BIGINT )
BEGIN
	SELECT 
        id
        ,first_name
        ,last_name
        ,dni
        ,email
        ,password
        ,image
        ,active
        ,created_at
        ,updated_at
        ,deleted_at 
    FROM t_users WHERE id = in_id AND active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_users_get_by_email ( IN in_email VARCHAR(150) )
BEGIN
	SELECT 
        id
        ,first_name
        ,last_name
        ,dni
        ,email
        ,password
        ,image
        ,active
        ,created_at
        ,updated_at
        ,deleted_at 
    FROM t_users WHERE email = in_email AND active = 1;
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
	SELECT
        id
        ,cod_sunat
        ,department
        ,active  
    FROM t_departments WHERE active = 1;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_departments_get_by_id ( IN in_id INT )
BEGIN
	SELECT
        id
        ,cod_sunat
        ,department
        ,active  
    FROM t_departments WHERE id = in_id AND active = 1;
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

-- Renato Pass: renato
-- Sharon Pass: sharon
INSERT INTO t_users (id, first_name, last_name, dni, email, password, image, active)
VALUES (UUID_BIGINT_V1(), 'Renato', 'Bartra Reátegui', '71721506', 'rbr1594@gmail.com', '$2y$11$m5.8d7iVk5x3h/Ek/JblZuhPD/hD6SzK5e75i7Dp5plqDJ4qMMWyy', null, 1),
(UUID_BIGINT_V1(), 'Sharon Julvic', 'Pinedo Arce', '99999999', 'sjpa@gmail.com', '$2y$11$Kar98r/Im9kfdN.Gk7KSketDLuYowSBHeJbr90k1lbd1Hfcu.1Xdq', null, 1);

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
VALUES (9475546114, 'londge', 'londge', '99999999', 'hospedaje_trujillano@hotmail.com', '$2a$11$XLUUhkBMdI9gpFZtq21Gq.sYiWRqEiVbiBXoJGEEjTmbjNxlnLVbC', null, 1);
INSERT INTO t_londges (id, city_id, clase_id, trade_name, legal_name, certificate, ruc, stars, street, phone, latitude, longitude, web_page, reservation_email)
VALUES (9475546114, 1798, 5, 'Hospedaje El Trujillano', 'Inversiones Turísticas Carel EIRL', '006941', 20542283336, 0, 'Jr. Alonso de Alvarado Nº 444', '042531073', NULL, NULL, NULL, 'hospedaje_trujillano@hotmail.com');


INSERT INTO t_departments VALUES (1,'01','AMAZONAS',1),                                                     
(2,'02','ÁNCASH',1),
(3,'03','APURÍMAC',1),
(4,'04','AREQUIPA',1),
(5,'05','AYACUCHO',1),
(6,'06','CAJAMARCA',1),
(7,'07','LIMA METROPOLITANA Y CALLAO',1),
(8,'08','CUSCO',1),
(9,'09','HUANCAVELICA',1),
(10,'10','HUÁNUCO',1),
(11,'11','ICA',1),
(12,'12','JUNÍN',1),
(13,'13','LA LIBERTAD',1),
(14,'14','LAMBAYEQUE',1),
(15,'15','LIMA',1),
(16,'16','LORETO',1),
(17,'17','MADRE DE DIOS',1),
(18,'18','MOQUEGUA',1),
(19,'19','PASCO',1),
(20,'20','PIURA',1),
(21,'21','PUNO',1),
(22,'22','SAN MARTÍN',1),
(23,'23','TACNA',1),
(24,'24','TUMBES',1),
(25,'25','UCAYALI',1);

INSERT INTO t_provinces VALUES (1,1,'01','CHACHAPOYAS',1),
(2,1,'02','BAGUA',1),
(3,1,'03','BONGARÁ',1),
(4,1,'04','CONDORCANQUI',1),
(5,1,'05','LUYA',1),
(6,1,'06','RODRÍGUEZ DE MENDOZA',1),
(7,1,'07','UTCUBAMBA',1),
(8,2,'01','HUARAZ',1),
(9,2,'02','AIJA',1),
(10,2,'03','ANTONIO RAYMONDI',1),
(11,2,'04','ASUNCIÓN',1),
(12,2,'05','BOLOGNESI',1),
(13,2,'06','CARHUAZ',1),
(14,2,'07','CARLOS FERMÍN FITZCARRALD',1),
(15,2,'08','CASMA',1),
(16,2,'09','CORONGO',1),
(17,2,'10','HUARI',1),
(18,2,'11','HUARMEY',1),
(19,2,'12','HUAYLAS',1),
(20,2,'13','MARISCAL LUZURIAGA',1),
(21,2,'14','OCROS',1),
(22,2,'15','PALLASCA',1),
(23,2,'16','POMABAMBA',1),
(24,2,'17','RECUAY',1),
(25,2,'18','SANTA',1),
(26,2,'19','SIHUAS',1),
(27,2,'20','YUNGAY',1),
(28,3,'01','ABANCAY',1),
(29,3,'02','ANDAHUAYLAS',1),
(30,3,'03','ANTABAMBA',1),
(31,3,'04','AYMARAES',1),
(32,3,'05','COTABAMBAS',1),
(33,3,'06','CHINCHEROS',1),
(34,3,'07','GRAU',1),
(35,4,'01','AREQUIPA',1),
(36,4,'02','CAMANÁ',1),
(37,4,'03','CARAVELÍ',1),
(38,4,'04','CASTILLA',1),
(39,4,'05','CAYLLOMA',1),
(40,4,'06','CONDESUYOS',1),
(41,4,'07','ISLAY',1),
(42,4,'08','LA UNIÓN',1),
(43,5,'01','HUAMANGA',1),
(44,5,'02','CANGALLO',1),
(45,5,'03','HUANCA Sancos',1),
(46,5,'04','HUANTA',1),
(47,5,'05','LA MAR',1),
(48,5,'06','LUCANAS',1),
(49,5,'07','PARINACOCHAS',1),
(50,5,'08','PÁUCAR DEL SARA SARA',1),
(51,5,'09','SUCRE',1),
(52,5,'10','VÍCTOR FAJARDO',1),
(53,5,'11','VILCAS HUAMÁN',1),
(54,6,'01','CAJAMARCA',1),
(55,6,'02','CAJABAMBA',1),
(56,6,'03','CELENDÍN',1),
(57,6,'04','CHOTA',1),
(58,6,'05','CONTUMAZÁ',1),
(59,6,'06','CUTERVO',1),
(60,6,'07','HUALGAYOC',1),
(61,6,'08','JAÉN',1),
(62,6,'09','SAN IGNACIO',1),
(63,6,'10','SAN MARCOS',1),
(64,6,'11','SAN MIGUEL',1),
(65,6,'12','SAN PABLO',1),
(66,6,'13','SANTA CRUZ',1),
(67,7,'01','PROV. CONST. DEL CALLAO',1),
(68,8,'01','CUSCO',1),
(69,8,'02','ACOMAYO',1),
(70,8,'03','ANTA',1),
(71,8,'04','CALCA',1),
(72,8,'05','CANAS',1),
(73,8,'06','CANCHIS',1),
(74,8,'07','CHUMBIVILCAS',1),
(75,8,'08','ESPINAR',1),
(76,8,'09','LA CONVENCIÓN',1),
(77,8,'10','PARURO',1),
(78,8,'11','PAUCARTAMBO',1),
(79,8,'12','QUISPICANCHI',1),
(80,8,'13','URUBAMBA',1),
(81,9,'01','HUANCAVELICA',1),
(82,9,'02','ACOBAMBA',1),
(83,9,'03','ANGARAES',1),
(84,9,'04','CASTROVIRREYNA',1),
(85,9,'05','CHURCAMPA',1),
(86,9,'06','HUAYTARÁ',1),
(87,9,'07','TAYACAJA',1),
(88,10,'01','HUÁNUCO',1),
(89,10,'02','AMBO',1),
(90,10,'03','DOS DE MAYO',1),
(91,10,'04','HUACAYBAMBA',1),
(92,10,'05','HUAMALÍES',1),
(93,10,'06','LEONCIO PRADO',1),
(94,10,'07','MARAÑÓN',1),
(95,10,'08','PACHITEA',1),
(96,10,'09','PUERTO INCA',1),
(97,10,'10','LAURICOCHA ',1),
(98,10,'11','YAROWILCA ',1),
(99,11,'01','ICA ',1),
(100,11,'02','CHINCHA ',1),
(101,11,'03','NAZCA ',1),
(102,11,'04','PALPA ',1),
(103,11,'05','PISCO ',1),
(104,12,'01','HUANCAYO ',1),
(105,12,'02','CONCEPCIÓN ',1),
(106,12,'03','CHANCHAMAYO ',1),
(107,12,'04','JAUJA ',1),
(108,12,'05','JUNÍN ',1),
(109,12,'06','SATIPO ',1),
(110,12,'07','TARMA ',1),
(111,12,'08','YAULI ',1),
(112,12,'09','CHUPACA ',1),
(113,13,'01','TRUJILLO ',1),
(114,13,'02','ASCOPE ',1),
(115,13,'03','BOLÍVAR ',1),
(116,13,'04','CHEPÉN ',1),
(117,13,'05','JULCÁN ',1),
(118,13,'06','OTUZCO ',1),
(119,13,'07','PACASMAYO ',1),
(120,13,'08','PATAZ ',1),
(121,13,'09','SÁNCHEZ CARRIÓN ',1),
(122,13,'10','SANTIAGO DE CHUCO ',1),
(123,13,'11','GRAN CHIMÚ ',1),
(124,13,'12','VIRÚ ',1),
(125,14,'01','CHICLAYO ',1),
(126,14,'02','FERREÑAFE ',1),
(127,14,'03','LAMBAYEQUE ',1),
(128,15,'01','LIMA ',1),
(129,15,'02','BARRANCA ',1),
(130,15,'03','CAJATAMBO ',1),
(131,15,'04','CANTA ',1),
(132,15,'05','CAÑETE ',1),
(133,15,'06','HUARAL ',1),
(134,15,'07','HUAROCHIRÍ ',1),
(135,15,'08','HUAURA ',1),
(136,15,'09','OYÓN ',1),
(137,15,'10','YAUYOS ',1),
(138,16,'01','MAYNAS ',1),
(139,16,'02','ALTO AMAZONAS ',1),
(140,16,'03','LORETO ',1),
(141,16,'04','MARISCAL RAMÓN CASTILLA ',1),
(142,16,'05','REQUENA ',1),
(143,16,'06','UCAYALI ',1),
(144,16,'07','DATEM DEL MARAÑÓN ',1),
(145,16,'08','PUTUMAYO',1),
(146,17,'01','TAMBOPATA ',1),
(147,17,'02','MANU ',1),
(148,17,'03','TAHUAMANU ',1),
(149,18,'01','MARISCAL NIETO ',1),
(150,18,'02','GENERAL SÁNCHEZ CERRO ',1),
(151,18,'03','ILO ',1),
(152,19,'01','PASCO ',1),
(153,19,'02','DANIEL ALCIDES CARRIÓN ',1),
(154,19,'03','OXAPAMPA ',1),
(155,20,'01','PIURA ',1),
(156,20,'02','AYABACA ',1),
(157,20,'03','HUANCABAMBA ',1),
(158,20,'04','MORROPÓN ',1),
(159,20,'05','PAITA ',1),
(160,20,'06','SULLANA ',1),
(161,20,'07','TALARA ',1),
(162,20,'08','SECHURA ',1),
(163,21,'01','PUNO ',1),
(164,21,'02','AZÁNGARO ',1),
(165,21,'03','CARABAYA ',1),
(166,21,'04','CHUCUITO ',1),
(167,21,'05','EL COLLAO ',1),
(168,21,'06','HUANCANÉ ',1),
(169,21,'07','LAMPA ',1),
(170,21,'08','MELGAR ',1),
(171,21,'09','MOHO ',1),
(172,21,'10','SAN ANTONIO DE PUTINA ',1),
(173,21,'11','SAN ROMÁN ',1),
(174,21,'12','SANDIA ',1),
(175,21,'13','YUNGUYO ',1),
(176,22,'01','MOYOBAMBA ',1),
(177,22,'02','BELLAVISTA ',1),
(178,22,'03','EL DORADO ',1),
(179,22,'04','HUALLAGA ',1),
(180,22,'05','LAMAS ',1),
(181,22,'06','MARISCAL CÁCERES ',1),
(182,22,'07','PICOTA ',1),
(183,22,'08','RIOJA ',1),
(184,22,'09','SAN MARTÍN ',1),
(185,22,'10','TOCACHE ',1),
(186,23,'01','TACNA ',1),
(187,23,'02','CANDARAVE ',1),
(188,23,'03','JORGE BASADRE ',1),
(189,23,'04','TARATA ',1),
(190,24,'01','TUMBES ',1),
(191,24,'02','CONTRALMIRANTE VILLAR ',1),
(192,24,'03','ZARUMILLA ',1),
(193,25,'01','CORONEL PORTILLO ',1),
(194,25,'02','ATALAYA ',1),
(195,25,'03','PADRE ABAD ',1),
(196,25,'04','PURÚS',1);

INSERT INTO t_cities VALUES (1,1,'01','CHACHAPOYAS','010101',1)
,(2,1,'02','ASUNCIÓN','010102',1)
,(3,1,'03','BALSAS','010103',1)
,(4,1,'04','CHETO','010104',1)
,(5,1,'05','CHILIQUIN','010105',1)
,(6,1,'06','CHUQUIBAMBA','010106',1)
,(7,1,'07','GRANADA','010107',1)
,(8,1,'08','HUANCAS','010108',1)
,(9,1,'09','LA JALCA','010109',1)
,(10,1,'10','LEIMEBAMBA','010110',1)
,(11,1,'11','LEVANTO','010111',1)
,(12,1,'12','MAGDALENA','010112',1)
,(13,1,'13','MARISCAL CASTILLA','010113',1)
,(14,1,'14','MOLINOPAMPA','010114',1)
,(15,1,'15','MONTEVIDEO','010115',1)
,(16,1,'16','OLLEROS','010116',1)
,(17,1,'17','QUINJALCA','010117',1)
,(18,1,'18','SAN FRANCISCO DE DAGUAS','010118',1)
,(19,1,'19','SAN ISIDRO DE MAINO','010119',1)
,(20,1,'20','SOLOCO','010120',1)
,(21,1,'21','SONCHE','010121',1)
,(22,2,'01','BAGUA','010201',1)
,(23,2,'02','ARAMANGO','010202',1)
,(24,2,'03','COPALLIN','010203',1)
,(25,2,'04','EL PARCO','010204',1)
,(26,2,'05','IMAZA','010205',1)
,(27,2,'06','LA PECA','010206',1)
,(28,3,'01','JUMBILLA','010301',1)
,(29,3,'02','CHISQUILLA','010302',1)
,(30,3,'03','CHURUJA','010303',1)
,(31,3,'04','COROSHA','010304',1)
,(32,3,'05','CUISPES','010305',1)
,(33,3,'06','FLORIDA','010306',1)
,(34,3,'07','JAZAN','010307',1)
,(35,3,'08','RECTA','010308',1)
,(36,3,'09','SAN CARLOS','010309',1)
,(37,3,'10','SHIPASBAMBA','010310',1)
,(38,3,'11','VALERA','010311',1)
,(39,3,'12','YAMBRASBAMBA','010312',1)
,(40,4,'01','NIEVA','010401',1)
,(41,4,'02','EL CENEPA','010402',1)
,(42,4,'03','RÍO SANTIAGO','010403',1)
,(43,5,'01','LAMUD','010501',1)
,(44,5,'02','CAMPORREDONDO','010502',1)
,(45,5,'03','COCABAMBA','010503',1)
,(46,5,'04','COLCAMAR','010504',1)
,(47,5,'05','CONILA','010505',1)
,(48,5,'06','INGUILPATA','010506',1)
,(49,5,'07','LONGUITA','010507',1)
,(50,5,'08','LONYA CHICO','010508',1)
,(51,5,'09','LUYA','010509',1)
,(52,5,'10','LUYA VIEJO','010510',1)
,(53,5,'11','MARÍA','010511',1)
,(54,5,'12','OCALLI','010512',1)
,(55,5,'13','OCUMAL','010513',1)
,(56,5,'14','PISUQUIA','010514',1)
,(57,5,'15','PROVIDENCIA','010515',1)
,(58,5,'16','SAN CRISTÓBAL','010516',1)
,(59,5,'17','SAN FRANCISCO DE YESO','010517',1)
,(60,5,'18','SAN JERÓNIMO','010518',1)
,(61,5,'19','SAN JUAN DE LOPECANCHA','010519',1)
,(62,5,'20','SANTA CATALINA','010520',1)
,(63,5,'21','SANTO TOMAS','010521',1)
,(64,5,'22','TINGO','010522',1)
,(65,5,'23','TRITA','010523',1)
,(66,6,'01','SAN NICOLÁS','010601',1)
,(67,6,'02','CHIRIMOTO','010602',1)
,(68,6,'03','COCHAMAL','010603',1)
,(69,6,'04','HUAMBO','010604',1)
,(70,6,'05','LIMABAMBA','010605',1)
,(71,6,'06','LONGAR','010606',1)
,(72,6,'07','MARISCAL BENAVIDES','010607',1)
,(73,6,'08','MILPUC','010608',1)
,(74,6,'09','OMIA','010609',1)
,(75,6,'10','SANTA ROSA','010610',1)
,(76,6,'11','TOTORA','010611',1)
,(77,6,'12','VISTA ALEGRE','010612',1)
,(78,7,'01','BAGUA GRANDE','010701',1)
,(79,7,'02','CAJARURO','010702',1)
,(80,7,'03','CUMBA','010703',1)
,(81,7,'04','EL MILAGRO','010704',1)
,(82,7,'05','JAMALCA','010705',1)
,(83,7,'06','LONYA GRANDE','010706',1)
,(84,7,'07','YAMON','010707',1)
,(85,8,'01','HUARAZ','020101',1)
,(86,8,'02','COCHABAMBA','020102',1)
,(87,8,'03','COLCABAMBA','020103',1)
,(88,8,'04','HUANCHAY','020104',1)
,(89,8,'05','INDEPENDENCIA','020105',1)
,(90,8,'06','JANGAS','020106',1)
,(91,8,'07','LA LIBERTAD','020107',1)
,(92,8,'08','OLLEROS','020108',1)
,(93,8,'09','PAMPAS GRANDE','020109',1)
,(94,8,'10','PARIACOTO','020110',1)
,(95,8,'11','PIRA','020111',1)
,(96,8,'12','TARICA','020112',1)
,(97,9,'01','AIJA','020201',1)
,(98,9,'02','CORIS','020202',1)
,(99,9,'03','HUACLLAN','020203',1)
,(100,9,'04','LA MERCED','020204',1)
,(101,9,'05','SUCCHA','020205',1)
,(102,10,'01','LLAMELLIN','020301',1)
,(103,10,'02','ACZO','020302',1)
,(104,10,'03','CHACCHO','020303',1)
,(105,10,'04','CHINGAS','020304',1)
,(106,10,'05','MIRGAS','020305',1)
,(107,10,'06','SAN JUAN DE RONTOY','020306',1)
,(108,11,'01','CHACAS','020401',1)
,(109,11,'02','ACOCHACA','020402',1)
,(110,12,'01','CHIQUIAN','020501',1)
,(111,12,'02','ABELARDO PARDO LEZAMETA','020502',1)
,(112,12,'03','ANTONIO RAYMONDI','020503',1)
,(113,12,'04','AQUIA','020504',1)
,(114,12,'05','CAJACAY','020505',1)
,(115,12,'06','CANIS','020506',1)
,(116,12,'07','COLQUIOC','020507',1)
,(117,12,'08','HUALLANCA','020508',1)
,(118,12,'09','HUASTA','020509',1)
,(119,12,'10','HUAYLLACAYAN','020510',1)
,(120,12,'11','LA PRIMAVERA','020511',1)
,(121,12,'12','MANGAS','020512',1)
,(122,12,'13','PACLLON','020513',1)
,(123,12,'14','SAN MIGUEL DE CORPANQUI','020514',1)
,(124,12,'15','TICLLOS','020515',1)
,(125,13,'01','CARHUAZ','020601',1)
,(126,13,'02','ACOPAMPA','020602',1)
,(127,13,'03','AMASHCA','020603',1)
,(128,13,'04','ANTA','020604',1)
,(129,13,'05','ATAQUERO','020605',1)
,(130,13,'06','MARCARA','020606',1)
,(131,13,'07','PARIAHUANCA','020607',1)
,(132,13,'08','SAN MIGUEL DE ACO','020608',1)
,(133,13,'09','SHILLA','020609',1)
,(134,13,'10','TINCO','020610',1)
,(135,13,'11','YUNGAR','020611',1)
,(136,14,'01','SAN LUIS','020701',1)
,(137,14,'02','SAN NICOLÁS','020702',1)
,(138,14,'03','YAUYA','020703',1)
,(139,15,'01','CASMA','020801',1)
,(140,15,'02','BUENA VISTA ALTA','020802',1)
,(141,15,'03','COMANDANTE NOEL','020803',1)
,(142,15,'04','YAUTAN','020804',1)
,(143,16,'01','CORONGO','020901',1)
,(144,16,'02','ACO','020902',1)
,(145,16,'03','BAMBAS','020903',1)
,(146,16,'04','CUSCA','020904',1)
,(147,16,'05','LA PAMPA','020905',1)
,(148,16,'06','YANAC','020906',1)
,(149,16,'07','YUPAN','020907',1)
,(150,17,'01','HUARI','021001',1)
,(151,17,'02','ANRA','021002',1)
,(152,17,'03','CAJAY','021003',1)
,(153,17,'04','CHAVIN DE HUANTAR','021004',1)
,(154,17,'05','HUACACHI','021005',1)
,(155,17,'06','HUACCHIS','021006',1)
,(156,17,'07','HUACHIS','021007',1)
,(157,17,'08','HUANTAR','021008',1)
,(158,17,'09','MASIN','021009',1)
,(159,17,'10','PAUCAS','021010',1)
,(160,17,'11','PONTO','021011',1)
,(161,17,'12','RAHUAPAMPA','021012',1)
,(162,17,'13','RAPAYAN','021013',1)
,(163,17,'14','SAN MARCOS','021014',1)
,(164,17,'15','SAN PEDRO DE CHANA','021015',1)
,(165,17,'16','UCO','021016',1)
,(166,18,'01','HUARMEY','021101',1)
,(167,18,'02','COCHAPETI','021102',1)
,(168,18,'03','CULEBRAS','021103',1)
,(169,18,'04','HUAYAN','021104',1)
,(170,18,'05','MALVAS','021105',1)
,(171,19,'01','CARAZ','021201',1)
,(172,19,'02','HUALLANCA','021202',1)
,(173,19,'03','HUATA','021203',1)
,(174,19,'04','HUAYLAS','021204',1)
,(175,19,'05','MATO','021205',1)
,(176,19,'06','PAMPAROMAS','021206',1)
,(177,19,'07','PUEBLO LIBRE','021207',1)
,(178,19,'08','SANTA CRUZ','021208',1)
,(179,19,'09','SANTO TORIBIO','021209',1)
,(180,19,'10','YURACMARCA','021210',1)
,(181,20,'01','PISCOBAMBA','021301',1)
,(182,20,'02','CASCA','021302',1)
,(183,20,'03','ELEAZAR GUZMÁN BARRON','021303',1)
,(184,20,'04','FIDEL OLIVAS ESCUDERO','021304',1)
,(185,20,'05','LLAMA','021305',1)
,(186,20,'06','LLUMPA','021306',1)
,(187,20,'07','LUCMA','021307',1)
,(188,20,'08','MUSGA','021308',1)
,(189,21,'01','OCROS','021401',1)
,(190,21,'02','ACAS','021402',1)
,(191,21,'03','CAJAMARQUILLA','021403',1)
,(192,21,'04','CARHUAPAMPA','021404',1)
,(193,21,'05','COCHAS','021405',1)
,(194,21,'06','CONGAS','021406',1)
,(195,21,'07','LLIPA','021407',1)
,(196,21,'08','SAN CRISTÓBAL DE RAJAN','021408',1)
,(197,21,'09','SAN PEDRO','021409',1)
,(198,21,'10','SANTIAGO DE CHILCAS','021410',1)
,(199,22,'01','CABANA','021501',1)
,(200,22,'02','BOLOGNESI','021502',1)
,(201,22,'03','CONCHUCOS','021503',1)
,(202,22,'04','HUACASCHUQUE','021504',1)
,(203,22,'05','HUANDOVAL','021505',1)
,(204,22,'06','LACABAMBA','021506',1)
,(205,22,'07','LLAPO','021507',1)
,(206,22,'08','PALLASCA','021508',1)
,(207,22,'09','PAMPAS','021509',1)
,(208,22,'10','SANTA ROSA','021510',1)
,(209,22,'11','TAUCA','021511',1)
,(210,23,'01','POMABAMBA','021601',1)
,(211,23,'02','HUAYLLAN','021602',1)
,(212,23,'03','PAROBAMBA','021603',1)
,(213,23,'04','QUINUABAMBA','021604',1)
,(214,24,'01','RECUAY','021701',1)
,(215,24,'02','CATAC','021702',1)
,(216,24,'03','COTAPARACO','021703',1)
,(217,24,'04','HUAYLLAPAMPA','021704',1)
,(218,24,'05','LLACLLIN','021705',1)
,(219,24,'06','MARCA','021706',1)
,(220,24,'07','PAMPAS CHICO','021707',1)
,(221,24,'08','PARARIN','021708',1)
,(222,24,'09','TAPACOCHA','021709',1)
,(223,24,'10','TICAPAMPA','021710',1)
,(224,25,'01','CHIMBOTE','021801',1)
,(225,25,'02','CÁCERES DEL PERÚ','021802',1)
,(226,25,'03','COISHCO','021803',1)
,(227,25,'04','MACATE','021804',1)
,(228,25,'05','MORO','021805',1)
,(229,25,'06','NEPEÑA','021806',1)
,(230,25,'07','SAMANCO','021807',1)
,(231,25,'08','SANTA','021808',1)
,(232,25,'09','NUEVO CHIMBOTE','021809',1)
,(233,26,'01','SIHUAS','021901',1)
,(234,26,'02','ACOBAMBA','021902',1)
,(235,26,'03','ALFONSO UGARTE','021903',1)
,(236,26,'04','CASHAPAMPA','021904',1)
,(237,26,'05','CHINGALPO','021905',1)
,(238,26,'06','HUAYLLABAMBA','021906',1)
,(239,26,'07','QUICHES','021907',1)
,(240,26,'08','RAGASH','021908',1)
,(241,26,'09','SAN JUAN','021909',1)
,(242,26,'10','SICSIBAMBA','021910',1)
,(243,27,'01','YUNGAY','022001',1)
,(244,27,'02','CASCAPARA','022002',1)
,(245,27,'03','MANCOS','022003',1)
,(246,27,'04','MATACOTO','022004',1)
,(247,27,'05','QUILLO','022005',1)
,(248,27,'06','RANRAHIRCA','022006',1)
,(249,27,'07','SHUPLUY','022007',1)
,(250,27,'08','YANAMA','022008',1)
,(251,28,'01','ABANCAY','030101',1)
,(252,28,'02','CHACOCHE','030102',1)
,(253,28,'03','CIRCA','030103',1)
,(254,28,'04','CURAHUASI','030104',1)
,(255,28,'05','HUANIPACA','030105',1)
,(256,28,'06','LAMBRAMA','030106',1)
,(257,28,'07','PICHIRHUA','030107',1)
,(258,28,'08','SAN PEDRO DE CACHORA','030108',1)
,(259,28,'09','TAMBURCO','030109',1)
,(260,29,'01','ANDAHUAYLAS','030201',1)
,(261,29,'02','ANDARAPA','030202',1)
,(262,29,'03','CHIARA','030203',1)
,(263,29,'04','HUANCARAMA','030204',1)
,(264,29,'05','HUANCARAY','030205',1)
,(265,29,'06','HUAYANA','030206',1)
,(266,29,'07','KISHUARA','030207',1)
,(267,29,'08','PACOBAMBA','030208',1)
,(268,29,'09','PACUCHA','030209',1)
,(269,29,'10','PAMPACHIRI','030210',1)
,(270,29,'11','POMACOCHA','030211',1)
,(271,29,'12','SAN ANTONIO DE CACHI','030212',1)
,(272,29,'13','SAN JERÓNIMO','030213',1)
,(273,29,'14','SAN MIGUEL DE CHACCRAMPA','030214',1)
,(274,29,'15','SANTA MARÍA DE CHICMO','030215',1)
,(275,29,'16','TALAVERA','030216',1)
,(276,29,'17','TUMAY HUARACA','030217',1)
,(277,29,'18','TURPO','030218',1)
,(278,29,'19','KAQUIABAMBA','030219',1)
,(279,29,'20','JOSÉ MARÍA ARGUEDAS','030220',1)
,(280,30,'01','ANTABAMBA','030301',1)
,(281,30,'02','EL ORO','030302',1)
,(282,30,'03','HUAQUIRCA','030303',1)
,(283,30,'04','JUAN ESPINOZA MEDRANO','030304',1)
,(284,30,'05','OROPESA','030305',1)
,(285,30,'06','PACHACONAS','030306',1)
,(286,30,'07','SABAINO','030307',1)
,(287,31,'01','CHALHUANCA','030401',1)
,(288,31,'02','CAPAYA','030402',1)
,(289,31,'03','CARAYBAMBA','030403',1)
,(290,31,'04','CHAPIMARCA','030404',1)
,(291,31,'05','COLCABAMBA','030405',1)
,(292,31,'06','COTARUSE','030406',1)
,(293,31,'07','HUAYLLO','030407',1)
,(294,31,'08','JUSTO APU SAHUARAURA','030408',1)
,(295,31,'09','LUCRE','030409',1)
,(296,31,'10','POCOHUANCA','030410',1)
,(297,31,'11','SAN JUAN DE CHACÑA','030411',1)
,(298,31,'12','SAÑAYCA','030412',1)
,(299,31,'13','SORAYA','030413',1)
,(300,31,'14','TAPAIRIHUA','030414',1)
,(301,31,'15','TINTAY','030415',1)
,(302,31,'16','TORAYA','030416',1)
,(303,31,'17','YANACA','030417',1)
,(304,32,'01','TAMBOBAMBA','030501',1)
,(305,32,'02','COTABAMBAS','030502',1)
,(306,32,'03','COYLLURQUI','030503',1)
,(307,32,'04','HAQUIRA','030504',1)
,(308,32,'05','MARA','030505',1)
,(309,32,'06','CHALLHUAHUACHO','030506',1)
,(310,33,'01','CHINCHEROS','030601',1)
,(311,33,'02','ANCO_HUALLO','030602',1)
,(312,33,'03','COCHARCAS','030603',1)
,(313,33,'04','HUACCANA','030604',1)
,(314,33,'05','OCOBAMBA','030605',1)
,(315,33,'06','ONGOY','030606',1)
,(316,33,'07','URANMARCA','030607',1)
,(317,33,'08','RANRACANCHA','030608',1)
,(318,33,'09','ROCCHACC','030609',1)
,(319,33,'10','EL PORVENIR','030610',1)
,(320,33,'11','LOS CHANKAS','030611',1)
,(321,34,'01','CHUQUIBAMBILLA','030701',1)
,(322,34,'02','CURPAHUASI','030702',1)
,(323,34,'03','GAMARRA','030703',1)
,(324,34,'04','HUAYLLATI','030704',1)
,(325,34,'05','MAMARA','030705',1)
,(326,34,'06','MICAELA BASTIDAS','030706',1)
,(327,34,'07','PATAYPAMPA','030707',1)
,(328,34,'08','PROGRESO','030708',1)
,(329,34,'09','SAN ANTONIO','030709',1)
,(330,34,'10','SANTA ROSA','030710',1)
,(331,34,'11','TURPAY','030711',1)
,(332,34,'12','VILCABAMBA','030712',1)
,(333,34,'13','VIRUNDO','030713',1)
,(334,34,'14','CURASCO','030714',1)
,(335,35,'01','AREQUIPA','040101',1)
,(336,35,'02','ALTO SELVA ALEGRE','040102',1)
,(337,35,'03','CAYMA','040103',1)
,(338,35,'04','CERRO COLORADO','040104',1)
,(339,35,'05','CHARACATO','040105',1)
,(340,35,'06','CHIGUATA','040106',1)
,(341,35,'07','JACOBO HUNTER','040107',1)
,(342,35,'08','LA JOYA','040108',1)
,(343,35,'09','MARIANO MELGAR','040109',1)
,(344,35,'10','MIRAFLORES','040110',1)
,(345,35,'11','MOLLEBAYA','040111',1)
,(346,35,'12','PAUCARPATA','040112',1)
,(347,35,'13','POCSI','040113',1)
,(348,35,'14','POLOBAYA','040114',1)
,(349,35,'15','QUEQUEÑA','040115',1)
,(350,35,'16','SABANDIA','040116',1)
,(351,35,'17','SACHACA','040117',1)
,(352,35,'18','SAN JUAN DE SIGUAS','040118',1)
,(353,35,'19','SAN JUAN DE TARUCANI','040119',1)
,(354,35,'20','SANTA ISABEL DE SIGUAS','040120',1)
,(355,35,'21','SANTA RITA DE SIGUAS','040121',1)
,(356,35,'22','SOCABAYA','040122',1)
,(357,35,'23','TIABAYA','040123',1)
,(358,35,'24','UCHUMAYO','040124',1)
,(359,35,'25','VITOR','040125',1)
,(360,35,'26','YANAHUARA','040126',1)
,(361,35,'27','YARABAMBA','040127',1)
,(362,35,'28','YURA','040128',1)
,(363,35,'29','JOSÉ LUIS BUSTAMANTE Y RIVERO','040129',1)
,(364,36,'01','CAMANÁ','040201',1)
,(365,36,'02','JOSÉ MARÍA QUIMPER','040202',1)
,(366,36,'03','MARIANO NICOLÁS VALCÁRCEL','040203',1)
,(367,36,'04','MARISCAL CÁCERES','040204',1)
,(368,36,'05','NICOLÁS DE PIEROLA','040205',1)
,(369,36,'06','OCOÑA','040206',1)
,(370,36,'07','QUILCA','040207',1)
,(371,36,'08','SAMUEL PASTOR','040208',1)
,(372,37,'01','CARAVELÍ','040301',1)
,(373,37,'02','ACARÍ','040302',1)
,(374,37,'03','ATICO','040303',1)
,(375,37,'04','ATIQUIPA','040304',1)
,(376,37,'05','BELLA UNIÓN','040305',1)
,(377,37,'06','CAHUACHO','040306',1)
,(378,37,'07','CHALA','040307',1)
,(379,37,'08','CHAPARRA','040308',1)
,(380,37,'09','HUANUHUANU','040309',1)
,(381,37,'10','JAQUI','040310',1)
,(382,37,'11','LOMAS','040311',1)
,(383,37,'12','QUICACHA','040312',1)
,(384,37,'13','YAUCA','040313',1)
,(385,38,'01','APLAO','040401',1)
,(386,38,'02','ANDAGUA','040402',1)
,(387,38,'03','AYO','040403',1)
,(388,38,'04','CHACHAS','040404',1)
,(389,38,'05','CHILCAYMARCA','040405',1)
,(390,38,'06','CHOCO','040406',1)
,(391,38,'07','HUANCARQUI','040407',1)
,(392,38,'08','MACHAGUAY','040408',1)
,(393,38,'09','ORCOPAMPA','040409',1)
,(394,38,'10','PAMPACOLCA','040410',1)
,(395,38,'11','TIPAN','040411',1)
,(396,38,'12','UÑON','040412',1)
,(397,38,'13','URACA','040413',1)
,(398,38,'14','VIRACO','040414',1)
,(399,39,'01','CHIVAY','040501',1)
,(400,39,'02','ACHOMA','040502',1)
,(401,39,'03','CABANACONDE','040503',1)
,(402,39,'04','CALLALLI','040504',1)
,(403,39,'05','CAYLLOMA','040505',1)
,(404,39,'06','COPORAQUE','040506',1)
,(405,39,'07','HUAMBO','040507',1)
,(406,39,'08','HUANCA','040508',1)
,(407,39,'09','ICHUPAMPA','040509',1)
,(408,39,'10','LARI','040510',1)
,(409,39,'11','LLUTA','040511',1)
,(410,39,'12','MACA','040512',1)
,(411,39,'13','MADRIGAL','040513',1)
,(412,39,'14','SAN ANTONIO DE CHUCA','040514',1)
,(413,39,'15','SIBAYO','040515',1)
,(414,39,'16','TAPAY','040516',1)
,(415,39,'17','TISCO','040517',1)
,(416,39,'18','TUTI','040518',1)
,(417,39,'19','YANQUE','040519',1)
,(418,39,'20','MAJES','040520',1)
,(419,40,'01','CHUQUIBAMBA','040601',1)
,(420,40,'02','ANDARAY','040602',1)
,(421,40,'03','CAYARANI','040603',1)
,(422,40,'04','CHICHAS','040604',1)
,(423,40,'05','IRAY','040605',1)
,(424,40,'06','RÍO GRANDE','040606',1)
,(425,40,'07','SALAMANCA','040607',1)
,(426,40,'08','YANAQUIHUA','040608',1)
,(427,41,'01','MOLLENDO','040701',1)
,(428,41,'02','COCACHACRA','040702',1)
,(429,41,'03','DEAN VALDIVIA','040703',1)
,(430,41,'04','ISLAY','040704',1)
,(431,41,'05','MEJIA','040705',1)
,(432,41,'06','PUNTA DE BOMBÓN','040706',1)
,(433,42,'01','COTAHUASI','040801',1)
,(434,42,'02','ALCA','040802',1)
,(435,42,'03','CHARCANA','040803',1)
,(436,42,'04','HUAYNACOTAS','040804',1)
,(437,42,'05','PAMPAMARCA','040805',1)
,(438,42,'06','PUYCA','040806',1)
,(439,42,'07','QUECHUALLA','040807',1)
,(440,42,'08','SAYLA','040808',1)
,(441,42,'09','TAURIA','040809',1)
,(442,42,'10','TOMEPAMPA','040810',1)
,(443,42,'11','TORO','040811',1)
,(444,43,'01','AYACUCHO','050101',1)
,(445,43,'02','ACOCRO','050102',1)
,(446,43,'03','ACOS VINCHOS','050103',1)
,(447,43,'04','CARMEN ALTO','050104',1)
,(448,43,'05','CHIARA','050105',1)
,(449,43,'06','OCROS','050106',1)
,(450,43,'07','PACAYCASA','050107',1)
,(451,43,'08','QUINUA','050108',1)
,(452,43,'09','SAN JOSÉ DE TICLLAS','050109',1)
,(453,43,'10','SAN JUAN BAUTISTA','050110',1)
,(454,43,'11','SANTIAGO DE PISCHA','050111',1)
,(455,43,'12','SOCOS','050112',1);

INSERT INTO t_cities VALUES (456,43,'13','TAMBILLO','050113',1)                                                             
,(457,43,'14','VINCHOS','050114',1)
,(458,43,'15','JESÚS NAZARENO','050115',1)
,(459,43,'16','ANDRÉS AVELINO CÁCERES DORREGARAY','050116',1)
,(460,44,'01','CANGALLO','050201',1)
,(461,44,'02','CHUSCHI','050202',1)
,(462,44,'03','LOS MOROCHUCOS','050203',1)
,(463,44,'04','MARÍA PARADO DE BELLIDO','050204',1)
,(464,44,'05','PARAS','050205',1)
,(465,44,'06','TOTOS','050206',1)
,(466,45,'01','SANCOS','050301',1)
,(467,45,'02','CARAPO','050302',1)
,(468,45,'03','SACSAMARCA','050303',1)
,(469,45,'04','SANTIAGO DE LUCANAMARCA','050304',1)
,(470,46,'01','HUANTA','050401',1)
,(471,46,'02','AYAHUANCO','050402',1)
,(472,46,'03','HUAMANGUILLA','050403',1)
,(473,46,'04','IGUAIN','050404',1)
,(474,46,'05','LURICOCHA','050405',1)
,(475,46,'06','SANTILLANA','050406',1)
,(476,46,'07','SIVIA','050407',1)
,(477,46,'08','LLOCHEGUA','050408',1)
,(478,46,'09','CANAYRE','050409',1)
,(479,46,'10','UCHURACCAY','050410',1)
,(480,46,'11','PUCACOLPA','050411',1)
,(481,46,'12','CHACA','050412',1)
,(482,47,'01','SAN MIGUEL','050501',1)
,(483,47,'02','ANCO','050502',1)
,(484,47,'03','AYNA','050503',1)
,(485,47,'04','CHILCAS','050504',1)
,(486,47,'05','CHUNGUI','050505',1)
,(487,47,'06','LUIS CARRANZA','050506',1)
,(488,47,'07','SANTA ROSA','050507',1)
,(489,47,'08','TAMBO','050508',1)
,(490,47,'09','SAMUGARI','050509',1)
,(491,47,'10','ANCHIHUAY','050510',1)
,(492,47,'11','ORONCCOY','050511',1)
,(493,48,'01','PUQUIO','050601',1)
,(494,48,'02','AUCARA','050602',1)
,(495,48,'03','CABANA','050603',1)
,(496,48,'04','CARMEN SALCEDO','050604',1)
,(497,48,'05','CHAVIÑA','050605',1)
,(498,48,'06','CHIPAO','050606',1)
,(499,48,'07','HUAC-HUAS','050607',1)
,(500,48,'08','LARAMATE','050608',1)
,(501,48,'09','LEONCIO PRADO','050609',1)
,(502,48,'10','LLAUTA','050610',1)
,(503,48,'11','LUCANAS','050611',1)
,(504,48,'12','OCAÑA','050612',1)
,(505,48,'13','OTOCA','050613',1)
,(506,48,'14','SAISA','050614',1)
,(507,48,'15','SAN CRISTÓBAL','050615',1)
,(508,48,'16','SAN JUAN','050616',1)
,(509,48,'17','SAN PEDRO','050617',1)
,(510,48,'18','SAN PEDRO DE PALCO','050618',1)
,(511,48,'19','SANCOS','050619',1)
,(512,48,'20','SANTA ANA DE HUAYCAHUACHO','050620',1)
,(513,48,'21','SANTA LUCIA','050621',1)
,(514,49,'01','CORACORA','050701',1)
,(515,49,'02','CHUMPI','050702',1)
,(516,49,'03','CORONEL CASTAÑEDA','050703',1)
,(517,49,'04','PACAPAUSA','050704',1)
,(518,49,'05','PULLO','050705',1)
,(519,49,'06','PUYUSCA','050706',1)
,(520,49,'07','SAN FRANCISCO DE RAVACAYCO','050707',1)
,(521,49,'08','UPAHUACHO','050708',1)
,(522,50,'01','PAUSA','050801',1)
,(523,50,'02','COLTA','050802',1)
,(524,50,'03','CORCULLA','050803',1)
,(525,50,'04','LAMPA','050804',1)
,(526,50,'05','MARCABAMBA','050805',1)
,(527,50,'06','OYOLO','050806',1)
,(528,50,'07','PARARCA','050807',1)
,(529,50,'08','SAN JAVIER DE ALPABAMBA','050808',1)
,(530,50,'09','SAN JOSÉ DE USHUA','050809',1)
,(531,50,'10','SARA SARA','050810',1)
,(532,51,'01','QUEROBAMBA','050901',1)
,(533,51,'02','BELÉN','050902',1)
,(534,51,'03','CHALCOS','050903',1)
,(535,51,'04','CHILCAYOC','050904',1)
,(536,51,'05','HUACAÑA','050905',1)
,(537,51,'06','MORCOLLA','050906',1)
,(538,51,'07','PAICO','050907',1)
,(539,51,'08','SAN PEDRO DE LARCAY','050908',1)
,(540,51,'09','SAN SALVADOR DE QUIJE','050909',1)
,(541,51,'10','SANTIAGO DE PAUCARAY','050910',1)
,(542,51,'11','SORAS','050911',1)
,(543,52,'01','HUANCAPI','051001',1)
,(544,52,'02','ALCAMENCA','051002',1)
,(545,52,'03','APONGO','051003',1)
,(546,52,'04','ASQUIPATA','051004',1)
,(547,52,'05','CANARIA','051005',1)
,(548,52,'06','CAYARA','051006',1)
,(549,52,'07','COLCA','051007',1)
,(550,52,'08','HUAMANQUIQUIA','051008',1)
,(551,52,'09','HUANCARAYLLA','051009',1)
,(552,52,'10','HUAYA','051010',1)
,(553,52,'11','SARHUA','051011',1)
,(554,52,'12','VILCANCHOS','051012',1)
,(555,53,'01','VILCAS HUAMAN','051101',1)
,(556,53,'02','ACCOMARCA','051102',1)
,(557,53,'03','CARHUANCA','051103',1)
,(558,53,'04','CONCEPCIÓN','051104',1)
,(559,53,'05','HUAMBALPA','051105',1)
,(560,53,'06','INDEPENDENCIA','051106',1)
,(561,53,'07','SAURAMA','051107',1)
,(562,53,'08','VISCHONGO','051108',1)
,(563,54,'01','CAJAMARCA','060101',1)
,(564,54,'02','ASUNCIÓN','060102',1)
,(565,54,'03','CHETILLA','060103',1)
,(566,54,'04','COSPAN','060104',1)
,(567,54,'05','ENCAÑADA','060105',1)
,(568,54,'06','JESÚS','060106',1)
,(569,54,'07','LLACANORA','060107',1)
,(570,54,'08','LOS BAÑOS DEL INCA','060108',1)
,(571,54,'09','MAGDALENA','060109',1)
,(572,54,'10','MATARA','060110',1)
,(573,54,'11','NAMORA','060111',1)
,(574,54,'12','SAN JUAN','060112',1)
,(575,55,'01','CAJABAMBA','060201',1)
,(576,55,'02','CACHACHI','060202',1)
,(577,55,'03','CONDEBAMBA','060203',1)
,(578,55,'04','SITACOCHA','060204',1)
,(579,56,'01','CELENDÍN','060301',1)
,(580,56,'02','CHUMUCH','060302',1)
,(581,56,'03','CORTEGANA','060303',1)
,(582,56,'04','HUASMIN','060304',1)
,(583,56,'05','JORGE CHÁVEZ','060305',1)
,(584,56,'06','JOSÉ GÁLVEZ','060306',1)
,(585,56,'07','MIGUEL IGLESIAS','060307',1)
,(586,56,'08','OXAMARCA','060308',1)
,(587,56,'09','SOROCHUCO','060309',1)
,(588,56,'10','SUCRE','060310',1)
,(589,56,'11','UTCO','060311',1)
,(590,56,'12','LA LIBERTAD DE PALLAN','060312',1)
,(591,57,'01','CHOTA','060401',1)
,(592,57,'02','ANGUIA','060402',1)
,(593,57,'03','CHADIN','060403',1)
,(594,57,'04','CHIGUIRIP','060404',1)
,(595,57,'05','CHIMBAN','060405',1)
,(596,57,'06','CHOROPAMPA','060406',1)
,(597,57,'07','COCHABAMBA','060407',1)
,(598,57,'08','CONCHAN','060408',1)
,(599,57,'09','HUAMBOS','060409',1)
,(600,57,'10','LAJAS','060410',1)
,(601,57,'11','LLAMA','060411',1)
,(602,57,'12','MIRACOSTA','060412',1)
,(603,57,'13','PACCHA','060413',1)
,(604,57,'14','PION','060414',1)
,(605,57,'15','QUEROCOTO','060415',1)
,(606,57,'16','SAN JUAN DE LICUPIS','060416',1)
,(607,57,'17','TACABAMBA','060417',1)
,(608,57,'18','TOCMOCHE','060418',1)
,(609,57,'19','CHALAMARCA','060419',1)
,(610,58,'01','CONTUMAZA','060501',1)
,(611,58,'02','CHILETE','060502',1)
,(612,58,'03','CUPISNIQUE','060503',1)
,(613,58,'04','GUZMANGO','060504',1)
,(614,58,'05','SAN BENITO','060505',1)
,(615,58,'06','SANTA CRUZ DE TOLEDO','060506',1)
,(616,58,'07','TANTARICA','060507',1)
,(617,58,'08','YONAN','060508',1)
,(618,59,'01','CUTERVO','060601',1)
,(619,59,'02','CALLAYUC','060602',1)
,(620,59,'03','CHOROS','060603',1)
,(621,59,'04','CUJILLO','060604',1)
,(622,59,'05','LA RAMADA','060605',1)
,(623,59,'06','PIMPINGOS','060606',1)
,(624,59,'07','QUEROCOTILLO','060607',1)
,(625,59,'08','SAN ANDRÉS DE CUTERVO','060608',1)
,(626,59,'09','SAN JUAN DE CUTERVO','060609',1)
,(627,59,'10','SAN LUIS DE LUCMA','060610',1)
,(628,59,'11','SANTA CRUZ','060611',1)
,(629,59,'12','SANTO DOMINGO DE LA CAPILLA','060612',1)
,(630,59,'13','SANTO TOMAS','060613',1)
,(631,59,'14','SOCOTA','060614',1)
,(632,59,'15','TORIBIO CASANOVA','060615',1)
,(633,60,'01','BAMBAMARCA','060701',1)
,(634,60,'02','CHUGUR','060702',1)
,(635,60,'03','HUALGAYOC','060703',1)
,(636,61,'01','JAÉN','060801',1)
,(637,61,'02','BELLAVISTA','060802',1)
,(638,61,'03','CHONTALI','060803',1)
,(639,61,'04','COLASAY','060804',1)
,(640,61,'05','HUABAL','060805',1)
,(641,61,'06','LAS PIRIAS','060806',1)
,(642,61,'07','POMAHUACA','060807',1)
,(643,61,'08','PUCARA','060808',1)
,(644,61,'09','SALLIQUE','060809',1)
,(645,61,'10','SAN FELIPE','060810',1)
,(646,61,'11','SAN JOSÉ DEL ALTO','060811',1)
,(647,61,'12','SANTA ROSA','060812',1)
,(648,62,'01','SAN IGNACIO','060901',1)
,(649,62,'02','CHIRINOS','060902',1)
,(650,62,'03','HUARANGO','060903',1)
,(651,62,'04','LA COIPA','060904',1)
,(652,62,'05','NAMBALLE','060905',1)
,(653,62,'06','SAN JOSÉ DE LOURDES','060906',1)
,(654,62,'07','TABACONAS','060907',1)
,(655,63,'01','PEDRO GÁLVEZ','061001',1)
,(656,63,'02','CHANCAY','061002',1)
,(657,63,'03','EDUARDO VILLANUEVA','061003',1)
,(658,63,'04','GREGORIO PITA','061004',1)
,(659,63,'05','ICHOCAN','061005',1)
,(660,63,'06','JOSÉ MANUEL QUIROZ','061006',1)
,(661,63,'07','JOSÉ SABOGAL','061007',1)
,(662,64,'01','SAN MIGUEL','061101',1)
,(663,64,'02','BOLÍVAR','061102',1)
,(664,64,'03','CALQUIS','061103',1)
,(665,64,'04','CATILLUC','061104',1)
,(666,64,'05','EL PRADO','061105',1)
,(667,64,'06','LA FLORIDA','061106',1)
,(668,64,'07','LLAPA','061107',1)
,(669,64,'08','NANCHOC','061108',1)
,(670,64,'09','NIEPOS','061109',1)
,(671,64,'10','SAN GREGORIO','061110',1)
,(672,64,'11','SAN SILVESTRE DE COCHAN','061111',1)
,(673,64,'12','TONGOD','061112',1)
,(674,64,'13','UNIÓN AGUA BLANCA','061113',1)
,(675,65,'01','SAN PABLO','061201',1)
,(676,65,'02','SAN BERNARDINO','061202',1)
,(677,65,'03','SAN LUIS','061203',1)
,(678,65,'04','TUMBADEN','061204',1)
,(679,66,'01','SANTA CRUZ','061301',1)
,(680,66,'02','ANDABAMBA','061302',1)
,(681,66,'03','CATACHE','061303',1)
,(682,66,'04','CHANCAYBAÑOS','061304',1)
,(683,66,'05','LA ESPERANZA','061305',1)
,(684,66,'06','NINABAMBA','061306',1)
,(685,66,'07','PULAN','061307',1)
,(686,66,'08','SAUCEPAMPA','061308',1)
,(687,66,'09','SEXI','061309',1)
,(688,66,'10','UTICYACU','061310',1)
,(689,66,'11','YAUYUCAN','061311',1)
,(690,67,'01','CALLAO','070101',1)
,(691,67,'02','BELLAVISTA','070102',1)
,(692,67,'03','CARMEN DE LA LEGUA REYNOSO','070103',1)
,(693,67,'04','LA PERLA','070104',1)
,(694,67,'05','LA PUNTA','070105',1)
,(695,67,'06','VENTANILLA','070106',1)
,(696,67,'07','MI PERÚ','070107',1)
,(697,68,'01','CUSCO','080101',1)
,(698,68,'02','CCORCA','080102',1)
,(699,68,'03','POROY','080103',1)
,(700,68,'04','SAN JERÓNIMO','080104',1)
,(701,68,'05','SAN SEBASTIAN','080105',1)
,(702,68,'06','SANTIAGO','080106',1)
,(703,68,'07','SAYLLA','080107',1)
,(704,68,'08','WANCHAQ','080108',1)
,(705,69,'01','ACOMAYO','080201',1)
,(706,69,'02','ACOPIA','080202',1)
,(707,69,'03','ACOS','080203',1)
,(708,69,'04','MOSOC LLACTA','080204',1)
,(709,69,'05','POMACANCHI','080205',1)
,(710,69,'06','RONDOCAN','080206',1)
,(711,69,'07','SANGARARA','080207',1)
,(712,70,'01','ANTA','080301',1)
,(713,70,'02','ANCAHUASI','080302',1)
,(714,70,'03','CACHIMAYO','080303',1)
,(715,70,'04','CHINCHAYPUJIO','080304',1)
,(716,70,'05','HUAROCONDO','080305',1)
,(717,70,'06','LIMATAMBO','080306',1)
,(718,70,'07','MOLLEPATA','080307',1)
,(719,70,'08','PUCYURA','080308',1);

INSERT INTO t_cities VALUES (720,70,'09','ZURITE','080309',1)
,(721,71,'01','CALCA','080401',1)
,(722,71,'02','COYA','080402',1)
,(723,71,'03','LAMAY','080403',1)
,(724,71,'04','LARES','080404',1)
,(725,71,'05','PISAC','080405',1)
,(726,71,'06','SAN SALVADOR','080406',1)
,(727,71,'07','TARAY','080407',1)
,(728,71,'08','YANATILE','080408',1)
,(729,72,'01','YANAOCA','080501',1)
,(730,72,'02','CHECCA','080502',1)
,(731,72,'03','KUNTURKANKI','080503',1)
,(732,72,'04','LANGUI','080504',1)
,(733,72,'05','LAYO','080505',1)
,(734,72,'06','PAMPAMARCA','080506',1)
,(735,72,'07','QUEHUE','080507',1)
,(736,72,'08','TUPAC AMARU','080508',1)
,(737,73,'01','SICUANI','080601',1)
,(738,73,'02','CHECACUPE','080602',1)
,(739,73,'03','COMBAPATA','080603',1)
,(740,73,'04','MARANGANI','080604',1)
,(741,73,'05','PITUMARCA','080605',1)
,(742,73,'06','SAN PABLO','080606',1)
,(743,73,'07','SAN PEDRO','080607',1)
,(744,73,'08','TINTA','080608',1)
,(745,74,'01','SANTO TOMAS','080701',1)
,(746,74,'02','CAPACMARCA','080702',1)
,(747,74,'03','CHAMACA','080703',1)
,(748,74,'04','COLQUEMARCA','080704',1)
,(749,74,'05','LIVITACA','080705',1)
,(750,74,'06','LLUSCO','080706',1)
,(751,74,'07','QUIÑOTA','080707',1)
,(752,74,'08','VELILLE','080708',1)
,(753,75,'01','ESPINAR','080801',1)
,(754,75,'02','CONDOROMA','080802',1)
,(755,75,'03','COPORAQUE','080803',1)
,(756,75,'04','OCORURO','080804',1)
,(757,75,'05','PALLPATA','080805',1)
,(758,75,'06','PICHIGUA','080806',1)
,(759,75,'07','SUYCKUTAMBO','080807',1)
,(760,75,'08','ALTO PICHIGUA','080808',1)
,(761,76,'01','SANTA ANA','080901',1)
,(762,76,'02','ECHARATE','080902',1)
,(763,76,'03','HUAYOPATA','080903',1)
,(764,76,'04','MARANURA','080904',1)
,(765,76,'05','OCOBAMBA','080905',1)
,(766,76,'06','QUELLOUNO','080906',1)
,(767,76,'07','KIMBIRI','080907',1)
,(768,76,'08','SANTA TERESA','080908',1)
,(769,76,'09','VILCABAMBA','080909',1)
,(770,76,'10','PICHARI','080910',1)
,(771,76,'11','INKAWASI','080911',1)
,(772,76,'12','VILLA VIRGEN','080912',1)
,(773,76,'13','VILLA KINTIARINA','080913',1)
,(774,76,'14','MEGANTONI','080914',1)
,(775,77,'01','PARURO','081001',1)
,(776,77,'02','ACCHA','081002',1)
,(777,77,'03','CCAPI','081003',1)
,(778,77,'04','COLCHA','081004',1)
,(779,77,'05','HUANOQUITE','081005',1)
,(780,77,'06','OMACHA','081006',1)
,(781,77,'07','PACCARITAMBO','081007',1)
,(782,77,'08','PILLPINTO','081008',1)
,(783,77,'09','YAURISQUE','081009',1)
,(784,78,'01','PAUCARTAMBO','081101',1)
,(785,78,'02','CAICAY','081102',1)
,(786,78,'03','CHALLABAMBA','081103',1)
,(787,78,'04','COLQUEPATA','081104',1)
,(788,78,'05','HUANCARANI','081105',1)
,(789,78,'06','KOSÑIPATA','081106',1)
,(790,79,'01','URCOS','081201',1)
,(791,79,'02','ANDAHUAYLILLAS','081202',1)
,(792,79,'03','CAMANTI','081203',1)
,(793,79,'04','CCARHUAYO','081204',1)
,(794,79,'05','CCATCA','081205',1)
,(795,79,'06','CUSIPATA','081206',1)
,(796,79,'07','HUARO','081207',1)
,(797,79,'08','LUCRE','081208',1)
,(798,79,'09','MARCAPATA','081209',1)
,(799,79,'10','OCONGATE','081210',1)
,(800,79,'11','OROPESA','081211',1)
,(801,79,'12','QUIQUIJANA','081212',1)
,(802,80,'01','URUBAMBA','081301',1)
,(803,80,'02','CHINCHERO','081302',1)
,(804,80,'03','HUAYLLABAMBA','081303',1)
,(805,80,'04','MACHUPICCHU','081304',1)
,(806,80,'05','MARAS','081305',1)
,(807,80,'06','OLLANTAYTAMBO','081306',1)
,(808,80,'07','YUCAY','081307',1)
,(809,81,'01','HUANCAVELICA','090101',1)
,(810,81,'02','ACOBAMBILLA','090102',1)
,(811,81,'03','ACORIA','090103',1)
,(812,81,'04','CONAYCA','090104',1)
,(813,81,'05','CUENCA','090105',1)
,(814,81,'06','HUACHOCOLPA','090106',1)
,(815,81,'07','HUAYLLAHUARA','090107',1)
,(816,81,'08','IZCUCHACA','090108',1)
,(817,81,'09','LARIA','090109',1)
,(818,81,'10','MANTA','090110',1)
,(819,81,'11','MARISCAL CÁCERES','090111',1)
,(820,81,'12','MOYA','090112',1)
,(821,81,'13','NUEVO OCCORO','090113',1)
,(822,81,'14','PALCA','090114',1)
,(823,81,'15','PILCHACA','090115',1)
,(824,81,'16','VILCA','090116',1)
,(825,81,'17','YAULI','090117',1)
,(826,81,'18','ASCENSIÓN','090118',1)
,(827,81,'19','HUANDO','090119',1)
,(828,82,'01','ACOBAMBA','090201',1)
,(829,82,'02','ANDABAMBA','090202',1)
,(830,82,'03','ANTA','090203',1)
,(831,82,'04','CAJA','090204',1)
,(832,82,'05','MARCAS','090205',1)
,(833,82,'06','PAUCARA','090206',1)
,(834,82,'07','POMACOCHA','090207',1)
,(835,82,'08','ROSARIO','090208',1)
,(836,83,'01','LIRCAY','090301',1)
,(837,83,'02','ANCHONGA','090302',1)
,(838,83,'03','CALLANMARCA','090303',1)
,(839,83,'04','CCOCHACCASA','090304',1)
,(840,83,'05','CHINCHO','090305',1)
,(841,83,'06','CONGALLA','090306',1)
,(842,83,'07','HUANCA-HUANCA','090307',1)
,(843,83,'08','HUAYLLAY GRANDE','090308',1)
,(844,83,'09','JULCAMARCA','090309',1)
,(845,83,'10','SAN ANTONIO DE ANTAPARCO','090310',1)
,(846,83,'11','SANTO TOMAS DE PATA','090311',1)
,(847,83,'12','SECCLLA','090312',1)
,(848,84,'01','CASTROVIRREYNA','090401',1)
,(849,84,'02','ARMA','090402',1)
,(850,84,'03','AURAHUA','090403',1)
,(851,84,'04','CAPILLAS','090404',1)
,(852,84,'05','CHUPAMARCA','090405',1)
,(853,84,'06','COCAS','090406',1)
,(854,84,'07','HUACHOS','090407',1)
,(855,84,'08','HUAMATAMBO','090408',1)
,(856,84,'09','MOLLEPAMPA','090409',1)
,(857,84,'10','SAN JUAN','090410',1)
,(858,84,'11','SANTA ANA','090411',1)
,(859,84,'12','TANTARA','090412',1)
,(860,84,'13','TICRAPO','090413',1)
,(861,85,'01','CHURCAMPA','090501',1)
,(862,85,'02','ANCO','090502',1)
,(863,85,'03','CHINCHIHUASI','090503',1)
,(864,85,'04','EL CARMEN','090504',1)
,(865,85,'05','LA MERCED','090505',1)
,(866,85,'06','LOCROJA','090506',1)
,(867,85,'07','PAUCARBAMBA','090507',1)
,(868,85,'08','SAN MIGUEL DE MAYOCC','090508',1)
,(869,85,'09','SAN PEDRO DE CORIS','090509',1)
,(870,85,'10','PACHAMARCA','090510',1)
,(871,85,'11','COSME','090511',1)
,(872,86,'01','HUAYTARA','090601',1)
,(873,86,'02','AYAVI','090602',1)
,(874,86,'03','CÓRDOVA','090603',1)
,(875,86,'04','HUAYACUNDO ARMA','090604',1)
,(876,86,'05','LARAMARCA','090605',1)
,(877,86,'06','OCOYO','090606',1)
,(878,86,'07','PILPICHACA','090607',1)
,(879,86,'08','QUERCO','090608',1)
,(880,86,'09','QUITO-ARMA','090609',1)
,(881,86,'10','SAN ANTONIO DE CUSICANCHA','090610',1)
,(882,86,'11','SAN FRANCISCO DE SANGAYAICO','090611',1)
,(883,86,'12','SAN ISIDRO','090612',1)
,(884,86,'13','SANTIAGO DE CHOCORVOS','090613',1)
,(885,86,'14','SANTIAGO DE QUIRAHUARA','090614',1)
,(886,86,'15','SANTO DOMINGO DE CAPILLAS','090615',1)
,(887,86,'16','TAMBO','090616',1)
,(888,87,'01','PAMPAS','090701',1)
,(889,87,'02','ACOSTAMBO','090702',1)
,(890,87,'03','ACRAQUIA','090703',1)
,(891,87,'04','AHUAYCHA','090704',1)
,(892,87,'05','COLCABAMBA','090705',1)
,(893,87,'06','DANIEL HERNÁNDEZ','090706',1)
,(894,87,'07','HUACHOCOLPA','090707',1)
,(895,87,'09','HUARIBAMBA','090709',1)
,(896,87,'10','ÑAHUIMPUQUIO','090710',1)
,(897,87,'11','PAZOS','090711',1)
,(898,87,'13','QUISHUAR','090713',1)
,(899,87,'14','SALCABAMBA','090714',1)
,(900,87,'15','SALCAHUASI','090715',1)
,(901,87,'16','SAN MARCOS DE ROCCHAC','090716',1)
,(902,87,'17','SURCUBAMBA','090717',1)
,(903,87,'18','TINTAY PUNCU','090718',1)
,(904,87,'19','QUICHUAS','090719',1)
,(905,87,'20','ANDAYMARCA','090720',1)
,(906,87,'21','ROBLE','090721',1)
,(907,87,'22','PICHOS','090722',1)
,(908,87,'23','SANTIAGO DE TUCUMA','090723',1)
,(909,88,'01','HUANUCO','100101',1)
,(910,88,'02','AMARILIS','100102',1)
,(911,88,'03','CHINCHAO','100103',1)
,(912,88,'04','CHURUBAMBA','100104',1)
,(913,88,'05','MARGOS','100105',1)
,(914,88,'06','QUISQUI (KICHKI)','100106',1)
,(915,88,'07','SAN FRANCISCO DE CAYRAN','100107',1)
,(916,88,'08','SAN PEDRO DE CHAULAN','100108',1)
,(917,88,'09','SANTA MARÍA DEL VALLE','100109',1)
,(918,88,'10','YARUMAYO','100110',1)
,(919,88,'11','PILLCO MARCA','100111',1)
,(920,88,'12','YACUS','100112',1)
,(921,88,'13','SAN PABLO DE PILLAO','100113',1)
,(922,89,'01','AMBO','100201',1)
,(923,89,'02','CAYNA','100202',1)
,(924,89,'03','COLPAS','100203',1)
,(925,89,'04','CONCHAMARCA','100204',1)
,(926,89,'05','HUACAR','100205',1)
,(927,89,'06','SAN FRANCISCO','100206',1)
,(928,89,'07','SAN RAFAEL','100207',1)
,(929,89,'08','TOMAY KICHWA','100208',1)
,(930,90,'01','LA UNIÓN','100301',1)
,(931,90,'07','CHUQUIS','100307',1)
,(932,90,'11','MARÍAS','100311',1)
,(933,90,'13','PACHAS','100313',1)
,(934,90,'16','QUIVILLA','100316',1)
,(935,90,'17','RIPAN','100317',1)
,(936,90,'21','SHUNQUI','100321',1)
,(937,90,'22','SILLAPATA','100322',1)
,(938,90,'23','YANAS','100323',1)
,(939,91,'01','HUACAYBAMBA','100401',1)
,(940,91,'02','CANCHABAMBA','100402',1)
,(941,91,'03','COCHABAMBA','100403',1)
,(942,91,'04','PINRA','100404',1)
,(943,92,'01','LLATA','100501',1)
,(944,92,'02','ARANCAY','100502',1)
,(945,92,'03','CHAVÍN DE PARIARCA','100503',1)
,(946,92,'04','JACAS GRANDE','100504',1)
,(947,92,'05','JIRCAN','100505',1)
,(948,92,'06','MIRAFLORES','100506',1)
,(949,92,'07','MONZÓN','100507',1)
,(950,92,'08','PUNCHAO','100508',1)
,(951,92,'09','PUÑOS','100509',1)
,(952,92,'10','SINGA','100510',1)
,(953,92,'11','TANTAMAYO','100511',1)
,(954,93,'01','RUPA-RUPA','100601',1)
,(955,93,'02','DANIEL ALOMÍA ROBLES','100602',1)
,(956,93,'03','HERMÍLIO VALDIZAN','100603',1)
,(957,93,'04','JOSÉ CRESPO Y CASTILLO','100604',1)
,(958,93,'05','LUYANDO','100605',1)
,(959,93,'06','MARIANO DAMASO BERAUN','100606',1)
,(960,93,'07','PUCAYACU','100607',1)
,(961,93,'08','CASTILLO GRANDE','100608',1)
,(962,93,'09','PUEBLO NUEVO','100609',1)
,(963,93,'10','SANTO DOMINGO DE ANDA','100610',1)
,(964,94,'01','HUACRACHUCO','100701',1)
,(965,94,'02','CHOLON','100702',1)
,(966,94,'03','SAN BUENAVENTURA','100703',1)
,(967,94,'04','LA MORADA','100704',1)
,(968,94,'05','SANTA ROSA DE ALTO YANAJANCA','100705',1)
,(969,95,'01','PANAO','100801',1)
,(970,95,'02','CHAGLLA','100802',1)
,(971,95,'03','MOLINO','100803',1)
,(972,95,'04','UMARI','100804',1)
,(973,96,'01','PUERTO INCA','100901',1)
,(974,96,'02','CODO DEL POZUZO','100902',1)
,(975,96,'03','HONORIA','100903',1)
,(976,96,'04','TOURNAVISTA','100904',1)
,(977,96,'05','YUYAPICHIS','100905',1)
,(978,97,'01','JESÚS','101001',1)
,(979,97,'02','BAÑOS','101002',1)
,(980,97,'03','JIVIA','101003',1)
,(981,97,'04','QUEROPALCA','101004',1)
,(982,97,'05','RONDOS','101005',1)
,(983,97,'06','SAN FRANCISCO DE ASÍS','101006',1)
,(984,97,'07','SAN MIGUEL DE CAURI','101007',1)
,(985,98,'01','CHAVINILLO','101101',1)
,(986,98,'02','CAHUAC','101102',1)
,(987,98,'03','CHACABAMBA','101103',1)
,(988,98,'04','APARICIO POMARES','101104',1)
,(989,98,'05','JACAS CHICO','101105',1)
,(990,98,'06','OBAS','101106',1)
,(991,98,'07','PAMPAMARCA','101107',1)
,(992,98,'08','CHORAS','101108',1)
,(993,99,'01','ICA','110101',1)
,(994,99,'02','LA TINGUIÑA','110102',1)
,(995,99,'03','LOS AQUIJES','110103',1)
,(996,99,'04','OCUCAJE','110104',1)
,(997,99,'05','PACHACUTEC','110105',1)
,(998,99,'06','PARCONA','110106',1)
,(999,99,'07','PUEBLO NUEVO','110107',1)
,(1000,99,'08','SALAS','110108',1)
,(1001,99,'09','SAN JOSÉ DE LOS MOLINOS','110109',1)
,(1002,99,'10','SAN JUAN BAUTISTA','110110',1)
,(1003,99,'11','SANTIAGO','110111',1)
,(1004,99,'12','SUBTANJALLA','110112',1)
,(1005,99,'13','TATE','110113',1)
,(1006,99,'14','YAUCA DEL ROSARIO','110114',1)
,(1007,100,'01','CHINCHA ALTA','110201',1)
,(1008,100,'02','ALTO LARAN','110202',1)
,(1009,100,'03','CHAVIN','110203',1)
,(1010,100,'04','CHINCHA BAJA','110204',1)
,(1011,100,'05','EL CARMEN','110205',1)
,(1012,100,'06','GROCIO PRADO','110206',1)
,(1013,100,'07','PUEBLO NUEVO','110207',1)
,(1014,100,'08','SAN JUAN DE YANAC','110208',1)
,(1015,100,'09','SAN PEDRO DE HUACARPANA','110209',1)
,(1016,100,'10','SUNAMPE','110210',1)
,(1017,100,'11','TAMBO DE MORA','110211',1)
,(1018,101,'01','NASCA','110301',1)
,(1019,101,'02','CHANGUILLO','110302',1)
,(1020,101,'03','EL INGENIO','110303',1)
,(1021,101,'04','MARCONA','110304',1)
,(1022,101,'05','VISTA ALEGRE','110305',1)
,(1023,102,'01','PALPA','110401',1)
,(1024,102,'02','LLIPATA','110402',1)
,(1025,102,'03','RÍO GRANDE','110403',1)
,(1026,102,'04','SANTA CRUZ','110404',1)
,(1027,102,'05','TIBILLO','110405',1)
,(1028,103,'01','PISCO','110501',1)
,(1029,103,'02','HUANCANO','110502',1)
,(1030,103,'03','HUMAY','110503',1)
,(1031,103,'04','INDEPENDENCIA','110504',1)
,(1032,103,'05','PARACAS','110505',1)
,(1033,103,'06','SAN ANDRÉS','110506',1)
,(1034,103,'07','SAN CLEMENTE','110507',1)
,(1035,103,'08','TUPAC AMARU INCA','110508',1)
,(1036,104,'01','HUANCAYO','120101',1)
,(1037,104,'04','CARHUACALLANGA','120104',1)
,(1038,104,'05','CHACAPAMPA','120105',1)
,(1039,104,'06','CHICCHE','120106',1)
,(1040,104,'07','CHILCA','120107',1)
,(1041,104,'08','CHONGOS ALTO','120108',1)
,(1042,104,'11','CHUPURO','120111',1)
,(1043,104,'12','COLCA','120112',1)
,(1044,104,'13','CULLHUAS','120113',1)
,(1045,104,'14','EL TAMBO','120114',1)
,(1046,104,'16','HUACRAPUQUIO','120116',1)
,(1047,104,'17','HUALHUAS','120117',1)
,(1048,104,'19','HUANCAN','120119',1)
,(1049,104,'20','HUASICANCHA','120120',1)
,(1050,104,'21','HUAYUCACHI','120121',1)
,(1051,104,'22','INGENIO','120122',1)
,(1052,104,'24','PARIAHUANCA','120124',1)
,(1053,104,'25','PILCOMAYO','120125',1)
,(1054,104,'26','PUCARA','120126',1)
,(1055,104,'27','QUICHUAY','120127',1)
,(1056,104,'28','QUILCAS','120128',1)
,(1057,104,'29','SAN AGUSTÍN','120129',1)
,(1058,104,'30','SAN JERÓNIMO DE TUNAN','120130',1)
,(1059,104,'32','SAÑO','120132',1)
,(1060,104,'33','SAPALLANGA','120133',1)
,(1061,104,'34','SICAYA','120134',1)
,(1062,104,'35','SANTO DOMINGO DE ACOBAMBA','120135',1)
,(1063,104,'36','VIQUES','120136',1)
,(1064,105,'01','CONCEPCIÓN','120201',1)
,(1065,105,'02','ACO','120202',1)
,(1066,105,'03','ANDAMARCA','120203',1)
,(1067,105,'04','CHAMBARA','120204',1)
,(1068,105,'05','COCHAS','120205',1)
,(1069,105,'06','COMAS','120206',1)
,(1070,105,'07','HEROÍNAS TOLEDO','120207',1)
,(1071,105,'08','MANZANARES','120208',1)
,(1072,105,'09','MARISCAL CASTILLA','120209',1)
,(1073,105,'10','MATAHUASI','120210',1)
,(1074,105,'11','MITO','120211',1)
,(1075,105,'12','NUEVE DE JULIO','120212',1)
,(1076,105,'13','ORCOTUNA','120213',1)
,(1077,105,'14','SAN JOSÉ DE QUERO','120214',1)
,(1078,105,'15','SANTA ROSA DE OCOPA','120215',1)
,(1079,106,'01','CHANCHAMAYO','120301',1)
,(1080,106,'02','PERENE','120302',1)
,(1081,106,'03','PICHANAQUI','120303',1)
,(1082,106,'04','SAN LUIS DE SHUARO','120304',1)
,(1083,106,'05','SAN RAMÓN','120305',1)
,(1084,106,'06','VITOC','120306',1)
,(1085,107,'01','JAUJA','120401',1)
,(1086,107,'02','ACOLLA','120402',1)
,(1087,107,'03','APATA','120403',1)
,(1088,107,'04','ATAURA','120404',1)
,(1089,107,'05','CANCHAYLLO','120405',1)
,(1090,107,'06','CURICACA','120406',1)
,(1091,107,'07','EL MANTARO','120407',1)
,(1092,107,'08','HUAMALI','120408',1)
,(1093,107,'09','HUARIPAMPA','120409',1)
,(1094,107,'10','HUERTAS','120410',1)
,(1095,107,'11','JANJAILLO','120411',1)
,(1096,107,'12','JULCÁN','120412',1)
,(1097,107,'13','LEONOR ORDÓÑEZ','120413',1)
,(1098,107,'14','LLOCLLAPAMPA','120414',1)
,(1099,107,'15','MARCO','120415',1)
,(1100,107,'16','MASMA','120416',1)
,(1101,107,'17','MASMA CHICCHE','120417',1)
,(1102,107,'18','MOLINOS','120418',1)
,(1103,107,'19','MONOBAMBA','120419',1)
,(1104,107,'20','MUQUI','120420',1)
,(1105,107,'21','MUQUIYAUYO','120421',1)
,(1106,107,'22','PACA','120422',1)
,(1107,107,'23','PACCHA','120423',1)
,(1108,107,'24','PANCAN','120424',1)
,(1109,107,'25','PARCO','120425',1)
,(1110,107,'26','POMACANCHA','120426',1)
,(1111,107,'27','RICRAN','120427',1)
,(1112,107,'28','SAN LORENZO','120428',1)
,(1113,107,'29','SAN PEDRO DE CHUNAN','120429',1)
,(1114,107,'30','SAUSA','120430',1)
,(1115,107,'31','SINCOS','120431',1)
,(1116,107,'32','TUNAN MARCA','120432',1)
,(1117,107,'33','YAULI','120433',1)
,(1118,107,'34','YAUYOS','120434',1)
,(1119,108,'01','JUNIN','120501',1)
,(1120,108,'02','CARHUAMAYO','120502',1)
,(1121,108,'03','ONDORES','120503',1)
,(1122,108,'04','ULCUMAYO','120504',1)
,(1123,109,'01','SATIPO','120601',1)
,(1124,109,'02','COVIRIALI','120602',1)
,(1125,109,'03','LLAYLLA','120603',1)
,(1126,109,'04','MAZAMARI','120604',1)
,(1127,109,'05','PAMPA HERMOSA','120605',1)
,(1128,109,'06','PANGOA','120606',1)
,(1129,109,'07','RÍO NEGRO','120607',1)
,(1130,109,'08','RÍO TAMBO','120608',1)
,(1131,109,'09','VIZCATAN DEL ENE','120609',1)
,(1132,110,'01','TARMA','120701',1)
,(1133,110,'02','ACOBAMBA','120702',1)
,(1134,110,'03','HUARICOLCA','120703',1)
,(1135,110,'04','HUASAHUASI','120704',1)
,(1136,110,'05','LA UNIÓN','120705',1)
,(1137,110,'06','PALCA','120706',1)
,(1138,110,'07','PALCAMAYO','120707',1)
,(1139,110,'08','SAN PEDRO DE CAJAS','120708',1)
,(1140,110,'09','TAPO','120709',1)
,(1141,111,'01','LA OROYA','120801',1)
,(1142,111,'02','CHACAPALPA','120802',1)
,(1143,111,'03','HUAY-HUAY','120803',1)
,(1144,111,'04','MARCAPOMACOCHA','120804',1)
,(1145,111,'05','MOROCOCHA','120805',1)
,(1146,111,'06','PACCHA','120806',1)
,(1147,111,'07','SANTA BÁRBARA DE CARHUACAYAN','120807',1)
,(1148,111,'08','SANTA ROSA DE SACCO','120808',1)
,(1149,111,'09','SUITUCANCHA','120809',1)
,(1150,111,'10','YAULI','120810',1)
,(1151,112,'01','CHUPACA','120901',1)
,(1152,112,'02','AHUAC','120902',1)
,(1153,112,'03','CHONGOS BAJO','120903',1)
,(1154,112,'04','HUACHAC','120904',1)
,(1155,112,'05','HUAMANCACA CHICO','120905',1)
,(1156,112,'06','SAN JUAN DE ISCOS','120906',1);

INSERT INTO t_cities VALUES (1157,112,'07','SAN JUAN DE JARPA','120907',1)
,(1158,112,'08','TRES DE DICIEMBRE','120908',1)
,(1159,112,'09','YANACANCHA','120909',1)
,(1160,113,'01','TRUJILLO','130101',1)
,(1161,113,'02','EL PORVENIR','130102',1)
,(1162,113,'03','FLORENCIA DE MORA','130103',1)
,(1163,113,'04','HUANCHACO','130104',1)
,(1164,113,'05','LA ESPERANZA','130105',1)
,(1165,113,'06','LAREDO','130106',1)
,(1166,113,'07','MOCHE','130107',1)
,(1167,113,'08','POROTO','130108',1)
,(1168,113,'09','SALAVERRY','130109',1)
,(1169,113,'10','SIMBAL','130110',1)
,(1170,113,'11','VICTOR LARCO HERRERA','130111',1)
,(1171,114,'01','ASCOPE','130201',1)
,(1172,114,'02','CHICAMA','130202',1)
,(1173,114,'03','CHOCOPE','130203',1)
,(1174,114,'04','MAGDALENA DE CAO','130204',1)
,(1175,114,'05','PAIJAN','130205',1)
,(1176,114,'06','RAZURI','130206',1)
,(1177,114,'07','SANTIAGO DE CAO','130207',1)
,(1178,114,'08','CASA GRANDE','130208',1)
,(1179,115,'01','BOLIVAR','130301',1)
,(1180,115,'02','BAMBAMARCA','130302',1)
,(1181,115,'03','CONDORMARCA','130303',1)
,(1182,115,'04','LONGOTEA','130304',1)
,(1183,115,'05','UCHUMARCA','130305',1)
,(1184,115,'06','UCUNCHA','130306',1)
,(1185,116,'01','CHEPEN','130401',1)
,(1186,116,'02','PACANGA','130402',1)
,(1187,116,'03','PUEBLO NUEVO','130403',1)
,(1188,117,'01','JULCAN','130501',1)
,(1189,117,'02','CALAMARCA','130502',1)
,(1190,117,'03','CARABAMBA','130503',1)
,(1191,117,'04','HUASO','130504',1)
,(1192,118,'01','OTUZCO','130601',1)
,(1193,118,'02','AGALLPAMPA','130602',1)
,(1194,118,'04','CHARAT','130604',1)
,(1195,118,'05','HUARANCHAL','130605',1)
,(1196,118,'06','LA CUESTA','130606',1)
,(1197,118,'08','MACHE','130608',1)
,(1198,118,'10','PARANDAY','130610',1)
,(1199,118,'11','SALPO','130611',1)
,(1200,118,'13','SINSICAP','130613',1)
,(1201,118,'14','USQUIL','130614',1)
,(1202,119,'01','SAN PEDRO DE LLOC','130701',1)
,(1203,119,'02','GUADALUPE','130702',1)
,(1204,119,'03','JEQUETEPEQUE','130703',1)
,(1205,119,'04','PACASMAYO','130704',1)
,(1206,119,'05','SAN JOSE','130705',1)
,(1207,120,'01','TAYABAMBA','130801',1)
,(1208,120,'02','BULDIBUYO','130802',1)
,(1209,120,'03','CHILLIA','130803',1)
,(1210,120,'04','HUANCASPATA','130804',1)
,(1211,120,'05','HUAYLILLAS','130805',1)
,(1212,120,'06','HUAYO','130806',1)
,(1213,120,'07','ONGON','130807',1)
,(1214,120,'08','PARCOY','130808',1)
,(1215,120,'09','PATAZ','130809',1)
,(1216,120,'10','PIAS','130810',1)
,(1217,120,'11','SANTIAGO DE CHALLAS','130811',1)
,(1218,120,'12','TAURIJA','130812',1)
,(1219,120,'13','URPAY','130813',1)
,(1220,121,'01','HUAMACHUCO','130901',1)
,(1221,121,'02','CHUGAY','130902',1)
,(1222,121,'03','COCHORCO','130903',1)
,(1223,121,'04','CURGOS','130904',1)
,(1224,121,'05','MARCABAL','130905',1)
,(1225,121,'06','SANAGORAN','130906',1)
,(1226,121,'07','SARIN','130907',1)
,(1227,121,'08','SARTIMBAMBA','130908',1)
,(1228,122,'01','SANTIAGO DE CHUCO','131001',1)
,(1229,122,'02','ANGASMARCA','131002',1)
,(1230,122,'03','CACHICADAN','131003',1)
,(1231,122,'04','MOLLEBAMBA','131004',1)
,(1232,122,'05','MOLLEPATA','131005',1)
,(1233,122,'06','QUIRUVILCA','131006',1)
,(1234,122,'07','SANTA CRUZ DE CHUCA','131007',1)
,(1235,122,'08','SITABAMBA','131008',1)
,(1236,123,'01','CASCAS','131101',1)
,(1237,123,'02','LUCMA','131102',1)
,(1238,123,'03','MARMOT','131103',1)
,(1239,123,'04','SAYAPULLO','131104',1)
,(1240,124,'01','VIRU','131201',1)
,(1241,124,'02','CHAO','131202',1)
,(1242,124,'03','GUADALUPITO','131203',1)
,(1243,125,'01','CHICLAYO','140101',1)
,(1244,125,'02','CHONGOYAPE','140102',1)
,(1245,125,'03','ETEN','140103',1)
,(1246,125,'04','ETEN PUERTO','140104',1)
,(1247,125,'05','JOSE LEONARDO ORTIZ','140105',1)
,(1248,125,'06','LA VICTORIA','140106',1)
,(1249,125,'07','LAGUNAS','140107',1)
,(1250,125,'08','MONSEFU','140108',1)
,(1251,125,'09','NUEVA ARICA','140109',1)
,(1252,125,'10','OYOTUN','140110',1)
,(1253,125,'11','PICSI','140111',1)
,(1254,125,'12','PIMENTEL','140112',1)
,(1255,125,'13','REQUE','140113',1)
,(1256,125,'14','SANTA ROSA','140114',1)
,(1257,125,'15','SAÑA','140115',1)
,(1258,125,'16','CAYALTI','140116',1)
,(1259,125,'17','PATAPO','140117',1)
,(1260,125,'18','POMALCA','140118',1)
,(1261,125,'19','PUCALA','140119',1)
,(1262,125,'20','TUMAN','140120',1)
,(1263,126,'01','FERREÑAFE','140201',1)
,(1264,126,'02','CAÑARIS','140202',1)
,(1265,126,'03','INCAHUASI','140203',1)
,(1266,126,'04','MANUEL ANTONIO MESONES MURO','140204',1)
,(1267,126,'05','PITIPO','140205',1)
,(1268,126,'06','PUEBLO NUEVO','140206',1)
,(1269,127,'01','LAMBAYEQUE','140301',1)
,(1270,127,'02','CHOCHOPE','140302',1)
,(1271,127,'03','ILLIMO','140303',1)
,(1272,127,'04','JAYANCA','140304',1)
,(1273,127,'05','MOCHUMI','140305',1)
,(1274,127,'06','MORROPE','140306',1)
,(1275,127,'07','MOTUPE','140307',1)
,(1276,127,'08','OLMOS','140308',1)
,(1277,127,'09','PACORA','140309',1)
,(1278,127,'10','SALAS','140310',1)
,(1279,127,'11','SAN JOSE','140311',1)
,(1280,127,'12','TUCUME','140312',1)
,(1281,128,'01','LIMA','150101',1)
,(1282,128,'02','ANCON','150102',1)
,(1283,128,'03','ATE','150103',1)
,(1284,128,'04','BARRANCO','150104',1)
,(1285,128,'05','BREÑA','150105',1)
,(1286,128,'06','CARABAYLLO','150106',1)
,(1287,128,'07','CHACLACAYO','150107',1)
,(1288,128,'08','CHORRILLOS','150108',1)
,(1289,128,'09','CIENEGUILLA','150109',1)
,(1290,128,'10','COMAS','150110',1)
,(1291,128,'11','EL AGUSTINO','150111',1)
,(1292,128,'12','INDEPENDENCIA','150112',1)
,(1293,128,'13','JESUS MARIA','150113',1)
,(1294,128,'14','LA MOLINA','150114',1)
,(1295,128,'15','LA VICTORIA','150115',1)
,(1296,128,'16','LINCE','150116',1)
,(1297,128,'17','LOS OLIVOS','150117',1)
,(1298,128,'18','LURIGANCHO','150118',1)
,(1299,128,'19','LURIN','150119',1)
,(1300,128,'20','MAGDALENA DEL MAR','150120',1)
,(1301,128,'21','PUEBLO LIBRE','150121',1)
,(1302,128,'22','MIRAFLORES','150122',1)
,(1303,128,'23','PACHACAMAC','150123',1)
,(1304,128,'24','PUCUSANA','150124',1)
,(1305,128,'25','PUENTE PIEDRA','150125',1)
,(1306,128,'26','PUNTA HERMOSA','150126',1)
,(1307,128,'27','PUNTA NEGRA','150127',1)
,(1308,128,'28','RIMAC','150128',1)
,(1309,128,'29','SAN BARTOLO','150129',1)
,(1310,128,'30','SAN BORJA','150130',1)
,(1311,128,'31','SAN ISIDRO','150131',1)
,(1312,128,'32','SAN JUAN DE LURIGANCHO','150132',1)
,(1313,128,'33','SAN JUAN DE MIRAFLORES','150133',1)
,(1314,128,'34','SAN LUIS','150134',1)
,(1315,128,'35','SAN MARTIN DE PORRES','150135',1)
,(1316,128,'36','SAN MIGUEL','150136',1)
,(1317,128,'37','SANTA ANITA','150137',1)
,(1318,128,'38','SANTA MARÍA DEL MAR','150138',1)
,(1319,128,'39','SANTA ROSA','150139',1)
,(1320,128,'40','SANTIAGO DE SURCO','150140',1)
,(1321,128,'41','SURQUILLO','150141',1)
,(1322,128,'42','VILLA EL SALVADOR','150142',1)
,(1323,128,'43','VILLA MARIA DEL TRIUNFO','150143',1)
,(1324,129,'01','BARRANCA','150201',1)
,(1325,129,'02','PARAMONGA','150202',1)
,(1326,129,'03','PATIVILCA','150203',1)
,(1327,129,'04','SUPE','150204',1)
,(1328,129,'05','SUPE PUERTO','150205',1)
,(1329,130,'01','CAJATAMBO','150301',1)
,(1330,130,'02','COPA','150302',1)
,(1331,130,'03','GORGOR','150303',1)
,(1332,130,'04','HUANCAPON','150304',1)
,(1333,130,'05','MANAS','150305',1)
,(1334,131,'01','CANTA','150401',1)
,(1335,131,'02','ARAHUAY','150402',1)
,(1336,131,'03','HUAMANTANGA','150403',1)
,(1337,131,'04','HUAROS','150404',1)
,(1338,131,'05','LACHAQUI','150405',1)
,(1339,131,'06','SAN BUENAVENTURA','150406',1)
,(1340,131,'07','SANTA ROSA DE QUIVES','150407',1)
,(1341,132,'01','SAN VICENTE DE CAÑETE','150501',1)
,(1342,132,'02','ASIA','150502',1)
,(1343,132,'03','CALANGO','150503',1)
,(1344,132,'04','CERRO AZUL','150504',1)
,(1345,132,'05','CHILCA','150505',1)
,(1346,132,'06','COAYLLO','150506',1)
,(1347,132,'07','IMPERIAL','150507',1)
,(1348,132,'08','LUNAHUANA','150508',1)
,(1349,132,'09','MALA','150509',1)
,(1350,132,'10','NUEVO IMPERIAL','150510',1)
,(1351,132,'11','PACARAN','150511',1)
,(1352,132,'12','QUILMANA','150512',1)
,(1353,132,'13','SAN ANTONIO','150513',1)
,(1354,132,'14','SAN LUIS','150514',1)
,(1355,132,'15','SANTA CRUZ DE FLORES','150515',1)
,(1356,132,'16','ZUÑIGA','150516',1)
,(1357,133,'01','HUARAL','150601',1)
,(1358,133,'02','ATAVILLOS ALTO','150602',1)
,(1359,133,'03','ATAVILLOS BAJO','150603',1)
,(1360,133,'04','AUCALLAMA','150604',1)
,(1361,133,'05','CHANCAY','150605',1)
,(1362,133,'06','IHUARI','150606',1)
,(1363,133,'07','LAMPIAN','150607',1)
,(1364,133,'08','PACARAOS','150608',1)
,(1365,133,'09','SAN MIGUEL DE ACOS','150609',1)
,(1366,133,'10','SANTA CRUZ DE ANDAMARCA','150610',1)
,(1367,133,'11','SUMBILCA','150611',1)
,(1368,133,'12','VEINTISIETE DE NOVIEMBRE','150612',1)
,(1369,134,'01','MATUCANA','150701',1)
,(1370,134,'02','ANTIOQUIA','150702',1)
,(1371,134,'03','CALLAHUANCA','150703',1)
,(1372,134,'04','CARAMPOMA','150704',1)
,(1373,134,'05','CHICLA','150705',1)
,(1374,134,'06','CUENCA','150706',1)
,(1375,134,'07','HUACHUPAMPA','150707',1)
,(1376,134,'08','HUANZA','150708',1)
,(1377,134,'09','HUAROCHIRI','150709',1)
,(1378,134,'10','LAHUAYTAMBO','150710',1)
,(1379,134,'11','LANGA','150711',1)
,(1380,134,'12','LARAOS','150712',1)
,(1381,134,'13','MARIATANA','150713',1)
,(1382,134,'14','RICARDO PALMA','150714',1)
,(1383,134,'15','SAN ANDRES DE TUPICOCHA','150715',1)
,(1384,134,'16','SAN ANTONIO','150716',1)
,(1385,134,'17','SAN BARTOLOMÉ','150717',1)
,(1386,134,'18','SAN DAMIAN','150718',1)
,(1387,134,'19','SAN JUAN DE IRIS','150719',1)
,(1388,134,'20','SAN JUAN DE TANTARANCHE','150720',1)
,(1389,134,'21','SAN LORENZO DE QUINTI','150721',1)
,(1390,134,'22','SAN MATEO','150722',1)
,(1391,134,'23','SAN MATEO DE OTAO','150723',1)
,(1392,134,'24','SAN PEDRO DE CASTA','150724',1)
,(1393,134,'25','SAN PEDRO DE HUANCAYRE','150725',1)
,(1394,134,'26','SANGALLAYA','150726',1)
,(1395,134,'27','SANTA CRUZ DE COCACHACRA','150727',1)
,(1396,134,'28','SANTA EULALIA','150728',1)
,(1397,134,'29','SANTIAGO DE ANCHUCAYA','150729',1)
,(1398,134,'30','SANTIAGO DE TUNA','150730',1)
,(1399,134,'31','SANTO DOMINGO DE LOS OLLEROS','150731',1)
,(1400,134,'32','SURCO','150732',1)
,(1401,135,'01','HUACHO','150801',1)
,(1402,135,'02','AMBAR','150802',1)
,(1403,135,'03','CALETA DE CARQUIN','150803',1)
,(1404,135,'04','CHECRAS','150804',1)
,(1405,135,'05','HUALMAY','150805',1)
,(1406,135,'06','HUAURA','150806',1)
,(1407,135,'07','LEONCIO PRADO','150807',1)
,(1408,135,'08','PACCHO','150808',1)
,(1409,135,'09','SANTA LEONOR','150809',1)
,(1410,135,'10','SANTA MARÍA','150810',1)
,(1411,135,'11','SAYAN','150811',1)
,(1412,135,'12','VEGUETA','150812',1)
,(1413,136,'01','OYON','150901',1)
,(1414,136,'02','ANDAJES','150902',1)
,(1415,136,'03','CAUJUL','150903',1)
,(1416,136,'04','COCHAMARCA','150904',1)
,(1417,136,'05','NAVAN','150905',1)
,(1418,136,'06','PACHANGARA','150906',1)
,(1419,137,'01','YAUYOS','151001',1)
,(1420,137,'02','ALIS','151002',1)
,(1421,137,'03','ALLAUCA','151003',1)
,(1422,137,'04','AYAVIRI','151004',1)
,(1423,137,'05','AZANGARO','151005',1)
,(1424,137,'06','CACRA','151006',1)
,(1425,137,'07','CARANIA','151007',1)
,(1426,137,'08','CATAHUASI','151008',1)
,(1427,137,'09','CHOCOS','151009',1)
,(1428,137,'10','COCHAS','151010',1)
,(1429,137,'11','COLONIA','151011',1)
,(1430,137,'12','HONGOS','151012',1)
,(1431,137,'13','HUAMPARA','151013',1)
,(1432,137,'14','HUANCAYA','151014',1)
,(1433,137,'15','HUANGASCAR','151015',1)
,(1434,137,'16','HUANTAN','151016',1)
,(1435,137,'17','HUAÑEC','151017',1)
,(1436,137,'18','LARAOS','151018',1)
,(1437,137,'19','LINCHA','151019',1)
,(1438,137,'20','MADEAN','151020',1)
,(1439,137,'21','MIRAFLORES','151021',1)
,(1440,137,'22','OMAS','151022',1)
,(1441,137,'23','PUTINZA','151023',1)
,(1442,137,'24','QUINCHES','151024',1)
,(1443,137,'25','QUINOCAY','151025',1)
,(1444,137,'26','SAN JOAQUIN','151026',1)
,(1445,137,'27','SAN PEDRO DE PILAS','151027',1)
,(1446,137,'28','TANTA','151028',1)
,(1447,137,'29','TAURIPAMPA','151029',1)
,(1448,137,'30','TOMAS','151030',1)
,(1449,137,'31','TUPE','151031',1)
,(1450,137,'32','VIÑAC','151032',1)
,(1451,137,'33','VITIS','151033',1)
,(1452,138,'01','IQUITOS','160101',1)
,(1453,138,'02','ALTO NANAY','160102',1)
,(1454,138,'03','FERNANDO LORES','160103',1)
,(1455,138,'04','INDIANA','160104',1)
,(1456,138,'05','LAS AMAZONAS','160105',1)
,(1457,138,'06','MAZAN','160106',1)
,(1458,138,'07','NAPO','160107',1)
,(1459,138,'08','PUNCHANA','160108',1)
,(1460,138,'10','TORRES CAUSANA','160110',1)
,(1461,138,'12','BELEN','160112',1)
,(1462,138,'13','SAN JUAN BAUTISTA','160113',1)
,(1463,139,'01','YURIMAGUAS','160201',1)
,(1464,139,'02','BALSAPUERTO','160202',1)
,(1465,139,'05','JEBEROS','160205',1)
,(1466,139,'06','LAGUNAS','160206',1)
,(1467,139,'10','SANTA CRUZ','160210',1)
,(1468,139,'11','TENIENTE CESAR LOPEZ ROJAS','160211',1)
,(1469,140,'01','NAUTA','160301',1)
,(1470,140,'02','PARINARI','160302',1)
,(1471,140,'03','TIGRE','160303',1)
,(1472,140,'04','TROMPETEROS','160304',1)
,(1473,140,'05','URARINAS','160305',1)
,(1474,141,'01','RAMON CASTILLA','160401',1)
,(1475,141,'02','PEBAS','160402',1)
,(1476,141,'03','YAVARI','160403',1)
,(1477,141,'04','SAN PABLO','160404',1)
,(1478,142,'01','REQUENA','160501',1)
,(1479,142,'02','ALTO TAPICHE','160502',1)
,(1480,142,'03','CAPELO','160503',1)
,(1481,142,'04','EMILIO SAN MARTIN','160504',1)
,(1482,142,'05','MAQUIA','160505',1)
,(1483,142,'06','PUINAHUA','160506',1)
,(1484,142,'07','SAQUENA','160507',1)
,(1485,142,'08','SOPLIN','160508',1)
,(1486,142,'09','TAPICHE','160509',1)
,(1487,142,'10','JENARO HERRERA','160510',1)
,(1488,142,'11','YAQUERANA','160511',1)
,(1489,143,'01','CONTAMANA','160601',1)
,(1490,143,'02','INAHUAYA','160602',1)
,(1491,143,'03','PADRE MARQUEZ','160603',1)
,(1492,143,'04','PAMPA HERMOSA','160604',1)
,(1493,143,'05','SARAYACU','160605',1)
,(1494,143,'06','VARGAS GUERRA','160606',1)
,(1495,144,'01','BARRANCA','160701',1)
,(1496,144,'02','CAHUAPANAS','160702',1)
,(1497,144,'03','MANSERICHE','160703',1)
,(1498,144,'04','MORONA','160704',1)
,(1499,144,'05','PASTAZA','160705',1)
,(1500,144,'06','ANDOAS','160706',1)
,(1501,145,'01','PUTUMAYO','160801',1)
,(1502,145,'02','ROSA PANDURO','160802',1)
,(1503,145,'03','TENIENTE MANUEL CLAVERO','160803',1)
,(1504,145,'04','YAGUAS','160804',1)
,(1505,146,'01','TAMBOPATA','170101',1)
,(1506,146,'02','INAMBARI','170102',1)
,(1507,146,'03','LAS PIEDRAS','170103',1)
,(1508,146,'04','LABERINTO','170104',1)
,(1509,147,'01','MANU','170201',1)
,(1510,147,'02','FITZCARRALD','170202',1)
,(1511,147,'03','MADRE DE DIOS','170203',1)
,(1512,147,'04','HUEPETUHE','170204',1)
,(1513,148,'01','IÑAPARI','170301',1)
,(1514,148,'02','IBERIA','170302',1)
,(1515,148,'03','TAHUAMANU','170303',1)
,(1516,149,'01','MOQUEGUA','180101',1)
,(1517,149,'02','CARUMAS','180102',1)
,(1518,149,'03','CUCHUMBAYA','180103',1)
,(1519,149,'04','SAMEGUA','180104',1)
,(1520,149,'05','SAN CRISTOBAL','180105',1)
,(1521,149,'06','TORATA','180106',1)
,(1522,150,'01','OMATE','180201',1)
,(1523,150,'02','CHOJATA','180202',1)
,(1524,150,'03','COALAQUE','180203',1)
,(1525,150,'04','ICHUÑA','180204',1)
,(1526,150,'05','LA CAPILLA','180205',1)
,(1527,150,'06','LLOQUE','180206',1)
,(1528,150,'07','MATALAQUE','180207',1)
,(1529,150,'08','PUQUINA','180208',1)
,(1530,150,'09','QUINISTAQUILLAS','180209',1)
,(1531,150,'10','UBINAS','180210',1)
,(1532,150,'11','YUNGA','180211',1)
,(1533,151,'01','ILO','180301',1)
,(1534,151,'02','EL ALGARROBAL','180302',1)
,(1535,151,'03','PACOCHA','180303',1)
,(1536,152,'01','CHAUPIMARCA','190101',1)
,(1537,152,'02','HUACHON','190102',1)
,(1538,152,'03','HUARIACA','190103',1)
,(1539,152,'04','HUAYLLAY','190104',1)
,(1540,152,'05','NINACACA','190105',1)
,(1541,152,'06','PALLANCHACRA','190106',1)
,(1542,152,'07','PAUCARTAMBO','190107',1)
,(1543,152,'08','SAN FRANCISCO DE ASÍS DE YARUSYACAN','190108',1)
,(1544,152,'09','SIMON BOLIVAR','190109',1)
,(1545,152,'10','TICLACAYAN','190110',1)
,(1546,152,'11','TINYAHUARCO','190111',1)
,(1547,152,'12','VICCO','190112',1)
,(1548,152,'13','YANACANCHA','190113',1)
,(1549,153,'01','YANAHUANCA','190201',1)
,(1550,153,'02','CHACAYAN','190202',1)
,(1551,153,'03','GOYLLARISQUIZGA','190203',1)
,(1552,153,'04','PAUCAR','190204',1)
,(1553,153,'05','SAN PEDRO DE PILLAO','190205',1)
,(1554,153,'06','SANTA ANA DE TUSI','190206',1)
,(1555,153,'07','TAPUC','190207',1)
,(1556,153,'08','VILCABAMBA','190208',1)
,(1557,154,'01','OXAPAMPA','190301',1)
,(1558,154,'02','CHONTABAMBA','190302',1)
,(1559,154,'03','HUANCABAMBA','190303',1)
,(1560,154,'04','PALCAZU','190304',1)
,(1561,154,'05','POZUZO','190305',1)
,(1562,154,'06','PUERTO BERMUDEZ','190306',1)
,(1563,154,'07','VILLA RICA','190307',1)
,(1564,154,'08','CONSTITUCION','190308',1)
,(1565,155,'01','PIURA','200101',1)
,(1566,155,'04','CASTILLA','200104',1)
,(1567,155,'05','ATACAOS','200105',1)
,(1568,155,'07','CURA MORI','200107',1)
,(1569,155,'08','EL TALLAN','200108',1)
,(1570,155,'09','LA ARENA','200109',1)
,(1571,155,'10','LA UNION','200110',1)
,(1572,155,'11','LAS LOMAS','200111',1)
,(1573,155,'14','TAMBO GRANDE','200114',1)
,(1574,155,'15','VEINTISEIS DE OCTUBRE','200115',1)
,(1575,156,'01','AYABACA','200201',1)
,(1576,156,'02','FRIAS','200202',1)
,(1577,156,'03','JILILI','200203',1)
,(1578,156,'04','LAGUNAS','200204',1)
,(1579,156,'05','MONTERO','200205',1)
,(1580,156,'06','PACAIPAMPA','200206',1)
,(1581,156,'07','PAIMAS','200207',1)
,(1582,156,'08','SAPILLICA','200208',1);

INSERT INTO t_cities VALUES (1583,156,'09','SICCHEZ','200209',1)
,(1584,156,'10','SUYO','200210',1)
,(1585,157,'01','HUANCABAMBA','200301',1)
,(1586,157,'02','CANCHAQUE','200302',1)
,(1587,157,'03','EL CARMEN DE LA FRONTERA','200303',1)
,(1588,157,'04','HUARMACA','200304',1)
,(1589,157,'05','LALAQUIZ','200305',1)
,(1590,157,'06','SAN MIGUEL DE EL FAIQUE','200306',1)
,(1591,157,'07','SONDOR','200307',1)
,(1592,157,'08','SONDORILLO','200308',1)
,(1593,158,'01','CHULUCANAS','200401',1)
,(1594,158,'02','BUENOS AIRES','200402',1)
,(1595,158,'03','CHALACO','200403',1)
,(1596,158,'04','LA MATANZA','200404',1)
,(1597,158,'05','MORROPON','200405',1)
,(1598,158,'06','SALITRAL','200406',1)
,(1599,158,'07','SAN JUAN DE BIGOTE','200407',1)
,(1600,158,'08','SANTA CATALINA DE MOSSA','200408',1)
,(1601,158,'09','SANTO DOMINGO','200409',1)
,(1602,158,'10','YAMANGO','200410',1)
,(1603,159,'01','PAITA','200501',1)
,(1604,159,'02','AMOTAPE','200502',1)
,(1605,159,'03','ARENAL','200503',1)
,(1606,159,'04','COLAN','200504',1)
,(1607,159,'05','LA HUACA','200505',1)
,(1608,159,'06','TAMARINDO','200506',1)
,(1609,159,'07','VICHAYAL','200507',1)
,(1610,160,'01','SULLANA','200601',1)
,(1611,160,'02','BELLAVISTA','200602',1)
,(1612,160,'03','IGNACIO ESCUDERO','200603',1)
,(1613,160,'04','LANCONES','200604',1)
,(1614,160,'05','MARCAVELICA','200605',1)
,(1615,160,'06','MIGUEL CHECA','200606',1)
,(1616,160,'07','QUERECOTILLO','200607',1)
,(1617,160,'08','SALITRAL','200608',1)
,(1618,161,'01','PARIÑAS','200701',1)
,(1619,161,'02','EL ALTO','200702',1)
,(1620,161,'03','LA BREA','200703',1)
,(1621,161,'04','LOBITOS','200704',1)
,(1622,161,'05','LOS ORGANOS','200705',1)
,(1623,161,'06','MANCORA','200706',1)
,(1624,162,'01','SECHURA','200801',1)
,(1625,162,'02','BELLAVISTA DE LA UNIÓN','200802',1)
,(1626,162,'03','BERNAL','200803',1)
,(1627,162,'04','CRISTO NOS VALGA','200804',1)
,(1628,162,'05','VICE','200805',1)
,(1629,162,'06','RINCONADA LLICUAR','200806',1)
,(1630,163,'01','PUNO','210101',1)
,(1631,163,'02','ACORA','210102',1)
,(1632,163,'03','AMANTANI','210103',1)
,(1633,163,'04','ATUNCOLLA','210104',1)
,(1634,163,'05','CAPACHICA','210105',1)
,(1635,163,'06','CHUCUITO','210106',1)
,(1636,163,'07','COATA','210107',1)
,(1637,163,'08','HUATA','210108',1)
,(1638,163,'09','MAÑAZO','210109',1)
,(1639,163,'10','PAUCARCOLLA','210110',1)
,(1640,163,'11','PICHACANI','210111',1)
,(1641,163,'12','PLATERIA','210112',1)
,(1642,163,'13','SAN ANTONIO','210113',1)
,(1643,163,'14','TIQUILLACA','210114',1)
,(1644,163,'15','VILQUE','210115',1)
,(1645,164,'01','AZANGARO','210201',1)
,(1646,164,'02','ACHAYA','210202',1)
,(1647,164,'03','ARAPA','210203',1)
,(1648,164,'04','ASILLO','210204',1)
,(1649,164,'05','CAMINACA','210205',1)
,(1650,164,'06','CHUPA','210206',1)
,(1651,164,'07','JOSE DOMINGO CHOQUEHUANCA','210207',1)
,(1652,164,'08','MUÑANI','210208',1)
,(1653,164,'09','POTONI','210209',1)
,(1654,164,'10','SAMAN','210210',1)
,(1655,164,'11','SAN ANTON','210211',1)
,(1656,164,'12','SAN JOSE','210212',1)
,(1657,164,'13','SAN JUAN DE SALINAS','210213',1)
,(1658,164,'14','SANTIAGO DE PUPUJA','210214',1)
,(1659,164,'15','TIRAPATA','210215',1)
,(1660,165,'01','MACUSANI','210301',1)
,(1661,165,'02','AJOYANI','210302',1)
,(1662,165,'03','AYAPATA','210303',1)
,(1663,165,'04','COASA','210304',1)
,(1664,165,'05','CORANI','210305',1)
,(1665,165,'06','CRUCERO','210306',1)
,(1666,165,'07','ITUATA','210307',1)
,(1667,165,'08','OLLACHEA','210308',1)
,(1668,165,'09','SAN GABAN','210309',1)
,(1669,165,'10','USICAYOS','210310',1)
,(1670,166,'01','JULI','210401',1)
,(1671,166,'02','DESAGUADERO','210402',1)
,(1672,166,'03','HUACULLANI','210403',1)
,(1673,166,'04','KELLUYO','210404',1)
,(1674,166,'05','PISACOMA','210405',1)
,(1675,166,'06','POMATA','210406',1)
,(1676,166,'07','ZEPITA','210407',1)
,(1677,167,'01','ILAVE','210501',1)
,(1678,167,'02','CAPAZO','210502',1)
,(1679,167,'03','PILCUYO','210503',1)
,(1680,167,'04','SANTA ROSA','210504',1)
,(1681,167,'05','CONDURIRI','210505',1)
,(1682,168,'01','HUANCANE','210601',1)
,(1683,168,'02','COJATA','210602',1)
,(1684,168,'03','HUATASANI','210603',1)
,(1685,168,'04','INCHUPALLA','210604',1)
,(1686,168,'05','PUSI','210605',1)
,(1687,168,'06','ROSASPATA','210606',1)
,(1688,168,'07','TARACO','210607',1)
,(1689,168,'08','VILQUE CHICO','210608',1)
,(1690,169,'01','LAMPA','210701',1)
,(1691,169,'02','CABANILLA','210702',1)
,(1692,169,'03','CALAPUJA','210703',1)
,(1693,169,'04','NICASIO','210704',1)
,(1694,169,'05','OCUVIRI','210705',1)
,(1695,169,'06','PALCA','210706',1)
,(1696,169,'07','PARATIA','210707',1)
,(1697,169,'08','PUCARA','210708',1)
,(1698,169,'09','SANTA LUCIA','210709',1)
,(1699,169,'10','VILAVILA','210710',1)
,(1700,170,'01','AYAVIRI','210801',1)
,(1701,170,'02','ANTAUTA','210802',1)
,(1702,170,'03','CUPI','210803',1)
,(1703,170,'04','LLALLI','210804',1)
,(1704,170,'05','MACARI','210805',1)
,(1705,170,'06','NUÑOA','210806',1)
,(1706,170,'07','ORURILLO','210807',1)
,(1707,170,'08','SANTA ROSA','210808',1)
,(1708,170,'09','UMACHIRI','210809',1)
,(1709,171,'01','MOHO','210901',1)
,(1710,171,'02','CONIMA','210902',1)
,(1711,171,'03','HUAYRAPATA','210903',1)
,(1712,171,'04','TILALI','210904',1)
,(1713,172,'01','PUTINA','211001',1)
,(1714,172,'02','ANANEA','211002',1)
,(1715,172,'03','PEDRO VILCA APAZA','211003',1)
,(1716,172,'04','QUILCAPUNCU','211004',1)
,(1717,172,'05','SINA','211005',1)
,(1718,173,'01','JULIACA','211101',1)
,(1719,173,'02','CABANA','211102',1)
,(1720,173,'03','CABANILLAS','211103',1)
,(1721,173,'04','CARACOTO','211104',1)
,(1722,172,'05','SAN MIGUEL','211105',1)
,(1723,174,'01','SANDIA','211201',1)
,(1724,174,'02','CUYOCUYO','211202',1)
,(1725,174,'03','LIMBANI','211203',1)
,(1726,174,'04','PATAMBUCO','211204',1)
,(1727,174,'05','PHARA','211205',1)
,(1728,174,'06','QUIACA','211206',1)
,(1729,174,'07','SAN JUAN DEL ORO','211207',1)
,(1730,174,'08','YANAHUAYA','211208',1)
,(1731,174,'09','ALTO INAMBARI','211209',1)
,(1732,174,'10','SAN PEDRO DE PUTINA PUNCO','211210',1)
,(1733,175,'01','YUNGUYO','211301',1)
,(1734,175,'02','ANAPIA','211302',1)
,(1735,175,'03','COPANI','211303',1)
,(1736,175,'04','CUTURAPI','211304',1)
,(1737,175,'05','OLLARAYA','211305',1)
,(1738,175,'06','TINICACHI','211306',1)
,(1739,175,'07','UNICACHI','211307',1)
,(1740,176,'01','MOYOBAMBA','220101',1)
,(1741,176,'02','CALZADA','220102',1)
,(1742,176,'03','HABANA','220103',1)
,(1743,176,'04','JEPELACIO','220104',1)
,(1744,176,'05','SORITOR','220105',1)
,(1745,176,'06','YANTALO','220106',1)
,(1746,177,'01','BELLAVISTA','220201',1)
,(1747,177,'02','ALTO BIAVO','220202',1)
,(1748,177,'03','BAJO BIAVO','220203',1)
,(1749,177,'04','HUALLAGA','220204',1)
,(1750,177,'05','SAN PABLO','220205',1)
,(1751,177,'06','SAN RAFAEL','220206',1)
,(1752,178,'01','SAN JOSE DE SISA','220301',1)
,(1753,178,'02','AGUA BLANCA','220302',1)
,(1754,178,'03','SAN MARTIN','220303',1)
,(1755,178,'04','SANTA ROSA','220304',1)
,(1756,178,'05','SHATOJA','220305',1)
,(1757,179,'01','SAPOSOA','220401',1)
,(1758,179,'02','ALTO SAPOSOA','220402',1)
,(1759,179,'03','EL ESLABON','220403',1)
,(1760,179,'04','PISCOYACU','220404',1)
,(1761,179,'05','SACANCHE','220405',1)
,(1762,179,'06','TINGO DE SAPOSOA','220406',1)
,(1763,180,'01','LAMAS','220501',1)
,(1764,180,'02','ALONSO DE ALVARADO','220502',1)
,(1765,180,'03','BARRANQUITA','220503',1)
,(1766,180,'04','CAYNARACHI','220504',1)
,(1767,180,'05','CUÑUMBUQUI','220505',1)
,(1768,180,'06','PINTO RECODO','220506',1)
,(1769,180,'07','RUMISAPA','220507',1)
,(1770,180,'08','SAN ROQUE DE CUMBAZA','220508',1)
,(1771,180,'09','SHANAO','220509',1)
,(1772,180,'10','TABALOSOS','220510',1)
,(1773,180,'11','ZAPATERO','220511',1)
,(1774,181,'01','JUANJUI','220601',1)
,(1775,181,'02','CAMPANILLA','220602',1)
,(1776,181,'03','HUICUNGO','220603',1)
,(1777,181,'04','PACHIZA','220604',1)
,(1778,181,'05','PAJARILLO','220605',1)
,(1779,182,'01','PICOTA','220701',1)
,(1780,182,'02','BUENOS AIRES','220702',1)
,(1781,182,'03','CASPISAPA','220703',1)
,(1782,182,'04','PILLUANA','220704',1)
,(1783,182,'05','PUCACACA','220705',1)
,(1784,182,'06','SAN CRISTOBAL','220706',1)
,(1785,182,'07','SAN HILARION','220707',1)
,(1786,182,'08','SHAMBOYACU','220708',1)
,(1787,182,'09','TINGO DE PONASA','220709',1)
,(1788,182,'10','TRES UNIDOS','220710',1)
,(1789,183,'01','RIOJA','220801',1)
,(1790,183,'02','AWAJUN','220802',1)
,(1791,183,'03','ELIAS SOPLIN VARGAS','220803',1)
,(1792,183,'04','NUEVA CAJAMARCA','220804',1)
,(1793,183,'05','PARDO MIGUEL','220805',1)
,(1794,183,'06','POSIC','220806',1)
,(1795,183,'07','SAN FERNANDO','220807',1)
,(1796,183,'08','YORONGOS','220808',1)
,(1797,183,'09','YURACYACU','220809',1)
,(1798,184,'01','TARAPOTO','220901',1)
,(1799,184,'02','ALBERTO LEVEAU','220902',1)
,(1800,184,'03','CACATACHI','220903',1)
,(1801,184,'04','CHAZUTA','220904',1)
,(1802,184,'05','CHIPURANA','220905',1)
,(1803,184,'06','EL PORVENIR','220906',1)
,(1804,184,'07','HUIMBAYOC','220907',1)
,(1805,184,'08','JUAN GUERRA','220908',1)
,(1806,184,'09','LA BANDA DE SHILCAYO','220909',1)
,(1807,184,'10','MORALES','220910',1)
,(1808,184,'11','PAPAPLAYA','220911',1)
,(1809,184,'12','SAN ANTONIO','220912',1)
,(1810,184,'13','SAUCE','220913',1)
,(1811,184,'14','SHAPAJA','220914',1)
,(1812,185,'01','TOCACHE','221001',1)
,(1813,185,'02','NUEVO PROGRESO','221002',1)
,(1814,185,'03','POLVORA','221003',1)
,(1815,185,'04','SHUNTE','221004',1)
,(1816,185,'05','UCHIZA','221005',1)
,(1817,186,'01','TACNA','230101',1)
,(1818,186,'02','ALTO DE LA ALIANZA','230102',1)
,(1819,186,'03','CALANA','230103',1)
,(1820,186,'04','CIUDAD NUEVA','230104',1)
,(1821,186,'05','INCLAN','230105',1)
,(1822,186,'06','PACHIA','230106',1)
,(1823,186,'07','PALCA','230107',1)
,(1824,186,'08','POCOLLAY','230108',1)
,(1825,186,'09','SAMA','230109',1)
,(1826,186,'10','CORONEL GREGORIO ALBARRACIN LANCHIPA','230110',1)
,(1827,186,'11','LA YARADA LOS PALOS','230111',1)
,(1828,187,'01','CANDARAVE','230201',1)
,(1829,187,'02','CAIRANI','230202',1)
,(1830,187,'03','CAMILACA','230203',1)
,(1831,187,'04','CURIBAYA','230204',1)
,(1832,187,'05','HUANUARA','230205',1)
,(1833,187,'06','QUILAHUANI','230206',1)
,(1834,188,'01','LOCUMBA','230301',1)
,(1835,188,'02','ILABAYA','230302',1)
,(1836,188,'03','ITE','230303',1)
,(1837,189,'01','TARATA','230401',1)
,(1838,189,'02','HEROES ALBARRACIN','230402',1)
,(1839,189,'03','ESTIQUE','230403',1)
,(1840,189,'04','ESTIQUE-PAMPA','230404',1)
,(1841,189,'05','SITAJARA','230405',1)
,(1842,189,'06','SUSAPAYA','230406',1)
,(1843,189,'07','TARUCACHI','230407',1)
,(1844,189,'08','TICACO','230408',1)
,(1845,190,'01','TUMBES','240101',1)
,(1846,190,'02','CORRALES','240102',1)
,(1847,190,'03','LA CRUZ','240103',1)
,(1848,190,'04','PAMPAS DE HOSPITAL','240104',1)
,(1849,190,'05','SAN JACINTO','240105',1)
,(1850,190,'06','SAN JUAN DE LA VIRGEN','240106',1)
,(1851,191,'01','ZORRITOS','240201',1)
,(1852,191,'02','CASITAS','240202',1)
,(1853,191,'03','CANOAS DE PUNTA SAL','240203',1)
,(1854,192,'01','ZARUMILLA','240301',1)
,(1855,192,'02','AGUAS VERDES','240302',1)
,(1856,192,'03','MATAPALO','240303',1)
,(1857,192,'04','PAPAYAL','240304',1)
,(1858,193,'01','CALLERIA','250101',1)
,(1859,193,'02','CAMPOVERDE','250102',1)
,(1860,193,'03','IPARIA','250103',1)
,(1861,193,'04','MASISEA','250104',1)
,(1862,193,'05','YARINACOCHA','250105',1)
,(1863,193,'06','NUEVA REQUENA','250106',1)
,(1864,193,'07','MANANTAY','250107',1)
,(1865,194,'01','RAYMONDI','250201',1)
,(1866,194,'02','SEPAHUA','250202',1)
,(1867,194,'03','TAHUANIA','250203',1)
,(1868,194,'04','YURUA','250204',1)
,(1869,195,'01','PADRE ABAD','250301',1)
,(1870,195,'02','IRAZOLA','250302',1)
,(1871,195,'03','CURIMANA','250303',1)
,(1872,195,'04','NESHUYA','250304',1)
,(1873,195,'05','ALEXANDER VON HUMBOLDT','250305',1)
,(1874,196,'01','PURUS','250401',1);