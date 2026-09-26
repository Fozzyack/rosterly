package scheduling

import (
	"testing"

	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/stretchr/testify/assert"
)

func TestDraftHonorsConstraintsAndBalancesLoad(t *testing.T) {
	members := []models.TeamMember{{ID: "b"}, {ID: "a"}, {ID: "c"}}
	profiles := []models.SchedulingProfile{
		{TeamMemberID: "a", Roles: []string{"Cashier"}, Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "09:00", End: "17:00"}}},
		{TeamMemberID: "b", Roles: []string{"Cashier"}, Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "09:00", End: "17:00"}}},
		{TeamMemberID: "c", Roles: []string{"Cook"}, Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "09:00", End: "17:00"}}},
	}
	manual := []models.Shift{{TeamMemberID: "a", Date: "2026-04-06", Start: "09:00", End: "13:00", Role: "Cashier"}}
	open := []models.OpenShift{
		{Date: "2026-04-06", Start: "13:00", End: "17:00", Role: "Cashier"},
		{Date: "2026-04-06", Start: "09:00", End: "13:00", Role: "Cashier"},
		{Date: "2026-04-06", Start: "09:00", End: "13:00", Role: "Cook"},
	}
	generated, unfilled := Draft(members, profiles, manual, open, []models.TimeOff{{TeamMemberID: "c", StartDate: "2026-04-06", EndDate: "2026-04-06", Status: "approved"}})
	assert.Equal(t, []models.Shift{
		{TeamMemberID: "b", Date: "2026-04-06", Start: "09:00", End: "13:00", Role: "Cashier"},
		{TeamMemberID: "a", Date: "2026-04-06", Start: "13:00", End: "17:00", Role: "Cashier"},
	}, generated)
	assert.Equal(t, []models.OpenShift{{Date: "2026-04-06", Start: "09:00", End: "13:00", Role: "Cook"}}, unfilled)
}

func TestDraftDoesNotAssignOutsideAvailabilityOrOverManualShift(t *testing.T) {
	profile := models.SchedulingProfile{TeamMemberID: "member", Roles: []string{"Cashier"}, Availability: []models.AvailabilityWindow{{Weekday: 1, Start: "10:00", End: "18:00"}}}
	open := []models.OpenShift{{Date: "2026-04-06", Start: "09:00", End: "12:00", Role: "Cashier"}, {Date: "2026-04-06", Start: "10:00", End: "14:00", Role: "Cashier"}}
	generated, unfilled := Draft([]models.TeamMember{{ID: "member"}}, []models.SchedulingProfile{profile}, []models.Shift{{TeamMemberID: "member", Date: "2026-04-06", Start: "13:00", End: "17:00", Role: "Cashier"}}, open, nil)
	assert.Empty(t, generated)
	assert.Equal(t, open, unfilled)
}
