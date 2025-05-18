def includeme(config):
                """Add routes to the config."""
                config.add_static_view('static', 'static', cache_max_age=3600)
                
                # Default route
                config.add_route('home', '/')
                
                # Routes Pembeli
                config.add_route('pembeli', '/pembeli', request_method='GET')
                config.add_route('tambah_pembeli', '/pembeli', request_method='POST')
                config.add_route('update_pembeli', '/pembeli/{id_pembeli}', request_method='PUT')
                config.add_route('hapus_pembeli', '/pembeli/{id_pembeli}', request_method='DELETE')
                
                
                # Routes Penjual
                config.add_route('penjual','/penjual', request_method='GET')
                config.add_route('tambah_penjual', '/penjual', request_method='POST')
                config.add_route('update_penjual', '/penjual/{id_penjual}', request_method='PUT')
                config.add_route('hapus_penjual', '/penjual/{id_penjual}', request_method='DELETE')
                
                # Routes Produk
                config.add_route('produk', '/produk', request_method='GET')
                config.add_route('tambah_produk', '/produk', request_method='POST')
                config.add_route('update_produk', '/produk/{id_produk}', request_method='PUT')
                config.add_route('hapus_produk', '/produk/{id_produk}', request_method='DELETE')
                
                # Routes khusus untuk foto produk