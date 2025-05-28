from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
import logging

# Import Model
from ..models import Pembeli

logger = logging.getLogger(__name__)

# JSON response
def json_response(payload):
    return Response(
        json_body=payload,
        content_type='application/json',
    )

# Daftar Data Pembeli
@view_config(route_name='pembeli', renderer='json')
def daftar_pembeli(request):
    try:
        query = request.dbsession.query(Pembeli)
        pembeli = query.all()
        return json_response({
            'status': 200,
            'success': True,
            'message': 'Daftar pembeli berhasil diambil',
            'data': [m.to_dict() for m in pembeli]
        })
    except DBAPIError as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Daftar Pembeli by ID
@view_config(route_name='pembeli_by_id', renderer='json')
def daftar_pembeli_by_id(request):
    uid_pembeli = request.matchdict['uid_pembeli']
    try:
        dbsession = request.dbsession
        pembeli = dbsession.query(Pembeli).filter_by(uid_pembeli=uid_pembeli).first()
        if pembeli is None:
            return json_response({
                'status': 404,
                'success': False,
                'message': f'Data pembeli dengan id {uid_pembeli} tidak ditemukan'
            })

        return json_response({
            'status': 200,
            'success': True,
            'message': f"Daftar pembeli dengan uid {uid_pembeli} berhasil diambil",
            'data': pembeli.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Tambah Data Pembeli
@view_config(route_name='tambah_pembeli', request_method='POST', renderer='json')
def tambah_pembeli(request):
    try:
        json_data = request.json_body

        required_fields = ['username_pembeli', 'nama_pembeli', 'email_pembeli', 'uid_pembeli', 'nomor_handphone']
        for field in required_fields:
            if field not in json_data:
                return json_response({
                    'status': 400,
                    'success': False,
                    'message': f"Field '{field}' wajib disertakan"
                })
        
        check_id_pembeli = request.dbsession.query(Pembeli).filter_by(uid_pembeli=json_data['uid_pembeli']).first()
        if check_id_pembeli is not None:
            return json_response({
                'status': 400,
                'success': False,
                'message': f"Akun sudah terdaftar"
            })
        else:
            pembeli = Pembeli(
                username_pembeli=json_data['username_pembeli'],
                nama_pembeli=json_data['nama_pembeli'],
                email_pembeli=json_data['email_pembeli'],
                role = json_data['role'],
                uid_pembeli=json_data['uid_pembeli'],
                nomor_handphone=json_data['nomor_handphone'],
                gambar_profil=json_data['gambar_profil']
            )
            request.dbsession.add(pembeli)
            request.dbsession.flush()

            return json_response({
                'status': 200,
                'success': True,
                'message': 'Data pembeli berhasil ditambahkan',
                'data': pembeli.to_dict()
            })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Update Data Pembeli
@view_config(route_name='update_pembeli', request_method='PUT', renderer='json')
def update_pembeli(request):
    dbsession = request.dbsession
    uid_pembeli = request.matchdict['uid_pembeli']

    pembeli = dbsession.query(Pembeli).filter_by(uid_pembeli=uid_pembeli).first()
    if pembeli is None:
        return json_response({
            'status': 404,
            'success': False,
            'message': 'Data pembeli tidak ditemukan'
        })

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

        
        return json_response({
            'status': 200,
            'success': True,
            'message': f"Data pembeli dengan id : {uid_pembeli} berhasil diupdate",
            'data': pembeli.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Hapus Data Pembeli
@view_config(route_name='hapus_pembeli', request_method='DELETE', renderer='json')
def hapus_pembeli(request):
    dbsession = request.dbsession
    uid_pembeli = request.matchdict['uid_pembeli']

    pembeli = dbsession.query(Pembeli).filter_by(uid_pembeli=uid_pembeli).first()
    if pembeli is None:
        return json_response({
            'status': 404,
            'success': False,
            'message': 'Data pembeli tidak ditemukan'
        })

    try:
        dbsession.delete(pembeli)
        
        return json_response({
            'status': 200,
            'success': True,
            'message': f'Data pembeli dengan id : {uid_pembeli} berhasil dihapus'
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })
