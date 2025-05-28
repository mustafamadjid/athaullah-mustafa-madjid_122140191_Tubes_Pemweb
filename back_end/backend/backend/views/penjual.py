from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.security import Allow, Everyone, Authenticated, remember, forget
from pyramid.view import view_config
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    HTTPBadRequest,
)
from sqlalchemy.exc import DBAPIError
import json

# Import Model
from ..models import Penjual

import logging
logger = logging.getLogger(__name__)

# JSON Response
def json_response(payload):
    return Response(
        json_body=payload,
        content_type='application/json',
    )

# Daftar Data Penjual
@view_config(route_name='penjual', renderer='json')
def daftar_penjual(request):
    try:
        query = request.dbsession.query(Penjual)
        penjual = query.all()
        return json_response({
            'status' : 200,
            'success': True,
            'message': 'Daftar penjual berhasil diambil',
            'data': [m.to_dict() for m in penjual]
        })
    except DBAPIError:
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })
        
# Daftar Penjual by ID
@view_config(route_name='penjual_by_id', renderer='json')
def daftar_penjual_by_id(request):
    uid_penjual = request.matchdict['uid_penjual']
    try :
        dbsession = request.dbsession
        penjual = dbsession.query(Penjual).filter_by(uid_penjual=uid_penjual).first()
        if penjual is None:
            return json_response({
                'status': 404,
                'success': False,
                'message': f'Data penjual dengan id {uid_penjual} tidak ditemukan'
            })

        return json_response({
            'status': 200,
            'success': True,
            'message': 'Data penjual berhasil diambil',
            'data': penjual.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({'status': 500,'success': False, 'message': 'Database Error'}, status=500)

# Tambah Data Penjual
@view_config(route_name='tambah_penjual', request_method='POST', renderer='json')
def tambah_penjual(request):
    try:
        json_data = request.json_body

        required_fields = ['username_penjual', 'nama_penjual', 'email_penjual', 'uid_penjual', 'nomor_handphone', 'role']
        for field in required_fields:
            if field not in json_data:
                return json_response({
                    'status': 400,
                    'success': False,
                    'message': f"Field '{field}' wajib disertakan"
                })

        check_id_penjual = request.dbsession.query(Penjual).filter_by(uid_penjual=json_data['uid_penjual']).first()
        if check_id_penjual is not None:
            return json_response({
                'status': 400,
                'success': False,
                'message': f"Akun sudah terdaftar"
            })

        penjual = Penjual(
            username_penjual=json_data['username_penjual'],
            nama_penjual=json_data['nama_penjual'],
            email_penjual=json_data['email_penjual'],
            role=json_data['role'],
            uid_penjual=json_data['uid_penjual'],
            nomor_handphone=json_data['nomor_handphone'],
            gambar_profil=json_data.get('gambar_profil', None)  # bisa optional
        )

        request.dbsession.add(penjual)
        request.dbsession.flush()  

        return json_response({
            'status': 200,
            'success': True,
            'message': 'Data penjual berhasil ditambahkan',
            'data': penjual.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })


# Update Data Penjual
@view_config(route_name='update_penjual', request_method='PUT', renderer='json')
def update_penjual(request):
    dbsession = request.dbsession
    uid_penjual = request.matchdict['uid_penjual']

    penjual = dbsession.query(Penjual).filter_by(uid_penjual=uid_penjual).first()
    if penjual is None:
        return json_response({
            'status': 404,
            'success': False,
            'message': 'Data penjual tidak ditemukan'
        })

    try:
        json_data = request.json_body
        if 'username_penjual' in json_data:
            penjual.username_penjual = json_data['username_penjual']
        if 'nama_penjual' in json_data:
            penjual.nama_penjual = json_data['nama_penjual']
        if 'email_penjual' in json_data:
            penjual.email_penjual = json_data['email_penjual']
        if 'nomor_handphone' in json_data:
            penjual.nomor_handphone = json_data['nomor_handphone']

        
        return json_response({
            'status': 200,
            'success': True,
            'message': f"Data penjual dengan id : {uid_penjual} berhasil diupdate",
            'data': penjual.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Hapus Data Penjual
@view_config(route_name='hapus_penjual', request_method='DELETE', renderer='json')
def hapus_penjual(request):
    dbsession = request.dbsession
    uid_penjual = request.matchdict['uid_penjual']

    penjual = dbsession.query(Penjual).filter_by(uid_penjual=uid_penjual).first()
    if penjual is None:
        return json_response({
            'status': 404,
            'success': False,
            'message': 'Data penjual tidak ditemukan'
        })

    try:
        dbsession.delete(penjual)
       
        return json_response({
            'status': 200,
            'success': True,
            'message': f'Data penjual dengan id : {uid_penjual} berhasil dihapus'
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })
