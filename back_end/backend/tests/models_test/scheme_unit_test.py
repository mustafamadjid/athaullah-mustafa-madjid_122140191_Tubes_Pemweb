# Import Schema
from backend.models.scheme_tokoijo import Produk,FotoProduk,Penjual,Pembeli,Pesanan

# Import Pytest
import pytest

import pytest

# Contoh data dummy untuk tiap model

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

@pytest.fixture
def penjual_data():
    return {
        'uid_penjual': 'uid456',
        'username_penjual': 'userpenjual',
        'role': 'seller',
        'nama_penjual': 'Nama Penjual',
        'email_penjual': 'penjual@mail.com',
        'nomor_handphone': '08987654321',
        'gambar_profil': 'url_gambar'
    }

@pytest.fixture
def produk_data(penjual_data):
    return {
        'id_produk': 1,
        'nama_produk': 'Produk A',
        'kategori_produk': 'Kategori A',
        'deskripsi_produk': 'Deskripsi produk A',
        'merk_produk': 'Merk A',
        'harga_produk': 150000,
        'stok_produk': 10,
        'uid_penjual': penjual_data['uid_penjual']
    }

@pytest.fixture
def pesanan_data(pembeli_data, produk_data):
    return {
        'id_pesanan': 1,
        'id_produk': produk_data['id_produk'],
        'uid_pembeli': pembeli_data['uid_pembeli'],
        'metode_pembayaran': 'Transfer',
        'alamat': 'Jl. Contoh No.1',
        'kode_pos': '12345',
        'kota': 'Kota A',
        'nomor_handphone': '08123456789',
        'jumlah_pesanan': 2,
        'tanggal_pesanan': '2025-05-28',
        'status_pesanan': 'Dikirim'
    }

@pytest.fixture
def foto_produk_data(produk_data):
    return {
        'id_foto_produk': 1,
        'id_produk': produk_data['id_produk'],
        'foto_produk': 'url_foto_produk'
    }


def test_pembeli_to_dict(pembeli_data):
    p = Pembeli(**pembeli_data)
    d = p.to_dict()
    assert d['uid_pembeli'] == pembeli_data['uid_pembeli']
    assert d['username_pembeli'] == pembeli_data['username_pembeli']
    assert d['role'] == pembeli_data['role']
    assert d['nama_pembeli'] == pembeli_data['nama_pembeli']
    assert d['email_pembeli'] == pembeli_data['email_pembeli']
    assert d['nomor_handphone'] == pembeli_data['nomor_handphone']
    assert d['gambar_profil'] == pembeli_data['gambar_profil']

def test_penjual_to_dict(penjual_data):
    p = Penjual(**penjual_data)
    d = p.to_dict()
    assert d['uid_penjual'] == penjual_data['uid_penjual']
    assert d['username_penjual'] == penjual_data['username_penjual']
    assert d['role'] == penjual_data['role']
    assert d['nama_penjual'] == penjual_data['nama_penjual']
    assert d['email_penjual'] == penjual_data['email_penjual']
    assert d['nomor_handphone'] == penjual_data['nomor_handphone']
    assert d['gambar_profil'] == penjual_data['gambar_profil']

def test_produk_to_dict(produk_data):
    p = Produk(**produk_data)
    d = p.to_dict()
    assert d['id_produk'] == produk_data['id_produk']
    assert d['nama_produk'] == produk_data['nama_produk']
    assert d['kategori_produk'] == produk_data['kategori_produk']
    assert d['deskripsi_produk'] == produk_data['deskripsi_produk']
    assert d['merk_produk'] == produk_data['merk_produk']
    assert d['harga_produk'] == float(produk_data['harga_produk'])
    assert d['stok_produk'] == produk_data['stok_produk']
    assert d['uid_penjual'] == produk_data['uid_penjual']

def test_pesanan_to_dict(pesanan_data):
    p = Pesanan(**pesanan_data)
    d = p.to_dict()
    assert d['id_pesanan'] == pesanan_data['id_pesanan']
    assert d['id_produk'] == pesanan_data['id_produk']
    assert d['uid_pembeli'] == pesanan_data['uid_pembeli']
    assert d['metode_pembayaran'] == pesanan_data['metode_pembayaran']
    assert d['alamat'] == pesanan_data['alamat']
    assert d['kode_pos'] == pesanan_data['kode_pos']
    assert d['kota'] == pesanan_data['kota']
    assert d['nomor_handphone'] == pesanan_data['nomor_handphone']
    assert d['jumlah_pesanan'] == pesanan_data['jumlah_pesanan']
    assert d['tanggal_pesanan'] == pesanan_data['tanggal_pesanan']
    assert d['status_pesanan'] == pesanan_data['status_pesanan']

def test_foto_produk_to_dict(foto_produk_data):
    f = FotoProduk(**foto_produk_data)
    d = f.to_dict()
    assert d['id_foto_produk'] == foto_produk_data['id_foto_produk']
    assert d['id_produk'] == foto_produk_data['id_produk']
    assert d['foto_produk'] == foto_produk_data['foto_produk']
