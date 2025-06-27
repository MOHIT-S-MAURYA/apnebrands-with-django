from django.contrib import admin
from ecommerce.models import (
    Contact, Category, Product, ProductVariant, 
    Cart, CartItem, Wishlist
)

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'availability', 'is_featured', 'is_active', 'created_at']
    list_filter = ['category', 'availability', 'is_featured', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'brand']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'availability', 'is_featured', 'is_active']

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'size', 'color', 'additional_price', 'stock', 'is_active']
    list_filter = ['size', 'color', 'is_active']
    search_fields = ['product__name']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    list_filter = ['created_at']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'variant', 'quantity', 'created_at']
    list_filter = ['created_at']

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'created_at']
    list_filter = ['created_at']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'date']
    list_filter = ['date']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['date']