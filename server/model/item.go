package model

type Item struct {
	Name  string  `json:"name"`
	Info  string  `json:"about"`
	Price float64 `json:"price"`
}
