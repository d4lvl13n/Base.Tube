from dfs_client import call
US = {'location_code': 2840, 'language_code': 'en'}
for d in ['thumbs.ai', 'visualkit.app', 'launchlens.tech', 'thumbnailstudioo.com', 'thumblr.io', 'magnific.com']:
    call('dataforseo_labs/google/relevant_pages/live', [{'target': d, **US, 'limit': 60,
         'order_by': ['metrics.organic.etv,desc']}], f'pages2_{d}')
