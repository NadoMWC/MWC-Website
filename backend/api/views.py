from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer
from .serializers import CustomerSerializer



@api_view(['POST'])
def create_customer(request):
    if request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_customers(request):
    customers = Customer.objects.all()  # Fetch all customers from the database
    serializer = CustomerSerializer(customers, many=True)  # Serialize the data
    return Response(serializer.data)  # Return the serialized data as JSON



@api_view(['GET', 'DELETE'])
def delete_customer(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)  # Retrieve the customer by primary key (pk)

        if request.method == 'GET':
            # If it's a GET request, return the customer details
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)  # Return the customer's data

        elif request.method == 'DELETE':
            # If it's a DELETE request, delete the customer
            customer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)  # Successfully deleted

    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)  # Handle case where customer doesn't exist
    
    