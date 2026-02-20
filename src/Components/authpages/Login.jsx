
import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Divider,
  message,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const cookies = new Cookies();

 
  const handleLoginSuccess = (accessToken, refreshToken) => {
    const decoded = jwtDecode(accessToken);
    setUser(decoded);

    // store in cookie
    cookies.set("jwt_authentication", accessToken, {
      path: "/",
      expires: new Date(decoded.exp * 1000),
    });

    // optional: store refresh
    localStorage.setItem("refresh", refreshToken);

    message.success("Login successful ");
    navigate("/video");
  };

  //  Manual login
  const handleManualLogin = async (values) => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://yeswanthm.pythonanywhere.com/api/auth/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.email.toLowerCase(),
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Login failed");
      }

      handleLoginSuccess(data.access, data.refresh);
    } catch (error) {
      console.error(error);
      message.error(error.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const response = await fetch(
        "https://yeswanthm.pythonanywhere.com/api/auth/google-login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Google login failed");
      }

      handleLoginSuccess(data.access, data.refresh);
    } catch (error) {
      console.error(error);
      message.error("Google login failed ❌");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    googleLogout();
    setUser(null);
    cookies.remove("jwt_authentication", { path: "/" });
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#f5f7fb" }}
    >
      <Col xs={22} sm={16} md={10} lg={8}>
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Title level={3} style={{ textAlign: "center" }}>
            Welcome Back 
          </Title>

          {/*  Email Login */}
          <Form layout="vertical" onFinish={handleManualLogin}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form>

          <Divider>OR</Divider>

          {/*  Google Login */}
          <div style={{ textAlign: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => message.error("Google login failed")}
            />
          </div>

          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", marginTop: 20 }}
          >
            Don't have an account? Sign up
          </Text>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;

// import React, { useState } from "react";
// import { GoogleLogin, googleLogout } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   Typography,
//   Row,
//   Col,
//   Form,
//   Input,
//   Button,
//   Divider,
//   message,
// } from "antd";
// import { MailOutlined, LockOutlined } from "@ant-design/icons";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "universal-cookie";
// import { saveAccessToken, clearTokens } from "../../utils/authService";
// const { Title, Text } = Typography;

// function Login() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);

//   const cookies = new Cookies();


//   const handleLoginSuccess = (accessToken, refreshToken) => {
//     const decoded = jwtDecode(accessToken);
//     setUser(decoded);

  
//     saveAccessToken(accessToken);

//     localStorage.setItem("refresh", refreshToken);

//     message.success("Login successful ");
//     navigate("/video");
//   };


//   const handleManualLogin = async (values) => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         "https://yeswanthm.pythonanywhere.com/api/auth/login/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username: values.email.toLowerCase(),
//             password: values.password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data?.detail || "Login failed");
//       }

//       handleLoginSuccess(data.access, data.refresh);
//     } catch (error) {
//       console.error(error);
//       message.error(error.message || "Login failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const idToken = credentialResponse.credential;

//       const response = await fetch(
//         "https://yeswanthm.pythonanywhere.com/api/auth/google-login/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ id_token: idToken }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error("Google login failed");
//       }

//       handleLoginSuccess(data.access, data.refresh);
//     } catch (error) {
//       console.error(error);
//       message.error("Google login failed ❌");
//     }
//   };


//   const handleLogout = () => {
//     googleLogout();
//     setUser(null);
//     clearTokens();
//     navigate("/");
//   };

//   return (
//     <Row
//       justify="center"
//       align="middle"
//       style={{ minHeight: "100vh", background: "#f5f7fb" }}
//     >
//       <Col xs={22} sm={16} md={10} lg={8}>
//         <Card
//           style={{
//             borderRadius: 16,
//             boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//           }}
//         >
//           <Title level={3} style={{ textAlign: "center" }}>
//             Welcome Back
//           </Title>

//           {/* Email Login */}
//           <Form layout="vertical" onFinish={handleManualLogin}>
//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 { required: true, message: "Please enter email" },
//                 { type: "email", message: "Enter valid email" },
//               ]}
//             >
//               <Input
//                 prefix={<MailOutlined />}
//                 placeholder="Enter your email"
//                 size="large"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Password"
//               name="password"
//               rules={[{ required: true, message: "Please enter password" }]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined />}
//                 placeholder="Enter your password"
//                 size="large"
//               />
//             </Form.Item>

//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               size="large"
//               loading={loading}
//             >
//               Login
//             </Button>
//           </Form>

//           <Divider>OR</Divider>

      
//           <div style={{ textAlign: "center" }}>
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={() => message.error("Google login failed")}
//             />
//           </div>

//           <Text
//             type="secondary"
//             style={{ display: "block", textAlign: "center", marginTop: 20 }}
//           >
//             Don't have an account? Sign up
//           </Text>
//         </Card>
//       </Col>
//     </Row>
//   );
// }

// export default Login;