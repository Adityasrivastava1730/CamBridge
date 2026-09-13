import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function CameraCard({ camera, refresh }) {


    const navigate = useNavigate();


    const [edit,setEdit] = useState(false);

    const [cameraName,setCameraName] = useState(
        camera.cameraName
    );

    const [status,setStatus] = useState(
        camera.status
    );


    const [loading,setLoading] = useState(false);





    // DELETE CAMERA

    const deleteCamera = async()=>{


        const confirmDelete = window.confirm(
            "Delete this camera?"
        );


        if(!confirmDelete)
            return;


        try{


            setLoading(true);


            const token =
            localStorage.getItem("token");



            await api.delete(

                `/cameras/${camera._id}`,

                {
                    headers:{
                        Authorization:
                        `Bearer ${token}`
                    }
                }

            );


            refresh();


        }
        catch(error){


            console.log(
                error.response?.data ||
                error.message
            );


        }
        finally{

            setLoading(false);

        }


    };







    // UPDATE CAMERA


    const updateCamera = async()=>{


        if(!cameraName.trim()){

            alert(
                "Camera name required"
            );

            return;

        }



        try{


            setLoading(true);


            const token =
            localStorage.getItem("token");



            await api.put(

                `/cameras/${camera._id}`,

                {

                    cameraName,

                    status

                },

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );



            setEdit(false);


            refresh();



        }
        catch(error){


            console.log(
                error.response?.data ||
                error.message
            );


        }
        finally{

            setLoading(false);

        }


    };









    return(


<div className="
bg-slate-900 
border 
border-slate-800 
rounded-2xl 
p-6 
shadow-xl
">





{

edit ? (


<div>



<h3 className="text-xl font-bold mb-4">

Edit Camera

</h3>





<input


value={cameraName}


onChange={(e)=>
setCameraName(e.target.value)
}


className="
w-full
mb-4
px-4
py-3
bg-slate-800
rounded-xl
border
border-slate-700
outline-none
"


/>





<select


value={status}


onChange={(e)=>
setStatus(e.target.value)
}


className="
w-full
mb-5
px-4
py-3
bg-slate-800
rounded-xl
"


>


<option value="online">
Online
</option>


<option value="offline">
Offline
</option>


</select>







<div className="flex gap-3">



<button

onClick={updateCamera}

disabled={loading}

className="
bg-green-600
px-5
py-2
rounded-xl
"

>

{
loading ?
"Saving..."
:
"Save"
}


</button>






<button

onClick={()=>setEdit(false)}

className="
bg-slate-700
px-5
py-2
rounded-xl
"

>

Cancel

</button>



</div>



</div>



)

:

(



<>


<div className="flex justify-between items-center mb-4">



<div>


<h3 className="text-xl font-bold">

📹 {camera.cameraName}

</h3>



<p className="text-sm text-blue-400 mt-2">

🔑 Pair Code : {camera.pairCode || "Not Generated"}

</p>


</div>






{

camera.status==="online"


?


<span className="
bg-green-500/20
text-green-400
px-3
py-1
rounded-full
text-sm
">

🟢 Online

</span>


:


<span className="
bg-red-500/20
text-red-400
px-3
py-1
rounded-full
text-sm
">

🔴 Offline

</span>


}



</div>









<div className="
h-40
bg-slate-800
rounded-xl
flex
items-center
justify-center
mb-4
">


<div className="text-center">


<p className="text-slate-400">

Camera Preview

</p>


<p className="text-xs text-slate-600 mt-2">

ID : {camera._id}

</p>


</div>


</div>









<div className="flex gap-3">





<button


disabled={camera.status==="offline"}


onClick={()=>navigate(
`/camera/${camera._id}`
)}


className="
flex-1
bg-blue-600
hover:bg-blue-700
disabled:bg-slate-700
py-2
rounded-xl
"


>


▶ View

</button>








<button


onClick={()=>setEdit(true)}


className="
bg-yellow-500
text-black
px-4
rounded-xl
"


>

Edit

</button>








<button


onClick={deleteCamera}


disabled={loading}


className="
bg-red-600
px-4
rounded-xl
"


>


Delete

</button>






</div>



</>


)


}



</div>


);


}


export default CameraCard;