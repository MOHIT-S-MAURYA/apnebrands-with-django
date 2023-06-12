from django.contrib import admin
from django.urls import path
from ecommerce import views

urlpatterns = [
    path("", views.index, name='ecommerce'),
    path("contact", views.contact, name="contact"),
    path('shop/', views.shop, name='shop'),
    path("sProduct", views.sProduct, name="sProduct"),
    path("cart", views.cart, name="cart"),
    path("blog", views.blog, name="blog"),

]
