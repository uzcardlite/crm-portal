# Farzandim — dizayn tizimi

Ota-onalar ilovasining yagona dizayn qoidalari. **Har bir yangi ekran shu
fayldan boshlanadi** — bu yerda yo'q narsa ilovada ham bo'lmaydi. Bir joyda
o'zgartirilgan qoida hamma ekranga tarqaladi.

Ilova **faqat tungi rejimda** ishlaydi. Kunduzgi variant yo'q va rejalashtirilmagan
— shuning uchun `.dark` klassi ham, `dark:` variantlari ham ishlatilmaydi.

---

## 1. Ranglar

Barcha ranglar `src/index.css` dagi CSS o'zgaruvchilarida, Tailwind orqali
semantik nom bilan ishlatiladi. **Komponentda to'g'ridan-to'g'ri hex yozilmaydi.**

### Asosiy (brend)

| Token | Qiymat | Qayerda |
|---|---|---|
| `carrot` | `#D2712F` | brend rangi, gradientning to'q uchi |
| `carrot-bright` | `#EC8A45` | matn, ikonka, faol holat, porlash |
| `carrot-deep` | `#A0501C` | bosilgan holat |

Sabzi rang **diqqatni tortish uchun** ishlatiladi: faol tab, qo'ng'iroqcha
sanog'i, yulduzcha soni, keyingi dars kartasi. Hamma joyda ishlatilsa, hech
qayerda ko'rinmaydi.

### Fon va yuzalar

| Token | Qiymat | Qayerda |
|---|---|---|
| `bg` | `#181310` | ekran foni |
| `surface` | `#241C16` | karta, tugma, input |
| `surface-2` | `#2C231B` | ko'tarilgan yuza: varaq (sheet), drawer, o'qilmagan karta |
| `line` | `rgba(255,255,255,.08)` | chegara, ajratuvchi |

### Matn

| Token | Qiymat | Qayerda |
|---|---|---|
| `ink` | `#F4EEE7` | asosiy matn, sarlavha |
| `ink-soft` | `#BAAA9B` | ikkilamchi matn |
| `ink-faint` | `#7F7466` | yorliq, sana, izoh |

### Ma'noli ranglar

Bu ranglar **holatni bildiradi**, bezak uchun ishlatilmaydi:

| Token | Qiymat | Ma'nosi |
|---|---|---|
| `teal` | `#34C9A3` | ijobiy: keldi, to'landi, o'sish, onlayn |
| `rose` | `#F5766B` | salbiy: kelmadi, qarz, tushish, o'qilmagan belgi |
| `amber` | `#E8B04B` | ogohlantirish: kechikdi, axloq halqasi |
| `sky` | `#62A8F0` | neytral ma'lumot |

**Qoida:** sabzi rang holat bildirmaydi. "Keldi" hech qachon sabzi emas —
u yashil. Aks holda ota-ona rangni o'qiy olmay qoladi.

---

## 2. Shrift

Ikkita shrift, Google Fonts orqali:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

| Shrift | Qayerda | Tailwind |
|---|---|---|
| **Bricolage Grotesque** | faqat raqam va sarlavha: 87%, 4.7, ism, sahifa nomi | `font-display` |
| **Plus Jakarta Sans** | qolgan hamma matn | `font-sans` (default) |

Bricolage har doim `tracking-tight` (`letter-spacing: -.02em`) bilan.
Katta raqamlar `tabular-nums` bilan — ustunlarda sakramasin.

### O'lchamlar

| Qayerda | O'lcham | Og'irlik |
|---|---|---|
| Sahifa sarlavhasi | 22–23px | 700 (display) |
| Bolaning ismi | 20px | 700 (display) |
| Katta raqam (halqa ichi) | 18–21px | 700 (display) |
| Karta sarlavhasi | 11–12px | 700–800 |
| Asosiy matn | 10.5–11px | 500–700 |
| Yorliq (UPPERCASE) | 8–10px | 700, `letter-spacing: .08em` |

Bo'lim yorliqlari doim **KATTA HARFDA**, `ink-faint` rangda.

---

## 3. Shakl va oraliq

| Element | Qiymat |
|---|---|
| Karta radiusi | `17px` (`rounded-card`) |
| Kichik element radiusi | `12–13px` |
| Tugma/ikonka radiusi | `10–11px` (`rounded-btn`) |
| Doira | `50%` — avatar, halqa, reaksiya |
| Pastilka (pill) | `999px` |

**Oraliqlar:** sahifa yon tomoni `16px`, kartalar orasi `13px`, karta ichi
`13px`, karta ichidagi qatorlar orasi `9–11px`. Boshqa qiymat ishlatilmaydi.

Pastki tab menyu suzib turadi: `left/right: 13px`, `bottom: 13px`. Kontent
uning ostiga kirib ketmasligi uchun sahifa pastida `padding-bottom: 108px`.

---

## 4. Fon qatlamlari

Har bir ekran uchta qatlamdan iborat, shu tartibda:

1. **Panjara (grid)** — `46×46px` sabzi chiziq, `opacity .055`. Butun ekran
   bo'ylab, `pointer-events: none`.
2. **Nur (glow)** — tepada, markazda: `330px` doira,
   `radial-gradient(rgba(236,138,69,.36) → transparent)`, `top: -128px`.
   Ekranning yuqori qismini iliq qiladi.
3. **Kontent** — `z-index: 5` dan boshlanadi.

