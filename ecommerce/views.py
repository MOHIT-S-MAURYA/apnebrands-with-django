from datetime import datetime
from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.db import models
from ecommerce.models import Contact as ContactModel
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,logout,login
from django.contrib import messages
from django.contrib.auth.decorators import login_required

# Create your views here.

# home page view
def index(request):
    from ecommerce.models import Product, Category
    
    # Get featured products and categories for homepage
    featured_products = Product.objects.filter(is_featured=True, is_active=True)[:8]
    featured_categories = Category.objects.filter(is_active=True)[:6]
    
    context = {
        'featured_products': featured_products,
        'featured_categories': featured_categories,
    }
    
    return render(request, "modern_index.html", context)

#contact page view
def contact(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        subject = request.POST.get("subject")
        message = request.POST.get("message")
        
        # Validate required fields
        if not all([name, email, subject, message]):
            messages.error(request, 'All fields are required.')
            return render(request, "modern_contact.html")
        
        try:
            contact_model = ContactModel(
                name=name, 
                email=email, 
                subject=subject, 
                message=message, 
                date=datetime.today()
            )
            contact_model.save()
            messages.success(request, f'Thank you {name}! Your message has been sent successfully. We will get back to you soon.')
        except Exception as e:
            messages.error(request, 'An error occurred while sending your message. Please try again.')

    return render(request, "modern_contact.html")

#shop page view
def shop(request):
    from ecommerce.models import Product, Category
    
    # Get all active products and categories
    products = Product.objects.filter(is_active=True).order_by('-created_at')
    categories = Category.objects.filter(is_active=True)
    
    # Filter by category if specified
    category_slug = request.GET.get('category')
    if category_slug:
        try:
            category = Category.objects.get(slug=category_slug)
            products = products.filter(category=category)
        except Category.DoesNotExist:
            pass
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        products = products.filter(
            models.Q(name__icontains=search_query) |
            models.Q(description__icontains=search_query) |
            models.Q(short_description__icontains=search_query)
        )
    
    context = {
        'products': products,
        'categories': categories,
        'current_category': category_slug,
        'search_query': search_query,
    }
    
    return render(request, 'modern_shop.html', context)

#sProduct page view
def sProduct(request, product_id=None):
    from ecommerce.models import Product
    
    # Get product by ID from URL parameter or query string
    if not product_id:
        product_id = request.GET.get('id')
    
    product_slug = request.GET.get('slug')
    
    try:
        if product_id:
            # Ensure product_id is numeric
            try:
                product_id = int(product_id)
                product = Product.objects.get(id=product_id, is_active=True)
            except ValueError:
                # Invalid product ID format, redirect to shop
                return redirect('shop')
        elif product_slug:
            product = Product.objects.get(slug=product_slug, is_active=True)
        else:
            # Default to first product if no ID/slug specified
            product = Product.objects.filter(is_active=True).first()
            if not product:
                return redirect('shop')
            
        # Get related products from same category
        related_products = Product.objects.filter(
            category=product.category, 
            is_active=True
        ).exclude(id=product.id)[:4]
        
        context = {
            'product': product,
            'related_products': related_products,
        }
        
    except Product.DoesNotExist:
        # If product not found, redirect to shop
        return redirect('shop')
    
    return render(request, "modern_product_detail.html", context)

#cart page view
def cart(request):
    return render(request, "modern_cart.html")

#blog page view
def blog(request):
    return render(request, "modern_blog.html")

#login user view
def loginuser(request):
    if request.user.is_authenticated:
        return redirect("/")
    
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {user.first_name or user.username}!')
            return redirect("/")
        else:
            messages.error(request, 'Invalid username or password. Please try again.')
            return render(request, "modern_login.html")

    return render(request, "modern_login.html")

#logout user view 
@login_required(login_url='/login/')
def logoutuser(request):
    username = request.user.first_name or request.user.username
    logout(request)
    messages.success(request, f'Goodbye {username}! You have been successfully logged out.')
    return redirect("/")

#email and username validation view
def check_username_availability(request):
    if request.method == 'POST':
        import json
        try:
            data = json.loads(request.body)
            username = data.get('username', '')
        except:
            username = request.POST.get('username', '')
    else:
        username = request.GET.get('username', '')
    
    username_exists = User.objects.filter(username=username).exists()
    response = {
        'available': not username_exists
    }
    return JsonResponse(response)

def check_email_availability(request):
    if request.method == 'POST':
        import json
        try:
            data = json.loads(request.body)
            email = data.get('email', '')
        except:
            email = request.POST.get('email', '')
    else:
        email = request.GET.get('email', '')
    
    email_exists = User.objects.filter(email=email).exists()
    response = {
        'available': not email_exists
    }
    return JsonResponse(response)
#sign up user view
def signupuser(request):
    if request.user.is_authenticated:
        return redirect('/')
        
    if request.method == 'POST':
        firstname = request.POST.get('first-name')
        lastname = request.POST.get('last-name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Validate required fields
        if not all([firstname, lastname, username, email, password]):
            messages.error(request, 'All fields are required.')
            return render(request, "modern_signup.html")
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists. Please choose a different one.')
            return render(request, "modern_signup.html")
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email is already registered. Please use a different email or try logging in.')
            return render(request, "modern_signup.html")
        
        try:
            # Create user
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=firstname,
                last_name=lastname,
            )
            user.save()
            
            # Auto login the user after successful registration
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome to apneBrands, {firstname}! Your account has been created successfully.')
                return redirect('/')
            else:
                messages.success(request, 'Account created successfully! Please log in.')
                return redirect('/login/')
                
        except Exception as e:
            messages.error(request, 'An error occurred while creating your account. Please try again.')
            return render(request, "modern_signup.html")
    
    return render(request, "modern_signup.html")


