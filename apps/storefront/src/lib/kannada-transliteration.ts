// ── VOWELS, MATRAS, AND CONSONANTS TRANSLITERATION MATRIX ────────────────────
export const VOWELS: { [key: string]: string } = {
  a: "ಅ", aa: "ಆ", A: "ಆ", i: "ಇ", ii: "ಈ", I: "ಈ", u: "ಉ", uu: "ಊ", U: "ಊ",
  e: "ಎ", ee: "ಏ", E: "ಏ", ai: "ಐ", o: "ಒ", oo: "ಓ", O: "ಓ", au: "ಔ",
  am: "ಅಂ", aha: "ಅಃ", ru: "ಋ", R: "ಋ"
}

export const MATRAS: { [key: string]: string } = {
  a: "", aa: "ಾ", A: "ಾ", i: "ಿ", ii: "ೀ", I: "ೀ", u: "ು", uu: "ೂ", U: "ೂ",
  e: "ೆ", ee: "ೇ", E: "ೇ", ai: "ೈ", o: "ೊ", oo: "ೋ", O: "ೋ", au: "ೌ",
  am: "ಂ", aha: "ಃ", ru: "ೃ", R: "ೃ"
}

export const CONSONANTS: { [key: string]: string } = {
  k: "ಕ", kh: "ಖ", g: "ಗ", gh: "ಘ", ng: "ಙ",
  c: "ಚ", ch: "ಚ", chh: "ಛ", j: "ಜ", jh: "ಝ", ny: "ಞ",
  t: "ತ", th: "ಥ", d: "ದ", dh: "ಧ", n: "ನ",
  T: "ಟ", Th: "ಠ", D: "ಡ", Dh: "ಢ", N: "ಣ",
  p: "ಪ", ph: "ಫ", f: "ಫ", b: "ಬ", bh: "ಭ", m: "ಮ",
  y: "ಯ", r: "ರ", l: "ಲ", v: "ವ", w: "ವ",
  sh: "ಶ", Sh: "ಷ", s: "ಸ", h: "ಹ", L: "ಳ",
  ksh: "ಕ್ಷ", jn: "ಜ್ಞ"
}

