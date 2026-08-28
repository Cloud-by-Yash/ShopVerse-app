package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/shopverse/backend/internal/database"
	"github.com/shopverse/backend/internal/models"
)

func GetOrders(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var orders []models.Order
	if result := database.DB.Preload("Items.Product").Where("user_id = ?", userID).Order("created_at DESC").Find(&orders); result.Error != nil {
		log.Printf("Error fetching orders: %v", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch orders",
		})
	}

	return c.JSON(orders)
}

func CreateOrder(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var cartItems []models.CartItem
	if result := database.DB.Preload("Product").Where("user_id = ?", userID).Find(&cartItems); result.Error != nil {
		log.Printf("Error fetching cart for order: %v", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch cart",
		})
	}

	if len(cartItems) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cart is empty",
		})
	}

	var totalAmount float64
	var orderItems []models.OrderItem

	for _, item := range cartItems {
		itemTotal := item.Product.Price * float64(item.Quantity)
		totalAmount += itemTotal
		orderItems = append(orderItems, models.OrderItem{
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     item.Product.Price,
		})
	}

	order := models.Order{
		UserID:      userID,
		TotalAmount: totalAmount,
		Status:      "confirmed",
		Items:       orderItems,
	}

	tx := database.DB.Begin()

	if result := tx.Create(&order); result.Error != nil {
		tx.Rollback()
		log.Printf("Error creating order: %v", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create order",
		})
	}

	if result := tx.Where("user_id = ?", userID).Delete(&models.CartItem{}); result.Error != nil {
		tx.Rollback()
		log.Printf("Error clearing cart: %v", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to clear cart after order",
		})
	}

	tx.Commit()

	database.DB.Preload("Items.Product").First(&order, order.ID)

	return c.Status(fiber.StatusCreated).JSON(order)
}
