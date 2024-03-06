package store

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"os"
)

type PostgresStore struct {
	*sql.DB
	logger *log.Logger
}

func ConnectPostgres(ctx context.Context) (*PostgresStore, error) {
	logger := log.New(os.Stdout, "[Postgres]", log.LstdFlags)

	dbURL := os.Getenv("POSTGRES_URI")
	db, err := sql.Open("postgres", fmt.Sprintf("%v?sslmode=disable", dbURL))
	if err != nil {
		logger.Fatal(err)
	}

	err = db.PingContext(ctx)
	if err != nil {
		logger.Fatalf("Could not open a connection with the database.\n%v", err)
	}
	return &PostgresStore{db, logger}, nil
}