// ── EXTENSIVE KANGLISH CULTURAL & DIALOGUE DICTIONARY ────────────────────────
export const KANNADA_DICTIONARY: { [key: string]: string[] } = {
  // Cities & Regions
  "mandya": ["ಮಂಡ್ಯ", "ಮಂದ್ಯ", "ಮಂಡ್ಯದ"],
  "mysore": ["ಮೈಸೂರು", "ಮೈಸೂರ್", "ಮೈಸೂರಿನ"],
  "mysuru": ["ಮೈಸೂರು", "ಮೈಸೂರ್", "ಮೈಸೂರಿನ"],
  "bengaluru": ["ಬೆಂಗಳೂರು", "ಬೆಂಗಳೂರ್", "ಬೆಂಗಳೂರಿನ"],
  "bangalore": ["ಬೆಂಗಳೂರು", "ಬೆಂಗಳೂರ್", "ಬೆಂಗಳೂರಿನ"],
  "mangaluru": ["ಮಂಗಳೂರು", "ಮಂಗಳೂರ್", "ಮಂಗಳೂರಿನ"],
  "mangalore": ["ಮಂಗಳೂರು", "ಮಂಗಳೂರ್", "ಮಂಗಳೂರಿನ"],
  "udupi": ["ಉಡುಪಿ", "ಉಡುಪಿಯ", "ಉಡುಪಿಯಲ್ಲಿ"],
  "hubli": ["ಹುಬ್ಬಳ್ಳಿ", "ಹುಬ್ಬಳ್ಳಿಯ", "ಹುಬ್ಬಳ್ಳಿಯಲ್ಲಿ"],
  "hubballi": ["ಹುಬ್ಬಳ್ಳಿ", "ಹುಬ್ಬಳ್ಳಿಯ", "ಹುಬ್ಬಳ್ಳಿಯಲ್ಲಿ"],
  "dharwad": ["ಧಾರವಾಡ", "ಧಾರವಾಡದ", "ಧಾರವಾಡದಲ್ಲಿ"],
  "dharwada": ["ಧಾರವಾಡ", "ಧಾರವಾಡದ", "ಧಾರವಾಡದಲ್ಲಿ"],
  "belagavi": ["ಬೆಳಗಾವಿ", "ಬೆಳಗಾವಿಯ", "ಬೆಳಗಾವಿಯಲ್ಲಿ"],
  "belgaum": ["ಬೆಳಗಾವಿ", "ಬೆಳಗಾವಿಯ", "ಬೆಳಗಾವಿಯಲ್ಲಿ"],
  "shivamogga": ["ಶಿವಮೊಗ್ಗ", "ಶಿವಮೊಗ್ಗದ", "ಶಿವಮೊಗ್ಗದಲ್ಲಿ"],
  "shimoga": ["ಶಿವಮೊಗ್ಗ", "ಶಿವಮೊಗ್ಗದ", "ಶಿವಮೊಗ್ಗದಲ್ಲಿ"],
  "tumkur": ["ತುಮಕೂರು", "ತುಮಕೂರ್", "ತುಮಕೂರಿನ"],
  "tumakuru": ["ತುಮಕೂರು", "ತುಮಕೂರ್", "ತುಮಕೂರಿನ"],
  "davangere": ["ದಾವಣಗೆರೆ", "ದಾವಣಗೆರೆಯ", "ದಾವಣಗೆರೆಯಲ್ಲಿ"],
  "hassan": ["ಹಾಸನ", "ಹಾಸನದ", "ಹಾಸನದಲ್ಲಿ"],
  "chikkamagaluru": ["ಚಿಕ್ಕಮಗಳೂರು", "ಚಿಕ್ಕಮಗಳೂರ್", "ಚಿಕ್ಕಮಗಳೂರಿನ"],
  "coorg": ["ಕೊಡಗು", "ಕೊಡಗಿನ", "ಕೊಡಗಿನಲ್ಲಿ"],
  "kodagu": ["ಕೊಡಗು", "ಕೊಡಗಿನ", "ಕೊಡಗಿನಲ್ಲಿ"],
  "kolar": ["ಕೋಲಾರ", "ಕೋಲಾರದ", "ಕೋಲಾರದಲ್ಲಿ"],
  "bidar": ["ಬೀದರ್", "ಬೀದರ್‌ನ", "ಬೀದರ್‌ನಲ್ಲಿ"],
  "gulbarga": ["ಕಲಬುರಗಿ", "ಗುಲ್ಬರ್ಗ", "ಕಲಬುರಗಿಯಲ್ಲಿ"],
  "kalaburagi": ["ಕಲಬುರಗಿ", "ಕಲಬುರಗಿಯ", "ಕಲಬುರಗಿಯಲ್ಲಿ"],
  "yadgir": ["ಯಾದಗಿರಿ", "ಯಾದಗಿರಿಯ", "ಯಾದಗಿರಿಯಲ್ಲಿ"],
  "raichur": ["ರಾಯಚೂರು", "ರಾಯಚೂರ್", "ರಾಯಚೂರಿನಲ್ಲಿ"],
  "koppal": ["ಕೊಪ್ಪಳ", "ಕೊಪ್ಪಳದ", "ಕೊಪ್ಪಳದಲ್ಲಿ"],
  "ballari": ["ಬಳ್ಳಾರಿ", "ಬಳ್ಳಾರಿಯ", "ಬಳ್ಳಾರಿಯಲ್ಲಿ"],
  "bellary": ["ಬಳ್ಳಾರಿ", "ಬಳ್ಳಾರಿಯ", "ಬಳ್ಳಾರಿಯಲ್ಲಿ"],
  "gadag": ["ಗದಗ", "ಗದಗದ", "ಗದಗದಲ್ಲಿ"],
  "haveri": ["ಹಾವೇರಿ", "ಹಾವೇರಿಯ", "ಹಾವೇರಿಯಲ್ಲಿ"],
  "chamarajanagar": ["ಚಾಮರಾಜನಗರ", "ಚಾಮರಾಜನಗರದ", "ಚಾಮರಾಜನಗರದಲ್ಲಿ"],
  "ramanagara": ["ರಾಮನಗರ", "ರಾಮನಗರದ", "ರಾಮನಗರದಲ್ಲಿ"],
  "chikkaballapur": ["ಚಿಕ್ಕbಳ್ಳಾಪುರ", "ಚಿಕ್ಕಬಳ್ಳಾಪುರ", "ಚಿಕ್ಕಬಳ್ಳಾಪುರದಲ್ಲಿ"],
  "chitradurga": ["ಚಿತ್ರದುರ್ಗ", "ಚಿತ್ರದುರ್ಗದ", "ಚಿತ್ರದುರ್ಗದಲ್ಲಿ"],
  "bagalkot": ["ಬಾಗಲಕೋಟೆ", "ಬಾಗಲಕೋಟೆಯ", "ಬಾಗಲಕೋಟೆಯಲ್ಲಿ"],
  "vijayapura": ["ವಿಯಜಪುರ", "ವಿಜಯಪುರ", "ವಿಜಯಪುರದಲ್ಲಿ"],
  "bijapur": ["ವಿಜಯಪುರ", "ಬಿಜಾಪುರ", "ವಿಜಯಪುರದಲ್ಲಿ"],

  // Conversational Kanglish Pronouns & Greetings
  "namaskara": ["ನಮಸ್ಕಾರ", "ನಮಸ್ಕಾರಗಳು", "ನಮಸ್ತೆ"],
  "namaskar": ["ನಮಸ್ಕಾರ", "ನಮಸ್ಕಾರಗಳು", "ನಮಸ್ತೆ"],
  "namaste": ["ನಮಸ್ತೆ", "ನಮಸ್ಕಾರ", "ನಮಸ್ಕಾರಗಳು"],
  "kannada": ["ಕನ್ನಡ", "ಕನ್ನಡದ", "ಕನ್ನಡಿಗ"],
  "karnataka": ["ಕರ್ನಾಟಕ", "ಕರ್ನಾಟಕದ", "ಕರ್ನಾಟಕದಲ್ಲಿ"],
  "namma": ["ನಮ್ಮ", "ನಮ್ಮದು", "ನಮ್ಮಲ್ಲಿ"],
  "nanna": ["ನನ್ನ", "ನನ್ನದು", "ನನ್ನಲ್ಲಿ"],
  "nanage": ["ನನಗೆ", "ನನಗೋಸ್ಕರ", "ನನ್ನಿಂದ"],
  "nange": ["ನನಗೆ", "ನಂಗೆ", "ನನಗೋಸ್ಕರ"],
  "namage": ["ನಮಗೆ", "ನಮಗೋಸ್ಕರ", "ನಮ್ಮಿಂದ"],
  "namge": ["ನಮಗೆ", "ನಮಗೆಲ್ಲಾ", "ನಮಗೋಸ್ಕರ"],
  "ninage": ["ನಿನಗೆ", "ನಿನಗೋಸ್ಕರ", "ನಿನಗಾಗಿ"],
  "ninge": ["ನಿನಗೆ", "ನಿಂಗೆ", "ನಿನಗೋಸ್ಕರ"],
  "avaru": ["ಅವರು", "ಅವರ", "ಅವರಿಗೆ"],
  "avru": ["ಅವರು", "ಅವರಿಗೆ", "ಅವರನ್ನು"],
  "ivaru": ["ಇವರು", "ಇವರ", "ಇವರಿಗೆ"],
  "ivru": ["ಇವರು", "ಇವರಿಗೆ", "ಇವರನ್ನು"],
  "avanu": ["ಅವನು", "ಅವನ", "ಅವನಿಗೆ"],
  "avalu": ["ಅವಳು", "ಅವಳ", "ಅವಳಿಗೆ"],
  "ivanu": ["ಇವನು", "ಇವನ", "ಇವನಿಗೆ"],
  "ivalu": ["ಇವಳು", "ಇವಳ", "ಇವಳಿಗೆ"],
  "adu": ["ಅದು", "ಅದರ", "ಅದಕ್ಕೆ"],
  "idu": ["ಇದು", "ಇದರ", "ಇದಕ್ಕೆ"],
  "yaru": ["ಯಾರು", "ಯಾರಿಗೆ", "ಯಾರದು"],
  "yaaru": ["ಯಾರು", "ಯಾರಿಗೆ", "ಯಾರದು"],
  "enu": ["ಏನು", "ಏನದು", "ಏನಪ್ಪಾ"],
  "eenu": ["ಏನು", "ಏನದು", "ಏನಪ್ಪಾ"],
  "yake": ["ಯಾಕೆ", "ಯಾಕ್", "ಯಾಕಪ್ಪಾ"],
  "yaake": ["ಯಾಕೆ", "ಯಾಕ್", "ಯಾಕಪ್ಪಾ"],
  "yavaga": ["ಯಾವಾಗ", "ಯಾವಾಗಿನಿಂದ", "ಯಾವಾಗಲೂ"],
  "yaavaga": ["ಯಾವಾಗ", "ಯಾವಾಗಿನಿಂದ", "ಯಾವಾಗಲೂ"],
  "yelli": ["ಎಲ್ಲಿ", "ಎಲ್ಲಿದ್ದೀರಾ", "ಎಲ್ಲಿದೆ"],
  "elli": ["ಎಲ್ಲಿ", "ಎಲ್ಲಿದ್ದೀರಾ", "ಎಲ್ಲಿದೆ"],
  "hege": ["ಹೇಗೆ", "ಹೇಗಿದ್ದೀರಾ", "ಹೇಗೋ"],
  "heege": ["ಹೀಗೆ", "ಹೀಗೇ", "ಹೀಗಿದೆ"],
  "hage": ["ಹಾಗೆ", "ಹಾಗೇ", "ಹಾಗಿದ್ದಾಗ"],
  "haage": ["ಹಾಗೆ", "ಹಾಗೇ", "ಹಾಗಿದ್ದಾಗ"],
  "yella": ["ಎಲ್ಲಾ", "ಎಲ್ಲ", "ಎಲ್ಲರಿಗೂ"],
  "ella": ["ಎಲ್ಲಾ", "ಎಲ್ಲ", "ಎಲ್ಲರಿಗೂ"],
  "eshtu": ["ಎಷ್ಟು", "ಎಷ್ಟಿದೆ", "ಎಷ್ಟೊಂದು"],
  "ashtu": ["ಅಷ್ಟು", "ಅಷ್ಟೇ", "ಅಷ್ಟೊಂದು"],
  "ishtu": ["ಇಷ್ಟು", "ಇಷ್ಟೇ", "ಇಷ್ಟೊಂದು"],

  // Conversational Food, Work & Places
  "oota": ["ಊಟ", "ಊಟವಾಯ್ತಾ", "ಊಟದ"],
  "ootha": ["ಊಟ", "ಊಟವಾಯ್ತಾ", "ಊಟದ"],
  "ootada": ["ಊಟದ", "ಊಟಕ್ಕೆ", "ಊಟದಲ್ಲಿ"],
  "oota aitha": ["ಊಟ ಆಯ್ತಾ", "ಊಟವಾಯ್ತಾ", "ಊಟ ಆಯ್ತು"],
  "oota aytha": ["ಊಟ ಆಯ್ತಾ", "ಊಟವಾಯ್ತಾ", "ಊಟ ಆಯ್ತು"],
  "ootavayta": ["ಊಟವಾಯ್ತಾ", "ಊಟ ಆಯ್ತಾ", "ಊಟ ಆಯ್ತು"],
  "bhashe": ["ಭಾಷೆ", "ಭಾಷೆಯ", "ಭಾಷೆಗಳು"],
  "basha": ["ಭಾಷೆ", "ಭಾಷೆಯ", "ಭಾಷೆಗಳು"],
  "desha": ["ದೇಶ", "ದೇಶದ", "ದೇಶದಲ್ಲಿ"],
  "halli": ["ಹಳ್ಳಿ", "ಹಳ್ಳಿಯ", "ಹಳ್ಳಿಯಲ್ಲಿ"],
  "uru": ["ಊರು", "ಊರಿನ", "ಊರಿನಲ್ಲಿ"],
  "ooru": ["ಊರು", "ಊರಿನ", "ಊರಿನಲ್ಲಿ"],
  "mane": ["ಮನೆ", "ಮನೆಗೆ", "ಮನೆಯ"],
  "maneli": ["ಮನೆಯಲ್ಲಿ", "ಮನೆಗೆ", "ಮನೆಯಿಂದ"],
  "kelasa": ["ಕೆಲಸ", "ಕೆಲಸದ", "ಕೆಲಸದಲ್ಲಿ"],
  "kelsa": ["ಕೆಲಸ", "ಕೆಲಸದ", "ಕೆಲಸದಲ್ಲಿ"],
  "samachara": ["ಸಮಾಚಾರ", "ಏನು ಸಮಾಚಾರ", "ಸುದ್ದಿ"],
  "huttu": ["ಹುಟ್ಟು", "ಹುಟ್ಟಿದ", "ಹುಟ್ಟುಹಬ್ಬ"],
  "habba": ["ಹಬ್ಬ", "ಹಬ್ಬದ", "ಹಬ್ಬಗಳು"],
  "utsava": ["ಉತ್ಸವ", "ಉತ್ಸವದ", "ಉತ್ಸವಗಳು"],
  "jatra": ["ಜಾತ್ರೆ", "ಜಾತ್ರಾ", "ಜಾತ್ರೆಯ"],
  "jaatre": ["ಜಾತ್ರೆ", "ಜಾತ್ರಾ", "ಜಾತ್ರೆಯ"],
  "devasthana": ["ದೇವಸ್ಥಾನ", "ದೇವಸ್ಥಾನಕ್ಕೆ", "ದೇವಾಲಯ"],
  "devalaya": ["ದೇವಾಲಯ", "ದೇವಾಲಯದ", "ಗುಡಿ"],
  "gudi": ["ಗುಡಿ", "ಗುಡಿಯ", "ದೇವಸ್ಥಾನ"],
  "swamy": ["ಸ್ವಾಮಿ", "ಸ್ವಾಮಿಗಳು", "ಸ್ವಾಮಿಯೇ"],
  "swami": ["ಸ್ವಾಮಿ", "ಸ್ವಾಮಿಗಳು", "ಸ್ವಾಮಿಯೇ"],
  "guru": ["ಗುರು", "ಗುರುಗಳೇ", "ಗುರುದೇವಾ"],
  "shiva": ["ಶಿವ", "ಶಿವನ", "ಶಿವಾಯ"],
  "amma": ["ಅಮ್ಮ", "ಅಮ್ಮನ", "ಅಮ್ಮನಿಗೆ"],
  "appa": ["ಅಪ್ಪ", "ಅಪ್ಪನ", "ಅಪ್ಪನಿಗೆ"],
  "anna": ["ಅಣ್ಣ", "ಅನ್ನ", "ಅಣ್ಣನಿಗೆ"],
  "akka": ["ಅಕ್ಕ", "ಅಕ್ಕನ", "ಅಕ್ಕನಿಗೆ"],
  "tangi": ["ತಂಗಿ", "ತಂಗಿಯ", "ತಂಗಿಗೆ"],
  "thamma": ["ತಮ್ಮ", "ತಮ್ಮನ", "ತಮ್ಮನಿಗೆ"],
  "maga": ["ಮಗ", "ಮಗನೇ", "ಮಗನಿಗೆ"],
  "magalu": ["ಮಗಳು", "ಮಗಳೇ", "ಮಗಳಿಗೆ"],
  "macha": ["ಮಚ್ಚಾ", "ಮಚ", "ಗೆಳೆಯ"],
  "huduga": ["ಹುಡುಗ", "ಹುಡುಗನ", "ಹುಡುಗನಿಗೆ"],
  "hudugi": ["ಹುಡುಗಿ", "ಹುಡುಗಿಯ", "ಹುಡುಗಿಗೆ"],
  "sneha": ["ಸ್ನೇಹ", "ಸ್ನೇಹದ", "ಸ್ನೇಹಿತ"],
  "snehita": ["ಸ್ನೇಹಿತ", "ಸ್ನೇಹಿತರೇ", "ಗೆಳೆಯ"],
  "khushi": ["ಖುಷಿ", "ಖುಷಿಯಾಗಿದೆ", "ಸಂತೋಷ"],
  "kushi": ["ಖುಷಿ", "ಖುಷಿಯಾಗಿದೆ", "ಸಂತೋಷ"],
  "santosha": ["ಸಂತೋಷ", "ಸಂತೋಷದ", "ಖುಷಿ"],
  "santhosha": ["ಸಂತೋಷ", "ಸಂತೋಷದ", "ಖುಷಿ"],
  "preethi": ["پریتی", "ಪ್ರೀತಿ", "ಪ್ರೀತಿಯ", "ಪ್ರೀತಿಯಿಂದ"], // Wait, let's remove non-kannada scripts
  "preeti": ["ಪ್ರೀತಿ", "ಪ್ರೀತಿಯ", "ಪ್ರೀತಿಯಿಂದ"],
  "dhanyavada": ["ಧನ್ಯವಾದ", "ಧನ್ಯವಾದಗಳು", "ಥ್ಯಾಂಕ್ಸ್"],
  "dhanyavadagalu": ["ಧನ್ಯವಾದಗಳು", "ಧನ್ಯವಾದ", "ವಂದನೆಗಳು"],
  "shubhodaya": ["ಶುಭೋದಯ", "ಶುಭೋದಯಗಳು", "ಶುಭ ಮುಂಜಾನೆ"],
  "shubharathri": ["ಶುಭರಾತ್ರಿ", "ಶುಭರಾತ್ರಿಗಳು", "ಶುಭ ರಾತ್ರಿ"],
  "sanje": ["ಸಂಜೆ", "ಸಂಜೆಯ", "ಸಂಜೆ ವೇಳೆ"],
  "belage": ["ಬೆಳಗ್ಗೆ", "ಬೆಳಿಗ್ಗೆ", "ಮುಂಜಾನೆ"],
  "beligge": ["ಬೆಳಿಗ್ಗೆ", "ಬೆಳಗ್ಗೆ", "ಮುಂಜಾನೆ"],
  "madhyahna": ["ಮಧ್ಯಾಹ್ನ", "ಮಧ್ಯಾಹ್ನದ", "ಮಧ್ಯಾಹ್ನಕ್ಕೆ"],
  "ratri": ["ರಾತ್ರಿ", "ರಾತ್ರಿಯ", "ರಾತ್ರಿಯಲ್ಲಿ"],
  "raathri": ["ರಾತ್ರಿ", "ರಾತ್ರಿಯ", "ರಾತ್ರಿಯಲ್ಲಿ"],
  "dina": ["ದಿನ", "ದಿನದ", "ದಿನಗಳು"],
  "dinavu": ["ದಿನವು", "ದಿನದ", "ದಿನಗಳು"],
  "vara": ["ವಾರ", "ವಾರದ", "ವಾರಗಳು"],
  "tingalu": ["ತಿಂಗಳು", "ತಿಂಗಳ", "ತಿಂಗಳುಗಳು"],
  "varsha": ["ವರ್ಷ", "ವರ್ಷದ", "ವರ್ಷಗಳು"],
  "kala": ["ಕಾಲ", "ಕಾಲದ", "ಕಾಲದಲ್ಲಿ"],
  "samaya": ["ಸಮಯ", "ಸಮಯದ", "ಸಮಯಕ್ಕೆ"],
  "neeru": ["ನೀರು", "ನೀರಿನ", "ನೀರಿನಲ್ಲಿ"],
  "bisi": ["ಬಿಸಿ", "ಬಿಸಿ ಬಿಸಿ", "ಬಿಸಿಯಾದ"],
  "tampu": ["ತಂಪು", "ತಂಪಾದ", "ತಂಪಾಗಿದೆ"],
  "tindi": ["ತಿಂಡಿ", "ತಿಂಡಿಯ", "ತಿಂಡಿಗೆ"],
  "halu": ["ಹಾಲು", "ಹಾಲಿನ", "ಹಾಲಿಗೆ"],
  "haalu": ["ಹಾಲು", "ಹಾಲಿನ", "ಹಾಲಿಗೆ"],
  "hannu": ["ಹಣ್ಣು", "ಹಣ್ಣಿನ", "ಹಣ್ಣುಗಳು"],

  // Quantities & Adverbs
  "tumba": ["ತುಂಬಾ", "ತುಂಬ", "ತುಂಬಾನೇ"],
  "swalpa": ["ಸ್ವಲ್ಪ", "ಸ್ವಲ್ಪವೇ", "ಸ್ವಲ್ಪನಾದರೂ"],
  "solpa": ["ಸ್ವಲ್ಪ", "ಸ್ವಲ್ಪವೇ", "ಸ್ವಲ್ಪನಾದರೂ"],
  "matte": ["ಮತ್ತೆ", "ಮತ್ತೇನು", "ಮತ್ತೆ ಮತ್ತೆ"],
  "mathe": ["ಮತ್ತೆ", "ಮತ್ತೇನು", "ಮತ್ತೆ ಮತ್ತೆ"],
  "innu": ["ಇನ್ನೂ", "ಇನ್ನೊಂದು", "ಇನು"],
  "saku": ["ಸಾಕು", "ಸಾಕಾಗುವುದಿಲ್ಲ", "ಸಾಕಾಗಿದೆ"],
  "beda": ["ಬೇಡ", "ಬೇಡವೇ ಬೇಡ", "ಬೇಡವೆಂದು"],
  "beku": ["ಬೇಕು", "ಬೇಕಾಗಿದೆ", "ಬೇಕಾ"],
  "gotta": ["ಗೊತ್ತಾ", "ಗೊತ್ತು", "ಗೊತ್ತಿಲ್ಲ"],
  "gottilla": ["ಗೊತ್ತಿಲ್ಲ", "ಗೊತ್ತೇ ಇಲ್ಲ", "ಗೊತ್ತಿಲ್ಲದ"],
  "gothilla": ["ಗೊತ್ತಿಲ್ಲ", "ಗೊತ್ತೇ ಇಲ್ಲ", "ಗೊತ್ತಿಲ್ಲದ"],
  "bega": ["ಬೇಗ", "ಬೇಗನೇ", "ಬೇಗ ಬೇಗ"],
  "nidhana": ["ನಿಧಾನ", "ನಿಧಾನವಾಗಿ", "ನಿಧಾನಕ್ಕೆ"],

  // Slang & Conversational tags
  "sakkath": ["ಸಕ್ಕತ್", "ಸಕ್ಕತ್ತಾಗಿದೆ", "ಭರ್ಜರಿ"],
  "bombat": ["ಬೊಂಬಾಟ್", "ಸೂಪರ್", "ಭರ್ಜರಿ"],
  "chindi": ["ಚಿಂದಿ", "ಚಿಂಡಿ", "ಸೂಪರ್"],
  "dabba": ["ಡಬ್ಬ", "ಡಬ್ಬಾ", "ಹಾಳಾದ"],
  "kirik": ["ಕಿರಿಕ್", "ಕಿರಿಕಿರಿ", "ಲಫಡಾ"],
  "ganchali": ["ಗಾಂಚಲಿ", "ಗಾಂಚಲಿ ಬಿಡು", "ಅಹಂಕಾರ"],
  "goobe": ["ಗೂಬೆ", "ಗೂಬೆಯ ತರಹ", "ಮೂರ್ಖ"],
  "adjust": ["ಅಡ್ಜಸ್ಟ್", "ಹೊಂದಾಣಿಕೆ", "ಅಡ್ಜಸ್ಟ್ ಮಾಡಿ"],

  // Verbs & Commands
  "banni": ["ಬನ್ನಿ", "ಬನ್ನಿ ಬನ್ನಿ", "ಬಂದರು"],
  "hogu": ["ಹೋಗು", "ಹೋಗಿ", "ಹೋಗಿರಿ"],
  "hogi": ["ಹೋಗಿ", "ಹೋಗಬೇಡಿ", "ಹೋಗಿರಿ"],
  "baro": ["ಬಾರೋ", "ಬನ್ನಿ", "ಬಾ"],
  "bare": ["ಬಾರೇ", "ಬನ್ನಿ", "ಬಾ"],
  "hogo": ["ಹೋಗೋ", "ಹೋಗು", "ಹೋಗಿ"],
  "hoge": ["ಹೋಗೇ", "ಹೋಗು", "ಹೋಗಿ"],
  "madu": ["ಮಾಡು", "ಮಾಡಿ", "ಮಾಡೋಣ"],
  "madi": ["ಮಾಡಿ", "ಮಾಡಿರಿ", "ಮಾಡು"],
  "maadi": ["ಮಾಡಿ", "ಮಾಡಿರಿ", "ಮಾಡು"],
  "kodi": ["ಕೊಡಿ", "ಕೊಡು", "ಕೊಡಿರಿ"],
  "togo": ["ತಗೋ", "ತಗೊಳ್ಳಿ", "ತಗೋಳಿ"],
  "nodu": ["ನೋಡು", "ನೋಡಿ", "ನೋಡೋಣ"],
  "nodi": ["ನೋಡಿ", "ನೋಡಿರಿ", "ನೋಡು"],
  "kelu": ["ಕೇಳು", "ಕೇಳಿ", "ಕೇಳೋಣ"],
  "keli": ["ಕೇಳಿ", "ಕೇಳಿರಿ", "ಕೇಳು"],
  "helu": ["ಹೇಳು", "ಹೇಳಿ", "ಹೇಳೋಣ"],
  "heli": ["ಹೇಳಿ", "ಹೇಳಿರಿ", "ಹೇಳು"],
  "madtini": ["ಮಾಡ್ತೀನಿ", "ಮಾಡುತ್ತೇನೆ", "ಮಾಡೋಣ"],
  "maadtini": ["ಮಾಡ್ತೀನಿ", "ಮಾಡುತ್ತೇನೆ", "ಮಾಡೋಣ"],
  "hogtini": ["ಹೋಗ್ತೀನಿ", "ಹೋಗುತ್ತೇನೆ", "ಹೋಗೋಣ"],
  "bartini": ["ಬರ್ತೀನಿ", "ಬರುತ್ತೇನೆ", "ಬರೋಣ"],
  "barthini": ["ಬರ್ತೀನಿ", "ಬರುತ್ತೇನೆ", "ಬರೋಣ"],
  "helteeny": ["ಹೇಳ್ತೀನಿ", "ಹೇಳುತ್ತೇನೆ", "ಹೇಳೋಣ"],
  "heltini": ["ಹೇಳ್ತೀನಿ", "ಹೇಳುತ್ತೇನೆ", "ಹೇಳೋಣ"],
  "kelteeni": ["ಕೇಳ್ತೀನಿ", "ಕೇಳುತ್ತೇನೆ", "ಕೇಳೋಣ"],
  "keltini": ["ಕೇಳ್ತೀನಿ", "ಕೇಳುತ್ತೇನೆ", "ಕೇಳೋಣ"],
  "nodtini": ["ನೋಡ್ತೀನಿ", "ನೋಡುತ್ತೇನೆ", "ನೋಡೋಣ"],
  "odhu": ["ಓದು", "ಓದಿ", "ಓದುತ್ತೇನೆ"],
  "odhi": ["ಓದಿ", "ಓದು", "ಓದಿರಿ"],
  "bari": ["ಬರೆ", "ಬರಿ", "ಬರೆಯಿರಿ"],
  "bareyiri": ["ಬರೆಯಿರಿ", "ಬರೆ", "ಬರೆಯಿರಿ"],
  "kootko": ["ಕೂತ್ಕೋ", "ಕುಳಿತುಕೋ", "ಕೂತ್ಕೊಳ್ಳಿ"],
  "nillu": ["nಿಲ್ಲು", "ನಿಲ್ಲಿಸಿ", "ನಿಲ್ಲೋಣ"],
  "nidde": ["ನಿದ್ದೆ", "ನಿದ್ರೆ", "ಮಲಗು"],
  "pustaka": ["ಪುಸ್ತಕ", "ಪುಸ್ತಕಗಳು", "ಬುಕ್"],
  "sahitya": ["ಸಾಹಿತ್ಯ", "ಸಾಹಿತ್ಯದ", "ಸಾಹಿತ್ಯದಲ್ಲಿ"],
  "kannadigaru": ["ಕನ್ನಡಿಗರು", "ಕನ್ನಡಿಗ", "ಕನ್ನಡಿಗರಿಗೆ"],
  "kannadiga": ["ಕನ್ನಡಿಗ", "ಕನ್ನಡಿಗರು", "ಕನ್ನಡಿಗನ"],
  "rajyotsava": ["ರಾಜ್ಯೋತ್ಸವ", "ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ", "ಹಬ್ಬ"],
  "sirigannada": ["ಸಿರಿಗನ್ನಡ", "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ", "ಕನ್ನಡ"]
}

