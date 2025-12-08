package model

import "gorm.io/gorm"

// User represents a user in the system.
type User struct {
	gorm.Model
	ID       uint    `gorm:"primaryKey"`
	Username string  `gorm:"unique;not null"`
	Email    string  `gorm:"unique;not null"`
	Password string  `gorm:"not null"`
	Role     string  `gorm:"not null"` // e.g., "admin", "user"
	Quotes   []Quote `gorm:"foreignKey:UserID"`
}

// TableName sets the insert table name for this struct type
func (User) TableName() string {
	return "users"
}
