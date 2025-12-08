package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type Store interface {
	Querier
	CreateQuoteTx(ctx context.Context, arg CreateQuoteParams) (*CreateQuoteReult, error)
}

type ConduitStore struct {
	*Queries // implements Querier
	db       *pgx.Conn
}

func NewStore(db *pgx.Conn) Store {
	return &ConduitStore{
		db:      db,
		Queries: New(db),
	}
}

type CreateQuoteReult struct {
	Quote Quote
}

func (store *ConduitStore) CreateQuoteTx(ctx context.Context, arg CreateQuoteParams) (*CreateQuoteReult, error) {
	var result CreateQuoteReult
	tx, err := store.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(context.Background())

	qtx := store.Queries.WithTx(tx)
	quote, err := qtx.CreateQuote(ctx, arg)
	if err != nil {
		return nil, err
	}
	result.Quote = *quote
	return &result, tx.Commit(ctx)
}
