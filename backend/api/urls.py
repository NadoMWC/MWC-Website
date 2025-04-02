from django.urls import path
from .views import *
from calendar_backend.views import *


urlpatterns = [
    path('customers/create/', create_customer, name='create_customer'),
    path('customers/view/', get_customers, name='get_customers'),
    path('customers/delete/<int:pk>/', delete_customer),
    path('calendar/create_event/', create_event),
    path('calendar/view_events/', view_events),
]