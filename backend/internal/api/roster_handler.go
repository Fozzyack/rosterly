package api

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog"
)

type RosterHandler struct {
	logger      *zerolog.Logger
	rosterStore store.RosterStore
}

func NewRosterHandler(logger *zerolog.Logger, rosterStore store.RosterStore) *RosterHandler {
	return &RosterHandler{logger: logger, rosterStore: rosterStore}
}

func (h *RosterHandler) CurrentWorkspace(w http.ResponseWriter, r *http.Request) {
	workspace, ok := h.workspaceWithWriter(w, r)
	if !ok {
		return
	}
	members, err := h.rosterStore.ListTeamMembers(r.Context(), workspace.ID)
	if err != nil {
		h.internal(w, err)
		return
	}
	sendJSON(w, models.WorkspaceResponse{Workspace: *workspace, Members: members})
}

func (h *RosterHandler) workspaceWithWriter(w http.ResponseWriter, r *http.Request) (*models.Workspace, bool) {
	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		sendError(w, "Unauthorized", http.StatusUnauthorized)
		return nil, false
	}
	workspace, err := h.rosterStore.CurrentWorkspace(r.Context(), userID)
	if err != nil {
		if err == sql.ErrNoRows {
			sendError(w, "Forbidden", http.StatusForbidden)
		} else {
			h.internal(w, err)
		}
		return nil, false
	}
	return workspace, true
}

func (h *RosterHandler) TeamMembers(w http.ResponseWriter, r *http.Request) {
	workspace, ok := h.workspaceWithWriter(w, r)
	if !ok {
		return
	}
	if r.Method == http.MethodGet {
		members, err := h.rosterStore.ListTeamMembers(r.Context(), workspace.ID)
		if err != nil {
			h.internal(w, err)
			return
		}
		sendJSON(w, members)
		return
	}
	var request models.TeamMemberRequest
	if !decodeRequest(w, r, &request) || strings.TrimSpace(request.Name) == "" {
		if strings.TrimSpace(request.Name) == "" {
			sendError(w, "Name is required", http.StatusBadRequest)
		}
		return
	}
	request.Name = strings.TrimSpace(request.Name)
	member, err := h.rosterStore.CreateTeamMember(r.Context(), workspace.ID, request)
	if err != nil {
		h.internal(w, err)
		return
	}
	w.WriteHeader(http.StatusCreated)
	sendJSON(w, member)
}

func (h *RosterHandler) TeamMember(w http.ResponseWriter, r *http.Request) {
	workspace, ok := h.workspaceWithWriter(w, r)
	if !ok {
		return
	}
	id := chi.URLParam(r, "memberID")
	if r.Method == http.MethodDelete {
		err := h.rosterStore.DeleteTeamMember(r.Context(), workspace.ID, id)
		if err == sql.ErrNoRows {
			sendError(w, "Not found", http.StatusNotFound)
		} else if err != nil {
			h.internal(w, err)
		} else {
			w.WriteHeader(http.StatusNoContent)
		}
		return
	}
	var request models.TeamMemberRequest
	if !decodeRequest(w, r, &request) || strings.TrimSpace(request.Name) == "" {
		if strings.TrimSpace(request.Name) == "" {
			sendError(w, "Name is required", http.StatusBadRequest)
		}
		return
	}
	request.Name = strings.TrimSpace(request.Name)
	member, err := h.rosterStore.UpdateTeamMember(r.Context(), workspace.ID, id, request)
	if err == sql.ErrNoRows {
		sendError(w, "Not found", http.StatusNotFound)
		return
	}
	if err != nil {
		h.internal(w, err)
		return
	}
	sendJSON(w, member)
}

func (h *RosterHandler) Roster(w http.ResponseWriter, r *http.Request) {
	workspace, ok := h.workspaceWithWriter(w, r)
	if !ok {
		return
	}
	week, ok := weekStart(w, chi.URLParam(r, "week"))
	if !ok {
		return
	}
	if r.Method == http.MethodGet {
		roster, err := h.rosterStore.GetRoster(r.Context(), workspace.ID, week)
		if err != nil {
			h.internal(w, err)
			return
		}
		sendJSON(w, roster)
		return
	}
	var request models.RosterRequest
	if !decodeRequest(w, r, &request) {
		return
	}
	if !h.validShifts(w, r, workspace.ID, week, request.Shifts) {
		return
	}
	if err := h.rosterStore.ReplaceRoster(r.Context(), workspace.ID, week, request.Shifts); err != nil {
		h.internal(w, err)
		return
	}
	roster, err := h.rosterStore.GetRoster(r.Context(), workspace.ID, week)
	if err != nil {
		h.internal(w, err)
		return
	}
	sendJSON(w, roster)
}

