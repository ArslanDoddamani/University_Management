import { navData } from "./Navdata";

const HomeNavbar = () =>{
    return(
        <div className="Home_navbar">
        {
           navData.map(data =>(
                   <div className="navdata">
                   <img src={data.url} id="nav_img"/>
                   <p id="nav_head">{data.text}</p>
                   </div>
           ))
        }
               </div>
    )
}

export default HomeNavbar;