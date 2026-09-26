-- +goose Up
-- +goose StatementBegin
ALTER TABLE roster_shifts ADD COLUMN role TEXT;
UPDATE roster_shifts SET role = 'Unassigned' WHERE role IS NULL;
ALTER TABLE roster_shifts ALTER COLUMN role SET NOT NULL;
ALTER TABLE roster_shifts ADD CONSTRAINT roster_shifts_role_not_blank CHECK (btrim(role) <> '');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE roster_shifts DROP CONSTRAINT roster_shifts_role_not_blank;
ALTER TABLE roster_shifts DROP COLUMN role;
-- +goose StatementEnd
