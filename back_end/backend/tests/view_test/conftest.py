import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models.meta import Base

@pytest.fixture(scope='function')
def dbsession():
    # Setup in-memory SQLite DB
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    yield session  
    session.close()
    Base.metadata.drop_all(engine)
