import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function ConnectCamera(){

    const [pairCode,setPairCode] = useState("");

    const [loading,setLoading] = useState(false);

    const [error,setError] = useState("");

    const navigate = useNavigate();



    const connectCamera = async()=>{

        try{

            setLoading(true);
            setError("");


            const res = await api.post(
                "/cameras/pair",
                {
                    pairCode
                }
            );


            console.log(
                res.data
            );

            localStorage.setItem("deviceToken", res.data.deviceToken);


            navigate(
                `/phone-camera/${res.data.cameraId}`
            );


        }
        catch(error){

            setError(error.response?.data?.message || "Invalid Pair Code");

        }
        finally{

            setLoading(false);

        }

    };



    return(

        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">


            <div className="bg-slate-900 p-8 rounded-2xl w-96">


                <h1 className="text-2xl font-bold mb-6 text-center">
                    📱 Connect Camera
                </h1>

                {error && <p className="mb-4 rounded-lg bg-red-950/60 border border-red-800 p-3 text-red-200">{error}</p>}



                <input

                value={pairCode}

                onChange={(e)=>setPairCode(e.target.value)}

                placeholder="Enter CAM-XXXXXX"

                className="
                w-full
                p-3
                rounded-xl
                bg-slate-800
                mb-5
                "

                />



                <button

                onClick={connectCamera}

                disabled={loading}

                className="
                w-full
                bg-blue-600
                py-3
                rounded-xl
                "

                >

                {
                    loading?
                    "Connecting..."
                    :
                    "Connect"
                }


                </button>


            </div>


        </div>

    );

}


export default ConnectCamera;