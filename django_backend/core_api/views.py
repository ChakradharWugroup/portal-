from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import (
    Employee, ErpItem, ErpOrder, Announcement, Leave, 
    Workflow, KnowledgeArticle, CompanyDocument
)
from .serializers import (
    EmployeeSerializer, ErpItemSerializer, ErpOrderSerializer,
    AnnouncementSerializer, LeaveSerializer, WorkflowSerializer,
    KnowledgeArticleSerializer, CompanyDocumentSerializer
)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class ErpItemViewSet(viewsets.ModelViewSet):
    queryset = ErpItem.objects.all()
    serializer_class = ErpItemSerializer

class ErpOrderViewSet(viewsets.ModelViewSet):
    queryset = ErpOrder.objects.all()
    serializer_class = ErpOrderSerializer

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer

class KnowledgeArticleViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeArticle.objects.all()
    serializer_class = KnowledgeArticleSerializer

class CompanyDocumentViewSet(viewsets.ModelViewSet):
    queryset = CompanyDocument.objects.all()
    serializer_class = CompanyDocumentSerializer
