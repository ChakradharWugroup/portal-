from rest_framework import serializers
from .models import (
    Employee, ErpItem, ErpOrder, Announcement, Leave, 
    Workflow, KnowledgeArticle, CompanyDocument
)

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class ErpItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErpItem
        fields = '__all__'

class ErpOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErpOrder
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'

class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = '__all__'

class KnowledgeArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeArticle
        fields = '__all__'

class CompanyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyDocument
        fields = '__all__'
