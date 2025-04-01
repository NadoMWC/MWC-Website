from rest_framework import serializers
from .models import CalendarData

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarData
        fields = [
            'customer_name', 
            'customer_address', 
            'customer_phone', 
            'job_date', 
            'time', 
            'job_cost', 
            'job_description', 
            'additional_notes']