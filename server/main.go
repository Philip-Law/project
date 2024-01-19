package main

import (
	"github.com/go-chi/chi/v5"
	"log"
	"net/http"
)

func main() {
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Println(err)
	}
}