Bezak shakllar (kichik kvadrat/doira, `border: 1px solid rgba(210,113,47,.32)`)
kam va tasodifiy joylashadi — ekranda **2 tadan oshmasin**.

---

## 5. Porlash (glow)

Porlash — bu ilovaning imzosi. Faqat **diqqat tortishi kerak** bo'lgan
elementlarda:

```css
box-shadow: 0 0 18px -2px rgba(236,138,69,.55);   /* faol tab, tugma */
box-shadow: 0 0 34px -4px rgba(236,138,69,.55);   /* avatar halqasi */
box-shadow: 0 0 8px -1px rgba(236,138,69,.55);    /* kichik nuqta, chiziq */
```

Yashil (`teal`) va qizil (`rose`) porlash ham xuddi shu formulada, faqat rangi
almashadi. **Karta porlamaydi** — faqat ichidagi bitta element porlaydi.

---

## 6. Komponentlar

### Karta
```jsx
<div className="rounded-card border border-line bg-surface p-[13px]">
```

### Bo'lim sarlavhasi
Chapda katta harfli yorliq, o'ngda sabzi rangli qo'shimcha:
```jsx
<div className="flex items-baseline justify-between">
  <span className="text-[10px] font-bold uppercase tracking-[.08em] text-ink-faint">Do'stlari</span>
  <span className="text-[10px] font-bold text-carrot-bright">4 ta</span>
</div>
```

### Halqa (donut)
`conic-gradient` bilan, ichida `surface` rangli doira. Tashqi soya —
porlash. O'lcham: katta `92px` (ichki `70px`), kichik `80px` (ichki `61px`).

### Pastilka (holat belgisi)
Fon — rangning `15%` shaffofligi, matn — rangning o'zi:
```jsx
<span className="rounded-full bg-teal/15 px-[9px] py-1 text-[8.5px] font-extrabold text-teal">Keldi</span>
```

### Suzuvchi tab menyu
`rgba(36,28,22,.92)` + `backdrop-blur(12px)` + `border rgba(255,255,255,.09)`.
Faol tab: sabzi gradient fon, to'q matn (`#2A1206`), porlash.

### Avatar
Doira, `3px` padding, fon — sabzi gradient (halqa effekti), ichida rasm.
Porlash bilan. O'lchamlar: hero `92px`, ro'yxat `38–48px`, kichik `21–26px`.

---

## 7. Sahifa tuzilishi

Har bir sahifa aynan shu tartibda:

```
statusbar (soat, batareya)
topbar   (menyu ☰ · farzand almashtirgich · qo'ng'iroqcha 🔔)
page-title (faqat ichki sahifalarda: Baholash, Davomat, Chatlar)
body       (kontent, gap 13px)
tabbar     (suzuvchi, absolute bottom)
```

Bosh sahifada `page-title` o'rniga **hero** turadi: avatar, ism, guruh,
yulduzchalar, reyting va to'lov pastilkasi.

**Davr tanlagich** (`Bu oy / Chorak / Yil`) — Baholash va Davomat sahifalarida,
`body` ning eng tepasida.

---

## 8. Yozuv uslubi

- Ota-onaga **"siz"** deb murojaat qilinadi, bolaga — ismi bilan.
- Raqam yolg'iz qoldirilmaydi: `94` emas, `94 · Unit 7 testi · Dilnoza opa`.
- Holat so'z bilan aytiladi: `Kechikdi` emas, `14 daq kech`.
- Bo'sh holat aybdorlik his qildirmaydi: "Hali reaksiya yo'q" — "Sizda hech
  narsa yo'q" emas.
- Sana: bugungi ish — soat (`14:35`), bu hafta — kun (`Se`), undan eski —
  `3 kun` yoki `12 avg`.

---

## 9. Harakat (animatsiya)

Kam va sekin. Faqat:

- `transition-colors` — bosiladigan element
- `transition-transform` — varaq (sheet) ochilishi
- Kelayotgan reaksiya — tepadan pastga sirg'alib chiqadi, keyin
  qo'ng'iroqchaga qarab kichrayadi

`prefers-reduced-motion` hurmat qilinadi. Boshqa animatsiya yo'q.

---

## 10. Bo'sh holatlar

Har bir blokning bo'sh holati oldindan yozilgan bo'lishi kerak — chunki yangi
o'quvchida hech narsa bo'lmaydi:

| Blok | Bo'sh matn |
|---|---|
| Reaksiyalar | "Hali reaksiya yo'q" |
| Do'stlar | "Ustoz hali do'st biriktirmagan" |
| Baholar | "Bu oyda baho qo'yilmagan" |
| Davomat | "Bu oyda dars kuni yo'q" |
| Chat | "Ustoz bilan yozishmani boshlang" |
| Yulduzchalar | "Yulduzchalar hali yig'ilmagan" |

---

## 11. Fayl tuzilishi

```
src/
  components/
    ui/          — Card, Pill, Ring, Avatar, Sheet, EmptyState, Skeleton
    layout/      — TopBar, TabBar, Drawer, PageShell
    home/        — Hero, StatRings, AttendanceThread, TodayTimeline,
                   TeacherNote, Friends, GroupRanking, NextLesson
  pages/         — Home, Grades, Attendance, Chat, ChatThread, Menu,
                   Schedule, Payments, Stars, About, Notifications, Login
```

Bitta komponent — bitta vazifa. Sahifa faqat ma'lumot oladi va bloklarni
joylashtiradi; hisob-kitob va shakllantirish komponent ichida bo'ladi.
