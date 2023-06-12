# apnebrands-with-django

Here django project is apnebrands
  
    To create django project move to the required directory and run - django-admin startproject project_name
Django app is ecommerce

    To create django app for your project move inside your your project and run - python manage.py app_name
    
After creating app we have to link app to the project
    
    to register app to the django project - add " app_name.apps.App_nameConfig " to the settings.py file of your projects 
    
    here App_nameConfig must be in Upper camel case or copy the same through app's apps.py
    
  Add into  urls.py of your projects (i.e. apnebrands)
    
    Now add into projects's urls.py 
    
    urlpatterns = [
    path('admin/', admin.site.urls),              #
    path('',include('ecommerce.urls'))
    ]
   
  Create urls.py in your app ( i.e. ecommerce)
  
      start adding paths to your pages into it 
      
      for exmaple -
          
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
      
          
    

static file contains css,images,javascript-put all these files in this ststic folder
          
    To connect css with html file present in templates folder
  
      #first you have to load static command at the top of your html file 
      
          -syntax- {% load static %}
        
       then replace the css link to 
        
          -syntax-  <link rel="stylesheet" type="text/css" href="{% static 'css/style.css' %}" />



tempaltes file contains html pages 


