from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .models import CalendarData
from .serializers import CalendarSerializer


##**<< CREATE EVENTS >>**##
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_events(request):
    if request.method == 'POST':
        serializer = CalendarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##**<< VIEW/FETCH EVENTS >>**##
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def view_events(request):
    event = CalendarData.objects.all()
    serializer = CalendarSerializer(event, many=True)
    return Response(serializer.data)


##**<< UPDATE EVENTS >>**##
@api_view(['PUT'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])  
def update_events(request, pk):
    # Fetch UID/Primary Key(PK) to identify row to update
    try:
        event = CalendarData.objects.get(pk=pk)
    except CalendarData.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    # Pass UID/PK to serializer to update row
    serializer = CalendarSerializer(event, data=request.data)
    if serializer.is_valid():
        serializer.save()  # Save the updated event
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##**<< DELETE EVENTS >>**##
@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])  
def delete_events(request, pk):
    # Fetch UID/Primary Key(PK) to identify row to update
    try:
        event = CalendarData.objects.get(pk=pk)  # Fetch the event by ID (pk)
    except CalendarData.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    # Delete the instance(Row of Data) that was retrieved through the PK
    event.delete()
    return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
