from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect

def login_page(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('admin_dashboard/admin_page.html')  # Change to your desired redirect page
    else:
        form = AuthenticationForm()

    return render(request, 'login_page/user_login.html', {'form': form})
