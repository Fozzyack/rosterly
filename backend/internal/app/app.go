package app

import (
	"github.com/rs/zerolog"
	"os"
)

type Application struct {
	logger *zerolog.Logger
}

func NewApplication() (*Application, error) {

	logger := zerolog.New(zerolog.ConsoleWriter{Out: os.Stdout}).With().Timestamp().Logger()

	app := &Application{
		logger: &logger,
	}

	return app, nil

}
