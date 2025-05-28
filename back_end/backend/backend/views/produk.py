from pyramid.response import Response, FileResponse
from pyramid.httpexceptions import HTTPNotFound
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
import os
import uuid
import magic
import logging
import mimetypes

from ..models import Produk, FotoProduk

logger = logging.getLogger(__name__)

# Helper untuk JSON response konsisten
def json_response(payload):
    return Response(
        json_body=payload,
        content_type='application/json',
    )

# Daftar Data Produk
@view_config(route_name='produk', request_method='GET', renderer='json')
def daftar_produk(request):
    try:
        dbsession = request.dbsession
        produk = dbsession.query(Produk).all()
        return json_response({
            'status': 200,
            'success': True,
            'message': 'Daftar produk berhasil diambil',
            'data': [m.to_dict() for m in produk]
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Daftar Data Produk By ID
@view_config(route_name='produk_by_id', request_method='GET', renderer='json')
def daftar_produk_by_id(request):
    id_produk = request.matchdict['id_produk']
    try:
        dbsession = request.dbsession
        produk = dbsession.query(Produk).filter_by(id_produk=id_produk).first()
        return json_response({
            'status': 200,
            'success': True,
            'message': 'Daftar produk berhasil diambil',
            'data': produk.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Daftar Data Produk berdasarkan produk (Foto)
@view_config(route_name='produk_foto', request_method='GET', renderer='json')
def daftar_produk_foto(request):
    id_produk = request.matchdict['id_produk']
    try:
        dbsession = request.dbsession
        foto_produk = dbsession.query(FotoProduk).filter_by(id_produk=id_produk).all()
        return json_response({
            'status': 200,
            'success': True,
            'message': 'Daftar foto produk berhasil diambil',
            'data': [m.to_dict() for m in foto_produk]
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# View Foto dari server
@view_config(route_name='view_foto_produk', request_method='GET')
def view_foto_produk(request):
    id_produk = request.matchdict['id_produk']

    try:
        dbsession = request.dbsession
        foto_list = dbsession.query(FotoProduk.foto_produk).filter_by(id_produk=id_produk).all()
        foto_strings = [foto[0] for foto in foto_list]

        if not foto_strings:
            return HTTPNotFound("Foto produk tidak ditemukan di database")

        current_dir = os.path.dirname(os.path.abspath(__file__))
        # backend_dir = os.path.abspath(os.path.join(current_dir, '..'))
        # foto_dir = os.path.join(backend_dir, 'assets', 'uploaded_photos')

        file_path = os.path.normpath(os.path.join( foto_strings[0]))

        if not os.path.isfile(file_path):
            return HTTPNotFound(f"File dengan nama {file_path} Tidak Ditemukan")

        content_type, _ = mimetypes.guess_type(file_path)
        if content_type is None:
            content_type = 'application/octet-stream'

        response = FileResponse(file_path, request=request, content_type=content_type)
        response.cache_control.no_cache = True
        response.cache_control.no_store = True
        response.cache_control.must_revalidate = True
        response.expires = 0

        return response
    

    except Exception as e:
        logger.exception(e)
        return {
            'status': 500,
            'success': False,
            'message': 'Database Error'
        }
    
    
    
# Daftar Data Produk berdasarkan penjual
@view_config(route_name='produk_by_penjual', request_method='GET', renderer='json')
def daftar_produk_by_penjual(request):
    uid_penjual = request.matchdict['uid_penjual']
    try:
        dbsession = request.dbsession
        produk = dbsession.query(Produk).filter_by(uid_penjual=uid_penjual).all()
        return json_response({
            'status': 200,
            'success': True,
            'message': 'Daftar produk berhasil diambil',
            'data': [m.to_dict() for m in produk]
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Daftar Data Produk Berdasarkan Kategori
@view_config(route_name='produk_by_kategori', request_method='GET', renderer='json')
def daftar_produk_by_kategori(request):
    kategori_produk = request.matchdict['kategori_produk']
    try:
        dbsession = request.dbsession
        produk = dbsession.query(Produk).filter_by(kategori_produk=kategori_produk).all()
        return json_response({
            'status': 200,
            'success': True,
            'message': f"Daftar produk dengan kategori ${kategori_produk} berhasil diambil",
            'data': [m.to_dict() for m in produk]
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Tambah Data Produk
@view_config(route_name='tambah_produk', request_method='POST', renderer='json')
def tambah_produk(request):
    try:
        json_data = request.json_body
        required_fields = ['nama_produk', 'kategori_produk', 'deskripsi_produk', 'merk_produk', 'harga_produk', 'stok_produk', 'uid_penjual']
        for field in required_fields:
            if field not in json_data:
                return json_response({
                    'status': 400,
                    'success': False,
                    'message': f"Field '{field}' wajib disertakan"
                })

        produk = Produk(
            nama_produk=json_data['nama_produk'],
            kategori_produk=json_data['kategori_produk'],
            deskripsi_produk=json_data['deskripsi_produk'],
            merk_produk=json_data['merk_produk'],
            harga_produk=json_data['harga_produk'],
            stok_produk=json_data['stok_produk'],
            uid_penjual=json_data['uid_penjual'],
        )
        request.dbsession.add(produk)
        request.dbsession.flush()

        return json_response({
            'status': 200,
            'success': True,
            'message': 'Data produk berhasil ditambahkan',
            'data': produk.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Tambah Data Produk (Foto Produk)
@view_config(route_name='upload_foto_produk', request_method='POST', renderer='json')
def upload_foto_produk(request):
    db_err_msg = 'Database Error'
    upload_dir = os.path.join(os.getcwd(), 'assets', 'uploaded_photos')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    try:
        upload_file = request.POST.get('foto_produk')
        if upload_file is None:
            return json_response({
                'status': 400,
                'success': False,
                'message': 'File foto_produk tidak ditemukan'
            })
        filename = upload_file.filename
        if not filename:
            return json_response({
                'status': 400,
                'success': False,
                'message': 'File harus memiliki nama'
            })
        ext = filename.split('.')[-1].lower()
        allowed_ext = ['jpg', 'jpeg', 'png', 'gif']
        if ext not in allowed_ext:
            return json_response({
                'status': 400,
                'success': False,
                'message': 'Format file tidak diizinkan'
            })
        file_sample = upload_file.file.read(2048)
        upload_file.file.seek(0)
        mime_type = magic.from_buffer(file_sample, mime=True)
        allowed_mime = ['image/jpeg', 'image/png']
        if mime_type not in allowed_mime:
            return json_response({
                'status': 400,
                'success': False,
                'message': 'Tipe file tidak diizinkan'
            })
        id_produk = request.matchdict['id_produk']
        checkId = request.dbsession.query(Produk).filter_by(id_produk=id_produk).first()
        if checkId is None:
            return json_response({
                'status': 400,
                'success': False,
                'message': 'Id produk ga nemu'
            })

        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        with open(file_path, 'wb') as output_file:
            input_file = upload_file.file
            while True:
                chunk = input_file.read(65536)
                if not chunk:
                    break
                output_file.write(chunk)

        relative_path = os.path.join('assets', 'uploaded_photos', unique_filename)
        try:
            foto_produk = FotoProduk(
                foto_produk=relative_path,
                id_produk=id_produk
            )
            request.dbsession.add(foto_produk)
            request.dbsession.flush()
            return json_response({
                'status': 200,
                'success': True,
                'message': 'Data foto produk berhasil ditambahkan'
            })
        except Exception as db_exc:
            logger.error(db_exc)
            if os.path.exists(file_path):
                os.remove(file_path)
            return json_response({
                'status': 500,
                'success': False,
                'message': db_err_msg
            })

    except Exception as exc:
        logger.error(exc)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'File gagal disimpan di server'
        })

# Update Data Produk
@view_config(route_name='update_produk', request_method='PUT', renderer='json')
def update_produk(request):
    dbsession = request.dbsession
    id_produk = request.matchdict['id_produk']
    produk = dbsession.query(Produk).filter_by(id_produk=id_produk).first()
    if produk is None:
        return json_response({
            'status': 404,
            'success': False,
            'message': 'Data produk tidak ditemukan'
        })
    try:
        json_data = request.json_body
        if 'nama_produk' in json_data:
            produk.nama_produk = json_data['nama_produk']
        if 'kategori_produk' in json_data:
            produk.kategori_produk = json_data['kategori_produk']
        if 'deskripsi_produk' in json_data:
            produk.deskripsi_produk = json_data['deskripsi_produk']
        if 'merk_produk' in json_data:
            produk.merk_produk = json_data['merk_produk']
        if 'harga_produk' in json_data:
            produk.harga_produk = json_data['harga_produk']
        if 'stok_produk' in json_data:
            produk.stok_produk = json_data['stok_produk']
        if 'foto_produk' in json_data:
            produk.foto_produk = json_data['foto_produk']
        if 'id_penjual' in json_data:
            produk.id_penjual = json_data['id_penjual']
        
        return json_response({
            'status': 200,
            'success': True,
            'message': f'Data produk dengan id : {id_produk} berhasil diupdate',
            'data': produk.to_dict()
        })
    except Exception as e:
        logger.exception(e)
        return json_response({
            'status': 500,
            'success': False,
            'message': 'Database Error'
        })

# Update Data Produk (Foto)
@view_config(route_name='update_foto_produk', request_method='POST', renderer='json')
def update_foto_produk(request):
    db_err_msg = 'Database Error'
    dbsession = request.dbsession
    id_produk = request.matchdict.get('id_produk')
    if not id_produk:
        return json_response({
            'status': 400,
            'success': False,
            'message': 'ID foto produk tidak ditemukan di URL'
        })
    foto_produk = dbsession.query(FotoProduk).filter_by(id_produk=id_produk).first()
    if foto_produk is None:
        return json_response({
            'status': 404,
            'success': False,
            'message': 'Data foto produk tidak ditemukan'
        })
    upload_dir = os.path.join(os.getcwd(), 'assets', 'uploaded_photos')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    try:
        upload_file = request.POST.get('foto_produk')
        if upload_file is None:
            return json_response({'success': False, 'message': 'File foto_produk tidak ditemukan'})
        filename = upload_file.filename
        if not filename:
            return json_response({'success': False, 'message': 'File harus memiliki nama'})
        ext = filename.split('.')[-1].lower()
        allowed_ext = ['jpg', 'jpeg', 'png', 'gif']
        if ext not in allowed_ext:
            return json_response({'success': False, 'message': 'Format file tidak diizinkan'})
        file_sample = upload_file.file.read(2048)
        upload_file.file.seek(0)
        mime_type = magic.from_buffer(file_sample, mime=True)
        allowed_mime = ['image/jpeg', 'image/png', 'image/gif']
        if mime_type not in allowed_mime:
            return json_response({'success': False, 'message': 'Tipe file tidak diizinkan'})

        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = os.path.join(upload_dir, unique_filename)

        with open(file_path, 'wb') as output_file:
            input_file = upload_file.file
            while True:
                chunk = input_file.read(65536)
                if not chunk:
                    break
                output_file.write(chunk)

        # Hapus file lama jika ada
        old_file_path = os.path.join(os.getcwd(), foto_produk.foto_produk)
        if os.path.exists(old_file_path):
            os.remove(old_file_path)

       
        
        try:
            foto_produk.foto_produk = os.path.join('assets', 'uploaded_photos', unique_filename)
            dbsession.flush()
            return json_response({'success': True, 'message': 'Data foto produk berhasil diupdate'})
        except Exception as db_exc:
            logger.error(db_exc)
            if os.path.exists(file_path):
                os.remove(file_path)
            return json_response({'success': False, 'message': db_err_msg})

    except Exception as exc:
        logger.error(exc)
        return json_response({'success': False, 'message': 'File gagal disimpan di server'})

# Hapus Data Produk
@view_config(route_name='hapus_produk', request_method='DELETE', renderer='json')
def hapus_produk(request):
    dbsession = request.dbsession
    id_produk = request.matchdict['id_produk']
    produk = dbsession.query(Produk).filter_by(id_produk=id_produk).first()
    if produk is None:
        return json_response({'status': 404, 'success': False, 'message': 'Data produk tidak ditemukan'})
    try:
        dbsession.delete(produk)
        
        return json_response({
            'status': 200,
            'success': True,
            'message': f'Data produk dengan id : {id_produk} berhasil dihapus'
        })
    except Exception as e:
        logger.exception(e)
        return json_response({'status': 500, 'success': False, 'message': 'Database Error'})

# Hapus Data Produk (Foto)
@view_config(route_name='hapus_foto_produk', request_method='DELETE', renderer='json')
def hapus_foto_produk(request):
    dbsession = request.dbsession
    id_produk = request.matchdict['id_produk']
    foto_produk = dbsession.query(FotoProduk).filter_by(id_produk=id_produk).first()
    if foto_produk is None:
        return json_response({'status': 404, 'success': False, 'message': 'Data foto produk tidak ditemukan'})
    try:
        dbsession.delete(foto_produk)
        
        return json_response({
            'status': 200,
            'success': True,
            'message': f'Data foto produk dengan id : {id_produk} berhasil dihapus'
        })
    except Exception as e:
        logger.exception(e)
        return json_response({'status': 500, 'success': False, 'message': 'Database Error'})
