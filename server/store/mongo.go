package store

import (
	"context"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

type MongoStore struct {
	*mongo.Client
	logger *log.Logger
}

func ConnectMongo(ctx context.Context) (*MongoStore, func(), error) {
	logger := log.New(os.Stdout, "[Mongo]", log.LstdFlags)

	if err := godotenv.Load(); err != nil {
		logger.Println("no .env file found")
	}
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		logger.Fatal("You must set your 'MONGODB_URI' environment variable.")
	}
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		logger.Printf("Could not connect to DB: %v", err)
		return nil, nil, err
	}

	shutdown := func() {
		if err := client.Disconnect(ctx); err != nil {
			logger.Println(err)
		}
	}

	return &MongoStore{client, logger}, shutdown, nil
}
