import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Register() {

    const navigate = useNavigate();


    const [form, setForm] = useState({

        name: "",
        email: "",
        password: ""

    });



    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            await api.post(
                "/auth/register",
                form
            );


            alert("Registration Successful");


            navigate("/");



        } catch(error) {


            console.log(
                error.response?.data || error.message
            );


            alert("Registration Failed");


        }

    };



    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">


            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">


                <h1 className="text-3xl font-bold text-center mb-2">

                    🚀 CamBridge

                </h1>


                <p className="text-center text-gray-500 mb-6">

                    Create your secure account

                </p>



                <form onSubmit={handleSubmit}>


                    <input

                        type="text"

                        name="name"

                        placeholder="Full Name"

                        value={form.name}

                        onChange={handleChange}

                        className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"

                    />



                    <input

                        type="email"

                        name="email"

                        placeholder="Email Address"

                        value={form.email}

                        onChange={handleChange}

                        className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"

                    />



                    <input

                        type="password"

                        name="password"

                        placeholder="Password"

                        value={form.password}

                        onChange={handleChange}

                        className="w-full border p-3 rounded-lg mb-5 outline-none focus:ring-2 focus:ring-blue-500"

                    />



                    <button

                        type="submit"

                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"

                    >

                        Create Account

                    </button>


                </form>



                <p className="text-center mt-5 text-gray-600">


                    Already have an account?


                    <span

                        onClick={() => navigate("/")}

                        className="text-blue-600 cursor-pointer ml-1 font-semibold"

                    >

                        Login

                    </span>


                </p>



            </div>


        </div>

    );

}


export default Register;