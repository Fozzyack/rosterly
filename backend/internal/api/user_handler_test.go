package api

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/auth"
	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type loginUserStore struct {
	store.UserStore
	user *models.User
	err  error
}

func (s *loginUserStore) GetUserByEmail(context.Context, string) (*models.User, error) {
	return s.user, s.err
}

type loginSessionStore struct {
	store.SessionStore
	create func(context.Context, string, string, time.Time) (*models.Session, error)
}

func (s *loginSessionStore) CreateSession(ctx context.Context, token, userID string, expiresAt time.Time) (*models.Session, error) {
	return s.create(ctx, token, userID, expiresAt)
}

func TestLoginUserSession(t *testing.T) {
	passwordHash, err := auth.HashPassword("password")
	require.NoError(t, err)
	user := &models.User{ID: "9dd329e2-79df-4ad0-9e0d-99fc81aa6dd1", PasswordHash: passwordHash}

	testCases := []struct {
		name        string
		password    string
		storeErr    error
		userErr     error
		wantSession bool
		wantStatus  int
	}{
		{name: "persist before returning token", password: "password", wantSession: true, wantStatus: http.StatusOK},
		{name: "persistence failure withholds token", password: "password", storeErr: errors.New("database unavailable"), wantSession: true, wantStatus: http.StatusInternalServerError},
		{name: "invalid password creates no session", password: "wrong", wantStatus: http.StatusUnauthorized},
		{name: "missing user is unauthorized", password: "password", userErr: sql.ErrNoRows, wantStatus: http.StatusUnauthorized},
	}

	for _, tt := range testCases {
		t.Run(tt.name, func(t *testing.T) {
			var savedToken string
			started := time.Now()
			r := httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(`{"email":"user@example.com","password":"`+tt.password+`"}`))
			w := httptest.NewRecorder()
			sessions := &loginSessionStore{create: func(ctx context.Context, token, userID string, expiresAt time.Time) (*models.Session, error) {
				assert.Equal(t, r.Context(), ctx, "session creation should use request context")
				assert.Equal(t, user.ID, userID)
				assert.Len(t, token, 64)
				assert.WithinRange(t, expiresAt, started.Add(24*time.Hour), time.Now().Add(24*time.Hour))
				assert.Zero(t, w.Body.Len(), "response must not be written before session persistence")
				savedToken = token
				return &models.Session{}, tt.storeErr
			}}
			logger := zerolog.Nop()
			handler := NewUserHandler(&logger, &loginUserStore{user: user, err: tt.userErr}, sessions)
			handler.LoginUser(w, r)

			assert.Equal(t, tt.wantStatus, w.Code)
			assert.Equal(t, tt.wantSession, savedToken != "", "session creation")
			var response map[string]string
			require.NoError(t, json.Unmarshal(w.Body.Bytes(), &response))
			if tt.wantStatus == http.StatusOK {
				assert.Equal(t, savedToken, response["token"], "returned token should match persisted token")
			} else {
				assert.NotContains(t, response, "token", "failed login must not return a token")
			}
		})
	}
}
