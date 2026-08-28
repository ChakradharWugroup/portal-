from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core_api.views import (
    EmployeeViewSet, ErpItemViewSet, ErpOrderViewSet,
    AnnouncementViewSet, LeaveViewSet, WorkflowViewSet,
    KnowledgeArticleViewSet, CompanyDocumentViewSet
)
from ai_api.views import ChatAPIView, DocumentAIView
from core_api.qr_views import get_collections, get_garment_qr_codes

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'erp/inventory', ErpItemViewSet, basename='erpitem')
router.register(r'erp/orders', ErpOrderViewSet, basename='erporder')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'workflows', WorkflowViewSet, basename='workflow')
router.register(r'knowledge-base', KnowledgeArticleViewSet, basename='knowledgearticle')
router.register(r'documents', CompanyDocumentViewSet, basename='companydocument')

urlpatterns = [
    path('admin/', admin.site.urls),
    # The frontend expects /api/employees, etc.
    path('api/', include(router.urls)),
    
    # AI Endpoints
    path('api/chat', ChatAPIView.as_view(), name='chat'),
    path('api/document-ai', DocumentAIView.as_view(), name='document_ai'),
    
    # QR Management TiDB Endpoints
    path('api/qr/collections', get_collections, name='qr_collections'),
    path('api/qr/garment-codes', get_garment_qr_codes, name='qr_garment_codes'),
]
