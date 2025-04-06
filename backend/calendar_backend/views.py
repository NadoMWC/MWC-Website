from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CalendarData
from .serializers import CalendarSerializer



# **CREATE AN EVENT**
@api_view(['POST'])
def create_events(request):
    if request.method == 'POST':
        serializer = CalendarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# **VIEW AN EVENT**
@api_view(['GET'])
def view_events(request):
    event = CalendarData.objects.all()  # Fetch all customers from the database
    serializer = CalendarSerializer(event, many=True)  # Serialize the data
    return Response(serializer.data)  # Return the serialized data as JSON


# **UPDATE AN EVENT**
@api_view(['PUT'])
def update_events(request, pk):
    try:
        event = CalendarData.objects.get(pk=pk)  # Fetch the event by ID (pk)
    except CalendarData.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CalendarSerializer(event, data=request.data)
    if serializer.is_valid():
        serializer.save()  # Save the updated event
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
# **DELETE AN EVENT**
@api_view(['DELETE'])
def delete_events(request, pk):
    try:
        event = CalendarData.objects.get(pk=pk)  # Fetch the event by ID (pk)
    except CalendarData.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    event.delete()
    return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)



