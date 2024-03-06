package api

import (
	"context"
	"github.com/cps-630/project/model"
	"net/http"
)

type PostService interface {
	Get(ctx context.Context, id string) (model.Post, error)
}

func handleGetPost(service PostService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		service.Get(r.Context(), "someID")
	}
}