// ── ADVANCED PHONETIC TRANSLITERATION ENGINE ────────────────────────────────
export function transliterateWord(word: string, overrides: { [key: string]: string } = {}, options: { useRetroflex?: boolean } = {}): string {
  if (!word) return ""
  const lowerWord = word.toLowerCase()
  
  // 1. Check overrides
  if (overrides[lowerWord]) {
    return overrides[lowerWord]
  }
  
  // 2. Check dictionary match
  if (KANNADA_DICTIONARY[lowerWord]) {
    return KANNADA_DICTIONARY[lowerWord][0]
  }

  // 3. Preprocess English phonetic patterns to match Kannada structure
  let processed = word;
  
  // Apply retroflex guesses
  if (options.useRetroflex) {
    processed = processed.replace(/ll/gi, "L");
    processed = processed.replace(/nd/gi, "ND");
    processed = processed.replace(/nt/gi, "NT");
  }

  // Nasal assimilation: Map 'm' or 'n' before consonants to 'M' (anusvara)
  processed = processed.replace(/m(?=[bpfBHP])/gi, "M");
  processed = processed.replace(/n(?=[dtkgcjDDTGJS])/gi, "M");

  let result = ""
  let i = 0
  const len = processed.length

  while (i < len) {
    const char = processed[i]

    // Skip non-alphabetic chars
    if (/[^a-zA-Z]/g.test(char)) {
      result += char
      i++
      continue
    }

    // ── ANUSVARA SPECIAL CASE ──
    if (char === "M" || char === "m" && i + 1 < len && !/[aeiou]/i.test(processed[i+1])) {
      result += "ಂ"
      i++
      continue
    }

    // ── CONSONANT MATCHING ──
    let consKey = ""
    let step = 0
    
    if (i + 2 < len && CONSONANTS[processed.substring(i, i + 3).toLowerCase()]) {
      consKey = processed.substring(i, i + 3).toLowerCase()
      step = 3
    } else if (i + 1 < len && CONSONANTS[processed.substring(i, i + 2).toLowerCase()]) {
      consKey = processed.substring(i, i + 2).toLowerCase()
      step = 2
    } else if (CONSONANTS[char]) {
      consKey = char // Case-sensitive check for retroflex T, D, N, L, Sh
      step = 1
    } else if (CONSONANTS[char.toLowerCase()]) {
      consKey = char.toLowerCase()
      step = 1
    }

    if (consKey) {
      const baseGlyph = CONSONANTS[consKey]
      i += step

      // ── VOWEL MATRA CHECK ──
      let vowelKey = ""
      let vStep = 0

      if (i + 2 < len && MATRAS[processed.substring(i, i + 3).toLowerCase()] !== undefined) {
        vowelKey = processed.substring(i, i + 3).toLowerCase()
        vStep = 3
      } else if (i + 1 < len && MATRAS[processed.substring(i, i + 2).toLowerCase()] !== undefined) {
        vowelKey = processed.substring(i, i + 2).toLowerCase()
        vStep = 2
      } else if (i < len && MATRAS[processed[i]] !== undefined) {
        vowelKey = processed[i] // Case-sensitive
        vStep = 1
      } else if (i < len && MATRAS[processed[i].toLowerCase()] !== undefined) {
        vowelKey = processed[i].toLowerCase()
        vStep = 1
      }

      if (vStep > 0) {
        result += baseGlyph + MATRAS[vowelKey]
        i += vStep
      } else {
        // No vowel following: add Virama (್) to form conjunct/half-letter
        result += baseGlyph + "್"
      }
    } else {
      // ── ISOLATED VOWEL MATCHING ──
      let vowelKey = ""
      let vStep = 0

      if (i + 2 < len && VOWELS[processed.substring(i, i + 3).toLowerCase()] !== undefined) {
        vowelKey = processed.substring(i, i + 3).toLowerCase()
        vStep = 3
      } else if (i + 1 < len && VOWELS[processed.substring(i, i + 2).toLowerCase()] !== undefined) {
        vowelKey = processed.substring(i, i + 2).toLowerCase()
        vStep = 2
      } else if (VOWELS[char] !== undefined) {
        vowelKey = char // Case-sensitive
        vStep = 1
      } else if (VOWELS[char.toLowerCase()] !== undefined) {
        vowelKey = char.toLowerCase()
        vStep = 1
      }

      if (vStep > 0) {
        result += VOWELS[vowelKey]
        i += vStep
      } else {
        result += char
        i++
      }
    }
  }

  // Clean up trailing halant/virama on word boundaries
  return result.replace(/್$/, "")
}

