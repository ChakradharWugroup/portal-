import pymysql
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings

def get_tidb_connection():
    # User needs to fill in their password here or in environment variables
    # For security, we use a placeholder. The user should replace <PASSWORD> with their actual password.
    return pymysql.connect(
        host='gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
        port=4000,
        user='NxhLTE2TjPVqirD.root',
        password='7PkdDwgmEcQQUuRW', # USER MUST UPDATE THIS
        database='test',
        ssl_verify_cert=False,
        ssl_verify_identity=False,
        ssl={'ssl': {}}
    )

@api_view(['GET'])
def get_collections(request):
    try:
        conn = get_tidb_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM collections ORDER BY id DESC LIMIT 100")
            results = cursor.fetchall()
        conn.close()
        return Response({"status": "success", "data": results})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

@api_view(['GET'])
def get_garment_qr_codes(request):
    collection_id = request.GET.get('collection_id')
    try:
        conn = get_tidb_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            if collection_id:
                cursor.execute("SELECT * FROM garment_qr_codes WHERE collection_id = %s ORDER BY id DESC LIMIT 1000", (collection_id,))
            else:
                cursor.execute("SELECT * FROM garment_qr_codes ORDER BY id DESC LIMIT 1000")
            results = cursor.fetchall()
        conn.close()
        return Response({"status": "success", "data": results})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)
