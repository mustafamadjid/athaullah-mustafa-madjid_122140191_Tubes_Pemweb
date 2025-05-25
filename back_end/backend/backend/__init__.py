from pyramid.config import Configurator
from .middleware import cors_tween_factory


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        config.scan()
        config.add_tween('.cors_tween_factory')  
    return config.make_wsgi_app()

    