package api

import (
	"net/http"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/auth"
	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/rs/zerolog"
)

type UserHandler struct {
	logger       *zerolog.Logger
	userStore    store.UserStore
	sessionStore store.SessionStore
}

func NewUserHandler(logger *zerolog.Logger, userStore store.UserStore, sessionStore store.SessionStore) *UserHandler {
	return &UserHandler{
		logger:       logger,
		userStore:    userStore,
		sessionStore: sessionStore,
	}
}

func (uh *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var loginRequest models.LoginRequest
	if err := decodeJSON(r, &loginRequest); err != nil {
		uh.logger.Error().Err(err).Msg("Failed to Login User")
		sendError(w, "Failed to Login User", http.StatusBadRequest)
		return
	}

	user, err := uh.userStore.GetUserByEmail(r.Context(), loginRequest.Email)
	if err != nil {
		uh.logger.Error().Err(err).Msg("Failed to Login User")
		sendError(w, "Failed to Login User", http.StatusInternalServerError)
		return
	}

	if !auth.CheckPasswordHash(loginRequest.Password, user.PasswordHash) {
		uh.logger.Error().Err(err).Msg("Failed to Login User")
		sendError(w, "Failed to Login User", http.StatusInternalServerError)
		return
	}

	token, err := auth.GenerateToken()
	if err != nil {
		uh.logger.Error().Err(err).Msg("Failed to Login User")
		sendError(w, "Failed to Login User", http.StatusInternalServerError)
		return
	}

	_, err = uh.sessionStore.CreateSession(r.Context(), token, user.ID, time.Now().Add(24*time.Hour))
	if err != nil {
		uh.logger.Error().Err(err).Msg("Failed to Create Session")
		sendError(w, "Failed to Login User", http.StatusInternalServerError)
		return
	}

	sendJSON(w, map[string]string{"token": token})

}

func (uh *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var newUserRequest models.NewUserRequest
	if err := decodeJSON(r, &newUserRequest); err != nil {
		uh.logger.Error().Err(err).Msg("Failed to Create User")
		sendError(w, "Failed to Create User", http.StatusBadRequest)
		return
	}

	passwordHash, err := auth.HashPassword(newUserRequest.Password)
	if err != nil {
		uh.logger.Error().Err(err).Msg("Failed to Create User")
		sendError(w, "Failed to Create User", http.StatusInternalServerError)
		return
	}

	newUser, err := uh.userStore.CreateUser(r.Context(), newUserRequest, passwordHash)
	if err != nil {
		uh.logger.Error().Err(err).Msg("Failed to Create User")
		sendError(w, "Failed to Create User", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	sendJSON(w, models.UserResponse{
		Name:      newUser.Name,
		Email:     newUser.Email,
		CreatedAt: newUser.CreatedAt,
		UpdatedAt: newUser.UpdatedAt,
	})
}
