import re

with open("maps_search.html", "r", encoding="utf-8") as f:
    html = f.read()

print("Maps HTML length:", len(html))

# Let's search for keywords case-insensitively
keywords = ["Siddeswara", "Siddeshwara", "Mahadevpur", "Society", "Handloom", "Bhupalpally"]

for kw in keywords:
    matches = list(re.finditer(re.escape(kw), html, re.IGNORECASE))
    print(f"\nKeyword '{kw}' matches: {len(matches)}")
    for m in matches[:10]:
        start = max(0, m.start() - 100)
        end = min(len(html), m.end() + 100)
        snippet = html[start:end].replace('\n', ' ')
        print(f"  - ... {snippet} ...")

# Look for decimal numbers (coords) of any range
coords = re.findall(r'18\.\d{3,8}', html)
print("\nAny numbers matching 18.xxx:", list(set(coords))[:20])

coords2 = re.findall(r'79\.\d{3,8}', html)
print("Any numbers matching 79.xxx:", list(set(coords2))[:20])

# Look for google maps URLs in maps search
urls = re.findall(r'https?://[^\s"\'<>]*maps[^\s"\'<>]*', html)
print("\nAny maps URLS on page:", list(set(urls))[:10])
