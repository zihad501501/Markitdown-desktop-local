import sys
import os
import requests

class Choice:
    class Message:
        def __init__(self, text):
            self.content = text
    def __init__(self, text):
        self.message = self.Message(text)

class MockResponse:
    def __init__(self, text):
        self.choices = [Choice(text)]

class GeminiNativeMock:
    def __init__(self, api_key, model_name):
        from google import genai
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name

    @property
    def chat(self): return self

    @property
    def completions(self): return self

    def create(self, model, messages):
        from google.genai import types
        import base64
        
        parts = []
        for msg in messages:
            content_list = msg.get("content", [])
            if isinstance(content_list, str):
                parts.append(content_list)
            else:
                for item in content_list:
                    if item["type"] == "text":
                        text = item["text"]
                        # Force MarkItDown's default image prompt to perform aggressive OCR
                        text += "\nCRITICAL INSTRUCTION: You must act as an expert OCR engine. Extract and transcribe ALL text visible in this image perfectly, preserving formatting, tables, and lists. Do not miss a single detail."
                        
                        custom_prompt = os.environ.get("CUSTOM_PROMPT")
                        if custom_prompt:
                            text += f"\n\nUSER CUSTOM INSTRUCTIONS:\n{custom_prompt}\n"
                            
                        parts.append(text)
                    elif item["type"] == "image_url":
                        data_uri = item["image_url"]["url"]
                        header, b64 = data_uri.split(",", 1)
                        mime_type = header.split(";")[0].split(":")[1]
                        parts.append(
                            types.Part.from_bytes(
                                data=base64.b64decode(b64),
                                mime_type=mime_type
                            )
                        )
            
        res = self.client.models.generate_content(
            model=self.model_name,
            contents=parts
        )
        return MockResponse(res.text)

def main():
    if len(sys.argv) < 2:
        print("Error: No file path provided.", file=sys.stderr)
        sys.exit(1)

    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(f"Error: File does not exist at path: {file_path}", file=sys.stderr)
        sys.exit(1)
        
    if not os.path.isfile(file_path):
        print(f"Error: The path provided is not a regular file: {file_path}", file=sys.stderr)
        sys.exit(1)
        
    # Ensure stdout uses UTF-8 to prevent encoding errors on Windows
    sys.stdout.reconfigure(encoding='utf-8')
    
    try:
        api_key = os.environ.get("OPENAI_API_KEY")
        ext = os.path.splitext(file_path)[1].lower()
        
        if api_key:
            if not api_key.startswith("sk-"):
                from google import genai
                client = genai.Client(api_key=api_key)
                
                preferred_tier = os.environ.get("PREFERRED_MODEL", "flash").lower()
                model_name = f"gemini-2.5-{preferred_tier}"
                
                try:
                    models = [m.name for m in client.models.list()]
                    valid_models = [m for m in models if preferred_tier in m.lower() and m.startswith('models/gemini-') and m[14].isdigit() and 'vision' not in m.lower() and 'omni' not in m.lower()]
                    if not valid_models:
                        valid_models = [m for m in models if preferred_tier in m.lower() and m.startswith('gemini-') and m[7].isdigit() and 'vision' not in m.lower() and 'omni' not in m.lower()]
                    if valid_models:
                        valid_models.sort(reverse=True)
                        model_name = valid_models[0]
                except BaseException:
                    pass

                try:
                    # Attempt Native Gemini Multimodal Upload first (Best for PDFs, Images, Media, Text)
                    myfile = client.files.upload(file=file_path)
                    try:
                        prompt = "Convert this entire document/file to Markdown. Preserve all text, tables, and formatting exactly as they appear. If this is an audio or video file, provide a full transcript and describe key visual events. Whenever you encounter an image, photograph, chart, or diagram, act as an expert OCR engine: perfectly extract and transcribe ALL text visible within the image, and write a highly detailed description of any visual elements, using the markdown format: ![Extracted text and description of image](image). Do not miss any information. Output ONLY the markdown text without any conversational filler."
                        
                        custom_prompt = os.environ.get("CUSTOM_PROMPT")
                        if custom_prompt:
                            prompt += f"\n\nUSER CUSTOM INSTRUCTIONS:\n{custom_prompt}\n"

                        response = client.models.generate_content(
                            model=model_name,
                            contents=[myfile, prompt]
                        )
                        print(response.text or "")
                        return
                    finally:
                        try:
                            client.files.delete(name=myfile.name)
                        except:
                            pass
                except BaseException as e:
                    # If Native Gemini rejects the MIME type (e.g. Office docs .docx, .pptx)
                    # Automatically fallback to MarkItDown + GeminiNativeMock for image extraction
                    try:
                        from markitdown import MarkItDown
                        mock_client = GeminiNativeMock(api_key=api_key, model_name=model_name)
                        md = MarkItDown(llm_client=mock_client, llm_model=model_name)
                        result = md.convert(file_path)
                        print(result.text_content or "")
                    except BaseException as fallback_err:
                        err_str = str(fallback_err).split('While converting')[0].strip()
                        print(f"Extraction failed: {err_str}", file=sys.stderr)
                        sys.exit(1)
                    return
            else:
                # Fallback to MarkItDown if using OpenAI key (sk-...)
                try:
                    from openai import OpenAI
                    from markitdown import MarkItDown
                    client = OpenAI(api_key=api_key)
                    md = MarkItDown(llm_client=client, llm_model="gpt-4o")
                    
                    result = md.convert(file_path)
                    print(result.text_content or "")
                except BaseException as openai_err:
                    err_str = str(openai_err).split('While converting')[0].strip()
                    print(f"Extraction failed: {err_str}", file=sys.stderr)
                    sys.exit(1)
                return
        else:
            from markitdown import MarkItDown
            md = MarkItDown()

            # If it's an image and there's no API key, output a helpful error
            if ext in ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']:
                print("Error: Image conversion requires an API key (OpenAI or Gemini). Please provide one.", file=sys.stderr)
                sys.exit(1)

            try:
                result = md.convert(file_path)
                print(result.text_content or "")
            except SystemExit:
                raise
            except BaseException as e:
                err_msg = str(e).split('Traceback')[0].strip()
                print(f"Extraction failed: {err_msg}", file=sys.stderr)
                sys.exit(1)
            return

    except SystemExit:
        raise
    except BaseException as e:
        err_msg = str(e).split('Traceback')[0].strip()
        print(f"Error converting file: {err_msg}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
