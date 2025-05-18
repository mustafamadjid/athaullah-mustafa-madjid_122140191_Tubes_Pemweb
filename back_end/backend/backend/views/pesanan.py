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
from ..models import Pesanan

import logging

logger = logging.getLogger(__name__)

# Daftar Data Pesanan
@view_config(route_name='pesanan', renderer='json')
def daftar_pesanan(request):
    # Error message
    db_err_msg = 'Database Error'
    try:
        query = request.dbsession.query(Pesanan)
        pesanan = query.all()
    except DBAPIError:
        return Response(db_err_msg, content_type='text/plain', status=500)
    return {'pesanan': [m.to_dict() for m in pesanan]}

# Tambah Data Pesanan
@view_config(route_name='tambah_pesanan',request_method='POST', renderer='json')
def tambah_pesanan(request):
    # Error message
    db_err_msg = 'Database Error'
    try:
        # Ambil data dari request JSON
        json_data = request.json.body
        
        # Menyimpan data ke database
        pesanan = Pesanan(
            id_produk=json_data['id_produk'],
            id_pembeli=json_data['id_pembeli'],
            jumlah_pesanan=json_data['jumlah_pesanan'],
            tanggal_pesanan=json_data['tanggal_pesanan'],
            status_pesanan=json_data['status_pesanan']
        )
        request.dbsession.add(pesanan)
        
        # Commit ke database
        request.dbsession.flush()
        
        return {'success': True, 'message': 'Data pesanan berhasil ditambahkan','pesanan':pesanan.to_dict()}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)

# Hapus Data Pesanan
@view_config(route_name='hapus_pesanan',request_method='DELETE', renderer='json')
def hapus_pesanan(request):
    # Error message
    db_err_msg = 'Database Error'
    
    dbsession = request.dbsession
    id_pesanan = request.mathchdict['id_pesanan']
    
    # Filter data pesanan
    pesanan = dbsession.query(Pesanan).filter_by(id_pesanan=id_pesanan).first()
    if pesanan is None:
        return Response('Data pesanan tidak ditemukan', status=404)
    
    try:
        # Hapus data pesanan
        dbsession.delete(pesanan)
        
        # Commit ke database
        dbsession.commit()
        
        return {'success': True, 'message': f'Data pesanan dengan id : {id_pesanan} berhasil dihapus'}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)