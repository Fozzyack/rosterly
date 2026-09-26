-- +goose Up
-- +goose StatementBegin
CREATE TABLE team_member_roles (
    workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
    team_member_id UUID NOT NULL REFERENCES team_members (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (btrim(role) <> ''),
    PRIMARY KEY (team_member_id, role)
);
CREATE INDEX idx_team_member_roles_workspace ON team_member_roles (workspace_id, team_member_id);

CREATE TABLE team_member_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
    team_member_id UUID NOT NULL REFERENCES team_members (id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (start_time < end_time)
);
CREATE INDEX idx_team_member_availability_workspace ON team_member_availability (workspace_id, team_member_id, weekday);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE team_member_availability;
DROP TABLE team_member_roles;
-- +goose StatementEnd
