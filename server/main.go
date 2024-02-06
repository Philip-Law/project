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
	_, shutdown, err := store.ConnectMongo(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer shutdown()

	r, err := api.ConfigureHandler()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Starting server on port :8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Println(err)
	}
}
