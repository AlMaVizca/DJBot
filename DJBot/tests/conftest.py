from DJBot.factory import create_app
import pytest


@pytest.fixture
def app():
    application = create_app(config='DJBot.config.Testing',
                             instance=False)
    return application
