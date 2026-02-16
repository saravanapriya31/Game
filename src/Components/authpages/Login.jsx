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

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Manual login
  const handleManualLogin = async (values) => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://yeswanthm.pythonanywhere.com/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.email,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Login failed");
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      message.success("Login successful ✅");
      navigate("/video");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login
  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const response = await fetch(
        "https://yeswanthm.pythonanywhere.com/api/auth/google-login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_token: idToken }),
        }
      );

      const data = await response.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      message.success("Google login successful ✅");
      navigate("/video");
    } catch (error) {
      console.error("Login error:", error);
      message.error("Google login failed ❌");
    }
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
            Welcome Back 👋
          </Title>

          {/* ✅ Email Password Form */}
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

       
          <div style={{ textAlign: "center" }}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                message.error("Google login failed");
              }}
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