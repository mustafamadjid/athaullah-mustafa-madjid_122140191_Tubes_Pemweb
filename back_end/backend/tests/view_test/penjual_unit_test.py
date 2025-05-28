import pytest
from pyramid.testing import DummyRequest
from backend.views.penjual import (
    daftar_penjual,
    daftar_penjual_by_id,
    tambah_penjual,
    update_penjual,
    hapus_penjual,
)
from backend.models import Penjual

@pytest.fixture
def penjual_data():
    return {
        'uid_penjual': 'uidpenjual123',
        'username_penjual': 'userpenjual',
        'role': 'seller',
        'nama_penjual': 'Nama Penjual',
        'email_penjual': 'penjual@mail.com',
        'nomor_handphone': '08123456789',
        'gambar_profil': 'url_gambar'
    }

def test_daftar_penjual_empty(dbsession):
    req = DummyRequest()
    req.dbsession = dbsession
    response = daftar_penjual(req)
    assert response.status_code == 200
    assert response.json_body['success'] is True
    assert isinstance(response.json_body['data'], list)
    assert len(response.json_body['data']) == 0

def test_tambah_penjual_success(dbsession, penjual_data):
    req = DummyRequest(json_body=penjual_data)
    req.dbsession = dbsession
    response = tambah_penjual(req)
    body = response.json_body
    assert body['success'] is True
    assert body['data']['uid_penjual'] == penjual_data['uid_penjual']

def test_tambah_penjual_missing_field(dbsession, penjual_data):
    incomplete = penjual_data.copy()
    incomplete.pop('username_penjual')
    req = DummyRequest(json_body=incomplete)
    req.dbsession = dbsession
    response = tambah_penjual(req)
    body = response.json_body
    assert body['success'] is False
    assert "wajib disertakan" in body['message']

def test_daftar_penjual_by_id(dbsession, penjual_data):
    p = Penjual(**penjual_data)
    dbsession.add(p)
    dbsession.flush()

    req = DummyRequest(matchdict={'uid_penjual': penjual_data['uid_penjual']})
    req.dbsession = dbsession
    response = daftar_penjual_by_id(req)
    body = response.json_body
    assert body['success'] is True
    assert body['data']['uid_penjual'] == penjual_data['uid_penjual']

def test_update_penjual(dbsession, penjual_data):
    p = Penjual(**penjual_data)
    dbsession.add(p)
    dbsession.flush()

    update_data = {
        'username_penjual': 'userupdate',
        'nama_penjual': 'Nama Update'
    }
    req = DummyRequest(matchdict={'uid_penjual': penjual_data['uid_penjual']}, json_body=update_data)
    req.dbsession = dbsession
    response = update_penjual(req)
    body = response.json_body
    assert body['success'] is True
    assert body['data']['username_penjual'] == update_data['username_penjual']
    assert body['data']['nama_penjual'] == update_data['nama_penjual']

def test_hapus_penjual(dbsession, penjual_data):
    p = Penjual(**penjual_data)
    dbsession.add(p)
    dbsession.flush()

    req = DummyRequest(matchdict={'uid_penjual': penjual_data['uid_penjual']})
    req.dbsession = dbsession
    response = hapus_penjual(req)
    body = response.json_body
    assert body['success'] is True
    assert "berhasil dihapus" in body['message']

    # Pastikan data sudah terhapus
    req2 = DummyRequest(matchdict={'uid_penjual': penjual_data['uid_penjual']})
    req2.dbsession = dbsession
    resp2 = daftar_penjual_by_id(req2)
    assert resp2.json_body['success'] is False
