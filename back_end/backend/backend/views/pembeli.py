import datetime
from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Pembeli

import logging

logger = logging.getLogger(__name__)

@view_config(route_name='pembeli', renderer='json')
def daftar_pembeli(request):
    dbsession = request.dbsession
    pembeli = dbsession.query(Pembeli).all()
    return {'pembeli': [m.to_dict() for m in pembeli]}