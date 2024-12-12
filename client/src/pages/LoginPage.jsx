import axios from "axios";
import { useContext, useState ,useEffect} from "react";
import { Link, Navigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from 'react-toastify';
import { UserContext } from "../UserContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user,setUser } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      setRedirect(true);
    }
  }, [user]);
  async function handleLoginUser(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      toast.success("Login success");
      setRedirect(true);
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex grow mt-3 items-center justify-around">
      <div className="flex flex-col m-auto">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginUser}>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <div className="flex items-center relative ">
            <Mail className="absolute w-5 h-5 left-2 stroke-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center relative ">
            <Lock className="absolute w-5 h-5 left-2 stroke-gray-500" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="primary mt-2 text-xl w-full py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center py-2 mt-2">
            <span className="text-gray-500">Don't have an account? </span>
            <Link
              className="font-medium cursor-pointer text-primary"
              to="/register"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
