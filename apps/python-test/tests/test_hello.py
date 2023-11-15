"""Hello unit test module."""

from python_test.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello python-test"
