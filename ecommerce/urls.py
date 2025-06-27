from django.urls import path
from ecommerce import views

urlpatterns = [
    path("", views.index, name='index'),
    path("contact/", views.contact, name="contact"),
    path('shop/', views.shop, name='shop'),
    path("product/<int:product_id>/", views.sProduct, name="product_detail"),
    path("sProduct/", views.sProduct, name="sProduct"),  # Keep for backward compatibility
    path("cart/", views.cart, name="cart"),
    path("blog/", views.blog, name="blog"),
    path("login/", views.loginuser, name="loginuser"),
    path('logout/', views.logoutuser, name='logoutuser'),
    path('check-username/', views.check_username_availability, name='check-username'),
    path('check-email/', views.check_email_availability, name='check-email'),
    path('signup/', views.signupuser, name='signupuser'),
]
