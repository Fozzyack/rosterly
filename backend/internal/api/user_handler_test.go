package api

import (
	"context"
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
)

type loginUserStore struct {
	store.UserStore
	user *models.User
}

func (s *loginUserStore) GetUserByEmail(context.Context, string) (*models.User, error) {
	return s.user, nil
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
	if err != nil {
		t.Fatal(err)
	}
	user := &models.User{ID: "9dd329e2-79df-4ad0-9e0d-99fc81aa6dd1", PasswordHash: passwordHash}

	for _, tt := range []struct {
		name        string
		password    string
		storeErr    error
		wantSession bool
		wantStatus  int
	}{
		{name: "persist before returning token", password: "password", wantSession: true, wantStatus: http.StatusOK},
		{name: "persistence failure withholds token", password: "password", storeErr: errors.New("database unavailable"), wantSession: true, wantStatus: http.StatusInternalServerError},
		{name: "invalid password creates no session", password: "wrong", wantStatus: http.StatusInternalServerError},
	} {
		t.Run(tt.name, func(t *testing.T) {
			var savedToken string
			started := time.Now()
			r := httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(`{"email":"user@example.com","password":"`+tt.password+`"}`))
			w := httptest.NewRecorder()
			sessions := &loginSessionStore{create: func(ctx context.Context, token, userID string, expiresAt time.Time) (*models.Session, error) {
				if ctx != r.Context() {
					t.Error("session creation did not use request context")
				}
				if userID != user.ID {
					t.Errorf("user ID = %q, want %q", userID, user.ID)
				}
				if len(token) != 64 {
					t.Errorf("unexpected token length: %d", len(token))
				}
				if expiresAt.Before(started.Add(24*time.Hour)) || expiresAt.After(time.Now().Add(24*time.Hour)) {
					t.Errorf("unexpected expiration: %v", expiresAt)
				}
				if w.Body.Len() != 0 {
					t.Error("response written before session persistence")
				}
				savedToken = token
				return &models.Session{}, tt.storeErr
			}}
			logger := zerolog.Nop()
			handler := NewUserHandler(&logger, &loginUserStore{user: user}, sessions)
			handler.LoginUser(w, r)

			if w.Code != tt.wantStatus {
				t.Errorf("status = %d, want %d", w.Code, tt.wantStatus)
			}
			if (savedToken != "") != tt.wantSession {
				t.Errorf("session created = %t, want %t", savedToken != "", tt.wantSession)
			}
			var response map[string]string
			if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
				t.Fatal(err)
			}
			if tt.wantStatus == http.StatusOK {
				if response["token"] != savedToken {
					t.Error("returned token differs from persisted token")
				}
			} else if _, ok := response["token"]; ok {
				t.Error("failed login returned a token")
			}
		})
	}
}
