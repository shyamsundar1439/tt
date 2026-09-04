import os
import json
import base64
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List

logger = logging.getLogger("push_service")

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VAPID_KEY_FILE = os.path.join(BASE_DIR, "vapid_private.pem")
VAPID_META_FILE = os.path.join(BASE_DIR, "vapid_meta.json")

def ensure_vapid_keys() -> Dict[str, str]:
    """
    Ensures VAPID private and public keys are present.
    Loads from environment variables if present (VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY),
    or loads from local file 'vapid_private.pem', or generates a fresh persistent pair.
    Returns dict with 'public_key' (URL-safe base64 unpadded) and 'private_pem'.
    """
    # 1. Check environment variables
    env_pub = os.environ.get("VAPID_PUBLIC_KEY")
    env_priv = os.environ.get("VAPID_PRIVATE_KEY")
    if env_pub and env_priv:
        return {"public_key": env_pub.strip(), "private_pem": env_priv.strip()}

    # 2. Check existing local key file and meta
    if os.path.exists(VAPID_KEY_FILE) and os.path.exists(VAPID_META_FILE):
        try:
            with open(VAPID_META_FILE, "r", encoding="utf-8") as f:
                meta = json.load(f)
            with open(VAPID_KEY_FILE, "r", encoding="utf-8") as f:
                priv_pem = f.read()
            if meta.get("public_key") and priv_pem:
                return {"public_key": meta["public_key"], "private_pem": priv_pem, "key_file": VAPID_KEY_FILE}
        except Exception as e:
            logger.warning(f"Could not read existing VAPID files, regenerating: {e}")

    # 3. Generate new VAPID keys using py_vapid and cryptography
    try:
        from py_vapid import Vapid
        from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

        vapid = Vapid()
        vapid.generate_keys()

        raw_bytes = vapid.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
        b64_pub = base64.urlsafe_b64encode(raw_bytes).rstrip(b"=").decode("utf-8")
        priv_pem_bytes = vapid.private_pem()
        priv_pem_str = priv_pem_bytes.decode("utf-8")

        with open(VAPID_KEY_FILE, "wb") as f:
            f.write(priv_pem_bytes)
        try:
            os.chmod(VAPID_KEY_FILE, 0o600)
        except Exception:
            pass

        with open(VAPID_META_FILE, "w", encoding="utf-8") as f:
            json.dump({"public_key": b64_pub, "created_at": datetime.now().isoformat()}, f)

        return {"public_key": b64_pub, "private_pem": priv_pem_str, "key_file": VAPID_KEY_FILE}
    except Exception as e:
        logger.error(f"Failed to generate VAPID keys: {e}")
        return {"public_key": "", "private_pem": "", "key_file": ""}

def get_vapid_public_key() -> str:
    """Returns the base64 URL-safe VAPID public key for the browser."""
    keys = ensure_vapid_keys()
    return keys.get("public_key", "")

def send_web_push(subscription_info: Dict[str, Any], payload: Dict[str, Any], claims_email: str = "mailto:study@cglcompanion.internal") -> bool:
    """
    Sends a Web Push message to a client subscription using pywebpush.
    Returns True on success, raises exception on failure.
    """
    keys = ensure_vapid_keys()
    key_file = keys.get("key_file")
    priv_pem = keys.get("private_pem")

    if not key_file and not priv_pem:
        raise ValueError("No VAPID key available for Web Push")

    from pywebpush import webpush

    key_target = key_file if (key_file and os.path.exists(key_file)) else priv_pem

    webpush(
        subscription_info=subscription_info,
        data=json.dumps(payload),
        vapid_private_key=key_target,
        vapid_claims={"sub": claims_email},
        ttl=86400  # 24 hour TTL
    )
    return True
