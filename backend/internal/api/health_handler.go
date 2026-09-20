package api

import (
	"net/http"

	"github.com/rs/zerolog"
)

type HealthHandler struct {
	logger *zerolog.Logger
}

func NewHealthHandler(logger *zerolog.Logger) *HealthHandler {
	return &HealthHandler{logger: logger}
}

func (hh *HealthHandler) GetHealth(w http.ResponseWriter, r *http.Request) {

	hh.logger.Info().Msg("Health Check")
	sendJSON(w, map[string]string{"status": "ok"})
}
