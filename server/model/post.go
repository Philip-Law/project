package model

import "time"

type PostType string

const (
	ItemWanted  PostType = "item_wanted"
	ItemForSale PostType = "item_for_sale"
	Service     PostType = "academic_service"
)

type Post struct {
	UserID      string    `json:"user_id"`
	Item        Item      `json:"item"`
	Type        PostType  `json:"post_type"`
	Title       string    `json:"title"`
	PostDate    time.Time `json:"post_date"`
	Description string    `json:"description"`
	Location    Location  `json:"location"`
}

type Location struct {
	Number int    `json:"number"`
	Street string `json:"street"`
	City   string `json:"city"`
}
