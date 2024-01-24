package main

import (
	"context"
	"github.com/cps-630/project/api"
	"github.com/cps-630/project/store"
	"log"
	"net/http"
)

func main() {
	_, shutdown, err := store.ConnectMongo(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	defer shutdown()

	r := api.ConfigureHandler()
	log.Println("Starting server on port :8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Println(err)
	}
}
