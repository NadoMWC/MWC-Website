from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# @login_required(login_url='/admin_login/')
def admin_home(request):
    return render(request, 'administrator_dashboard/dashboard.html')
