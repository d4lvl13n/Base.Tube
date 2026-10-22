from dfs_client import call
US = {'location_code': 2840, 'language_code': 'en'}
for d in ['kabo.sh', 'base.tube']:
    call('dataforseo_labs/google/domain_rank_overview/live', [{'target': d, **US}], f'overview_{d}')
    call('dataforseo_labs/google/historical_rank_overview/live', [{'target': d, **US}], f'history_{d}')
    call('dataforseo_labs/google/ranked_keywords/live', [{'target': d, **US, 'limit': 1000,
         'order_by': ['ranked_serp_element.serp_item.etv,desc']}], f'ranked_{d}')
call('dataforseo_labs/google/competitors_domain/live', [{'target': 'kabo.sh', **US, 'limit': 50}], 'competitors_kabo.sh')
# kabo worldwide view (no location) is not supported by Labs; also check UK/IN where YouTube creators are many
for code, name in [(2826, 'uk'), (2356, 'in')]:
    call('dataforseo_labs/google/domain_rank_overview/live', [{'target': 'kabo.sh', 'location_code': code, 'language_code': 'en'}], f'overview_kabo.sh_{name}')
