from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required  # Ensure only logged-in users can access this page
def admin_page(request):
    return render(request, 'admin_dashboard/admin_page.html')
