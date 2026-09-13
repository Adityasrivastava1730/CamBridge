import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Login() {

    const navigate = useNavigate();


    const [form, setForm] = useState({
        email:"",
        password:""
    });



    useEffect(()=>{

        const token = localStorage.getItem("token");

        if(token){
            navigate("/dashboard");
        }

    },[navigate]);


    const handleChange = (e)=>{

        setForm({
            ...form,
            [e.target.name]:e.target.value
        });

    };


    const handleSubmit = async(e)=>{

        e.preventDefault();

        try{

            const response = await api.post("/auth/login", form);

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");

        }catch(error){

            console.log(error.response?.data || error.message);
            alert(error.response?.data?.message || "Invalid Email or Password");

        }

    };



    return (

        <div className="min-h-screen flex bg-slate-950">


            {/* LEFT BRAND SECTION */}

            <div className="hidden md:flex w-1/2 relative overflow-hidden items-center justify-center">


                {/* Background Glow */}

                <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-30">
                </div>



                <div className="absolute w-125 h-125 border border-blue-500/20 rounded-full animate-pulse">
                </div>



                <div className="relative z-10 px-16">


                    <h1 className="text-5xl font-bold text-white mb-5">

                        🚀 CamBridge

                    </h1>


                    <p className="text-2xl text-blue-300 font-semibold">

                        Smart Security.
                        <br/>
                        Powered by Old Devices.

                    </p>


                    <p className="text-slate-400 mt-6 text-lg">

                        Transform your unused smartphones into
                        secure remote monitoring cameras.

                    </p>


                </div>


            </div>





            {/* RIGHT LOGIN SECTION */}


            <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-100">


                <div className="bg-white w-96 p-8 rounded-2xl shadow-2xl">


                    <h2 className="text-3xl font-bold text-slate-900">

                        Welcome Back

                    </h2>


                    <p className="text-slate-500 mt-2 mb-6">

                        Sign in to your CamBridge account

                    </p>




                    {/* Google / SSO buttons */}

                    <button

                    className="w-full border border-slate-300 py-3 rounded-xl mb-3 hover:bg-slate-50 transition"

                    >

                        🔵 Continue with Google

                    </button>



                    <button

                    className="w-full bg-slate-900 text-white py-3 rounded-xl mb-6 hover:bg-slate-800 transition"

                    >

                        🔐 Sign in with SSO

                    </button>




                    <div className="flex items-center gap-3 mb-6">

                        <div className="h-px bg-slate-200 flex-1"></div>

                        <span className="text-slate-400 text-sm">
                            OR
                        </span>

                        <div className="h-px bg-slate-200 flex-1"></div>

                    </div>




                    <form onSubmit={handleSubmit}>


                        <input

                        type="email"

                        name="email"

                        placeholder="Email address"

                        value={form.email}

                        onChange={handleChange}

                        className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />



                        <input

                        type="password"

                        name="password"

                        placeholder="Password"

                        value={form.password}

                        onChange={handleChange}

                        className="w-full mb-6 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />



                        <button

                        type="submit"

                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transition"

                        >

                            Sign In

                        </button>



                    </form>




                    <p className="text-center mt-6 text-slate-500">


                        New user?


                        <span

                        onClick={()=>navigate("/register")}

                        className="text-blue-600 ml-2 cursor-pointer font-semibold"

                        >

                            Create Account

                        </span>


                    </p>


                </div>


            </div>


        </div>

    );

}


export default Login;