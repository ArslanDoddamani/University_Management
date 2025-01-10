import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
        if (cpass !== password) {
      alert("Password and Confirm Password doesn't match");
    } else {
      async function CreateUser() {
        try {
          const response = await axios.post('http://localhost:3000/signup', {
            email: username,
            contact,
            password
          });
            if (response.status === 200) {
              const token=response.data.token;
              console.log("token received in frontend is ");
              console.log(token);
              localStorage.setItem("token","Bearer "+token);
            alert('Congratulations, Your account created Successfully');
            navigate('/Welcome');
          } else {
            alert('Error while creating user');
          }
        } catch (error) {
          alert("Error while Creating account.Please try later");
        }
      }
      CreateUser();
    }
  }

  return (
    <main>
      <div className="main_page">
      <h1>Sign Up </h1>
        <div className="login_page">
          <div>
            <img
              id="login_image"
              src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?size=626&ext=jpg&ga=GA1.1.2090071369.1707797469&semt=ais"
            />
          </div>
          <div className="forms">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your Mobile number"
                onChange={(e) => {
                  setContact(e.target.value);
                }}
                required
              />
              <br />
              <br />
              <input
                type="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
              <br />
              <br />
              <input
                id="signpass"
                type="password"
                placeholder="Enter Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
              <br />
              <br />
              <input
                id="cpass"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => {
                  setCpass(e.target.value);
                }}
                required
              />
              <br />
              <br />
              <button id="signup_btn" type="submit">
                Signup
              </button>
              <br />
              <br />
            </form>
            <div className="change_route">
            <p>
              Already a user?
            </p>
            <p className="path" onClick={()=>navigate('/')}>
              Login
            </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}