package store

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/models"
)

type SessionStore interface {
	CreateSession(ctx context.Context, token, userID string, expiresAt time.Time) (*models.Session, error)
	GetSessionByToken(ctx context.Context, token string) (*models.Session, error)
}

func NewSessionStore(db *sql.DB) SessionStore {
	return &PostgresStore{db: db}
}

func (ps *PostgresStore) CreateSession(ctx context.Context, token, userID string, expiresAt time.Time) (*models.Session, error) {
	query := `
	INSERT INTO sessions (token_hash, user_id, expires_at)
	VALUES ($1, $2, $3)
	RETURNING id, user_id, token_hash, expires_at, created_at
	`

	session := &models.Session{}
	err := ps.db.QueryRowContext(ctx, query, hashSessionToken(token), userID, expiresAt).Scan(
		&session.ID,
		&session.UserID,
		&session.TokenHash,
		&session.ExpiresAt,
		&session.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return session, nil
}

// GetSessionByToken returns sql.ErrNoRows for missing or expired sessions.
func (ps *PostgresStore) GetSessionByToken(ctx context.Context, token string) (*models.Session, error) {
	query := `
	SELECT id, user_id, token_hash, expires_at, created_at FROM sessions
	WHERE token_hash = $1 AND expires_at > now()
	`

	session := &models.Session{}
	err := ps.db.QueryRowContext(ctx, query, hashSessionToken(token)).Scan(
		&session.ID,
		&session.UserID,
		&session.TokenHash,
		&session.ExpiresAt,
		&session.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return session, nil
}

func hashSessionToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}
