from django.shortcuts import render


# Render and load the index.html page from templates
def index(request):
    return render(request, 'home/LandingPage.html')
