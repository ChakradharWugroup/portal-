import os
import django
import sys
import pandas as pd

sys.path.append('C:/Users/KalleChakradhar/Desktop/portal/django_backend')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "enterprise_backend.settings")
django.setup()

from core_api.models import Employee

# 1. Delete old employees
Employee.objects.all().delete()
print("Deleted old employees.")

# 2. Read Excel file
df = pd.read_excel('C:/Users/KalleChakradhar/Desktop/test/emplyees.xlsx')
records = df.to_dict('records')

# 3. Insert new employees
new_employees = []
for row in records:
    # Use defaults for missing fields
    emp = Employee(
        employeeName=str(row.get('Name', 'Unknown')),
        empId=str(row.get('employee number', 'Unknown')),
        email=str(row.get('email', '')),
        position=str(row.get('job title', 'Unknown')),
        department=str(row.get('department', 'Unknown')),
        sex='Not specified',
        maritalDesc='Single',
        employmentStatus='Active',
        salary=60000.0,
        dateOfHire='2026-01-01',
        managerName='System Admin',
        engagementSurvey=4.5,
        empSatisfaction=4,
        absences=0,
        performanceScore='Exceeds Expectations'
    )
    new_employees.append(emp)

Employee.objects.bulk_create(new_employees)
print(f"Successfully imported {len(new_employees)} real employees.")
