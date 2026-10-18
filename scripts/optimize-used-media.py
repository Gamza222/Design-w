"""Create responsive copies of frames referenced by site source/content only.
Requires Pillow for dimensions and cwebp. Never scans source-assets.
"""
import json
import re
import subprocess
from pathlib import Path
from PIL import Image

refs = set()
for directory in ('src', 'content'):
    for file in Path(directory).rglob('*'):
        if file.suffix in ('.ts', '.tsx', '.json', '.scss', '.mdx') and file.name != 'responsiveImages.ts':
            refs.update(re.findall(r'/realimages/web/[\w.-]+\.(?:webp|jpg|png)', file.read_text()))
manifest = {}
for ref in sorted(refs):
    source = Path('public' + ref)
    if not source.exists():
        continue
    width, height = Image.open(source).size
    variants = []
    for target_width in (480, 960, 1440):
        if target_width >= width:
            continue
        name = source.stem + '-' + str(target_width) + '.webp'
        target = source.with_name(name)
        subprocess.run(['cwebp', '-quiet', '-q', '86', '-m', '6', '-resize', str(target_width), '0', str(source), '-o', str(target)], check=True)
        if target.stat().st_size < source.stat().st_size:
            variants.append(f'/realimages/web/{name} {target_width}w')
        else:
            target.unlink()
    variants.append(f'{ref} {width}w')
    manifest[ref] = {'width': width, 'height': height, 'srcSet': ', '.join(variants)}
output = Path('src/shared/ui/Image/responsiveImages.ts')
output.write_text('// Generated from frames already used by the site. See scripts/optimize-used-media.py.\nexport const responsiveImages: Record<string, { width: number; height: number; srcSet: string }> = ' + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n')
print(f'Generated responsive variants for {len(manifest)} existing frames.')
