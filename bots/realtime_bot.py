#!/usr/bin/env python3
"""
🔱 JATRAMELA REALTIME UPDATE BOT — Live Devotional Feeds Agent
Periodically generates realistic, contextual live updates for Karnataka's 12 major Jatras
including crowd status, active rituals, weather, parking/travel alerts, and timestamps.
This agent runs autonomously, keeping the storefront banner and details pages dynamic.
"""

import sys
import os
import json
import random
from datetime import datetime, timedelta, timezone
import urllib.request

# Configure Paths
CWD = os.getcwd()
LOG_DIR = os.path.join(CWD, "bots/reports")
os.makedirs(LOG_DIR, exist_ok=True)

POSSIBLE_JSON_PATHS = [
    os.path.join(CWD, "apps/storefront/src/lib/data/jatra-updates.json"),
    os.path.join(CWD, "src/lib/data/jatra-updates.json"),
    os.path.join(CWD, "jatramela/apps/storefront/src/lib/data/jatra-updates.json"),
]

JSON_PATH = None
for p in POSSIBLE_JSON_PATHS:
    if os.path.exists(p):
        JSON_PATH = p
        break

if not JSON_PATH:
    JSON_PATH = os.path.join(CWD, "apps/storefront/src/lib/data/jatra-updates.json")

# Coordinates of the 12 Jatras for accurate weather lookup
COORDINATES = {
    "jatra_mysuru_dasara": {"lat": 12.3087, "lon": 76.6547, "city": "Mysuru"},
    "jatra_sharanabasaveshwara": {"lat": 17.3297, "lon": 76.8343, "city": "Kalaburagi"},
    "jatra_hampi_utsav": {"lat": 15.3350, "lon": 76.4600, "city": "Hampi"},
    "jatra_kadalekai_parishe": {"lat": 12.9428, "lon": 77.5682, "city": "Bengaluru"},
    "jatra_banashankari_devi": {"lat": 15.9181, "lon": 75.6798, "city": "Badami"},
    "jatra_suttur_mahotsav": {"lat": 12.1465, "lon": 76.8165, "city": "Suttur"},
    "jatra_ghati_subrahmanya": {"lat": 13.4326, "lon": 77.5186, "city": "Doddaballapur"},
    "jatra_udupi_paryaya": {"lat": 13.3409, "lon": 74.7473, "city": "Udupi"},
    "jatra_mailara_lingeshwara": {"lat": 14.9392, "lon": 75.7336, "city": "Mylara"},
    "jatra_sirsi_marikamba": {"lat": 14.6195, "lon": 74.8441, "city": "Sirsi"},
    "jatra_saundatte_yellamma": {"lat": 15.7766, "lon": 75.1166, "city": "Saundatti"},
    "jatra_gokarna_mahashivaratri": {"lat": 14.5479, "lon": 74.3188, "city": "Gokarna"}
}

