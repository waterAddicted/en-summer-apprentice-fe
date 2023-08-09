// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

// HTML templates
const getHomePageTemplate = () => {
  return `
    <div>
      <p id="choose_event_label">Choose your event</p>
      <input type="text" placeholder="Search events..." id="search_event_input" />
    </div>
    <div>
      <div class="events flex "></div>
    </div>
  `;
};




function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

const createEvent = (eventData) => {
  const contentMarkup = `
    <div class="event">
      <h4 class="event-title">${eventData.eventName}</h4>
      <a href="main.php?eventName=${encodeURIComponent(eventData.eventId)}">
        <img src="images/${eventData.eventName}.jpg" alt="Event Image" class="event-image" />
      </a>
    </div>
  `;
  const eventCard = document.createElement("div");
  eventCard.innerHTML = contentMarkup;
  return eventCard;
};



async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  const response = await fetch('http://localhost:8080/api/Event/Events');
  const data = await response.json();
  console.log(data);
  const mainDiv = document.querySelector('.events');
  data.forEach((event) => {
    mainDiv.appendChild(createEvent(event))
  });
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/Orders') {
    renderOrdersPage();
  }
}

$(document).on("keyup", "#search_event_input", function() {
  var param = $(this).val();
  param = param.toLowerCase();

  if (param != '') {
      $("#main_container_div").empty();
      var container = "";
      var eventCounter = 0;
      for (var key in arr) {
          if (arr[key].includes(param)) {
              ++eventCounter;
              let copyString = copyArr[key];
              container += '<a href="${eventData.eventName}">' + copyArr[key] + '"><div class="each_card_event_main_container"><img src="images/${eventData.eventName}.jpg" alt="Event Image" class="event-image"/>' + copyArr[key] + 'class="each_event_picture" /><div class="inner_each_event_name_container"><p class="each_event_name">' + copyString + '</div></div></a>';
          }}
        
        
        }})

document.addEventListener("scroll", function(e) {
  if ($("body").scrollTop() > 600) {
      $("#scroll_up_arrow_image").css("display", "block");
  } else {
      $("#scroll_up_arrow_image").css("display", "none");
  }
}, true);

$(document).on("click", "#scroll_up_arrow_image", function() {
  $("body").animate({
      scrollTop: 0
  }, 500);
});

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
