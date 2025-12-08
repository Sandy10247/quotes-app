package api

import (
	"strconv"

	db "quotes-app/db/sqlc"

	"github.com/gin-gonic/gin"
)

// Get All Quotes Handler
func (s *Server) getAllQuotes(c *gin.Context) {
	// Implement the logic to get all quotes from the database
	// and return them as JSON response

	id := GetIDFromHeader(c)

	// print the user id
	println("User ID from token:", id)
	quotes, err := s.store.GetAllQuotes(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to retrieve quotes"})
		return
	}
	c.JSON(200, gin.H{"quotes": quotes})
}

// Create Quote Handler
func (s *Server) createQuote(c *gin.Context) {
	// Implement the logic to create a new quote in the database
	// and return the created quote as JSON response

	userId, err := strconv.Atoi(GetIDFromHeader(c))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	userIdInt32 := int32(userId)

	type CreateQuoteRequest struct {
		Content string `json:"content" binding:"required"`
		Author  string `json:"author" binding:"required"`
	}

	var req CreateQuoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	quote, err := s.store.CreateQuote(c.Request.Context(), db.CreateQuoteParams{
		Content: req.Content,
		UserID:  userIdInt32,
		Author:  req.Author,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create quote"})
		return
	}
	c.JSON(201, gin.H{"quote": quote})
}

// Update Quote Handler
func (s *Server) updateQuote(c *gin.Context) {
	// Implement the logic to update an existing quote in the database
	// and return the updated quote as JSON response

	quoteIDParam := c.Param("id")
	quoteID, err := strconv.Atoi(quoteIDParam)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid quote ID"})
		return
	}

	type UpdateQuoteRequest struct {
		Content string `json:"content" binding:"required"`
		Author  string `json:"author" binding:"required"`
	}

	var req UpdateQuoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	quote, err := s.store.UpdateQuote(c.Request.Context(), db.UpdateQuoteParams{
		ID:      int32(quoteID),
		Content: req.Content,
		Author:  req.Author,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update quote"})
		return
	}
	c.JSON(200, gin.H{"quote": quote})
}

// Delete Quote Handler
func (s *Server) deleteQuote(c *gin.Context) {
	// Implement the logic to delete a quote from the database
	// and return a success message as JSON response

	quoteIDParam := c.Param("id")
	quoteID, err := strconv.Atoi(quoteIDParam)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid quote ID"})
		return
	}

	deletedQuote, err := s.store.DeleteQuote(c.Request.Context(), int32(quoteID))
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete quote"})
		return
	}
	c.JSON(200, gin.H{"message": "Quote deleted successfully", "quote": deletedQuote})
}
