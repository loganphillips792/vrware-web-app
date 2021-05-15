from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from smtplib import SMTPException

@api_view(['POST'])
def email(request):
    
    recipient_list = ['loganphillips598@gmail.com', 'vrwaresharedaccts@gmail.com']

    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    role = request.data.get('role')
    subject = role
    description = request.data.get('description')
    message_plain = f'{first_name} email: {email}'
    message_html = render_to_string('email.html', {'first_name': first_name, 'last_name': last_name, 'email': email, 'phone': phone, 'role': role, 'reason_for_contact': description})
    email_from = settings.EMAIL_HOST_USER
    try:
        send_mail(subject, message_plain, email_from, recipient_list, html_message=message_html, fail_silently=False)
        return Response(status=status.HTTP_201_CREATED)
    except SMTPException as e:
        return Response({'message': 'Email send failed'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)