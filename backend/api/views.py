from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer
from calendar_backend.models import CalendarData
from calendar_backend.serializers import CalendarSerializer


class EventView(APIView):
    def get(self, request):
        event = Event.objects.first()  # Assuming only one event
        serializer = EventSerializer(event)
        return Response(serializer.data)
    
    
    
class CalendarView(APIView):
    def get(self, request):
        event = CalendarData.objects.first()  # Assuming only one event
        serializer = CalendarSerializer(event)
        return Response(serializer.data)
