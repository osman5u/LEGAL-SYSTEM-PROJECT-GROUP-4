from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import ProfileUpdateSerializer, DocumentSerializer
from .serializers import CaseSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Document, Case
from django.contrib.auth.decorators import login_required


# THE NEW ADDED CODE
from .serializers import UploadDocumentSerializer, CaseSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


from .models import User
from .serializers import UserSerializer

from rest_framework import generics
from .models import User
from .serializers import LawyerSerializer
# THE FILE CASE VIEW
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Case
from .serializers import CaseSerializer
from .models import Notification
from .serializers import NotificationSerializer

#...........THE UPLOAD IMPORT CODE................
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, Case
from .serializers import CaseSerializer, LawyerSerializer
from rest_framework import viewsets, permissions
import logging
from .serializers import DocumentSerializers

logger = logging.getLogger(__name__)

# THE LAWYER VIEWS
class LawyerListView(generics.ListAPIView):
    serializer_class = LawyerSerializer

    def get_queryset(self):
        return User.objects.filter(role='lawyer')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception as e:
            pass
        return Response(status=204)


class ProfileDetailUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

'''class CaseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(client=request.user, lawyer_id=request.data['lawyer'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# THE NOTIFICATION
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
'''


class CaseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CaseSerializer(data=request.data)
        if serializer.is_valid():
            case = serializer.save(client=request.user, lawyer_id=request.data['lawyer'])

            # Create a new notification
            Notification.objects.create(
                case=case,
                message=f'A new case "{case.title}" has been filed.',
                recipient_id=request.data['lawyer']
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ............................NEW CODE .......................

# ............... CORRECT NOTIFICATIONS LOGIC.................
'''class NotificationListView(generics.ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
'''
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(case__client=user)



'''class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)
'''

#.....................NEW CODE FOR CASE HISTORY.........................



'''class CaseListCreateView(generics.ListCreateAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]
'''

class ClientCaseHistoryView(generics.ListAPIView):
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(client=self.request.user)

class CaseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)



# ................................THE UPLOAD CODE.............................



class UploadDocumentView(generics.CreateAPIView):
    serializer_class = UploadDocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        try:
            document = serializer.save()
            # Create a notification for the lawyer
            case = serializer.validated_data['case']
            notification = Notification.objects.create(
                case=case,
                message='A new document has been uploaded for the case.',
                recipient=case.lawyer
            )
            notification.save()
            return document
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class PendingCasesView(generics.ListAPIView):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(status='pending', client=self.request.user)

# THE DOCUMENT HISTORY LOGIC
class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user, lawyer=serializer.validated_data['case'].lawyer)

class DocumentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()

# UPDATE USER PROFILE
class ProfileViewupdate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'profile_picture' in request.FILES:
                user.profile_picture = request.FILES['profile_picture']
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# THE COUNT LOGIC

@api_view(['GET'])
def lawyer_dashboard(request):
    try:
        user = request.user
        if user.role == 'lawyer':
            pending_cases = Case.objects.filter(lawyer=user, status='pending')
            approved_cases = Case.objects.filter(lawyer=user, status='approved')
            rejected_cases = Case.objects.filter(lawyer=user, status='rejected')
            documents = Document.objects.filter(lawyer=user)

            return Response({
                'pendingCases': pending_cases.count(),
                'approvedCases': approved_cases.count(),
                'rejectedCases': rejected_cases.count(),
                'documents': documents.count(),
            })
        else:
            logger.error(f'User {user.username} is not a lawyer.')
            return Response({'detail': 'User is not a lawyer.'}, status=400)
    except Exception as e:
        logger.error(f'Error in lawyer_dashboard view: {e}')
        return Response({'detail': 'An error occurred while fetching the dashboard counts.'}, status=500)
'''
# THE PENDING CASE
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_cases(request):
    cases = Case.objects.filter(status='pending')
    serializer = CaseSerializer(cases, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_case(request, case_id):
    case = get_object_or_404(Case, id=case_id)
    case.status = 'approved'
    case.save()
    return Response({'detail': 'Case approved successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_case(request, case_id):
    case = get_object_or_404(Case, id=case_id)
    case.status = 'rejected'
    case.save()
    return Response({'detail': 'Case rejected successfully'}, status=status.HTTP_200_OK)
'''

@api_view(['POST'])
@login_required
def approve_case(request, case_id):
    try:
        case = Case.objects.get(id=case_id)
        case.status = 'approved'
        case.save()
        return Response({'detail': 'Case approved successfully'}, status=status.HTTP_200_OK)
    except Case.DoesNotExist:
        return Response({'detail': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@login_required
def reject_case(request, case_id):
    try:
        case = Case.objects.get(id=case_id)
        case.status = 'rejected'
        case.save()
        return Response({'detail': 'Case rejected successfully'}, status=status.HTTP_200_OK)
    except Case.DoesNotExist:
        return Response({'detail': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@login_required
def pending_cases(request):
    lawyer = request.user
    pending_cases = Case.objects.filter(lawyer=lawyer, status='pending')
    serializer = CaseSerializer(pending_cases, many=True)
    return Response(serializer.data)

# THE APPROVED CASES

class ApprovedCasesView(generics.ListAPIView):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        lawyer = self.request.user
        approved_cases = Case.objects.filter(lawyer=lawyer, status='approved')
        return approved_cases

class DeleteApprovedCaseView(generics.DestroyAPIView):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(status='approved')


class DocumentHistoryViewcom(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch only the documents assigned to the authenticated lawyer
        documents = Document.objects.filter(lawyer=request.user)
        serializer = DocumentSerializers(documents, many=True)
        return Response(serializer.data)

class RejectedCasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cases = Case.objects.filter(status='rejected')
        serializer = CaseSerializer(cases, many=True)
        return Response(serializer.data)

    def post(self, request, case_id):
        try:
            case = Case.objects.get(id=case_id, status='rejected')
            case.status = 'pending'
            case.save()
            return Response({'message': 'Case moved to pending successfully.'}, status=status.HTTP_200_OK)
        except Case.DoesNotExist:
            return Response({'error': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)

class DeleteCaseView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, case_id):
        try:
            case = Case.objects.get(id=case_id)
            case.delete()
            return Response({'message': 'Case deleted successfully.'}, status=status.HTTP_200_OK)
        except Case.DoesNotExist:
            return Response({'error': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)


# FOR THE REJECTED CASES TO MOVE BACK TO PENDING
class RejectedCasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cases = Case.objects.filter(status='rejected')
        serializer = CaseSerializer(cases, many=True)
        return Response(serializer.data)

    def post(self, request, case_id):
        try:
            case = Case.objects.get(id=case_id, status='rejected')
            case.status = 'pending'
            case.save()
            return Response({'message': 'Case moved to pending successfully.'}, status=status.HTTP_200_OK)
        except Case.DoesNotExist:
            return Response({'error': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)

class DeleteCaseViews(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, case_id):
        try:
            case = Case.objects.get(id=case_id)
            case.delete()
            return Response({'message': 'Case deleted successfully.'}, status=status.HTTP_200_OK)
        except Case.DoesNotExist:
            return Response({'error': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)