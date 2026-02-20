import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [timer, setTimer] = useState(0);

  //  countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ STEP 1 — REGISTER (SEND OTP)
  const handleRegister = async (values) => {
  try {
    setLoading(true);

    const email = values.email.toLowerCase();

    const response = await fetch(
      "https://yeswanthm.pythonanywhere.com/api/auth/register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // ⭐ IMPORTANT
          email: email,
          password: values.password,
        }),
      }
    );

    const data = await response.json();
    console.log("REGISTER RESPONSE:", data); // ⭐ DEBUG

    if (!response.ok) {
      throw new Error(
        data?.detail ||
        data?.message ||
        JSON.stringify(data) ||
        "Registration failed"
      );
    }

    setUserEmail(email);
    setStep(2);
    setTimer(30);

    message.success("Verification code sent to your email");
  } catch (error) {
    message.error(error.message || "Registration failed ");
  } finally {
    setLoading(false);
  }
};

  // ✅ STEP 2 — VERIFY OTP
  const handleVerifyOtp = async (values) => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://yeswanthm.pythonanywhere.com/api/auth/verify/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            otp: values.otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || data?.message || "Invalid OTP");
      }

      message.success("Email verified successfully 🎉");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESEND OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://yeswanthm.pythonanywhere.com/api/auth/resend_otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || data?.message || "Resend failed");
      }

      setTimer(30);
      message.success("OTP resent successfully 🔁");
    } catch (error) {
      message.error(error.message || "Resend failed ❌");
    } finally {
      setLoading(false);
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
            {step === 1 ? "Create Account" : "Verify Email"}
          </Title>

          {/* ✅ STEP 1 — REGISTER */}
          {step === 1 && (
            <Form layout="vertical" onFinish={handleRegister}>
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
                  { min: 6, message: "Minimum 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
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
                Sign Up
              </Button>
            </Form>
          )}

          {/* ✅ STEP 2 — OTP */}
          {step === 2 && (
            <Form layout="vertical" onFinish={handleVerifyOtp}>
              <Text type="secondary">
                Enter the OTP sent to <b>{userEmail}</b>
              </Text>

              <Form.Item
                label="OTP"
                name="otp"
                rules={[{ required: true, message: "Enter OTP" }]}
                style={{ marginTop: 20 }}
              >
                <Input.OTP length={6} size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Verify OTP
              </Button>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                {timer > 0 ? (
                  <Text type="secondary">Resend OTP in {timer}s</Text>
                ) : (
                  <Button type="link" onClick={handleResendOtp}>
                    Resend OTP
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default Signup;