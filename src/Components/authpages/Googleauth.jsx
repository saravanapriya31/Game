// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode"
// import Login from "./Login";

// export function GoogleAuth(){
//     return(
//         <>
//         <Login
//         onsuccess = {(creadentialResponse) => {
//             console.log(creadentialResponse)
//             console.log(jwtDecode(creadentialResponse.credential))

//         }}
//         onError={() => console.log("loginfailed")} />
//         </>
//     )
// }
import { GoogleLogin } from "@react-oauth/google";

function Login() {

  const handleSuccess = async (credentialResponse) => {
      const idToken = credentialResponse.credential;
      console.log(idToken)

    const response = await fetch("http://127.0.0.1:8000/api/google-login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await response.json();

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    window.location.href = "/home";
  };

  return (
    <div>
      <h2>Login</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

export default Login;
