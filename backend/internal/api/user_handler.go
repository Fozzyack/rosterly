package api

type UserHandler struct{}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

func (uh *UserHandler) GetUsers() []string {
	return []string{"Foo", "Bar"}
}
