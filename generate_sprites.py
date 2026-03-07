#!/usr/bin/env python3
"""Generate anime-style character sprites (5 emotions × 4 characters) using Flux2 Klein + RetroAnimeFluxV1 LoRA."""
import json, time, random, sys, os
import urllib.request, urllib.parse

BASE = "http://127.0.0.1:8188"
IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/ConvenienceStore/img")

# Shared style prefix for all characters
STYLE_PREFIX = (
    "anime style, retro anime illustration, visual novel character sprite, "
    "half-body portrait from head to waist, both shoulders fully visible and not cropped, "
    "centered horizontally in frame, generous horizontal framing, "
    "solid bright green background, #00ff00 pure chroma key green background, no shadows on background, "
    "RetroAnime, detailed anime art, soft lighting, "
)

CHARACTERS = {
    "guitarist": {
        "base": (
            "young Asian man, early 20s, slightly messy dark hair, wearing a casual dark hoodie, "
            "slim build, tired eyes, delivery bag strap visible on shoulder"
        ),
        "emotions": {
            "normal":    "neutral calm expression, relaxed face, looking slightly to the side",
            "happy":     "warm genuine smile, eyes lit up with soft warmth, happy expression",
            "sad":       "downcast eyes, melancholy expression, quietly troubled look",
            "surprised": "wide eyes, slightly open mouth, startled shocked expression",
            "shy":       "looking away slightly, subtle soft blush on cheeks, gentle embarrassed smile",
        },
    },
    "coder": {
        "base": (
            "young Asian woman, early 20s, round glasses, wearing a light hoodie or soft jacket, "
            "hair loosely tied, sharp intelligent eyes, laptop bag strap on shoulder"
        ),
        "emotions": {
            "normal":    "focused neutral expression, composed and alert look",
            "happy":     "bright smile, eyes warm behind glasses, cheerful expression",
            "sad":       "downcast eyes, quiet sorrowful expression, holding back emotion",
            "surprised": "eyes wide open behind glasses, mouth slightly open, shocked look",
            "shy":       "cheeks faintly flushed, looking slightly away, soft awkward smile",
        },
    },
    "hacker": {
        "base": (
            "middle-aged Asian man, around 50 years old, wearing a plain dark long-sleeve shirt, "
            "glasses, slightly graying hair, weathered kind face, calm demeanor"
        ),
        "emotions": {
            "normal":    "quiet calm expression, weathered but kind eyes, stoic look",
            "happy":     "gentle warm smile, eyes soft with kindness, fatherly expression",
            "sad":       "heavy eyes, tired sorrowful expression, burden on his face",
            "surprised": "eyebrows raised, eyes wide, surprised expression, slightly open mouth",
            "shy":       "embarrassed expression, looking slightly to the side, rare soft smile",
        },
    },
    "ghost": {
        "base": (
            "ghost spirit of a young Asian woman, early 20s, highly translucent semi-transparent body, "
            "glowing pale blue-white aura around her, wispy dissolving edges, floating ghostly silhouette, "
            "wearing faded vintage 1980s Chinese qipao dress, long flowing silver-white hair drifting upward as if underwater, "
            "visible through her body, eerie supernatural beauty, solid bright green background, #00ff00 chroma key green background"
        ),
        "emotions": {
            "normal":    "serene hollow gaze, distant empty eyes glowing faintly, expressionless ghostly stillness, otherworldly calm",
            "happy":     "rare gentle ethereal smile, eyes glowing softly warm, fleeting warmth on a ghost face",
            "sad":       "weeping translucent tears of light, deep sorrowful hollow eyes, mournful expression, longing for the living",
            "surprised": "wide glowing luminous eyes, mouth open in silent gasp, hair wildly floating upward, startled spirit",
            "shy":       "turning slightly away, covering mouth with translucent hand, bashful ghostly blush as faint glow on cheeks",
        },
    },
}

