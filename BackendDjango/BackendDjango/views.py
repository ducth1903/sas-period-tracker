from django.http import HttpResponse

def index(request):
    return HttpResponse("<html>SAS Period Tracker API</html>")