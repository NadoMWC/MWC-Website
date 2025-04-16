from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .models import *
from .serializers import *


# Create Events
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_events(request):
    if request.method == 'POST':
        calendar_data = {
            "name": request.data.get("name"),
            "address": request.data.get("address"),
            "phone": request.data.get("phone"),
            "email": request.data.get("email"),
            "start_time": request.data.get("start_time"),
            "end_time": request.data.get("end_time"),
            "notes": request.data.get("notes"),
            "event_color": request.data.get("event_color"),
        }

        calendar_serializer = CreateCalendarSerializer(data=calendar_data)

        if calendar_serializer.is_valid():
            calendar_event = calendar_serializer.save()

            WindowsJobs.objects.create(
                event=calendar_event,
                windows_cost=request.data.get("windows_cost"),
                windows_notes=request.data.get("windows_notes")
            )

            PressureWashingJobs.objects.create(
                event=calendar_event,
                pressure_washing_cost=request.data.get("pressure_washing_cost"),
                pressure_washing_notes=request.data.get("pressure_washing_notes")
            )

            MiscJobs.objects.create(
                event=calendar_event,
                misc_cost=request.data.get("misc_cost"),
                misc_notes=request.data.get("misc_notes")
            )

            return Response(calendar_serializer.data, status=status.HTTP_201_CREATED)

        return Response(calendar_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##**<< VIEW/FETCH EVENTS >>**##
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def view_events(request):
    events = CalendarEvents.objects.all()
    serializer = ViewCalendarSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_events(request, pk):
    try:
        main_event = CalendarEvents.objects.get(pk=pk)
        windows_event = WindowsJobs.objects.get(pk=pk)
        pressure_wash_event = PressureWashingJobs.objects.get(pk=pk)
        misc_event = MiscJobs.objects.get(pk=pk)
    except CalendarEvents.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    
    event_info_serializer = UpdateCalendarSerializer(main_event, data=request.data)
    windows_serializer = WindowsJobsSerializer(windows_event, data=request.data)
    pressure_wash_serializer = PressureWashingJobsSerializer(pressure_wash_event, data=request.data)
    misc_serializer = MiscJobsSerializer(misc_event, data=request.data)

    valid_event = event_info_serializer.is_valid()
    valid_windows = windows_serializer.is_valid()
    valid_pressure_wash = pressure_wash_serializer.is_valid()
    valid_misc = misc_serializer.is_valid()

    if valid_event and valid_windows and valid_pressure_wash and valid_misc:
        event_info_serializer.save()
        windows_serializer.save()
        pressure_wash_serializer.save()
        misc_serializer.save()
        return Response({'message': 'All Data updated successfully.'}, status=status.HTTP_200_OK)

    # If validation failed for any, return errors
    errors = {}
    if not valid_event:
        errors['calendar_event'] = event_info_serializer.errors
    if not valid_windows:
        errors['windows'] = windows_serializer.errors
    if not valid_pressure_wash:
        errors['pressure_wash'] = pressure_wash_serializer.errors
    if not valid_misc:
        errors['misc'] = misc_serializer.errors
    
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)


##**<< DELETE EVENTS >>**##
@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])  
def delete_events(request, pk):
    try:
        event = CalendarEvents.objects.get(pk=pk)
        event.delete()
        return Response({'message': 'Event and all related jobs deleted successfully.'}, status=status.HTTP_200_OK)
    except CalendarEvents.DoesNotExist:
        return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
