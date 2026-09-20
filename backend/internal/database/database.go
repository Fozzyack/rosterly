package database

import (
	"database/sql"
	"io/fs"

	"github.com/Fozzyack/rosterly/m/internal/env"
	"github.com/pressly/goose/v3"
)

func Open() (*sql.DB, error) {
	url, err := env.GetDatabaseURL()
	if err != nil {
		return nil, err
	}

	db, err := sql.Open("pgx", url)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func MigrateDB(db *sql.DB, fs fs.FS) error {

	goose.SetBaseFS(fs)
	err := goose.SetDialect("postgres")
	if err != nil {
		return err
	}

	err = goose.Up(db, ".")
	if err != nil {
		return err
	}

	return nil

}
