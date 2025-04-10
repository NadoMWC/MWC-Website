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


# class CalendarData(models.Model):
#     name = models.CharField(max_length=255, null=True, blank=True)
#     address = models.CharField(max_length=255, null=True, blank=True)
#     phone = models.CharField(max_length=25, null=True, blank=True)
#     email = models.EmailField(max_length=255, null=True, blank=True)
#     date = models.DateField(null=True, blank=True)
#     start_time = models.DateTimeField(null=True, blank=True)
#     end_time = models.DateTimeField(null=True, blank=True)
#     notes = models.TextField(max_length=255, null=True, blank=True)
#     event_color = models.CharField(max_length=20, null=True, blank=True)
#     windows_cost = models.IntegerField(max_length=20, null=True, blank=True)
#     pressure_washing_cost = models.IntegerField(max_length=20, null=True, blank=True)
#     misc_cost = models.IntegerField(max_length=20, null=True, blank=True)
#     job_type_windows = models.BooleanField(default=False)
#     job_type_pressure_wash = models.BooleanField(default=False)
#     job_type_misc = models.CharField(max_length=255, null=True, blank=True)

#     def __str__(self):
#         return self.name
    


