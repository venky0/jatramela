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
from datetime import datetime

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
    # If not found, use a fallback path
    JSON_PATH = os.path.join(CWD, "apps/storefront/src/lib/data/jatra-updates.json")

# Contextual Jatra Update Databases
JATRA_LIVE_DATA = {
    "jatra_mysuru_dasara": {
        "rituals": [
            "Special Maha Mangalarathi at Chamundeshwari Temple",
            "Kala-karshana and royal weapon worship (Aayudha Pooja)",
            "Chinnada Ambari sacred decoration",
            "Teppotsava floating festival prep in Devikere tank"
        ],
        "events": [
            "Jumboo Savari Elephant Procession final inspection",
            "Torchlight Parade rehearsal at Bannimantap grounds",
            "Royal Durbar assembly by descendants of the Wadiyar family"
        ],
        "parking": [
            "Parking available at Bannimantap Ground. Flow is normal.",
            "Heavy traffic on hill road. Use city parking and KSRTC shuttle service.",
            "Hill road entry restricted. Multi-level parking at Chamundi hill base is full."
        ],
        "alerts": [
            "Special senior citizen direct entry active at North Gate.",
            "Teppotsava evening entry passes available at counter 4.",
            "Queue lines moving smoothly. Average wait time: 45 minutes."
        ]
    },
    "jatra_sharanabasaveshwara": {
        "rituals": [
            "Pooja at the sacred Samadhi shrine",
            "Special Panchamrutha Abhisheka",
            "Siddhalinga Pooja at the inner sanctum"
        ],
        "events": [
            "Mass feeding (Dasoha) at noon in main hall",
            "Maha Rathotsava wooden chariot assembly",
            "Devotional music concerts by local artists"
        ],
        "parking": [
            "No delays. Main temple parking is open and clear.",
            "Traffic slow near temple road. Park at public layout ground."
        ],
        "alerts": [
            "Drinking water stations placed along the queue lines.",
            "Free medical camp active near the main temple arch.",
            "Rathotsava ropes setup complete. Chariot pulling starts at 5 PM."
        ]
    },
    "jatra_hampi_utsav": {
        "rituals": [
            "Virupaksha Temple special Abhisheka",
            "Deepotsava illumination prep at Tungabhadra banks",
            "Shobha Yatra cultural parade planning"
        ],
        "events": [
            "Light & Sound show at Virupaksha Temple",
            "Janapada folk art performances on stone stage",
            "Maha Rathotsava chariot pulling on Hampi Bazaar street"
        ],
        "parking": [
            "Traffic diverted near Hampi Bazaar. Use Hampi bypass parking.",
            "Free shuttle service running from Hosapete bypass parking zone."
        ],
        "alerts": [
            "KSRTC running special shuttle buses from Hosapete central station.",
            "Laser projection show starts at 7 PM. Entry is free.",
            "Helpdesk setup near the Virupaksha temple entrance."
        ]
    },
    "jatra_kadalekai_parishe": {
        "rituals": [
            "Nandi Monolith Milk Abhisheka",
            "Sacred Kadalekai (groundnut) offering to Nandi",
            "Maha Alankara of Nandi with fresh peanut garlands"
        ],
        "events": [
            "Groundnut market fair opening ceremony",
            "Deepotsava at adjacent Dodda Ganesha Temple",
            "Folk singing performances near monolithic Nandi"
        ],
        "parking": [
            "Bull Temple Road closed. Park near National College grounds.",
            "Heavy parking congestion. Use public transit to reach Basavanagudi."
        ],
        "alerts": [
            "Plastic bag ban strictly enforced. Eco-friendly bags available.",
            "Over 500 farmer stalls set up on Bull Temple Road.",
            "Special evening queue lines open for Nandi darshana."
        ]
    },
    "jatra_banashankari_devi": {
        "rituals": [
            "Alankara of Shakambhari Devi with green vegetables",
            "Panchamrutha Abhisheka and floral decoration",
            "Kumkumarchane by women devotees in outer hall"
        ],
        "events": [
            "Rathotsava chariot procession through Sirsi-Badami road",
            "Teppotsava floating festival in Haridra Tirtha pond",
            "Mass Prasada distribution at temple kitchen"
        ],
        "parking": [
            "Cholachagudda road clear. Free parking near temple pond.",
            "Parking filled at Main gate. Use secondary parking at high school ground."
        ],
        "alerts": [
            "Teppotsava scheduled for tomorrow night. Safety barriers installed.",
            "Special queue passes available for vegetable alankara darshana."
        ]
    },
    "jatra_suttur_mahotsav": {
        "rituals": [
            "Inauguration of Krishi Mela (Agricultural Expo)",
            "Adi Jagadguru Smaranotsava and sacred chants",
            "Kapila River Ganga Pooja and deepotsava"
        ],
        "events": [
            "Mass marriage ceremonies (Uchita Vivaha) in main hall",
            "Maharathotsava grand chariot pulling across the village",
            "Educational seminar on natural farming methods"
        ],
        "parking": [
            "Designated parking zones A & B are 60% full.",
            "Clear flow. Traffic volunteers guiding vehicles at Suttur bypass."
        ],
        "alerts": [
            "Free buttermilk distribution center active near Kapila bridge.",
            "Exhibition stalls open till 9 PM. Over 200 stalls active."
        ]
    },
    "jatra_ghati_subrahmanya": {
        "rituals": [
            "Ksheerabhisheka for swayambhu Naga deity",
            "Naga Pratishte sacred pooja and prayers",
            "Sarpa Samskara rituals in the inner shrine"
        ],
        "events": [
            "Pushya Rathotsava chariot pulling by devotees",
            "Maha Mangalarathi at outer shrine by chief priests",
            "Cattle fair inauguration and cattle parade"
        ],
        "parking": [
            "Heavy delays on Doddaballapur highway. Traffic police coordinating.",
            "Open field parking zone C is clear. Use Ghati bypass road."
        ],
        "alerts": [
            "Cattle fair grounds open. Special veterinary check post active.",
            "Special direct entry ticket counters open near North gate."
        ]
    },
    "jatra_udupi_paryaya": {
        "rituals": [
            "Paryaya Darbar and handover rituals in progress",
            "Madhwa Sarovara Ganga Pooja",
            "Kanakana Kindi special temple offering"
        ],
        "events": [
            "Lord Krishna temple car street procession",
            "Biennial Paryaya Peetha ascendancy ceremony at Udupi Math",
            "Anna Prasad mass feeding setup"
        ],
        "parking": [
            "City center closed for vehicles. Use parking at Kalsanka.",
            "Parking filled at Car Street. Park near City Bus Stand."
        ],
        "alerts": [
            "Anna Prasad (mass meals) starts at 11:30 AM at Bhojana Shala.",
            "Grand procession featuring 50+ cultural troupes starts at 3 AM."
        ]
    },
    "jatra_mailara_lingeshwara": {
        "rituals": [
            "Goravara Kunitha ritual dance on temple plains",
            "Mailara Lingeshwara sacred Abhisheka",
            "Breaking of heavy iron chains by Gorava devotees"
        ],
        "events": [
            "Karnika Utsava (divine prophecy prediction)",
            "Maha Rathotsava chariot pulling across Mylara plains",
            "Bhandara (turmeric) offering and tossing ceremony"
        ],
        "parking": [
            "Open field parking near Mylara plains is clear.",
            "Heavy dust. Drive slowly on approach roads near temple grounds."
        ],
        "alerts": [
            "Devotees advised to be careful during turmeric (Bhandara) tossing.",
            "Karnika prophecy bow setup complete on the plains."
        ]
    },
    "jatra_sirsi_marikamba": {
        "rituals": [
            "Kalyanotsava sacred marriage preparations for the Goddess",
            "Maha Alankara of 8-foot wooden Goddess Renuka",
            "Devi Abhisheka with sacred water"
        ],
        "events": [
            "Marikamba Shobha Yatra tomorrow morning",
            "Rathotsava chariot pulling through Sirsi main streets",
            "Goddess procession to local fair grounds"
        ],
        "parking": [
            "Sirsi town parking slots clear. Shuttles running every 15 min.",
            "Car street is closed to private vehicles. Use Yellapur road parking."
        ],
        "alerts": [
            "Massive 8-wheeled chariot assembly completed at car street.",
            "Saree offerings counter active at the administration office."
        ]
    },
    "jatra_saundatte_yellamma": {
        "rituals": [
            "Holy dip at Jogulabhavi sacred pond",
            "Chowdaki Pada singing praising Goddess Yellamma",
            "Maha Mangalarathi on hilltop shrine"
        ],
        "events": [
            "Rathotsava on the hilltop shrine in progress",
            "Sacred vessel 'Jag' carrying procession by devotees",
            "Midnight devotional vigil and singing assembly"
        ],
        "parking": [
            "Hill road blocked. Park at foothills and use official jeeps.",
            "Foothill parking is 80% full. Expect delay in getting jeeps."
        ],
        "alerts": [
            "Devotional singing (Chowdaki Pada) active throughout the night.",
            "Special medical tents set up at every 500 meters on the hill road."
        ]
    },
    "jatra_gokarna_mahashivaratri": {
        "rituals": [
            "Atmalinga Sparsha Pooja & Samudra Snana by pilgrims",
            "Maha Rudrabhisheka at inner sanctum",
            "Biligiri Ratha deepotsava ceremony"
        ],
        "events": [
            "Maha Ratha sea-side chariot pulling along narrow streets",
            "Midnight Jaagarane bhajan vigil at beach temple",
            "Sea beach Deepotsava with hundreds of oil lamps"
        ],
        "parking": [
            "Gokarna main road closed. Park near bus stand parking area.",
            "Beach road parking is full. Use temple school ground parking."
        ],
        "alerts": [
            "Special security arrangements on beach. Lifeguards on high alert.",
            "Queue for Sparsha Darshana of Atmalinga is about 1.5 hours wait."
        ]
    }
}

