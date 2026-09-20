package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/app"
	"github.com/Fozzyack/rosterly/m/internal/env"
	"github.com/Fozzyack/rosterly/m/internal/routes"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error Loading .env file")
	}

	env := env.GetEnv()

	var port int
	flag.IntVar(&port, "port", 8000, "server address port")
	flag.Parse()

	app, err := app.NewApplication()
	if err != nil {
		log.Fatal(err)
	}

	app.Logger.Info().Msg("App Initialised")
	app.Logger.Info().Str("ENV", env).Msg("Environment")


	routes := routes.SetupRoutes(app)
	app.Logger.Info().Msg("Routes Initialised")

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      routes,
		WriteTimeout: time.Second * 5,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Second * 60,
	}
	app.Logger.Info().Msg("Server Initialised")

	app.Logger.Info().Int("port", port).Msg("Server Listening")
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

	return
}
