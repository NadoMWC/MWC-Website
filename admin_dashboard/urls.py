from django.urls import path
from . import views

urlpatterns = [
    path('admin_dashboard/', views.admin_page, name='admin_dashboard'),  # The dashboard page URL
]
