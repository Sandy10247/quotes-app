package model

import "gorm.io/gorm"

// Quote Model
type Quote struct {
	gorm.Model
	ID      uint   `gorm:"primaryKey"`
	Content string `gorm:"type:text;not null"`
	Author  string `gorm:"type:varchar(100);not null"`
	UserID  uint   `gorm:"not null"` // Foreign key to User
}

// TableName sets the insert table name for this struct type
func (Quote) TableName() string {
	return "quotes"
}