# Rich contextual Jatra period data
JATRA_PERIOD_DATA = {
    "jatra_mysuru_dasara": {
        "Morning": {
            "rituals": [
                "Special Pratah Kala Abhisheka & Kumkumarchana at Chamundeshwari Temple",
                "Suprabhatha Seva and morning queue alignments atop Chamundi Hills"
            ],
            "events": [
                "Morning darshana queues open for devotees",
                "Chinnada Ambari (Golden Howdah) morning preparation inspection"
            ],
            "parking": "Parking at Chamundi Hills base is open. Hills road traffic is moderate.",
            "alerts": "Warm morning weather. Separate senior citizen lines active at North Gate."
        },
        "Afternoon": {
            "rituals": [
                "Shodashopachara Pooja and Maha Mangalarathi",
                "Offering of royal Naivedya to Goddess Chamundeshwari"
            ],
            "events": [
                "Mahaprasada mass feeding starting at the temple dining hall",
                "Dasoha dining halls fully operational"
            ],
            "parking": "Parking at Chamundi Hills base is 80% full. Use KSRTC shuttle bus services.",
            "alerts": "Afternoon queues are moderate. Keep hydrated. Drinking water spots active."
        },
        "Evening": {
            "rituals": [
                "Pradosha Pooja and lighting of golden chandeliers",
                "Kala-karshana and royal weapon worship (Aayudha Pooja) evening rituals"
            ],
            "events": [
                "Jumboo Savari Procession passing through historical gates",
                "Torchlight Parade cultural rehearsals at Bannimantap grounds"
            ],
            "parking": "Bannimantap and Chamundi hills road entry restricted. Use city parking lots.",
            "alerts": "Very heavy crowds gathered. High security presence active. Keep children close."
        },
        "Night": {
            "rituals": [
                "Ekantha Seva (Deity retires for the night)",
                "Sanctum doors closed. Preparation for tomorrow morning's pooja"
            ],
            "events": [
                "Teppotsava floating festival in Devikere tank",
                "Mysore Palace illumination and dynamic light & sound show"
            ],
            "parking": "City parking areas clear. Traffic flowing normally.",
            "alerts": "Temple doors closed for the night. Darshana resumes at 05:30 AM tomorrow."
        }
    },
    "jatra_sharanabasaveshwara": {
        "Morning": {
            "rituals": [
                "Siddhalinga Pooja & Panchamrutha Abhisheka at the Samadhi shrine",
                "Uchchayi flag raising ceremony prayers"
            ],
            "events": [
                "Morning queue alignments and devotional singing in outer courtyard",
                "Rathotsava chariot assembly inspection by temple trustees"
            ],
            "parking": "Main temple parking is open and clear. No delays.",
            "alerts": "Queue moving smoothly. Drinking water stations placed along the lines."
        },
        "Afternoon": {
            "rituals": [
                "Madhyahna Pooja & Karpura Mangalarathi",
                "Offering of holy Prasadam at the main altar"
            ],
            "events": [
                "Mass feeding (Dasoha) starting at noon in the main dining hall",
                "Spiritual discourses by visiting saints and scholars"
            ],
            "parking": "Temple road parking is 60% full. Traffic volunteers guiding.",
            "alerts": "Dasoha mass feeding active. Free medical camp active near main arch."
        },
        "Evening": {
            "rituals": [
                "Maha Mangalarathi and throwing of vermilion (Kumkum) and turmeric dust",
                "Evening Pradosha worship at the Samadhi"
            ],
            "events": [
                "Maha Rathotsava (Chariot Procession) where lakhs pull the wooden chariot",
                "Devotional music concerts by traditional North Karnataka artists"
            ],
            "parking": "Heavy traffic near temple road. Park at public layout grounds.",
            "alerts": "Rathotsava ropes setup complete. Chariot pulling starts now. Keep distance."
        },
        "Night": {
            "rituals": [
                "Ekantha Seva and Sharanabasaveshwara Samadhi closing prayers",
                "Temple sanctum doors locked for the night"
            ],
            "events": [
                "Late night bhajan mandali gatherings in temple corridor",
                "Clean-up drive of temple courtyard by youth volunteers"
            ],
            "parking": "Main roads clear. Parking congestion resolved.",
            "alerts": "Darshana closed for the night. Main gates close at 10:00 PM."
        }
    },
    "jatra_hampi_utsav": {
        "Morning": {
            "rituals": [
                "Virupaksha Temple special Abhisheka with Tungabhadra water",
                "Sacred chanting of Rudra Chamaka at sanctum"
            ],
            "events": [
                "Devotees queueing for morning Virupaksha darshana",
                "Shobha Yatra cultural parade setup at Hampi Bazaar street"
            ],
            "parking": "Hampi bypass parking open. KSRTC shuttle service starting.",
            "alerts": "Morning breeze is pleasant. Helpdesk active near temple entrance."
        },
        "Afternoon": {
            "rituals": [
                "Mahapuja and offering of sweet Anna Prasada",
                "Special prayers to Goddess Pampa"
            ],
            "events": [
                "Traditional Janapada folk art performances on stone stages",
                "Exhibition of Vijayanagara historical coins and art"
            ],
            "parking": "Traffic diverted near Hampi Bazaar. Use Hampi bypass parking.",
            "alerts": "Sunny afternoon. Keep hydrated. Mass Prasada served at Bhojana Hall."
        },
        "Evening": {
            "rituals": [
                "Deepotsava - illumination of the Tungabhadra river banks with oil lamps",
                "Sandhya Mangalarathi and Pancha Ratha pooja"
            ],
            "events": [
                "Maha Rathotsava chariot pulling on Hampi Bazaar street",
                "Laser projection show and light-and-sound show on stone monuments"
            ],
            "parking": "Heavy congestion on bypass. Use designated parking zones.",
            "alerts": "Laser show starts at 7 PM. Entry is free. Stand in designated safe areas."
        },
        "Night": {
            "rituals": [
                "Sayana Pooja and Virupaksha Temple closing rituals",
                "Sanctum locked for the night"
            ],
            "events": [
                "Illuminated monuments photography sessions open",
                "Grand cultural music concerts under the starry Hampi sky"
            ],
            "parking": "Bypass roads clear. Traffic flowing smoothly.",
            "alerts": "Darshana closed for the night. Monument lighting shuts off at 11:00 PM."
        }
    },
    "jatra_kadalekai_parishe": {
        "Morning": {
            "rituals": [
                "Maha Abhisheka of monolithic Nandi with milk, honey, and ghee",
                "Inauguration pooja at Dodda Ganesha Temple"
            ],
            "events": [
                "Groundnut market fair opening ceremony",
                "Farmers from across South India setting up groundnut stalls"
            ],
            "parking": "Bull Temple Road closed. Park near National College grounds.",
            "alerts": "Eco-friendly bags distributed. Plastic bag ban strictly enforced."
        },
        "Afternoon": {
            "rituals": [
                "Offering of first-harvest Kadalekai (groundnuts) to Nandi",
                "Nandi alankara with fresh peanut garlands"
            ],
            "events": [
                "Devotees exploring peanut market stalls, buying fresh harvest",
                "Traditional folk music and street plays near the park"
            ],
            "parking": "Heavy parking congestion. Use public transit (Metro to National College).",
            "alerts": "Stall count exceeds 600. Crowd flowing steadily. Keep purses safe."
        },
        "Evening": {
            "rituals": [
                "Karthika Deepotsava - lighting of hundreds of clay lamps in courtyard",
                "Laksha Deepotsava at Dodda Ganesha Temple"
            ],
            "events": [
                "Grand street fair, cultural walk, and peanut tasting tours",
                "Veeragase and Dollu Kunitha folk dances in front of temple"
            ],
            "parking": "Roads fully blocked. Traffic police diverting near Bugle Rock.",
            "alerts": "Extreme peak crowd. Special evening queue lines open for Nandi darshana."
        },
        "Night": {
            "rituals": [
                "Nandi Shanti Pooja and closing prayers",
                "Temple doors locked"
            ],
            "events": [
                "Stalls remain active for late-night buyers",
                "Street cleanup volunteers beginning work"
            ],
            "parking": "National college parking open. Traffic clearing slowly.",
            "alerts": "Temple closed. Peanut fair stalls remain open until midnight."
        }
    },
    "jatra_banashankari_devi": {
        "Morning": {
            "rituals": [
                "Panchamrutha Abhisheka and floral decoration of Goddess Banashankari",
                "Sahasranama Kumkumarchana for women devotees"
            ],
            "events": [
                "Morning darshana lines forming in front of Badami temple",
                "Teppotsava floating raft setup in Haridra Tirtha"
            ],
            "parking": "Cholachagudda road clear. Free parking near temple pond.",
            "alerts": "Cool weather. Queue lines moving smoothly."
        },
        "Afternoon": {
            "rituals": [
                "Offering 108 varieties of local dishes (Bhandara) to Shakambhari Devi",
                "Maha Naivedya and Alankara Pooja"
            ],
            "events": [
                "Mass Prasada distribution at the community kitchen",
                "Badami agricultural expo and local crafts fair"
            ],
            "parking": "Parking filled at Main gate. Use secondary high school ground parking.",
            "alerts": "Afternoon temperature rising. Prasada halls are fully active."
        },
        "Evening": {
            "rituals": [
                "Evening Arathi and special vegetable decoration (Alankara) darshana",
                "Pradosha Pooja with sacred chants"
            ],
            "events": [
                "Rathotsava chariot procession through Sirsi-Badami road",
                "Traditional North Karnataka drama shows on temple plains"
            ],
            "parking": "Heavy traffic on Badami-Sirsi highway. Drive slowly.",
            "alerts": "Peak crowd for Rathotsava. Follow instructions from security volunteers."
        },
        "Night": {
            "rituals": [
                "Sayana Pooja and Shakambhari Devi temple closing prayers",
                "Deity sanctum closed for the night"
            ],
            "events": [
                "Teppotsava (Floating Festival) procession in Haridra Tirtha pond",
                "Devotional singing and local drama plays active until late night"
            ],
            "parking": "Highway traffic clearing. Parking zones opening up.",
            "alerts": "Temple doors closed. Teppotsava safety barriers active around the pond."
        }
    },
    "jatra_suttur_mahotsav": {
        "Morning": {
            "rituals": [
                "Prabhat Pheri morning devotional walk with temple chants",
                "Suttur Math founder Smaranotsava and guru pooja"
            ],
            "events": [
                "Inauguration of Krishi Mela (Agricultural Exhibition)",
                "Cattle show and organic produce displays open"
            ],
            "parking": "Designated parking zones A & B are open. 20% full.",
            "alerts": "Exhibition stalls open at 09:00 AM. Free entry for farmers."
        },
        "Afternoon": {
            "rituals": [
                "Madhyahna Puja and offering of Kapila river holy water",
                "Prasada offering at Guru Shrine"
            ],
            "events": [
                "Mass marriage ceremonies (Uchita Vivaha) in the main hall",
                "Educational seminar on natural farming and rural development"
            ],
            "parking": "Parking zones A & B are 65% full. Traffic volunteers guiding.",
            "alerts": "Free buttermilk distribution center active near Kapila bridge."
        },
        "Evening": {
            "rituals": [
                "Deepotsava - lighting of thousands of oil lamps on Kapila banks",
                "Sandhya Mangalarathi and traditional Vachana chanting"
            ],
            "events": [
                "Maharathotsava grand chariot pulling across the village",
                "Cultural music concerts and folk arts on the main stage"
            ],
            "parking": "Heavy traffic on Suttur bypass road. Follow diversions.",
            "alerts": "Very high crowd near chariot street. Cooperate with volunteers."
        },
        "Night": {
            "rituals": [
                "Ekantha Seva and Guru Samadhi closing prayers",
                "Math inner sanctum doors locked"
            ],
            "events": [
                "Kapila river light reflections and floating lamps",
                "Exhibition stalls winding down for the night"
            ],
            "parking": "Bypass traffic flowing smoothly. Parking clearing.",
            "alerts": "Main spiritual events completed. Exhibition stalls close at 09:30 PM."
        }
    },
    "jatra_ghati_subrahmanya": {
        "Morning": {
            "rituals": [
                "Ksheerabhisheka for swayambhu Naga Subrahmanya deity",
                "Naga Pratishte sacred pooja and prayers"
            ],
            "events": [
                "Devotees queuing for Naga Darshana through the mirror structure",
                "Doddaballapur cattle fair morning arrival of livestock"
            ],
            "parking": "Open field parking zone C is clear. Use Ghati bypass road.",
            "alerts": "Early morning fog. Drive with fog lamps on highway."
        },
        "Afternoon": {
            "rituals": [
                "Mahapuja and offering of sweet Panchamrutha prasada",
                "Special prayers to Lord Lakshmi Narasimha"
            ],
            "events": [
                "Ghati Cattle Fair inauguration and cattle parade",
                "Mass feeding program at the temple community dining hall"
            ],
            "parking": "Heavy delays on Doddaballapur highway. Parking C is 80% full.",
            "alerts": "Average wait time in queue: 1.5 hours. Keep children hydrated."
        },
        "Evening": {
            "rituals": [
                "Evening Arathi and Maha Alankara of Naga deity",
                "Pushya Shashti special chariot prayers"
            ],
            "events": [
                "Pushya Rathotsava chariot pulling by lakhs of devotees",
                "Devotional folk music near the temple arch"
            ],
            "parking": "Highway congestion at peak. Traffic police coordinating.",
            "alerts": "Peak crowd for chariot pull. Stand in designated safe zones."
        },
        "Night": {
            "rituals": [
                "Ekantha Seva and temple closing prayers",
                "Sanctum locked for the night"
            ],
            "events": [
                "Cattle fair grounds campfire gatherings",
                "Clean-up of chariot path"
            ],
            "parking": "Traffic clearing slowly. High police presence.",
            "alerts": "Temple closed. Darshana resumes tomorrow morning at 06:00 AM."
        }
    },
    "jatra_udupi_paryaya": {
        "Morning": {
            "rituals": [
                "Madhwa Sarovara Ganga Pooja and sacred morning bath",
                "Kanakana Kindi special temple offering and prayers"
            ],
            "events": [
                "Pura Pravesha - ceremonial entry of the incoming Swamiji into Udupi",
                "Grand procession featuring 50+ cultural troupes"
            ],
            "parking": "City center closed. Park at Kalsanka or city bus stand.",
            "alerts": "Procession active since 3 AM. Udupi city center fully decorated."
        },
        "Afternoon": {
            "rituals": [
                "Paryaya Peetha ascendancy ceremony at Udupi Krishna Math",
                "Transfer of the historic Akshaya Patra and temple keys"
            ],
            "events": [
                "Anna Prasad (mass meals) starting at the Bhojana Shala",
                "Paryaya Darbar - assembly of saints, scholars, and dignitaries"
            ],
            "parking": "Parking filled at city bus stand. Use secondary school ground parking.",
            "alerts": "Anna Prasada active. Volunteers guiding dining hall entries."
        },
        "Evening": {
            "rituals": [
                "Sandhya Mangalarathi and special oil lamp lighting of Krishna shrine",
                "Madhwa Sarovara deepotsava"
            ],
            "events": [
                "Lord Krishna temple car street procession with multiple chariots",
                "Devotional music and classical dance programs at Car Street"
            ],
            "parking": "Car Street fully closed. Kalsanka road congested.",
            "alerts": "Spectacular chariot procession in progress. Use pedestrian paths."
        },
        "Night": {
            "rituals": [
                "Ekantha Seva and Krishna Math closing prayers",
                "Temple gates close for the night"
            ],
            "events": [
                "Late-night Teppotsava floating festival in Madhwa Sarovara",
                "Paryaya cultural seminars in Math courtyard"
            ],
            "parking": "Roads opening up. Parking clearing.",
            "alerts": "Temple doors closed. Teppotsava floating festival ongoing."
        }
    },
    "jatra_mailara_lingeshwara": {
        "Morning": {
            "rituals": [
                "Mailara Lingeshwara sacred morning Abhisheka",
                "Goravara Kunitha ritual dance on temple plains"
            ],
            "events": [
                "Devotees gathering on the plain grounds",
                "Goravas in black woolen blankets blowing brass horns"
            ],
            "parking": "Open field parking near Mylara plains is clear.",
            "alerts": "Dusty environment. Wearing face covers recommended."
        },
        "Afternoon": {
            "rituals": [
                "Offering of Bhandara (turmeric powder) to the Lord",
                "Maha Prasada distribution on the plains"
            ],
            "events": [
                "Devotees tossing turmeric powder, coloring the plains yellow",
                "Rural wrestling matches (Kusthi) in designated ring"
            ],
            "parking": "Plains parking 50% full. Drive slowly due to low visibility from dust.",
            "alerts": "Turmeric tossing active. Protect eyes and electronic items."
        },
        "Evening": {
            "rituals": [
                "Karnika Utsava - chief priest climbs 20-foot bow for prophecy",
                "Sandhya Arathi and bowing rituals"
            ],
            "events": [
                "Maha Rathotsava chariot pulling across Mylara plains",
                "Divine prophecy delivered by the priest, predictions for agriculture"
            ],
            "parking": "High congestion. Parking volunteers active with torches.",
            "alerts": "Karnika prophecy bow setup complete. Quiet silence requested during prophecy."
        },
        "Night": {
            "rituals": [
                "Ekantha Seva and breaking of heavy iron chains by Goravas",
                "Sanctum closed"
            ],
            "events": [
                "Campfires and folk singing across the Mylara plains",
                "Folk drama shows (Bayalata) starting"
            ],
            "parking": "Plains parking clearing. Expect delay at highway entry.",
            "alerts": "Temple closed. Cultural drama shows active throughout the night."
        }
    },
    "jatra_sirsi_marikamba": {
        "Morning": {
            "rituals": [
                "Maha Alankara of the colossal 8-foot wooden Goddess Marikamba",
                "Devi Abhisheka with sacred herbal water"
            ],
            "events": [
                "Marikamba Shobha Yatra procession starting through Sirsi main streets",
                "Thousands of women carrying sacred Kalashas"
            ],
            "parking": "Sirsi town parking slots open. Shuttles starting.",
            "alerts": "Procession routes closed to vehicles. Use bypass parking."
        },
        "Afternoon": {
            "rituals": [
                "Kalyanotsava - sacred marriage rituals of the Goddess",
                "Offering of sarees and gold ornaments to the deity"
            ],
            "events": [
                "Mass Prasada distribution at the temple dining courtyard",
                "Local forest-produce and spice market fair opening"
            ],
            "parking": "Car street closed. Use secondary parking at Yellapur road.",
            "alerts": "Saree offerings counter active. Average queue time: 1 hour."
        },
        "Evening": {
            "rituals": [
                "Evening Arathi and Maha Mangalarathi on the chariot",
                "Pradosha Pooja with instrumental music"
            ],
            "events": [
                "Rathotsava - pulling of the massive, colorful 8-wheeled chariot",
                "Cultural folk performances (Dollu Kunitha) along the path"
            ],
            "parking": "Town roads fully congested. Walking is fastest option.",
            "alerts": "Massive crowd for Rathotsava. Keep away from chariot wheels."
        },
        "Night": {
            "rituals": [
                "Sayana Pooja and Goddess Marikamba temple closing prayers",
                "Inner sanctum locked"
            ],
            "events": [
                "Goddess procession arriving at the local fair grounds",
                "Cultural plays and drama shows active at the fair"
            ],
            "parking": "Shuttle services running until midnight. Parking clearing.",
            "alerts": "Temple closed. Fair and cultural programs open until late night."
        }
    },
    "jatra_saundatte_yellamma": {
        "Morning": {
            "rituals": [
                "Holy dip at Jogulabhavi sacred pond by lakhs of pilgrims",
                "Ksheerabhisheka for Goddess Renuka Yellamma"
            ],
            "events": [
                "Pilgrims walking up Yellammagudda hill chanting 'Udu Udu'",
                "Devotees carrying the 'Jag' sacred vessel on their heads"
            ],
            "parking": "Hill road blocked. Park at foothills and use official jeeps.",
            "alerts": "Heavy crowds at Jogulabhavi pond. Use caution near steps."
        },
        "Afternoon": {
            "rituals": [
                "Mahapuja and offering of traditional neem leaf garlands",
                "Offering of turmeric and vermilion (Kumkum) to the deity"
            ],
            "events": [
                "Mass prasada distribution on the hilltop plains",
                "Chowdaki Pada folk singing assemblies in outer circle"
            ],
            "parking": "Foothill parking is 90% full. Expect 45-min delay for jeeps.",
            "alerts": "Warm afternoon. Drinking water and medical camps fully active."
        },
        "Evening": {
            "rituals": [
                "Yellamma Devi Rathotsava chariot prayers on hilltop",
                "Maha Mangalarathi and lighting of hill lamps"
            ],
            "events": [
                "Rathotsava (Chariot Procession) on the hilltop plains",
                "Massive yellow cloud of turmeric powder tossed in devotion"
            ],
            "parking": "Foothills traffic slow. Police managing Belagavi highway.",
            "alerts": "Peak hilltop density. Follow designated path. Keep children safe."
        },
        "Night": {
            "rituals": [
                "Sayana Pooja and Yellamma temple closing prayers",
                "Sanctum locked for the night"
            ],
            "events": [
                "Midnight devotional vigil (Jaagarane) and Chowdaki singing",
                "Hilltop illuminated under moonlight and clay lamps"
            ],
            "parking": "Jeep services active all night. Parking clearing slowly.",
            "alerts": "Temple closed. Hilltop remains alive with devotional singing all night."
        }
    },
    "jatra_gokarna_mahashivaratri": {
        "Morning": {
            "rituals": [
                "Samudra Snana beach bathing by thousands of pilgrims",
                "Atmalinga Sparsha Pooja in the inner sanctum"
            ],
            "events": [
                "Devotees queuing up along Car Street for Atmalinga darshana",
                "Maha Ratha chariot final decoration check"
            ],
            "parking": "Gokarna main road closed. Park near bus stand parking area.",
            "alerts": "Pleasant sea breeze. Queue wait time for Sparsha Darshana: 2 hours."
        },
        "Afternoon": {
            "rituals": [
                "Maha Rudrabhisheka at inner sanctum by Vedic priests",
                "Offerings of Bilva leaves to the Atmalinga"
            ],
            "events": [
                "Mass feeding program at temple school grounds",
                "Devotional lectures and Vedic chanting in temple corridors"
            ],
            "parking": "Beach road parking is full. Use bus stand parking.",
            "alerts": "Warm temperature. Separate queues active for women and senior citizens."
        },
        "Evening": {
            "rituals": [
                "Sandhya Pooja and Biligiri Ratha deepotsava ceremony",
                "Pooja to Lord Mahabaleshwara on the chariot"
            ],
            "events": [
                "Maha Ratha seaside chariot pulling along narrow streets by lakhs of devotees",
                "Dollu Kunitha and traditional drums leading the chariot path"
            ],
            "parking": "All town roads closed. Heavy pedestrian flow. Park outside city limits.",
            "alerts": "Peak devotional crowd. Keep safe distance from moving giant chariot."
        },
        "Night": {
            "rituals": [
                "Ekantha Seva and Mahabaleshwara closing prayers",
                "Temple gates close for the night"
            ],
            "events": [
                "Midnight Jaagarane bhajan vigil at the beach temple",
                "Sea beach Deepotsava with hundreds of floating oil lamps"
            ],
            "parking": "Town roads opening slowly. Traffic clearing towards highway.",
            "alerts": "Temple closed. Special beach security and lifeguards on high alert."
        }
    }
}

