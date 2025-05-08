from sqlalchemy import (
    Column,
    Integer,
    Text,
    Date,
)


from .meta import Base

class Pembeli(Base):
    __tablename__ = 'pembeli'

    id_pembeli = Column(Integer, primary_key=True)
    username_pembeli = Column(Text)
    email_pembeli = Column(Text)
    password_pembeli = Column(Text)
    jenis_kelamin = Column(Text)
    
    def to_dict(self):
        return {
            'id_pembeli': self.id_pembeli,
            'username_pembeli': self.username_pembeli or 'No username',  # Default if None
            'email_pembeli': self.email_pembeli or 'No email',
            'password_pembeli': self.password_pembeli or 'No password',
            'jenis_kelamin': self.jenis_kelamin or 'Unknown'
        }


class Penjual(Base):
    __tablename__ = 'penjual'

    id_penjual = Column(Integer, primary_key=True)
    username_penjual = Column(Text)
    email_penjual = Column(Text)
    password_penjual = Column(Text)
    jenis_kelamin = Column(Text)
    
    def to_dict(self):
        return {
            'id_penjual': self.id_penjual,
            'username_penjual': self.username_penjual or 'No username',  # Default if None
            'email_penjual': self.email_penjual or 'No email',
            'password_penjual': self.password_penjual or 'No password',
            'jenis_kelamin': self.jenis_kelamin or 'Unknown'
        }


    