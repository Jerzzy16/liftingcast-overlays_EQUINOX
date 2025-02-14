import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const images = [
    "assets/EAM2.svg",
    "assets/eleiko.svg",
    "assets/SBD.svg",
    "assets/sm.svg",
    "assets/trcw.svg",
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
