from django.urls import path
from . import views

urlpatterns = [
    path('user/<str:userId>', views.user),
    path('imagepresigned/<str:imageId>', views.imagePresignedUrl),
    path('period/<str:userId>', views.period),  # POST/PUT
    path('period/<str:userId>/<str:inDateStr>', views.period),  # GET/DELETE
    # path('period/<str:userId>/<int:startEpoch>/<int:endEpoch>', views.period)   # GET
]