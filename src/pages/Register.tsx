import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleOnClick = async () => {
    if (password === confirmPassword) {
      const resp = await fetch(`http://localhost:3000/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }).then((res) => {
        return res.json();
      });

      if (resp && resp.status === 201) {
        toast(resp.message);
        navigate('/login');
      } else {
        toast(Array.isArray(resp.message) ? resp.message[0] : resp.message);
      }
    } else {
      toast("password and confirm password doesn't match")
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen gap-y-4">
        <h1 className="text-5xl text-pink-400 text-center font-semibold">
          Register
        </h1>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-mdfont-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
            placeholder="Email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-mdfont-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
            placeholder="Password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-mdfont-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
            placeholder="Password"
            required
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <button
          className="bg-pink-500 px-8 py-2 rounded-xl text-white"
          onClick={() => handleOnClick()}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Register;
