// Home Start

let textLength = $(".home__main-title").text();

if (textLength.length >= 60) {
    $(".home__main-title").css("font-size", "24px");
}

console.log(textLength.length);

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 0,
  centeredSlides: true,
  loop: true,
  effect: "fade",
  speed: 1000,
  autoplay: {
	delay: 10000,
	disableOnInteraction: false
  },

});

const $slider = $("#volme__input");
const min = $slider.attr("min");
const max = $slider.attr("max");

updateSliderBackground($slider);

$slider.on("input", function() {
  updateSliderBackground($(this));
});

function updateSliderBackground($slider) {
  const value = $slider.val();
  const background = `linear-gradient(to right, rgba(255, 255, 255, 0.8) 40%, rgba(255, 255, 255, 0.4) 80%)`;
  $slider.css("background", background);
};


let click = false;
$("#volme").click(() => {
  if (click == false) {
    $("#voice__change").addClass("home__voice-animation--oepn");
    $("#voice__change").removeClass("home__voice-animation--close");

    click = true;
  } else {
    $("#voice__change").addClass("home__voice-animation--close");
    $("#voice__change").removeClass("home__voice-animation--oepn");
    click = false;
  }
});

$(".home__header-burger").click(() => {
  $("body").toggleClass("overflow-hidden");
  $(".home__header-left").toggleClass("home__header-active home__header-active1");
  $(".home__header-rigth").toggleClass("home__header-active home__header-active2");

 

	home.scrollIntoView({
    block: "start",
    inline: "nearest",
    behavior: "smooth"
  });

  $(".burger__row1").toggleClass("burger__row1-active");
  $(".burger__row2").toggleClass("burger__row2-active");
  $(".burger__row3").toggleClass("burger__row3-active");
  $(".home__menu").toggleClass("home__menu-open");


});


// Home End



// Schedule Start
// Schedule End



// About Us Start
// About Us End



// Team Start
// Team End



// Partners Start
// Partners End



// Footer Start
function displayCurrentYear() {
    const currentYear = new Date().getFullYear();

    copyrightYear.innerHTML = currentYear;
}

displayCurrentYear();
// Footer End