from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone  # Import timezone from Django utils


from django.contrib.auth.models import User

class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('lawyer', 'Lawyer'),
        ('judge', 'Judge'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    full_name = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to='profile_pictures', null=True, blank=True)
    is_lawyer = models.BooleanField(default=False)

class Case(models.Model):
    CASE_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    title = models.CharField(max_length=100)
    description = models.TextField()
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_cases')
    lawyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lawyer_cases')
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=CASE_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class Document(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='documents')
    lawyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='case_documents')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_documents')
    uploaded_at = models.DateTimeField(default=timezone.now)  # Use timezone.now() her


# the notification
class Notification(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)


