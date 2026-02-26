import re

def extract_urls(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Regex for Drive links and standard image URLs
    drive_regex = r'https://drive\.google\.com/[^\s"\'\)]+'
    lh3_regex = r'https://lh3\.googleusercontent\.com/[^\s"\'\)]+'
    img_regex = r'https://[^\s"\'\)]+\.(?:png|jpg|jpeg|webp|svg)'
    
    drive_links = re.findall(drive_regex, content)
    lh3_links = re.findall(lh3_regex, content)
    img_links = re.findall(img_regex, content)
    
    print("Drive Links:")
    for link in set(drive_links):
        print(link)
        
    print("\nlh3 Links:")
    for link in set(lh3_links):
        print(link)
        
    print("\nImage Links:")
    for link in set(img_links):
        print(link)

extract_urls('fario_bundle.js')
