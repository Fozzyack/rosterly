package routes

import (
	"github.com/Fozzyack/rosterly/m/internal/api"
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

	// Health Check
	r.Get("/health/", app.HealthHandler.GetHealth)

	// User Creation and Login
	r.Post("/auth/login/", app.UserHandler.LoginUser)
	r.Post("/users/", app.UserHandler.CreateUser)

	r.Group(func(r chi.Router) {
		r.Use(api.AuthMiddleware(app.SessionStore, app.Logger))
		r.Get("/workspace/", app.RosterHandler.CurrentWorkspace)
		r.Get("/team-members/", app.RosterHandler.TeamMembers)
		r.Post("/team-members/", app.RosterHandler.TeamMembers)
		r.Put("/team-members/{memberID}/", app.RosterHandler.TeamMember)
		r.Delete("/team-members/{memberID}/", app.RosterHandler.TeamMember)
		r.Get("/rosters/{week}/", app.RosterHandler.Roster)
		r.Put("/rosters/{week}/", app.RosterHandler.Roster)
		r.Post("/rosters/{week}/publish/", app.RosterHandler.PublishRoster)
		r.Post("/rosters/{week}/unpublish/", app.RosterHandler.UnpublishRoster)
		r.Get("/time-off/", app.RosterHandler.TimeOff)
		r.Post("/time-off/", app.RosterHandler.TimeOff)
		r.Post("/time-off/{requestID}/review/", app.RosterHandler.ReviewTimeOff)
	})

	return r

}