CROWD_STATUSES = ["Calm", "Normal", "Moderate", "Peak", "VVIP"]

WEATHER_TEMPS = [22, 24, 25, 27, 28, 30, 32, 34]
WEATHER_DESC = ["Clear Sky", "Pleasant Breeze", "Light Drizzle", "Warm Sunshine", "Cloud Cover", "Morning Fog"]

def generate_update(jatra_id):
    """Generate a realistic, contextual update object for a given Jatra ID."""
    jatra_data = JATRA_LIVE_DATA.get(jatra_id)
    if not jatra_data:
        # Generic backup data
        jatra_data = {
            "rituals": ["Maha Mangalarathi and Abhisheka", "Special temple alankara", "Teppotsava preparations"],
            "events": ["Rathotsava grand chariot pulling", "Dasoha mass feeding", "Cultural assembly"],
            "parking": ["Temple parking is clear.", "Park at the designated public parking slots."],
            "alerts": ["Queue moving steadily. Expected wait: 30 mins.", "Please cooperate with security."]
        }

    crowd_status = random.choice(CROWD_STATUSES)
    
    # Generate crowd count matching the status
    if crowd_status == "Calm":
        crowd_count = f"{random.randint(1500, 5000):,} devotees present"
    elif crowd_status == "Normal":
        crowd_count = f"{random.randint(6000, 15000):,} devotees present"
    elif crowd_status == "Moderate":
        crowd_count = f"{random.randint(16000, 40000):,} devotees present"
    elif crowd_status == "Peak":
        crowd_count = f"{random.randint(41000, 85000):,} devotees present"
    else: # VVIP
        crowd_count = f"{random.randint(90000, 130000):,}+ devotees & VIPs present"

    weather_str = f"{random.choice(WEATHER_TEMPS)}°C, {random.choice(WEATHER_DESC)}"
    
    return {
        "crowdStatus": crowd_status,
        "crowdCount": crowd_count,
        "currentRitual": random.choice(jatra_data["rituals"]),
        "nextEvent": random.choice(jatra_data["events"]),
        "weather": weather_str,
        "parkingAlert": random.choice(jatra_data["parking"]),
        "liveAlert": random.choice(jatra_data["alerts"]),
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
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

    # Update all 12 major Jatra updates
    all_jatra_ids = list(JATRA_LIVE_DATA.keys())
    for jatra_id in all_jatra_ids:
        existing_updates[jatra_id] = generate_update(jatra_id)

    # Save to disk
    try:
        # Create directories if they don't exist
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
