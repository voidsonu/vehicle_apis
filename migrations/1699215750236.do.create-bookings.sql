-- 1699215750236.do.create-bookings.sql

CREATE TABLE IF NOT EXISTS bookings(
    "booking_id" SERIAL PRIMARY KEY,
    "user_id" VARCHAR(255) NOT NULL,
    "vehicle_id" VARCHAR(255) NOT NULL,
    "from_date" VARCHAR(225) NOT NULL,
    "till_date" VARCHAR(225) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL,
    deleted_at TIMESTAMPTZ NULL
)