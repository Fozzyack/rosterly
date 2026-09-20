package api

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
)

type authSessionStore struct {
	store.SessionStore
	get func(context.Context, string) (*models.Session, error)
}

func (s *authSessionStore) GetSessionByToken(ctx context.Context, token string) (*models.Session, error) {
	return s.get(ctx, token)
}

func TestAuthMiddleware(t *testing.T) {
	const userID = "9dd329e2-79df-4ad0-9e0d-99fc81aa6dd1"

	testCases := []struct {
		name       string
		header     string
		storeErr   error
		wantStatus int
		wantNext   bool
	}{
		{name: "missing header", wantStatus: http.StatusUnauthorized},
		{name: "malformed scheme", header: "Token abc", wantStatus: http.StatusUnauthorized},
		{name: "empty bearer token", header: "Bearer ", wantStatus: http.StatusUnauthorized},
		{name: "missing session", header: "Bearer abc", storeErr: sql.ErrNoRows, wantStatus: http.StatusUnauthorized},
		{name: "store failure", header: "Bearer abc", storeErr: errors.New("database unavailable"), wantStatus: http.StatusInternalServerError},
		{name: "valid session", header: "Bearer abc", wantStatus: http.StatusOK, wantNext: true},
	}

	for _, tt := range testCases {
		t.Run(tt.name, func(t *testing.T) {
			var nextCalled bool
			var gotUserID string
			var gotUser bool

			sessions := &authSessionStore{get: func(context.Context, string) (*models.Session, error) {
				if tt.storeErr != nil {
					return nil, tt.storeErr
				}
				return &models.Session{UserID: userID}, nil
			}}

			next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				nextCalled = true
				gotUserID, gotUser = UserIDFromContext(r.Context())
				w.WriteHeader(http.StatusOK)
			})

			r := httptest.NewRequest(http.MethodGet, "/protected", nil)
			if tt.header != "" {
				r.Header.Set("Authorization", tt.header)
			}
			w := httptest.NewRecorder()

			logger := zerolog.Nop()
			AuthMiddleware(sessions, &logger)(next).ServeHTTP(w, r)

			assert.Equal(t, tt.wantStatus, w.Code)
			assert.Equal(t, tt.wantNext, nextCalled)
			if tt.wantNext {
				assert.True(t, gotUser, "authenticated user ID should be on the context")
				assert.Equal(t, userID, gotUserID)
			}
		})
	}
}
