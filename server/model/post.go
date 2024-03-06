package model

import "time"

type PostType string

const (
	ItemWanted      PostType = "W"
	ItemForSale     PostType = "S"
	AcademicService PostType = "A"
)

type Category string

const (
	Books     Category = "B"
	IT        Category = "T"
	Computers Category = "C"
	Phones    Category = "P"
	Housing   Category = "H"
	Clothing  Category = "L"
	Vehicles  Category = "V"
	Services  Category = "S"
	Outdoor   Category = "D"
	Other     Category = "O"
)

type Post struct {
	ID          int        `json:"id"`
	UserID      string     `json:"user_id"`
	Title       string     `json:"title"`
	AdType      PostType   `json:"ad_type"`
	Description string     `json:"description"`
	Location    Location   `json:"location"`
	Categories  []Category `json:"categories"`
	Price       float64    `json:"price"`
	PostDate    time.Time  `json:"post_date"`
}

type Location struct {
	Number int    `json:"number"`
	Street string `json:"street"`
	City   string `json:"city"`
}
