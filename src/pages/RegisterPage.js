import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = () => {
    const newUser = {
      id: Date.now(), // 以 timestamp 當作模擬 ID
      username: formData.username,
      email: formData.email,
      password: formData.password // 注意：正式環境應加密！
    };

    // 模擬傳送 JSON 給後端
    console.log("Send this JSON to backend:", JSON.stringify(newUser));

    // 未來這裡可改成 fetch:
    // fetch("/api/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(newUser)
    // });

    alert("註冊成功，回登入頁面！");
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button onClick={handleRegister}>註冊</button>
    </div>
  );
};

export default RegisterPage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function RegisterPage() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleRegister = () => {
//     alert('Registration successful!');
//     navigate('/');
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
//       <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleRegister}>Register</button>
//     </div>
//   );
// } 

// export default RegisterPage;
