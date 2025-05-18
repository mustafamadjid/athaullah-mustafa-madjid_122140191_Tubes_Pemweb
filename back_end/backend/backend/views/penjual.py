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
from pyramid.response import Response

# Import Model
from ..models import Penjual

import logging

logger = logging.getLogger(__name__)

# Daftar Data Penjual
@view_config(route_name='penjual', renderer='json')
def daftar_penjual(request):
    # Error message
    db_err_msg = 'Database Error'
    try:
        query = request.dbsession.query(Penjual)
        penjual = query.all()
    except DBAPIError:
        return Response(db_err_msg, content_type='text/plain', status=500)
    return {'penjual': [m.to_dict() for m in penjual]}

# Tambah Data Penjual
@view_config(route_name='tambah_penjual',request_method='POST', renderer='json')

def tambah_penjual(request):
    # Error message
    db_err_msg = 'Database Error'
    try:
        # Ambil data dari request JSON
        json_data = request.json.body
        
        # validasi data
        required_fields = ['username_penjual','nama_penjual' ,'email_penjual', 'jenis_kelamin', 'nomor_handphone']
        for field in required_fields:
            if field not in json_data:
                return Response(f"Field '{field}' wajib disertakan", status=400)
            
        # Menyimpan data ke database
        penjual = Penjual(
            username_penjual=json_data['username_penjual'],
            nama_penjual=json_data['nama_penjual'],
            email_penjual=json_data['email_penjual'],
            jenis_kelamin=json_data['jenis_kelamin'],
            nomor_handphone=json_data['nomor_handphone']
        )
        request.dbsession.add(penjual)
        
        # Commit ke database
        request.dbsession.flush()

        return {'success': True, 'message': 'Data penjual berhasil ditambahkan','penjual':penjual.to_dict()}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)


# Update Data Penjual
@view_config(route_name='update_penjual',request_method='PUT', renderer='json')
def update_penjual(request):
    # Error message
    db_err_msg = 'Database Error'
    
    dbsession = request.dbsession
    id_penjual = request.mathchdict['id_penjual']
    
    # Filter data penjual
    penjual = dbsession.query(Penjual).filter_by(id_penjual=id_penjual).first()
    if penjual is None:
        return Response('Data penjual tidak ditemukan', status=404)
    
    try:
        # Ambil data dari request json
        json_data = request.json.body
        
        # Update field yang hanya ingin diupdate
        if 'username_penjual' in json_data:
            penjual.username_penjual = json_data['username_penjual']
        if 'nama_penjual' in json_data:
            penjual.nama_penjual = json_data['nama_penjual']
        if 'email_penjual' in json_data:
            penjual.email_penjual = json_data['email_penjual']
        if 'jenis_kelamin' in json_data:
            penjual.jenis_kelamin = json_data['jenis_kelamin']
        if 'nomor_handphone' in json_data:
            penjual.nomor_handphone = json_data['nomor_handphone']
        
        # Commit ke database
        dbsession.commit()
        
        return {'success': True, 'message': 'Data penjual berhasil diupdate','penjual':penjual.to_dict()}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)


# Hapus Data penjual
@view_config(route_name='hapus_penjual',request_method='DELETE', renderer='json')
def hapus_penjual(request):
    # Error message
    db_err_msg = 'Database Error'
    
    dbsession = request.dbsession
    id_penjual= request.mathchdict['id_penjual']
    
    # Filter data penjual
    penjual= dbsession.query(Penjual).filter_by(id_penjual=id_penjual).first()
    if penjual is None:
        return Response('Data penjual tidak ditemukan', status=404)
    
    try:
        # Hapus data penjual
        dbsession.delete(penjual)
        
        # Commit ke database
        dbsession.commit()
        
        return {'success': True, 'message': f'Data penjual dengan id : {id_penjual} berhasil dihapus'}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)