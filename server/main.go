package main

import (
	"context"
	"github.com/cps-630/project/api"
	"github.com/cps-630/project/store"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"time"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found")
	}
	ctx, cancelFunc := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancelFunc()
	db, err := store.ConnectPostgres(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("Failed to close DB connection: %v", err)
		}
	}()

	r, err := api.ConfigureRouter()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Starting server on port :8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Println(err)
	}
}
