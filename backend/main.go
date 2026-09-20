package main

import (
	"flag"
	"log"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error Loading .env file")
	}

	var port int;
	flag.IntVar(&port, "port", 8000, "server address port")
	flag.Parse()

	return
}
