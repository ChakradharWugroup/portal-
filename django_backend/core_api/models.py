from django.db import models

class Employee(models.Model):
    employeeName = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True, blank=True)
    empId = models.CharField(max_length=50)
    position = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    sex = models.CharField(max_length=50)
    maritalDesc = models.CharField(max_length=50)
    employmentStatus = models.CharField(max_length=50)
    salary = models.FloatField()
    dateOfHire = models.CharField(max_length=100)
    managerName = models.CharField(max_length=255)
    engagementSurvey = models.FloatField()
    empSatisfaction = models.IntegerField()
    absences = models.IntegerField()
    performanceScore = models.CharField(max_length=50)

class ErpItem(models.Model):
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    nameTranslations = models.JSONField(null=True, blank=True)
    category = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=50)
    price = models.FloatField()
    status = models.CharField(max_length=50, default='Active')
    isLowStock = models.BooleanField(default=False)

class ErpOrder(models.Model):
    orderNumber = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    customerOrVendor = models.CharField(max_length=255)
    date = models.CharField(max_length=100)
    totalAmount = models.FloatField()
    status = models.CharField(max_length=50, default='Pending')
    itemDetails = models.TextField()

class Announcement(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    date = models.CharField(max_length=100)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=255)

class Leave(models.Model):
    employeeName = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=100)
    startDate = models.CharField(max_length=100)
    endDate = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Pending')
    reason = models.TextField(null=True, blank=True)
    proof = models.CharField(max_length=255, null=True, blank=True)
    comments = models.TextField(null=True, blank=True)

class Workflow(models.Model):
    type = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    requestedBy = models.CharField(max_length=255)
    requestedDate = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Pending')
    description = models.TextField(null=True, blank=True)
    referenceId = models.IntegerField(null=True, blank=True)

class KnowledgeArticle(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    views = models.IntegerField(default=0)

class CompanyDocument(models.Model):
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=255, null=True, blank=True)
    uploadedBy = models.CharField(max_length=255)
    uploadDate = models.CharField(max_length=100)
    ocrSummary = models.TextField(null=True, blank=True)
    keyEntities = models.TextField(null=True, blank=True)
    actionItems = models.TextField(null=True, blank=True)
