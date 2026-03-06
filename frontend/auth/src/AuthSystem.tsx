import { useState } from "react";

export default function App() {
  const [view, setView] = useState("login"); // login | signup | home
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [_token, setToken] = useState(null);

  async function handleLogin(e:any) {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setToken(data.token);
      setView("home");
    } else {
      alert(data.message);
    }
  }

  async function handleSignup(e:any) {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setToken(data.token);
      setView("home");
    } else {
      alert(data.message);
    }
  }

  function handleLogout() {
    setToken(null);
    setEmail("");
    setPassword("");
    setName("");
    setView("login");
  }

  // ---------------- UI ----------------

  if (view === "home") {
    return (
      <div style={{ padding: 40 }}>
        <h1>Welcome, Programmer 👋</h1>
        <p>You are logged in.</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>{view === "login" ? "Login" : "Signup"}</h1>

      <form onSubmit={view === "login" ? handleLogin : handleSignup}>
        {view === "signup" && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", marginBottom: 10, width: "100%" }}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <button type="submit">
          {view === "login" ? "Login" : "Signup"}
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        {view === "login" ? (
          <p>
            No account?{" "}
            <button onClick={() => setView("signup")}>Go to Signup</button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setView("login")}>Go to Login</button>
          </p>
        )}
      </div>
    </div>
  );
}
