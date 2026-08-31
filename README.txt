BERAY - ÖĞRENCİ / ÖĞRETMEN İLK PAKET
=============================================

Bu klasör şu anda sadece:
1) Öğrenci Google girişi + profil kaydı
2) Öğretmen Google girişi + öğretmen başvurusu
3) Firestore kayıtları
için hazırlanmıştır.

GITHUB'A YÜKLEME
----------------
Tüm dosyaları repository içine koy:
- index.html
- style.css
- app.js
- firebase.js
- firestore.rules

FIREBASE'DE YAPILMASI GEREKENLER
--------------------------------
1. Authentication > Sign-in method > Google sağlayıcısını etkinleştir.
2. Firestore Database'i oluştur.
3. Firestore Rules kısmına firestore.rules dosyasındaki kuralları yapıştır.
4. Firebase Authentication > Settings > Authorized domains kısmında
   GitHub Pages alan adının bulunduğundan emin ol.
5. GitHub Pages'i aç.

ÖNEMLİ
------
Firebase Web API Key frontend kodunda bulunabilir. Asıl erişim kontrolünü
Authentication + Firestore Rules sağlar. Rules dosyasını açık bırakma.

2. DOĞRULAMA YÖNTEMİ
--------------------
Bu pakette 2. doğrulama henüz çalıştırılmadı. Tasarlanan yöntem:

Öğretmen Google ile başvurur
→ Başvuru admin incelemesine düşer
→ Admin öğretmenle canlı/gerçek zamanlı görüşerek başvurudaki
  bilgilerin tutarlılığını doğrular
→ Admin onaylarsa öğretmen hesabı "approved" olur
→ Sunucu tarafında öğretmene 6 haneli giriş kodu üretilir
→ Kod öğretmene iletilir
→ Öğretmen Google hesabı + 6 haneli kod ile öğretmen paneline girer

Kimlik, diploma veya sertifika gibi gereksiz hassas belgeleri bu ilk
sistemde zorunlu tutmuyoruz.

SONRAKİ AŞAMA
--------------
Admin paneli eklendiğinde:
- öğretmen başvurularını görme
- 2. doğrulamayı başlatma
- onay/reddetme
- 6 haneli kodu sunucu tarafında oluşturma
- öğrenci engelleme
- öğretmen müsaitlik durumu
- mesajlaşma
- şikayet sistemi

eklenerk sistem tamamlanacak.

Beray Katkılarıyla • From Beray
