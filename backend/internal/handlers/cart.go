package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/shopverse/backend/internal/database"
	"github.com/shopverse/backend/internal/models"
)

func GetCart(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var items []models.CartItem
	if result := database.DB.Preload("Product").Where("user_id = ?", userID).Find(&items); result.Error != nil {
		log.Printf("Error fetching cart: %v", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch cart",
		})
	}

	return c.JSON(items)
}

func AddToCart(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req models.AddToCartRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.ProductID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Product ID is required",
		})
	}

	if req.Quantity <= 0 {
		req.Quantity = 1
	}

	var product models.Product
	if result := database.DB.First(&product, req.ProductID); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	var existingItem models.CartItem
	result := database.DB.Where("user_id = ? AND product_id = ?", userID, req.ProductID).First(&existingItem)
	if result.Error == nil {
		existingItem.Quantity += req.Quantity
		database.DB.Save(&existingItem)
		database.DB.Preload("Product").First(&existingItem, existingItem.ID)
		return c.JSON(existingItem)
	}

	item := models.CartItem{
		UserID:    userID,
		ProductID: req.ProductID,
		Quantity:  req.Quantity,
	}

	if result := database.DB.Create(&item); result.Error != nil {
		log.Printf("Error adding to cart: %v", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add item to cart",
		})
	}

	database.DB.Preload("Product").First(&item, item.ID)
	return c.Status(fiber.StatusCreated).JSON(item)
}

func UpdateCartItem(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	id := c.Params("id")

	var req models.UpdateCartRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Quantity must be greater than 0",
		})
	}

	var item models.CartItem
	if result := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&item); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart item not found",
		})
	}

	item.Quantity = req.Quantity
	database.DB.Save(&item)
	database.DB.Preload("Product").First(&item, item.ID)

	return c.JSON(item)
}

func RemoveCartItem(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	id := c.Params("id")

	result := database.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.CartItem{})
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart item not found",
		})
	}

	return c.JSON(fiber.Map{"message": "Item removed from cart"})
}
