from DJBot.djbot import app as application
import pytest


@pytest.fixture
def app():
    return application
