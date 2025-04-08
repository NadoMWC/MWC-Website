
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken



@api_view(['POST'])
def login_view(request):
    
    # 
    username = request.data.get('username')  
    password = request.data.get('password')

    # Authenticate the user
    user = authenticate(username=username, password=password)

    if user is not None:
        # Return a success response
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return Response(
            {'message': 'Perfect Match',
             'access_token': access_token}, 
            status=status.HTTP_200_OK),
    else:
        # Return an error response
        return Response({'message': 'Credentials do not match'}, status=status.HTTP_401_UNAUTHORIZED)
