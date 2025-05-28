import pytest
from pyramid.testing import DummyRequest
from backend.views.pesanan import (
    daftar_pesanan,
    daftar_pesanan_by_id,
    tambah_pesanan,
    hapus_pesanan,
)
from backend.models import Pesanan

@pytest.fixture
def pesanan_data():
    return {
        'uid_pembeli': 'uid123',
        'jumlah_pesanan': 3,
        'metode_pembayaran': 'Transfer',
        'alamat': 'Jl. Contoh No 1',
        'kode_pos': '12345',
        'kota': 'Kota A',
        'nomor_handphone': '08123456789',
        'tanggal_pesanan': '2025-05-28',
        'status_pesanan': 'Pending'
    }

def test_daftar_pesanan_empty(dbsession):
    req = DummyRequest()
    req.dbsession = dbsession
    response = daftar_pesanan(req)
    assert response.status_code == 200
    assert response.json_body['success'] is True
    assert isinstance(response.json_body['data'], list)
    assert len(response.json_body['data']) == 0

def test_tambah_pesanan_success(dbsession, pesanan_data):
    req = DummyRequest(json_body=pesanan_data)
    req.dbsession = dbsession
    response = tambah_pesanan(req)
    body = response.json_body
    assert body['success'] is True
    assert body['data']['uid_pembeli'] == pesanan_data['uid_pembeli']

def test_tambah_pesanan_missing_field(dbsession, pesanan_data):
    incomplete = pesanan_data.copy()
    incomplete.pop('alamat')
    req = DummyRequest(json_body=incomplete)
    req.dbsession = dbsession
    response = tambah_pesanan(req)
    body = response.json_body
    assert body['success'] is False
    assert "wajib disertakan" in body['message']

def test_daftar_pesanan_by_id(dbsession, pesanan_data):
    p = Pesanan(**pesanan_data)
    dbsession.add(p)
    dbsession.flush()

    req = DummyRequest(matchdict={'uid_pembeli': pesanan_data['uid_pembeli']})
    req.dbsession = dbsession
    response = daftar_pesanan_by_id(req)
    body = response.json_body
    assert body['success'] is True
    assert all(item['uid_pembeli'] == pesanan_data['uid_pembeli'] for item in body['data'])

def test_hapus_pesanan(dbsession, pesanan_data):
    p = Pesanan(**pesanan_data)
    dbsession.add(p)
    dbsession.flush()

    req = DummyRequest(matchdict={'id_pesanan': p.id_pesanan})
    req.dbsession = dbsession
    response = hapus_pesanan(req)
    body = response.json_body
    assert body['success'] is True
    assert "berhasil dihapus" in body['message']

    # Pastikan data sudah terhapus
    req2 = DummyRequest(matchdict={'uid_pembeli': pesanan_data['uid_pembeli']})
    req2.dbsession = dbsession
    resp2 = daftar_pesanan_by_id(req2)
    # Jika sudah dihapus, data pesanan list kemungkinan kosong
    assert all(item['uid_pembeli'] != pesanan_data['uid_pembeli'] for item in resp2.json_body['data']) or len(resp2.json_body['data']) == 0
