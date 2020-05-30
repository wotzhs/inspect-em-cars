CREATE TABLE IF NOT EXISTS availabilities (
	inspection_centre_id UUID REFERENCES inspection_centres(id),
	date TIMESTAMP NOT NULL,
	slots INTEGER[18] NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX inspection_centres_id_slots_idx ON availabilities(inspection_centre_id, date);