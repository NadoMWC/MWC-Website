from django.db import models

class CalendarData(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    phone = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    cost = models.TextField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return self.name