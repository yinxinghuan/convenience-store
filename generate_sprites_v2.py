#!/usr/bin/env python3
"""
Generate v2 character sprites using Flux2 Klein Edit (ReferenceLatent / img2img).
Each sprite uses 2 reference images to preserve character likeness.

Usage:
  python3 generate_sprites_v2.py                   # all chars, all emotions
  python3 generate_sprites_v2.py guitarist         # single char
  python3 generate_sprites_v2.py guitarist normal  # single sprite (for testing)
"""
import json, time, random, sys, os
import urllib.request, urllib.parse, urllib.error

BASE    = "http://127.0.0.1:8188"
IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/ConvenienceStore/img")
REF_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "references")

# ── Sprite format ────────────────────────────────────────────────────────────
W, H = 640, 768
STYLE_PREFIX = (
    "anime style, retro anime illustration, visual novel character sprite, "
    "half-body portrait from head to waist, both shoulders fully visible and not cropped, "
    "wide enough framing to show full width of shoulders, "
    "centered horizontally, solid bright green background, #00ff00 chroma key green, "
    "no background objects, clean green background, "
)

# ── Character definitions ─────────────────────────────────────────────────────
CHARACTERS = {
    "guitarist": {
        "base": (
            "young Asian boy, early teens, spiky dark brown hair, "
            "beige tan jacket over teal green hoodie, necklace pendant, "
            "acoustic guitar, backpack strap visible"
        ),
        "refs": ["ref_happy.png", "ref_normal.png"],  # 2 reference images
        "emotions": {
            "normal":    "neutral calm expression, slight smile, looking forward",
            "happy":     "big bright smile, eyes lit up with joy, cheerful expression",
            "sad":       "downcast tired eyes, melancholy expression, head slightly lowered",
            "surprised": "wide eyes, open mouth, shocked startled expression",
            "shy":       "looking away, cheeks blushing, gentle embarrassed smile",
        },
    },
    "coder": {
        "base": (
            "young girl, shoulder-length brown hair, large round black-frame glasses, "
            "bright green eyes, purple hoodie with front pocket"
        ),
        "refs": ["ref_normal.png", "ref_happy.png"],
        "emotions": {
            "normal":    "calm neutral expression, slight confident smile, composed look",
            "happy":     "big open smile, arms slightly raised, full of energy, joyful",
            "sad":       "frowning, eyes downcast, quietly troubled expression",
            "surprised": "wide eyes behind glasses, mouth slightly open, alarmed look",
            "shy":       "looking slightly to side, faint blush, soft awkward smile",
        },
    },
    "hacker": {
        "base": (
            "Asian man, late 30s, clean side-swept black hair, light stubble, "
            "round black-frame glasses, black bomber jacket over white dress shirt, "
            "zoomed out, full shoulders visible, wide shot showing torso"
        ),
        "refs": ["ref_normal.png", "ref_calm.png"],
        "emotions": {
            "normal":    "calm composed expression, quiet confident gaze",
            "happy":     "gentle warm smile, relaxed eyes, fatherly kind expression",
            "sad":       "heavy tired eyes, weathered sorrowful look, burden on face",
            "surprised": "eyebrows raised, eyes wide, surprised open expression",
            "shy":       "rare embarrassed expression, looking slightly away, soft smile",
        },
    },
    "ghost": {
        "base": (
            "white bedsheet ghost costume, two large black oval eyes, "
            "sheet draped loosely over body, ghost silhouette shape, "
            "white fabric with natural folds and shadows"
        ),
        "refs": ["ref_normal.webp", "ref_front.webp"],
        "emotions": {
            "normal":    "both eyes looking forward, still and calm",
            "happy":     "eyes curved upward in a smile shape, cheerful ghost",
            "sad":       "eyes drooping downward, sorrowful ghost expression",
            "surprised": "eyes wide open, ghost leaning slightly back",
            "shy":       "one eye peeking, ghost turned slightly away, bashful",
        },
    },
}

EMOTIONS = ["normal", "happy", "sad", "surprised", "shy"]


def upload_image(filepath):
    """Upload a local image to ComfyUI and return the server filename."""
    ext = os.path.splitext(filepath)[1].lower()
    mime = "image/webp" if ext == ".webp" else "image/png"
    filename = os.path.basename(filepath)
    with open(filepath, "rb") as f:
        data = f.read()
    boundary = "----FormBoundary" + hex(random.randint(0, 0xFFFFFF))[2:]
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'
        f"Content-Type: {mime}\r\n\r\n"
    ).encode() + data + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        f"{BASE}/upload/image",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        resp = json.loads(r.read())
    return resp["name"]


