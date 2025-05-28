import pytest
from unittest.mock import MagicMock
import sys

from backend.scripts import initialize_db as setup_db

def test_parse_args_valid():
    argv = ['progname', 'development.ini']
    args = setup_db.parse_args(argv)
    assert args.config_uri == 'development.ini'

def test_parse_args_missing_arg():
    argv = ['progname']
    with pytest.raises(SystemExit):
        setup_db.parse_args(argv)

def test_setup_models_calls_create_all_and_commit():
    mock_session = MagicMock()
    setup_db.setup_models(mock_session)
   
    mock_session.bind = MagicMock()
  
    setup_db.models.Base.metadata.create_all = MagicMock()
    setup_db.setup_models(mock_session)
    setup_db.models.Base.metadata.create_all.assert_called_once_with(mock_session.bind)
    mock_session.commit.assert_called()

def test_main_runs_success(monkeypatch):
    # Patch bootstrap dan setup_logging supaya tidak jalan beneran
    monkeypatch.setattr(setup_db, 'bootstrap', lambda x: {'request': MagicMock(dbsession=MagicMock(), tm=MagicMock())})
    monkeypatch.setattr(setup_db, 'setup_logging', lambda x: None)

    argv = ['progname', 'config.ini']
    setup_db.main(argv)  # harusnya tidak error

def test_main_operational_error(monkeypatch, capsys):
    # Simulasi OperationalError saat commit
    class DummyTM:
        def __enter__(self):
            return self
        def __exit__(self, exc_type, exc_val, exc_tb):
            return False
        def __iter__(self):
            yield

    def fake_bootstrap(x):
        dummy_request = MagicMock()
        dummy_request.dbsession = MagicMock()
        dummy_request.tm = DummyTM()
        # Commit raise OperationalError
        dummy_request.dbsession.commit.side_effect = setup_db.OperationalError("db error", None, None)
        return {'request': dummy_request}

    monkeypatch.setattr(setup_db, 'bootstrap', fake_bootstrap)
    monkeypatch.setattr(setup_db, 'setup_logging', lambda x: None)

    argv = ['progname', 'config.ini']
    setup_db.main(argv)
    captured = capsys.readouterr()
    assert "Pyramid is having a problem using your SQL database" in captured.out
