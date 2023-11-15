"""Hello unit test module."""

from pythontest.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello pythontest"
