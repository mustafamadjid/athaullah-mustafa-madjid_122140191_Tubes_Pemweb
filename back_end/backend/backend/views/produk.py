from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
import os
import uuid
import magic
import logging

from ..models import Produk, FotoProduk

logger = logging.getLogger(__name__)

# Helper untuk JSON response konsisten
def json_response(payload, status=200):
    return Response(
        json_body=payload,
        content_type='application/json',
        status=status
    )

# Daftar Data Produk
@view_config(route_name='produk', request_method='GET', renderer='json')
def daftar_produk(request):
    try:
        dbsession = request.dbsession
        produk = dbsession.query(Produk).all()
        return json_response({
            'success': True,
            'message': 'Daftar produk berhasil diambil',
            'data': [m.to_dict() for m in produk]
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({'success': False, 'message': 'Database Error'}, status=500)

# Daftar Data Produk berdasarkan produk (Foto)
@view_config(route_name='produk_foto', request_method='GET', renderer='json')
def daftar_produk_foto(request):
    id_produk = request.matchdict['id_produk']
    try:
        dbsession = request.dbsession
        foto_produk = dbsession.query(FotoProduk).filter_by(id_produk=id_produk).all()
        return json_response({
            'success': True,
            'message': 'Daftar foto produk berhasil diambil',
            'data': [m.to_dict() for m in foto_produk]
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({'success': False, 'message': 'Database Error'}, status=500)
    
# Daftar Data Produk berdasarkan penjual
@view_config(route_name='produk_by_penjual', request_method='GET', renderer='json')
def daftar_produk_by_penjual(request):
    id_penjual = request.matchdict['id_penjual']
    try:
        dbsession = request.dbsession
        produk = dbsession.query(Produk).filter_by(id_penjual=id_penjual).all()
        return json_response({
            'success': True,
            'message': 'Daftar produk berhasil diambil',
            'data': [m.to_dict() for m in produk]
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({'success': False, 'message': 'Database Error'}, status=500)

# Tambah Data Produk
@view_config(route_name='tambah_produk', request_method='POST', renderer='json')
def tambah_produk(request):
    try:
        json_data = request.json_body
        required_fields = ['nama_produk', 'kategori_produk', 'deskripsi_produk', 'merk_produk', 'harga_produk', 'stok_produk', 'id_penjual']
        for field in required_fields:
            if field not in json_data:
                return json_response({'success': False, 'message': f"Field '{field}' wajib disertakan"}, status=400)

        produk = Produk(
            nama_produk=json_data['nama_produk'],
            kategori_produk=json_data['kategori_produk'],
            deskripsi_produk=json_data['deskripsi_produk'],
            merk_produk=json_data['merk_produk'],
            harga_produk=json_data['harga_produk'],
            stok_produk=json_data['stok_produk'],
            id_penjual=json_data['id_penjual'],
        )
        request.dbsession.add(produk)
        request.dbsession.flush()

        return json_response({
            'success': True,
            'message': 'Data produk berhasil ditambahkan',
            'data': produk.to_dict()
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({'success': False, 'message': 'Database Error'}, status=500)

# Tambah Data Produk (Foto Produk)
@view_config(route_name='upload_foto_produk', request_method='POST', renderer='json')
def upload_foto_produk(request):
    db_err_msg = 'Database Error'
    upload_dir = os.path.join(os.getcwd(), 'assets', 'uploaded_photos')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    try:
        upload_file = request.POST.get('foto_produk')
        if not upload_file:
            return json_response({'success': False, 'message': 'File foto_produk tidak ditemukan'}, status=400)
        filename = upload_file.filename
        if not filename:
            return json_response({'success': False, 'message': 'File harus memiliki nama'}, status=400)
        ext = filename.split('.')[-1].lower()
        allowed_ext = ['jpg', 'jpeg', 'png', 'gif']
        if ext not in allowed_ext:
            return json_response({'success': False, 'message': 'Format file tidak diizinkan'}, status=400)
        file_sample = upload_file.file.read(2048)
        upload_file.file.seek(0)
        mime_type = magic.from_buffer(file_sample, mime=True)
        allowed_mime = ['image/jpeg', 'image/png']
        if mime_type not in allowed_mime:
            return json_response({'success': False, 'message': 'Tipe file tidak diizinkan'}, status=400)
        id_produk = request.POST.get('id_produk')
        if not id_produk:
            return json_response({'success': False, 'message': 'Id produk tidak ditemukan'}, status=400)

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
            return json_response({'success': True, 'message': 'Data foto produk berhasil ditambahkan'}, status=200)
        except Exception as db_exc:
            logger.error(db_exc)
            if os.path.exists(file_path):
                os.remove(file_path)
            return json_response({'success': False, 'message': db_err_msg}, status=500)

    except Exception as exc:
        logger.error(exc)
        return json_response({'success': False, 'message': 'File gagal disimpan di server'}, status=500)

# Update Data Produk
@view_config(route_name='update_produk', request_method='PUT', renderer='json')
def update_produk(request):
    dbsession = request.dbsession
    id_produk = request.matchdict['id_produk']
    produk = dbsession.query(Produk).filter_by(id_produk=id_produk).first()
    if produk is None:
        return json_response({'success': False, 'message': 'Data produk tidak ditemukan'}, status=404)
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
        dbsession.commit()
        return json_response({
            'success': True,
            'message': f'Data produk dengan id : {id_produk} berhasil diupdate',
            'data': produk.to_dict()
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({'success': False, 'message': 'Database Error'}, status=500)

# Update Data Produk (Foto)
@view_config(route_name='update_foto_produk', request_method='POST', renderer='json')
def update_foto_produk(request):
    db_err_msg = 'Database Error'
    dbsession = request.dbsession
    id_foto_produk = request.matchdict.get('id_foto_produk')
    if not id_foto_produk:
        return json_response({'success': False, 'message': 'ID foto produk tidak ditemukan di URL'}, status=400)
    foto_produk = dbsession.query(FotoProduk).filter_by(id_foto_produk=id_foto_produk).first()
    if foto_produk is None:
        return json_response({'success': False, 'message': 'Data foto produk tidak ditemukan'}, status=404)
    upload_dir = os.path.join(os.getcwd(), 'assets', 'uploaded_photos')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    try:
        upload_file = request.POST.get('foto_produk')
        if not upload_file:
            return json_response({'success': False, 'message': 'File foto_produk tidak ditemukan'}, status=400)
        filename = upload_file.filename
        if not filename:
            return json_response({'success': False, 'message': 'File harus memiliki nama'}, status=400)
        ext = filename.split('.')[-1].lower()
        allowed_ext = ['jpg', 'jpeg', 'png', 'gif']
        if ext not in allowed_ext:
            return json_response({'success': False, 'message': 'Format file tidak diizinkan'}, status=400)
        file_sample = upload_file.file.read(2048)
        upload_file.file.seek(0)
        mime_type = magic.from_buffer(file_sample, mime=True)
        allowed_mime = ['image/jpeg', 'image/png', 'image/gif']
        if mime_type not in allowed_mime:
            return json_response({'success': False, 'message': 'Tipe file tidak diizinkan'}, status=400)

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

        foto_produk.foto_produk = os.path.join('assets', 'uploaded_photos', unique_filename)
        dbsession.commit()
        try:
            dbsession.flush()
            return json_response({'success': True, 'message': 'Data foto produk berhasil diupdate'}, status=200)
        except Exception as db_exc:
            logger.error(db_exc)
            if os.path.exists(file_path):
                os.remove(file_path)
            return json_response({'success': False, 'message': db_err_msg}, status=500)

    except Exception as exc:
        logger.error(exc)
        return json_response({'success': False, 'message': 'File gagal disimpan di server'}, status=500)

# Hapus Data Produk
@view_config(route_name='hapus_produk', request_method='DELETE', renderer='json')
def hapus_produk(request):
    dbsession = request.dbsession
    id_produk = request.matchdict['id_produk']
    produk = dbsession.query(Produk).filter_by(id_produk=id_produk).first()
    if produk is None:
        return json_response({'success': False, 'message': 'Data produk tidak ditemukan'}, status=404)
    try:
        dbsession.delete(produk)
        dbsession.commit()
        return json_response({
            'success': True,
            'message': f'Data produk dengan id : {id_produk} berhasil dihapus'
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({'success': False, 'message': 'Database Error'}, status=500)

# Hapus Data Produk (Foto)
@view_config(route_name='hapus_foto_produk', request_method='DELETE', renderer='json')
def hapus_foto_produk(request):
    dbsession = request.dbsession
    id_foto_produk = request.matchdict['id_foto_produk']
    foto_produk = dbsession.query(FotoProduk).filter_by(id_foto_produk=id_foto_produk).first()
    if foto_produk is None:
        return json_response({'success': False, 'message': 'Data foto produk tidak ditemukan'}, status=404)
    try:
        dbsession.delete(foto_produk)
        dbsession.commit()
        return json_response({
            'success': True,
            'message': f'Data foto produk dengan id : {id_foto_produk} berhasil dihapus'
        }, status=200)
    except Exception as e:
        logger.exception(e)
        return json_response({'success': False, 'message': 'Database Error'}, status=500)
