from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
def login_view(request):
    
    # Retrieve username & password from request & authenticate through Django
    username = request.data.get('username')  
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    # If Authenticated (User Credentials Match Database), Return Tokens
    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return Response(
            {'message': 'Perfect Match',
             'access_token': access_token}, 
            status=status.HTTP_200_OK),
    else: # Return Error Message for Bad Credentials
        return Response(
            {'message': 'Credentials do not match'}, 
            status=status.HTTP_401_UNAUTHORIZED)
