from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
import logging

# Import Model
from ..models import Pembeli

logger = logging.getLogger(__name__)

# JSON response
def json_response(payload, status=200):
    return Response(
        json_body=payload,
        content_type='application/json',
        status=status
    )

# Daftar Data Pembeli
@view_config(route_name='pembeli', renderer='json')
def daftar_pembeli(request):
    try:
        query = request.dbsession.query(Pembeli)
        pembeli = query.all()
        return json_response({
            'success': True,
            'message': 'Daftar pembeli berhasil diambil',
            'data': [m.to_dict() for m in pembeli]
        }, status=200)
    except DBAPIError as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Tambah Data Pembeli
@view_config(route_name='tambah_pembeli', request_method='POST', renderer='json')
def tambah_pembeli(request):
    try:
        json_data = request.json_body

        required_fields = ['username_pembeli', 'nama_pembeli', 'email_pembeli', 'uid_pembeli', 'nomor_handphone']
        for field in required_fields:
            if field not in json_data:
                return json_response({
                    'success': False,
                    'message': f"Field '{field}' wajib disertakan"
                }, status=400)

        pembeli = Pembeli(
            username_pembeli=json_data['username_pembeli'],
            nama_pembeli=json_data['nama_pembeli'],
            email_pembeli=json_data['email_pembeli'],
            uid_pembeli=json_data['uid_pembeli'],
            nomor_handphone=json_data['nomor_handphone']
        )
        request.dbsession.add(pembeli)
        request.dbsession.flush()

        return json_response({
            'success': True,
            'message': 'Data pembeli berhasil ditambahkan',
            'data': pembeli.to_dict()
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Update Data Pembeli
@view_config(route_name='update_pembeli', request_method='PUT', renderer='json')
def update_pembeli(request):
    dbsession = request.dbsession
    uid_pembeli = request.matchdict['uid_pembeli']

    pembeli = dbsession.query(Pembeli).filter_by(uid_pembeli=uid_pembeli).first()
    if pembeli is None:
        return json_response({
            'success': False,
            'message': 'Data pembeli tidak ditemukan'
        }, status=404)

    try:
        json_data = request.json_body
        if 'username_pembeli' in json_data:
            pembeli.username_pembeli = json_data['username_pembeli']
        if 'nama_pembeli' in json_data:
            pembeli.nama_pembeli = json_data['nama_pembeli']
        if 'email_pembeli' in json_data:
            pembeli.email_pembeli = json_data['email_pembeli']
        if 'nomor_handphone' in json_data:
            pembeli.nomor_handphone = json_data['nomor_handphone']

        dbsession.commit()
        return json_response({
            'success': True,
            'message': f"Data pembeli dengan id : {uid_pembeli} berhasil diupdate",
            'data': pembeli.to_dict()
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Hapus Data Pembeli
@view_config(route_name='hapus_pembeli', request_method='DELETE', renderer='json')
def hapus_pembeli(request):
    dbsession = request.dbsession
    uid_pembeli = request.matchdict['uid_pembeli']

    pembeli = dbsession.query(Pembeli).filter_by(uid_pembeli=uid_pembeli).first()
    if pembeli is None:
        return json_response({
            'success': False,
            'message': 'Data pembeli tidak ditemukan'
        }, status=404)

    try:
        dbsession.delete(pembeli)
        dbsession.commit()
        return json_response({
            'success': True,
            'message': f'Data pembeli dengan id : {uid_pembeli} berhasil dihapus'
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)
