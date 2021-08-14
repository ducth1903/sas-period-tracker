from django.urls import path
from . import views

urlpatterns = [
    path('user/<str:userId>', views.user),
    path('imagepresigned/<str:imageId>', views.imagePresignedUrl),
    path('period/<str:userId>', views.period),  # GET/POST/PUT
    path('period/<str:userId>/lastPeriod', views.lastPeriod),
    path('period/<str:userId>/email', views.periodSendEmail),       # POST
    path('period/<str:userId>/<int:inYear>', views.period),
    path('period/<str:userId>/<int:inYear>/<int:inMonth>', views.period),
    path('period/<str:userId>/<int:inYear>/<int:inMonth>/<int:inDay>', views.period),  # GET/DELETE
    # path('period/<str:userId>/<str:inDateStr>', views.period),  # GET/DELETE
]