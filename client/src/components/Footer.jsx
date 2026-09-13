function Footer(){

    return (

        <footer className="bg-slate-900 border-t border-slate-800 text-white px-8 py-10">


            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">



                {/* Brand */}

                <div>

                    <h2 className="text-2xl font-bold">

                        🚀 CamBridge

                    </h2>


                    <p className="text-slate-400 mt-3">

                        Smart security platform that
                        transforms old smartphones into
                        remote cameras.

                    </p>


                </div>





                {/* Founder */}

                <div>

                    <h3 className="text-xl font-semibold mb-3">

                        Founder

                    </h3>


                    <p className="text-slate-300">

                        Aditya Srivastava

                    </p>


                    <p className="text-slate-400">

                        Founder & Developer

                    </p>


                </div>





                {/* Contact */}

                <div>

                    <h3 className="text-xl font-semibold mb-3">

                        Connect

                    </h3>


                    <p className="text-slate-400">

                       <a 
href="mailto:adityasrivastava3999@gmail.com"
className="text-slate-400 hover:text-white"
>
📧 adityasrivastava3999gmail.com
</a>
                    </p>


                    <p className="text-slate-400">

                      <a
href="https://www.linkedin.com/in/aditya-srivastava-68b052339/"
target="_blank"
rel="noopener noreferrer"
className="text-blue-400 hover:text-blue-300 transition"
>
🔗 LinkedIn Profile
</a>
                    </p>


                    <p className="text-slate-400">

                        <a
href="tel:+916387436554"
className="text-slate-400 hover:text-white"
>
📱 +91 687436554
</a>
                    </p>


                </div>



            </div>





            <div className="text-center text-slate-500 mt-8 pt-5 border-t border-slate-800">


                © 2026 CamBridge. Built by Aditya Srivastava


            </div>



        </footer>

    );

}


export default Footer;