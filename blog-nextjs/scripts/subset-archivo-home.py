# Builds src/components/home/archivo-home.woff2, the home page's smaller Archivo (see
# src/components/home/fonts.ts). Run it again when the home page's copy or the fan names need a
# character that is not in the list below.
#
#   uv run --with fonttools --with brotli python scripts/subset-archivo-home.py <archivo-latin.woff2>
#
# The input is Google Fonts' Latin file of Archivo with its weight and width axes (the file
# next/font downloads for components/ai-thumbnails/fonts.ts; after a build it is the large
# .p.woff2 file in .next/static/media). Archivo is under the SIL Open Font License.
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

OUT = 'src/components/home/archivo-home.woff2'
UNICODES = (
    list(range(0x20, 0x7F))  # ASCII
    # The accents the page and the fan names use, and a few common ones.
    + [0xA0, 0xA9, 0xB7, 0xC9, 0xE0, 0xE1, 0xE2, 0xE4, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xED, 0xEE, 0xEF, 0xF1, 0xF3, 0xF4, 0xF6, 0xFA, 0xFB, 0xFC]
    # Dashes, quotes, bullet, ellipsis, arrow.
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2192]
)

font = TTFont(sys.argv[1])
# The page uses weights 400 to 800 and widths 100% to 115%: the rest of each axis goes.
font = instancer.instantiateVariableFont(font, {'wght': (400, 800), 'wdth': (100, 115)})
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
options.name_IDs = ['*']
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=UNICODES)
subsetter.subset(font)
font.flavor = 'woff2'
font.save(OUT)
print('wrote', OUT)
