package models

import "time"

type Product struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Name          string    `json:"name" gorm:"size:255;not null"`
	Category      string    `json:"category" gorm:"size:100;index"`
	Price         float64   `json:"price" gorm:"not null"`
	OriginalPrice float64   `json:"original_price"`
	Rating        float64   `json:"rating"`
	ReviewCount   int       `json:"review_count"`
	Badge         string    `json:"badge" gorm:"size:50"`
	Emoji         string    `json:"emoji" gorm:"size:10"`
	Color         string    `json:"color" gorm:"size:50"`
	CreatedAt     time.Time `json:"created_at"`
}
