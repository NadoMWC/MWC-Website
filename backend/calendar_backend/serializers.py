from rest_framework import serializers
from .models import *


class WindowsJobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WindowsJobs
        fields = "__all__"


class PressureWashingJobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PressureWashingJobs
        fields = "__all__"


class MiscJobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiscJobs
        fields = "__all__"


class CreateCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvents
        fields = "__all__"
        

class ViewCalendarSerializer(serializers.ModelSerializer):
    windows_job = WindowsJobsSerializer(source='windowsjobs', read_only=True)
    pressure_job = PressureWashingJobsSerializer(source='pressurewashingjobs', read_only=True)
    misc_job = MiscJobsSerializer(source='miscjobs', read_only=True)
    class Meta:
        model = CalendarEvents
        fields = "__all__"
        

class UpdateCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvents
        fields = "__all__"


    
    