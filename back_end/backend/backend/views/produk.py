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


import os
import uuid
import magic

# Import Model
from ..models import Produk,FotoProduk

import logging

logger = logging.getLogger(__name__)

# Daftar Data Produk
@view_config(route_name='produk',request_method='GET', renderer='json')
def daftar_produk(request):
    # Error message
    db_err_msg = 'Database Error'
    
    # Mendapatkan data produk
    try:
        dbsession = request.dbsession
        query = dbsession.query(Produk)
        produk = query.all()
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)
    return {'produk': [m.to_dict() for m in produk]}


# Tambah Data Produk
@view_config(route_name='tambah_produk',request_method='POST', renderer='json')
def tambah_produk(request):
    # Error message
    db_err_msg = 'Database Error'
    try:
        # Ambil data dari request JSON
        json_data = request.json.body
        
        foto = request.POST.get('foto_produk')
        
        # validasi data
        required_fields = ['nama_produk','kategori_produk', 'deskripsi_produk','merk_produk', 'harga_produk','stok_produk', 'id_penjual']
        for field in required_fields:
            if field not in json_data:
                return Response(f"Field '{field}' wajib disertakan", status=400)
            
        # Menyimpan data ke database
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
        
        # Commit ke database
        request.dbsession.flush()

        return {'success': True, 'message': 'Data produk berhasil ditambahkan','produk':produk.to_dict()}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)

# Tambah Data Produk (Foto Produk)
@view_config(route_name='upload_foto_produk',request_method='POST', renderer='json')
def upload_foto_produk(request):
   # Pesan error umum untuk DB
    db_err_msg = 'Database Error'

    # Folder penyimpanan relatif terhadap direktori kerja aplikasi
    upload_dir = os.path.join(os.getcwd(), 'assets', 'uploaded_photos')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    try:
        # Ambil file dari form dengan field 'foto_produk'
        upload_file = request.POST.get('foto_produk')
        if not upload_file:
            return Response({'success': False, 'message': 'File foto_produk tidak ditemukan'}, status=400)

        filename = upload_file.filename
        if not filename:
            return Response({'success': False, 'message': 'File harus memiliki nama'}, status=400)

        # Validasi ekstensi file 
        ext = filename.split('.')[-1].lower()
        allowed_ext = ['jpg', 'jpeg', 'png', 'gif']
        if ext not in allowed_ext:
            return Response({'success': False, 'message': 'Format file tidak diizinkan'}, status=400)

        # Validasi MIME type file 
        file_sample = upload_file.file.read(2048)
        upload_file.file.seek(0)  # reset pointer file setelah baca sample
        mime_type = magic.from_buffer(file_sample, mime=True)
        allowed_mime = ['image/jpeg', 'image/png']
        if mime_type not in allowed_mime:
            return Response({'success': False, 'message': 'Tipe file tidak diizinkan'}, status=400)

        # Ambil id_produk dari form
        id_produk = request.POST.get('id_produk')
        if not id_produk:
            return Response({'success': False, 'message': 'Id produk tidak ditemukan'}, status=400)

        # Generate nama file unik dengan ekstensi asli
        unique_filename = f"{uuid.uuid4().hex}.{ext}"

        # Path lengkap untuk menyimpan file
        file_path = os.path.join(upload_dir, unique_filename)

        # Simpan file ke folder secara chunk
        with open(file_path, 'wb') as output_file:
            input_file = upload_file.file
            while True:
                chunk = input_file.read(65536)  # baca 64KB per chunk
                if not chunk:
                    break
                output_file.write(chunk)

        # Simpan data ke database 
        try:
            # Menyimpan realtive file path ke db, Example: 'assets/uploaded_photos/unique_filename'
            relative_path = os.path.join('assets', 'uploaded_photos', unique_filename)

            foto_produk = FotoProduk(
                foto_produk=relative_path,
                id_produk=id_produk
            )
            request.dbsession.add(foto_produk)
            request.dbsession.flush()

            return {'success': True, 'message': 'Data foto produk berhasil ditambahkan'}

        except Exception as db_exc:
            # Jika gagal simpan DB, hapus file yang sudah diupload 
            if os.path.exists(file_path):
                os.remove(file_path)
            return Response({'success': False, 'message': db_err_msg}, status=500)

    except Exception as exc:
        return Response({'success': False, 'message': 'File gagal disimpan di server'}, status=500)
    

    

# Update Data Produk
@view_config(route_name='update_produk',request_method='PUT', renderer='json')
def update_produk(request):
    # Error message
    db_err_msg = 'Database Error'
    
    dbsession = request.dbsession
    id_produk = request.mathchdict['id_produk']
    
    # Filter data produk
    produk = dbsession.query(Produk).filter_by(id_produk=id_produk).first()
    if produk is None:
        return Response('Data produk tidak ditemukan', status=404)
    
    try:
        # Ambil data dari request json
        json_data = request.json.body
        
        # Update field yang hanya ingin diupdate
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
        
        # Commit ke database
        dbsession.commit()
        
        return {'success': True, 'message': f'Data produk dengan id : {id_produk} berhasil diupdate','produk':produk.to_dict()}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)


# Hapus Data Produk
@view_config(route_name='hapus_produk',request_method='DELETE', renderer='json')
def hapus_produk(request):
    # Error message
    db_err_msg = 'Database Error'
    
    dbsession = request.dbsession
    id_produk = request.mathchdict['id_produk']
    
    # Filter data produk
    produk = dbsession.query(Produk).filter_by(id_produk=id_produk).first()
    if produk is None:
        return Response('Data produk tidak ditemukan', status=404)
    
    try:
        # Hapus data produk
        dbsession.delete(produk)
        
        # Commit ke database
        dbsession.commit()
        
        return {'success': True, 'message': f'Data produk dengan id : {id_produk} berhasil dihapus'}
    except:
        return Response(db_err_msg, content_type='text/plain', status=500)