def get_ist_time():
    """Get the current time in India Standard Time (UTC + 5:30)"""
    utc_now = datetime.now(timezone.utc)
    ist_now = utc_now + timedelta(hours=5, minutes=30)
    return ist_now

def fetch_weather(lat, lon, city):
    """Fetch live weather from Open-Meteo API or fallback to seasonal simulation"""
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&timezone=auto"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "JatramelaBot/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            current = data.get("current", {})
            temp = round(current.get("temperature_2m", 28))
            code = current.get("weather_code", 0)
            
            wmo_map = {
                0: "Clear Sky",
                1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
                45: "Foggy", 48: "Depositing Rime Fog",
                51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
                61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
                80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
                95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Severe Thunderstorm"
            }
            desc = wmo_map.get(code, "Pleasant")
            return f"{temp}°C, {desc}"
    except Exception as e:
        print(f"⚠️ Weather API fetch failed for {city}: {e}. Using seasonal simulation.")
        ist = get_ist_time()
        month = ist.month
        hour = ist.hour
        
        # Simple seasonal model for Karnataka
        if 3 <= month <= 5: # Summer
            base_temp = 32 if 10 <= hour <= 17 else 25
            desc = random.choice(["Sunny Day", "Warm Sunshine", "Clear Sky"])
        elif 6 <= month <= 9: # Monsoon
            base_temp = 26 if 10 <= hour <= 17 else 22
            desc = random.choice(["Cloud Cover", "Light Drizzle", "Rain Showers", "Overcast"])
        else: # Winter/Cool season
            base_temp = 28 if 10 <= hour <= 17 else 20
            desc = random.choice(["Clear Sky", "Pleasant Breeze", "Morning Fog", "Mainly Clear"])
            
        temp = base_temp + random.randint(-2, 2)
        return f"{temp}°C, {desc}"

