from django.db import models

class CalendarData(models.Model):
    name = models.CharField(max_length=255)
    email = models.TextField(null=True, blank=True)
    phone = models.IntegerField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    notes_extra = models.TextField(null=True, blank=True)
    date_text = models.TextField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    time = models.DateField(null=True, blank=True)
    

    def __str__(self):
        return self.name