import { io } from "socket.io-client";


const socket = io(
    import.meta.env.VITE_SOCKET_URL || window.location.origin,
    {

        autoConnect:false,

        transports:[
            "websocket"
        ],

        reconnection:true

    }
);


export default socket;