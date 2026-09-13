import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/Navbar";
import CameraCard from "../components/CameraCard";


function Dashboard(){

    const navigate = useNavigate();


    const [data,setData] = useState(null);

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");



    const [cameraName,setCameraName] = useState("");

    const [status,setStatus] = useState("offline");













    const fetchDashboard = async()=>{


        try{


            setLoading(true);


            const token = localStorage.getItem("token");



            if(!token){

                setError("Login required");

                return;

            }





            const response = await api.get(

                "/cameras/dashboard",

                {

                    headers:{

                        Authorization:`Bearer ${token}`

                    }

                }

            );



            setData(response.data);

            setError("");



        }

        catch(err){


            console.log(
                err.response?.data || err.message
            );


            setError(
                "Failed to load dashboard"
            );


        }

        finally{


            setLoading(false);


        }



    };









    useEffect(()=>{
        const timer = window.setTimeout(fetchDashboard, 0);
        return () => window.clearTimeout(timer);
    },[]);

    const addCamera = async()=>{


        if(!cameraName.trim()){

            alert("Enter camera name");

            return;

        }





        try{


            const token = localStorage.getItem("token");



            await api.post(

                "/cameras",

                {

                    cameraName,

                    status

                },

                {

                    headers:{

                        Authorization:`Bearer ${token}`

                    }

                }

            );




            setCameraName("");

            setStatus("offline");



            fetchDashboard();



        }

        catch(err){


            console.log(

                err.response?.data || err.message

            );


        }


    };









    if(loading){


        return(

            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">


                <h1 className="text-2xl">

                    Loading CamBridge...

                </h1>


            </div>

        );


    }









    if(error){


        return(

            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">


                <div className="bg-red-900/30 p-8 rounded-xl">


                    <h2 className="text-xl">

                        {error}

                    </h2>


                    <button

                    onClick={fetchDashboard}

                    className="mt-5 bg-blue-600 px-5 py-2 rounded-xl"

                    >

                        Retry

                    </button>


                </div>


            </div>

        );


    }










    const onlineCameras = data.cameras.filter(

        camera=>camera.status==="online"

    ).length;



    const offlineCameras = data.cameras.filter(

        camera=>camera.status==="offline"

    ).length;









    return(


        <div className="min-h-screen bg-slate-950 text-white">



            <Navbar user={data.user}/>





            <div className="p-8">





                {/* TITLE */}


                <div className="mb-8">


                    <h1 className="text-4xl font-bold">

                        Dashboard

                    </h1>



                    <p className="text-slate-400 mt-2">

                        Welcome back {data.user.name} 👋

                    </p>



                    <p className="text-slate-500">

                        {data.user.email}

                    </p>

                    <button
                    onClick={()=>navigate("/connect-camera")}
                    className="mt-5 bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-xl font-semibold"
                    >
                        Connect phone camera
                    </button>


                </div>









                {/* STATS */}


                <div className="grid md:grid-cols-3 gap-6 mb-10">





                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">


                        <p className="text-slate-400">

                            Total Cameras

                        </p>


                        <h2 className="text-4xl font-bold text-blue-400 mt-2">

                            {data.totalCameras}

                        </h2>


                    </div>






                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">


                        <p className="text-slate-400">

                            Online

                        </p>


                        <h2 className="text-4xl font-bold text-green-400 mt-2">

                            {onlineCameras}

                        </h2>


                    </div>






                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">


                        <p className="text-slate-400">

                            Offline

                        </p>


                        <h2 className="text-4xl font-bold text-red-400 mt-2">

                            {offlineCameras}

                        </h2>


                    </div>




                </div>









                {/* ADD CAMERA */}



                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-10">


                    <h2 className="text-2xl font-bold mb-5">

                        Add New Camera 📷

                    </h2>




                    <div className="flex flex-col md:flex-row gap-4">



                        <input


                        value={cameraName}


                        onChange={(e)=>setCameraName(e.target.value)}


                        placeholder="Camera name"


                        className="flex-1 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"


                        />






                        <select


                        value={status}


                        onChange={(e)=>setStatus(e.target.value)}


                        className="bg-slate-800 px-4 py-3 rounded-xl"


                        >


                            <option value="online">

                                Online

                            </option>


                            <option value="offline">

                                Offline

                            </option>


                        </select>








                        <button


                        onClick={addCamera}


                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"


                        >


                            + Add Camera


                        </button>



                    </div>



                </div>









                {/* CAMERA LIST */}



                <h2 className="text-3xl font-bold mb-6">

                    Your Cameras

                </h2>







                {

                    data.cameras.length===0 ?


                    (

                        <div className="bg-slate-900 p-8 rounded-xl text-slate-400">


                            No cameras added yet 📷


                        </div>

                    )


                    :


                    (

                        <div className="grid md:grid-cols-3 gap-6">


                            {

                                data.cameras.map(camera=>(


                                    <CameraCard


                                    key={camera._id}


                                    camera={camera}


                                    refresh={fetchDashboard}


                                    />


                                ))

                            }


                        </div>

                    )


                }








            </div>



        </div>


    );


}


export default Dashboard;