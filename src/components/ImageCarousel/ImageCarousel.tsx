import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const images = [
    "assets/EAM2.svg",
    "assets/eleiko.svg",
    "assets/SBD.svg",
    "assets/sm.svg",
    "assets/trcw.svg",
    "assets/AM2.svg",
    "assets/AV.svg",
    "assets/DD.svg",
    "assets/Gymzilla.svg",
    "assets/HS.svg",
    "assets/IPF.svg",
    "assets/IPF2.svg",
    "assets/MBC2.svg",
    "assets/MSport.svg",
    "assets/Pagcor.svg",
    "assets/PAP.svg",
    "assets/parkinn.svg",
    "assets/PH2.svg",
    "assets/POC.svg",
    "assets/PSC.svg",
    "assets/wheyl.svg",
];

const Carousel = () => {
    const settings = {
        infinite: true,
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Slider {...settings}>
                {images.map((src, index) => (
                    <div key={index}>
                        <img src={src} alt={`Slide ${index + 1}`} className="w-full rounded-lg shadow-lg" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
