export interface Jatra {
  id: string
  handle: string
  title: string
  titleKannada: string
  deity: string
  place: string
  district: string
  kannadaMonth: string
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
  }
]

export function listJatras(): Jatra[] {
  return JATRA_DATA
}

export function getJatraByHandle(handle: string): Jatra | undefined {
  return JATRA_DATA.find((j) => j.handle === handle)
}
