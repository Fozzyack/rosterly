package api

import (
	"net/http"

	"github.com/Fozzyack/rosterly/m/internal/auth"
	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/rs/zerolog"
)

type UserHandler struct {
	logger    *zerolog.Logger
	userStore store.UserStore
}

func NewUserHandler(logger *zerolog.Logger, userStore store.UserStore) *UserHandler {
	return &UserHandler{
		logger:    logger,
		userStore: userStore,
	}
}

func (uh *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var newUserRequest models.NewUserRequest
	if err := decodeJSON(r, &newUserRequest); err != nil {
		sendError(w, err.Error(), http.StatusBadRequest)
		return
	}

	passwordHash, err := auth.HashPassword(newUserRequest.Password)
	if err != nil {
		sendError(w, "Failed to Create User", http.StatusInternalServerError)
		return
	}

	newUser, err := uh.userStore.CreateUser(r.Context(), newUserRequest, passwordHash)
	if err != nil {
		sendError(w, "Failed to Create User", http.StatusInternalServerError)
		return
	}

	sendJSON(w, newUser)
}
