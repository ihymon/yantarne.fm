// Loader Start
$("body").addClass("wrap-hidden");

const loader = () => {
  setTimeout(() => {
    $("body").removeClass("wrap-hidden");
    $("#loaderOverlay").addClass("_closed");

  }, 3000)
}

loader();
// Loader End



// Home Start

fetch(`https://complex.in.ua/status-json.xsl?mount=/yantarne`)
.then((response) => {
   return response.json()
})
.then((data) => {
  console.log(data);
  titel = data.icestats.source.title;

  let indexOf2 = titel.indexOf("-");

  let nameSound2 = titel.slice(0, indexOf2);
  let MusicanSound2 = titel.slice(indexOf2+2, titel.length);
  
  $(".home__main-title").text(nameSound2);
  $(".home__main-descripton").text(MusicanSound2);

});

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

let streamVolume = 0.5; 
let streamPlay = false;
let titel;
let stream;

updateSliderBackground($slider);


$(".voiceBig").hide();

$slider.on("input", function() {
  updateSliderBackground($(this));
});


function updateSliderBackground($slider) {
  const value = $slider.val();
  const background = `linear-gradient(to right, rgba(255, 255, 255, 0.8) ${value}%, rgba(255, 255, 255, 0.4) ${value}%)`;
  $slider.css("background", background);

  console.log(value / 100);
  streamVolume = value / 100;

  if (stream) {
    stream.volume = streamVolume;
    if (value == 0) {
      $(".voiceBig").hide();
      $(".voiceSmall").show();
    }else {
      $(".voiceBig").show();
      $(".voiceSmall").hide();
    }
  }
}

$(".play__btn-pause").toggle();



async function loadAudio() {
  try {
    const response = await fetch(`https://complex.in.ua/status-json.xsl?mount=/yantarne`);
    const data = await response.json();

    console.log(data.icestats);

    if (data.icestats.source) {
      const audioUrl = data.icestats.source.listenurl;
      const title = data.icestats.source.title;

      stream = new Audio(audioUrl); // No longer a reassignment to a constant variable
      stream.volume = streamVolume;

      stream.addEventListener('loadedmetadata', () => {
        console.log("Audio loaded");
      });

      await stream.load();

      updateTitleDescription(title);

      setInterval(async () => {
        const response = await fetch(`https://complex.in.ua/status-json.xsl?mount=/yantarne`);
        const newData = await response.json();

        console.log('changed');
        updateTitleDescription(newData.icestats.source.title);

      }, 2000);
    } else {
      $(".home__main-title").text("У нас зараз перерва");
    }
  } catch (error) {
    console.error("Error loading audio:", error);
  }
}

let animationBar;

$(".home__play").click(() => {
  $(".play__btn-play").toggle();
  $(".play__btn-pause").toggle();
  $(".voiceBig").show();
  $(".voiceSmall").hide();

  $('.bar').css({"animation-name": "wave-lg" });

  animationBar = setTimeout(() => {
    const bar = document.querySelectorAll(".bar");
    for (let i = 0; i < bar.length; i++) {
      bar.forEach((item, j) => {
      // Random move
      item.style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.3}s`;
      });
  }
 }, "1200")

    if (streamPlay === false) {
      try {
        if (!streamPlay) {
          if (stream) {
            stream.play().catch((playError) => {
              console.error("Error playing audio:", playError);
            });
            streamPlay = true;
            console.log("play");
          } else {
            console.error("Stream is not defined or could not be found.");
          }
        }
      } catch (error) {
        console.error("Error playing or pausing the audio:", error);
      }
    } else {
    console.log("pause");
    $(".voiceBig").hide();
    $(".voiceSmall").show();
    stream.pause();
    streamPlay = false;
    $('.bar').css({"animation-name": "none" });
    clearTimeout(animationBar);
  }
});

function updateTitleDescription(title) {
  $(".home__main-title").empty();
  $(".home__main-descripton").empty();

  const indexOf2 = title.indexOf("-");
  const nameSound2 = indexOf2 === -1 ? title : title.slice(0, indexOf2);
  const MusicanSound2 = indexOf2 === -1 ? '' : title.slice(indexOf2 + 2, title.length);

  $(".home__main-title").text(nameSound2);
  $(".home__main-descripton").text(MusicanSound2);
}

loadAudio()



function updateTitleDescription(title) {
  $(".home__main-title").empty();
  $(".home__main-descripton").empty();
  
  const indexOf2 = title.indexOf("-");
  const nameSound2 = indexOf2 === -1 ? title : title.slice(0, indexOf2);
  const MusicanSound2 = indexOf2 === -1 ? '' : title.slice(indexOf2 + 2, title.length);

  $(".home__main-title").text(nameSound2);
  $(".home__main-descripton").text(MusicanSound2);
}


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


let isMenuOpen = false;

$(".home__header-burger").click(() => {
  // if(!isMenuOpen) {
  //   $("body").addClass("overflow-hidden");
  // }
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


function resetBurger() {
  $("body").removeClass("overflow-hidden");
  $(".home__header-left").removeClass("home__header-active home__header-active1");
  $(".home__header-rigth").removeClass("home__header-active home__header-active2");
  $(".burger__row1").removeClass("burger__row1-active");
  $(".burger__row2").removeClass("burger__row2-active");
  $(".burger__row3").removeClass("burger__row3-active");
  $(".home__menu").removeClass("home__menu-open");
}

// Scroll To Section
$(".schedule--scroll").click(function() {
  resetBurger();
  $('html, body').animate({
      scrollTop: $(".schedule").offset().top
  }, 1000);
});

$(".about-us--scroll").click(function() {
  resetBurger();
  $('html, body').animate({
    scrollTop: $(".about-us").offset().top
  }, 1000);
});

$(".partners--scroll").click(function() {
  resetBurger();
  $('html, body').animate({
      scrollTop: $(".partners").offset().top - 0.20 * $(window).height()
  }, 1000);
});

$(".footer--scroll").click(function() {
  resetBurger();
  $('html, body').animate({
    scrollTop: $(".footer").offset().top
  }, 1000);
});


$(".team--scroll").click(function() {
  resetBurger();
  $('html, body').animate({
      scrollTop: $(".team").offset().top - 0.10 * $(window).height()
  }, 1000);
});

$(".home--scroll").click(function() {
  resetBurger();
  $('html, body').animate({
      scrollTop: $(".home").offset().top
  }, 1000);
});
// Scroll To Section


// Schedule Start
// Schedule End



// About Us Start
// About Us End



// Team Start
// Team End



// Partners Start

let owlSecond = $('.owl-carousel').owlCarousel({
  items: 3,
  loop: true,
  center: true,
  margin: 200,
  autoWidth: true,
  autoplay: true,
  autoplayTimeout: 1500,
  responsiveClass:true,
  dots: false,
  animateOut: 'slideOutDown',
  animateIn: 'flipInX',
  stagePadding:30,
  smartSpeed:650,
  
  responsive: {
    600: {
      margin: 80,
    },
    600: {
      margin: 100,
    },
    1400: {
      margin: 300,
    },
    2000: {
      margin: 200,
    },
  }
})
// Partners End



// Footer Start
function displayCurrentYear() {
    const currentYear = new Date().getFullYear();

    copyrightYear.innerHTML = currentYear;
}

displayCurrentYear();
// Footer End