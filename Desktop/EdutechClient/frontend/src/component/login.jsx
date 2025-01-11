import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault(); // Prevent form submission

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password
      });

      if (response) {
        const token=response.data.token;
        console.log(token);
        localStorage.setItem("token","Bearer "+token);
        navigate('/Welcome');
      }
      else{
        alert('no user exists');
      }
    } catch (error) {
      alert("Error while logging in..Please try later");
    }
  }

  return (
    <>
      <main>
        <div className="main_page">
          <div>
          <h1>Login </h1>
          </div>
          <div className="login_page">
            <div className="image">
              <img
                id="login_image"
                src="https://img.freepik.com/free-photo/computer-security-with-login-password-padlock_107791-16191.jpg?size=626&ext=jpg"
                alt="Login"
              />
            </div>
            <div className="forms">
              <form onSubmit={loginUser}>
                <input
                  type="email"
                  placeholder="Enter registered email ID"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
                <br />
                <br />
                <input
                  id="pass"
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <br />
                <br />
                <button id="login_btn" type="submit">
                  Login
                </button>
                <br />
                <br />
              </form>
              <div className="change_route">
                <p>New user?</p>
                <p className="path" onClick={() => navigate('/Signup')}>
                  Create Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
