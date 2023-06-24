from django.contrib import admin
from django.urls import path
from ecommerce import views

urlpatterns = [
    path("", views.index, name='ecommerce'),
    path("contact/", views.contact, name="contact"),
    path('shop/', views.shop, name='shop'),
    path("sProduct/", views.sProduct, name="sProduct"),
    path("cart/", views.cart, name="cart"),
    path("blog/", views.blog, name="blog"),
    path("login/", views.loginuser, name="login"),
    path('logoutuser/', views.logoutuser, name='logout'),
    path('check-username/', views.check_username_availability, name='check-username'),
    path('check-email/', views.check_email_availability, name='check-email'),
    path('signup/', views.signupuser, name='signup'),
]
