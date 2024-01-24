package api

import (
	"github.com/go-chi/chi/v5"
	"net/http"
)

func ConfigureHandler() *chi.Mux {
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	return r
}
