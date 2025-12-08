package api

import (
	"log"

	"quotes-app/config"
	db "quotes-app/db/sqlc"

	"github.com/gin-gonic/gin"
)

type Server struct {
	config config.Config
	router *gin.Engine
	store  db.Store
}

// NewServer creates a new Server instance.
func NewServer(conf config.Config, store db.Store) *Server {
	server := &Server{
		config: conf,
		router: gin.Default(),
		store:  store,
	}

	// Gin Startup Route Logging
	gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		log.Printf("	%v	%v\n", httpMethod, absolutePath)
	}

	// Initialize routes
	server.setupRoutes()

	return server
}

func (s *Server) Router() *gin.Engine {
	return s.router
}

// setupRoutes sets up the API routes for the server.
func (s *Server) setupRoutes() {
	// Configure CORS middleware
	s.router.Use(CORSMiddleware())

	// Define your routes here
	api := s.router.Group("/api")
	{
		// Add Api routes here
		api.POST("/users", s.RegisterUser)
		api.POST("/users/login", s.LoginUser)
		api.GET("/user", AuthMiddleware(), s.GetCurrentUser)
	}

	// /api/quotes -->
	quotesG := api.Group("/quotes")
	{
		// Add Auth Middleware to protect quote routes
		quotesG.Use(AuthMiddleware())
		// Create Quote
		quotesG.POST("", s.createQuote)
		// Define quote routes here
		quotesG.GET("/all", s.getAllQuotes)

		// Update Quote
		quotesG.POST("/:id", s.updateQuote)
		// Delete Quote
		quotesG.DELETE("/:id", s.deleteQuote)

	}
}

// Start runs the server on the specified address.
func (s *Server) Start(address string) error {
	return s.router.Run(address)
}
