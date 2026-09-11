import os
import requests

s = requests.Session()
base = 'http://127.0.0.1:5000'

portal_username = os.getenv('PORTAL_USERNAME', 'admin')
portal_password = os.getenv('PORTAL_PASSWORD', 'change-me')

# The master admin credentials are kept in the environment and backend database,
# not in any frontend-rendered page or static client file.
r = s.post(base + '/api/auth/login', json={'username': portal_username, 'password': portal_password})
print('login status', r.status_code)
try:
    print(r.json())
except Exception:
    print(r.text[:200])

r2 = s.get(base + '/portal/news-and-event')
print('\nGET /portal/news-and-event status', r2.status_code)
html = r2.text
start = html.find('<aside class="sidebar')
if start!=-1:
    snippet = html[start:start+800]
    print('\nSidebar snippet:\n', snippet)
else:
    print('Sidebar not found in HTML')
