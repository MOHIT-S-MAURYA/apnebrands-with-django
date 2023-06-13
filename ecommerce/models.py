from datetime import datetime
from django.db import models

#CREATE YOUR MODELS HERE

class Contact(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    subject = models.CharField(max_length=100)
    message = models.TextField(max_length=1000)
    date = models.DateTimeField(default=datetime.now())

    def __str__(self):
        return self.name

