import { bannerData } from './Navdata';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
const Banner = () => {
    return(
    <Carousel responsive={responsive}
    dotListClass="custom-dot-list-style"
    itemClass="carousel-item-padding-40-px"
    swipeable={false}
    draggable={false}
    containerClass="carousel-container"
    infinite={true}
    autoPlay={true}
    autoPlaySpeed={2000}
 >
    {
        bannerData.map(data=>(
            <img src={data.url} id="banner_img"></img>
        ))
    }
    </Carousel>
    )
}

export default Banner;