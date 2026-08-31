/*
 * BERAY - Hazır Müfredat Kataloğu
 *
 * Bu katalog, 2026-2027 döneminde Türkiye Yüzyılı Maarif Modeli'nin
 * MEB tarafından yayımlanan sınıf/ders program sayfalarındaki Ünite/Tema
 * başlıkları esas alınarak hazırlanmıştır.
 *
 * ÖNEMLİ:
 * - Buradaki "Kolay Anlatım" metinleri Beray için sıfırdan yazılmış kısa
 *   özetlerdir; ders kitabından kopya değildir.
 * - Doğrudan PDF/video dosya URL'si tahmin edilmez. Öğrenci resmî MEB
 *   "Ders Kitapları" ve "Eğitim Videoları" kataloglarına yönlendirilir.
 */

export const OFFICIAL = {
  books: "https://tymm.meb.gov.tr/ders-kitaplari",
  videos: "https://tymm.meb.gov.tr/egitim-videolari"
};

const clean = (s) => s.replace(/\s+/g, " ").trim();

function buildStudyPack(subject, title) {
  const t = clean(title);
  const packs = {
    "Matematik": {
      explanation: `${t} konusunu öğrenirken önce kavramların ne ifade ettiğini netleştiririz. Sonra verilenleri düzenler, uygun yöntemi seçer ve işlemi adım adım kontrol ederiz. Amaç sadece sonucu bulmak değil, neden o yöntemin çalıştığını anlayabilmektir.`,
      keyPoints: ["Kavramın anlamını kendi cümlelerinle söyle.", "Verilenleri ve isteneni ayır.", "Uygun işlem veya bağıntıyı seç.", "Sonucu yaklaşık olarak kontrol et."],
      example: `Bir soruda ${t.toLowerCase()} ile ilgili bilgi verildiğinde önce sorunun hangi kavramı ölçtüğünü belirlemek, ardından işlemleri sırayla yapmak en güvenli yoldur.`,
      quiz: [
        ["Bir matematik sorusunda ilk yapılacak işlerden biri nedir?", "Verilenleri ve isteneni belirlemek."],
        ["İşlem bittikten sonra neden kontrol yapılır?", "Sonucun mantıklı olup olmadığını görmek için."],
        ["Bu ünitede amaç yalnızca ezber yapmak mıdır?", "Hayır; yöntemi ve nedenini anlamaktır."]
      ]
    },
    "Fen Bilimleri": {
      explanation: `${t} ünitesinde bir olayı yalnızca tanım olarak değil, neden-sonuç ilişkisiyle anlamaya çalışırız. Gözlem yapar, kavramları birbirine bağlar ve günlük hayattan örneklerle bilgiyi somutlaştırırız.`,
      keyPoints: ["Temel kavramları doğru tanımla.", "Neden ve sonuç arasındaki bağlantıyı kur.", "Gözlem veya deney sonucunu yorumla.", "Günlük yaşamla ilişkilendir."],
      example: `${t} ile ilgili bir olay gördüğünde “Ne oldu?”, “Neden oldu?” ve “Bunu nasıl kanıtlarız?” sorularını sırayla düşün.`,
      quiz: [
        ["Fen bilimlerinde bir olay incelenirken hangi iki ilişki özellikle önemlidir?", "Neden-sonuç ilişkisi."],
        ["Gözlem ve deney ne işe yarar?", "Bir düşünceyi incelemek ve kanıta dayalı sonuç çıkarmak için."],
        ["Öğrenilen bilgiyi kalıcılaştırmanın iyi yollarından biri nedir?", "Günlük yaşamdan örnekle ilişkilendirmek."]
      ]
    },
    "Türkçe": {
      explanation: `${t} ünitesinde metni yalnızca okumak yerine anlamı, anlatım biçimini ve kullanılan dili birlikte incelemeyi öğreniriz. Önemli bilgileri seçmek, çıkarım yapmak ve kendi cümlelerimizle ifade etmek temel hedeftir.`,
      keyPoints: ["Metnin ana düşüncesini belirle.", "Önemli ayrıntıları ana fikirden ayır.", "Bağlamdan anlam çıkar.", "Düşünceni açık ve düzenli ifade et."],
      example: `Bir metinde önce “Yazar ne anlatmak istiyor?” sorusunu sor; ardından bunu destekleyen cümleleri bul.`,
      quiz: [
        ["Bir metni anlamada ana düşünce neden önemlidir?", "Metnin temel mesajını görmemizi sağlar."],
        ["Bir kelimenin anlamını bulurken nelerden yararlanabiliriz?", "Cümlenin ve metnin bağlamından."],
        ["İyi bir anlatımda ne aranır?", "Açıklık, düzen ve anlam bütünlüğü."]
      ]
    },
    "Türk Dili Ve Edebiyatı": {
      explanation: `${t} başlığında metinleri dil ve edebiyat açısından okumaya odaklanırız. Türün özelliklerini tanır, metnin nasıl kurulduğunu inceler ve düşüncelerimizi metinden kanıt göstererek açıklarız.`,
      keyPoints: ["Metnin türünü ve amacını belirle.", "Ana düşünce ile yardımcı düşünceleri ayır.", "Dil ve anlatım özelliklerini incele.", "Yorumunu metinden kanıtla."],
      example: `Bir edebî metni incelerken “Bu metin ne anlatıyor?” sorusunun yanına “Bunu nasıl anlatıyor?” sorusunu da ekle.`,
      quiz: [
        ["Edebî bir metni incelerken yalnızca konuya bakmak yeterli midir?", "Hayır; anlatım biçimi ve yapı da incelenir."],
        ["Yorum yaparken neden metinden kanıt kullanılır?", "Yorumun metne dayandığını göstermek için."],
        ["Tür bilgisi ne sağlar?", "Metnin özelliklerini daha doğru tanımamıza yardım eder."]
      ]
    },
    "İngilizce": {
      explanation: `${t} ünitesinde İngilizceyi ezber listesi gibi değil, iletişim kurmak için kullanmayı hedefleriz. Kelimeleri bağlam içinde öğrenir, temel cümle yapılarını örneklerle uygular ve kısa konuşma veya yazma görevleriyle pekiştiririz.`,
      keyPoints: ["Kelimeyi cümle içinde öğren.", "Cümle yapısına dikkat et.", "Sık kullanılan kalıpları tekrar et.", "Dinleme, okuma, konuşma ve yazmayı birlikte kullan."],
      example: `${t} ile ilgili yeni bir kelime öğrendiğinde onu tek başına değil, kısa bir İngilizce cümlede kullan.`,
      quiz: [
        ["Yeni bir kelimeyi öğrenmenin etkili yollarından biri nedir?", "Kelimeyi bağlam içinde ve cümleyle öğrenmek."],
        ["İngilizcede iletişim için yalnızca kelime ezberi yeterli midir?", "Hayır; kelimeleri cümle içinde kullanabilmek gerekir."],
        ["Dil becerileri hangileridir?", "Dinleme, konuşma, okuma ve yazma."]
      ]
    },
    "Din Kültürü Ve Ahlak Bilgisi": {
      explanation: `${t} ünitesini öğrenirken temel kavramları doğru anlamaya, aralarındaki ilişkileri kurmaya ve bunların günlük hayattaki yansımalarını düşünmeye odaklanırız. Bilgiyi ezberlemek yerine anlamlandırmak hedeflenir.`,
      keyPoints: ["Temel kavramları doğru öğren.", "Kavramlar arasındaki ilişkiyi kur.", "Örnek ve günlük hayat bağlantısı düşün.", "Farklı görüşleri saygıyla değerlendirmeyi öğren."],
      example: `${t} konusunda bir kavram gördüğünde önce kendi cümlenle tanımla, sonra günlük hayattan bir örnek düşün.`,
      quiz: [
        ["Bir dinî kavramı öğrenirken ilk adım nedir?", "Kavramın anlamını doğru öğrenmek."],
        ["Bilgiyi günlük hayatla ilişkilendirmek neden önemlidir?", "Konuyu anlamayı ve hatırlamayı kolaylaştırır."],
        ["Farklı görüşler incelenirken hangi tutum önemlidir?", "Saygılı ve önyargısız olmak."]
      ]
    }
  };
  const key = Object.keys(packs).find(k => subject.toLocaleLowerCase("tr-TR") === k.toLocaleLowerCase("tr-TR"));
  if (packs[key]) return packs[key];
  return {
    explanation: `${t} ünitesinde önce temel kavramları öğrenir, sonra kavramların birbirleriyle ilişkisini kurarız. Konuyu kısa örneklerle pekiştirip sonunda öğrendiklerimizi kendi cümlelerimizle tekrarlarız.`,
    keyPoints: ["Temel kavramları tanı.", "Ana fikirleri ayır.", "Kavramlar arasındaki ilişkileri kur.", "Günlük yaşamdan örneklerle pekiştir."],
    example: `Bu ünitede ${t.toLowerCase()} başlığını çalışırken önce kısa bir özet çıkar, sonra önemli kavramları kendi cümlelerinle açıkla.`,
    quiz: [
      ["Bu ünitede ilk olarak ne öğrenmeliyiz?", "Temel kavramları."],
      ["Konuyu daha iyi anlamak için ne yapabiliriz?", "Kavramlar arasındaki ilişkileri örneklerle kurabiliriz."],
      ["Çalışma sonunda ne yapmalıyız?", "Öğrendiklerimizi kendi cümlelerimizle tekrar etmeliyiz."]
    ]
  };
}

