from datetime import datetime
from django.shortcuts import render,redirect
from ecommerce.models import Contact as ContactModel
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,logout,login
from django.contrib import messages

# Create your views here.


def index(request):
    return render(request, "index.html")


def contact(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        subject = request.POST.get("subject")
        message = request.POST.get("message")
        contact_model = ContactModel(name=name, email=email, subject=subject, message=message, date=datetime.today())
        contact_model.save()

    return render(request, "contact.html")


def shop(request):
    return render(request, 'shop.html')


def sProduct(request):
    return render(request, "sProduct.html")


def cart(request):
    return render(request, "cart.html")


def blog(request):
    return render(request, "blog.html")

def loginuser(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(username,password)
        user=authenticate(username=username,password=password)
        if user is not None:
            login(request,user)
            return render(request, "index.html")
        else:
            return render(request, "login.html")

    return render(request, "login.html")

def logoutuser(request):
    logout(request)
    return redirect("/login/")
