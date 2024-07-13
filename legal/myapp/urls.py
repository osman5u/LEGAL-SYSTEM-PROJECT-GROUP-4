from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, ProfileView, CustomTokenObtainPairView, LogoutView, ProfileViewupdate
from .views import ProfileDetailUpdateView
from rest_framework.routers import DefaultRouter
from .views import DocumentHistoryViewcom
from .views import RejectedCasesView, DeleteCaseViews

from . import views




urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileDetailUpdateView.as_view(), name='profile-detail-update'),

    path('api/lawyers/', views.LawyerListView.as_view(), name='lawyer-list'),
    path('api/cases/', views.CaseCreateView.as_view(), name='case-create'),
    path('api/notifications/', views.NotificationCreateView.as_view(), name='notification-create'),

    path('casesupdate/<int:pk>/', views.CaseRetrieveUpdateDestroyView.as_view(), name='case-detail'),
    path('api/notificationsList/', views.NotificationListView.as_view(), name='notification-list'),
    path('casesshow/', views.ClientCaseHistoryView.as_view(), name='client-case-history'),
    path('api/documents/', views.UploadDocumentView.as_view(), name='upload-document'),
    path('api/casespending/', views.PendingCasesView.as_view(), name='pending-cases'),

    # UPLOAD DOCUMENT HISTORY
    path('api/documenthistory/', views.DocumentListCreateView.as_view(), name='document-list-create'),
    path('api/documentupdatedelete/<int:pk>/', views.DocumentRetrieveUpdateDestroyView.as_view(), name='document-detail'),

    # UPDATE PROFILE URLS
    path('profileupdate/', ProfileViewupdate.as_view(), name='profile'),

    # THE COUNT URL

    path('api/lawyer/dashboard/', views.lawyer_dashboard, name='lawyer_dashboard'),

    # PENDING CASES
    path('api/pending-cases/', views.pending_cases, name='pending_cases'),
    path('api/approve-case/<int:case_id>/', views.approve_case, name='approve_case'),
    path('api/reject-case/<int:case_id>/', views.reject_case, name='reject_case'),

    # THE APPROVED CASES
    path('api/approvedCasesHistory/', views.ApprovedCasesView.as_view(), name='approved-cases'),
    path('api/approvedCasesDelete/<int:pk>/', views.DeleteApprovedCaseView.as_view(), name='delete-approved-case'),
    path('approvedCasesHistory2/', views.ApprovedCasesView.as_view(), name='approved-cases'),
    path('api/uploadeddoc/', DocumentHistoryViewcom.as_view(), name='document-history'),


    path('api/rejected-cases/', RejectedCasesView.as_view(), name='rejected-cases'),
    path('api/move-to-pending/<int:case_id>/', RejectedCasesView.as_view(), name='move-to-pending'),
    path('api/delete-case/<int:case_id>/', DeleteCaseViews.as_view(), name='delete-case'),
]





