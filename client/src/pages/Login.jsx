import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/dashboard");
    }, [navigate]);

    const handleChange = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", form);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (loginError) {
            setError(loginError.response?.data?.message || "Unable to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950">
            <div className="hidden md:flex w-1/2 items-center justify-center px-16 text-white">
                <div>
                    <h1 className="text-5xl font-bold mb-5">CamBridge</h1>
                    <p className="text-2xl text-blue-300 font-semibold">Smart Security.<br />Powered by Old Devices.</p>
                    <p className="text-slate-400 mt-6 text-lg">Transform unused smartphones into secure remote monitoring cameras.</p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-100 p-6">
                <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 mt-2 mb-6">Sign in to your CamBridge account</p>

                    {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-slate-500">
                        New user?
                        <button type="button" onClick={() => navigate("/register")} className="text-blue-600 ml-2 font-semibold">Create Account</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
