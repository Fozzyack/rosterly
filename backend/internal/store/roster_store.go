package store

import (
	"context"
	"database/sql"
	"time"

	"github.com/Fozzyack/rosterly/m/internal/models"
)

type RosterStore interface {
	CurrentWorkspace(context.Context, string) (*models.Workspace, error)
	ListTeamMembers(context.Context, string) ([]models.TeamMember, error)
	CreateTeamMember(context.Context, string, models.TeamMemberRequest) (*models.TeamMember, error)
	UpdateTeamMember(context.Context, string, string, models.TeamMemberRequest) (*models.TeamMember, error)
	DeleteTeamMember(context.Context, string, string) error
	GetSchedulingProfile(context.Context, string, string) (*models.SchedulingProfile, error)
	ReplaceSchedulingProfile(context.Context, string, models.SchedulingProfile) (*models.SchedulingProfile, error)
	ListSchedulingProfiles(context.Context, string) ([]models.SchedulingProfile, error)
	GetRoster(context.Context, string, time.Time) (*models.RosterResponse, error)
	ReplaceRoster(context.Context, string, time.Time, []models.Shift) error
	SetRosterPublished(context.Context, string, time.Time, bool) error
	ListTimeOff(context.Context, string) ([]models.TimeOff, error)
	CreateTimeOff(context.Context, string, models.TimeOffRequest) (*models.TimeOff, error)
	ReviewTimeOff(context.Context, string, string, string, string) (*models.TimeOff, error)
	HasApprovedTimeOff(context.Context, string, string, time.Time) (bool, error)
}

func (ps *PostgresStore) GetSchedulingProfile(ctx context.Context, workspaceID, memberID string) (*models.SchedulingProfile, error) {
	profiles, err := ps.ListSchedulingProfiles(ctx, workspaceID)
	if err != nil {
		return nil, err
	}
	for _, profile := range profiles {
		if profile.TeamMemberID == memberID {
			return &profile, nil
		}
	}
	return nil, sql.ErrNoRows
}

func (ps *PostgresStore) ListSchedulingProfiles(ctx context.Context, workspaceID string) ([]models.SchedulingProfile, error) {
	members, err := ps.ListTeamMembers(ctx, workspaceID)
	if err != nil {
		return nil, err
	}
	profiles := make([]models.SchedulingProfile, len(members))
	byID := make(map[string]*models.SchedulingProfile, len(members))
	for i, member := range members {
		profiles[i] = models.SchedulingProfile{TeamMemberID: member.ID, Roles: []string{}, Availability: []models.AvailabilityWindow{}}
		byID[member.ID] = &profiles[i]
	}
	roleRows, err := ps.db.QueryContext(ctx, `SELECT team_member_id, role FROM team_member_roles WHERE workspace_id = $1 ORDER BY team_member_id, role`, workspaceID)
	if err != nil {
		return nil, err
	}
	defer roleRows.Close()
	for roleRows.Next() {
		var memberID, role string
		if err := roleRows.Scan(&memberID, &role); err != nil {
			return nil, err
		}
		byID[memberID].Roles = append(byID[memberID].Roles, role)
	}
	if err := roleRows.Err(); err != nil {
		return nil, err
	}
	availabilityRows, err := ps.db.QueryContext(ctx, `SELECT team_member_id, weekday, to_char(start_time, 'HH24:MI'), to_char(end_time, 'HH24:MI') FROM team_member_availability WHERE workspace_id = $1 ORDER BY team_member_id, weekday, start_time`, workspaceID)
	if err != nil {
		return nil, err
	}
	defer availabilityRows.Close()
	for availabilityRows.Next() {
		var memberID string
		var window models.AvailabilityWindow
		if err := availabilityRows.Scan(&memberID, &window.Weekday, &window.Start, &window.End); err != nil {
			return nil, err
		}
		byID[memberID].Availability = append(byID[memberID].Availability, window)
	}
	return profiles, availabilityRows.Err()
}

