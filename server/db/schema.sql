

-- USER Table
CREATE TABLE IF NOT EXISTS users(
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password      VARCHAR(100) NOT NULL,
  created_at    timestamptz NOT NULL default now(),
  updated_at    timestamptz NOT NULL default now(),

-- Constraints
  PRIMARY KEY (id)
);


-- QUOTE Table
CREATE TABLE IF NOT EXISTS quotes (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content     TEXT NOT NULL,
    author      VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
