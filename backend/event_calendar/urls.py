from django.urls import path
from .views import get_events, create_event

urlpatterns = [
    path('events/', get_events, name="get-events"),
    path('events/create/', create_event, name="create-event"),
]
