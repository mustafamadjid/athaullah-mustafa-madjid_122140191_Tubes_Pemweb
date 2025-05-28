from sqlalchemy import (
    Column,
    Integer,
    Text,
    Date,
    ForeignKey,
    Numeric
)
from sqlalchemy.orm import relationship
from .meta import Base

# Tabel Data Pembeli
class Pembeli(Base):
    __tablename__ = 'pembeli'
    uid_pembeli = Column(Text, primary_key=True)
    username_pembeli = Column(Text)
    role = Column(Text)
    nama_pembeli = Column(Text)
    email_pembeli = Column(Text)
    nomor_handphone = Column(Text)
    gambar_profil = Column(Text)
    
    # Relasi ke pesanan (optional)
    pesanan = relationship('Pesanan', back_populates='pembeli',cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'uid_pembeli': self.uid_pembeli,
            'username_pembeli': self.username_pembeli or 'No username',
            'nama_pembeli': self.nama_pembeli or 'No name',
            'role': self.role or 'No role',
            'email_pembeli': self.email_pembeli or 'No email',
            'nomor_handphone': self.nomor_handphone or 'No phone number',
            'gambar_profil': self.gambar_profil
        }

# Tabel Data Penjual
class Penjual(Base):
    __tablename__ = 'penjual'
    uid_penjual = Column(Text, primary_key=True)
    username_penjual = Column(Text)
    nama_penjual = Column(Text)
    role = Column(Text)
    email_penjual = Column(Text)
    nomor_handphone = Column(Text)
    gambar_profil = Column(Text)
    
    # Relasi ke produk
    produk = relationship('Produk', back_populates='penjual',cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'uid_penjual': self.uid_penjual,
            'username_penjual': self.username_penjual or 'No username',
            'nama_penjual': self.nama_penjual or 'No name',
            'role': self.role or 'No role',
            'email_penjual': self.email_penjual or 'No email',
            'nomor_handphone': self.nomor_handphone or 'No phone number',
            'gambar_profil': self.gambar_profil
        }

# Tabel Data Produk
class Produk(Base): 
    __tablename__ = 'produk'
    id_produk = Column(Integer, primary_key=True)
    nama_produk = Column(Text)
    kategori_produk = Column(Text)
    deskripsi_produk = Column(Text)
    merk_produk = Column(Text)
    harga_produk = Column(Numeric)
    stok_produk = Column(Integer)
    uid_penjual = Column(Text, ForeignKey('penjual.uid_penjual',ondelete='CASCADE'))  

    penjual = relationship('Penjual', back_populates='produk')
    foto = relationship('FotoProduk', back_populates='produk',cascade='all, delete-orphan')
    pesanan = relationship('Pesanan', back_populates='produk')

    def to_dict(self):
        return {
            'id_produk': self.id_produk,
            'nama_produk': self.nama_produk,
            'kategori_produk': self.kategori_produk,
            'deskripsi_produk': self.deskripsi_produk,
            'merk_produk': self.merk_produk,
            'harga_produk': float(self.harga_produk) if self.harga_produk is not None else self.harga_produk,
            'stok_produk': int(self.stok_produk) if self.stok_produk is not None else self.stok_produk,
            'uid_penjual': self.uid_penjual,
        }

# Tabel Data Pesanan
class Pesanan(Base):
    __tablename__ = 'pesanan'
    id_pesanan = Column(Integer, primary_key=True)
    id_produk = Column(Integer, ForeignKey('produk.id_produk',ondelete='CASCADE'))
    uid_pembeli = Column(Text, ForeignKey('pembeli.uid_pembeli',ondelete='CASCADE')) 
    metode_pembayaran = Column(Text)
    alamat = Column(Text)
    kode_pos = Column(Text)
    kota = Column(Text)
    nomor_handphone = Column(Text)
    jumlah_pesanan = Column(Integer)
    tanggal_pesanan = Column(Text)
    status_pesanan = Column(Text)

    produk = relationship('Produk', back_populates='pesanan')
    pembeli = relationship('Pembeli', back_populates='pesanan')

    def to_dict(self):
        return {
            'id_pesanan': self.id_pesanan,
            'id_produk': self.id_produk,
            'uid_pembeli': self.uid_pembeli,
            'metode_pembayaran': self.metode_pembayaran,
            'alamat': self.alamat,
            'kode_pos': self.kode_pos,
            'kota': self.kota,
            'nomor_handphone': self.nomor_handphone,
            'jumlah_pesanan': self.jumlah_pesanan,
            'tanggal_pesanan': self.tanggal_pesanan,
            'status_pesanan': self.status_pesanan,
        }

# Tabel Data Khusus Foto Produk
class FotoProduk(Base):
    __tablename__ = 'foto_produk'
    id_foto_produk = Column(Integer, primary_key=True)
    id_produk = Column(Integer, ForeignKey('produk.id_produk',ondelete='CASCADE'))
    foto_produk = Column(Text)

    produk = relationship('Produk', back_populates='foto')

    def to_dict(self):
        return {
            'id_foto_produk': self.id_foto_produk,
            'id_produk': self.id_produk,
            'foto_produk': self.foto_produk,
        }