func (h *RosterHandler) PublishRoster(w http.ResponseWriter, r *http.Request) {
	h.setPublished(w, r, true)
}
func (h *RosterHandler) UnpublishRoster(w http.ResponseWriter, r *http.Request) {
	h.setPublished(w, r, false)
}
func (h *RosterHandler) setPublished(w http.ResponseWriter, r *http.Request, published bool) {
	workspace, ok := h.workspaceWithWriter(w, r)
	if !ok {
		return
	}
	week, ok := weekStart(w, chi.URLParam(r, "week"))
	if !ok {
		return
	}
	if err := h.rosterStore.SetRosterPublished(r.Context(), workspace.ID, week, published); err != nil {
		h.internal(w, err)
		return
	}
	roster, err := h.rosterStore.GetRoster(r.Context(), workspace.ID, week)
	if err != nil {
		h.internal(w, err)
		return
	}
	sendJSON(w, roster)
}

func (h *RosterHandler) TimeOff(w http.ResponseWriter, r *http.Request) {
	workspace, ok := h.workspaceWithWriter(w, r)
	if !ok {
		return
	}
	if r.Method == http.MethodGet {
		requests, err := h.rosterStore.ListTimeOff(r.Context(), workspace.ID)
		if err != nil {
			h.internal(w, err)
			return
		}
		sendJSON(w, requests)
		return
	}
	var request models.TimeOffRequest
	if !decodeRequest(w, r, &request) {
		return
	}
	start, err := time.Parse("2006-01-02", request.StartDate)
	end, endErr := time.Parse("2006-01-02", request.EndDate)
	if err != nil || endErr != nil || request.TeamMemberID == "" || end.Before(start) {
		sendError(w, "Valid team member and date range are required", http.StatusBadRequest)
		return
	}
	created, err := h.rosterStore.CreateTimeOff(r.Context(), workspace.ID, request)
	if err == sql.ErrNoRows {
		sendError(w, "Team member not found", http.StatusBadRequest)
		return
	}
	if err != nil {
		h.internal(w, err)
		return
	}
	w.WriteHeader(http.StatusCreated)
	sendJSON(w, created)
}

func (h *RosterHandler) ReviewTimeOff(w http.ResponseWriter, r *http.Request) {
	workspace, ok := h.workspaceWithWriter(w, r)
	if !ok {
		return
	}
	userID, _ := UserIDFromContext(r.Context())
	var request models.TimeOffReviewRequest
	if !decodeRequest(w, r, &request) {
		return
	}
	if request.Status != "approved" && request.Status != "rejected" {
		sendError(w, "Status must be approved or rejected", http.StatusBadRequest)
		return
	}
	reviewed, err := h.rosterStore.ReviewTimeOff(r.Context(), workspace.ID, chi.URLParam(r, "requestID"), request.Status, userID)
	if err == sql.ErrNoRows {
		sendError(w, "Not found", http.StatusNotFound)
		return
	}
	if err != nil {
		h.internal(w, err)
		return
	}
	sendJSON(w, reviewed)
}

func (h *RosterHandler) validShifts(w http.ResponseWriter, r *http.Request, workspaceID string, week time.Time, shifts []models.Shift) bool {
	members, err := h.rosterStore.ListTeamMembers(r.Context(), workspaceID)
	if err != nil {
		h.internal(w, err)
		return false
	}
	known := map[string]bool{}
	for _, member := range members {
		known[member.ID] = true
	}
	for i, shift := range shifts {
		shifts[i].Role = strings.TrimSpace(shift.Role)
		shift = shifts[i]
		date, dateErr := time.Parse("2006-01-02", shift.Date)
		start, startErr := time.Parse("15:04", shift.Start)
		end, endErr := time.Parse("15:04", shift.End)
		if dateErr != nil || startErr != nil || endErr != nil || strings.TrimSpace(shift.Role) == "" || !known[shift.TeamMemberID] || date.Before(week) || !date.Before(week.AddDate(0, 0, 7)) || !start.Before(end) {
			sendError(w, "Shifts must use workspace members, nonblank roles, valid times, and dates in the requested week", http.StatusBadRequest)
			return false
		}
		off, err := h.rosterStore.HasApprovedTimeOff(r.Context(), workspaceID, shift.TeamMemberID, date)
		if err != nil {
			h.internal(w, err)
			return false
		}
		if off {
			sendError(w, "Cannot assign a shift during approved time off", http.StatusBadRequest)
			return false
		}
		for _, other := range shifts[:i] {
			if other.TeamMemberID == shift.TeamMemberID && other.Date == shift.Date && shift.Start < other.End && other.Start < shift.End {
				sendError(w, "Shifts for a team member cannot overlap", http.StatusBadRequest)
				return false
			}
		}
	}
	return true
}
func (h *RosterHandler) internal(w http.ResponseWriter, err error) {
	h.logger.Error().Err(err).Msg("Roster request failed")
	sendError(w, "Internal Server Error", http.StatusInternalServerError)
}
func decodeRequest(w http.ResponseWriter, r *http.Request, value interface{}) bool {
	if err := decodeJSON(r, value); err != nil {
		sendError(w, "Invalid JSON", http.StatusBadRequest)
		return false
	}
	return true
}
func weekStart(w http.ResponseWriter, value string) (time.Time, bool) {
	week, err := time.Parse("2006-01-02", value)
	if err != nil || week.Weekday() != time.Monday {
		sendError(w, "Week must be a Monday in yyyy-mm-dd format", http.StatusBadRequest)
		return time.Time{}, false
	}
	return week, true
}
