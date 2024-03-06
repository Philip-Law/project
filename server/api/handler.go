package api

import (
	"github.com/cps-630/project/api/middleware"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"net/http"
)

func ConfigureRouter() (*chi.Mux, error) {
	r := chi.NewRouter()
	r.Use(chimiddleware.Logger, middleware.CORS())

	r.With(middleware.AuthenticateToken()).Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	r.Route("/post", func(r chi.Router) {

	})

	return r, nil
}
