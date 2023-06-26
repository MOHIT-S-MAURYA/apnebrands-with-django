from datetime import datetime
from django.http import JsonResponse
from django.shortcuts import render,redirect
from ecommerce.models import Contact as ContactModel
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,logout,login
from django.contrib import messages
from django.contrib.auth.decorators import login_required

# Create your views here.

# home page view
def index(request):
    return render(request, "index.html")

#contact page view
def contact(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        subject = request.POST.get("subject")
        message = request.POST.get("message")
        contact_model = ContactModel(name=name, email=email, subject=subject, message=message, date=datetime.today())
        contact_model.save()

    return render(request, "contact.html")

#shop page view
def shop(request):
    return render(request, 'shop.html')

#sProduct page view
def sProduct(request):
    return render(request, "sProduct.html")

#cart page view
def cart(request):
    return render(request, "cart.html")

#blog page view
def blog(request):
    return render(request, "blog.html")

#login user view
def loginuser(request):
    if request.user.is_authenticated:
        print ("user is authenticated")
        print(User.email)
        return redirect("/")
    else:
        print("user is not authenticated")
        
        if request.method == "POST":
            username = request.POST.get('username')
            password = request.POST.get('password')
            print(username,password)
            user=authenticate(username=username,password=password)
            if user is not None:
                print("user is not None")
                login(request,user)
                print(user.email,"logged in")
                return render(request, "index.html")
            else:
                print("user is None")
                return render(request, "login.html")

        return render(request, "login.html")

#logout user view 
@login_required(login_url='/login/')
def logoutuser(request):
    logout(request)
    print("user logged out ")
    # print(User.is_authenticated)
    return redirect("/")

#email and username validation view
def check_username_availability(request):
    username = request.GET.get('username', '')
    username_exists = User.objects.filter(username=username).exists()
    response = {
        'available': not username_exists
    }
    return JsonResponse(response)

def check_email_availability(request):
    email = request.GET.get('email', '')
    email_exists = User.objects.filter(email=email).exists()
    response = {
        'available': not email_exists
    }
    return JsonResponse(response)
#sign up user view
def signupuser(request):
    if request.method == 'POST':
        firstname = request.POST.get('first-name')
        lastname = request.POST.get('last-name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=firstname,
            last_name=lastname,
        )
        user.save()
        messages.success(request, 'Your account has been created successfully!')
        return redirect('/')
    return render(request, "signup.html")