func (ps *PostgresStore) ReplaceSchedulingProfile(ctx context.Context, workspaceID string, profile models.SchedulingProfile) (*models.SchedulingProfile, error) {
	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	var exists bool
	if err = tx.QueryRowContext(ctx, `SELECT EXISTS (SELECT 1 FROM team_members WHERE workspace_id = $1 AND id = $2)`, workspaceID, profile.TeamMemberID).Scan(&exists); err != nil {
		return nil, err
	}
	if !exists {
		return nil, sql.ErrNoRows
	}
	if _, err = tx.ExecContext(ctx, `DELETE FROM team_member_roles WHERE workspace_id = $1 AND team_member_id = $2`, workspaceID, profile.TeamMemberID); err != nil {
		return nil, err
	}
	if _, err = tx.ExecContext(ctx, `DELETE FROM team_member_availability WHERE workspace_id = $1 AND team_member_id = $2`, workspaceID, profile.TeamMemberID); err != nil {
		return nil, err
	}
	for _, role := range profile.Roles {
		if _, err = tx.ExecContext(ctx, `INSERT INTO team_member_roles (workspace_id, team_member_id, role) VALUES ($1, $2, $3)`, workspaceID, profile.TeamMemberID, role); err != nil {
			return nil, err
		}
	}
	for _, window := range profile.Availability {
		if _, err = tx.ExecContext(ctx, `INSERT INTO team_member_availability (workspace_id, team_member_id, weekday, start_time, end_time) VALUES ($1, $2, $3, $4, $5)`, workspaceID, profile.TeamMemberID, window.Weekday, window.Start, window.End); err != nil {
			return nil, err
		}
	}
	if err = tx.Commit(); err != nil {
		return nil, err
	}
	return &profile, nil
}

func NewRosterStore(db *sql.DB) RosterStore { return &PostgresStore{db: db} }

func (ps *PostgresStore) CurrentWorkspace(ctx context.Context, userID string) (*models.Workspace, error) {
	workspace := &models.Workspace{}
	err := ps.db.QueryRowContext(ctx, `SELECT w.id, w.name FROM workspaces w JOIN workspace_memberships m ON m.workspace_id = w.id WHERE m.user_id = $1 ORDER BY w.created_at LIMIT 1`, userID).Scan(&workspace.ID, &workspace.Name)
	if err != nil {
		return nil, err
	}
	return workspace, nil
}