def get_time_based_metrics(hour):
    """Determine period, crowd status, and realistic crowd count based on the IST hour"""
    if 22 <= hour or hour <= 4:
        status = "Calm"
        count = f"{random.randint(50, 450):,} devotees present (Quiet hours)"
        period = "Night"
    elif 5 <= hour <= 7:
        status = random.choice(["Normal", "Moderate"])
        count = f"{random.randint(2500, 7500):,} devotees present"
        period = "Morning"
    elif 8 <= hour <= 11:
        status = random.choice(["Moderate", "Peak"])
        count = f"{random.randint(15000, 45000):,} devotees present"
        period = "Morning"
    elif 12 <= hour <= 15:
        status = random.choice(["Normal", "Moderate"])
        count = f"{random.randint(6000, 18000):,} devotees present"
        period = "Afternoon"
    elif 16 <= hour <= 20:
        status = random.choice(["Peak", "VVIP"])
        count = f"{random.randint(45000, 125000):,}+ devotees & pilgrims"
        period = "Evening"
    else: # 21:00 to 21:59
        status = "Moderate"
        count = f"{random.randint(8000, 22000):,} devotees present"
        period = "Evening"
        
    return period, status, count

def generate_update(jatra_id, ist_now):
    """Generate dynamic timezone-aware update for a Jatra"""
    jatra_data = JATRA_PERIOD_DATA.get(jatra_id)
    if not jatra_data:
        # Fallback period data
        jatra_data = {
            "Morning": {
                "rituals": ["Maha Mangalarathi and Abhisheka"],
                "events": ["Suprabhatha Darshana"],
                "parking": "Temple parking is clear.",
                "alerts": "Morning darshana active."
            },
            "Afternoon": {
                "rituals": ["Madhyahna Pooja"],
                "events": ["Prasada mass feeding"],
                "parking": "Parking is clear.",
                "alerts": "Prasada feeding active."
            },
            "Evening": {
                "rituals": ["Sandhya Mangalarathi"],
                "events": ["Rathotsava chariot procession"],
                "parking": "Heavy traffic. Use designated parking slots.",
                "alerts": "Rathotsava active."
            },
            "Night": {
                "rituals": ["Ekantha Seva"],
                "events": ["Bhajan mandali gatherings"],
                "parking": "Parking is clear.",
                "alerts": "Temple is closed."
            }
        }

    period, status, count = get_time_based_metrics(ist_now.hour)
    period_info = jatra_data.get(period, jatra_data["Morning"])
    
    # Get weather
    coord = COORDINATES.get(jatra_id, {"lat": 12.9716, "lon": 77.5946, "city": "Bengaluru"})
    weather_str = fetch_weather(coord["lat"], coord["lon"], coord["city"])
    
    return {
        "crowdStatus": status,
        "crowdCount": count,
        "currentRitual": random.choice(period_info["rituals"]),
        "nextEvent": random.choice(period_info["events"]),
        "weather": weather_str,
        "parkingAlert": period_info["parking"],
        "liveAlert": period_info["alerts"],
        "lastUpdated": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    }

