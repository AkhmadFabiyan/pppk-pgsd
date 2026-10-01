export type ElectionStatus = "scheduled" | "open" | "closed";
export type ResultVisibility = "hidden" | "full_live" | "final_only";

export type Candidate = {
  id?: string;
  number: number;
  slug: string;
  name: string;
  className: string;
  poster: string;
  vision: string;
  missions: string[];
};

export const candidates: Candidate[] = [
  {
    number: 1,
    slug: "muhammad-isro-amirudin",
    name: "Muhammad Isro' Amirudin",
    className: "PGSD 2026H",
    poster: "/paslon/muhammad-isro-amirudin.png",
    vision: "Menciptakan Angkatan PGSD 2026 sebagai keluarga yang kreatif, inovatif, tangguh, dan adaptif, serta lingkungan angkatan yang terbuka untuk mendengar dan menampung aspirasi mahasiswa.",
    missions: [
      "Membangun komunikasi antarangkatan PGSD melalui ruang interaksi dan kolaborasi.",
      "Menghadirkan program KONSOLIDASI sebagai sarana penyalur aspirasi mahasiswa.",
      "Menciptakan kegiatan kebersamaan antarkelas yang saling mengenal, peduli, dan mendukung."
    ]
  },
  {
    number: 2,
    slug: "reivan-adi-wicaksana",
    name: "Reivan Adi Wicaksana",
    className: "PGSD 2026K",
    poster: "/paslon/reivan-adi-wicaksana.png",
    vision: "Mewujudkan angkatan PGSD UNESA yang solid, aktif, dan berprestasi melalui kepemimpinan yang terbuka, komunikatif, dan berorientasi pada kebersamaan seluruh mahasiswa.",
    missions: [
      "Membangun komunikasi yang terbuka dan merata antara pengurus angkatan dengan seluruh mahasiswa PGSD.",
      "Menjadi jembatan aspirasi antara mahasiswa, dosen, dan pihak fakultas/prodi.",
      "Menginisiasi dan mendukung kegiatan akademik maupun non-akademik yang mempererat kekompakan angkatan."
    ]
  },
  {
    number: 3,
    slug: "izza-aditya-santoso",
    name: "Izza Aditya Santoso",
    className: "PGSD 2026G",
    poster: "/paslon/izza-aditya-santoso.png",
    vision: "Membangun dan mewujudkan angkatan PGSD tahun 2026 menjadi angkatan yang solid, kolaboratif, dan berkarakter untuk menjadi calon pendidik yang inovatif.",
    missions: [
      "Membangun solidaritas dan kekeluargaan yang kuat antaranggota angkatan.",
      "Mengembangkan kompetensi akademik dan pedagogik melalui budaya belajar aktif.",
      "Menumbuhkan jiwa kepemimpinan dan organisasi melalui keterlibatan aktif dalam kegiatan kampus."
    ]
  },
  {
    number: 4,
    slug: "samuel-nando",
    name: "Samuel Nando",
    className: "PGSD 2026D",
    poster: "/paslon/samuel-nando.png",
    vision: "Mewujudkan PGSD 2026 sebagai angkatan yang inspiratif, inklusif, dan berintegritas dengan menjunjung kebersamaan, kepedulian, serta semangat berprestasi.",
    missions: [
      "Mempererat solidaritas dan kekeluargaan dalam lingkungan yang nyaman dan saling menghargai.",
      "Membangun komunikasi yang efektif dan transparan untuk aspirasi, ide, maupun permasalahan.",
      "Mendorong budaya saling mendukung dalam bidang akademik, organisasi, dan kegiatan non-akademik.",
      "Mewujudkan lingkungan angkatan bebas perundungan dan diskriminasi."
    ]
  },
  {
    number: 5,
    slug: "tauladani-wicaksana",
    name: "Tauladani Wicaksana",
    className: "PGSD 2026A",
    poster: "/paslon/tauladani-wicaksana.png",
    vision: "Membuat angkatan menjadi lebih kompak, komunikatif, dan saling membantu selama menjalani perkuliahan.",
    missions: [
      "Mempermudah komunikasi dan penyampaian informasi antaranggota angkatan.",
      "Saling membantu dalam hal perkuliahan dan informasi akademik.",
      "Menjaga kekompakan tanpa memaksakan semua orang untuk selalu ikut kegiatan.",
      "Membuat kegiatan kebersamaan yang sederhana dan sesuai kesepakatan bersama.",
      "Menampung masukan dan menyelesaikan masalah melalui diskusi bersama."
    ]
  },
  {
    number: 6,
    slug: "rayhan-arvel",
    name: "Rayhan Arvel",
    className: "PGSD 2026F",
    poster: "/paslon/rayhan-arvel.png",
    vision: "Mewujudkan PGSD 2026 sebagai angkatan yang memegang prinsip 4B, solid, komunikatif, aktif, bebas perundungan, serta saling mendukung.",
    missions: [
      "Membangun rasa kekeluargaan agar seluruh mahasiswa PGSD 2026 merasa menjadi bagian dari satu angkatan.",
      "Menjadi penghubung yang baik antara mahasiswa dengan prodi, dosen, maupun organisasi mahasiswa.",
      "Menciptakan komunikasi yang terbuka dan nyaman untuk aspirasi dan permasalahan.",
      "Mendorong angkatan yang berbudi luhur dan berprestasi optimal.",
      "Mengupayakan informasi angkatan yang jelas, cepat, dan mudah dipahami."
    ]
  },
  {
    number: 7,
    slug: "bunga-ramadhani",
    name: "Bunga Ramadhani",
    className: "PGSD 2026C",
    poster: "/paslon/bunga-ramadhani.png",
    vision: "Mewujudkan angkatan PGSD yang kompak, aktif, bertanggung jawab, dan saling mendukung dalam membangun kebersamaan serta lingkungan yang nyaman dan positif.",
    missions: [
      "Membangun komunikasi yang baik antaranggota angkatan secara terbuka dan harmonis.",
      "Meningkatkan kekompakan melalui kegiatan yang melibatkan seluruh anggota angkatan.",
      "Menyediakan sarana aspirasi serta minat-bakat secara responsif.",
      "Membangun sinergi dengan BPH tingkat di atasnya, organisasi mahasiswa, dan program studi."
    ]
  },
  {
    number: 8,
    slug: "dwi-wahyu-f",
    name: "Dwi Wahyu F.",
    className: "PGSD 2026E",
    poster: "/paslon/dwi-wahyu-f.png",
    vision: "Mewujudkan angkatan PGSD UNESA yang satu suara, satu langkah di depan, dan satu tujuan: tumbuh bersama dan berprestasi bersama.",
    missions: [
      "Menciptakan komunikasi dua arah yang jujur agar informasi tersampaikan secara jelas.",
      "Menyalurkan suara, ide, dan aspirasi mahasiswa dengan cara yang baik.",
      "Menginisiasi program yang seimbang antara akademik, soft skill, dan penguatan solidaritas."
    ]
  },
  {
    number: 9,
    slug: "anastasya-ramadhani-putri",
    name: "Anastasya Ramadhani Putri",
    className: "PGSD 2026I",
    poster: "/paslon/anastasya-ramadhani-putri.png",
    vision: "Mewujudkan angkatan PGSD 2026 yang solid, inklusif, dan berprestasi dengan tata kelola organisasi yang komunikatif, transparan, serta berdampak nyata.",
    missions: [
      "Membangun alur informasi dan ruang aspirasi dua arah yang jelas, terbuka, serta responsif.",
      "Mempererat kekeluargaan dan rasa saling peduli tanpa diskriminasi maupun perundungan.",
      "Menginisiasi ruang kolaborasi dan budaya saling bantu untuk mengoptimalkan potensi bersama.",
      "Menjalankan kepengurusan yang responsif, terstruktur, dan berorientasi pada penyelesaian masalah."
    ]
  }
];

export function formatBallotNumber(number: number) {
  return String(number).padStart(2, "0");
}
