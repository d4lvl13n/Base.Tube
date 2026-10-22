from dfs_client import call
US = {'location_code': 2840, 'language_code': 'en'}
cands = ['vidiq.com','tubebuddy.com','1of10.com','viewstats.com','pikzels.com','thumbnailtest.com','thumbnail.ai',
 'thumio.com','ytlarge.com','youtubers.me','socialblade.com','tubepilot.ai','nicheprowler.com','outlierkit.com',
 'thumbmagic.co','speakrj.com','creatordb.app','hypeauditor.com','playboard.co','noxinfluencer.com','notegpt.io',
 'tunepocket.com','minitool.com','views4you.com','instrack.app','screenapp.io','pippit.ai','thumbnailsave.com',
 'youtube-thumbnail-grabber.com','thumbnail-download.com','tubics.com','spotter.com','vidiq.ai','creatorhooks.com',
 'thumbnailcreator.com','miniatura.ai','thumbly.ai','tagsyoutube.com','rapidtags.io','tuberanker.com','ytstudio.ai',
 'clickworthy.ai','thumblytics.com','socialblade.com','subscribercounter.com','livecounts.io','mixerno.space','canva.com','kapwing.com','fotor.com','picsart.com','adobe.com']
call('dataforseo_labs/google/bulk_traffic_estimation/live', [{'targets': sorted(set(cands)), **US, 'item_types': ['organic']}], 'bulk_traffic')
