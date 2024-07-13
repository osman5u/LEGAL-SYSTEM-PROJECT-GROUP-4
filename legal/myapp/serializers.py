from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Case, Notification
from rest_framework import serializers
from .models import User
from .models import Notification, Document

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'profile_picture', 'password']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'full_name', 'email', 'role', 'profile_picture', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['role'] = user.role
        data['full_name'] = user.full_name
        data['profile_picture'] = user.profile_picture.url if user.profile_picture else None
        return data

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'profile_picture']


# THE NEW ADDED CODES


# NEW AVAILABLE CODE
class LawyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'role', 'profile_picture', 'username', 'email']
        read_only_fields = ['id', 'full_name', 'role', 'profile_picture', 'username', 'email']

# THE FILE CASE

class CaseSerializer(serializers.ModelSerializer):
    lawyer = LawyerSerializer(read_only=True)

    class Meta:
        model = Case
        fields = ['id', 'title', 'description', 'due_date', 'lawyer', 'status']
        read_only_fields = ['client']

class NotificationSerializer(serializers.ModelSerializer):
    lawyer = LawyerSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'case', 'message', 'read', 'created_at', 'recipient', 'lawyer']

# THE UPLOAD DOCUMENT CODE
class UploadDocumentSerializer(serializers.ModelSerializer):
    case = serializers.PrimaryKeyRelatedField(queryset=Case.objects.filter(status='pending'))
    file = serializers.FileField()

    class Meta:
        model = Document
        fields = ['case', 'file', 'lawyer', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['lawyer', 'uploaded_by', 'uploaded_at']

    def create(self, validated_data):
        case = validated_data['case']
        file = validated_data['file']
        document = Document.objects.create(case=case, file=file, lawyer=case.lawyer, uploaded_by=self.context['request'].user)
        return document


# THE DOCUMENT  HISTORY
class DocumentSerializer(serializers.ModelSerializer):
    case = CaseSerializer(read_only=True)
    lawyer = LawyerSerializer(read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'file', 'uploaded_at', 'case', 'lawyer']

    def create(self, validated_data):
        case = validated_data.pop('case')
        document = Document.objects.create(**validated_data)
        document.case = case
        document.save()
        return document

    def update(self, instance, validated_data):
        instance.file = validated_data.get('file', instance.file)
        instance.save()
        return instance


class DocumentSerializers(serializers.ModelSerializer):
    case_title = serializers.CharField(source='case.title')
    client = serializers.CharField(source='case.client.full_name')
    lawyer = serializers.CharField(source='lawyer.full_name')

    class Meta:
        model = Document
        fields = ['id', 'case_title', 'client', 'file', 'uploaded_at', 'lawyer']

# THE COUNT SERILIZER
class DashboardCountsSerializer(serializers.Serializer):
    case_count = serializers.IntegerField()
    approved_cases = serializers.IntegerField()
    rejected_cases = serializers.IntegerField()
    document_count = serializers.IntegerField()