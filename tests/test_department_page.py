import pathlib


def test_department_sections_are_present_and_styled_as_full_width_panels():
    styles = pathlib.Path(__file__).resolve().parents[1] / 'src' / 'styles.css'
    component = pathlib.Path(__file__).resolve().parents[1] / 'src' / 'components' / 'DepartmentPage.jsx'

    css_text = styles.read_text(encoding='utf-8')
    component_text = component.read_text(encoding='utf-8')

    assert '.department-section {' in css_text
    assert 'border-radius: 32px' in css_text
    assert 'box-shadow: 0 30px 70px rgba(21, 30, 90, 0.08);' in css_text
    assert "departmentData.map((department, index)" in component_text
    assert 'selectedDepartmentSlug' in component_text
    assert 'window.scrollTo' in component_text
    assert "title: 'Emergency Department'" in component_text
    assert "number: '01'" in component_text
    assert 'See more' in component_text
    assert "action: 'see-more'" in component_text
    assert "label: 'See more doctors'" in component_text
