from dfs_client import call
US = {'location_code': 2840, 'language_code': 'en'}
doms = ['vidiq.com','socialblade.com','youtubers.me','viewstats.com','tubepilot.ai','nicheprowler.com',
 'youtube-thumbnail-grabber.com','creatordb.app','tubebuddy.com','ytlarge.com','tuberanker.com','thumbmagic.co',
 '1of10.com','thumbnailtest.com','thumblytics.com','outlierkit.com','views4you.com','livecounts.io','playboard.co','speakrj.com']
for d in doms:
    call('dataforseo_labs/google/relevant_pages/live', [{'target': d, **US, 'limit': 100,
         'order_by': ['metrics.organic.etv,desc']}], f'pages_{d}')
seeds = ['thumbnail', 'youtube title', 'youtube video ideas', 'youtube channel ideas', 'youtube outlier',
         'youtube views', 'youtube channel', 'youtube shorts', 'faceless youtube', 'youtube monetization',
         'youtube algorithm', 'youtube subscribers', 'youtube banner', 'youtube tags', 'youtube description',
         'youtube script', 'youtube intro', 'youtube niche']
for s in seeds:
    call('dataforseo_labs/google/keyword_suggestions/live', [{'keyword': s, **US, 'limit': 700,
         'include_seed_keyword': True, 'order_by': ['keyword_info.search_volume,desc']}], 'kw_' + s.replace(' ', '_'))
for d in ['canva.com', 'kapwing.com', 'fotor.com', 'picsart.com', 'adobe.com']:
    call('dataforseo_labs/google/ranked_keywords/live', [{'target': d, **US, 'limit': 300,
         'filters': [['keyword_data.keyword', 'like', '%thumbnail%']],
         'order_by': ['ranked_serp_element.serp_item.etv,desc']}], f'thumbkw_{d}')
