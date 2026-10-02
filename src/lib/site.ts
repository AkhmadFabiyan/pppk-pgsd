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

export type CandidateSummary = Pick<Candidate, "id" | "number" | "name" | "className">;

export const candidates: Candidate[] = [
  {
    number: 1,
    slug: "muhammad-isro-amirudin",
    name: "Muhammad Isro' Amirudin",
    className: "PGSD 2026H",
    poster: "/paslon/muhammad-isro-amirudin.png",
    vision: "Menciptakan Angkatan PGSD 2026 sebagai keluarga yang kreatif, inovatif, tangguh, dan adaptif, serta lingkungan angkatan yang terbuka untuk mendengar dan menampung aspirasi mahasiswa berupa saran, kritik, maupun kendala selama perkuliahan.",
    missions: [
      "Membangun komunikasi antarangkatan PGSD melalui ruang interaksi dan kolaborasi untuk saling mengenal, berbagi pengalaman, serta menciptakan hubungan yang lebih dekat.",
      "Menghadirkan program KONSOLIDASI sebagai sarana penyalur aspirasi mahasiswa untuk menyampaikan cerita, keluhan kelas, aspirasi, maupun kendala selama perkuliahan.",
      "Menciptakan angkatan yang bukan hanya satu kelas, tetapi satu keluarga yang saling mengenal, peduli, dan mendukung melalui kegiatan kebersamaan antarkelas."
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
      "Membangun solidaritas dan kekeluargaan yang kuat antaranggota angkatan sebagai fondasi kebersamaan selama masa perkuliahan.",
      "Mengembangkan kompetensi akademik dan pedagogik melalui budaya belajar aktif, berbagi ilmu, dan diskusi antarmahasiswa.",
      "Menumbuhkan jiwa kepemimpinan dan organisasi melalui keterlibatan aktif dalam kegiatan kampus, himpunan, maupun kepanitiaan."
    ]
  },
  {
    number: 4,
    slug: "samuel-nando",
    name: "Samuel Nando",
    className: "PGSD 2026D",
    poster: "/paslon/samuel-nando.png",
    vision: "Mewujudkan PGSD 2026 sebagai angkatan yang inspiratif, inklusif, dan berintegritas dengan menjunjung kebersamaan, kepedulian, serta semangat berprestasi untuk tumbuh dan berkembang bersama.",
    missions: [
      "Mempererat solidaritas dan kekeluargaan dengan menciptakan lingkungan angkatan yang nyaman, inklusif, dan saling menghargai.",
      "Membangun komunikasi yang efektif dan transparan agar setiap mahasiswa memiliki ruang untuk menyampaikan aspirasi, ide, maupun permasalahan.",
      "Mendorong budaya saling mendukung dalam bidang akademik, organisasi, dan kegiatan non-akademik.",
      "Mewujudkan lingkungan angkatan yang bebas dari perundungan dan diskriminasi serta mengutamakan sikap saling menghormati."
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
      "Menampung masukan dari teman-teman dan menyelesaikan masalah melalui diskusi bersama."
    ]
  },
  {
    number: 6,
    slug: "rayhan-arvel",
    name: "Rayhan Arvel",
    className: "PGSD 2026F",
    poster: "/paslon/rayhan-arvel.png",
    vision: "Mewujudkan PGSD 2026 sebagai angkatan yang memegang prinsip 4B (Beriman, Beradab, Berilmu, dan Beramal), solid, komunikatif, aktif, bebas perundungan, serta saling mendukung dalam perkembangan akademik maupun non-akademik.",
    missions: [
      "Membangun rasa kekeluargaan agar seluruh mahasiswa PGSD 2026 merasa menjadi bagian dari satu angkatan.",
      "Menjadi penghubung yang baik antara mahasiswa dengan pihak prodi, dosen, maupun organisasi mahasiswa.",
      "Menciptakan komunikasi yang terbuka dan nyaman agar setiap aspirasi dan permasalahan dapat disampaikan dan didiskusikan bersama.",
      "Mendorong angkatan yang berbudi luhur dan berprestasi optimal untuk membanggakan universitas, fakultas, program studi, serta angkatan.",
      "Mengupayakan penyampaian informasi angkatan yang jelas, cepat, dan mudah dipahami agar tidak terjadi kesalahpahaman."
    ]
  },
  {
    number: 7,
    slug: "bunga-ramadhani",
    name: "Bunga Ramadhani",
    className: "PGSD 2026C",
    poster: "/paslon/bunga-ramadhani.png",
    vision: "Mewujudkan angkatan PGSD yang kompak, aktif, bertanggung jawab, dan saling mendukung dalam membangun kebersamaan serta menciptakan lingkungan angkatan yang nyaman dan positif.",
    missions: [
      "Membangun komunikasi yang baik antaranggota angkatan agar tercipta hubungan yang terbuka dan harmonis.",
      "Meningkatkan kekompakan dan kebersamaan melalui kegiatan yang melibatkan seluruh anggota angkatan.",
      "Menyediakan sarana penyaluran aspirasi dan minat-bakat anggota secara responsif.",
      "Membangun sinergi yang harmonis dengan BPH tingkat di atasnya, organisasi mahasiswa, dan pihak program studi/fakultas."
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
      "Menciptakan komunikasi dua arah yang jujur antara pengurus dan seluruh teman angkatan agar informasi tersampaikan secara jelas.",
      "Menyalurkan suara, ide, dan aspirasi mahasiswa dengan cara yang baik.",
      "Menginisiasi program kerja yang seimbang antara pengembangan akademik, soft skill, dan penguatan solidaritas angkatan."
    ]
  },
  {
    number: 9,
    slug: "anastasya-ramadhani-putri",
    name: "Anastasya Ramadhani Putri",
    className: "PGSD 2026I",
    poster: "/paslon/anastasya-ramadhani-putri.png",
    vision: "Mewujudkan angkatan PGSD 2026 yang solid, inklusif, dan berprestasi dengan tata kelola organisasi yang komunikatif, transparan, serta berdampak nyata bagi seluruh mahasiswa.",
    missions: [
      "Membangun alur informasi dan ruang aspirasi dua arah yang jelas, terbuka, serta responsif antara BPH, mahasiswa, prodi, dan ormawa.",
      "Mempererat kekeluargaan dan rasa saling peduli antaranggota tanpa diskriminasi maupun perundungan agar seluruh mahasiswa merasa dirangkul.",
      "Menginisiasi ruang kolaborasi dan budaya saling bantu untuk mengoptimalkan potensi, karakter, serta prestasi bersama.",
      "Menjalankan roda kepengurusan angkatan yang responsif, terstruktur, dan berorientasi pada penyelesaian masalah secara musyawarah."
    ]
  }
];

export function formatBallotNumber(number: number) {
  return String(number).padStart(2, "0");
}
