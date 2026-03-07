#!/usr/bin/env python3
"""Generate anime-style bg.png and poster.png using Flux2 Klein + RetroAnimeFluxV1 LoRA."""
import json, time, random, sys, os
import urllib.request, urllib.parse

BASE = "http://127.0.0.1:8188"
IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/ConvenienceStore/img")

IMAGES = [
    {
        "name": "bg",
        "out": os.path.join(IMG_DIR, "bg.png"),
        "prefix": "cs_bg_anime",
        "w": 512, "h": 896,
        "prompt": (
            "anime style, retro anime, japanese convenience store interior at night, 3am, "
            "warm fluorescent ceiling lights casting orange glow, "
            "long rows of colorful shelves with products, "
            "large glass sliding doors showing dark rainy street outside, "
            "puddles reflecting neon lights, clean and empty store, "
            "visual novel background art, detailed scenery, beautiful lighting, "
            "soft warm color palette, no people, no characters"
        ),
    },
    {
        "name": "poster",
        "out": os.path.join(IMG_DIR, "poster.png"),
        "prefix": "cs_poster_anime",
        "w": 1024, "h": 1024,
        "prompt": (
            "anime style, retro anime illustration, game cover art, square composition, "
            "small japanese convenience store at night viewed from outside, "
            "warm glowing windows in dark rainy street, "
            "four anime characters visible as silhouettes inside, "
            "neon sign reflections on wet pavement, "
            "deep blue night sky with rain, orange and blue color palette, "
            "beautiful anime art, detailed illustration, cinematic composition"
        ),
    },
]

def build_workflow(prompt, seed, w, h, prefix):
    return {
        "1":  {"class_type": "UNETLoader",           "inputs": {"unet_name": "flux-2-klein-4b.safetensors", "weight_dtype": "default"}},
        "2":  {"class_type": "CLIPLoader",            "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "flux2"}},
        "3":  {"class_type": "VAELoader",             "inputs": {"vae_name": "flux2-vae.safetensors"}},
        # LoRA inserted between loaders and the rest
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

for img in IMAGES:
    seed = random.randint(0, 2**31)
    print(f"\n[{img['name']}] {img['w']}×{img['h']}, seed={seed}…")
    wf = build_workflow(img["prompt"], seed, img["w"], img["h"], img["prefix"])
    resp = api_post("/prompt", {"prompt": wf})
    pid = resp["prompt_id"]
    print(f"  prompt_id={pid[:8]}…")

    start = time.time()
    while time.time() - start < 600:
        time.sleep(4)
        hist = api_get(f"/history/{pid}")
        if pid in hist:
            entry = hist[pid]
            if entry.get("status", {}).get("status_str") == "error":
                for m in entry["status"].get("messages", []):
                    if m[0] == "execution_error":
                        print("Error:", m[1].get("exception_message"))
                        sys.exit(1)
            if entry.get("outputs"):
                elapsed = int(time.time() - start)
                print(f"  Done in {elapsed}s")
                for node_out in entry["outputs"].values():
                    for i in node_out.get("images", []):
                        params = urllib.parse.urlencode({"filename": i["filename"], "subfolder": i.get("subfolder",""), "type": i.get("type","output")})
                        urllib.request.urlretrieve(f"{BASE}/view?{params}", img["out"])
                        print(f"  Saved → {img['out']}")
                break
        print(f"  … {int(time.time()-start)}s", flush=True)

print("\nAll done!")
