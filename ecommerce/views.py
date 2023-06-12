from django.shortcuts import render

# Create your views here.


def index(request):
    return render(request, "index.html")


def contact(request):
    return render(request, "contact.html")


def shop(request):
    return render(request, 'shop.html')


def sProduct(request):
    return render(request, "sProduct.html")


def cart(request):
    return render(request, "cart.html")


def blog(request):
    return render(request, "blog.html")
