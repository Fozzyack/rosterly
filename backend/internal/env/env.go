package env

import "os"


func GetEnv() string {
	env := os.Getenv("ENV")
	if env == "production" || env == "prod" {
		return "production"
	}
	return "development"
}

func IsProduction() bool {
	if GetEnv() == "production" {
		return true
	}
	return false
}

