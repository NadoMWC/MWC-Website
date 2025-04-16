from django.db import models


class CalendarEvents(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=25, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(max_length=255, null=True, blank=True)
    event_color = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.name


class WindowsJobs(models.Model):
    event = models.OneToOneField(CalendarEvents, on_delete=models.CASCADE, primary_key=True)
    windows_cost = models.CharField(max_length=255, null=True, blank=True)
    windows_notes = models.TextField(max_length=10000, null=True, blank=True)

    def __str__(self):
        return f"{self.event.name}Windows"


class PressureWashingJobs(models.Model):
    event = models.OneToOneField(CalendarEvents, on_delete=models.CASCADE, primary_key=True)
    pressure_washing_cost = models.CharField(max_length=255, null=True, blank=True)
    pressure_washing_notes = models.TextField(max_length=10000, null=True, blank=True)

    def __str__(self):
        return f"{self.event.name} - Pressure Washing"


class MiscJobs(models.Model):
    event = models.OneToOneField(CalendarEvents, on_delete=models.CASCADE, primary_key=True)
    misc_cost = models.CharField(max_length=255, null=True, blank=True)
    misc_notes = models.TextField(max_length=10000, null=True, blank=True)

    def __str__(self):
        return f"{self.event.name} - Misc"
