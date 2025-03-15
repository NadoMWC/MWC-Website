from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)  
        if user is not None:
            print("Valid! Signed in.")
            login(request, user)
            return redirect('dashboard')  
        else:
            print("Invalid Credentials")
            return render(request, 'authentication_login/login_page.html', {'error': 'Invalid credentials'})
    return render(request, 'authentication_login/login_page.html')