def main():
    print("🔱 Starting Jatramela Realtime Update Bot...")
    print(f"📁 Target updates JSON: {JSON_PATH}")

    # Load existing or make empty
    existing_updates = {}
    if os.path.exists(JSON_PATH):
        try:
            with open(JSON_PATH, "r") as f:
                existing_updates = json.load(f)
            print(f"📖 Loaded existing updates for {len(existing_updates)} jatras.")
        except Exception as e:
            print(f"⚠️ Error loading updates file, generating fresh: {e}")

    # Get IST Time
    ist_now = get_ist_time()
    print(f"⏰ India Standard Time (IST) Current: {ist_now.strftime('%Y-%m-%d %H:%M:%S')} (Hour: {ist_now.hour})")

    # Update all 12 major Jatra updates
    all_jatra_ids = list(JATRA_PERIOD_DATA.keys())
    for jatra_id in all_jatra_ids:
        existing_updates[jatra_id] = generate_update(jatra_id, ist_now)

    # Save to disk
    try:
        os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
        with open(JSON_PATH, "w") as f:
            json.dump(existing_updates, f, indent=2)
        print("💾 Realtime updates successfully saved to disk.")
    except Exception as e:
        print(f"❌ Failed to write updates to {JSON_PATH}: {e}")
        sys.exit(1)

    # Write a bot log/report for manager bot
    log_path = os.path.join(LOG_DIR, "realtime_last_result.json")
    report = {
        "ran_at": datetime.now().isoformat(),
        "success": True,
        "updated_jatras": len(all_jatra_ids),
        "file_updated": JSON_PATH,
        "sample_update": existing_updates[all_jatra_ids[0]]
    }
    
    try:
        with open(log_path, "w") as f:
            json.dump(report, f, indent=2)
        print(f"📝 Log report written to {log_path}")
    except Exception as e:
        print(f"⚠️ Failed to write log report: {e}")

    print("🔱 Realtime Update Bot run completed successfully!")
    sys.exit(0)

if __name__ == "__main__":
    main()
