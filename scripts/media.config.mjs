// Source → web asset mapping. Sources are the untouched WordPress originals in
// recovery/wp-originals (media/<id>.<ext>, "<id>o" = unscaled original) or, with the
// "prev:" prefix, client-supplied files from the previous build (recovery/previous-build-images).
// kind: render | photo | construction-photo | interior (interior = interior rendering)

export const images = {
  // Schechter Gefen — Jabotinsky 103, Ramat Gan (WP post 591)
  'gefen-facade': {src: 'media/942.jpg', kind: 'render'},
  'gefen-northeast': {src: 'media/684.jpg', kind: 'render'},
  'gefen-street': {src: 'media/685.jpg', kind: 'render'},
  'gefen-living': {src: 'media/676.jpg', kind: 'interior'},
  'gefen-duplex-1': {src: 'media/682.jpg', kind: 'interior'},
  'gefen-duplex-2': {src: 'media/681.jpg', kind: 'interior'},
  'gefen-duplex-3': {src: 'media/680.jpg', kind: 'interior'},
  'gefen-duplex-4': {src: 'media/679.jpg', kind: 'interior'},
  'gefen-duplex-5': {src: 'media/683.jpg', kind: 'interior'},
  'gefen-typical-a': {src: 'media/678.jpg', kind: 'interior'},
  'gefen-typical-b': {src: 'media/677.jpg', kind: 'interior'},

  // Schechter Family — HaSar Moshe 23, Ramat Gan (WP post 349)
  'family-day': {src: 'media/957.jpg', kind: 'render'},
  'family-night': {src: 'media/958.jpg', kind: 'render'},
  'family-site-1': {src: 'media/710.jpg', kind: 'photo'},
  'family-site-2': {src: 'media/711.jpg', kind: 'photo'},
  'family-street': {src: 'media/713.jpg', kind: 'render'},
  'family-aerial': {src: 'media/712.jpg', kind: 'render'},
  'family-courtyard': {src: 'media/714.jpg', kind: 'render'},
  'family-kitchen': {src: 'media/715.jpg', kind: 'interior'},
  'family-balcony-1': {src: 'media/716.jpg', kind: 'interior'},
  'family-balcony-2': {src: 'media/717.jpg', kind: 'interior'},
  'family-living-1': {src: 'media/708.jpg', kind: 'interior'},
  'family-living-2': {src: 'media/709.jpg', kind: 'interior'},

  // Gordon 33, Givatayim (WP post 599)
  'gordon-facade': {src: 'media/931.jpg', kind: 'render'},
  'gordon-penthouse': {src: 'media/935o.jpg', kind: 'render'},
  'gordon-lobby': {src: 'media/932.jpg', kind: 'interior'},
  'gordon-view': {src: 'media/933.jpg', kind: 'render'},

  // Schechter Abigail — Abigail 20, Ramat Gan (WP post 596)
  'abigail-night': {src: 'media/937.jpg', kind: 'render'},
  'abigail-day': {src: 'media/939.jpg', kind: 'render'},
  'abigail-living-wide': {src: 'media/688o.jpg', kind: 'interior'},
  'abigail-living': {src: 'media/940.jpg', kind: 'interior'},
  'abigail-interior-1': {src: 'media/691.jpg', kind: 'interior'},
  'abigail-interior-2': {src: 'media/690.jpg', kind: 'interior'},
  'abigail-interior-3': {src: 'media/689.jpg', kind: 'interior'},

  // Schechter Knafei Nesharim — Knafei Nesharim 27, Ramat Gan (WP post 345)
  'knafei-facade': {src: 'media/968o.jpg', kind: 'render'},
  'knafei-garden': {src: 'media/673o.jpg', kind: 'render'},
  'knafei-site': {src: 'media/534.jpg', kind: 'photo'},
  'knafei-living': {src: 'media/535.jpg', kind: 'interior'},
  'knafei-balcony': {src: 'media/536.jpg', kind: 'interior'},

  // Schechter Galil Yam — HaRav Kook 105, Herzliya (WP post 347)
  'galil-yam-facade': {src: 'media/960.jpg', kind: 'render'},
  'galil-yam-garden': {src: 'media/962.jpg', kind: 'render'},
  'galil-yam-garden-people': {src: 'media/963.jpg', kind: 'render'},
  'galil-yam-evening': {src: 'media/961.jpg', kind: 'render'},
  'galil-yam-terraces': {src: 'media/964.jpg', kind: 'render'},
  'galil-yam-courtyard': {src: 'media/965.jpg', kind: 'render'},
  'galil-yam-site-1': {src: 'prev:galil-yam-site-1.webp', kind: 'photo'},
  'galil-yam-site-2': {src: 'prev:galil-yam-site-2.webp', kind: 'photo'},

  // Schechter Premium — Tera'ad 10, Ramat Gan (WP post 581)
  'premium-facade': {src: 'media/697o.jpg', kind: 'render'},
  'premium-garden': {src: 'media/947o.jpg', kind: 'render'},
  'premium-penthouse': {src: 'media/946.jpg', kind: 'interior'},
  // The local archive also contains a sharper 1600px copy of this interior.
  'premium-typical': {src: 'media/953.jpg', kind: 'interior'},
  'premium-evening': {src: 'media/955.jpg', kind: 'render'},
  'premium-lobby': {src: 'media/951.jpg', kind: 'interior'},
  'premium-street': {src: 'media/949.jpg', kind: 'render'},
  'premium-aerial-1': {src: 'media/950.jpg', kind: 'render'},
  'premium-aerial-2': {src: 'media/954.jpg', kind: 'render'},
  'premium-site': {src: 'media/948.jpg', kind: 'construction-photo'},

  // Schechter HaHayil — HaHayil 6, Ramat Gan (WP post 584)
  'hahayil-facade': {src: 'media/665.jpg', kind: 'render'},
  'hahayil-street': {src: 'media/667.jpg', kind: 'render'},
  'hahayil-living-1': {src: 'media/668.jpg', kind: 'interior'},
  'hahayil-living-2': {src: 'media/669.jpg', kind: 'interior'},
  'hahayil-site': {src: 'media/670.png', kind: 'construction-photo'},

  // Nofei HaGiva — Natan Alterman 18, Rehovot (WP post 588)
  'hagiva-tower': {src: 'media/720.jpg', kind: 'render'},
  'hagiva-aerial': {src: 'media/723.jpg', kind: 'render'},
  'hagiva-salon': {src: 'media/722o.jpg', kind: 'interior'},
  'hagiva-living': {src: 'media/725.jpg', kind: 'interior'},
  'hagiva-penthouse': {src: 'media/721.jpg', kind: 'interior'},
  'hagiva-site-1': {src: 'media/726.jpg', kind: 'photo'},
  'hagiva-site-2': {src: 'media/727.jpg', kind: 'photo'},

  // Schechter Dunash — Dunash 5, Ramat Gan (WP post 577)
  'dunash-facade': {src: 'media/650.jpg', kind: 'render'},
  'dunash-street': {src: 'media/654.jpg', kind: 'render'},
  'dunash-aerial': {src: 'media/656.jpg', kind: 'render'},
  'dunash-aerial-2': {src: 'media/652.jpg', kind: 'render'},
  'dunash-site-1': {src: 'media/651.jpg', kind: 'photo'},
  'dunash-site-2': {src: 'media/653.jpg', kind: 'photo'},
  'dunash-living': {src: 'media/655.jpg', kind: 'interior'},
  'dunash-interior-1': {src: 'media/657.jpg', kind: 'interior'},
  'dunash-interior-2': {src: 'media/658.jpg', kind: 'interior'},

  // Nofei Nehalim, Petah Tikva (WP post 602) — the only genuine image is small
  'nehalim-site': {src: 'media/2951.jpeg', kind: 'photo'},

  // Original named project הראשונים — crop from the supplied mockup (kept from previous build)
  'rishonim-render': {src: 'prev:rishonim-render.webp', kind: 'render'},

  // Schechter 38 urban renewal page gallery — construction-site documentation
  ...Object.fromEntries([2953, 2954, 2955, 2956, 2957, 2958, 2959, 2960, 2961, 2962, 2963, 2964, 2965, 2966, 2967, 2969, 2968]
    .map((id, i) => [`urban-site-${String(i + 1).padStart(2, '0')}`, {src: `media/${id}.${id === 2969 ? 'jpeg' : 'jpg'}`, kind: 'construction-photo'}])),
  // Urban renewal hero illustration from the original Schechter 38 page
  'urban-cover': {src: 'media/73.png', kind: 'render', alpha: true}
};

// Per-project identity emblems from the original site (PNG, kept with alpha).
export const emblems = {
  dunash: 'media/2870.png', family: 'media/2871.png', nehalim: 'media/2872.png', knafei: 'media/2873.png',
  premium: 'media/2874.png', hahayil: 'media/2866.png', abigail: 'media/3010.png', 'galil-yam': 'media/3011.png'
};

// Two-second animated location-pin clips (1200×1200) from the original project pages.
export const clips = {
  gefen: 'media/2981.mp4', family: 'media/2985.mp4', gordon: 'media/2744.mp4', abigail: 'media/2982.mp4',
  knafei: 'media/2986.mp4', premium: 'media/2983.mp4', hahayil: 'media/2980.mp4', hagiva: 'media/2979.mp4', dunash: 'media/2984.mp4'
};

// Highest-bitrate master of the original homepage drone film (29.6 s, 1904×630).
export const film = 'media/3953.mp4';
