from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CalendarData
from .serializers import CalendarSerializer


@api_view(['POST'])
def create_event(request):
    if request.method == 'POST':
        serializer = CalendarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
def view_events(request):
    event = CalendarData.objects.all()  # Fetch all customers from the database
    serializer = CalendarSerializer(event, many=True)  # Serialize the data
    return Response(serializer.data)  # Return the serialized data as JSON