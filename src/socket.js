import {io} from "socket.io-client"
import useProfile from "./hooks/UserHook/useProfile.js"

const ENDPOINT = "http://localhost:9000"

const socket = io(ENDPOINT, {
    autoConnect:false
})

export default socket