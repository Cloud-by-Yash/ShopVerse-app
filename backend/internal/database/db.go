package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/shopverse/backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	dbUser := getEnv("DB_USER", "shopverse")
	dbPassword := getEnv("DB_PASSWORD", "shopverse123")
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "shopverse")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	var err error
	for i := 1; i <= 10; i++ {
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err == nil {
			break
		}
		log.Printf("Database connection attempt %d/10 failed: %v. Retrying in 5s...", i, err)
		time.Sleep(5 * time.Second)
	}
	if err != nil {
		log.Fatalf("Failed to connect to database after 10 attempts: %v", err)
	}

	log.Println("Database connected successfully")

	err = DB.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database migrated successfully")
	seedProducts()
}

func seedProducts() {
	var count int64
	DB.Model(&models.Product{}).Count(&count)
	if count > 0 {
		return
	}

	products := []models.Product{
		// Electronics
		{
			Name: "Wireless Noise-Cancelling Headphones", Category: "Electronics",
			Price: 79.99, OriginalPrice: 129.99, Rating: 4.8, ReviewCount: 2847,
			Badge: "Best Seller", Emoji: "🎧", Color: "from-violet-500 to-purple-600",
		},
		{
			Name: "Smart Fitness Watch", Category: "Electronics",
			Price: 149.99, OriginalPrice: 199.99, Rating: 4.7, ReviewCount: 3891,
			Badge: "Top Rated", Emoji: "⌚", Color: "from-emerald-500 to-teal-600",
		},
		{
			Name: "Portable Bluetooth Speaker", Category: "Electronics",
			Price: 44.99, OriginalPrice: 69.99, Rating: 4.3, ReviewCount: 2156,
			Badge: "Sale", Emoji: "🔊", Color: "from-indigo-500 to-blue-600",
		},
		{
			Name: "Wireless Charging Pad", Category: "Electronics",
			Price: 29.99, OriginalPrice: 44.99, Rating: 4.4, ReviewCount: 1834,
			Badge: "Popular", Emoji: "🔋", Color: "from-cyan-500 to-blue-500",
		},
		{
			Name: "4K Action Camera", Category: "Electronics",
			Price: 199.99, OriginalPrice: 279.99, Rating: 4.6, ReviewCount: 1245,
			Badge: "New", Emoji: "📷", Color: "from-gray-700 to-gray-900",
		},
		{
			Name: "Mechanical Gaming Keyboard", Category: "Electronics",
			Price: 89.99, OriginalPrice: 119.99, Rating: 4.7, ReviewCount: 3456,
			Badge: "Gamer Pick", Emoji: "⌨️", Color: "from-red-500 to-rose-600",
		},
		{
			Name: "USB-C Hub 7-in-1", Category: "Electronics",
			Price: 34.99, OriginalPrice: 49.99, Rating: 4.5, ReviewCount: 2103,
			Badge: "Essential", Emoji: "🔌", Color: "from-slate-500 to-gray-600",
		},

		// Clothing
		{
			Name: "Premium Cotton T-Shirt", Category: "Clothing",
			Price: 24.99, OriginalPrice: 39.99, Rating: 4.5, ReviewCount: 1523,
			Badge: "Popular", Emoji: "👕", Color: "from-blue-500 to-cyan-500",
		},
		{
			Name: "Classic Denim Jacket", Category: "Clothing",
			Price: 69.99, OriginalPrice: 99.99, Rating: 4.6, ReviewCount: 892,
			Badge: "Trending", Emoji: "🧥", Color: "from-blue-600 to-indigo-700",
		},
		{
			Name: "Running Sneakers Pro", Category: "Clothing",
			Price: 89.99, OriginalPrice: 129.99, Rating: 4.8, ReviewCount: 4521,
			Badge: "Best Seller", Emoji: "👟", Color: "from-orange-500 to-red-500",
		},
		{
			Name: "Cozy Wool Sweater", Category: "Clothing",
			Price: 54.99, OriginalPrice: 79.99, Rating: 4.4, ReviewCount: 678,
			Badge: "Winter Pick", Emoji: "🧶", Color: "from-amber-600 to-orange-700",
		},

		// Accessories
		{
			Name: "Minimalist Leather Wallet", Category: "Accessories",
			Price: 34.99, OriginalPrice: 49.99, Rating: 4.4, ReviewCount: 1205,
			Badge: "New", Emoji: "👛", Color: "from-rose-500 to-pink-600",
		},
		{
			Name: "Stainless Steel Water Bottle", Category: "Accessories",
			Price: 19.99, OriginalPrice: 29.99, Rating: 4.5, ReviewCount: 1876,
			Badge: "Eco-Friendly", Emoji: "💧", Color: "from-sky-500 to-blue-600",
		},
		{
			Name: "Polarized Aviator Sunglasses", Category: "Accessories",
			Price: 39.99, OriginalPrice: 59.99, Rating: 4.6, ReviewCount: 2341,
			Badge: "UV Protection", Emoji: "🕶️", Color: "from-amber-500 to-yellow-600",
		},
		{
			Name: "Canvas Laptop Backpack", Category: "Accessories",
			Price: 49.99, OriginalPrice: 74.99, Rating: 4.7, ReviewCount: 1567,
			Badge: "Top Rated", Emoji: "🎒", Color: "from-green-600 to-emerald-700",
		},
		{
			Name: "Leather Belt Premium", Category: "Accessories",
			Price: 29.99, OriginalPrice: 44.99, Rating: 4.3, ReviewCount: 934,
			Badge: "Classic", Emoji: "👔", Color: "from-yellow-700 to-amber-800",
		},

		// Food & Drinks
		{
			Name: "Organic Coffee Beans 1kg", Category: "Food & Drinks",
			Price: 18.99, OriginalPrice: 24.99, Rating: 4.6, ReviewCount: 967,
			Badge: "Organic", Emoji: "☕", Color: "from-amber-500 to-orange-600",
		},
		{
			Name: "Premium Green Tea Collection", Category: "Food & Drinks",
			Price: 14.99, OriginalPrice: 22.99, Rating: 4.5, ReviewCount: 723,
			Badge: "Healthy", Emoji: "🍵", Color: "from-green-500 to-emerald-600",
		},
		{
			Name: "Dark Chocolate Gift Box", Category: "Food & Drinks",
			Price: 24.99, OriginalPrice: 34.99, Rating: 4.8, ReviewCount: 1456,
			Badge: "Gift Pick", Emoji: "🍫", Color: "from-amber-700 to-yellow-900",
		},
		{
			Name: "Mixed Nuts Gourmet Pack", Category: "Food & Drinks",
			Price: 12.99, OriginalPrice: 18.99, Rating: 4.4, ReviewCount: 845,
			Badge: "Snack Pack", Emoji: "🥜", Color: "from-yellow-500 to-amber-600",
		},

		// Sports
		{
			Name: "Yoga Mat Premium Non-Slip", Category: "Sports",
			Price: 29.99, OriginalPrice: 45.99, Rating: 4.9, ReviewCount: 4210,
			Badge: "Top Rated", Emoji: "🧘", Color: "from-green-500 to-emerald-600",
		},
		{
			Name: "Resistance Bands Set", Category: "Sports",
			Price: 19.99, OriginalPrice: 34.99, Rating: 4.6, ReviewCount: 3124,
			Badge: "Home Gym", Emoji: "💪", Color: "from-red-500 to-orange-600",
		},
		{
			Name: "Insulated Sports Bottle", Category: "Sports",
			Price: 24.99, OriginalPrice: 39.99, Rating: 4.5, ReviewCount: 1890,
			Badge: "Active", Emoji: "🏃", Color: "from-teal-500 to-green-600",
		},
		{
			Name: "Jump Rope Speed Pro", Category: "Sports",
			Price: 15.99, OriginalPrice: 24.99, Rating: 4.3, ReviewCount: 1234,
			Badge: "Cardio", Emoji: "🏋️", Color: "from-purple-500 to-indigo-600",
		},

		// Home & Living
		{
			Name: "Scented Soy Candle Set", Category: "Home & Living",
			Price: 22.99, OriginalPrice: 34.99, Rating: 4.7, ReviewCount: 2567,
			Badge: "Relaxation", Emoji: "🕯️", Color: "from-pink-400 to-rose-500",
		},
		{
			Name: "Bamboo Desk Organizer", Category: "Home & Living",
			Price: 27.99, OriginalPrice: 39.99, Rating: 4.4, ReviewCount: 876,
			Badge: "Eco-Friendly", Emoji: "🗂️", Color: "from-lime-500 to-green-600",
		},
		{
			Name: "Ceramic Plant Pot Set", Category: "Home & Living",
			Price: 32.99, OriginalPrice: 49.99, Rating: 4.6, ReviewCount: 1345,
			Badge: "Decor", Emoji: "🪴", Color: "from-emerald-400 to-teal-500",
		},
		{
			Name: "Cozy Throw Blanket", Category: "Home & Living",
			Price: 39.99, OriginalPrice: 59.99, Rating: 4.8, ReviewCount: 2890,
			Badge: "Comfort", Emoji: "🛋️", Color: "from-violet-400 to-purple-500",
		},
	}

	DB.Create(&products)
	log.Println("Database seeded with sample products")
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
