import Banner from "./Banner";
import HomeNavbar from "./Home_navbar";

const Home = () =>{
    return(
        <div>
       <HomeNavbar/>
       <div className='home_page'>
       <Banner/>
       </div>
       </div>
    )
}

export default Home;