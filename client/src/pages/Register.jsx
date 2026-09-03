import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  async function handleRegister() {
    if (name.trim() === "") {
      showMessage("Kullanıcı adı boş bırakılamaz.");
      return;
    }

    if (email.trim() === "") {
      showMessage("Email alanı boş bırakılamaz.");
      return;
    }

    if (password === "") {
      showMessage("Şifre alanı boş bırakılamaz.");
      return;
    }

    if (confirmPassword === "") {
      showMessage("Şifre tekrarı boş bırakılamaz.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Şifreler aynı değil.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
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

      showMessage(data.message, "success");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Register bağlantı hatası:", error);

      showMessage(
        "Sunucuya bağlanılamadı. Backend çalışıyor mu?"
      );
    }
  }

  return (
    <div className="register-container">

      <Toast
        message={message}
        type={messageType}
      />

      <div className="register-card">

        <h1 className="logo">
          ✔ To Do App
        </h1>

        <h2>Hesap Oluştur</h2>

        <p>Devam etmek için hesabını oluştur.</p>

        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          type="password"
          placeholder="Şifre tekrar"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Kayıt Ol
        </button>

        <p className="login-link">
          Zaten hesabın var mı?{" "}
          <Link to="/login">
            Giriş Yap
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;