def build_workflow(prompt, ref1_name, ref2_name, seed):
    return {
        "1":  {"class_type": "UNETLoader",              "inputs": {"unet_name": "flux-2-klein-4b.safetensors", "weight_dtype": "default"}},
        "2":  {"class_type": "CLIPLoader",               "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "flux2"}},
        "3":  {"class_type": "VAELoader",                "inputs": {"vae_name": "flux2-vae.safetensors"}},
        "4":  {"class_type": "CLIPTextEncode",           "inputs": {"text": prompt, "clip": ["2", 0]}},
        "5":  {"class_type": "ConditioningZeroOut",      "inputs": {"conditioning": ["4", 0]}},
        "6":  {"class_type": "CFGGuider",                "inputs": {"model": ["1", 0], "positive": ["21", 0], "negative": ["5", 0], "cfg": 1.0}},
        "7":  {"class_type": "RandomNoise",              "inputs": {"noise_seed": seed}},
        "8":  {"class_type": "EmptyFlux2LatentImage",    "inputs": {"width": W, "height": H, "batch_size": 1}},
        "9":  {"class_type": "Flux2Scheduler",           "inputs": {"steps": 4, "width": W, "height": H}},
        "10": {"class_type": "KSamplerSelect",           "inputs": {"sampler_name": "euler"}},
        "11": {"class_type": "SamplerCustomAdvanced",    "inputs": {"noise": ["7", 0], "guider": ["6", 0], "sampler": ["10", 0], "sigmas": ["9", 0], "latent_image": ["8", 0]}},
        "12": {"class_type": "VAEDecode",                "inputs": {"samples": ["11", 0], "vae": ["3", 0]}},
        "13": {"class_type": "SaveImage",                "inputs": {"images": ["12", 0], "filename_prefix": "cs_v2"}},
        # Reference image 1
        "14": {"class_type": "LoadImage",                "inputs": {"image": ref1_name}},
        "15": {"class_type": "ImageScaleToTotalPixels",  "inputs": {"image": ["14", 0], "upscale_method": "lanczos", "megapixels": 0.25, "resolution_steps": 1}},
        "16": {"class_type": "VAEEncode",                "inputs": {"pixels": ["15", 0], "vae": ["3", 0]}},
        "17": {"class_type": "ReferenceLatent",          "inputs": {"conditioning": ["4", 0], "latent": ["16", 0]}},
        # Reference image 2
        "18": {"class_type": "LoadImage",                "inputs": {"image": ref2_name}},
        "19": {"class_type": "ImageScaleToTotalPixels",  "inputs": {"image": ["18", 0], "upscale_method": "lanczos", "megapixels": 0.25, "resolution_steps": 1}},
        "20": {"class_type": "VAEEncode",                "inputs": {"pixels": ["19", 0], "vae": ["3", 0]}},
        "21": {"class_type": "ReferenceLatent",          "inputs": {"conditioning": ["17", 0], "latent": ["20", 0]}},
    }


def api_post(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(f"{BASE}{path}", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def api_get(path):
    with urllib.request.urlopen(f"{BASE}{path}", timeout=30) as r:
        return json.loads(r.read())


def generate_and_save(char_id, emotion, out_path, ref1_server, ref2_server):
    char  = CHARACTERS[char_id]
    prompt = STYLE_PREFIX + char["base"] + ", " + char["emotions"][emotion]
    seed   = random.randint(0, 2**31)
    print(f"  [{char_id}/{emotion}] seed={seed}")
    wf   = build_workflow(prompt, ref1_server, ref2_server, seed)
    resp = api_post("/prompt", {"prompt": wf})
    pid  = resp["prompt_id"]

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


# ── Parse args ────────────────────────────────────────────────────────────────
args = sys.argv[1:]
if len(args) >= 2:
    chars_to_gen = [args[0]]
    emotions_to_gen = [args[1]]
elif len(args) == 1:
    chars_to_gen = [args[0]]
    emotions_to_gen = EMOTIONS
else:
    chars_to_gen = list(CHARACTERS.keys())
    emotions_to_gen = EMOTIONS

os.makedirs(IMG_DIR, exist_ok=True)

# ── Upload reference images (once per character) ──────────────────────────────
ref_cache = {}  # char_id -> (ref1_server, ref2_server)

for char_id in chars_to_gen:
    if char_id not in CHARACTERS:
        print(f"Unknown character: {char_id}")
        continue

    char     = CHARACTERS[char_id]
    ref_dir  = os.path.join(REF_DIR, char_id)
    refs     = char["refs"]
    uploaded = []
    for ref_filename in refs:
        local_path = os.path.join(ref_dir, ref_filename)
        if not os.path.exists(local_path):
            print(f"  Missing reference: {local_path}")
            sys.exit(1)
        print(f"  Uploading {ref_filename}…", end=" ", flush=True)
        server_name = upload_image(local_path)
        print(server_name)
        uploaded.append(server_name)
    ref_cache[char_id] = (uploaded[0], uploaded[1])

# ── Generate sprites ──────────────────────────────────────────────────────────
for char_id in chars_to_gen:
    if char_id not in CHARACTERS:
        continue
    print(f"\n=== {char_id} ===")
    ref1, ref2 = ref_cache[char_id]
    for emotion in emotions_to_gen:
        out_path = os.path.join(IMG_DIR, f"{char_id}_{emotion}.png")
        if os.path.exists(out_path):
            print(f"  [{char_id}/{emotion}] already exists, skipping")
            continue
        ok = generate_and_save(char_id, emotion, out_path, ref1, ref2)
        if not ok:
            sys.exit(1)

print("\nAll done!")
