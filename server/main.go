package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"quotes-app/api"
	conf "quotes-app/config"
	db "quotes-app/db/sqlc"
)

func main() {
	// Application entry point

	var config conf.Config
	env := os.Getenv("ENV")

	if env != "" {
		config = conf.LoadConfig(env, "./env/")
	} else {
		config = conf.LoadConfig("test", "./env/")
	}

	// DB connection
	dbConn := db.Connect(config)
	defer db.Close(dbConn)

	store := db.NewStore(dbConn)
	defer db.Close(dbConn)

	// Start the server
	server := api.NewServer(config, store)

	envPort := os.Getenv("PORT")
	if envPort != "" && envPort != strconv.Itoa(config.Port) {

		p, err := strconv.Atoi(envPort)
		if err != nil {
			log.Fatalf("port number conversion error : %s\n", err)
		}
		config.Port = p
	}
	addr := fmt.Sprintf(":%d", config.Port)
	// add graceful shutdown
	srv := &http.Server{
		Addr:    addr,
		Handler: server.Router(),
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be catch, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	fmt.Printf("Shutdown Server ...")

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown: ", err)
	}

	fmt.Printf("Server exiting")
}
