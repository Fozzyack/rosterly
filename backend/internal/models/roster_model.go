package models

import "time"

type Workspace struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type TeamMember struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email,omitempty"`
}

type TeamMemberRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

// SchedulingProfile contains the recurring constraints used only when drafting.
type SchedulingProfile struct {
	TeamMemberID string               `json:"team_member_id"`
	Roles        []string             `json:"roles"`
	Availability []AvailabilityWindow `json:"availability"`
}

// AvailabilityWindow uses ISO weekdays: Monday is 1 and Sunday is 7.
type AvailabilityWindow struct {
	Weekday int    `json:"weekday"`
	Start   string `json:"start"`
	End     string `json:"end"`
}

type Shift struct {
	ID           string `json:"id,omitempty"`
	TeamMemberID string `json:"team_member_id"`
	Date         string `json:"date"`
	Start        string `json:"start"`
	End          string `json:"end"`
	Role         string `json:"role"`
}

type RosterResponse struct {
	WeekStart string  `json:"week_start"`
	Published bool    `json:"published"`
	Shifts    []Shift `json:"shifts"`
}

type RosterRequest struct {
	Shifts []Shift `json:"shifts"`
}

type OpenShift struct {
	Date  string `json:"date"`
	Start string `json:"start"`
	End   string `json:"end"`
	Role  string `json:"role"`
}

type DraftRosterRequest struct {
	OpenShifts []OpenShift `json:"open_shifts"`
}

type DraftRosterResponse struct {
	WeekStart       string      `json:"week_start"`
	ManualShifts    []Shift     `json:"manual_shifts"`
	GeneratedShifts []Shift     `json:"generated_shifts"`
	UnfilledShifts  []OpenShift `json:"unfilled_shifts"`
}

type TimeOffRequest struct {
	TeamMemberID string `json:"team_member_id"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	Reason       string `json:"reason"`
}

type TimeOff struct {
	ID           string    `json:"id"`
	TeamMemberID string    `json:"team_member_id"`
	StartDate    string    `json:"start_date"`
	EndDate      string    `json:"end_date"`
	Reason       string    `json:"reason"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
}

type TimeOffReviewRequest struct {
	Status string `json:"status"`
}

type WorkspaceResponse struct {
	Workspace Workspace    `json:"workspace"`
	Members   []TeamMember `json:"members"`
}
