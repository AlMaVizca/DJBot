# -*- coding: utf-8 -*-

"""DJBot."""

from setuptools import find_packages, setup

readme = 'DJBot is a frontend for develop and run ansible playbooks'
# open('README.rst').read()

install_requires = [
    "ansible==2.3.1.0",
    "Flask-Security",
    "Flask-WTF",
    "Flask-SQLAlchemy",
    "Flask",
    "gunicorn",
    "ipaddress",
    'pycrypto>=2.6.1',
    "PyYAML",
    "ssh-authorizer",
    "bcrypt",
]

setup_requires = [
    'pytest-runner>=2.6.2',
]

tests_require = [
    'Flask-CLI>=0.4.0',
    'bcrypt>=1.0.2',
    'check-manifest>=0.25',
    'coverage>=4.0',
    'isort>=4.2.2',
    'mock>=1.3.0',
    'pony>=0.7.1',
    'pydocstyle>=1.0.0',
    'pytest-cache>=1.0',
    'pytest-cov>=2.4.0',
    'pytest-flakes>=1.0.1',
    'pytest-flask>=0.10.0',
    'pytest-pep8>=1.0.6',
    'pytest>=3.0.5',
    'Flask-SQLAlchemy>=2.2',
]

setup(
    name='DJBot',
    version='2',
    description=__doc__,
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    long_description=readme,
    keywords='ansible frontend',
    license='GPLv3',
    author='Aldo María Vizcaino',
    author_email='aldo.vizcaino87@gmail.com',
    setup_requires=setup_requires,
    tests_require=tests_require,
    install_requires=install_requires,
)
