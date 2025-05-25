def cors_tween_factory(handler, registry):
    def cors_tween(request):
        if request.method == 'OPTIONS':
            response = request.response
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Max-Age'] = '3600'
            return response

        response = handler(request)

        if 'Content-Type' not in response.headers:
            response.headers['Content-Type'] = 'multipart/form-data'

        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    return cors_tween
