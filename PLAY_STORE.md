# Farzandim — Play Console materiallari

| | |
|---|---|
| Ilova nomi | Farzandim |
| Paket nomi | `uz.ncrm.farzandim` |
| Maxfiylik siyosati | `https://portal.ncrm.uz/privacy.html` |
| Aloqa email | `info@ncrm.uz` |
| Veb-sayt | `https://ncrm.uz` |
| Toifa | Образование |

---

## Do'kon sahifasi matnlari

### Qisqa tavsif (67/80)

```
Farzandingiz davomati, baholari va to'lovlarini bir joyda kuzating.
```

### To'liq tavsif (504/4000)

```
Farzandim — o'quv markazida o'qiyotgan farzandingizni kuzatib borish uchun ota-onalar ilovasi.

Nimalarni ko'rasiz:

• Davomat — farzandingiz darsga keldimi, kechikdimi
• Baholar va uy vazifalari
• To'lovlar tarixi va qarzdorlik
• Haftalik dars jadvali
• O'qituvchi bilan yozishma
• Markaz yangiliklari va e'lonlari

Ilova Milliy CRM tizimidan foydalanadigan o'quv markazlari uchun mo'ljallangan. Kirish uchun telefon raqamingiz markaz tomonidan tizimga kiritilgan bo'lishi kerak.

Savollar: info@ncrm.uz
```

---

## Grafik materiallar

| Material | O'lcham | Fayl |
|---|---|---|
| Ikonka | 512×512 | `farzandim-assets/icon-512.png` ✅ |
| Feature graphic | 1024×500 | `farzandim-assets/feature-graphic.png` ✅ |
| Skrinshotlar | 5 ta, 1080×1920 (9:16) | `farzandim-assets/screenshots/` ✅ |

Ekranlar: Bosh sahifa, Davomat, To'lovlar, Dars jadvali, Chat. Hammasi
o'ylab topilgan demo markazdan ("Ziyo Nur o'quv markazi") olingan — haqiqiy
o'quvchi ma'lumoti yo'q. Qayta olish: lokal bazada
`crm-backend/scripts/seed_demo_tenant.py`, so'ng xom skrinshotni
`scripts/store_screenshots.py` bilan ramkaga joylash.

---

## Anketalar — berilgan javoblar

Bular allaqachon to'ldirilgan, ma'lumot uchun saqlanadi.

### Ma'lumotlar xavfsizligi

Google "yig'ish" deb **qurilmadan chiqib ketadigan** ma'lumotni hisoblaydi.
Ilova serverga faqat telefon raqami va foydalanuvchi yozgan matnni yuboradi;
ism, baho, to'lov tarixi esa serverdan **olinadi va ko'rsatiladi**, yuborilmaydi.

| Tur | Yig'iladi | Ulashiladi | Majburiy | Maqsad |
|---|---|---|---|---|
| Номер телефона | Ha | Yo'q | Ha | Ilova funksiyasi + hisob boshqaruvi |
| Другие сообщения | Ha | Yo'q | Yo'q (ixtiyoriy) | Ilova funksiyasi |

Boshqa hech narsa belgilanmagan — joylashuv, kontaktlar, foto, analitika yo'q
(`AndroidManifest`da faqat `INTERNET` ruxsati bor).

Qo'shimcha: shifrlanadi **Ha**, o'chirishni so'rash mumkin **Ha**.

### Kontent reytingi

Barcha savollarga **Yo'q**, faqat *"foydalanuvchilar o'zaro muloqot qila oladimi"* → **Ha** (chat bor).
Natija: **3+ / Everyone**.

### Boshqa bandlar

| Band | Javob |
|---|---|
| Maqsadli auditoriya | 18+, bolalar uchun emas |
| Reklama | Yo'q |
| Davlat muassasasi ilovasi | Yo'q |
| Moliyaviy funksiyalar | Yo'q (to'lov tarixi faqat ko'rsatiladi) |
| Sog'liq funksiyalari | Yo'q |

---

## Qolgan ishlar

1. **Skrinshotlar** — brauzerda `portal.ncrm.uz` ni telefon rejimida ochib olish
2. **Учетные данные** — tekshiruvchi uchun demo hisob. Backend tayyor:
   `PORTAL_REVIEW_PHONE` raqami Telegram kodi o'rniga qat'iy
   `PORTAL_REVIEW_CODE` bilan kiradi. Qolgan qadamlar:
   - production'da demo markaz: `python scripts/seed_demo_tenant.py --allow-remote`
     (telefon `+998990000001`, hammasi o'ylab topilgan ma'lumot);
   - Railway'da `PORTAL_REVIEW_PHONE=+998990000001` va `PORTAL_REVIEW_CODE`
     (6 xonali, faqat tekshiruv davrida) o'rnatish;
   - Play Console → App access: "Telefon: +998990000001 → Kodni olish →
     kod: <PORTAL_REVIEW_CODE>".
3. **Closed testing** — 12 ta tester, 14 kun (Individual akkaunt talabi)
