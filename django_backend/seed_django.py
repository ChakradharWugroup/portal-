import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "enterprise_backend.settings")
django.setup()

from core_api.models import ErpItem, Announcement, KnowledgeArticle

def run_seeder():
    # Clear existing
    ErpItem.objects.all().delete()
    Announcement.objects.all().delete()
    KnowledgeArticle.objects.all().delete()

    print("Seeding ErpItems...")
    items = []
    textileProducts = [
        'Indigo Denim Fabric Roll (Heavyweight 14oz)',
        'Combed Cotton Jersey (Single Knit 180GSM)',
        'Organic Linen Slub Fabric (Solid White)'
    ]
    categories = ['Raw Materials', 'Work In Progress', 'Finished Goods']
    
    for i in range(1, 15):
        name = textileProducts[(i - 1) % len(textileProducts)]
        isLow = (i == 12)
        items.append(ErpItem(
            code=f"INV-{str(i).zfill(3)}",
            name=f"{name} - BATCH #{1000 + i}",
            nameTranslations={
                "en": f"{name} - BATCH #{1000 + i}",
                "zh-TW": f"測試翻譯名稱 - BATCH #{1000 + i}",
                "zh-CN": f"测试翻译名称 - BATCH #{1000 + i}"
            },
            category=categories[i % len(categories)],
            quantity=8 if isLow else 15 + i*7,
            unit='kg',
            price=8.5 + i*1.2,
            status='Active',
            isLowStock=isLow
        ))
    ErpItem.objects.bulk_create(items)

    print("Seeding Announcements...")
    Announcement.objects.create(
        title="Welcome to Django Backend!",
        content="We have fully migrated from NestJS and FastAPI to Django. Performance and scaling are optimal.",
        date="2026-08-24",
        author="System Admin",
        category="General"
    )

    print("Seeding complete!")

if __name__ == "__main__":
    run_seeder()
