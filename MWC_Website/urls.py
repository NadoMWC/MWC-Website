from django.urls import path
from . import views

app_name = "MWC_Website"

urlpatterns = [
    path('home/', views.home_page, name='MWC_home'),
]
