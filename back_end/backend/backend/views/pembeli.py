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
from ..models import Pembeli

import logging

logger = logging.getLogger(__name__)

# Daftar Data Pembeli
@view_config(route_name='pembeli', renderer='json')
def daftar_pembeli(request):
    # Error message
    db_err_msg = 'Database Error'
    try:
        query = request.dbsession.query(Pembeli)
        pembeli = query.all()
    except DBAPIError:
        return Response(db_err_msg, content_type='text/plain', status=500)
    return {'pembeli': [m.to_dict() for m in pembeli]}

# Tambah Data Pembeli
@view_config(route_name='tambah_pembeli',request_method='POST', renderer='json')

def tambah_pembeli(request):
    # Error message
    db_err_msg = 'Database Error'
    try:
        # Ambil data dari request JSON
        json_data = request.json.body
        
        # validasi data
        required_fields = ['username_pembeli','nama_pembeli' ,'email_pembeli', 'jenis_kelamin', 'nomor_handphone']
        for field in required_fields:
            if field not in json_data:
                return Response(f"Field '{field}' wajib disertakan", status=400)
            
        # Menyimpan data ke database
        pembeli = Pembeli(
            username_pembeli=json_data['username_pembeli'],
            nama_pembeli=json_data['nama_pembeli'],
            email_pembeli=json_data['email_pembeli'],
            jenis_kelamin=json_data['jenis_kelamin'],
            nomor_handphone=json_data['nomor_handphone']
        )
        request.dbsession.add(pembeli)
        
        # Commit ke database
        request.dbsession.flush()

        return {'success': True, 'message': 'Data pembeli berhasil ditambahkan','pembeli':pembeli.to_dict()}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)


# Update Data Pembeli
@view_config(route_name='update_pembeli',request_method='PUT', renderer='json')
def update_pembeli(request):
    # Error message
    db_err_msg = 'Database Error'
    
    dbsession = request.dbsession
    id_pembeli = request.mathchdict['id_pembeli']
    
    # Filter data pembeli
    pembeli = dbsession.query(Pembeli).filter_by(id_pembeli=id_pembeli).first()
    if pembeli is None:
        return Response('Data pembeli tidak ditemukan', status=404)
    
    try:
        # Ambil data dari request json
        json_data = request.json.body
        
        # Update field yang hanya ingin diupdate
        if 'username_pembeli' in json_data:
            pembeli.username_pembeli = json_data['username_pembeli']
        if 'nama_pembeli' in json_data:
            pembeli.nama_pembeli = json_data['nama_pembeli']
        if 'email_pembeli' in json_data:
            pembeli.email_pembeli = json_data['email_pembeli']
        if 'jenis_kelamin' in json_data:
            pembeli.jenis_kelamin = json_data['jenis_kelamin']
        if 'nomor_handphone' in json_data:
            pembeli.nomor_handphone = json_data['nomor_handphone']
        
        # Commit ke database
        dbsession.commit()
        
        return {'success': True, 'message': 'Data pembeli berhasil diupdate','pembeli':pembeli.to_dict()}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)


# Hapus Data Pembeli
@view_config(route_name='hapus_pembeli',request_method='DELETE', renderer='json')
def hapus_pembeli(request):
    # Error message
    db_err_msg = 'Database Error'
    
    dbsession = request.dbsession
    id_pembeli = request.mathchdict['id_pembeli']
    
    # Filter data pembeli
    pembeli = dbsession.query(Pembeli).filter_by(id_pembeli=id_pembeli).first()
    if pembeli is None:
        return Response('Data pembeli tidak ditemukan', status=404)
    
    try:
        # Hapus data pembeli
        dbsession.delete(pembeli)
        
        # Commit ke database
        dbsession.commit()
        
        return {'success': True, 'message': f'Data pembeli dengan id : {id_pembeli} berhasil dihapus'}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)