import re
from pathlib import Path


def test_doctor_assets_include_dr6_to_dr14_and_doctor_portfolio_mapping():
    app_code = (Path(__file__).resolve().parents[1] / 'src' / 'App.jsx').read_text(encoding='utf-8')

    assert "import doctor6Image from '../image/dr6.webp';" in app_code
    assert "import doctor7Image from '../image/dr7.webp';" in app_code
    assert "import doctor8Image from '../image/dr8.webp';" in app_code
    assert "import doctor9Image from '../image/dr9.webp';" in app_code
    assert "import doctor10Image from '../image/dr10.webp';" in app_code
    assert "import doctor11Image from '../image/dr11.webp';" in app_code
    assert "import doctor12Image from '../image/dr12.webp';" in app_code
    assert "import doctor13Image from '../image/dr13.webp';" in app_code
    assert "import doctor14Image from '../image/dr14.webp';" in app_code
    assert 'const doctorPortraits' in app_code
    assert 'const assignUniqueDoctorImages' in app_code
    assert "doctorPortraits[index] || doctor.image || ''" in app_code
    assert 'index % doctorPortraits.length' not in app_code


def test_doctors_are_limited_to_14_real_doctors_total():
    app_code = (Path(__file__).resolve().parents[1] / 'src' / 'App.jsx').read_text(encoding='utf-8')
    sections = re.findall(r"doctors: assignUniqueDoctorImages\(\[(.*?)\]\)", app_code, re.S)

    assert len(sections) == 2
    assert all(section.count('name:') == 14 for section in sections)
