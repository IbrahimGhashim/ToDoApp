import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const navigate = useNavigate();

  function showMessage(text, type = "error") {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  async function handleLogin() {
    if (email.trim() === "") {
      showMessage("Email alanı boş bırakılamaz.");
      return;
    }

    if (password === "") {
      showMessage("Şifre alanı boş bırakılamaz.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showMessage(data.message, "success");

      console.log("Giriş yapan kullanıcı:", data.user);

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      console.error("Login bağlantı hatası:", error);

      showMessage(
        "Sunucuya bağlanılamadı. Backend çalışıyor mu?"
      );
    }
  }

  return (
    <div className="login-container">

      <Toast
        message={message}
        type={messageType}
      />

      <div className="login-card">

        <h1 className="logo">
          ✔ To Do App
        </h1>

        <h2>Tekrar Hoş Geldin!</h2>

        <p>Devam etmek için giriş yap.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Giriş Yap
        </button>

        <p className="register-link">
          Hesabın yok mu?{" "}
          <Link to="/register">
            Kayıt Ol
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;