// Dataset Anime Terkurasi & Autentik untuk Website Streaming Anime
// Sesuai PRD: Lisensi Resmi Distributor, Agregator, atau Konten Bebas Lisensi
const ANIME_DATABASE = [
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: "Sousou no Frieren",
    slug: "frieren-beyond-journeys-end",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
    rating: 9.38,
    type: "TV",
    year: 2023,
    season: "Fall 2023",
    status: "Tamat",
    studio: "Madhouse",
    genres: ["Fantasy", "Adventure", "Drama"],
    synopsis: "Penyihir elf Frieren bersama rekannya telah mengalahkan Raja Iblis setelah pengembaraan 10 tahun. Menghadapi rentang hidup elf yang ribuan tahun, Frieren memulai perjalanan baru untuk memahami arti ikatan manusia.",
    totalEpisodes: 28,
    currentEpisode: 28,
    isFeatured: true,
    featuredTagline: "Anime Fantasi Terbaik Tahun Ini",
    license: {
      licensor: "Madhouse / Toho Animation Ltd.",
      partner: "Agregator Resmi Asia Tenggara",
      region: "ID (Indonesia)",
      licenseType: "Lisensi Eksklusif Digital AVOD (Ad-Supported)",
      contractNumber: "LIC-2023-FRN-089",
      startDate: "2023-10-01",
      endDate: "2026-12-31",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Akhir Perjalanan", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { number: 2, title: "Bukan Berarti Itu Tidak Ada Gunanya", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { number: 3, title: "Sihir Penghancur Batu", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { number: 4, title: "Tanah Para Arwah", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
    ]
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling: Arise",
    japaneseTitle: "Ore dake Level Up na Ken",
    slug: "solo-leveling",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80",
    rating: 8.75,
    type: "TV",
    year: 2024,
    season: "Winter 2024",
    status: "Ongoing",
    studio: "A-1 Pictures",
    genres: ["Action", "Fantasy", "Supernatural"],
    synopsis: "Sung Jin-Woo dikenal sebagai pemburu terlemah di dunia. Setelah terjebak dalam dungeon ganda yang mematikan, ia terbangun dengan kemampuan misterius: sistem antarmuka pencarian yang hanya bisa dilihat olehnya.",
    totalEpisodes: 12,
    currentEpisode: 8,
    isFeatured: false,
    license: {
      licensor: "Aniplex Inc. / D&C Media",
      partner: "Distributor Resmi Indonesia",
      region: "ID (Indonesia)",
      licenseType: "Lisensi Siaran Web Beriklan (AVOD)",
      contractNumber: "LIC-2024-SLV-014",
      startDate: "2024-01-01",
      endDate: "2027-06-30",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Aku Sudah Biasa", duration: "23m", thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { number: 2, title: "Jika Punya Satu Kesempatan Lagi", duration: "23m", thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { number: 3, title: "Ini Seperti Game", duration: "23m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
    ]
  },
  {
    id: "jjk-s2",
    title: "Jujutsu Kaisen Season 2",
    japaneseTitle: "Jujutsu Kaisen: Shibuya Jihen",
    slug: "jujutsu-kaisen-s2",
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
    rating: 8.92,
    type: "TV",
    year: 2023,
    season: "Summer 2023",
    status: "Tamat",
    studio: "MAPPA",
    genres: ["Action", "Supernatural", "Dark Fantasy"],
    synopsis: "Tragedi masa lalu Gojo Satoru dan Geto Suguru terkuak, membawa konsekuensi besar yang berujung pada Insiden Shibuya di malam Halloween.",
    totalEpisodes: 23,
    currentEpisode: 23,
    isFeatured: false,
    license: {
      licensor: "TOHO Animation / Shueisha / MAPPA",
      partner: "Kemitraan Agregator Konten Resmi",
      region: "ID (Indonesia)",
      licenseType: "Lisensi Penyiaran AVOD",
      contractNumber: "LIC-2023-JJK-102",
      startDate: "2023-07-01",
      endDate: "2026-10-31",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Masa Muda yang Bersinar", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { number: 2, title: "Bakat Alami", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ]
  },
  {
    id: "mushoku-tensei-s2",
    title: "Mushoku Tensei: Jobless Reincarnation S2",
    japaneseTitle: "Mushoku Tensei II: Isekai Ittara Honki Dasu",
    slug: "mushoku-tensei-s2",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    rating: 8.65,
    type: "TV",
    year: 2024,
    season: "Spring 2024",
    status: "Ongoing",
    studio: "Studio Bind",
    genres: ["Isekai", "Adventure", "Fantasy", "Drama"],
    synopsis: "Rudeus Greyrat melanjutkan pencariannya di Akademi Sihir Ranoa seraya mengatasi luka batin masa lalunya dan menyambut takdir baru.",
    totalEpisodes: 24,
    currentEpisode: 15,
    isFeatured: false,
    license: {
      licensor: "Egg Firm / TOHO Animation",
      partner: "Distributor Regional Nusantara",
      region: "ID (Indonesia)",
      licenseType: "Lisensi AVOD Non-Eksklusif",
      contractNumber: "LIC-2024-MSK-055",
      startDate: "2024-04-01",
      endDate: "2027-04-30",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Penyihir Patah Hati", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ]
  },
  {
    id: "kimetsu-hashira",
    title: "Demon Slayer: Hashira Training Arc",
    japaneseTitle: "Kimetsu no Yaiba: Hashira Geiko-hen",
    slug: "demon-slayer-hashira-training",
    poster: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80",
    rating: 8.45,
    type: "TV",
    year: 2024,
    season: "Spring 2024",
    status: "Ongoing",
    studio: "ufotable",
    genres: ["Action", "Historical", "Supernatural"],
    synopsis: "Tanjiro dan para pembasmi iblis menjalani latihan khusus di bawah bimbingan para Hashira untuk mempersiapkan pertempuran pamungkas melawan Muzan Kibutsuji.",
    totalEpisodes: 8,
    currentEpisode: 4,
    isFeatured: false,
    license: {
      licensor: "Aniplex / Shueisha / ufotable",
      partner: "Agregator Resmi Asia Tenggara",
      region: "ID (Indonesia)",
      licenseType: "Lisensi AVOD Siaran Bersama",
      contractNumber: "LIC-2024-KMT-210",
      startDate: "2024-05-01",
      endDate: "2027-05-31",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Menuju Pelatihan Hashira", duration: "48m", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ]
  },
  {
    id: "suzume",
    title: "Suzume no Tojimari",
    japaneseTitle: "Suzume",
    slug: "suzume-no-tojimari",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    rating: 8.52,
    type: "Movie",
    year: 2022,
    season: "Fall 2022",
    status: "Tamat",
    studio: "CoMix Wave Films",
    genres: ["Adventure", "Fantasy", "Romance"],
    synopsis: "Suzume, gadis 17 tahun dari kota tenang di Kyushu, bertemu pemuda misterius yang mencari pintu. Penemuan pintu di reruntuhan memicu petualangan menutup bencana di seluruh Jepang.",
    totalEpisodes: 1,
    currentEpisode: 1,
    isFeatured: false,
    license: {
      licensor: "CoMix Wave Films / Story Inc.",
      partner: "Distributor Film Indonesia",
      region: "ID (Indonesia)",
      licenseType: "Lisensi Film Teater ke AVOD",
      contractNumber: "LIC-2022-SZM-007",
      startDate: "2023-01-01",
      endDate: "2026-12-31",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Suzume Full Movie", duration: "121m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ]
  },
  {
    id: "bocchi-the-rock",
    title: "Bocchi the Rock!",
    japaneseTitle: "Bocchi za Rokku!",
    slug: "bocchi-the-rock",
    poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
    rating: 8.84,
    type: "TV",
    year: 2022,
    season: "Fall 2022",
    status: "Tamat",
    studio: "CloverWorks",
    genres: ["Comedy", "Music", "Slice of Life"],
    synopsis: "Hitori Gotou adalah gadis yang sangat pemalu dan cemas secara sosial. Meski jago bermain gitar secara anonim di internet, ia bermimpi bergabung dalam band nyata.",
    totalEpisodes: 12,
    currentEpisode: 12,
    isFeatured: false,
    license: {
      licensor: "Aniplex / Houbunsha / CloverWorks",
      partner: "Agregator Resmi Lisensi",
      region: "ID (Indonesia)",
      licenseType: "Lisensi AVOD Siaran Resmi",
      contractNumber: "LIC-2022-BOC-331",
      startDate: "2022-10-01",
      endDate: "2026-09-30",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Gadis Penggulung", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ]
  },
  {
    id: "horimiya-piece",
    title: "Horimiya: The Missing Pieces",
    japaneseTitle: "Horimiya: Piece",
    slug: "horimiya-piece",
    poster: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    rating: 8.21,
    type: "TV",
    year: 2023,
    season: "Summer 2023",
    status: "Tamat",
    studio: "CloverWorks",
    genres: ["Romance", "School", "Comedy"],
    synopsis: "Kisah hari-hari sekolah Hori dan Miyamura yang hangat, manis, dan lucu yang belum sempat diadaptasi pada musim pertama.",
    totalEpisodes: 13,
    currentEpisode: 13,
    isFeatured: false,
    license: {
      licensor: "Square Enix / CloverWorks",
      partner: "Distributor Resmi Indonesia",
      region: "ID (Indonesia)",
      licenseType: "Lisensi Digital AVOD",
      contractNumber: "LIC-2023-HRM-442",
      startDate: "2023-07-01",
      endDate: "2026-12-31",
      isVerified: true
    },
    episodes: [
      { number: 1, title: "Perjalanan Sekolah", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
    ]
  }
];

// Opsi Kualitas Video & Subtitle Terpisah (Kebutuhan Fungsional PRD Poin 1 & 2)
const VIDEO_QUALITIES = [
  { label: "360p (Hemat Kuota)", value: "360p", note: "Cocok untuk koneksi seluler hemat data" },
  { label: "480p (Standar)", value: "480p", note: "Keseimbangan kuota dan ketajaman" },
  { label: "720p (HD Lancar)", value: "720p", note: "Kualitas jernih resolusi tinggi" },
  { label: "1080p (Full HD)", value: "1080p", note: "Detail tajam pengalaman sinematik" }
];

const VIDEO_SUBTITLES = [
  { code: "id", label: "Bahasa Indonesia (Resmi)", isDefault: true },
  { code: "en", label: "English (Official Sub)", isDefault: false },
  { code: "off", label: "Nonaktifkan Subtitle", isDefault: false }
];

// Database Iklan Pre-roll & Banner (Monetisasi PRD Ad-Supported)
const AD_DATABASE = {
  preroll: [
    {
      id: "ad-merch-01",
      brand: "KuroAnime Store Official",
      title: "Pre-order Nendoroid Frieren & Mini Figure Original Berlisensi",
      description: "Dapatkan cashback 15% dengan kode promo KUROSTREAM. Toko resmi berlisensi distributor Jepang.",
      durationSeconds: 15,
      skippableAfterSeconds: 5,
      ctaText: "Kunjungi Toko Resmi",
      url: "#",
      tagline: "Iklan ini membiayai penayangan anime legal dan gratis bagi Anda"
    },
    {
      id: "ad-game-02",
      brand: "GamerID High Speed Data",
      title: "Paket Kuota Streaming Malam 50GB Tanpa Batas Kecepatan",
      description: "Nonton anime favorit tanpa buffering. Aktifkan langsung lewat aplikasi resmi provider Anda.",
      durationSeconds: 15,
      skippableAfterSeconds: 5,
      ctaText: "Lihat Paket Kuota",
      url: "#",
      tagline: "Didukung oleh mitra resmi penyedia jaringan data berlisensi"
    }
  ],
  banner: {
    brand: "MangaVerse Indonesia",
    title: "Baca Manga Resmi Bahasa Indonesia Langsung dari Penerbit",
    description: "Nikmati ribuan chapter gratis dengan pembaharuan rilis bersamaan dengan edisi Jepang.",
    ctaText: "Buka Manga Resmi",
    tagline: "Iklan Bersponsor Legal"
  }
};

const INITIAL_COMMENTS = [
  {
    id: "c1",
    author: "Rian Pratama",
    avatar: "RP",
    animeId: "frieren",
    episode: 1,
    timeAgo: "2 jam lalu",
    text: "Pacing animenya tenang tapi emosinya sangat mengena. Transisi musik latar di adegan Himmel tua benar-benar bikin terharu."
  },
  {
    id: "c2",
    author: "Dewi Kirana",
    avatar: "DK",
    animeId: "frieren",
    episode: 1,
    timeAgo: "4 jam lalu",
    text: "Visual Madhouse di sini luar biasa halus. Sangat setia dengan manga aslinya. Wajib ditonton untuk penggemar high fantasy."
  },
  {
    id: "c3",
    author: "Arif Setiawan",
    avatar: "AS",
    animeId: "solo-leveling",
    episode: 1,
    timeAgo: "1 hari lalu",
    text: "Opening theme Hiroyuki Sawano tidak pernah mengecewakan. Suasana dungeon ganda dibuat mencekam dan tepat sasaran."
  }
];

