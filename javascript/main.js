// Basic Start
let timeRefreshPage = 300000; 
let refreshPage = false; 
let refreshId;

$(window).focus(function() {
  clearTimeout(refreshId);
  if(refreshPage) {
    console.log("refreshPage")
    location.reload(true);
    refreshPage = false;
  }
});

$(window).blur(function() {
  refreshId = setTimeout(() => {
    refreshPage = true;
  }, timeRefreshPage)
});

// Basic Finish

// Loader Start

const loader = () => {
  setTimeout(() => {
    $("body").removeClass("wrap-hidden");
    $("#loaderOverlay").addClass("_closed");
    setTimeout(() => {
      $("#loaderOverlay").css("display", "none");
    }, 600);
  }, 2500)
}

loader();
// Loader End



// Home Start


if (/Mobile|iPhone|Android/.test(navigator.userAgent)) {
  $("#volme").hide();
} else {
  $("#volme").show();
}

fetch(`https://complex.in.ua/status-json.xsl?mount=/yantarne`)
.then((response) => {
   return response.json()
})
.then((data) => {
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


let swiper = new Swiper(".mySwiper", {
  spaceBetween: 0,
  centeredSlides: true,
  loop: true,
  effect: "fade",
  speed: 1000,
  autoplay: {
	delay: 20000,
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
let audioLoading = false;


if (localStorage.getItem('streamVolume')) {
  streamVolume = parseFloat(localStorage.getItem('streamVolume'));
}

$slider.val(streamVolume * 100);
updateSliderBackground($slider);

$(".voiceBig").hide();

$slider.on("input", function() {
  streamVolume = $(this).val() / 100;
  updateSliderBackground($(this));
  clearTimeout(timeId);
  closeVoice();
  
  localStorage.setItem('streamVolume', streamVolume);
});

function updateSliderBackground($slider) {
  const value = $slider.val();
  const background = `linear-gradient(to right, rgba(255, 255, 255, 0.8) ${value}%, rgba(255, 255, 255, 0.4) ${value}%)`;
  $slider.css("background", background);

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
    audioLoading = true; // Set the flag to indicate that audio loading is in progress

    const response = await fetch(`https://complex.in.ua/status-json.xsl?mount=/yantarne`);
    const data = await response.json();

    if (data.icestats.source) {
      const audioUrl = data.icestats.source.listenurl;
      const title = data.icestats.source.title;

      stream = new Audio(audioUrl);
      stream.volume = streamVolume;

      stream.addEventListener('loadedmetadata', () => {
        console.log("Audio loaded");
      });

      await stream.load();

      updateTitleDescription(title);

      setInterval(async () => {
        const response = await fetch(`https://complex.in.ua/status-json.xsl?mount=/yantarne`);
        const newData = await response.json();

        updateTitleDescription(newData.icestats.source.title);

      }, 2000);
    } else {
      $(".home__main-title").text("У нас зараз перерва");
    }
  } catch (error) {
    console.error("Error loading audio:", error);
  } finally {
    audioLoading = false; // Reset the flag once audio loading is complete
  }
}

let animationBar;
let doubleClick = false;

$(".home__play").click(async () => {
  $(".play__btn-play").toggle();
  $(".play__btn-pause").toggle();
  $(".voiceBig").show();
  $(".voiceSmall").hide();

  $(".home__play-line1").toggleClass("line1__open");
  $(".home__play-line2").toggleClass("line2__open");
  $(".home__play-line3").toggleClass("line3__open");


  $('.bar').css({"animation-name": "wave-lg" });
  animationBar = setTimeout(() => {
    const bar = document.querySelectorAll(".bar");
    for (let i = 0; i < bar.length; i++) {
      bar.forEach((item, j) => {
        // Random move
        item.style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.3}s`;
      });
    }
  }, "200");

  if (!streamPlay) {
    try {
      // Check if audio is still loading, wait for it to complete

      if (doubleClick == true) {
        await loadAudio();
      }

      while (audioLoading) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds
      }

      if (stream && stream.paused) {
        stream.play().catch((playError) => {
          if (playError.name === 'AbortError') {
            console.warn('Play request aborted, possibly due to rapid user interaction.');
          } else {
            console.error("Error playing audio:", playError);
          }
        });
        streamPlay = true;
        doubleClick = true;

      } else {
        console.error("Stream is not defined, could not be found, or is already playing.");
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  } else {
    $(".voiceBig").hide();
    $(".voiceSmall").show();

    // Pause the stream and do not resume if it's in the paused state
    stream.pause();
    streamPlay = false;
    $('.bar').css({"animation-name": "none"});
    clearTimeout(animationBar);
    
  }
});

// Обробник події натискання клавіші
document.addEventListener("keydown", async function(event) {
  console.log(event)

  if (event.code === "Space") {
    event.preventDefault();
    $(".play__btn-play").toggle();
    $(".play__btn-pause").toggle();
    $(".voiceBig").show();
    $(".voiceSmall").hide();
  
    $(".home__play-line1").toggleClass("line1__open");
    $(".home__play-line2").toggleClass("line2__open");
    $(".home__play-line3").toggleClass("line3__open");
  
  
    $('.bar').css({"animation-name": "wave-lg" });
    animationBar = setTimeout(() => {
      const bar = document.querySelectorAll(".bar");
      for (let i = 0; i < bar.length; i++) {
        bar.forEach((item, j) => {
          // Random move
          item.style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.3}s`;
        });
      }
    }, "200");
  
    if (!streamPlay) {
      try {
        // Check if audio is still loading, wait for it to complete
  
        if (doubleClick == true) {
          await loadAudio();
        }
  
        while (audioLoading) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds
        }
  
        if (stream && stream.paused) {
          stream.play().catch((playError) => {
            if (playError.name === 'AbortError') {
              console.warn('Play request aborted, possibly due to rapid user interaction.');
            } else {
              console.error("Error playing audio:", playError);
            }
          });
          streamPlay = true;
          doubleClick = true;
  
        } else {
          console.error("Stream is not defined, could not be found, or is already playing.");
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      $(".voiceBig").hide();
      $(".voiceSmall").show();
  
      // Pause the stream and do not resume if it's in the paused state
      stream.pause();
      streamPlay = false;
      $('.bar').css({"animation-name": "none"});
      clearTimeout(animationBar);
      
    }
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

let timeId;

function closeVoice() {
  timeId = setTimeout(() => {
    click = false;
    $("#voice__change").addClass("home__voice-animation--close");
    $("#voice__change").removeClass("home__voice-animation--oepn");
  }, 4000);
}
$(".home__voice").mouseleave(() => {
  if (click == true) {
    closeVoice();

  }
});



$(".home__voice").mouseenter(() => {
  clearTimeout(timeId);
});


let isMenuOpen = false;

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
function removeClassOnScroll(selector, className) {
  let elements = $(selector);

  $(window).scroll(function () {
    let windowTop = $(window).scrollTop();
    let windowBottom = windowTop + $(window).height();

    elements.each(function () {
      let element = $(this);
      let elementTop = element.offset().top;
      let elementBottom = elementTop + element.height();

      if (elementBottom >= windowTop && elementTop <= windowBottom) {
        element.removeClass(className);
      }
    });
  });
}

removeClassOnScroll(".schedule__title", "animation-show3");
removeClassOnScroll(".schedule__card", "animation-show1");
removeClassOnScroll(".schedule__card", "animation-show2");

// Schedule End



// About Us Start

removeClassOnScroll(".about-us__title", "animation-show3");
removeClassOnScroll(".about-us__destiption", "animation-show3");
removeClassOnScroll(".about-us__button", "animation-show3");

// About Us End



// Team Start

let delay;

if (window.innerWidth <= 500) {
  delay = 450;
} else {
  delay = 200;
}

$(document).ready(function () {
  let teamMembers = $(".team__member");

  $(window).scroll(function () {
    let windowTop = $(window).scrollTop();
    let windowBottom = windowTop + $(window).height();

    let teamSection = $("#team");
    let teamSectionTop = teamSection.offset().top;

    if (windowBottom >= teamSectionTop) {
      teamMembers.each(function (index) {
        let teamMember = $(this);
        setTimeout(function () {
          teamMember.addClass("animation-show");
        }, index * delay);
      });
    }
  });
});

removeClassOnScroll(".team__title", "animation-show3");

// Team End



// Partners Start
removeClassOnScroll(".partners__title", "animation-show3");
removeClassOnScroll(".partners__box", "animation-show3");
// Partners End



// Footer Start
function displayCurrentYear() {
    const currentYear = new Date().getFullYear();

    copyrightYear.innerHTML = currentYear;
}

displayCurrentYear();
// Footer End