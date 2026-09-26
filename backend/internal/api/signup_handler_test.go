package api

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
)

type signupUserStore struct {
	store.UserStore
	err    error
	called bool
}

func (s *signupUserStore) CreateUser(context.Context, models.NewUserRequest, string) (*models.User, error) {
	s.called = true
	return nil, s.err
}

func TestCreateUserValidationAndDuplicateEmail(t *testing.T) {
	tests := []struct {
		name string
		body string
		err  error
		want int
	}{
		{name: "missing fields", body: `{"name":"","email":"bad","password":"short"}`, want: http.StatusBadRequest},
		{name: "duplicate email", body: `{"name":"Alex","email":"alex@example.com","password":"password"}`, err: &pgconn.PgError{Code: "23505"}, want: http.StatusConflict},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			users := &signupUserStore{err: tt.err}
			logger := zerolog.Nop()
			handler := NewUserHandler(&logger, users, nil)
			w := httptest.NewRecorder()
			handler.CreateUser(w, httptest.NewRequest(http.MethodPost, "/users/", strings.NewReader(tt.body)))
			assert.Equal(t, tt.want, w.Code)
			assert.Equal(t, tt.want != http.StatusBadRequest, users.called)
		})
	}
}