function makeUnit(grade, subject, unitNo, title, source, focus = []) {
  const label = `${unitNo}. ${title}`;
  return {
    id: `${grade}-${subject}-${unitNo}-${title}`.toLowerCase().replace(/[^a-z0-9çğıöşü-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    grade: String(grade),
    subject,
    unit: `${unitNo}. Ünite`,
    title: clean(title),
    summary: `${clean(title)} konusunun temel kavramlarını öğrenir, ana fikirleri ayırır ve kısa örneklerle pekiştirirsin.`,
    explanation: buildStudyPack(subject, title).explanation,
    topics: focus.length ? focus : buildStudyPack(subject, title).keyPoints,
    keyPoints: buildStudyPack(subject, title).keyPoints,
    example: buildStudyPack(subject, title).example,
    quiz: buildStudyPack(subject, title).quiz,
    source,
    videoUrl: OFFICIAL.videos,
    fileUrl: OFFICIAL.books,
    sourceLabel: "MEB Programı",
    videoLabel: "MEB Videoları",
    fileLabel: "MEB Ders Kitapları"
  };
}

const src = {
  tr5: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-turkce-dersi/6",
  tr6: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-turkce-dersi/7",
  tr7: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-turkce-dersi/8",
  tr8: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-turkce-dersi/9",
  mat5: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-matematik-dersi/6",
  mat6: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-matematik-dersi/7",
  mat7: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-matematik-dersi/8",
  mat8: "https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-matematik-dersi/9",
  fen5: "https://tymm.meb.gov.tr/ogretim-programlari/fen-bilimleri-dersi/6",
  fen6: "https://tymm.meb.gov.tr/ogretim-programlari/fen-bilimleri-dersi/7",
  fen7: "https://tymm.meb.gov.tr/ogretim-programlari/fen-bilimleri-dersi/8",
  fen8: "https://tymm.meb.gov.tr/ogretim-programlari/fen-bilimleri-dersi/9",
  sos5: "https://tymm.meb.gov.tr/ogretim-programlari/sosyal-bilgiler-dersi/6",
  sos6: "https://tymm.meb.gov.tr/ogretim-programlari/sosyal-bilgiler-dersi/7",
  sos7: "https://tymm.meb.gov.tr/ogretim-programlari/sosyal-bilgiler-dersi/8",
  eng5: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-temel-egitim/6",
  eng6: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-temel-egitim/7",
  eng7: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-temel-egitim/8",
  eng8: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-temel-egitim/9",
  dkab5: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi/6",
  dkab6: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi/7",
  dkab7: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi/8",
  dkab8: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi/9",
  ink8: "https://tymm.meb.gov.tr/ogretim-programlari/tc-inkilap-tarihi-ve-ataturkculuk-dersi/9",
  tde9: "https://tymm.meb.gov.tr/ogretim-programlari/turk-dili-ve-edebiyati-dersi/11",
  tde10: "https://tymm.meb.gov.tr/ogretim-programlari/turk-dili-ve-edebiyati-dersi/12",
  tde11: "https://tymm.meb.gov.tr/ogretim-programlari/turk-dili-ve-edebiyati-dersi/13",
  tde12: "https://tymm.meb.gov.tr/ogretim-programlari/turk-dili-ve-edebiyati-dersi/14",
  mat9: "https://tymm.meb.gov.tr/ogretim-programlari/matematik-dersi/11",
  mat10: "https://tymm.meb.gov.tr/ogretim-programlari/matematik-dersi/12",
  mat11: "https://tymm.meb.gov.tr/ogretim-programlari/matematik-dersi/13",
  mat12: "https://tymm.meb.gov.tr/ogretim-programlari/matematik-dersi/14",
  fiz9: "https://tymm.meb.gov.tr/ogretim-programlari/fizik-dersi/11",
  fiz10: "https://tymm.meb.gov.tr/ogretim-programlari/fizik-dersi/12",
  fiz11: "https://tymm.meb.gov.tr/ogretim-programlari/fizik-dersi/13",
  fiz12: "https://tymm.meb.gov.tr/ogretim-programlari/fizik-dersi/14",
  kim9: "https://tymm.meb.gov.tr/ogretim-programlari/kimya-dersi/11",
  kim10: "https://tymm.meb.gov.tr/ogretim-programlari/kimya-dersi/12",
  kim11: "https://tymm.meb.gov.tr/ogretim-programlari/kimya-dersi/13",
  kim12: "https://tymm.meb.gov.tr/ogretim-programlari/kimya-dersi/14",
  bio9: "https://tymm.meb.gov.tr/ogretim-programlari/biyoloji-dersi/11",
  bio10: "https://tymm.meb.gov.tr/ogretim-programlari/biyoloji-dersi/12",
  bio11: "https://tymm.meb.gov.tr/ogretim-programlari/biyoloji-dersi/13",
  bio12: "https://tymm.meb.gov.tr/ogretim-programlari/biyoloji-dersi/14",
  tar9: "https://tymm.meb.gov.tr/ogretim-programlari/tarih-dersi/11",
  tar10: "https://tymm.meb.gov.tr/ogretim-programlari/tarih-dersi/12",
  tar11: "https://tymm.meb.gov.tr/ogretim-programlari/tarih-dersi/13",
  cog9: "https://tymm.meb.gov.tr/ogretim-programlari/cografya-dersi/11",
  cog10: "https://tymm.meb.gov.tr/ogretim-programlari/cografya-dersi/12",
  cog11: "https://tymm.meb.gov.tr/ogretim-programlari/cografya-dersi/13",
  cog12: "https://tymm.meb.gov.tr/ogretim-programlari/cografya-dersi/14",
  eng9: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-9-12/11",
  eng10: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-9-12/12",
  eng11: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-9-12/13",
  eng12: "https://tymm.meb.gov.tr/ogretim-programlari/ingilizce-dersi-9-12/14",
  dkab9: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi-2/11",
  dkab10: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi-2/12",
  dkab11: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi-2/13",
  dkab12: "https://tymm.meb.gov.tr/ogretim-programlari/din-kulturu-ve-ahlak-bilgisi-dersi-2/14",
  fel11: "https://tymm.meb.gov.tr/ogretim-programlari/felsefe-dersi/13"
};

const arr = (grade, subject, source, titles, topicMap = {}) => titles.map((t, i) => makeUnit(grade, subject, i + 1, t, source, topicMap[t]));

const READY_CURRICULUM = [
  ...arr(5, "Türkçe", src.tr5, ["Oyun Dünyası", "Atatürk’ü Tanımak", "Duygularımı Tanıyorum", "Geleneklerimiz", "İletişim Ve Sosyal İlişkiler", "Sağlıklı Yaşıyorum"]),
  ...arr(6, "Türkçe", src.tr6, ["Dilimizin Zenginliği", "Bağımsızlık Yolu", "Farklı Dünyalar", "İletişim Ve Sosyal İlişkiler", "Bilim Ve Teknoloji", "Lider Ruhlar"]),
  ...arr(7, "Türkçe", src.tr7, ["Hayat Boyu Gelişim", "Bir Hilal Uğruna", "İletişim Ve Sosyal İlişkiler", "Türk Sanatı", "Okuma Kültürü", "Hak Ve Sorumluluklar"]),
  ...arr(8, "Türkçe", src.tr8, ["İletişim Ve Sosyal İlişkiler", "Vatan Sevgisi", "Doğa Ve İnsan", "Türk Hikâye Geleneği Ve Destanları", "Sanat Ve Estetik", "Akademik Düşünme Dünyası"]),

  ...arr(5, "Matematik", src.mat5, ["Sayılar Ve Nicelikler (1)", "Sayılar Ve Nicelikler (2)", "İşlemlerle Cebirsel Düşünme", "Geometrik Şekiller", "Geometrik Nicelikler", "İstatistiksel Araştırma Süreci", "Veriden Olasılığa"]),
  ...arr(6, "Matematik", src.mat6, ["Sayılar Ve Nicelikler (1)", "Sayılar Ve Nicelikler (2)", "İşlemlerle Cebirsel Düşünme Ve Değişimler", "Geometrik Şekiller", "Geometrik Nicelikler", "İstatistiksel Araştırma Süreci", "Veriden Olasılığa"]),
  ...arr(7, "Matematik", src.mat7, ["Sayılar Ve Nicelikler (1)", "Sayılar Ve Nicelikler (2)", "İşlemlerle Cebirsel Düşünme Ve Değişimler", "Dönüşüm", "Geometrik Nicelikler (1)", "Geometrik Nicelikler (2)", "Geometrik Şekiller", "İstatistiksel Araştırma Süreci", "Veriden Olasılığa"]),
  ...arr(8, "Matematik", src.mat8, ["Sayılar Ve Nicelikler", "Cebirsel Düşünme Ve Değişimler", "Geometrik Şekiller", "Geometrik Nicelikler", "Dönüşüm", "İstatistiksel Araştırma Süreci", "Veriden Olasılığa"]),

  ...arr(5, "Fen Bilimleri", src.fen5, ["Gökyüzündeki Komşularımız Ve Biz", "Kuvveti Tanıyalım", "Canlıların Yapısına Yolculuk", "Işığın Dünyası", "Maddenin Doğası", "Yaşamımızdaki Elektrik", "Sürdürülebilir Yaşam Ve Geri Dönüşüm"]),
  ...arr(6, "Fen Bilimleri", src.fen6, ["Güneş Sistemi Ve Tutulmalar", "Kuvvetin Etkisinde Hareket", "Canlılarda Sistemler", "Işığın Yansıması Ve Renkler", "Maddenin Ayırt Edici Özellikleri", "Elektriğin İletimi Ve Direnç", "Sürdürülebilir Yaşam Ve Etkileşim"]),
  ...arr(7, "Fen Bilimleri", src.fen7, ["Uzay Çağı", "Kuvvet Ve Enerjiyi Keşfedelim", "Vücudumuzdaki Sistemler", "Işığın Kırılması Ve Mercekler", "Maddenin Doğasına Yolculuk", "Elektriklenme", "Sürdürülebilir Yaşam Ve Enerji"]),
  ...arr(8, "Fen Bilimleri", src.fen8, ["Mevsimler Ve İklim", "Yaşamı Kolaylaştıran Kuvvet", "Yaşamın Gizemi", "Sesin Dünyası", "Periyodik Tablo Ve Maddenin Etkileşimi", "Elektriğin Yolculuğu", "Sürdürülebilir Yaşam Ve Madde Döngüleri"]),

  ...arr(5, "Sosyal Bilgiler", src.sos5, ["Birlikte Yaşamak", "Evimiz Dünya", "Ortak Mirasımız", "Yaşayan Demokrasimiz", "Hayatımızdaki Ekonomi", "Teknoloji Ve Sosyal Bilimler"]),
  ...arr(6, "Sosyal Bilgiler", src.sos6, ["Birlikte Yaşamak", "Evimiz Dünya", "Ortak Mirasımız", "Yaşayan Demokrasimiz", "Hayatımızdaki Ekonomi", "Teknoloji Ve Sosyal Bilimler"]),
  ...arr(7, "Sosyal Bilgiler", src.sos7, ["Birlikte Yaşamak", "Evimiz Dünya", "Ortak Mirasımız", "Yaşayan Demokrasimiz", "Hayatımızdaki Ekonomi", "Teknoloji Ve Sosyal Bilimler"]),

  ...arr(5, "İngilizce", src.eng5, ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life In The Neighbourhood & City", "Life In The World", "Life In Nature", "Life In The Universe & Future"]),
  ...arr(6, "İngilizce", src.eng6, ["School Life", "Classroom Life", "Personal Life", "Family Life", "Life In The Neighbourhood & City", "Life In The World & Culture", "Life In Nature & Global Problems", "Life In The Universe & Future"]),
  ...arr(7, "İngilizce", src.eng7, ["School Life & Education", "Classroom Life & Learning", "Personal Life & Well-Being", "Family Life & Home", "Life In The Neighbourhood & City And Social Life", "Life In The World & Culture", "Life In Nature", "Life In The Universe & Future"]),
  ...arr(8, "İngilizce", src.eng8, ["School Life & Education", "Classroom Life & Learning", "Personal Life & Well-Being", "Family Life & Home", "Life In The Neighbourhood & City And Social Life", "Life In The World & Culture", "Life In Nature", "Life In The Universe & Future"]),

  ...arr(5, "Din Kültürü ve Ahlak Bilgisi", src.dkab5, ["Allah İnancı", "Namaz", "Kur’an-ı Kerim", "Peygamber Kıssaları", "Mimarimizde Dinî Motifler"]),
  ...arr(6, "Din Kültürü ve Ahlak Bilgisi", src.dkab6, ["Peygamber Ve İlahi Kitap İnancı", "Ramazan Ve Oruç", "Ahlaki Davranışlar", "Peygamberliğinden Önce Hz. Muhammed", "Kültürümüzdeki Dinî Motifler"]),
  ...arr(7, "Din Kültürü ve Ahlak Bilgisi", src.dkab7, ["Melek Ve Ahiret İnancı", "Hac, Umre Ve Kurban", "İslam Düşüncesinde Yorumlar", "Peygamber Olarak Hz. Muhammed", "Yaşayan Dünya Dinleri"]),
  ...arr(8, "Din Kültürü ve Ahlak Bilgisi", src.dkab8, ["Kader İnancı", "Zekât Ve Sadaka", "Din Ve Sosyal Hayat", "Kur’an Ve İnsan", "Müslümanların Bilim Ve Kültüre Katkısı"]),
  ...arr(8, "T.C. İnkılap Tarihi Ve Atatürkçülük", src.ink8, ["Mustafa Kemal’in Hayatı", "Birinci Dünya Savaşı", "Millî Mücadele", "Türkiye Cumhuriyeti’nin Kuruluşu Ve İnkılaplar"]),

  ...arr(9, "Türk Dili Ve Edebiyatı", src.tde9, ["Sözün İnceliği", "Anlam Arayışı", "Anlamın Yapı Taşları", "Dilin Zenginliği"]),
  ...arr(10, "Türk Dili Ve Edebiyatı", src.tde10, ["Sözün Ezgisi", "Kelimelerin Ritmi", "Dünden Bugüne", "Nesillerin Mirası"]),
  ...arr(11, "Türk Dili Ve Edebiyatı", src.tde11, ["Bir Diyeceğim Var!", "Kültür Yolculuğu", "Yaşamın İzinde", "Hayatın Aynası"]),
  ...arr(12, "Türk Dili Ve Edebiyatı", src.tde12, ["Benim Yolculuğum", "Toplumun Ahengi", "Hayatın Dengesi", "Hayalimdeki Yarın"]),

  ...arr(9, "Matematik", src.mat9, ["Sayılar", "Nicelikler Ve Değişimler", "Geometrik Şekiller", "Eşlik Ve Benzerlik", "Algoritma Ve Bilişim", "İstatistiksel Araştırma Süreci", "Veriden Olasılığa"]),
  ...arr(10, "Matematik", src.mat10, ["Geometrik Şekiller", "İstatistiksel Araştırma Süreci", "Sayılar", "Nicelikler Ve Değişimler", "Sayma, Algoritma Ve Bilişim", "Analitik İnceleme", "Veriden Olasılığa"]),
  ...arr(11, "Matematik", src.mat11, ["İstatistiksel Araştırma Süreci", "Geometrik Şekiller", "Nicelikler Ve Değişimler (1)", "Nicelikler Ve Değişimler (2)", "Nicelikler Ve Değişimler (3)"]),
  ...arr(12, "Matematik", src.mat12, ["Nicelikler Ve Değişimler (1)", "Nicelikler Ve Değişimler (2)", "Geometrik Şekiller", "Geometrik Cisimler", "Değişimin Matematiği (1)", "Değişimin Matematiği (2)", "Değişimin Matematiği (3)", "Hazır Veriler Üzerinde Çalışma"]),

  ...arr(9, "Fizik", src.fiz9, ["Fizik Bilimi Ve Kariyer Keşfi", "Kuvvet Ve Hareket", "Akışkanlar", "Enerji"]),
  ...arr(10, "Fizik", src.fiz10, ["Kuvvet Ve Hareket", "Enerji", "Elektrik", "Dalgalar"]),
  ...arr(11, "Fizik", src.fiz11, ["Kuvvet Ve Hareket", "Elektrik Ve Manyetizma", "Optik"]),
  ...arr(12, "Fizik", src.fiz12, ["Kuvvet Ve Hareket", "Enerji", "Dalgalar", "Madde Ve Doğası"]),

  ...arr(9, "Kimya", src.kim9, ["Etkileşim", "Çeşitlilik", "Sürdürülebilirlik"]),
  ...arr(10, "Kimya", src.kim10, ["Etkileşim", "Çeşitlilik", "Sürdürülebilirlik"]),
  ...arr(11, "Kimya", src.kim11, ["Etkileşim", "Çeşitlilik", "Sürdürülebilirlik"]),
  ...arr(12, "Kimya", src.kim12, ["Etkileşim", "Çeşitlilik", "Sürdürülebilirlik"]),

  ...arr(9, "Biyoloji", src.bio9, ["Yaşam", "Organizasyon"]),
  ...arr(10, "Biyoloji", src.bio10, ["Enerji", "Ekoloji"]),
  ...arr(11, "Biyoloji", src.bio11, ["Tepki", "Homeostazi"]),
  ...arr(12, "Biyoloji", src.bio12, ["Üreme", "Gen"]),

  ...arr(9, "Tarih", src.tar9, ["Geçmişin İnşa Sürecinde Tarih", "Eski Çağ Medeniyetleri", "Orta Çağ Medeniyetleri"]),
  ...arr(10, "Tarih", src.tar10, ["Türkistan’dan Türkiye’ye (1040-1299)", "Beylikten Devlete Osmanlı (1299-1453)", "Cihan Devleti Osmanlı (1453-1683)"]),
  ...arr(11, "Tarih", src.tar11, ["Değişen Dünyada Osmanlı Devleti (1683-1789)", "Dönüşüm Sürecinde Osmanlı (1789-1908)", "Savaşlar Sarmalında Osmanlı (1908-1918)"]),

  ...arr(9, "Coğrafya", src.cog9, ["Coğrafyanın Doğası", "Mekânsal Bilgi Teknolojileri", "Doğal Sistemler Ve Süreçler", "Beşerî Sistemler Ve Süreçler", "Ekonomik Faaliyetler Ve Etkileri", "Afetler Ve Sürdürülebilir Çevre", "Bölgeler, Ülkeler Ve Küresel Bağlantılar"]),
  ...arr(10, "Coğrafya", src.cog10, ["Coğrafyanın Doğası", "Mekânsal Bilgi Teknolojileri", "Doğal Sistemler Ve Süreçler", "Beşerî Sistemler Ve Süreçler", "Ekonomik Faaliyetler Ve Etkileri", "Afetler Ve Sürdürülebilir Çevre", "Bölgeler, Ülkeler Ve Küresel Bağlantılar"]),
  ...arr(11, "Coğrafya", src.cog11, ["Coğrafyanın Doğası", "Mekânsal Bilgi Teknolojileri", "Doğal Sistemler Ve Süreçler", "Beşerî Sistemler Ve Süreçler", "Ekonomik Faaliyetler Ve Etkileri", "Afetler Ve Sürdürülebilir Çevre", "Bölgeler, Ülkeler Ve Küresel Bağlantılar"]),
  ...arr(12, "Coğrafya", src.cog12, ["Coğrafyanın Doğası", "Mekânsal Bilgi Teknolojileri", "Doğal Sistemler Ve Süreçler", "Beşerî Sistemler Ve Süreçler", "Ekonomik Faaliyetler Ve Etkileri", "Afetler Ve Sürdürülebilir Çevre", "Bölgeler, Ülkeler Ve Küresel Bağlantılar"]),

  ...arr(9, "İngilizce", src.eng9, ["School Life", "Classroom Life", "Personal Life: Physical Appearance & Personality", "Family Life", "Life In The House & Neighbourhood", "Life In The City & Country", "Life In The World & Nature", "Life In The Universe & Future"]),
  ...arr(10, "İngilizce", src.eng10, ["School Life & Education", "Classroom Life & Learning", "Personal Life & Well-Being", "Family Life & Home", "Life In The Neighbourhood, City & Social Life", "Life In The World & Culture", "Life In Nature & Global Problems", "Life In The Universe & The Future"]),
  ...arr(11, "İngilizce", src.eng11, ["School Life & Education", "Classroom Life & Learning", "Personal Life & Well-Being", "Family Life & Home", "Life In The Neighbourhood, City & Social Life", "Life In The World & Culture", "Life In Nature & Global Problems", "Life In The Universe & The Future"]),
  ...arr(12, "İngilizce", src.eng12, ["School Life & Education", "Classroom Life & Learning", "Personal Life & Well-Being", "Family Life & Home", "Life In The Neighbourhood, City & Social Life", "Life In The World & Culture", "Life In Nature & Global Problems", "Life In The Universe & The Future"]),

  ...arr(9, "Din Kültürü ve Ahlak Bilgisi", src.dkab9, ["Allah-İnsan İlişkisi", "İslam’da İnanç Esasları", "İslam’da İbadetler", "İslam’da Ahlak İlkeleri", "Kur’an’a Göre Hz. Muhammed"]),
  ...arr(10, "Din Kültürü ve Ahlak Bilgisi", src.dkab10, ["İslam’da Varlık Ve Bilgi", "Allah’ı Tanımak", "İslam’ın Evrensel Mesajları", "Din, Çevre Ve Teknoloji", "İslam Düşüncesinde İtikadi-Siyasi Ve Fıkhi Yorumlar"]),
  ...arr(11, "Din Kültürü ve Ahlak Bilgisi", src.dkab11, ["Kader, İrade Ve Sorumluluk", "Din, Felsefe, Bilim Ve Sanat", "İslam Medeniyeti Ve Gönül Coğrafyamız", "İnançla İlgili Meseleler", "Yahudilik Ve Hristiyanlık"]),
  ...arr(12, "Din Kültürü ve Ahlak Bilgisi", src.dkab12, ["Kur’an-ı Kerim", "Din Ve Aile", "Güncel Dinî Meseleler", "İslam Düşüncesinde Tasavvufi Yorumlar", "Hint Ve Çin Dinleri"]),

  ...arr(11, "Felsefe", src.fel11, ["Felsefeyi Tanıma", "Bilgi Felsefesi", "Bilim Felsefesi", "Varlık Felsefesi", "Hayatın Anlamı"])
];



function makeChoices(correct, distractors) {
  const unique = [...new Set([correct, ...distractors])].slice(0, 4);
  const answer = unique.indexOf(correct);
  return { options: unique, correctAnswer: answer };
}

function makePracticeQuestions(item) {
  const points = Array.isArray(item.keyPoints) ? item.keyPoints : [];
  const existing = Array.isArray(item.quiz) ? item.quiz : [];
  const title = item.title;
  const q = [];

  if (existing[0]) {
    const correct = String(existing[0][1]);
    const c = makeChoices(correct, [
      "Konuyla ilgisi olmayan ayrıntıları ezberlemek.",
      "Soruyu okumadan rastgele cevap vermek.",
      "Yalnızca başlığı bilmek."
    ]);
    q.push({ question: existing[0][0], options: c.options, correctAnswer: c.correctAnswer });
  }

  if (existing[1]) {
    const correct = String(existing[1][1]);
    const c = makeChoices(correct, [
      "Sadece sonucu tahmin etmek.",
      "Konuyu başka derslerden tamamen ayırmak.",
      "Soruyu hiç kontrol etmemek."
    ]);
    q.push({ question: existing[1][0], options: c.options, correctAnswer: c.correctAnswer });
  }

  if (existing[2]) {
    const correct = String(existing[2][1]);
    const c = makeChoices(correct, [
      "Sadece ezber yapmak.",
      "Konuyu yarıda bırakmak.",
      "Önemli kavramları karıştırmak."
    ]);
    q.push({ question: existing[2][0], options: c.options, correctAnswer: c.correctAnswer });
  }

  const point = points[0] || "Temel kavramları öğrenmek";
  let c = makeChoices(point, [
    "Konuyu hiç incelemeden cevap vermek",
    "Sadece sonuca bakmak",
    "Bütün kavramları rastgele sıralamak"
  ]);
  q.push({
    question: `“${title}” ünitesinde aşağıdakilerden hangisi çalışmanın temel hedeflerinden biridir?`,
    options: c.options,
    correctAnswer: c.correctAnswer
  });

  const point2 = points[1] || "Kavramlar arasındaki ilişkileri kurmak";
  c = makeChoices(point2, [
    "Bilgileri birbirinden kopuk ezberlemek",
    "Sorunun tamamını okumadan işlem yapmak",
    "Öğrendiklerini kontrol etmemek"
  ]);
  q.push({
    question: `“${title}” çalışırken aşağıdakilerden hangisi önerilir?`,
    options: c.options,
    correctAnswer: c.correctAnswer
  });

  return q.slice(0, 5);
}

export const READY_TESTS = READY_CURRICULUM.map((item) => ({
  id: `ready-${item.id}`,
  title: `${item.grade}. Sınıf ${item.subject} ${item.unit}`,
  description: `🧠 ${item.title} ünitesi için 5 soruluk çalışma testi.`,
  grade: item.grade,
  subject: item.subject,
  unit: item.unit,
  isReadyCurriculumTest: true,
  questions: makePracticeQuestions(item)
}));

// Güvenli API: başka dosyalar bu diziyi kullanır.
export { READY_CURRICULUM };

export function getReadyCurriculumForGrade(grade) {
  return READY_CURRICULUM.filter(item => String(item.grade) === String(grade));
}

export function getReadyCurriculumSubjects(grade) {
  return [...new Set(getReadyCurriculumForGrade(grade).map(item => item.subject))].sort((a, b) => a.localeCompare(b, "tr"));
}
