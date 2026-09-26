package api

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
)

type rosterTestStore struct {
	store.RosterStore
	members  []models.TeamMember
	off      bool
	replaced bool
}

func (s *rosterTestStore) CurrentWorkspace(context.Context, string) (*models.Workspace, error) {
	return &models.Workspace{ID: "workspace"}, nil
}
func (s *rosterTestStore) ListTeamMembers(context.Context, string) ([]models.TeamMember, error) {
	return s.members, nil
}
func (s *rosterTestStore) HasApprovedTimeOff(context.Context, string, string, time.Time) (bool, error) {
	return s.off, nil
}
func (s *rosterTestStore) ReplaceRoster(context.Context, string, time.Time, []models.Shift) error {
	s.replaced = true
	return nil
}
func (s *rosterTestStore) GetRoster(context.Context, string, time.Time) (*models.RosterResponse, error) {
	return &models.RosterResponse{Shifts: []models.Shift{}}, nil
}

func TestRosterPutValidation(t *testing.T) {
	tests := []struct {
		name string
		week string
		body string
		off  bool
		want int
	}{
		{name: "week must be monday", week: "2026-04-07", body: `{"shifts":[]}`, want: http.StatusBadRequest},
		{name: "role is required", week: "2026-04-06", body: `{"shifts":[{"team_member_id":"member","date":"2026-04-06","start":"09:00","end":"17:00"}]}`, want: http.StatusBadRequest},
		{name: "shift date must be in week", week: "2026-04-06", body: `{"shifts":[{"team_member_id":"member","date":"2026-04-13","start":"09:00","end":"17:00","role":"Cashier"}]}`, want: http.StatusBadRequest},
		{name: "overlapping shifts rejected", week: "2026-04-06", body: `{"shifts":[{"team_member_id":"member","date":"2026-04-06","start":"09:00","end":"13:00","role":"Cashier"},{"team_member_id":"member","date":"2026-04-06","start":"12:00","end":"17:00","role":"Cashier"}]}`, want: http.StatusBadRequest},
		{name: "approved time off rejected", week: "2026-04-06", body: `{"shifts":[{"team_member_id":"member","date":"2026-04-06","start":"09:00","end":"17:00","role":"Cashier"}]}`, off: true, want: http.StatusBadRequest},
		{name: "valid roster persists", week: "2026-04-06", body: `{"shifts":[{"team_member_id":"member","date":"2026-04-06","start":"09:00","end":"17:00","role":"Cashier"}]}`, want: http.StatusOK},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &rosterTestStore{members: []models.TeamMember{{ID: "member"}}, off: tt.off}
			logger := zerolog.Nop()
			h := NewRosterHandler(&logger, s)
			r := httptest.NewRequest(http.MethodPut, "/rosters/"+tt.week+"/", strings.NewReader(tt.body))
			rctx := chi.NewRouteContext()
			rctx.URLParams.Add("week", tt.week)
			r = r.WithContext(context.WithValue(context.WithValue(r.Context(), chi.RouteCtxKey, rctx), userIDContextKey, "user"))
			w := httptest.NewRecorder()
			h.Roster(w, r)
			assert.Equal(t, tt.want, w.Code)
			assert.Equal(t, tt.want == http.StatusOK, s.replaced)
		})
	}
}
