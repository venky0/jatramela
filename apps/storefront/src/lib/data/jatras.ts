export interface Jatra {
  id: string
  handle: string
  title: string
  titleKannada: string
  deity: string
  place: string
  district: string
  kannadaMonth: string
  gregorianMonths: string[]
  timing: string
  image: string
  summary: string
  history: string
  rituals: string[]
  significance: string
}

export const JATRA_DATA: Jatra[] = [
  {
    id: "jatra_mysuru_dasara",
    handle: "mysuru-dasara-jatra",
    title: "Mysuru Dasara Chamundeshwari Jatra",
    titleKannada: "ಮೈಸೂರು ದಸರಾ ಚಾಮುಂಡೇಶ್ವರಿ ಜಾತ್ರೆ",
    deity: "Goddess Chamundeshwari (Durga)",
    place: "Chamundi Hills, Mysuru",
    district: "Mysuru",
    kannadaMonth: "Ashwayuja (September - October)",
    gregorianMonths: ["September", "October"],
    timing: "Ashwayuja Shuddha Prathipade to Vijayadashami",
    image: "/images/jatras/mysuru-dasara.png",
    summary: "The state festival of Karnataka (Nada Habba) celebrating Goddess Chamundeshwari's victory over the demon Mahishasura, featuring the legendary Jumboo Savari elephant procession.",
    history: "Dating back to the 15th century Vijayanagara Empire and continued by the Wadiyars of Mysuru since 1610, this festival honors Chamundeshwari, the warrior goddess. In Hindu history, the region of Mysuru (Mahishur) was ruled by the buffalo demon Mahishasura. Goddess Parvati descended as Chamundeshwari, fought a fierce battle on the hills, and slayed him on Vijayadashami day. This Jatra represents the supreme victory of righteousness (Dharma) over evil.",
    rituals: [
      "Special Abhisheka and worship of Goddess Chamundeshwari atop Chamundi Hills.",
      "Kala-karshana and royal weapon worship (Aayudha Pooja) by the descendants of the Mysuru Royal Family.",
      "Jumboo Savari (Elephant Procession) carrying the golden howdah (Chinnada Ambari) housing the Goddess.",
      "Torchlight Parade (Panjina Kavayathu) at Bannimantap grounds.",
      "Teppotsava (Floating festival) in the sacred temple tank."
    ],
    significance: "Mysuru Dasara is the peak expression of royal grandeur coupled with Hindu devotion. It unites the entire state of Karnataka in honoring the supreme maternal power (Shakti). The 750 kg golden howdah and the decorated elephants represent the peak of traditional heritage and craftsmanship."
  },
  {
    id: "jatra_sharanabasaveshwara",
    handle: "sharanabasaveshwara-jatra",
    title: "Sri Sharanabasaveshwara Jatra",
    titleKannada: "ಶ್ರೀ ಶರಣಬಸವೇಶ್ವರ ಜಾತ್ರೆ",
    deity: "Saint Sharanabasaveshwara (incarnation of Lord Shiva)",
    place: "Sri Sharanabasaveshwara Temple, Kalaburagi",
    district: "Kalaburagi",
    kannadaMonth: "Chaitra (March - April)",
    gregorianMonths: ["March", "April", "May"],
    timing: "Chaitra Bahula Panchami (20 days after Yugadi)",
    image: "/images/jatras/sharanabasaveshwara.png",
    summary: "A massive, spiritually charged chariot festival (Rathotsava) attracting lakhs of devotees, honoring the great Veerashaiva saint who preached charity and selfless work.",
    history: "Sri Sharanabasaveshwara was a prominent 19th-century Lingayat saint, philosopher, and social reformer who practiced 'Dasoha' (selfless feeding and sharing) and 'Kayaka' (work is worship). When he attained Samadhi in 1822, his shrine became a major center of pilgrimage. The annual Jatra commemorates his life, and the pulling of the giant wooden chariot (Rathotsava) symbolizes the elevation of the soul towards divine consciousness.",
    rituals: [
      "Uchchayi - the ceremonial raising of the temple flag.",
      "Rathotsava (Chariot Procession) where lakhs of devotees pull the ropes of the gigantic decorated wooden chariot.",
      "Offering of coconuts and bananas (Phalapushpa) to the chariot as it moves.",
      "Dasoha (mass feeding) of prasadam to hundreds of thousands of pilgrims.",
      "Siddhalinga Pooja at the inner sanctum (Garbhagriha)."
    ],
    significance: "This Jatra is a powerful symbol of communal harmony, selfless service, and devotional ecstasy. The sky is filled with vermilion (Kumkum) and turmeric (Arishina) dust thrown in devotion by the pilgrims. It is one of the largest chariot festivals in North Karnataka."
  },
  {
    id: "jatra_hampi_utsav",
    handle: "hampi-vijaya-utsav",
    title: "Hampi Vijaya Utsav (Vijayanagara Jatra)",
    titleKannada: "ಹಂಪಿ ವಿಜಯ ಉತ್ಸವ (ವಿಜಯನಗರ ಜಾತ್ರೆ)",
    deity: "Lord Virupaksha & Goddess Pampa",
    place: "Virupaksha Temple Complex, Hampi",
    district: "Vijayanagara",
    kannadaMonth: "Karthika (November)",
    gregorianMonths: ["November"],
    timing: "Annual 3-day cultural and spiritual Jatra",
    image: "/images/jatras/hampi-utsav.png",
    summary: "A majestic cultural and spiritual confluence set against the ruins of the Vijayanagara Empire, bringing to life the golden era of Hindu heritage.",
    history: "Historically celebrated during the reign of the Vijayanagara Emperors (especially Sri Krishnadevaraya), this festival celebrates the glory of South India's greatest empire. The Virupaksha Temple, dedicated to Lord Shiva, is one of the few structures that survived the destruction of Hampi, and remains active. The Jatra is held to invoke the divine blessings of Lord Virupaksha and commemorate the rise of the empire as the protector of Sanatana Dharma.",
    rituals: [
      "Grand Pooja and Maha Mangalarathi at the historical Virupaksha Temple.",
      "Virupaksha Rathotsava (Chariot festival) through the ancient Hampi Bazaar street.",
      "Deepotsava - illumination of the Tungabhadra river banks with thousands of oil lamps.",
      "Traditional Janapada Kalas (folk art performances) on stone stages.",
      "Shobha Yatra - a grand cultural parade of artists, musicians, and decorated elephants."
    ],
    significance: "Hampi Vijaya Utsav is a window into the artistic, architectural, and spiritual peak of Hindu civilization. The combination of ancient stone monuments glowing with golden light and devotional music creates an ethereal, power-filled atmosphere."
  },
  {
    id: "jatra_kadalekai_parishe",
    handle: "basavanagudi-kadalekai-parishe",
    title: "Basavanagudi Kadalekai Parishe",
    titleKannada: "ಬಸವನಗುಡಿ ಕಡಲೇಕಾಯಿ ಪರಿಷೆ",
    deity: "Lord Nandi (Sacred Bull) & Lord Ganesha",
    place: "Bull Temple (Dodda Basavana Gudi), Bengaluru",
    district: "Bengaluru Urban",
    kannadaMonth: "Karthika (November - December)",
    gregorianMonths: ["November", "December"],
    timing: "Karthika Somavara (Last Monday of Karthika Month)",
    image: "/images/jatras/kadalekai-parishe.png",
    summary: "The legendary groundnut fair of Bengaluru, where farmers offer their first harvest of peanuts to the giant sacred bull deity to invoke crop protection and prosperity.",
    history: "In the 16th century, wild bulls frequented Basavanagudi's peanut fields, destroying the harvest. The founder of Bengaluru, Kempegowda, constructed the Bull Temple housing a colossal monolithic Nandi statue and pledged to offer the first harvest to the deity. The bull became peaceful, and the tradition of the annual peanut fair (Kadalekai Parishe) was born. It has been celebrated continuously for over 500 years.",
    rituals: [
      "Offering of Kadalekai (groundnuts) of various varieties to the monolithic Nandi.",
      "Maha Abhisheka of the sacred Nandi statue with milk and honey.",
      "Karthika Deepotsava - lighting of hundreds of clay lamps in and around the temple courtyard.",
      "Laksha Deepotsava at the adjacent Dodda Ganesha Temple.",
      "Street fair with farmers from Karnataka, Andhra Pradesh, and Tamil Nadu."
    ],
    significance: "Kadalekai Parishe represents the deep agrarian roots of Hindu society and the sacred bond between humanity, nature, and divine animals. The temple and its surrounding streets come alive with devotional energy, temple bells, and the earthy aroma of roasted peanuts."
  },
  {
    id: "jatra_banashankari_devi",
    handle: "banashankari-devi-jatre",
    title: "Banashankari Devi Jatre",
    titleKannada: "ಬನಶಂಕರಿ ದೇವಿ ಜಾತ್ರೆ",
    deity: "Goddess Banashankari (Shakambhari)",
    place: "Banashankari Temple, Cholachagudda, Badami",
    district: "Bagalkot",
    kannadaMonth: "Pushya (January - February)",
    gregorianMonths: ["January", "February"],
    timing: "Pushya Shuddha Poornima",
    image: "/images/jatras/banashankari-devi.png",
    summary: "A vibrant annual temple fair in the historic town of Badami, drawing lakhs of devotees to worship Goddess Banashankari, known as the goddess of forests and vegetation.",
    history: "The temple was originally constructed by the Chalukyas of Badami in the 7th century. According to the Skanda Purana, the goddess slayed a demon named Durgamasura here, who had caused a severe drought. The goddess saved the people by providing food (vegetables and herbs), earning her the name Shakambhari (or Banashankari, goddess of the forest). The annual Jatre marks this divine event of sustenance and survival.",
    rituals: [
      "Panchamrutha Abhisheka and special floral decoration (Alankara) of the deity.",
      "Rathotsava (Chariot procession) where the decorated chariot is pulled through the streets.",
      "Offering of special food preparations, including 108 varieties of dishes (Bhandara) to the goddess.",
      "Teppotsava (Floating festival) in the Haridra Tirtha, the sacred temple pond.",
      "A massive cultural fair featuring traditional drama shows and agricultural exhibitions."
    ],
    significance: "This Jatre represents the celebration of nature, agriculture, and the protective feminine energy. The unique custom of offering diverse agricultural produce, vegetables, and local delicacies highlights the integration of spiritual devotion with agrarian thanksgiving."
  },
  {
    id: "jatra_suttur_mahotsav",
    handle: "suttur-jathra-mahotsav",
    title: "Suttur Jathra Mahotsav",
    titleKannada: "ಸುತ್ತೂರು ಜಾತ್ರಾ ಮಹೋತ್ಸವ",
    deity: "Adi Jagadguru Sri Shivarathreeshwara Shivayogi",
    place: "Suttur Sri Veerasimhasana Mahasamsthana Math, Suttur",
    district: "Mysuru",
    kannadaMonth: "Pushya (January)",
    gregorianMonths: ["January"],
    timing: "A 6-day multi-dimensional cultural and spiritual festival in the month of Pushya",
    image: "/images/jatras/suttur-mahotsav.png",
    summary: "A massive six-day socio-religious event on the banks of the Kapila River, blending spiritual rituals, agricultural expos, mass marriages, and educational seminars.",
    history: "Established by the Suttur Math, which has a legacy of over a thousand years starting from Adi Jagadguru Sri Shivarathreeshwara Shivayogi. The Jatra is held to commemorate the divine wisdom and social service of the founder saint, serving as a platform for rural development, spiritual growth, and community welfare.",
    rituals: [
      "Maharathotsava (grand chariot procession) with active participation of lakhs of devotees.",
      "Mass marriage ceremonies (Uchita Vivaha) promoting simple and dowry-free weddings.",
      "Krishi Mela (Agricultural Exhibition) displaying advanced farming techniques and cattle shows.",
      "Deepotsava (festival of lights) on the banks of the Kapila River.",
      "Prabhat Pheri (morning devotional walks) and spiritual discourses by saints."
    ],
    significance: "More than a religious festival, Suttur Jathra is a celebrated model for social reformation, community empowerment, and rural development, attracting thinkers, farmers, and devotees from across the nation."
  },
  {
    id: "jatra_ghati_subrahmanya",
    handle: "ghati-subrahmanya-pushya-rathotsava",
    title: "Ghati Subrahmanya Pushya Rathotsava",
    titleKannada: "ಘಾಟಿ ಸುಬ್ರಹ್ಮಣ್ಯ ಪುಷ್ಯ ರಥೋತ್ಸವ",
    deity: "Lord Subrahmanya (integrated with Lord Lakshmi Narasimha)",
    place: "Ghati Subrahmanya Temple, Doddaballapur",
    district: "Bengaluru Rural",
    kannadaMonth: "Pushya (December - January)",
    gregorianMonths: ["December", "January"],
    timing: "Pushya Shuddha Shashti",
    image: "/images/jatras/ghati-subrahmanya.png",
    summary: "A highly revered chariot festival dedicated to the snake deity Lord Subrahmanya, featuring unique snake-worship rituals and one of the largest cattle fairs in Southern India.",
    history: "The deity of Ghati Subrahmanya is self-manifested (Swayambhu), carved on a single stone representing Lord Subrahmanya facing east and Lord Lakshmi Narasimha facing west, visible through a strategically placed mirror. The Rathotsava marks the divine triumph of Lord Subrahmanya and has been a pilgrimage center for snake-worship (Naga Aradhane) for several centuries.",
    rituals: [
      "Naga Pratishte (consecration of snake stones) and special Abhisheka.",
      "Pushya Rathotsava - pulling of the grand wooden chariot carrying the processional deities.",
      "Ksheerabhisheka - pouring of milk over the self-manifested stone deity.",
      "Offering of special prayers to the Naga mirror structure.",
      "The legendary Ghati Cattle Fair (Goravanahalli Cattle Exhibition) held alongside the festival."
    ],
    significance: "The Jatra serves as a focal point for snake deity worship and environmental harmony, and the cattle fair highlights the deep-rooted economic and agricultural bond of local farmers with their livestock."
  },
  {
    id: "jatra_udupi_paryaya",
    handle: "udupi-paryaya-utsava",
    title: "Udupi Paryaya Utsava",
    titleKannada: "ಉಡುಪಿ ಪರ್ಯಾಯ ಉತ್ಸವ",
    deity: "Lord Sri Krishna",
    place: "Udupi Krishna Math, Udupi",
    district: "Udupi",
    kannadaMonth: "Makara (January)",
    gregorianMonths: ["January"],
    timing: "Biennial (once every two years) on January 18th",
    image: "/images/jatras/udupi-paryaya.png",
    summary: "A grand biennial ceremony where the administration of the historic Udupi Sri Krishna Math is handed over to the next of the Ashta Mathas (Eight Monasteries) founded by Sri Madhvacharya.",
    history: "Initiated by Sri Madhvacharya in the 13th century and later reformed by Sri Vadiraja Teertha in the 16th century, the Paryaya festival marks the formal transfer of worship rights and administration. The incoming Swamiji is handed the Akshaya Patra and keys to the shrine, symbolizing the sacred trust to run the temple and feed thousands of devotees daily.",
    rituals: [
      "Paryaya Darbar - a formal assembly of saints, scholars, and dignitaries.",
      "Pura Pravesha - the ceremonial entry of the incoming Swamiji into Udupi.",
      "Kanakana Kindi Darshana - initial prayers offered to Lord Krishna through the window.",
      "Transfer of the historic Akshaya Patra (inexhaustible vessel) and temple keys.",
      "Grand cultural processions and late-night Teppotsava (floating festival) in Madhwa Sarovara."
    ],
    significance: "The Paryaya is a unique system of rotation and governance in religious history, representing peace, co-existence, and spiritual discipline. The entire city of Udupi is illuminated, turning into a spiritual wonderland."
  },
  {
    id: "jatra_mailara_lingeshwara",
    handle: "mailara-lingeshwara-jatre",
    title: "Mailara Lingeshwara Jatre",
    titleKannada: "ಮೈಲಾರ ಲಿಂಗೇಶ್ವರ ಜಾತ್ರೆ",
    deity: "Lord Mailara Lingeshwara (Shiva)",
    place: "Mailara Lingeshwara Temple, Mylara",
    district: "Vijayanagara",
    kannadaMonth: "Magha (February)",
    gregorianMonths: ["February"],
    timing: "Bharati Hunnime (Full Moon day of Magha month)",
    image: "/images/jatras/mailara-lingeshwara.png",
    summary: "A unique folk-spiritual fair famous for the 'Goravara Kunitha' dance and the 'Karnika Utsava' (divine prophecy of agricultural and political fortunes) delivered by a dedicated priest.",
    history: "According to legend, Lord Shiva took the form of Mailara (Martanda Bhairava) to defeat the demons Mallasura and Manikasura. The annual Jatra celebrates this victory. The devotees (Goravas) dress in black woolen blankets and tiger-skin attire, carrying brass bowls and damarugis, representing the army of Shiva.",
    rituals: [
      "Karnika Utsava - the chief priest climbs a 20-foot bow (Bow of Shiva) and delivers a divine prophecy for the upcoming year.",
      "Goravara Kunitha - traditional ritualistic dance by Gorava devotees chanting 'Elukoti Elukoti'.",
      "Offering of Bhandara (turmeric powder) which turns the entire temple surroundings golden yellow.",
      "Maha Rathotsava (Chariot procession) through the plains of Mylara.",
      "Ceremonial ritual of breaking iron chains by specialized devotees."
    ],
    significance: "The Jatre is a vibrant showcase of rural folk heritage and unwavering faith. The Karnika prophecy is eagerly awaited by farmers across Karnataka, Andhra Pradesh, and Maharashtra to plan their crops and political predictions."
  },
  {
    id: "jatra_sirsi_marikamba",
    handle: "sirsi-marikamba-jatre",
    title: "Sirsi Marikamba Jatre",
    titleKannada: "ಶಿರಸಿ ಮಾರಿಕಾಂಬಾ ಜಾತ್ರೆ",
    deity: "Goddess Marikamba (incarnation of Durga)",
    place: "Marikamba Temple, Sirsi",
    district: "Uttara Kannada",
    kannadaMonth: "Phalguna (March)",
    gregorianMonths: ["March"],
    timing: "Held once every two years (biennial) for 9 days in March",
    image: "/images/jatras/sirsi-marikamba.png",
    summary: "One of the largest goddess festivals in Karnataka, famous for its massive eight-wheeled chariot and the magnificent processional wooden idol of Goddess Marikamba.",
    history: "Established in the 17th century (1689), the temple enshrines an 8-foot-tall wooden idol of Goddess Marikamba. The biennial Jatra is organized to ward off diseases and invite prosperity for the forest-dwelling communities of the Western Ghats. The Goddess is treated as the daughter of the town, returning home during the festival.",
    rituals: [
      "Kalyanotsava - the divine marriage ceremony of the goddess.",
      "Shobha Yatra - carrying the colossal idol of Goddess Marikamba and placing it on the chariot.",
      "Rathotsava - pulling of the massive, colorful chariot through the main streets of Sirsi.",
      "Devotees offering sarees, gold, and agricultural produce to the Goddess.",
      "Cultural programs, dramas, and local crafts fair during the 9-day celebration."
    ],
    significance: "The Sirsi Marikamba Jatre symbolizes the motherly protection of Goddess Marikamba over the Malnad region. It is celebrated with great harmony, transcending barriers of caste and religion, with millions of pilgrims attending from neighboring states."
  },
  {
    id: "jatra_saundatte_yellamma",
    handle: "saundatte-yellamma-jatre",
    title: "Saundatte Yellamma Jatre",
    titleKannada: "ಸವದತ್ತಿ ಯಲ್ಲಮ್ಮ ಜಾತ್ರೆ",
    deity: "Goddess Renuka Yellamma",
    place: "Yellamma Gudi, Saundatti",
    district: "Belagavi",
    kannadaMonth: "Margashirsha / Pushya (December - January)",
    gregorianMonths: ["December", "January"],
    timing: "Margashirsha Poornima (Bharat Hunnime)",
    image: "/images/jatras/saundatte-yellamma.png",
    summary: "A massive pilgrimage festival on the hill of Yellammagudda, drawing millions of devotees who worship Goddess Renuka, performing unique ritualistic baths and carrying sacred pots.",
    history: "The shrine is dedicated to Renuka, the wife of Sage Jamadagni and mother of Lord Parashurama. According to legend, Renuka was beheaded by her son Parashurama on his father's orders but was later resurrected with divine powers, becoming the mother goddess Yellamma (mother of all). The temple has a rich history from the Rashtrakuta and Chalukya eras.",
    rituals: [
      "Neeru Tumbo Ritual - taking a holy bath in the sacred pond Jogulabhavi.",
      "Yellamma Devi Rathotsava (Chariot festival) on the hilltop.",
      "Jagran and Chowdaki Pada - singing devotional folk songs praising the goddess.",
      "Devotees carrying the 'Jag' (sacred vessel/idol) on their heads during the procession.",
      "Offering of turmeric and vermilion (Bhandara and Kumkum) to the deity."
    ],
    significance: "This Jatre is one of the largest gatherings of rural devotees in South India, celebrating maternal resilience and forgiveness. The air on the hill is constantly filled with chants of 'Udu Udu Yellamma' and clouds of yellow turmeric powder."
  },
  {
    id: "jatra_gokarna_mahashivaratri",
    handle: "gokarna-mahashivaratri-jatre",
    title: "Gokarna Mahashivaratri Jatre",
    titleKannada: "ಗೋಕರ್ಣ ಮಹಾಶಿವರಾತ್ರಿ ಜಾತ್ರೆ",
    deity: "Lord Mahabaleshwara (Atmalinga of Shiva)",
    place: "Mahabaleshwar Temple, Gokarna",
    district: "Uttara Kannada",
    kannadaMonth: "Magha / Phalguna (February - March)",
    gregorianMonths: ["February", "March"],
    timing: "Mahashivaratri festival (Chaturdashi of Magha Krishna Paksha)",
    image: "/images/jatras/gokarna-mahashivaratri.png",
    summary: "A majestic seaside chariot festival where two massive chariots (Maha Ratha) are pulled along the narrow beach-town streets to honor the sacred Atmalinga of Lord Shiva.",
    history: "Gokarna is the holy place where Ravana was tricked by Ganesha into placing the Atmalinga (obtained from Shiva) on the ground, which then became fixed (Mahabaleshwar). The Jatre commemorates this epic Ramayana legend. The main chariot, Maha Ratha, stands over 40 feet tall and is built fresh every year using traditional woodcarving techniques.",
    rituals: [
      "Maha Rudrabhisheka and special worship of the Atmalinga in the inner sanctum.",
      "Sea Bathing (Samudra Snana) at Gokarna beach before offering prayers.",
      "Rathotsava - pulling of the two giant chariots (Maha Ratha and Trishula Ratha) through the Car Street.",
      "Devotees throwing bananas and wild flowers at the moving chariot for blessings.",
      "Samadhi Snana and night-long vigil (Jaagarane) with devotional chanting."
    ],
    significance: "The Gokarna Jatre is an extraordinary union of ancient myth, Vedic rituals, and ocean breeze. It is one of the most sacred spots in India for Shaivism, and the dramatic chariot pull along the narrow streets is a spectacular site of pure devotion."
  },
  {
    id: "jatra_siddheshwara",
    handle: "siddheshwara-jatra",
    title: "Siddheshwara Jatra (Vijayapura)",
    titleKannada: "ಸಿದ್ದೇಶ್ವರ ಜಾತ್ರೆ (ವಿಜಯಪುರ)",
    deity: "Siddheshwara Swamy (incarnation of Lord Shiva)",
    place: "Siddheshwara Temple, Vijayapura",
    district: "Vijayapura",
    kannadaMonth: "Pushya (January)",
    gregorianMonths: ["January"],
    timing: "January (Week-long fair)",
    image: "/images/jatras/siddheshwara.png",
    summary: "A massive, week-long fair in January honoring Siddheshwara Swamy. The entire city turns into a carnival with heavy cattle markets, giant ferris wheels, and endless stalls selling North Karnataka’s famous sweets.",
    history: "Honoring the great saint Siddheshwara Swamy, this historical jatra is a cornerstone of Vijayapura's culture. The fair is legendary for its massive cattle market, bringing farmers from across Karnataka and Maharashtra. Siddheshwara Swamy was a revered Lingayat saint of the 12th century, propagating the path of devotion and social equality.",
    rituals: [
      "Rathotsava (Chariot Procession) through the streets of Vijayapura",
      "Cattle market inauguration and livestock trade",
      "Mass feeding (Dasoha) for devotees",
      "Cultural programs and local drama performances"
    ],
    significance: "It represents the agricultural and spiritual unity of North Karnataka, combining deep devotion to Shiva with a bustling regional market."
  },
  {
    id: "jatra_huskur_madduramma",
    handle: "huskur-madduramma-jatra",
    title: "Huskur Madduramma Jatra",
    titleKannada: "ಹುಸ್ಕೂರು ಮದ್ದೂರಮ್ಮ ಜಾತ್ರೆ",
    deity: "Goddess Madduramma",
    place: "Madduramma Temple, Huskur, Anekal",
    district: "Bengaluru Rural",
    kannadaMonth: "Phalguna (February - March)",
    gregorianMonths: ["February", "March"],
    timing: "Late February or early March",
    image: "/images/jatras/huskur-madduramma.png",
    summary: "Famous for its mind-bogglingly tall Chariots (Kurju) up to 80-100 feet tall, pulled to the temple by majestic bullock pairs from neighboring villages.",
    history: "Celebrated for centuries in Huskur village, this fair is dedicated to Goddess Madduramma, a guardian deity (Grama Devi). The highlights of this jatra are the 'Kurju' – towering bamboo-and-fabric chariots reaching up to 100 feet. These giant chariots are pulled by pairs of Hallikar bulls from neighboring villages, demonstrating extreme strength and collective devotion.",
    rituals: [
      "Erection of the massive 80-100 feet Kurju (chariots)",
      "Procession of the chariots pulled by majestic bullock pairs",
      "Special offerings and prayers to Goddess Madduramma",
      "Village-wide feasts and folk art displays"
    ],
    significance: "The towering Kurjus symbolize spiritual elevation, while the bullock races and chariot-pulling highlight rural cooperation and agrarian pride."
  },
  {
    id: "jatra_veerabhadreshwara",
    handle: "veerabhadreshwara-jatra-humnabad",
    title: "Veerabhadreshwara Jatra (Humnabad)",
    titleKannada: "ವೀರಭದ್ರೇಶ್ವರ ಜಾತ್ರೆ (ಹುಮ್ನಾಬಾದ್)",
    deity: "Lord Veerabhadra (incarnation of Lord Shiva)",
    place: "Veerabhadreshwara Temple, Humnabad",
    district: "Bidar",
    kannadaMonth: "Pushya / Magha (January)",
    gregorianMonths: ["January"],
    timing: "January",
    image: "/images/jatras/veerabhadreshwara.png",
    summary: "A historical jatra renowned for its magnificent cart-pulling ceremony (Rathotsava) and a mystical 'moving pillar' inside the temple that draws lakhs of devotees.",
    history: "Constructed in 1725 by Raja Ramachandra Jadhav, the temple is dedicated to Lord Veerabhadra, the fierce warrior form of Shiva. The jatra is famous for its Rathotsava and a unique hanging pillar in the temple's mandapa that moves slightly when touched, drawing thousands of curious pilgrims and devotees from Karnataka, Maharashtra, and Telangana.",
    rituals: [
      "Rathotsava (Chariot Festival) through the temple streets",
      "Special Abhisheka and Alankara for Lord Veerabhadra",
      "Devotional offerings and breaking of coconuts",
      "Mystic hanging/moving pillar observation and prayers"
    ],
    significance: "A key spiritual convergence point for devotees across borders, representing historical architectural ingenuity and intense Shiva devotion."
  },
  {
    id: "jatra_siddaganga",
    handle: "siddaganga-jatra",
    title: "Siddaganga Mutt Jatra",
    titleKannada: "ಸಿದ್ದಗಂಗಾ ಮಠ ಜಾತ್ರೆ",
    deity: "Sri Siddhalingeshwara & Guru Dr. Sri Shivakumar Swamiji",
    place: "Sri Siddaganga Mutt, Tumakuru",
    district: "Tumakuru",
    kannadaMonth: "Phalguna (February)",
    gregorianMonths: ["February"],
    timing: "February (during Mahashivaratri)",
    image: "/images/jatras/siddaganga.png",
    summary: "Held during Mahashivaratri, combining deep spiritual fervor with a sprawling rural exhibition, agricultural fair, and mass free feeding (Dasoha) for hundreds of thousands of daily visitors.",
    history: "Sri Siddaganga Mutt is a world-renowned Lingayat monastery providing free education, shelter, and food to thousands of children under the principles of 'Trivida Dasoha' (Food, Education, and Shelter) championed by the late centenarian saint Dr. Sri Shivakumar Swamiji. The annual Jatra during Mahashivaratri has been celebrated for over a century, featuring a massive agricultural fair.",
    rituals: [
      "Rathotsava of Lord Siddhalingeshwara",
      "Sprawling rural and agricultural exhibition (Krishi Mela)",
      "Continuous round-the-clock Dasoha (mass feeding) of prasadam",
      "Vachana chanting and spiritual discourse assemblies"
    ],
    significance: "This Jatra highlights the social-reformist spirit of Lingayatism, uniting charity, education, and spiritual devotion in a massive community fair."
  },
  {
    id: "jatra_gavisiddeshwara",
    handle: "gavisiddeshwara-jatra-koppal",
    title: "Gavisiddeshwara Jatra (Koppal)",
    titleKannada: "ಗವಿಸಿದ್ಧೇಶ್ವರ ಜಾತ್ರೆ (ಕೊಪ್ಪಳ)",
    deity: "Sri Gavisiddeshwara Swamy (incarnation of Lord Shiva)",
    place: "Sri Gavisiddeshwara Mutt, Koppal",
    district: "Koppal",
    kannMonth: "Pushya (January)",
    gregorianMonths: ["January"],
    timing: "January",
    image: "/images/jatras/gavisiddeshwara.png",
    summary: "Known colloquially as the 'Kumbh Mela of South India,' this is an unbelievably massive religious and folk gathering where millions converge for the car festival, temporary markets, and spectacular cultural performances.",
    history: "The Gavisiddeshwara Mutt is located in a cave temple where the great saint Gavisiddeshwara performed intense penance. The annual chariot festival draws over a million devotees, making it one of the largest religious congregations in the region. The Mutt is highly respected for its continuous charitable activities, free food, and educational support.",
    rituals: [
      "Maha Rathotsava (Car festival) pulled by hundreds of thousands of devotees",
      "Jatra exhibition and massive temporary markets",
      "Massive Dasoha serving millions of meals",
      "Folk art performances and traditional music stages"
    ],
    significance: "Widely regarded as the Kumbh Mela of South India, it represents the absolute peak of folk devotion, voluntary service, and spiritual celebration in North Karnataka."
  },
  {
    id: "jatra_bengaluru_karaga",
    handle: "bengaluru-karaga",
    title: "Bengaluru Karaga",
    titleKannada: "ಬೆಂಗಳೂರು ಕರಗ",
    deity: "Goddess Draupadi (incarnation of Shakti)",
    place: "Dharmaraya Swamy Temple, Bengaluru",
    district: "Bengaluru Urban",
    kannadaMonth: "Chaitra (March - April)",
    gregorianMonths: ["March", "April"],
    timing: "Chaitra Poornima (Midnight procession)",
    image: "/images/jatras/bengaluru-karaga.png",
    summary: "The definitive historic night-fair of Bengaluru, held by the Thigala community. A priest, clad in feminine attire, flawlessly balances a towering, flower-decked pyramid pot (Karaga) on his head, moving in a hypnotic trance through the midnight streets of old Bengaluru. The procession stops notably at the Hazrat Tawkal Mastan Shah Dargah.",
    history: "Rooted in the Mahabharata, the Thigala community claims descent from the 'Veerakumaras', a soldierly class that protected Goddess Draupadi. Clad in feminine attire representing the goddess, the Karaga bearer carries a heavy, flower-decked pot representing Draupadi's power. By tradition, the procession visits the Hazrat Tawkal Mastan Shah Dargah, symbolizing centuries-old communal harmony.",
    rituals: [
      "Deepotsava and midnight temple rites at Dharmaraya Swamy Temple",
      "Procession of the Karaga bearer through old Bengaluru streets in a trance-like state",
      "Visit and offering at the Hazrat Tawkal Mastan Shah Dargah",
      "Veerakumaras performing spectacular sword play (Alagu Seva)"
    ],
    significance: "Bengaluru's oldest and most prestigious heritage festival, celebrating religious harmony, community resilience, and the mystical power of Shakti."
  },
  {
    id: "jatra_nanjangud_srikanteshwara",
    handle: "nanjangud-srikanteshwara-jatre",
    title: "Nanjangud Srikanteshwara Dodda Jatre",
    titleKannada: "ನಂಜನಗೂಡು ಶ್ರೀಕಂಠೇಶ್ವರ ದೊಡ್ಡ ಜಾತ್ರೆ",
    deity: "Lord Srikanteshwara (Nanjundeshwara / Shiva)",
    place: "Srikanteshwara Temple, Nanjangud",
    district: "Mysuru",
    kannadaMonth: "Chaitra (March - April)",
    gregorianMonths: ["March", "April"],
    timing: "Chaitra (Dodda Garudotsava)",
    image: "/images/jatras/nanjangud-srikanteshwara.png",
    summary: "Also known as the Dodda Garudotsava, this is a spectacular 15-day ancient temple fair where five massive wooden chariots are pulled by hand along the banks of the Kapila River.",
    history: "Nanjangud, known as the 'Dakshina Kashi', hosts the massive temple of Lord Srikanteshwara (He who drank poison). The temple dates back to the Ganga dynasty, with expansions by the Hoysalas and Wadiyars. The Dodda Jatre features the pulling of five massive chariots (Gautama Ratha, Ganapathy Ratha, Subramanya Ratha, Chandikeshwara Ratha, and Parvathi Ratha).",
    rituals: [
      "Dodda Garudotsava chariot-pulling ceremony",
      "Holy bath (Snana) in the Kapila River",
      "Special Abhisheka to the Srikanteshwara Linga",
      "Teppotsava in the river"
    ],
    significance: "One of the grandest temple chariot festivals in Karnataka, representing divine healing, heritage architecture, and deep spiritual cleansing."
  },
  {
    id: "jatra_yadiyur_siddhalingeshwara",
    handle: "yadiyur-siddhalingeshwara-jatra",
    title: "Yadiyur Siddhalingeshwara Jatra",
    titleKannada: "ಯಡಿಯೂರು ಸಿದ್ಧಲಿಂಗೇಶ್ವರ ಜಾತ್ರೆ",
    deity: "Saint Siddhalingeshwara (incarnation of Shiva)",
    place: "Siddhalingeshwara Temple, Yadiyur, Kunigal",
    district: "Tumakuru",
    kannadaMonth: "Chaitra (March - April)",
    gregorianMonths: ["March", "April"],
    timing: "Chaitra Shuddha Panchami",
    image: "/images/jatras/yadiyur-siddhalingeshwara.png",
    summary: "A highly popular regional fair celebrating the prominent Lingayat saint Siddhalingeshwara. The night car festival (Rathotsava) illuminates the small town, drawing a massive rural populace from Bangalore, Tumakuru, and Mandya.",
    history: "Tontada Siddhalinga Yati was a highly revered 15th-century Lingayat saint who traveled across Karnataka performing miracles and preaching Vachana philosophy. His Samadhi shrine in Yadiyur is a major place of worship. The annual Jatra commemorates his attainment of Jeeva Samadhi.",
    rituals: [
      "Night Rathotsava (Chariot procession) under brilliant lights",
      "Special Pooja at the Samadhi shrine",
      "Dasoha (free mass feeding) for pilgrims",
      "Cultural programs and devotional music"
    ],
    significance: "A major spiritual fair drawing millions of Lingayat and Shiva devotees from across South Karnataka, reflecting the teachings of social equity and service."
  },
  {
    id: "jatra_nayakanahatti_thipperudra",
    handle: "nayakanahatti-thipperudra-jatra",
    title: "Nayakanahatti Thipperudra Swamy Jatre",
    titleKannada: "ನಾಯಕನಹಟ್ಟಿ ತಿಪ್ಪೇರುದ್ರಸ್ವಾಮಿ ಜಾತ್ರೆ",
    deity: "Saint Thipperudra Swamy (incarnation of Lord Shiva)",
    place: "Thipperudra Swamy Temple, Nayakanahatti, Challakere",
    district: "Chitradurga",
    kannadaMonth: "Phalguna (March - April)",
    gregorianMonths: ["March", "April"],
    timing: "Phalguna Bahula Phalguna",
    image: "/images/jatras/nayakanahatti-thipperudra.png",
    summary: "A distinct 15-day fair where lakhs of devotees offer dry coconut pieces (Koppari) to the grand chariot as it moves, creating a unique visual spectacle of cascading coconuts.",
    history: "Guru Thipperudra Swamy was a 15th-century Lingayat saint and social reformer who constructed several water reservoirs (lakes) in the drought-prone Challakere region. He lived a simple life in a cave temple (Guhe). Devotees throw dry coconut pieces (Koppari) onto the moving chariot as an offering of their surrender.",
    rituals: [
      "Rathotsava where lakhs throw dry coconut pieces (Koppari) at the chariot",
      "Abhisheka at the inner samadhi shrine",
      "Cattle show and rural agricultural display",
      "Folk dances like Dollu Kunitha"
    ],
    significance: "The cascade of dry coconut pieces onto the moving chariot is a unique sight. The festival commemorates the saint's immense contributions to local water conservation."
  },
  {
    id: "jatra_viduraswatha",
    handle: "viduraswatha-jatra",
    title: "Viduraswatha Vidurnarayana Jatra",
    titleKannada: "ವಿಧುರಾಶ್ವತ್ಥ ವಿದುರನಾರಾಯಣ ಜಾತ್ರೆ",
    deity: "Lord Vidurnarayana & Sacred Peepal Tree",
    place: "Viduraswatha, Gauribidanur",
    district: "Chikkaballapur",
    kannadaMonth: "Chaitra (March - April)",
    gregorianMonths: ["March", "April"],
    timing: "Chaitra (8-day festival)",
    image: "/images/jatras/viduraswatha.png",
    summary: "A historic 8-day riverside fair near the sacred peepal tree of Viduraswatha. It blends historical reverence (the site is also known as the 'Jallianwala Bagh of the South') with a vibrant village marketplace.",
    history: "According to legend, the sacred peepal tree here was planted by Vidura of the Mahabharata. It was also the site of a tragic event in 1938 when British police fired on freedom fighters, leading it to be called the 'Jallianwala Bagh of the South'. The annual Jatra honors Lord Vidurnarayana and features a bustling market on the banks of the Uttara Pinakini river.",
    rituals: [
      "Rathotsava of Lord Vidurnarayana",
      "Pradakshina (circumambulation) of the ancient sacred Peepal tree",
      "Offering prayers at the National Memorial site",
      "Riverside market purchases and traditional village games"
    ],
    significance: "A beautiful blend of spiritual devotion, ancient Mahabharata lore, and modern patriotic history, set against a bustling rural market."
  },
  {
    id: "jatra_kar_hunnive",
    handle: "kar-hunnive-karihariyodu",
    title: "Kar Hunnive & Karihariyodu Festival",
    titleKannada: "ಕಾರ ಹುಣ್ಣಿಮೆ ಮತ್ತು ಕರಿಹರಿಯೋದು",
    deity: "Lord Basaveshwara (Sacred Bull/Bullocks)",
    place: "Various Villages of North Karnataka",
    district: "Belagavi, Bagalkot, Dharwad, Koppal",
    kannadaMonth: "Jyeshtha (June)",
    gregorianMonths: ["June"],
    timing: "Jyeshtha Poornima",
    image: "/images/jatras/kar-hunnive.png",
    summary: "Happening on the full moon of June, this is an intensely competitive village festival. Farmers beautifully paint the horns of their bullocks, decorate them with bells, and host high-energy bullock cart races through village mud tracks.",
    history: "Kar Hunnive marks the onset of the monsoon and the start of the agricultural sowing season. Farmers honor their bullocks, who are their primary agricultural partners. The event 'Karihariyodu' is a thrilling race where decorated bullock pairs run through a village lane to break a coconut-filled rope. The winning pair is believed to predict the agricultural output of the village.",
    rituals: [
      "Worshipping and bathing the bullocks",
      "Painting bullock horns with bright colors and decorating with brass ornaments",
      "Bullock cart races (Karihariyodu) through village tracks",
      "Village feasts and agricultural planning assemblies"
    ],
    significance: "It represents the connection between farmers and their cattle, acting as both a sport and a sacred ritual to ensure a successful monsoon harvest."
  },
  {
    id: "jatra_kambala",
    handle: "kambala-festivals",
    title: "Coastal Kambala Buffalo Races",
    titleKannada: "ಕಂಬಳ ಉತ್ಸವಗಳು",
    deity: "Lord Kadri Manjunatha & Nagaraja (Snake God)",
    place: "Coastal Tulu Nadu (Mangaluru, Udupi, Puttur)",
    district: "Dakshina Kannada, Udupi",
    kannadaMonth: "Karthika to Phalguna (November - March)",
    gregorianMonths: ["November", "December", "January", "February", "March"],
    timing: "Weekly circuit from November through March",
    image: "/images/jatras/kambala.png",
    summary: "High-octane, muddy buffalo races held across paddy fields. Each racing weekend transforms the host village into a massive night-fair celebrating coastal food, folklore, and rural sports.",
    history: "Dating back over 800 years, Kambala originated as a tribute to the gods for a healthy harvest. Highly trained buffaloes, guided by skilled runners, race in parallel slushy tracks (paddy fields). It is deeply tied to the Alupa and Feudal dynasties of coastal Karnataka.",
    rituals: [
      "Traditional prayers to Lord Manjunatha before the race",
      "High-octane buffalo sprint races across wet mud tracks",
      "Night fairs (Parishe) with coastal delicacies like Neer Dosa and Toddy",
      "Performances of Kola (spirit worship) and Yakshagana"
    ],
    significance: "The ultimate display of rural sportsmanship, coastal identity, and agrarian pride, celebrated with massive energy and digital broadcasts."
  }
]

export function listJatras(): Jatra[] {
  return JATRA_DATA
}

export function getJatraByHandle(handle: string): Jatra | undefined {
  return JATRA_DATA.find((j) => j.handle === handle)
}
