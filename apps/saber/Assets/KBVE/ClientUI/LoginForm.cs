using KBVE.Events.Network;
using KBVE.Services;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace KBVE.ClientUI
{
  public class LoginForm : MonoBehaviour
  {
    public TMP_InputField emailField;
    public TMP_InputField passwordField;
    public Button loginButton;
    public TMP_Text statusMessage;

    private IUserDataService _userDataService;
    private IAuthenticationService _authService;

    private void OnEnable()
    {
      AuthenticationEvent.OnLoginSuccess += HandleLoginSuccess;
      AuthenticationEvent.OnLoginFailure += HandleLoginFailure;
    }

    private void OnDisable()
    {
      AuthenticationEvent.OnLoginSuccess -= HandleLoginSuccess;
      AuthenticationEvent.OnLoginFailure -= HandleLoginFailure;
    }

    private void HandleLoginSuccess(string token)
    {
      statusMessage.text = "Login successful!";
      Debug.Log($"Login Succeeded with Token: {token}");
      // Handle successful login (e.g., navigate to the next scene)

      statusMessage.text = "Configuring User Profile";

      // Construct UserData
      UserData userData = new UserData
      {
          Email = emailField.text
      };

      _userDataService.SetUserData(userData);

      _userDataService.SetToken(token);

      KBVE.Events.SceneEvent.RequestSingleSceneLoad("CharacterScene");
    }

    private void HandleLoginFailure(string error)
    {
      if (error == "invalid_password")
      {
        statusMessage.text = "Password failed!";
      }
      else
      {
        statusMessage.text = "Login failed. Please try again.";
      }
      Debug.Log($"Login Failed with Error: {error}");
      // Handle login failure (e.g., show error message to the user)
    }

    private void Start()
    {
      _authService = Services.Services.Instance.GetService<IAuthenticationService>();
      if (_authService == null)
      {
        Debug.LogError("Failed to retrieve AuthenticationService.");
        return;
      }

      _userDataService = Services.Services.Instance.GetService<IUserDataService>();
      if (_userDataService == null)
      {
        Debug.LogError("Failed to retrieve UserDataService.");
        return;
      }

      loginButton.onClick.AddListener(OnLoginClicked);
    }

    private void OnLoginClicked()
    {
      Debug.Log("Login button clicked.");
      if (_authService != null)
      {
        statusMessage.text = "Attempting to log in...";
        _authService.Login(emailField.text, passwordField.text);
      }
      else
      {
        Debug.LogError("Authentication service not found.");
      }
    }
  }
}
