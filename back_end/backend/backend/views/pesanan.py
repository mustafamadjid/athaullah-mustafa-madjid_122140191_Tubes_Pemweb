from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
import logging

# Import Model
from ..models import Pesanan

logger = logging.getLogger(__name__)

# Helper untuk JSON response
def json_response(payload, status=200):
    return Response(
        json_body=payload,
        content_type='application/json',
        status=status
    )

# Daftar Data Pesanan
@view_config(route_name='pesanan', renderer='json')
def daftar_pesanan(request):
    try:
        query = request.dbsession.query(Pesanan)
        pesanan = query.all()
        return json_response({
            'success': True,
            'message': 'Daftar pesanan berhasil diambil',
            'data': [m.to_dict() for m in pesanan]
        }, status=200)
    except DBAPIError as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Tambah Data Pesanan
@view_config(route_name='tambah_pesanan', request_method='POST', renderer='json')
def tambah_pesanan(request):
    try:
        json_data = request.json_body

        # Validasi field yang wajib (opsional, tambah jika ingin)
        required_fields = ['id_produk', 'id_pembeli', 'jumlah_pesanan', 'tanggal_pesanan', 'status_pesanan']
        for field in required_fields:
            if field not in json_data:
                return json_response({
                    'success': False,
                    'message': f"Field '{field}' wajib disertakan"
                }, status=400)

        pesanan = Pesanan(
            id_produk=json_data['id_produk'],
            id_pembeli=json_data['id_pembeli'],
            jumlah_pesanan=json_data['jumlah_pesanan'],
            tanggal_pesanan=json_data['tanggal_pesanan'],
            status_pesanan=json_data['status_pesanan']
        )
        request.dbsession.add(pesanan)
        request.dbsession.flush()

        return json_response({
            'success': True,
            'message': 'Data pesanan berhasil ditambahkan',
            'data': pesanan.to_dict()
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)

# Hapus Data Pesanan
@view_config(route_name='hapus_pesanan', request_method='DELETE', renderer='json')
def hapus_pesanan(request):
    dbsession = request.dbsession
    id_pesanan = request.matchdict['id_pesanan']

    pesanan = dbsession.query(Pesanan).filter_by(id_pesanan=id_pesanan).first()
    if pesanan is None:
        return json_response({
            'success': False,
            'message': 'Data pesanan tidak ditemukan'
        }, status=404)

    try:
        dbsession.delete(pesanan)
        dbsession.commit()
        return json_response({
            'success': True,
            'message': f'Data pesanan dengan id : {id_pesanan} berhasil dihapus'
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({
            'success': False,
            'message': 'Database Error'
        }, status=500)
