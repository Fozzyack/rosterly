package scheduling

import (
	"sort"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/models"
)

const dateFormat = "2006-01-02"

// Draft assigns each demand to the eligible least-loaded member. Inputs must be validated by the caller.
func Draft(members []models.TeamMember, profiles []models.SchedulingProfile, manual []models.Shift, open []models.OpenShift, timeOff []models.TimeOff) ([]models.Shift, []models.OpenShift) {
	members = append([]models.TeamMember(nil), members...)
	open = append([]models.OpenShift(nil), open...)
	profileByMember := make(map[string]models.SchedulingProfile, len(profiles))
	for _, profile := range profiles {
		profileByMember[profile.TeamMemberID] = profile
	}
	assigned := append([]models.Shift(nil), manual...)
	minutes := make(map[string]int, len(members))
	for _, shift := range manual {
		minutes[shift.TeamMemberID] += durationMinutes(shift.Start, shift.End)
	}
	sort.Slice(members, func(i, j int) bool { return members[i].ID < members[j].ID })
	sort.Slice(open, func(i, j int) bool {
		if open[i].Date != open[j].Date {
			return open[i].Date < open[j].Date
		}
		if open[i].Start != open[j].Start {
			return open[i].Start < open[j].Start
		}
		if open[i].End != open[j].End {
			return open[i].End < open[j].End
		}
		return open[i].Role < open[j].Role
	})
	generated := make([]models.Shift, 0, len(open))
	unfilled := make([]models.OpenShift, 0)
	for _, demand := range open {
		date, _ := time.Parse(dateFormat, demand.Date)
		candidate := ""
		for _, member := range members {
			if !qualified(profileByMember[member.ID], demand.Role) || !available(profileByMember[member.ID], date, demand.Start, demand.End) || hasTimeOff(timeOff, member.ID, demand.Date) || overlaps(assigned, member.ID, demand) {
				continue
			}
			if candidate == "" || minutes[member.ID] < minutes[candidate] {
				candidate = member.ID
			}
		}
		if candidate == "" {
			unfilled = append(unfilled, demand)
			continue
		}
		shift := models.Shift{TeamMemberID: candidate, Date: demand.Date, Start: demand.Start, End: demand.End, Role: demand.Role}
		assigned = append(assigned, shift)
		generated = append(generated, shift)
		minutes[candidate] += durationMinutes(demand.Start, demand.End)
	}
	return generated, unfilled
}

func qualified(profile models.SchedulingProfile, role string) bool {
	for _, candidate := range profile.Roles {
		if candidate == role {
			return true
		}
	}
	return false
}

func available(profile models.SchedulingProfile, date time.Time, start, end string) bool {
	weekday := int(date.Weekday())
	if weekday == 0 {
		weekday = 7
	}
	for _, window := range profile.Availability {
		if window.Weekday == weekday && window.Start <= start && end <= window.End {
			return true
		}
	}
	return false
}

func hasTimeOff(requests []models.TimeOff, memberID, date string) bool {
	for _, request := range requests {
		if request.TeamMemberID == memberID && request.Status == "approved" && request.StartDate <= date && date <= request.EndDate {
			return true
		}
	}
	return false
}

func overlaps(shifts []models.Shift, memberID string, demand models.OpenShift) bool {
	for _, shift := range shifts {
		if shift.TeamMemberID == memberID && shift.Date == demand.Date && demand.Start < shift.End && shift.Start < demand.End {
			return true
		}
	}
	return false
}

func durationMinutes(start, end string) int {
	from, _ := time.Parse("15:04", start)
	to, _ := time.Parse("15:04", end)
	return int(to.Sub(from).Minutes())
}
