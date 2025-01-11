import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping,faAngleDown } from '@fortawesome/free-solid-svg-icons'
import LoginDialog from './LoginDialog.js'
import { useState } from 'react'

const Header = () => {
  const [open,setOpen]=useState(false);
  const LoginBtn = () =>{
    setOpen(true);
  }
    return(
      <>
    <div className="container">
         <div className="logo">
         <img  src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png" height="20px" width="75px" alt="logo" id="image"/><br/>
         Explore <span>Plus</span>
         </div>
         <div className="Search_box">
        <input type="text" placeholder="Search for Products,brands and more"/>
        </div>
        <div className="buttons">
        <button id="login_btn" onClick={()=>LoginBtn()}>Login</button>
        <p id="seller">Become a Seller</p>
        <p class="more">More<FontAwesomeIcon icon={faAngleDown} id="down_icon" /></p>
        <p id="cart">Cart<FontAwesomeIcon icon={faCartShopping} id="cart_icon"/></p>
        </div>
    </div>
    <LoginDialog open={open} setOpen={setOpen}/>
    </>
    )}
export default Header;