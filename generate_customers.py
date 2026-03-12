#!/usr/bin/env python3
"""
Generate random customer sprites for the convenience store game.
- Isaya & Isabel: reference image based (ReferenceLatent)
- Others: pure text-to-image

Usage:
  python3 generate_customers.py            # all characters
  python3 generate_customers.py chen_bo    # single character
  python3 generate_customers.py isaya normal  # single sprite
"""
import json, time, random, sys, os
import urllib.request, urllib.parse

BASE    = "http://127.0.0.1:8188"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                       "src/ConvenienceStore/img/customers")
W, H = 640, 768

STYLE_PREFIX = (
    "anime style, retro anime illustration, visual novel character sprite, "
    "half-body portrait from head to waist, both shoulders fully visible and not cropped, "
    "wide enough framing to show full width of shoulders, "
    "centered horizontally, solid bright green background, #00ff00 chroma key green, "
    "no background objects, clean green background, "
)

# ── Character definitions ─────────────────────────────────────────────────────
CUSTOMERS = {

    "chen_bo": {
        "label": "陈伯 (old neighbor)",
        "refs":  None,  # text-only
        "base": (
            "elderly Asian man, about 70 years old, white hair, deeply wrinkled kind face, "
            "simple worn cotton button-up shirt, dark loose trousers, "
            "holding a worn cloth shopping bag, gentle weathered appearance"
        ),
        "emotions": {
            "normal":    "calm melancholy expression, distant thoughtful gaze, quiet dignity",
            "happy":     "warm grandfatherly smile, gentle crinkled eyes, nostalgic joy",
            "sad":       "heavy sorrowful eyes, head slightly bowed, grief-worn expression",
            "surprised": "startled wide eyes, mouth open mid-complaint, knocked off balance, flustered and indignant",
        },
    },

    "xiao_li": {
        "label": "小李 (night shift worker)",
        "refs":  None,
        "base": (
            "Asian man, early 30s, short black hair, dark circles under eyes, "
            "yellow safety reflective vest over dark t-shirt, hard hat hanging from hand, "
            "construction worker appearance, tired posture"
        ),
        "emotions": {
            "normal":    "exhausted blank stare, drooping eyelids, bone-tired expression",
            "surprised": "eyes snapping open wide, sudden alertness breaking through fatigue",
        },
    },

    "isaya": {
        "label": "Isaya (insomniac)",
        "refs":  [
            "/Users/yin/Downloads/1772134145839906.webp",
            "/Users/yin/Downloads/1772329787918946.webp",
        ],
        "base": (
            "young woman, long straight blue hair, pale skin, blue-grey eyes, "
            "black oversized hoodie, black over-ear headphones resting on neck, "
            "quiet introverted appearance"
        ),
        "emotions": {
            "normal":    "calm quiet expression, slightly unfocused distant gaze, gentle melancholy",
            "sad":       "downcast eyes, hugging herself slightly, quietly overwhelmed expression",
            "surprised": "eyes widening, headphones sliding off, caught off guard look",
        },
    },

    "drunk": {
        "label": "酒鬼 (drunk)",
        "refs":  None,
        "base": (
            "Asian man, about 40 years old, disheveled messy hair, flushed red face, "
            "shirt half-untucked and wrinkled, holding a half-empty glass bottle loosely, "
            "swaying unsteady posture"
        ),
        "emotions": {
            "normal":    "glazed unfocused drunk eyes, silly loose grin, wobbly stance",
            "happy":     "loud laughing open mouth, slapping knee, sloppily joyful expression",
            "surprised": "sudden wide-eyed moment of soberness, bottle nearly dropped, shocked",
        },
    },

    "robber": {
        "label": "蒙面人 (robber)",
        "refs":  None,
        "base": (
            "figure of ambiguous gender, black hoodie with hood pulled low over face, "
            "lower face covered with dark mask or scarf, only eyes visible, "
            "tense aggressive posture, one hand shoved in hoodie pocket, "
            "threatening body language"
        ),
        "emotions": {
            "normal":    "cold menacing eyes, tense aggressive stance, intimidating presence",
            "surprised": "eyes going wide, backing up slightly, losing composure under pressure",
        },
    },

    "mei_popo": {
        "label": "梅婆婆 (lonely elderly woman)",
        "refs":  None,
        "base": (
            "elderly Asian woman, about 65 years old, permed short grey-white hair, "
            "floral patterned pajamas under an old wool cardigan, "
            "small and slightly hunched, warm and approachable face"
        ),
        "emotions": {
            "normal":    "gentle loneliness in eyes, soft tired smile, quiet contentment",
            "happy":     "eyes crinkling with delight, hands clasped together, grandmotherly warmth",
            "sad":       "wistful misty eyes, soft trembling lip, remembering something far away",
            "curious":   "head tilted, eyes sharp and narrowed, studying someone carefully with concern",
        },
    },

    "cry_guy": {
        "label": "哭包 (heartbroken guy)",
        "refs":  None,
        "base": (
            "young Asian man, mid 20s, messy tousled hair, red swollen eyes from crying, "
            "red nose, wrinkled casual t-shirt, hugging a large tub of ice cream to chest, "
            "sitting posture, clearly been crying for a while"
        ),
        "emotions": {
            "normal":    "actively crying, tears running, bottom lip wobbling, ice cream clutched tight",
            "surprised": "mid-cry hiccup, eyes wide and wet, ice cream almost dropped in shock",
        },
    },

    "isabel": {
        "label": "Isabel (mysterious regular)",
        "refs":  [
            "/Users/yin/Downloads/1770941341450216.png",
            "/Users/yin/Downloads/1770872953401759.png",
        ],
        "base": (
            "young woman, silver-grey wavy medium-length hair, olive skin, "
            "delicate earrings, black floral dress, "
            "nonchalant elegant posture, effortlessly composed appearance"
        ),
        "emotions": {
            "normal":    "calm slightly amused expression, one eyebrow faintly raised, collected poise",
            "curious":   "head tilted slightly, eyes sharp and interested, half-smile of intrigue",
        },
    },
}


