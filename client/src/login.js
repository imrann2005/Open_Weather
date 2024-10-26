import { GoogleLogin } from 'react-google-login';
import Portal from './portal';

const GOOGLE_OAUTH_CLIENT_ID = "925306536966-8krnsg2kdor08se5s6d47vla1pec5f2f.apps.googleusercontent.com";

const Login = () => {

  const handleLoginSuccess = (response) => {
    console.log("Login Successful! User: ", response.profileObj);
    localStorage.setItem("userId", response.profileObj.googleId);
    localStorage.setItem("userName", response.profileObj.name);

    // Redirect and reload after login
    window.location.href = "http://localhost:3000/data";
    //window.location.reload();
  };

  const handleLoginFailure = (response) => {
    alert("Login failed! Please try again.");
  };

  return (
    <section className="text-center login-section">
      <nav className="navbar bg-dark border-bottom border-body p-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 text-white">
            <h2>Open Weather</h2>
          </span>
        </div>
      </nav>

      <div className="container p-5 mb-5">
        <div className="row p-5">
          <div className="col-lg-6 p-5 mt-5">
            <div>
              <p className="title"><strong>Weather</strong></p>
              <p className="subtitle">
                <strong>Weather is the art of nature, painting the sky with its ever-changing moods.</strong>
              </p>
            </div>
          </div>
          <div className="col-lg-4 mt-5">
            <div className="p-4 login-box mt-4">
              <h2 className="text-center">Login with Google</h2>
              <hr />
              <div className="mb-3 pt-4">
                <div id="signInButton">
                  <GoogleLogin
                    clientId={GOOGLE_OAUTH_CLIENT_ID}
                    buttonText="Sign in with Google"
                    onSuccess={handleLoginSuccess}
                    onFailure={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Login;
