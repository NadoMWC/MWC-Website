# login_page/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm

def login_page(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            # Authenticate the user and log them in
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                return redirect('admin_dashboard')  # Redirect to the admin dashboard
            else:
                # Invalid credentials
                return render(request, 'login_page/login.html', {'form': form, 'error': 'Invalid username or password'})
    else:
        form = AuthenticationForm()

    return redirect('admin_dashboard')
