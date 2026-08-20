# Journey imagery — sources & licensing

Every photograph in this folder is **CC0 1.0 / public domain**, discovered via the
[Openverse API](https://api.openverse.org) with `license=cc0`. CC0 waives copyright
worldwide, so no attribution is legally required and commercial use is permitted.
The credits below are kept as a courtesy and as a provenance record.

Each file was downloaded from its source, resized and re-encoded (mozjpeg, q74) for web use.

| File | Subject | Source | Licence |
|---|---|---|---|
| `gates-path.jpg` | Torii gate path, Fushimi Inari | Wikimedia Commons — *20181110 Fushimi Inari Torii 11* | CC0 1.0 |
| `gates-sky.jpg` | Torii gate against sky, Fushimi Inari | Wikimedia Commons — *20181110 Fushimi Inari Torii 1* | CC0 1.0 |
| `canal-dusk.jpg` | Shirakawa canal at dusk, Gion, Kyoto | Openverse (pd.w.org) | CC0 1.0 |
| `arcade-walk.jpg` | Teramachi shopping arcade, Kyoto | Wikimedia Commons — *Teramachi Street shopping area 1* | CC0 1.0 |
| `fuji-lake.jpg` | Mount Fuji from Lake Ashi | Wikimedia Commons — *View of Mount Fuji from Lake Ashi* | CC0 1.0 |
| `bamboo-hush.jpg` | Arashiyama bamboo grove, Kyoto | rawpixel (via Openverse) | CC0 1.0 |
| `ryokan-night.jpg` | Ginzan Onsen at night, Yamagata | Wikimedia Commons — *Ginzan Onsen Noto-ya Ryokan* | CC0 1.0 |
| `tokyo-lights.jpg` | Tokyo skyline at night | rawpixel (via Openverse) | CC0 1.0 |

## How images are used

Photos are mapped to captions in the `galleryFrames` and `stays` tables at the top of
`app/page.tsx`. Each entry carries a `src`, a duotone class (`tone`), an
`objectPosition` crop and a `--zoom` level. To swap a photo, drop a new file here and
change the `src` — the grading and cropping are handled by the `.tone` system in
`app/globals.css`.
