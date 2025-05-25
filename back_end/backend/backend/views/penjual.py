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
def json_response(payload, status=200):
    return Response(
        json_body=payload,
        content_type='application/json',
        status=status
    )

# Daftar Data Penjual
@view_config(route_name='penjual', renderer='json')
def daftar_penjual(request):
    try:
        query = request.dbsession.query(Penjual)
        penjual = query.all()
        return json_response({
            'success': True,
            'message': 'Daftar penjual berhasil diambil',
            'data': [m.to_dict() for m in penjual]
        }, status=200)
    except DBAPIError:
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Tambah Data Penjual
@view_config(route_name='tambah_penjual', request_method='POST', renderer='json')
def tambah_penjual(request):
    try:
        json_data = request.json_body

        required_fields = ['username_penjual', 'nama_penjual', 'email_penjual', 'uid_penjual', 'nomor_handphone']
        for field in required_fields:
            if field not in json_data:
                return json_response({
                    'success': False,
                    'message': f"Field '{field}' wajib disertakan"
                }, status=400)

        penjual = Penjual(
            username_penjual=json_data['username_penjual'],
            nama_penjual=json_data['nama_penjual'],
            email_penjual=json_data['email_penjual'],
            uid_penjual=json_data['uid_penjual'],
            nomor_handphone=json_data['nomor_handphone']
        )
        request.dbsession.add(penjual)
        request.dbsession.flush()

        return json_response({
            'success': True,
            'message': 'Data penjual berhasil ditambahkan',
            'data': penjual.to_dict()
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Update Data Penjual
@view_config(route_name='update_penjual', request_method='PUT', renderer='json')
def update_penjual(request):
    dbsession = request.dbsession
    uid_penjual = request.matchdict['uid_penjual']

    penjual = dbsession.query(Penjual).filter_by(uid_penjual=uid_penjual).first()
    if penjual is None:
        return json_response({
            'success': False,
            'message': 'Data penjual tidak ditemukan'
        }, status=404)

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

        dbsession.commit()
        return json_response({
            'success': True,
            'message': f"Data penjual dengan id : {uid_penjual} berhasil diupdate",
            'data': penjual.to_dict()
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Hapus Data Penjual
@view_config(route_name='hapus_penjual', request_method='DELETE', renderer='json')
def hapus_penjual(request):
    dbsession = request.dbsession
    uid_penjual = request.matchdict['uid_penjual']

    penjual = dbsession.query(Penjual).filter_by(uid_penjual=uid_penjual).first()
    if penjual is None:
        return json_response({
            'success': False,
            'message': 'Data penjual tidak ditemukan'
        }, status=404)

    try:
        dbsession.delete(penjual)
        dbsession.commit()
        return json_response({
            'success': True,
            'message': f'Data penjual dengan id : {uid_penjual} berhasil dihapus'
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)
