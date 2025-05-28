import pytest
from pyramid.testing import DummyRequest
from backend.views.pembeli import (
    daftar_pembeli,
    daftar_pembeli_by_id,
    tambah_pembeli,
    update_pembeli,
    hapus_pembeli,
)
from backend.models import Pembeli

@pytest.fixture
def pembeli_data():
    return {
        'uid_pembeli': 'uid123',
        'username_pembeli': 'userpembeli',
        'role': 'buyer',
        'nama_pembeli': 'Nama Pembeli',
        'email_pembeli': 'pembeli@mail.com',
        'nomor_handphone': '08123456789',
        'gambar_profil': 'url_gambar'
    }

def test_daftar_pembeli_empty(dbsession):
    req = DummyRequest()
    req.dbsession = dbsession
    response = daftar_pembeli(req)
    assert response.status_code == 200
    assert response.json_body['success'] is True
    assert isinstance(response.json_body['data'], list)
    assert len(response.json_body['data']) == 0

def test_tambah_pembeli_success(dbsession, pembeli_data):
    req = DummyRequest(json_body=pembeli_data)
    req.dbsession = dbsession
    response = tambah_pembeli(req)
    body = response.json_body
    assert body['success'] is True
    assert body['data']['uid_pembeli'] == pembeli_data['uid_pembeli']

def test_tambah_pembeli_missing_field(dbsession, pembeli_data):
    incomplete = pembeli_data.copy()
    incomplete.pop('username_pembeli')
    req = DummyRequest(json_body=incomplete)
    req.dbsession = dbsession
    response = tambah_pembeli(req)
    body = response.json_body
    assert body['success'] is False
    assert "wajib disertakan" in body['message']

def test_daftar_pembeli_by_id(dbsession, pembeli_data):
    # Tambah dulu data pembeli ke dbsession langsung
    p = Pembeli(**pembeli_data)
    dbsession.add(p)
    dbsession.flush()

    req = DummyRequest(matchdict={'uid_pembeli': pembeli_data['uid_pembeli']})
    req.dbsession = dbsession
    response = daftar_pembeli_by_id(req)
    body = response.json_body
    assert body['success'] is True
    assert body['data']['uid_pembeli'] == pembeli_data['uid_pembeli']

def test_update_pembeli(dbsession, pembeli_data):
    p = Pembeli(**pembeli_data)
    dbsession.add(p)
    dbsession.flush()

    update_data = {
        'username_pembeli': 'user_update',
        'nama_pembeli': 'Nama Update'
    }
    req = DummyRequest(matchdict={'uid_pembeli': pembeli_data['uid_pembeli']}, json_body=update_data)
    req.dbsession = dbsession
    response = update_pembeli(req)
    body = response.json_body
    assert body['success'] is True
    assert body['data']['username_pembeli'] == update_data['username_pembeli']
    assert body['data']['nama_pembeli'] == update_data['nama_pembeli']

def test_hapus_pembeli(dbsession, pembeli_data):
    p = Pembeli(**pembeli_data)
    dbsession.add(p)
    dbsession.flush()

    req = DummyRequest(matchdict={'uid_pembeli': pembeli_data['uid_pembeli']})
    req.dbsession = dbsession
    response = hapus_pembeli(req)
    body = response.json_body
    assert body['success'] is True
    assert "berhasil dihapus" in body['message']

    # Pastikan data sudah terhapus
    req2 = DummyRequest(matchdict={'uid_pembeli': pembeli_data['uid_pembeli']})
    req2.dbsession = dbsession
    resp2 = daftar_pembeli_by_id(req2)
    assert resp2.json_body['success'] is False
