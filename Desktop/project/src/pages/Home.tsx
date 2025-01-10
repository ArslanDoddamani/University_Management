import { useNavigate } from "react-router-dom"
export default function Home () {
    const navigate=useNavigate();
    return(
        <>
        <button className="bg-black border-2 m-2 p-4 text-white" onClick={()=>{
            navigate('/login')
        }}>Sign in</button>
        <button className="bg-black border-2 m-2 p-4 text-white" onClick={()=>{
            navigate('/register')
        }}>Register</button>
        <button className="bg-black border-2 m-2 p-4 text-white" onClick={()=>{
            navigate('/adminlogin')
        }}>Login as Admin</button>
        </>
    )
}