from dfs_client import call
US = {'location_code': 2840, 'language_code': 'en', 'depth': 10}
qs = ['fortnite thumbnail','roblox thumbnail','minecraft thumbnail','mrbeast thumbnail','chess thumbnail','youtube thumbnail meme',
 'funny youtube thumbnail','clickbait thumbnail','podcast thumbnail','youtube thumbnail background','youtube thumbnail font',
 'youtube thumbnail template','youtube thumbnail ideas','youtube thumbnail examples','gaming thumbnail','valorant thumbnail',
 'gorilla tag thumbnail','nba thumbnail','youtube thumbnail reaction images','youtube thumbnail arrows','minecraft thumbnail background',
 'fortnite thumbnail background','youtube thumbnail tester','youtube title generator','youtube video ideas','youtube thumbnail size',
 'how to change thumbnail on youtube shorts','faceless youtube channels','youtube monetization checker','youtube tags generator',
 'how to see who subscribed to your youtube channel','best youtube thumbnail','ai thumbnail generator','youtube thumbnail maker']
for q in qs:
    call('serp/google/organic/live/regular', [{'keyword': q, **US}], 'serp_' + q.replace(' ', '_'))
