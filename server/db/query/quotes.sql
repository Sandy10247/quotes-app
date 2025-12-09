
-- name: GetQuoteByID :one
SELECT * FROM quotes WHERE id = $1;

-- name: GetAllQuotes :many
SELECT * FROM quotes ORDER BY created_at DESC;

-- name: GetAllQuotesByUser :many
SELECT * FROM quotes WHERE user_id = $1 ORDER BY created_at DESC;

-- name: CreateQuote :one
INSERT INTO quotes (user_id, content, author) VALUES ($1, $2, $3) RETURNING *;

-- name: UpdateQuote :one
UPDATE quotes SET content = $2, author = $3 WHERE id = $1 RETURNING *;

-- name: DeleteQuote :one
DELETE FROM quotes WHERE id = $1 RETURNING *;

-- name: GetQuotesByUserID :one
SELECT * FROM quotes WHERE user_id = $1 ORDER BY created_at DESC;

-- name: CountQuotes :one
SELECT COUNT(*) FROM quotes;

-- name: SearchQuotes :one
SELECT * FROM quotes WHERE content ILIKE '%' || $1 || '%' OR author ILIKE '%' || $1 || '%' ORDER BY created_at DESC;