import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";


function Home(){

    const navigate = useNavigate();


    return (

        <div className="min-h-screen bg-slate-950 text-white">


            {/* Hero Section */}

            <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">


                <h1 className="text-6xl font-bold mb-6">

                    🚀 CamBridge

                </h1>



                <p className="text-3xl font-semibold text-blue-400 mb-5">

                    Smart Security.
                    <br/>
                    Powered by Old Devices.

                </p>




                <p className="text-slate-400 text-lg max-w-2xl mb-8">

                    Transform your unused smartphones into
                    secure remote monitoring cameras.
                    Access your cameras anytime, anywhere.

                </p>





                <div className="flex gap-5">


                    <button

                    onClick={()=>navigate("/login")}

                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition"

                    >

                        Get Started

                    </button>




                    <button

                    onClick={()=>navigate("/register")}

                    className="border border-slate-600 hover:bg-slate-800 px-8 py-3 rounded-xl font-semibold transition"

                    >

                        Create Account

                    </button>


                </div>





            </section>








            {/* Features Section */}


            <section className="py-20 px-8">


                <h2 className="text-4xl font-bold text-center mb-12">

                    Why CamBridge?

                </h2>





                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">



                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">


                        <h3 className="text-2xl font-semibold mb-3">

                            📱 Old Devices

                        </h3>


                        <p className="text-slate-400">

                            Convert your unused smartphones into
                            powerful security cameras.

                        </p>


                    </div>







                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">


                        <h3 className="text-2xl font-semibold mb-3">

                            🔒 Secure Monitoring

                        </h3>


                        <p className="text-slate-400">

                            Access your cameras securely from
                            anywhere anytime.

                        </p>


                    </div>







                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">


                        <h3 className="text-2xl font-semibold mb-3">

                            🌐 Remote Access

                        </h3>


                        <p className="text-slate-400">

                            Monitor your home, shop or office
                            remotely.

                        </p>


                    </div>




                </div>



            </section>









            {/* Footer */}

            <Footer/>


        </div>

    );

}


export default Home;