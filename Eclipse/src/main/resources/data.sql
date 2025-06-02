-- data.sql (convertido a mayúsculas para que coincida con H2/Hibernate)

-- 1) Insertar planes en mayúsculas
INSERT INTO PLAN (ID, NOMBRE, LOCALIZACION, IMAGEN_URL, PRECIO, URL) 
VALUES 
  (1,  'Tour Histórico',         'Plaza Mayor',          'https://picsum.photos/400/600?random=1',   15.00, 'https://tours.madrid.es/historico'),
  (2,  'Brunch Dominical',       'Malasaña',             'https://picsum.photos/400/600?random=2',   25.50, 'https://brunch.madrid.es/dominical'),
  (3,  'Concierto de Jazz',      'Chamberí',             'https://picsum.photos/400/600?random=3',   30.00, 'https://madridjazz.es/conciertos'),
  (4,  'Exposición de Arte',     'Museo del Prado',      'https://picsum.photos/400/600?random=4',   12.00, 'https://prado.es/exposiciones'),
  (5,  'Cine al Aire Libre',     'Retiro',               'https://picsum.photos/400/600?random=5',    8.00, 'https://cineairelibre.es/retiro'),
  (6,  'Escape Room',            'Gran Vía',             'https://picsum.photos/400/600?random=6',   20.00, 'https://escaperoom.es/gran-via'),
  (7,  'Visita Torre de Madrid', 'Torre de Madrid',      'https://picsum.photos/400/600?random=7',   10.00, 'https://torredemadrid.es/visita'),
  (8,  'Clases de Yoga',         'Lavapiés',             'https://picsum.photos/400/600?random=8',   18.00, 'https://yoga.madrid.es/lavapies'),
  (9,  'Cena Romántica',         'Chueca',               'https://picsum.photos/400/600?random=9',   40.00, 'https://cenaromantica.es/chueca'),
  (10, 'Ruta de Tapas',          'La Latina',            'https://picsum.photos/400/600?random=10',  22.00, 'https://rutadetapas.es/latina'),
  (11, 'Feria de Antigüedades',  'El Rastro',            'https://picsum.photos/400/600?random=11',   0.00,  'https://elrastro.es/feria'),
  (12, 'Teatro al Aire Libre',   'Parque de la Vaguada', 'https://picsum.photos/400/600?random=12',  15.00, 'https://teatroairelibre.es/vaguada'),
  (13, 'Tour Gastronómico',      'Paseo del Prado',      'https://picsum.photos/400/600?random=13',  28.00, 'https://gastronomico.es/prado'),
  (14, 'Trekking en Madrid',     'Sierra de Madrid',     'https://picsum.photos/400/600?random=14',   5.00, 'https://trekking.madrid.es/sierra'),
  (15, 'Fútbol en el Parque',    'Parque de La Vaguada', 'https://picsum.photos/400/600?random=15',   0.00, 'https://futbolparque.es/vaguada'),
  (16, 'Clase de Cocina Española','Malasaña',            'https://picsum.photos/400/600?random=16',  35.00, 'https://cocinaespana.es/malasana'),
  (17, 'Visita al Palacio Real', 'Palacio Real',         'https://picsum.photos/400/600?random=17',  14.00, 'https://palacioreal.es/visita'),
  (18, 'Rally en Bicicleta',     'Madrid Río',           'https://picsum.photos/400/600?random=18',  12.00, 'https://rallybicicleta.es/rio'),
  (19, 'Fiesta en la Azotea',    'Centro Madrid',        'https://picsum.photos/400/600?random=19',  20.00, 'https://fiestaazotea.es/centro'),
  (20, 'Tour en Segway',         'Retiro',               'https://picsum.photos/400/600?random=20',  30.00, 'https://segwaytour.es/retiro'),
  -- Nuevos planes de prueba:
  (21, 'Noche de Karaoke',       'Malasaña',             'https://picsum.photos/400/600?random=21',  12.00, 'https://karaoke.madrid.es/malasana'),
  (22, 'Desfile de Moda',        'Cibeles',              'https://picsum.photos/400/600?random=22',  50.00, 'https://modamadrid.es/cibeles'),
  (23, 'Picnic en el Retiro',    'Parque del Retiro',    'https://picsum.photos/400/600?random=23',   5.00, 'https://picnicretiro.es'),
  (24, 'Tour Fotográfico',       'Lavapiés',             'https://picsum.photos/400/600?random=24',  18.00, 'https://fotomadrid.es/lavapies');

-- 2) Insertar horarios (AHORA con DIA_INICIO y CRUZA_MEDIANOCHE)

-- Plan 1 (Tour Histórico)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (1,  'VIERNES',   '12:00:00', '16:00:00', false, 1),
  (2,  'MARTES',    '10:00:00', '14:00:00', false, 1);

-- Plan 2 (Brunch Dominical)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (3,  'LUNES',     '09:00:00', '22:30:00', false, 2),
  (4,  'MARTES',    '09:00:00', '22:30:00', false, 2),
  (5,  'MIERCOLES', '09:00:00', '22:30:00', false, 2),
  (6,  'JUEVES',    '09:00:00', '22:30:00', false, 2),
  (7,  'VIERNES',   '09:00:00', '22:30:00', false, 2),
  (8,  'DOMINGO',   '11:00:00', '13:30:00', false, 2);

