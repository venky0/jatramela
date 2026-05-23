#!/usr/bin/env python3
import os
import re
import json
from datetime import datetime, timezone

# Paths
BOTS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BOTS_DIR)
CONVERTERS_DIR = os.path.join(PROJECT_ROOT, "apps", "storefront", "src", "app", "[countryCode]", "(main)", "converters")
SKILLS_JSON = os.path.join(BOTS_DIR, "converter_skills.json")

def scan_parameters():
    print("🚀 [AI Agent] Starting analysis of client-side conversion engine parameters...")
    
    # 1. Parse Vectorizer Parameters (converters-client.tsx)
    vectorizer_client = os.path.join(CONVERTERS_DIR, "graphics", "vectorizer", "converters-client.tsx")
    scanned_params = {}
    
    if os.path.exists(vectorizer_client):
        print(f"🔍 Reading Vectorizer client codebase: {vectorizer_client}")
        with open(vectorizer_client, "r", encoding="utf-8") as f:
            content = f.read()
            
            # Extract React state hook default values
            color_match = re.search(r"useState(?:<number>)?\((\d+)\)\s*//\s*colorCount", content)
            if not color_match:
                color_match = re.search(r"useState(?:<number>)?\((\d+)\)\s*.*colorCount", content)
            if not color_match:
                # Fallback to general capture
                color_match = re.search(r"colorCount.*?useState(?:<number>)?\((\d+)\)", content)
                
            rdp_match = re.search(r"rdpThreshold.*?useState(?:<number>)?\(([\d\.]+)\)", content)
            smooth_match = re.search(r"smoothing.*?useState(?:<number>)?\(([\d\.]+)\)", content)
            laplacian_match = re.search(r"laplacianSmooth.*?useState(?:<number>)?\((\d+)\)", content)
            noise_match = re.search(r"noiseThreshold.*?useState(?:<number>)?\((\d+)\)", content)
            
            if color_match:
                scanned_params["colorCount"] = int(color_match.group(1))
            if rdp_match:
                scanned_params["rdpThreshold"] = float(rdp_match.group(1))
            if smooth_match:
                scanned_params["smoothing"] = float(smooth_match.group(1))
            if laplacian_match:
                scanned_params["laplacianSmooth"] = int(laplacian_match.group(1))
            if noise_match:
                scanned_params["noiseThreshold"] = int(noise_match.group(1))
    else:
        print(f"⚠️ Vectorizer client not found at {vectorizer_client}, utilizing defaults.")
        
    return scanned_params

def update_skills_registry(scanned_params):
    if not os.path.exists(SKILLS_JSON):
        print(f"⚠️ Skills registry not found at {SKILLS_JSON}. Cannot update.")
        return
        
    with open(SKILLS_JSON, "r", encoding="utf-8") as f:
        registry = json.load(f)
        
    # Update Vectorizer parameters if scanned
    if "vectorizer" in registry["skills"]:
        vec_skills = registry["skills"]["vectorizer"]["parameters"]
        for key, val in scanned_params.items():
            if key in vec_skills:
                old_val = vec_skills[key]["current_val"]
                vec_skills[key]["current_val"] = val
                print(f"📊 Vectorizer Parameter '{key}': Syncing default value from {old_val} ➔ {val}")
                
                # Check constraints
                min_opt, max_opt = vec_skills[key]["optimal_range"]
                if min_opt <= val <= max_opt:
                    print(f"   ✅ '{key}' is within the optimal range [{min_opt}, {max_opt}]")
                else:
                    print(f"   ⚠️ WARNING: '{key}' value {val} is outside the optimal range [{min_opt}, {max_opt}]!")
                    
    # Update execution benchmarks and metadata
    registry["learning_state"]["last_optimized_timestamp"] = datetime.now(timezone.utc).isoformat()
    registry["learning_state"]["total_optimization_cycles"] += 1
    
    with open(SKILLS_JSON, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)
        
    print(f"💾 Registry successfully updated. Total optimization cycles: {registry['learning_state']['total_optimization_cycles']}.")

if __name__ == "__main__":
    params = scan_parameters()
    update_skills_registry(params)
    print("✨ [AI Agent] Optimization run completed successfully!")
