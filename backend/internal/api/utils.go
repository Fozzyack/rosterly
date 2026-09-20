package api

import (
	"encoding/json"
	"net/http"
)

func sendJSON(w http.ResponseWriter, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func decodeJSON(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func sendError(w http.ResponseWriter, errMsg string, code int) {
	w.WriteHeader(code)
	sendJSON(w, map[string]string{"error": errMsg})
}
