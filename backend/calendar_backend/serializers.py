from rest_framework import serializers
from .models import CalendarData

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarData
        fields = "__all__"