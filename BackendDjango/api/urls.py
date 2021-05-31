from django.urls import path
from . import views

urlpatterns = [
    path('user/<str:userId>', views.getUser),
    path('imagepresigned/<str:imageId>', views.imagePresignedUrl),
]