# ── Workflows ─────────────────────────────────────────────────────────────────

def build_text_workflow(prompt, seed):
    """Pure text-to-image (no reference images)."""
    return {
        "1":  {"class_type": "UNETLoader",           "inputs": {"unet_name": "flux-2-klein-4b.safetensors", "weight_dtype": "default"}},
        "2":  {"class_type": "CLIPLoader",            "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "flux2"}},
        "3":  {"class_type": "VAELoader",             "inputs": {"vae_name": "flux2-vae.safetensors"}},
        "4":  {"class_type": "CLIPTextEncode",        "inputs": {"text": prompt, "clip": ["2", 0]}},
        "5":  {"class_type": "ConditioningZeroOut",   "inputs": {"conditioning": ["4", 0]}},
        "6":  {"class_type": "CFGGuider",             "inputs": {"model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0], "cfg": 1.0}},
        "7":  {"class_type": "RandomNoise",           "inputs": {"noise_seed": seed}},
        "8":  {"class_type": "EmptyFlux2LatentImage", "inputs": {"width": W, "height": H, "batch_size": 1}},
        "9":  {"class_type": "Flux2Scheduler",        "inputs": {"steps": 4, "width": W, "height": H}},
        "10": {"class_type": "KSamplerSelect",        "inputs": {"sampler_name": "euler"}},
        "11": {"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["7", 0], "guider": ["6", 0], "sampler": ["10", 0], "sigmas": ["9", 0], "latent_image": ["8", 0]}},
        "12": {"class_type": "VAEDecode",             "inputs": {"samples": ["11", 0], "vae": ["3", 0]}},
        "13": {"class_type": "SaveImage",             "inputs": {"images": ["12", 0], "filename_prefix": "customer"}},
    }


def build_ref_workflow(prompt, ref1_name, ref2_name, seed):
    """ReferenceLatent workflow (same as main characters)."""
    return {
        "1":  {"class_type": "UNETLoader",             "inputs": {"unet_name": "flux-2-klein-4b.safetensors", "weight_dtype": "default"}},
        "2":  {"class_type": "CLIPLoader",              "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "flux2"}},
        "3":  {"class_type": "VAELoader",               "inputs": {"vae_name": "flux2-vae.safetensors"}},
        "4":  {"class_type": "CLIPTextEncode",          "inputs": {"text": prompt, "clip": ["2", 0]}},
        "5":  {"class_type": "ConditioningZeroOut",     "inputs": {"conditioning": ["4", 0]}},
        "6":  {"class_type": "CFGGuider",               "inputs": {"model": ["1", 0], "positive": ["21", 0], "negative": ["5", 0], "cfg": 1.0}},
        "7":  {"class_type": "RandomNoise",             "inputs": {"noise_seed": seed}},
        "8":  {"class_type": "EmptyFlux2LatentImage",   "inputs": {"width": W, "height": H, "batch_size": 1}},
        "9":  {"class_type": "Flux2Scheduler",          "inputs": {"steps": 4, "width": W, "height": H}},
        "10": {"class_type": "KSamplerSelect",          "inputs": {"sampler_name": "euler"}},
        "11": {"class_type": "SamplerCustomAdvanced",   "inputs": {"noise": ["7", 0], "guider": ["6", 0], "sampler": ["10", 0], "sigmas": ["9", 0], "latent_image": ["8", 0]}},
        "12": {"class_type": "VAEDecode",               "inputs": {"samples": ["11", 0], "vae": ["3", 0]}},
        "13": {"class_type": "SaveImage",               "inputs": {"images": ["12", 0], "filename_prefix": "customer"}},
        "14": {"class_type": "LoadImage",               "inputs": {"image": ref1_name}},
        "15": {"class_type": "ImageScaleToTotalPixels", "inputs": {"image": ["14", 0], "upscale_method": "lanczos", "megapixels": 0.25, "resolution_steps": 1}},
        "16": {"class_type": "VAEEncode",               "inputs": {"pixels": ["15", 0], "vae": ["3", 0]}},
        "17": {"class_type": "ReferenceLatent",         "inputs": {"conditioning": ["4", 0], "latent": ["16", 0]}},
        "18": {"class_type": "LoadImage",               "inputs": {"image": ref2_name}},
        "19": {"class_type": "ImageScaleToTotalPixels", "inputs": {"image": ["18", 0], "upscale_method": "lanczos", "megapixels": 0.25, "resolution_steps": 1}},
        "20": {"class_type": "VAEEncode",               "inputs": {"pixels": ["19", 0], "vae": ["3", 0]}},
        "21": {"class_type": "ReferenceLatent",         "inputs": {"conditioning": ["17", 0], "latent": ["20", 0]}},
    }


# ── API helpers ───────────────────────────────────────────────────────────────

def api_post(path, data):
    body = json.dumps(data).encode()
    req  = urllib.request.Request(f"{BASE}{path}", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def api_get(path):
    with urllib.request.urlopen(f"{BASE}{path}", timeout=30) as r:
        return json.loads(r.read())


def upload_image(filepath):
    ext  = os.path.splitext(filepath)[1].lower()
    mime = "image/webp" if ext == ".webp" else "image/png"
    with open(filepath, "rb") as f:
        data = f.read()
    boundary = "----Boundary" + hex(random.randint(0, 0xFFFFFF))[2:]
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="{os.path.basename(filepath)}"\r\n'
        f"Content-Type: {mime}\r\n\r\n"
    ).encode() + data + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        f"{BASE}/upload/image", data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())["name"]


def wait_and_download(pid, out_path):
    start = time.time()
    while time.time() - start < 300:
        time.sleep(4)
        hist = api_get(f"/history/{pid}")
        if pid in hist:
            entry = hist[pid]
            if entry.get("status", {}).get("status_str") == "error":
                for m in entry["status"].get("messages", []):
                    if m[0] == "execution_error":
                        print(f"  Error: {m[1].get('exception_message')}")
                        return False
            if entry.get("outputs"):
                for node_out in entry["outputs"].values():
                    for img in node_out.get("images", []):
                        params = urllib.parse.urlencode({
                            "filename": img["filename"],
                            "subfolder": img.get("subfolder", ""),
                            "type": img.get("type", "output"),
                        })
                        urllib.request.urlretrieve(f"{BASE}/view?{params}", out_path)
                        elapsed = int(time.time() - start)
                        print(f"  Done in {elapsed}s → {os.path.basename(out_path)}")
                        return True
        print(f"  … {int(time.time()-start)}s", flush=True)
    print("  Timeout!")
    return False


# ── Main ─────────────────────────────────────────────────────────────────────

args = sys.argv[1:]
if len(args) >= 2:
    chars_to_gen   = [args[0]]
    emotions_to_gen = [args[1]]
elif len(args) == 1:
    chars_to_gen   = [args[0]]
    emotions_to_gen = None  # all emotions for this char
else:
    chars_to_gen   = list(CUSTOMERS.keys())
    emotions_to_gen = None

os.makedirs(OUT_DIR, exist_ok=True)

# Check ComfyUI
try:
    v = api_get("/system_stats").get("system", {}).get("comfyui_version", "?")
    print(f"ComfyUI v{v} ready\n")
except Exception as e:
    print(f"Cannot connect to ComfyUI: {e}")
    sys.exit(1)

for char_id in chars_to_gen:
    if char_id not in CUSTOMERS:
        print(f"Unknown character: {char_id}")
        continue

    char    = CUSTOMERS[char_id]
    emotions = emotions_to_gen or list(char["emotions"].keys())
    print(f"\n{'='*50}")
    print(f"{char_id}  ({char['label']})")
    print(f"{'='*50}")

    # Upload reference images if needed
    ref_servers = None
    if char["refs"]:
        ref_servers = []
        for ref_path in char["refs"]:
            if not os.path.exists(ref_path):
                print(f"  Missing reference: {ref_path}")
                sys.exit(1)
            print(f"  Uploading {os.path.basename(ref_path)}…", end=" ", flush=True)
            ref_servers.append(upload_image(ref_path))
            print(ref_servers[-1])

    for emotion in emotions:
        if emotion not in char["emotions"]:
            print(f"  Unknown emotion: {emotion}")
            continue
        out_path = os.path.join(OUT_DIR, f"{char_id}_{emotion}.png")
        if os.path.exists(out_path):
            print(f"  [{emotion}] already exists, skipping")
            continue

        prompt = STYLE_PREFIX + char["base"] + ", " + char["emotions"][emotion]
        seed   = random.randint(0, 2**31)
        print(f"  [{emotion}] seed={seed} …", end=" ", flush=True)

        if ref_servers:
            wf = build_ref_workflow(prompt, ref_servers[0], ref_servers[1], seed)
        else:
            wf = build_text_workflow(prompt, seed)

        resp = api_post("/prompt", {"prompt": wf})
        pid  = resp["prompt_id"]
        if not wait_and_download(pid, out_path):
            sys.exit(1)

print("\nAll done!")
print(f"Output: {OUT_DIR}")
print("\nNext step: run remove_bg.py to chroma-key all generated sprites.")
