def includeme(config):
                """Add routes to the config."""
                config.add_static_view('static', 'static', cache_max_age=3600)
                
                # Default route
                config.add_route('home', '/')
                
                # Routes Pembeli
                config.add_route('pembeli', '/pembeli', request_method='GET')
                config.add_route('tambah_pembeli', '/pembeli', request_method='POST')
                config.add_route('update_pembeli', '/pembeli/{uid_pembeli}', request_method='PUT')
                config.add_route('hapus_pembeli', '/pembeli/{uid_pembeli}', request_method='DELETE')
                config.add_route('pembeli_by_id', '/pembeli/profil/{uid_pembeli}', request_method='GET')
                
                
                # Routes Penjual
                config.add_route('penjual','/penjual', request_method='GET')
                config.add_route('tambah_penjual', '/penjual', request_method='POST')
                config.add_route('update_penjual', '/penjual/{uid_penjual}', request_method='PUT')
                config.add_route('hapus_penjual', '/penjual/{uid_penjual}', request_method='DELETE')
                config.add_route('penjual_by_id', '/penjual/profil/{uid_penjual}', request_method='GET')
                
                
                # Routes Produk
                config.add_route('produk', '/produk', request_method='GET')
                config.add_route('tambah_produk', '/produk', request_method='POST')
                config.add_route('update_produk', '/produk/{id_produk}', request_method='PUT')  
                config.add_route('hapus_produk', '/produk/{id_produk}', request_method='DELETE')
                config.add_route('produk_by_penjual', '/produk/penjual/{uid_penjual}', request_method='GET')
                config.add_route('produk_by_kategori', '/produk/kategori/{kategori_produk}', request_method='GET')
                config.add_route('view_foto_produk', '/produk/{id_produk}/foto', request_method='GET')
                config.add_route('produk_by_id', '/produk/{id_produk}', request_method='GET')
                
                # Routes khusus untuk foto produk
                config.add_route('produk_foto','/produk/{id_produk}/foto', request_method='GET')
                config.add_route('upload_foto_produk', '/produk/{id_produk}/foto', request_method='POST')
                config.add_route('update_foto_produk', '/produk/foto/modify/{id_produk}', request_method='POST')
                config.add_route('hapus_foto_produk', '/produk/foto/{id_produk}', request_method='DELETE') 
                
                
                # Routes Pesanan
                config.add_route('pesanan', '/pesanan', request_method='GET')
                config.add_route('tambah_pesanan', '/pesanan', request_method='POST')
                config.add_route('hapus_pesanan', '/pesanan/{id_pesanan}', request_method='DELETE')
                config.add_route('pesanan_by_id', '/pesanan/pembeli/{uid_pembeli}', request_method='GET')