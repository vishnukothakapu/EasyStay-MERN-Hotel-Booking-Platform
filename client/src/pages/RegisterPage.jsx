import { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { Mail, Lock, UserRound, Image } from "lucide-react";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext.jsx";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [block, setBlock] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setBlock(true);
    }
  }, [user]);

  async function registerUser(e) {
    e.preventDefault();

    // Validation for empty fields
    if (!name.trim()) {
      toast.error("Name is required!");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required!");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required!");
      return;
    }
    if (!profilePic) {
      toast.error("Profile picture is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);

    try {
      await axios.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User registered successfully. Please login!");
      setRedirect(true);
    } catch (e) {
      toast.error("Registration failed. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  if (block) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-around">
      <div className="flex flex-col m-auto">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <div className="flex items-center relative mb-3">
            <UserRound className="absolute left-2 w-5 h-5 stroke-gray-600" />
            <input
              type="text"
              placeholder="Full name"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center relative mb-3">
            <Mail className="absolute left-2 w-5 h-5 stroke-gray-600" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center relative mb-3">
            <Lock className="absolute left-2 w-5 h-5 stroke-gray-600" />
            <input
              type="password"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center relative mb-3">
            <Image className="absolute left-2 w-5 h-5 stroke-gray-600" />
            <input
              type="file"
              accept="image/*"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setProfilePic(e.target.files[0])}
              required
            />
          </div>
          <button className="primary mt-2 w-full py-2 bg-primary text-white rounded-md">
            Register
          </button>
          <div className="text-center py-2 mt-3">
            <span className="text-gray-500">Already have an account? </span>
            <Link
              className="font-medium cursor-pointer text-primary"
              to={"/login"}
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
