package routes

import (
	"github.com/Fozzyack/rosterly/m/internal/app"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
)

func SetupRoutes(app *app.Application) *chi.Mux {

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.RealIP)
	r.Use(middleware.RequestID)
	r.Use(middleware.Recoverer)

	r.Get("/health/", app.HealthHandler.GetHealth)
	r.Post("/users/", app.UserHandler.CreateUser)

	return r

}
