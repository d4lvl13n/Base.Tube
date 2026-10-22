from dfs_client import call
US = {'location_code': 2840, 'language_code': 'en'}
kws = ['gta 6 thumbnail','gta vi thumbnail','gta thumbnail','gta 5 thumbnail','gta v thumbnail','gta rp thumbnail','gta thumbnail background',
 'zelda thumbnail','ocarina of time thumbnail','zelda ocarina of time remake','ocarina of time remake','legend of zelda thumbnail',
 'modern warfare 4 thumbnail','mw4 thumbnail','modern warfare 4','mw4','black ops 7 thumbnail','cod thumbnail','gta 6','gta 6 release date']
call('keywords_data/google_ads/search_volume/live', [{'keywords': kws, **US}], 'vol_new_games')