// ── TRANSLITERATE ENTIRE DOCUMENT ──────────────────────────────────────────
export function transliterateDocument(text: string, overrides: { [key: string]: string } = {}): string {
  const tokens = text.split(/([a-zA-Z]+)/)
  const translatedTokens = tokens.map(token => {
    if (/^[a-zA-Z]+$/.test(token)) {
      return transliterateWord(token, overrides, { useRetroflex: true })
    }
    return token
  })
  return translatedTokens.join("")
}

// ── DYNAMIC SUGGESTIONS GENERATOR ──────────────────────────────────────────
export function generateSuggestions(word: string, overrides: { [key: string]: string } = {}): string[] {
  if (!word || !/^[a-zA-Z]+$/.test(word)) {
    return []
  }

  const lower = word.toLowerCase()
  const options: string[] = []

  // 1. Check dictionary first
  if (KANNADA_DICTIONARY[lower]) {
    return KANNADA_DICTIONARY[lower].slice(0, 3)
  }

  // 2. Generate phonetic options dynamically
  const optA = transliterateWord(word, overrides, { useRetroflex: true })
  options.push(optA)

  // Option B: Without retroflex modifications (fallback to dental)
  const optB = transliterateWord(word, overrides, { useRetroflex: false })
  if (optB && optB !== optA) options.push(optB)

  // Option C: Alternate endings / spelling guessers
  let optC = ""
  if (lower.endsWith("a")) {
    const modified = word.slice(0, -1) + "aa"
    optC = transliterateWord(modified, overrides, { useRetroflex: true })
  } else if (lower.endsWith("i")) {
    const modified = word.slice(0, -1) + "ee"
    optC = transliterateWord(modified, overrides, { useRetroflex: true })
  } else {
    optC = transliterateWord(word + "a", overrides, { useRetroflex: true })
  }
  
  if (optC && optC !== optA && optC !== optB) options.push(optC)

  // Final options padding
  if (options.length < 3) {
    options.push(optA + "ಾ")
  }

  return options.slice(0, 3)
}
