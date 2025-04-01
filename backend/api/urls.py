from django.urls import path
from .views import EventView, CalendarView


urlpatterns = [
    path('event/', EventView.as_view(), name='event_data'),
    path('calendar/', CalendarView.as_view(), name='calendar_data'),
]
