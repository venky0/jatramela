#!/usr/bin/env python3
import os
import re
import json
import urllib.request
from datetime import datetime, timezone
import subprocess

# Paths
BOTS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BOTS_DIR)
LIB_FILE = os.path.join(PROJECT_ROOT, "apps", "storefront", "src", "lib", "kannada-transliteration.ts")
SKILLS_JSON = os.path.join(BOTS_DIR, "converter_skills.json")
LOG_FILE = os.path.join(BOTS_DIR, "reports", "learning_report.json")

# ── KANNADA TRANSLITERATION DICTIONARY MAPS (REVERSE) ────────────────────────
VOWELS = {
    '\u0C85': 'a', '\u0C86': 'aa', '\u0C87': 'i', '\u0C88': 'ee', '\u0C89': 'u',
    '\u0C8A': 'uu', '\u0C8B': 'ru', '\u0C8E': 'e', '\u0C8F': 'ee', '\u0C90': 'ai',
    '\u0C92': 'o', '\u0C93': 'oo', '\u0C94': 'au'
}

MATRAS = {
    '\u0CBE': 'aa', '\u0CBF': 'i', '\u0CC0': 'ee', '\u0CC1': 'u', '\u0CC2': 'uu',
    '\u0CC3': 'ru', '\u0CC6': 'e', '\u0CC7': 'ee', '\u0CC8': 'ai', '\u0CCA': 'o',
    '\u0CCB': 'oo', '\u0CCC': 'au'
}

CONSONANTS = {
    '\u0C95': 'k', '\u0C96': 'kh', '\u0C97': 'g', '\u0C98': 'gh', '\u0C99': 'ng',
    '\u0C9A': 'ch', '\u0C9B': 'chh', '\u0C9C': 'j', '\u0C9D': 'jh', '\u0C9E': 'ny',
    '\u0C9F': 't', '\u0CA0': 'th', '\u0CA1': 'd', '\u0CA2': 'dh', '\u0CA3': 'n',
    '\u0CA4': 't', '\u0CA5': 'th', '\u0CA6': 'd', '\u0CA7': 'dh', '\u0CA8': 'n',
    '\u0CAA': 'p', '\u0CAB': 'ph', '\u0CAC': 'b', '\u0CAD': 'bh', '\u0CAE': 'm',
    '\u0CAF': 'y', '\u0CB0': 'r', '\u0CB2': 'l', '\u0CB5': 'v', '\u0CB6': 'sh',
    '\u0CB7': 'sh', '\u0CB8': 's', '\u0CB9': 'h', '\u0CB3': 'l'
}

# Offline Backup Vocabulary (Classic Literature & Common words) to learn if offline
BACKUP_WORDS = [
    "ವಿಜಯ", "ಕಾವ್ಯ", "ಧರ್ಮ", "ರತ್ನ", "ಕೀರ್ತಿ", "ಭಾವನೆ", "ಗೌರವ", "ಶಾಂತಿ", "ಸ್ನೇಹ", 
    "ಸಂತೋಷ", "ಚಿತ್ರ", "ಭಾಷಣ", "ಸಂಗೀತ", "ನಾಟ್ಯ", "ಪತ್ರಿಕೆ", "ಲೋಕ", "ದೇಶ", "ಗ್ರಾಮ"
]

def romanize_kannada(word):
    """Convert Kannada Unicode string to phonetic Latin characters (Kanglish)."""
    result = ""
    i = 0
    n = len(word)
    while i < n:
        char = word[i]
        
        if char in VOWELS:
            result += VOWELS[char]
            i += 1
        elif char in CONSONANTS:
            consonant_sound = CONSONANTS[char]
            
            # Lookahead for Virama (conjunct marker)
            if i + 1 < n and word[i+1] == '\u0CCD':
                # Double letters (e.g. ಕ್ಕ -> kk)
                if i + 2 < n and word[i+2] in CONSONANTS:
                    result += consonant_sound
                    i += 2  # Skip consonant + virama
                else:
                    # Trailing virama or word boundary
                    result += consonant_sound
                    i += 2  # Skip consonant + virama
            # Lookahead for vowel matra
            elif i + 1 < n and word[i+1] in MATRAS:
                matra_char = word[i+1]
                result += consonant_sound + MATRAS[matra_char]
                i += 2
            else:
                # Inherent 'a' vowel
                result += consonant_sound + 'a'
                i += 1
        elif char == '\u0C82':  # Anusvara (ಂ)
            result += 'm' if (i + 1 == n) else 'n'
            i += 1
        elif char == '\u0C83':  # Visarga (ಃ)
            result += 'h'
            i += 1
        else:
            i += 1  # Skip unknown characters (e.g., punctuation)
            
    # Clean up multiple repeating vowels to standardize spelling
    result = re.sub(r'a{3,}', 'aa', result)
    result = re.sub(r'e{3,}', 'ee', result)
    result = re.sub(r'i{3,}', 'ii', result)
    result = re.sub(r'u{3,}', 'uu', result)
    result = re.sub(r'o{3,}', 'oo', result)
    return result

