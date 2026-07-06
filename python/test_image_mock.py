import os
import base64
import sys

def main():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("No API KEY")
        return
        
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=api_key)
    
    # Create a tiny 1x1 transparent PNG base64
    b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    
    parts = []
    parts.append("Describe this image.")
    parts.append(
        types.Part.from_bytes(
            data=base64.b64decode(b64),
            mime_type="image/png"
        )
    )
    
    try:
        res = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=parts
        )
        print("SUCCESS:", res.text)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    main()
