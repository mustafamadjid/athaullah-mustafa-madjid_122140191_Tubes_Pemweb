import pytest
import io
import os
from pyramid.testing import DummyRequest
from backend.views.produk import (
    daftar_produk,
    daftar_produk_by_id,
    daftar_produk_foto,
    tambah_produk,
    hapus_produk,
    hapus_foto_produk,
    upload_foto_produk, 
    update_foto_produk
)
from backend.models import Produk, FotoProduk

class DummyFile:
    def __init__(self, content=b"dummy image data", filename="test.png"):
        self.file = io.BytesIO(content)
        self.filename = filename

    def read(self, size=-1):
        return self.file.read(size)

    def seek(self, offset, whence=0):
        return self.file.seek(offset, whence)

@pytest.fixture
def dummy_upload_file():
    # buat dummy PNG content
    content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00'
    return DummyFile(content=content, filename="test.png")


@pytest.fixture
def produk_data():
    return {
        'nama_produk': 'Produk A',
        'kategori_produk': 'Kategori A',
        'deskripsi_produk': 'Deskripsi Produk A',
        'merk_produk': 'Merk A',
        'harga_produk': 150000,
        'stok_produk': 10,
        'uid_penjual': 'uid_penjual_123'
    }

@pytest.fixture
def foto_produk_data(produk):
    return {
        'id_produk': produk.id_produk,
        'foto_produk': 'assets/uploaded_photos/sample.jpg'
    }

@pytest.fixture
def produk(dbsession, produk_data):
    p = Produk(**produk_data)
    dbsession.add(p)
    dbsession.flush()
    return p

@pytest.fixture
def foto_produk(dbsession, produk, foto_produk_data):
    f = FotoProduk(**foto_produk_data)
    dbsession.add(f)
    dbsession.flush()
    return f

def test_daftar_produk_empty(dbsession):
    req = DummyRequest()
    req.dbsession = dbsession
    res = daftar_produk(req)
    assert res.status_code == 200
    assert res.json_body['success'] is True
    assert isinstance(res.json_body['data'], list)

def test_tambah_produk_success(dbsession, produk_data):
    req = DummyRequest(json_body=produk_data)
    req.dbsession = dbsession
    res = tambah_produk(req)
    body = res.json_body
    assert body['success'] is True
    assert body['data']['nama_produk'] == produk_data['nama_produk']

def test_daftar_produk_by_id(dbsession, produk):
    req = DummyRequest(matchdict={'id_produk': produk.id_produk})
    req.dbsession = dbsession
    res = daftar_produk_by_id(req)
    body = res.json_body
    assert body['success'] is True
    assert body['data']['id_produk'] == produk.id_produk

def test_daftar_produk_foto(dbsession, produk, foto_produk):
    req = DummyRequest(matchdict={'id_produk': produk.id_produk})
    req.dbsession = dbsession
    res = daftar_produk_foto(req)
    body = res.json_body
    assert body['success'] is True
    assert any(f['id_produk'] == produk.id_produk for f in body['data'])

def test_hapus_produk(dbsession, produk):
    req = DummyRequest(matchdict={'id_produk': produk.id_produk})
    req.dbsession = dbsession
    res = hapus_produk(req)
    body = res.json_body
    assert body['success'] is True
    # Pastikan produk sudah tidak ada
    assert dbsession.query(Produk).filter_by(id_produk=produk.id_produk).first() is None

def test_hapus_foto_produk(dbsession, foto_produk):
    req = DummyRequest(matchdict={'id_produk': foto_produk.id_produk})
    req.dbsession = dbsession
    res = hapus_foto_produk(req)
    body = res.json_body
    assert body['success'] is True
    # Pastikan foto produk sudah tidak ada
    assert dbsession.query(FotoProduk).filter_by(id_produk=foto_produk.id_produk).first() is None

@pytest.mark.usefixtures("dbsession", "produk")
def test_upload_foto_produk_success(dbsession, produk, dummy_upload_file, tmp_path, monkeypatch):
    # Patch os.getcwd() untuk upload_dir ke tmp_path (folder temp testing)
    monkeypatch.setattr("os.getcwd", lambda: str(tmp_path))

    # Simulasi request POST multipart/form-data
    post_data = {
        'foto_produk': dummy_upload_file
    }
    req = DummyRequest(post=post_data, matchdict={'id_produk': produk.id_produk})
    req.dbsession = dbsession

    res = upload_foto_produk(req)
    body = res.json_body
    assert body['success'] is True
    assert "berhasil" in body['message']

    # Cek file berhasil dibuat di folder temp
    files = list(tmp_path.glob("assets/uploaded_photos/*"))
    assert len(files) == 1
    # Cek database record foto_produk bertambah
    foto_db = dbsession.query(FotoProduk).filter_by(id_produk=produk.id_produk).first()
    assert foto_db is not None

@pytest.mark.usefixtures("dbsession", "produk")
def test_update_foto_produk_success(dbsession, produk, dummy_upload_file, tmp_path, monkeypatch):
    # Setup foto_produk dulu di DB
    foto = FotoProduk(foto_produk="assets/uploaded_photos/oldfile.png", id_produk=produk.id_produk)
    dbsession.add(foto)
    dbsession.flush()

    monkeypatch.setattr("os.getcwd", lambda: str(tmp_path))

    # Buat file lama palsu di tmp_path
    old_file_path = tmp_path / "assets/uploaded_photos/oldfile.png"
    old_file_path.parent.mkdir(parents=True, exist_ok=True)
    old_file_path.write_bytes(b"old dummy data")

    post_data = {
        'foto_produk': dummy_upload_file
    }
    req = DummyRequest(post=post_data, matchdict={'id_produk': produk.id_produk})
    req.dbsession = dbsession

    res = update_foto_produk(req)
    body = res.json_body
    assert body['success'] is True
    assert "berhasil" in body['message']

    # Cek file lama sudah dihapus
    assert not old_file_path.exists()

    # Cek file baru dibuat
    files = list((tmp_path / "assets/uploaded_photos").glob("*"))
    assert any(f.name != "oldfile.png" for f in files)

    # Cek DB record update path
    dbsession.refresh(foto)
    assert foto.foto_produk != "assets/uploaded_photos/oldfile.png"