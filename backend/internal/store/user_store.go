package store

import (
	"context"
	"database/sql"

	"github.com/Fozzyack/rosterly/m/internal/models"
)

type UserStore interface {
	CreateUser(ctx context.Context, newUserRequest models.NewUserRequest, passwordHash string) (*models.User, error)
	GetUser(ctx context.Context, userId string) (*models.User, error)
}

func NewUserStore(db *sql.DB) UserStore {
	return &PostgresStore{db: db}
}

func (ps *PostgresStore) CreateUser(ctx context.Context, newUserRequest models.NewUserRequest, passwordHash string) (*models.User, error) {

	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	query := `
	INSERT into users (name, email, password_hash)
	VALUES ($1, $2, $3)
	RETURNING name, email, password_hash, created_at, updated_at
	`

	newUser := &models.User{}
	err = tx.QueryRowContext(ctx, query, newUserRequest.Name, newUserRequest.Email, passwordHash).Scan(
		&newUser.Name,
		&newUser.Email,
		&newUser.PasswordHash,
		&newUser.CreatedAt,
		&newUser.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return newUser, nil

}

func (ps *PostgresStore) GetUser(ctx context.Context, userId string) (*models.User, error) {

	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	query := `
	SELECT name, email, password_hash, created_at, updated_at FROM users 
	WHERE id = $1
	`

	newUser := &models.User{}
	err = tx.QueryRowContext(ctx, query, userId).Scan(
		&newUser.Name,
		&newUser.Email,
		&newUser.PasswordHash,
		&newUser.CreatedAt,
		&newUser.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return newUser, nil

}
