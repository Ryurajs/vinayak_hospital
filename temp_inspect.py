from pathlib import Path
p = Path('errors.txt')
data = p.read_bytes()
print(data[:200])
print('utf16?', data.startswith(b'\xff\xfe'))
print(data.decode('utf-16'))
