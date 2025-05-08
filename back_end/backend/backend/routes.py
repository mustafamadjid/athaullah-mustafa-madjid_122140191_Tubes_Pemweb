def includeme(config):
                """Add routes to the config."""
                config.add_static_view('static', 'static', cache_max_age=3600)
                
                # Default route
                config.add_route('home', '/')
                
                # Mahasiswa routes dengan request_method untuk membedakan endpoint dengan URL yang sama
                config.add_route('pembeli', '/tokoijoapi/pembeli', request_method='GET')
                