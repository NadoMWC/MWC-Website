# login_page/urls.py
from django.urls import path
from . import views

app_name = "login_screen"

urlpatterns = [
    path('home/', views.login_page, name='login_page'),
]
