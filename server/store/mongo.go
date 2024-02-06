package store

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
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

	var result bson.M
	logger.Println("Attempting to ping 'tmu_connect' database")
	if err := client.Database("tmu_connect").RunCommand(ctx, bson.D{{"ping", 1}}).Decode(&result); err != nil {
		logger.Printf("Error when pinging mongo db: %v", err)
		return nil, nil, err
	}
	logger.Println("Successfully opened connection to 'tmu_connect'")
	return &MongoStore{client, logger}, shutdown, nil
}
