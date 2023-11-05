-- 1699201548419.do.create-vehicles.sql

CREATE TABLE IF NOT EXISTS vehicles(
    vehicle_id SERIAL PRIMARY KEY,
    vehicle_type VARCHAR(255) NOT NULL,
    vehicle_model VARCHAR(255) NOT NULL UNIQUE,
    number_of_wheel INT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL,
    deleted_at TIMESTAMPTZ NULL
)