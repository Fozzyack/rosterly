package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/database"
	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/Fozzyack/rosterly/m/migrations"
	"github.com/joho/godotenv"
)

type sampleMember struct {
	name         string
	email        string
	roles        []string
	availability []models.AvailabilityWindow
}

func main() {
	email := flag.String("email", "test@example.com", "existing workspace owner's email")
	week := flag.String("week", monday(time.Now()).Format("2006-01-02"), "Monday to seed in yyyy-mm-dd format")
	replace := flag.Bool("replace", false, "replace existing shifts for the selected week")
	flag.Parse()

	if err := godotenv.Load(); err != nil {
		log.Fatal("error loading .env file")
	}
	weekStart, err := time.Parse("2006-01-02", *week)
	if err != nil || weekStart.Weekday() != time.Monday {
		log.Fatal("-week must be a Monday in yyyy-mm-dd format")
	}

	db, err := database.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	if err := database.MigrateDB(db, migrations.FS); err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	userStore := store.NewUserStore(db)
	rosterStore := store.NewRosterStore(db)
	owner, err := userStore.GetUserByEmail(ctx, *email)
	if err == sql.ErrNoRows {
		log.Fatalf("no user exists for %s; run go run ./cmd/seed-user first", *email)
	}
	if err != nil {
		log.Fatal(err)
	}
	workspace, err := rosterStore.CurrentWorkspace(ctx, owner.ID)
	if err != nil {
		log.Fatal(err)
	}

	members, err := seedMembers(ctx, rosterStore, workspace.ID)
	if err != nil {
		log.Fatal(err)
	}
	if err := seedTimeOff(ctx, rosterStore, workspace.ID, owner.ID, members["drew@rosterly.local"].ID, weekStart); err != nil {
		log.Fatal(err)
	}
	if err := seedRoster(ctx, rosterStore, workspace.ID, members, weekStart, *replace); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Seeded sample workspace %q for %s, week starting %s\n", workspace.Name, owner.Email, weekStart.Format("2006-01-02"))
}

func seedMembers(ctx context.Context, rosterStore store.RosterStore, workspaceID string) (map[string]*models.TeamMember, error) {
	samples := []sampleMember{
		{name: "Avery Bennett", email: "avery@rosterly.local", roles: []string{"Manager", "Barista"}, availability: weekdayAvailability(1, 5, "08:00", "17:00")},
		{name: "Jordan Lee", email: "jordan@rosterly.local", roles: []string{"Barista", "Server"}, availability: weekdayAvailability(1, 5, "09:00", "17:00")},
		{name: "Morgan Patel", email: "morgan@rosterly.local", roles: []string{"Chef", "Server"}, availability: weekdayAvailability(1, 5, "10:00", "18:00")},
		{name: "Drew Wilson", email: "drew@rosterly.local", roles: []string{"Cleaner", "Server"}, availability: weekdayAvailability(1, 5, "09:00", "17:00")},
	}
	existing, err := rosterStore.ListTeamMembers(ctx, workspaceID)
	if err != nil {
		return nil, err
	}
	byEmail := make(map[string]*models.TeamMember, len(existing))
	for i := range existing {
		byEmail[existing[i].Email] = &existing[i]
	}
	for _, sample := range samples {
		member := byEmail[sample.email]
		if member == nil {
			member, err = rosterStore.CreateTeamMember(ctx, workspaceID, models.TeamMemberRequest{Name: sample.name, Email: sample.email})
			if err != nil {
				return nil, err
			}
			byEmail[sample.email] = member
		}
		if _, err := rosterStore.ReplaceSchedulingProfile(ctx, workspaceID, models.SchedulingProfile{TeamMemberID: member.ID, Roles: sample.roles, Availability: sample.availability}); err != nil {
			return nil, err
		}
	}
	return byEmail, nil
}

func seedTimeOff(ctx context.Context, rosterStore store.RosterStore, workspaceID, ownerID, memberID string, weekStart time.Time) error {
	const reason = "Sample appointment"
	date := weekStart.AddDate(0, 0, 2).Format("2006-01-02")
	requests, err := rosterStore.ListTimeOff(ctx, workspaceID)
	if err != nil {
		return err
	}
	for _, request := range requests {
		if request.TeamMemberID == memberID && request.StartDate == date && request.EndDate == date && request.Reason == reason {
			return nil
		}
	}
	request, err := rosterStore.CreateTimeOff(ctx, workspaceID, models.TimeOffRequest{TeamMemberID: memberID, StartDate: date, EndDate: date, Reason: reason})
	if err != nil {
		return err
	}
	_, err = rosterStore.ReviewTimeOff(ctx, workspaceID, request.ID, "approved", ownerID)
	return err
}

func seedRoster(ctx context.Context, rosterStore store.RosterStore, workspaceID string, members map[string]*models.TeamMember, weekStart time.Time, replace bool) error {
	existing, err := rosterStore.GetRoster(ctx, workspaceID, weekStart)
	if err != nil {
		return err
	}
	if len(existing.Shifts) > 0 && !replace {
		return nil
	}
	date := func(day int) string { return weekStart.AddDate(0, 0, day).Format("2006-01-02") }
	shifts := []models.Shift{
		{TeamMemberID: members["avery@rosterly.local"].ID, Date: date(0), Start: "08:00", End: "16:00", Role: "Manager"},
		{TeamMemberID: members["jordan@rosterly.local"].ID, Date: date(0), Start: "09:00", End: "17:00", Role: "Barista"},
		{TeamMemberID: members["morgan@rosterly.local"].ID, Date: date(0), Start: "10:00", End: "18:00", Role: "Chef"},
		{TeamMemberID: members["avery@rosterly.local"].ID, Date: date(1), Start: "08:00", End: "16:00", Role: "Manager"},
		{TeamMemberID: members["jordan@rosterly.local"].ID, Date: date(1), Start: "09:00", End: "17:00", Role: "Server"},
		{TeamMemberID: members["morgan@rosterly.local"].ID, Date: date(1), Start: "10:00", End: "18:00", Role: "Chef"},
		{TeamMemberID: members["avery@rosterly.local"].ID, Date: date(3), Start: "08:00", End: "16:00", Role: "Manager"},
		{TeamMemberID: members["jordan@rosterly.local"].ID, Date: date(3), Start: "09:00", End: "17:00", Role: "Barista"},
		{TeamMemberID: members["drew@rosterly.local"].ID, Date: date(3), Start: "09:00", End: "13:00", Role: "Cleaner"},
	}
	return rosterStore.ReplaceRoster(ctx, workspaceID, weekStart, shifts)
}

func weekdayAvailability(first, last int, start, end string) []models.AvailabilityWindow {
	windows := make([]models.AvailabilityWindow, 0, last-first+1)
	for day := first; day <= last; day++ {
		windows = append(windows, models.AvailabilityWindow{Weekday: day, Start: start, End: end})
	}
	return windows
}

func monday(date time.Time) time.Time {
	daysSinceMonday := (int(date.Weekday()) + 6) % 7
	return time.Date(date.Year(), date.Month(), date.Day()-daysSinceMonday, 0, 0, 0, 0, date.Location())
}
