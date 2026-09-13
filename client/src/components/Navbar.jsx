import { useNavigate } from "react-router-dom";


function Navbar({ user }) {


    const navigate = useNavigate();



    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };



    return (

        <nav className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center">


            {/* Logo */}

            <div 
            className="cursor-pointer"
            onClick={()=>navigate("/dashboard")}
            >

                <h1 className="text-2xl font-bold text-white">

                    🚀 CamBridge

                </h1>


                <p className="text-xs text-blue-400">

                    Smart Security Platform

                </p>


            </div>






            {/* Right Section */}


            <div className="flex items-center gap-6">



                <div className="text-right hidden md:block">


                    <p className="text-white font-semibold">

                        {user?.name}

                    </p>


                    <p className="text-slate-400 text-sm">

                        {user?.email}

                    </p>


                </div>





                <button

                onClick={logout}

                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition font-semibold"

                >

                    Logout

                </button>



            </div>



        </nav>

    );


}


export default Navbar;