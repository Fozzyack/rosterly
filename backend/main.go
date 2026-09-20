package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error Loading .env file")
	}

	var port int
	flag.IntVar(&port, "port", 8000, "server address port")
	flag.Parse()

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		WriteTimeout: time.Second * 5,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Second * 60,
	}

	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

	return
}
