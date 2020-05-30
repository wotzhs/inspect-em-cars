CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
INSERT INTO 
	inspection_centres (id, name) 
VALUES
	(uuid_generate_v4(), 'Centre A'),
	(uuid_generate_v4(), 'Centre B'),
	(uuid_generate_v4(), 'Centre C'),
	(uuid_generate_v4(), 'Centre D'),
	(uuid_generate_v4(), 'Centre E');