func (ps *PostgresStore) ListTeamMembers(ctx context.Context, workspaceID string) ([]models.TeamMember, error) {
	rows, err := ps.db.QueryContext(ctx, `SELECT id, name, COALESCE(email, '') FROM team_members WHERE workspace_id = $1 ORDER BY name, id`, workspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var members []models.TeamMember
	for rows.Next() {
		var member models.TeamMember
		if err := rows.Scan(&member.ID, &member.Name, &member.Email); err != nil {
			return nil, err
		}
		members = append(members, member)
	}
	return members, rows.Err()
}

func (ps *PostgresStore) CreateTeamMember(ctx context.Context, workspaceID string, request models.TeamMemberRequest) (*models.TeamMember, error) {
	member := &models.TeamMember{}
	err := ps.db.QueryRowContext(ctx, `INSERT INTO team_members (workspace_id, name, email) VALUES ($1, $2, NULLIF($3, '')) RETURNING id, name, COALESCE(email, '')`, workspaceID, request.Name, request.Email).Scan(&member.ID, &member.Name, &member.Email)
	if err != nil {
		return nil, err
	}
	return member, nil
}

func (ps *PostgresStore) UpdateTeamMember(ctx context.Context, workspaceID, memberID string, request models.TeamMemberRequest) (*models.TeamMember, error) {
	member := &models.TeamMember{}
	err := ps.db.QueryRowContext(ctx, `UPDATE team_members SET name = $3, email = NULLIF($4, ''), updated_at = now() WHERE workspace_id = $1 AND id = $2 RETURNING id, name, COALESCE(email, '')`, workspaceID, memberID, request.Name, request.Email).Scan(&member.ID, &member.Name, &member.Email)
	if err != nil {
		return nil, err
	}
	return member, nil
}

func (ps *PostgresStore) DeleteTeamMember(ctx context.Context, workspaceID, memberID string) error {
	result, err := ps.db.ExecContext(ctx, `DELETE FROM team_members WHERE workspace_id = $1 AND id = $2`, workspaceID, memberID)
	if err != nil {
		return err
	}
	count, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (ps *PostgresStore) GetRoster(ctx context.Context, workspaceID string, weekStart time.Time) (*models.RosterResponse, error) {
	roster := &models.RosterResponse{WeekStart: weekStart.Format("2006-01-02"), Shifts: []models.Shift{}}
	err := ps.db.QueryRowContext(ctx, `SELECT published_at IS NOT NULL FROM roster_weeks WHERE workspace_id = $1 AND week_start = $2`, workspaceID, weekStart).Scan(&roster.Published)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	rows, err := ps.db.QueryContext(ctx, `SELECT id, team_member_id, shift_date, to_char(start_time, 'HH24:MI'), to_char(end_time, 'HH24:MI'), role FROM roster_shifts WHERE workspace_id = $1 AND shift_date >= $2 AND shift_date < $2 + 7 ORDER BY shift_date, start_time, id`, workspaceID, weekStart)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var shift models.Shift
		var date time.Time
		if err := rows.Scan(&shift.ID, &shift.TeamMemberID, &date, &shift.Start, &shift.End, &shift.Role); err != nil {
			return nil, err
		}
		shift.Date = date.Format("2006-01-02")
		roster.Shifts = append(roster.Shifts, shift)
	}
	return roster, rows.Err()
}

func (ps *PostgresStore) ReplaceRoster(ctx context.Context, workspaceID string, weekStart time.Time, shifts []models.Shift) error {
	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if _, err = tx.ExecContext(ctx, `DELETE FROM roster_shifts WHERE workspace_id = $1 AND shift_date >= $2 AND shift_date < $2 + 7`, workspaceID, weekStart); err != nil {
		return err
	}
	for _, shift := range shifts {
		if _, err = tx.ExecContext(ctx, `INSERT INTO roster_shifts (workspace_id, team_member_id, shift_date, start_time, end_time, role) VALUES ($1, $2, $3, $4, $5, $6)`, workspaceID, shift.TeamMemberID, shift.Date, shift.Start, shift.End, shift.Role); err != nil {
			return err
		}
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO roster_weeks (workspace_id, week_start) VALUES ($1, $2) ON CONFLICT DO NOTHING`, workspaceID, weekStart); err != nil {
		return err
	}
	return tx.Commit()
}

func (ps *PostgresStore) SetRosterPublished(ctx context.Context, workspaceID string, weekStart time.Time, published bool) error {
	_, err := ps.db.ExecContext(ctx, `INSERT INTO roster_weeks (workspace_id, week_start, published_at) VALUES ($1, $2, CASE WHEN $3 THEN now() ELSE NULL END) ON CONFLICT (workspace_id, week_start) DO UPDATE SET published_at = CASE WHEN $3 THEN now() ELSE NULL END`, workspaceID, weekStart, published)
	return err
}

func (ps *PostgresStore) ListTimeOff(ctx context.Context, workspaceID string) ([]models.TimeOff, error) {
	rows, err := ps.db.QueryContext(ctx, `SELECT id, team_member_id, start_date, end_date, reason, status, created_at FROM time_off_requests WHERE workspace_id = $1 ORDER BY start_date DESC, created_at DESC`, workspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var requests []models.TimeOff
	for rows.Next() {
		var request models.TimeOff
		var start, end time.Time
		if err := rows.Scan(&request.ID, &request.TeamMemberID, &start, &end, &request.Reason, &request.Status, &request.CreatedAt); err != nil {
			return nil, err
		}
		request.StartDate = start.Format("2006-01-02")
		request.EndDate = end.Format("2006-01-02")
		requests = append(requests, request)
	}
	return requests, rows.Err()
}

func (ps *PostgresStore) CreateTimeOff(ctx context.Context, workspaceID string, request models.TimeOffRequest) (*models.TimeOff, error) {
	created := &models.TimeOff{}
	var start, end time.Time
	err := ps.db.QueryRowContext(ctx, `INSERT INTO time_off_requests (workspace_id, team_member_id, start_date, end_date, reason) SELECT $1, $2, $3, $4, $5 WHERE EXISTS (SELECT 1 FROM team_members WHERE id = $2 AND workspace_id = $1) RETURNING id, team_member_id, start_date, end_date, reason, status, created_at`, workspaceID, request.TeamMemberID, request.StartDate, request.EndDate, request.Reason).Scan(&created.ID, &created.TeamMemberID, &start, &end, &created.Reason, &created.Status, &created.CreatedAt)
	if err != nil {
		return nil, err
	}
	created.StartDate = start.Format("2006-01-02")
	created.EndDate = end.Format("2006-01-02")
	return created, nil
}

func (ps *PostgresStore) ReviewTimeOff(ctx context.Context, workspaceID, requestID, status, userID string) (*models.TimeOff, error) {
	reviewed := &models.TimeOff{}
	var start, end time.Time
	err := ps.db.QueryRowContext(ctx, `UPDATE time_off_requests SET status = $3, reviewed_by = $4, reviewed_at = now() WHERE workspace_id = $1 AND id = $2 RETURNING id, team_member_id, start_date, end_date, reason, status, created_at`, workspaceID, requestID, status, userID).Scan(&reviewed.ID, &reviewed.TeamMemberID, &start, &end, &reviewed.Reason, &reviewed.Status, &reviewed.CreatedAt)
	if err != nil {
		return nil, err
	}
	reviewed.StartDate = start.Format("2006-01-02")
	reviewed.EndDate = end.Format("2006-01-02")
	return reviewed, nil
}

func (ps *PostgresStore) HasApprovedTimeOff(ctx context.Context, workspaceID, memberID string, date time.Time) (bool, error) {
	var exists bool
	err := ps.db.QueryRowContext(ctx, `SELECT EXISTS (SELECT 1 FROM time_off_requests WHERE workspace_id = $1 AND team_member_id = $2 AND status = 'approved' AND start_date <= $3 AND end_date >= $3)`, workspaceID, memberID, date).Scan(&exists)
	return exists, err
}
