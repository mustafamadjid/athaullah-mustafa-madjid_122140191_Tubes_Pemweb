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

    id_pembeli = Column(Integer, primary_key=True)
    username_pembeli = Column(Text)
    nama_pembeli = Column(Text)
    email_pembeli = Column(Text)
    jenis_kelamin = Column(Text)
    nomor_handphone = Column(Text)
    
    def to_dict(self):
        return {
            'id_pembeli': self.id_pembeli,
            'username_pembeli': self.username_pembeli or 'No username',  # Default if None
            'nama_pembeli': self.nama_pembeli or 'No name',
            'email_pembeli': self.email_pembeli or 'No email',
            'jenis_kelamin': self.jenis_kelamin or 'Unknown',
            'nomor_handphone': self.nomor_handphone or 'No phone number'
            
        }

# Tabel Data Penjual
class Penjual(Base):
    __tablename__ = 'penjual'

    id_penjual = Column(Integer, primary_key=True)
    username_penjual = Column(Text)
    nama_penjual = Column(Text)
    email_penjual = Column(Text)
    jenis_kelamin = Column(Text)
    nomor_handphone = Column(Text)
    
    produk = relationship('Produk', back_populates='penjual')
    
    def to_dict(self):
        return {
            'id_penjual': self.id_penjual,
            'username_penjual': self.username_penjual or 'No username',  # Default if None
            'nama_penjual': self.nama_penjual or 'No name',
            'email_penjual': self.email_penjual or 'No email',
            'jenis_kelamin': self.jenis_kelamin or 'Unknown',
            'nomor_handphone': self.nomor_handphone or 'No phone number'
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
    id_penjual = Column(Integer, ForeignKey('penjual.id_penjual'))

    penjual = relationship('Penjual', back_populates='produk')

    def to_dict(self):
        return {
            'id_produk': self.id_produk,
            'nama_produk': self.nama_produk,
            'kategori_produk': self.kategori_produk,
            'deskripsi_produk': self.deskripsi_produk,
            'merk_produk': self.merk_produk,
            'harga_produk': self.harga_produk,
            'stok_produk': self.stok_produk,
            'id_penjual': self.id_penjual,
        }

# Tabel Data Pesanan
class Pesanan(Base):
    __tablename__ = 'pesanan'

    id_pesanan = Column(Integer, primary_key=True)
    id_produk = Column(Integer, ForeignKey('produk.id_produk'))
    id_pembeli = Column(Integer, ForeignKey('pembeli.id_pembeli'))
    jumlah_pesanan = Column(Integer)
    tanggal_pesanan = Column(Text)
    status_pesanan = Column(Text)

    produk = relationship('Produk')
    pembeli = relationship('Pembeli')

    def to_dict(self):
        return {
            'id_pesanan': self.id_pesanan,
            'id_produk': self.id_produk,
            'id_pembeli': self.id_pembeli,
            'jumlah_pesanan': self.jumlah_pesanan,
            'tanggal_pesanan': self.tanggal_pesanan,
            'status_pesanan': self.status_pesanan,
        }
        
    
# Tabel Data Khusus Foto Produk
class FotoProduk(Base):
    __tablename__ = 'foto_produk'

    id_foto_produk = Column(Integer, primary_key=True)
    id_produk = Column(Integer, ForeignKey('produk.id_produk'))
    foto_produk = Column(Text)

    produk = relationship('Produk')

    def to_dict(self):
        return {
            'id_foto_produk': self.id_foto_produk,
            'id_produk': self.id_produk,
            'foto_produk': self.foto_produk,
        }