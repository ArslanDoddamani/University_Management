import Dialog from '@mui/material/Dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';

const LoginDialog = ({open,setOpen}) =>{

  const handleclose = () =>{
    setOpen(false);
  }
    return(
       <Dialog open={open} onClose={handleclose}>
        <div className="LoginPage">
         <div className="Left_view">
            <h1>Login</h1>
            <p>Get access to your Orders , Wishlist and Recommendations</p>
            <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png"/>
          </div>
         <div className="Right_view">
         <FontAwesomeIcon icon={faX} id="closeicon" onClick={handleclose} />
          <input type="text" placeholder="Enter Email/Mobile number"/>
          <p id="desc">By continuing, you agree to Flipkart's <span className="color">Terms of Use</span> and <span className="color">Privacy Policy.</span></p>
          <button id="loginbtn">Login</button>
          <p id="color">New to Flipkart?Create an Account</p>
        </div>
        </div>
    </Dialog>
    )
}

export default LoginDialog;