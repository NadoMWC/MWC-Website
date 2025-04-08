from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import CalendarData
from .serializers import CalendarSerializer
from rest_framework.permissions import IsAuthenticated  
from rest_framework_simplejwt.authentication import JWTAuthentication  

# **CREATE AN EVENT**
@api_view(['POST'])
@authentication_classes([JWTAuthentication])  # Adding authentication class to check for JWT token in request
@permission_classes([IsAuthenticated])  # Adding permission class to ensure the user is authenticated
def create_events(request):
    if request.method == 'POST':
        serializer = CalendarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# **VIEW AN EVENT**
@api_view(['GET'])
@authentication_classes([JWTAuthentication])  # Adding authentication class to check for JWT token in request
@permission_classes([IsAuthenticated])  # Adding permission class to ensure the user is authenticated
def view_events(request):
    # **FETCH EVENTS**
    event = CalendarData.objects.all()  # Fetch all events from the database
    serializer = CalendarSerializer(event, many=True)  # Serialize the data
    return Response(serializer.data)  # Return the serialized data as JSON

# **UPDATE AN EVENT**
@api_view(['PUT'])
@authentication_classes([JWTAuthentication])  # Adding authentication class to check for JWT token in request
@permission_classes([IsAuthenticated])  # Adding permission class to ensure the user is authenticated
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
@authentication_classes([JWTAuthentication])  # Adding authentication class to check for JWT token in request
@permission_classes([IsAuthenticated])  # Adding permission class to ensure the user is authenticated
def delete_events(request, pk):
    try:
        event = CalendarData.objects.get(pk=pk)  # Fetch the event by ID (pk)
    except CalendarData.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    event.delete()
    return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
