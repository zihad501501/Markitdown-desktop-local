import os
from google import genai

def main():
    api_key = os.environ.get("OPENAI_API_KEY")
    client = genai.Client(api_key=api_key)
    print("Available Models:")
    try:
        for m in client.models.list():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    main()
