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
	roster   *models.RosterResponse
	profiles []models.SchedulingProfile
	timeOff  []models.TimeOff
	profile  *models.SchedulingProfile
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
	if s.roster != nil {
		return s.roster, nil
	}
	return &models.RosterResponse{Shifts: []models.Shift{}}, nil
}
func (s *rosterTestStore) ListSchedulingProfiles(context.Context, string) ([]models.SchedulingProfile, error) {
	return s.profiles, nil
}
func (s *rosterTestStore) ListTimeOff(context.Context, string) ([]models.TimeOff, error) {
	return s.timeOff, nil
}
func (s *rosterTestStore) ReplaceSchedulingProfile(_ context.Context, _ string, profile models.SchedulingProfile) (*models.SchedulingProfile, error) {
	s.profile = &profile
	return &profile, nil
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

func TestDraftRoster(t *testing.T) {
	s := &rosterTestStore{
		members: []models.TeamMember{{ID: "a"}, {ID: "b"}},
		roster:  &models.RosterResponse{Shifts: []models.Shift{{ID: "manual", TeamMemberID: "a", Date: "2026-04-06", Start: "09:00", End: "13:00", Role: "Cashier"}}},
		profiles: []models.SchedulingProfile{
			{TeamMemberID: "a", Roles: []string{"Cashier"}, Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "09:00", End: "17:00"}}},
			{TeamMemberID: "b", Roles: []string{"Cashier"}, Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "09:00", End: "17:00"}}},
		},
	}
	logger := zerolog.Nop()
	h := NewRosterHandler(&logger, s)
	body := `{"open_shifts":[{"date":"2026-04-06","start":"09:00","end":"13:00","role":"Cashier"},{"date":"2026-04-06","start":"13:00","end":"17:00","role":"Cook"}]}`
	r := httptest.NewRequest(http.MethodPost, "/rosters/2026-04-06/draft/", strings.NewReader(body))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("week", "2026-04-06")
	r = r.WithContext(context.WithValue(context.WithValue(r.Context(), chi.RouteCtxKey, rctx), userIDContextKey, "user"))
	w := httptest.NewRecorder()
	h.DraftRoster(w, r)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"week_start":"2026-04-06","manual_shifts":[{"id":"manual","team_member_id":"a","date":"2026-04-06","start":"09:00","end":"13:00","role":"Cashier"}],"generated_shifts":[{"team_member_id":"b","date":"2026-04-06","start":"09:00","end":"13:00","role":"Cashier"}],"unfilled_shifts":[{"date":"2026-04-06","start":"13:00","end":"17:00","role":"Cook"}]}`, w.Body.String())
}

func TestDraftRosterRejectsInvalidOpenShift(t *testing.T) {
	s := &rosterTestStore{members: []models.TeamMember{{ID: "member"}}}
	logger := zerolog.Nop()
	h := NewRosterHandler(&logger, s)
	r := httptest.NewRequest(http.MethodPost, "/rosters/2026-04-06/draft/", strings.NewReader(`{"open_shifts":[{"date":"2026-04-06","start":"17:00","end":"09:00","role":" "}]}`))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("week", "2026-04-06")
	r = r.WithContext(context.WithValue(context.WithValue(r.Context(), chi.RouteCtxKey, rctx), userIDContextKey, "user"))
	w := httptest.NewRecorder()
	h.DraftRoster(w, r)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPublishedRosterCannotBeChangedOrDrafted(t *testing.T) {
	s := &rosterTestStore{members: []models.TeamMember{{ID: "member"}}, roster: &models.RosterResponse{Published: true, Shifts: []models.Shift{}}}
	logger := zerolog.Nop()
	h := NewRosterHandler(&logger, s)

	for _, request := range []*http.Request{
		httptest.NewRequest(http.MethodPut, "/rosters/2026-04-06/", strings.NewReader(`{"shifts":[]}`)),
		httptest.NewRequest(http.MethodPost, "/rosters/2026-04-06/draft/", strings.NewReader(`{"open_shifts":[]}`)),
	} {
		rctx := chi.NewRouteContext()
		rctx.URLParams.Add("week", "2026-04-06")
		request = request.WithContext(context.WithValue(context.WithValue(request.Context(), chi.RouteCtxKey, rctx), userIDContextKey, "user"))
		w := httptest.NewRecorder()
		if request.Method == http.MethodPut {
			h.Roster(w, request)
		} else {
			h.DraftRoster(w, request)
		}
		assert.Equal(t, http.StatusConflict, w.Code)
	}
	assert.False(t, s.replaced)
}

func TestValidSchedulingProfile(t *testing.T) {
	assert.True(t, validSchedulingProfile(models.SchedulingProfile{
		Roles:        []string{"Cashier"},
		Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "09:00", End: "17:00"}},
	}))
	assert.False(t, validSchedulingProfile(models.SchedulingProfile{Roles: []string{"Cashier", "Cashier"}}))
	assert.False(t, validSchedulingProfile(models.SchedulingProfile{Availability: []models.AvailabilityWindow{{Weekday: 0, Start: "09:00", End: "17:00"}}}))
	assert.False(t, validSchedulingProfile(models.SchedulingProfile{Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "17:00", End: "09:00"}}}))
}

func TestSchedulingProfilePutUsesRouteMember(t *testing.T) {
	s := &rosterTestStore{}
	logger := zerolog.Nop()
	h := NewRosterHandler(&logger, s)
	r := httptest.NewRequest(http.MethodPut, "/team-members/member/scheduling-profile/", strings.NewReader(`{"team_member_id":"other","roles":[" Cashier "],"availability":[{"weekday":1,"start":"09:00","end":"17:00"}]}`))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("memberID", "member")
	r = r.WithContext(context.WithValue(context.WithValue(r.Context(), chi.RouteCtxKey, rctx), userIDContextKey, "user"))
	w := httptest.NewRecorder()
	h.SchedulingProfile(w, r)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, &models.SchedulingProfile{TeamMemberID: "member", Roles: []string{"Cashier"}, Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "09:00", End: "17:00"}}}, s.profile)
}
