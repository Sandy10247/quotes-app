package db

import (
	"context"
	"log"

	"quotes-app/config"

	"github.com/jackc/pgx/v5"
)

func Connect(conf config.Config) *pgx.Conn {
	// Use conf.Database to constrct the connection string and connect to the database
	connectionDsn := conf.DSN()

	// Example using pgx to connect to PostgreSQL
	conn, err := pgx.Connect(context.Background(), connectionDsn)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	// Test the connection
	err = conn.Ping(context.Background())
	if err != nil {
		log.Fatalf("Unable to ping the database: %v\n", err)
	}

	return conn
}

func Close(conn *pgx.Conn) {
	err := conn.Close(context.Background())
	if err != nil {
		log.Printf("Error closing the database connection: %v\n", err)
	}
}
