package api

import (
	"database/sql"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/auth"
	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/jackc/pgx/v5/pgconn"
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
	if strings.TrimSpace(loginRequest.Email) == "" || loginRequest.Password == "" {
		sendError(w, "Invalid email or password", http.StatusBadRequest)
		return
	}
	loginRequest.Email = strings.TrimSpace(strings.ToLower(loginRequest.Email))

	user, err := uh.userStore.GetUserByEmail(r.Context(), loginRequest.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			sendError(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}
		uh.logger.Error().Err(err).Msg("Failed to Login User")
		sendError(w, "Failed to Login User", http.StatusInternalServerError)
		return
	}

	if !auth.CheckPasswordHash(loginRequest.Password, user.PasswordHash) {
		sendError(w, "Invalid email or password", http.StatusUnauthorized)
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
	newUserRequest.Name = strings.TrimSpace(newUserRequest.Name)
	newUserRequest.Email = strings.TrimSpace(strings.ToLower(newUserRequest.Email))
	if newUserRequest.Name == "" || newUserRequest.Email == "" || !strings.Contains(newUserRequest.Email, "@") || len(newUserRequest.Password) < 8 {
		sendError(w, "Name, valid email, and password of at least 8 characters are required", http.StatusBadRequest)
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
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			sendError(w, "Email already exists", http.StatusConflict)
			return
		}
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