-- Plan 3 (Concierto de Jazz)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (9,  'SABADO',    '20:00:00', '23:00:00', false, 3),
  (10, 'DOMINGO',   '20:00:00', '23:00:00', false, 3);

-- Plan 4 (Exposición de Arte)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (11, 'LUNES',     '10:00:00', '18:00:00', false, 4),
  (12, 'MARTES',    '10:00:00', '18:00:00', false, 4),
  (13, 'MIERCOLES', '10:00:00', '18:00:00', false, 4),
  (14, 'JUEVES',    '10:00:00', '18:00:00', false, 4),
  (15, 'VIERNES',   '10:00:00', '18:00:00', false, 4);

-- Plan 5 (Cine al Aire Libre)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (16, 'VIERNES',   '21:00:00', '23:30:00', false, 5),
  (17, 'SABADO',    '21:00:00', '23:30:00', false, 5),
  (18, 'DOMINGO',   '21:00:00', '23:30:00', false, 5);

-- Plan 6 (Escape Room)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (19, 'LUNES',     '12:00:00', '16:00:00', false, 6),
  (20, 'MIERCOLES', '12:00:00', '16:00:00', false, 6),
  (21, 'JUEVES',    '12:00:00', '16:00:00', false, 6),
  (22, 'VIERNES',   '12:00:00', '16:00:00', false, 6);

-- Plan 7 (Visita Torre de Madrid)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (23, 'SABADO',    '10:00:00', '13:00:00', false, 7),
  (24, 'DOMINGO',   '10:00:00', '13:00:00', false, 7);

-- Plan 8 (Clases de Yoga)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (25, 'LUNES',     '08:00:00', '09:30:00', false, 8),
  (26, 'MIERCOLES', '18:00:00', '19:30:00', false, 8);

-- Plan 9 (Cena Romántica)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (27, 'VIERNES',   '20:00:00', '23:00:00', false, 9),
  (28, 'SABADO',    '20:00:00', '23:00:00', false, 9);

-- Plan 10 (Ruta de Tapas)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (29, 'MARTES',    '17:00:00', '20:00:00', false, 10),
  (30, 'JUEVES',    '17:00:00', '20:00:00', false, 10);

-- Plan 11 (Feria de Antigüedades)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (31, 'DOMINGO',   '09:00:00', '15:00:00', false, 11);

-- Plan 12 (Teatro al Aire Libre)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (32, 'VIERNES',   '19:00:00', '21:00:00', false, 12),
  (33, 'SABADO',    '19:00:00', '21:00:00', false, 12);

-- Plan 13 (Tour Gastronómico)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (34, 'JUEVES',    '12:00:00', '15:00:00', false, 13),
  (35, 'VIERNES',   '12:00:00', '15:00:00', false, 13);

-- Plan 14 (Trekking en Madrid)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (36, 'SABADO',    '07:00:00', '12:00:00', false, 14),
  (37, 'DOMINGO',   '07:00:00', '12:00:00', false, 14);

-- Plan 15 (Fútbol en el Parque)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (38, 'DOMINGO',   '16:00:00', '18:00:00', false, 15);

-- Plan 16 (Clase de Cocina Española)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (39, 'MARTES',    '18:00:00', '21:00:00', false, 16),
  (40, 'JUEVES',    '18:00:00', '21:00:00', false, 16);

-- Plan 17 (Visita al Palacio Real)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (41, 'LUNES',     '10:00:00', '14:00:00', false, 17),
  (42, 'MIERCOLES', '10:00:00', '14:00:00', false, 17);

-- Plan 18 (Rally en Bicicleta)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (43, 'SABADO',    '10:00:00', '13:00:00', false, 18),
  (44, 'DOMINGO',   '10:00:00', '13:00:00', false, 18);

-- Plan 19 (Fiesta en la Azotea) → cruza medianoche (sábado→domingo)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (45, 'SABADO',    '22:00:00', '02:00:00', true, 19);

-- Plan 20 (Tour en Segway)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (46, 'MARTES',    '11:00:00', '13:00:00', false, 20),
  (47, 'JUEVES',    '11:00:00', '13:00:00', false, 20);

-- Plan 21 (Noche de Karaoke) → cruza medianoche (viernes→sábado)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (48, 'VIERNES',   '23:00:00', '02:00:00', true, 21);

-- Plan 22 (Desfile de Moda) → horario estándar (sin cruce)
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (49, 'MIERCOLES', '18:00:00', '21:00:00', false, 22);

-- Plan 23 (Picnic en el Retiro) → horario estándar
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (50, 'DOMINGO',   '11:00:00', '14:00:00', false, 23);

-- Plan 24 (Tour Fotográfico) → horario estándar
INSERT INTO HORARIO (ID, DIA_INICIO, HORA_INICIO, HORA_FIN, CRUZA_MEDIANOCHE, PLAN_ID) VALUES
  (51, 'VIERNES',   '16:00:00', '19:00:00', false, 24);
