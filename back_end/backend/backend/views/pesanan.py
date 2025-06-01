from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
import logging

# Import Model
from ..models import Pesanan

logger = logging.getLogger(__name__)

# Helper untuk JSON response
def json_response(payload):
    return Response(
        json_body=payload,
        content_type='application/json',
    )

# Daftar Data Pesanan
@view_config(route_name='pesanan', renderer='json')
def daftar_pesanan(request):
    try:
        query = request.dbsession.query(Pesanan)
        pesanan = query.all()
        return json_response({
            'status': 200,
            'success': True,
            'message': 'Daftar pesanan berhasil diambil',
            'data': [m.to_dict() for m in pesanan]
        })
    except DBAPIError as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

#Daftar data pesanan by uid pembeli
@view_config(route_name='pesanan_by_id', renderer='json')
def daftar_pesanan_by_id(request):
    uid_pembeli = request.matchdict['uid_pembeli']
    try:
        dbsession = request.dbsession
        pesanan = dbsession.query(Pesanan).filter_by(uid_pembeli=uid_pembeli).all()
        return json_response({
            'status': 200,
            'success': True,
            'message': f"Daftar pesanan dengan uid {uid_pembeli} berhasil diambil",
            'data': [m.to_dict() for m in pesanan]
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Daftar Data Pesanan By uid Penjual
@view_config(route_name='pesanan_by_id_penjual', renderer='json')
def daftar_pesanan_by_id_penjual(request):
    uid_penjual = request.matchdict['uid_penjual']
    try:
        dbsession = request.dbsession
        pesanan = dbsession.query(Pesanan).filter_by(uid_penjual=uid_penjual).all()
        return json_response({
            'status': 200,
            'success': True,
            'message': f"Daftar pesanan dengan uid penjual {uid_penjual} berhasil diambil",
            'data': [m.to_dict() for m in pesanan]
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Tambah Data Pesanan
@view_config(route_name='tambah_pesanan', request_method='POST', renderer='json')
def tambah_pesanan(request):
    try:
        json_data = request.json_body

        # Validasi field yang wajib
        required_fields = [ 'metode_pembayaran', 'alamat', 'kode_pos','kota','nomor_handphone', 'jumlah_pesanan', 'tanggal_pesanan', 'status_pesanan']
        for field in required_fields:
            if field not in json_data:
                return json_response({
                    'status': 400,
                    'success': False,
                    'message': f"Field '{field}' wajib disertakan"
                })

        if not json_data.get('uid_pembeli'):
            pesanan = Pesanan(
            uid_penjual=json_data['uid_penjual'],
            jumlah_pesanan=json_data['jumlah_pesanan'],
            metode_pembayaran=json_data['metode_pembayaran'],
            alamat=json_data['alamat'],
            kode_pos=json_data['kode_pos'],
            kota=json_data['kota'],
            nomor_handphone=json_data['nomor_handphone'],
            tanggal_pesanan=json_data['tanggal_pesanan'],
            status_pesanan=json_data['status_pesanan']
        )
        else:
            pesanan = Pesanan(
            uid_pembeli=json_data['uid_pembeli'],
            jumlah_pesanan=json_data['jumlah_pesanan'],
            metode_pembayaran=json_data['metode_pembayaran'],
            alamat=json_data['alamat'],
            kode_pos=json_data['kode_pos'],
            kota=json_data['kota'],
            nomor_handphone=json_data['nomor_handphone'],
            tanggal_pesanan=json_data['tanggal_pesanan'],
            status_pesanan=json_data['status_pesanan']
        )
        
       
        request.dbsession.add(pesanan)
        request.dbsession.flush()

        return json_response({
            'status': 200,
            'success': True,
            'message': 'Data pesanan berhasil ditambahkan',
            'data': pesanan.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Hapus Data Pesanan
@view_config(route_name='hapus_pesanan', request_method='DELETE', renderer='json')
def hapus_pesanan(request):
    dbsession = request.dbsession
    id_pesanan = request.matchdict['id_pesanan']

    pesanan = dbsession.query(Pesanan).filter_by(id_pesanan=id_pesanan).first()
    if pesanan is None:
        return json_response({
            'status': 404,
            'success': False,
            'message': 'Data pesanan tidak ditemukan'
        })

    try:
        dbsession.delete(pesanan)
        
        return json_response({
            'status': 200,
            'success': True,
            'message': f'Data pesanan dengan id : {id_pesanan} berhasil dihapus'
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })
