package store

import (
	"context"
	"database/sql"

	"github.com/Fozzyack/rosterly/m/internal/models"
)

type UserStore interface {
	CreateUser(ctx context.Context, newUserRequest models.NewUserRequest, passwordHash string) (*models.User, error)
	GetUserById(ctx context.Context, userId string) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
}

func NewUserStore(db *sql.DB) UserStore {
	return &PostgresStore{db: db}
}

// GET FUNCTIONS
func (ps *PostgresStore) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {

	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	query := `
	SELECT id, name, email, password_hash, created_at, updated_at FROM users 
	WHERE email = $1
	`

	newUser := &models.User{}
	err = tx.QueryRowContext(ctx, query, email).Scan(
		&newUser.ID,
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

func (ps *PostgresStore) GetUserById(ctx context.Context, userId string) (*models.User, error) {

	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	query := `
	SELECT id, name, email, password_hash, created_at, updated_at FROM users 
	WHERE id = $1
	`

	newUser := &models.User{}
	err = tx.QueryRowContext(ctx, query, userId).Scan(
		&newUser.ID,
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

// CREATE FUNCTION
func (ps *PostgresStore) CreateUser(ctx context.Context, newUserRequest models.NewUserRequest, passwordHash string) (*models.User, error) {

	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	query := `
	INSERT into users (name, email, password_hash)
	VALUES ($1, $2, $3)
	RETURNING id, name, email, password_hash, created_at, updated_at
	`

	newUser := &models.User{}
	err = tx.QueryRowContext(ctx, query, newUserRequest.Name, newUserRequest.Email, passwordHash).Scan(
		&newUser.ID,
		&newUser.Name,
		&newUser.Email,
		&newUser.PasswordHash,
		&newUser.CreatedAt,
		&newUser.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	err = tx.Commit()
	if err != nil {
		return nil, err
	}
	return newUser, nil

}
