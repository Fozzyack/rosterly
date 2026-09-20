package env

import (
	"fmt"
	"os"
)

func GetDatabaseURL() (string, error){
	url := os.Getenv("DATABASE_URL")
	if url == "" {
		return "", fmt.Errorf("No DATABASE_URL in environment variables")
	}
	return url, nil
}