def generate_declensions(kannada_word):
    """Generate base, genitive (of X), and locative (in X) variants for the suggestion panel."""
    return [
        kannada_word,
        kannada_word + "ದ",      # Genitive case
        kannada_word + "ದಲ್ಲಿ"    # Locative case
    ]

def fetch_recent_kannada_words():
    """Fetch live edit updates from Kannada Wikipedia to harvest new words."""
    print("🌐 [AI Learning Agent] Querying Kannada Wikipedia for recent edits...")
    url = "https://kn.wikipedia.org/w/api.php?action=query&list=recentchanges&rclimit=50&format=json"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Jatramela Learning Agent)'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        recent_changes = data.get("query", {}).get("recentchanges", [])
        words = []
        for rc in recent_changes:
            title = rc.get("title", "")
            # Keep only Kannada characters and split into words
            kannada_only = re.sub(r'[^\u0C80-\u0CFF\s]', '', title)
            words.extend(kannada_only.split())
            
        # Deduplicate and filter length
        filtered = list(set([w for w in words if len(w) >= 3]))
        print(f"   ✅ Successfully fetched and extracted {len(filtered)} words online.")
        return filtered
    except Exception as e:
        print(f"   ⚠️ Connection failed ({e}). Falling back to classical literature backup dataset...")
        return BACKUP_WORDS

def update_dictionary_file(new_mappings):
    """Insert newly learned mappings into KANNADA_DICTIONARY in apps/storefront/src/lib/kannada-transliteration.ts."""
    if not os.path.exists(LIB_FILE):
        print(f"❌ Target library not found at: {LIB_FILE}")
        return 0
        
    with open(LIB_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Match the dictionary block in the TS file
    pattern = r"(export const KANNADA_DICTIONARY:.*?=\s*\{)([\s\S]*?)(\n\})"
    match = re.search(pattern, content)
    if not match:
        print("❌ KANNADA_DICTIONARY declaration not found in file.")
        return 0
        
    header, dict_body, footer = match.groups()
    
    # Identify existing keys in the dictionary
    existing_keys = set(re.findall(r'"([^"]+)":\s*\[', dict_body))
    
    added_count = 0
    new_items_str = ""
    for key, val_list in new_mappings.items():
        if key not in existing_keys:
            vals_str = ", ".join(f'"{v}"' for v in val_list)
            new_items_str += f'\n  "{key}": [{vals_str}],'
            added_count += 1
            existing_keys.add(key)
            
    if added_count > 0:
        updated_body = dict_body.rstrip()
        if updated_body.endswith(","):
            updated_body += new_items_str
        else:
            updated_body += "," + new_items_str
            
        updated_content = content[:match.start()] + header + updated_body + "\n}" + content[match.end():]
        
        with open(LIB_FILE, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"💾 Updated {LIB_FILE} with {added_count} newly learned words!")
    else:
        print("ℹ️ No new vocabulary discovered today.")
        
    return added_count

def run_checks_and_sync():
    """Trigger the optimize script to sync parameters and compile Check."""
    print("🤖 Running converter parameter sync...")
    optimize_script = os.path.join(BOTS_DIR, "optimize_converters.py")
    if os.path.exists(optimize_script):
        subprocess.run(["python3", optimize_script], check=True)
        
    # Verify build still compiles successfully
    print("⚙️ Verifying app compilation...")
    storefront_dir = os.path.join(PROJECT_ROOT, "apps", "storefront")
    try:
        subprocess.run(["pnpm", "build"], cwd=storefront_dir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print("   ✅ Compiled successfully!")
    except Exception as e:
        print(f"   ❌ Compilation failed: {e}")

def main():
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"🤖 [AI Learning Agent] Session Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    
    # 1. Fetch raw Kannada words
    kannada_words = fetch_recent_kannada_words()
    
    # 2. Romanize and build mappings
    new_mappings = {}
    for word in kannada_words:
        latin_spelling = romanize_kannada(word)
        if latin_spelling and latin_spelling.isalpha():
            new_mappings[latin_spelling.lower()] = generate_declensions(word)
            
    # 3. Update library
    added_count = update_dictionary_file(new_mappings)
    
    # 4. Save learning reports
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "words_discovered": len(kannada_words),
        "words_learned": added_count,
        "new_vocabulary": list(new_mappings.keys())[:added_count]
    }
    
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        
    # 5. Compile and Sync
    if added_count > 0:
        run_checks_and_sync()
        
    print(f"✨ [AI Learning Agent] Done. Learned {added_count} new words today.")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

if __name__ == "__main__":
    main()
