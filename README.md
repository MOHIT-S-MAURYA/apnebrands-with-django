# apnebrands-with-django

Here django project is apnebrands
  
    #To create django project move to the required directory and run - 
    django-admin startproject project_name
Django app is ecommerce

    #To create django app for your project move inside your your project and run -
    python manage.py app_name
    
After creating app we have to link app to the project
    
    # to register app to the django project - 
    add " app_name.apps.App_nameConfig "
    # to the settings.py file of your projects 
    
    # here App_nameConfig must be in Upper camel case or copy the same through app's apps.py
  
  
Create static and templates folder inside your projects

    To link these folder to django project 
    
      Go toh settings.py of project and add the following 
      
      # for static folder  add the same thing to setting
      
        STATIC_URL = '/static/'
        
        STATICFILES_DIRS = [
                             os.path.join(BASE_DIR, 'static')
                            ]
                            
      # for templates folder 
      
          TEMPLATES = [
                        ...
                        'DIRS': [os.path.join(BASE_DIR, 'templates')],
                        ...
                        
                        ]
      
          
    

Static file contains css,images,javascript-put all these files in this ststic folder
          
    To connect css with html file present in templates folder
  
      #first you have to load static command at the top of your html file 
      
          -syntax- {% load static %}
        
       then replace the css link to 
        
          -syntax-  <link rel="stylesheet" type="text/css" href="{% static 'css/style.css' %}" />



    # tempaltes file contains html pages 
  
  
  
Add into  urls.py of your projects (i.e. apnebrands)
    
    #Now add into projects's urls.py 
    
    urlpatterns = [
    path('admin/', admin.site.urls),              # this reffers toh admin page if called 
    path('',include('ecommerce.urls'))            # for everything else reffer to urls.py of ecommerce 
    ]
 
  
Create urls.py in your app ( i.e. ecommerce)
  
      # start adding paths to your pages into it 
      
      for exmaple -
          
          from django.contrib import admin
          from django.urls import path
          from ecommerce import views

          urlpatterns = [
                           path("", views.index, name='ecommerce'),                  # this says that if there is nothing specfied then execute index function in views.py
                           path("contact", views.contact, name="contact"),           # this says that if contact is specified in the url then execute conatact function in views.py
                           path('shop/', views.shop, name='shop'),
                           path("sProduct", views.sProduct, name="sProduct"),
                           path("cart", views.cart, name="cart"),
                           path("blog", views.blog, name="blog"),
                        ]
    
    
Alogn with urls.py in your app edits views.py of your app to render the webpages ( html file on request ) 

    # Create views function - example 
    
    def index(request):
        return render(request, "index.html")


    def contact(request):
        return render(request, "contact.html")
    
      
# To create admin or superuser for your django project

    python manage.py createsuperuser

# Save changes to django server

    python3 manage.py migrate
    
    #to check any unsaved changes 
    
    python3 manage.py makemigrations



