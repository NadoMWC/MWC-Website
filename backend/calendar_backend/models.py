from django.db import models


# Create Table In Database
class CalendarData(models.Model):
    name = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    cost = models.TextField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    color = models.TextField(null=True, blank=True)
    
    # Assign Name of Name Attribute To Event Instance/Row Of Data
    def __str__(self):
        return self.name
