from django.db import models

class CalendarData(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_address = models.TextField()
    customer_phone = models.TextField()
    job_date = models.DateField()
    time = models.TextField()
    job_cost = models.TextField()
    job_description = models.TextField()
    additional_notes = models.TextField()
    
    def __str__(self):
        return self.customer_name