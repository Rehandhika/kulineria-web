import re
import json

HTML_PATH = r"C:\Users\han\.gemini\antigravity\brain\1629a1e8-79ed-4d9e-8039-8aa3886a249d\.system_generated\steps\363\content.md"

def parse():
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        text = f.read()
    
    print("Fetched HTML length:", len(text))
    
    # Try to find JSON block containing "lighthouseResult" or similar
    # In WIZ_global_data or similar script tags
    print("Searching for Lighthouse scores...")
    
    # Lighthouse scores are typically represented as a fractional number between 0 and 1, e.g. "score":0.95
    # Let's extract all occurrences of "score": <number>
    score_matches = re.findall(r'"score"\s*:\s*([0-9\.]+)', text)
    print("All found scores:", [float(s) * 100 for s in score_matches][:30])

    # Let's search for "performance", "accessibility", "best-practices", "seo"
    # Often PageSpeed Insights embeds the raw json inside WIZ_global_data or a script tag
    # Let's see if we can find any category scores
    categories = re.findall(r'"categories"\s*:\s*\{([^}]+)\}', text)
    for cat in categories:
        print("Found Category Group:", cat[:300])

parse()
