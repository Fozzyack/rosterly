package api

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"strings"

	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/rs/zerolog"
)

type contextKey string

const userIDContextKey contextKey = "userID"

// UserIDFromContext returns the authenticated user ID placed on the request
// context by AuthMiddleware.
func UserIDFromContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(userIDContextKey).(string)
	return userID, ok
}

// AuthMiddleware rejects requests without a valid session token and stores the
// authenticated user ID on the request context.
func AuthMiddleware(sessionStore store.SessionStore, logger *zerolog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token, ok := bearerToken(r)
			if !ok {
				sendError(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			session, err := sessionStore.GetSessionByToken(r.Context(), token)
			if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
					sendError(w, "Unauthorized", http.StatusUnauthorized)
					return
				}
				logger.Error().Err(err).Msg("Failed to validate session")
				sendError(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			if session == nil {
				sendError(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userIDContextKey, session.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func bearerToken(r *http.Request) (string, bool) {
	const prefix = "Bearer "

	header := r.Header.Get("Authorization")
	if !strings.HasPrefix(header, prefix) {
		return "", false
	}

	token := strings.TrimSpace(strings.TrimPrefix(header, prefix))
	return token, token != ""
}
