package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"

	"github.com/Fozzyack/rosterly/m/internal/auth"
	"github.com/Fozzyack/rosterly/m/internal/database"
	"github.com/Fozzyack/rosterly/m/internal/models"
	"github.com/Fozzyack/rosterly/m/internal/store"
	"github.com/Fozzyack/rosterly/m/migrations"
	"github.com/joho/godotenv"
)

func main() {
	name := flag.String("name", "Test User", "test user name")
	email := flag.String("email", "test@example.com", "test user email")
	password := flag.String("password", "test-password", "test user password")
	flag.Parse()

	if err := godotenv.Load(); err != nil {
		log.Fatal("error loading .env file")
	}

	db, err := database.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := database.MigrateDB(db, migrations.FS); err != nil {
		log.Fatal(err)
	}

	userStore := store.NewUserStore(db)
	ctx := context.Background()
	user, err := userStore.GetUserByEmail(ctx, *email)
	if err == nil {
		fmt.Printf("Test user already exists: %s (%s)\n", user.Name, user.Email)
		return
	}
	if err != sql.ErrNoRows {
		log.Fatal(err)
	}

	passwordHash, err := auth.HashPassword(*password)
	if err != nil {
		log.Fatal(err)
	}

	user, err = userStore.CreateUser(ctx, models.NewUserRequest{
		Name:     *name,
		Email:    *email,
		Password: *password,
	}, passwordHash)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Seeded test user: %s (%s)\n", user.Name, user.Email)
}
