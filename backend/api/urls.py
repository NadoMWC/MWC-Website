from django.urls import path
from calendar_backend.views import *


urlpatterns = [
    path('calendar/create_events/', create_events),
    path('calendar/view_events/', view_events),
    path('calendar/update_events/<int:pk>/', update_events),
    path('calendar/delete_events/<int:pk>/', delete_events),
]
