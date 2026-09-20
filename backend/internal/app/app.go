package app

import (
	"os"

	"github.com/Fozzyack/rosterly/m/internal/api"
	"github.com/Fozzyack/rosterly/m/internal/database"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/Fozzyack/rosterly/m/migrations"
	"github.com/rs/zerolog"
)

type Application struct {

	// Logger
	Logger *zerolog.Logger

	// Stores
	UserStore    store.UserStore
	SessionStore store.SessionStore

	// Handlers
	HealthHandler *api.HealthHandler
	UserHandler   *api.UserHandler
}

func NewApplication() (*Application, error) {

	logger := zerolog.New(zerolog.ConsoleWriter{Out: os.Stdout}).With().Timestamp().Logger()

	db, err := database.Open()
	if err != nil {
		return nil, err
	}

	err = database.MigrateDB(db, migrations.FS)
	if err != nil {
		return nil, err
	}

	userStore := store.NewUserStore(db)
	sessionStore := store.NewSessionStore(db)

	healthHandler := api.NewHealthHandler(&logger)
	userHandler := api.NewUserHandler(&logger, userStore, sessionStore)

	app := &Application{

		Logger: &logger,

		UserStore:    userStore,
		SessionStore: sessionStore,

		HealthHandler: healthHandler,
		UserHandler:   userHandler,
	}

	return app, nil

}
