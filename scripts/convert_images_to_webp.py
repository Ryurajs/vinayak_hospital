import re
import sqlite3
from pathlib import Path

from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / 'image'
RASTER_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff'}
TEXT_EXTENSIONS = {'.css', '.html', '.js', '.jsx', '.json', '.py', '.txt', '.md'}


def convert_image(source):
    target = source.with_suffix('.webp')
    if target.exists():
        source.unlink()
        return target

    temporary = target.with_suffix('.webp.tmp')
    try:
        with Image.open(source) as original:
            image = original.convert('RGBA' if 'A' in original.getbands() else 'RGB')
            image.save(temporary, 'WEBP', quality=82, method=6)
        temporary.replace(target)
        source.unlink()
        return target
    except (UnidentifiedImageError, OSError, ValueError):
        if temporary.exists():
            temporary.unlink()
        return None


def collect_conversions():
    conversions = {}
    for source in IMAGE_ROOT.rglob('*'):
        if source.is_file() and source.suffix.lower() in RASTER_EXTENSIONS:
            target = convert_image(source)
            if target:
                conversions[source.relative_to(ROOT).as_posix()] = target.relative_to(ROOT).as_posix()
    return conversions


def update_text_references(conversions):
    for path in ROOT.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if 'node_modules' in path.parts or '.git' in path.parts or path == Path(__file__):
            continue
        try:
            content = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        updated = content
        for source, target in conversions.items():
            source_name = Path(source).name
            target_name = Path(target).name
            updated = updated.replace(source, target)
            updated = updated.replace('/' + source, '/' + target)
            updated = re.sub(rf'(?<![A-Za-z0-9_.-]){re.escape(source_name)}(?=[\"\'`),;}}\s])', target_name, updated)
        if updated != content:
            path.write_text(updated, encoding='utf-8')


def update_database(conversions):
    database = ROOT / 'database' / 'hospital.db'
    if not database.exists():
        return
    connection = sqlite3.connect(database)
    for table, column in (
        ('board_members', 'image'),
        ('doctors', 'image_url'),
        ('news_events', 'image_url'),
        ('site_notes', 'image_url'),
    ):
        try:
            rows = connection.execute(f'SELECT rowid, {column} FROM {table}').fetchall()
        except sqlite3.OperationalError:
            continue
        for rowid, value in rows:
            if not value:
                continue
            updated = value
            for source, target in conversions.items():
                updated = updated.replace('/' + source, '/' + target)
            if updated != value:
                connection.execute(f'UPDATE {table} SET {column} = ? WHERE rowid = ?', (updated, rowid))
    connection.commit()
    connection.close()


def main():
    conversions = collect_conversions()
    update_text_references(conversions)
    update_database(conversions)
    print(f'Converted or deduplicated {len(conversions)} raster image files.')


if __name__ == '__main__':
    main()
