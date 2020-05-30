CREATE TABLE IF NOT EXISTS inspection_centres (
	id UUID PRIMARY KEY,
	name VARCHAR NOT NULL UNIQUE,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX inspection_centers_name_idx ON inspection_centres (name);