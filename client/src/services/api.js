// import axios from "axios";

// const api = axios.create({

//     baseURL:"http://192.168.29.141:5000/api"

// });

// export default api;


import axios from "axios";


const api = axios.create({

    baseURL:import.meta.env.VITE_API_URL || "/api"

});



api.interceptors.request.use(

(config)=>{


    const token =
    localStorage.getItem("token");


    if(token){

        config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

},

(error)=>{

    return Promise.reject(error);

}

);


export default api;