def build_workflow(prompt, seed, prefix):
    w, h = 576, 768
    return {
        "1":  {"class_type": "UNETLoader",           "inputs": {"unet_name": "flux-2-klein-4b.safetensors", "weight_dtype": "default"}},
        "2":  {"class_type": "CLIPLoader",            "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "flux2"}},
        "3":  {"class_type": "VAELoader",             "inputs": {"vae_name": "flux2-vae.safetensors"}},
        "14": {"class_type": "LoraLoader",            "inputs": {"model": ["1", 0], "clip": ["2", 0],
                                                                  "lora_name": "RetroAnimeFluxV1.safetensors",
                                                                  "strength_model": 0.85, "strength_clip": 0.85}},
        "4":  {"class_type": "CLIPTextEncode",        "inputs": {"text": prompt, "clip": ["14", 1]}},
        "5":  {"class_type": "ConditioningZeroOut",   "inputs": {"conditioning": ["4", 0]}},
        "6":  {"class_type": "CFGGuider",             "inputs": {"model": ["14", 0], "positive": ["4", 0], "negative": ["5", 0], "cfg": 1.0}},
        "7":  {"class_type": "RandomNoise",           "inputs": {"noise_seed": seed}},
        "8":  {"class_type": "EmptyFlux2LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "9":  {"class_type": "Flux2Scheduler",        "inputs": {"steps": 4, "width": w, "height": h}},
        "10": {"class_type": "KSamplerSelect",        "inputs": {"sampler_name": "euler"}},
        "11": {"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["7", 0], "guider": ["6", 0], "sampler": ["10", 0], "sigmas": ["9", 0], "latent_image": ["8", 0]}},
        "12": {"class_type": "VAEDecode",             "inputs": {"samples": ["11", 0], "vae": ["3", 0]}},
        "13": {"class_type": "SaveImage",             "inputs": {"images": ["12", 0], "filename_prefix": prefix}},
    }

def api_post(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(f"{BASE}{path}", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())

def api_get(path):
    with urllib.request.urlopen(f"{BASE}{path}", timeout=30) as r:
        return json.loads(r.read())

def generate_and_save(char_id, emotion, out_path):
    char = CHARACTERS[char_id]
    prompt = STYLE_PREFIX + char["base"] + ", " + char["emotions"][emotion]
    seed = random.randint(0, 2**31)
    prefix = f"cs_sprite_{char_id}_{emotion}"
    print(f"  [{char_id}/{emotion}] seed={seed}")
    wf = build_workflow(prompt, seed, prefix)
    resp = api_post("/prompt", {"prompt": wf})
    pid = resp["prompt_id"]

    start = time.time()
    while time.time() - start < 300:
        time.sleep(4)
        hist = api_get(f"/history/{pid}")
        if pid in hist:
            entry = hist[pid]
            if entry.get("status", {}).get("status_str") == "error":
                for m in entry["status"].get("messages", []):
                    if m[0] == "execution_error":
                        print("  Error:", m[1].get("exception_message"))
                        return False
            if entry.get("outputs"):
                elapsed = int(time.time() - start)
                for node_out in entry["outputs"].values():
                    for i in node_out.get("images", []):
                        params = urllib.parse.urlencode({
                            "filename": i["filename"],
                            "subfolder": i.get("subfolder", ""),
                            "type": i.get("type", "output"),
                        })
                        urllib.request.urlretrieve(f"{BASE}/view?{params}", out_path)
                        print(f"  Done in {elapsed}s → {os.path.basename(out_path)}")
                return True
        print(f"  … {int(time.time()-start)}s", flush=True)
    print("  Timeout!")
    return False

EMOTIONS = ["normal", "happy", "sad", "surprised", "shy"]

# Allow selective generation: python generate_sprites.py guitarist coder
chars_to_gen = sys.argv[1:] if len(sys.argv) > 1 else list(CHARACTERS.keys())

for char_id in chars_to_gen:
    if char_id not in CHARACTERS:
        print(f"Unknown character: {char_id}")
        continue
    print(f"\n=== {char_id} ===")
    for emotion in EMOTIONS:
        out_path = os.path.join(IMG_DIR, f"{char_id}_{emotion}.png")
        if os.path.exists(out_path):
            print(f"  [{char_id}/{emotion}] already exists, skipping")
            continue
        ok = generate_and_save(char_id, emotion, out_path)
        if not ok:
            sys.exit(1)

print("\nAll sprites done!")
