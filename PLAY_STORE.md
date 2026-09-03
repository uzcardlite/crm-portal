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
| Skrinshotlar | 2-8 ta, 16:9 yoki 9:16 | ⚠️ olinmagan |

Skrinshot uchun ekranlar: Bosh sahifa, Davomat, To'lovlar, Dars jadvali, Chat.
**Haqiqiy o'quvchilar ismi ko'rinmasin** — demo ma'lumot bilan oling.

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
2. **Учетные данные** — Google tekshiruvchisi uchun demo hisob kerak
   (login Telegram bot kodi bilan ishlaydi, tekshiruvchi unga kira olmaydi)
3. **Closed testing** — 12 ta tester, 14 kun (Individual akkaunt talabi)
