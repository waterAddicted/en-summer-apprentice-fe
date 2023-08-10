// Navigate to a specific URL
function navigateTo(url, userId) {
  const urlWithUserId = userId ? `${url}?userId=${userId}` : url;
  history.pushState(null, null, urlWithUserId);
  renderContent(url);
}

// HTML templates
const getHomePageTemplate = () => {
  return `
    <div>
      <input type="text" placeholder="Search events..." id="search_event_input" />
    </div>
    <div>
      <div class="events flex "></div>
    </div>
  `;
};




function getOrdersPageTemplate() {
  return `
    <div id="content" class="orders">
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
  const origin = window.location.origin;

  
  if (window.location.pathname === '/') {
    
    window.location.href = `${origin}/login.html`;
  } else {

    const currentUrl = window.location.href;
    renderContent(currentUrl);
  }
}

const createEvent = (eventData, userId) => {
  const contentMarkup = `
    <div class="event">
      <h4 class="event-title">${eventData.eventName}</h4>
      <a href="main.php?eventName=${encodeURIComponent(eventData.eventId)}&userId=${userId}">
        <img src="images/${eventData.eventName}.jpg" alt="Event Image" class="event-image" />
      </a>
    </div>
  `;
  const eventCard = document.createElement("div");
  eventCard.innerHTML = contentMarkup;
  return eventCard;
};




function getEventPageTemplate(eventName) {
  return `
    <div>
      <h1 class="text-2xl mb-4 mt-8 text-center">${eventName} Event Page</h1>
      <!-- Aici puteți adăuga orice alte elemente sau informații specifice paginii de eveniment -->
    </div>
  `;
}




async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  const response = await fetch('http://localhost:8080/api/Event/Events');
  const data = await response.json();
  const mainDiv = document.querySelector('.events');
  data.forEach((event) => {
    mainDiv.appendChild(createEvent(event, localStorage.getItem("userId")))
  });
}

function renderEventPage(userId, eventName) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getEventPageTemplate(eventName);

}


async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component-orders');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const response = await fetch('http://localhost:8080/api/Order/Orders');
  const data = await response.json();
  const table = createOrdersTable(data);
  const mainDiv = document.querySelector('.orders');
  mainDiv.appendChild(table);
}

function createOrdersTable(orders) {
  const table = document.createElement('table');
  table.classList.add('orders-table');

  // Create table header row
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
      <th>Event Name</th>
      <th>Event Type</th>
      <th>Number of Tickets</th>
      <th>Price per Ticket</th>
      <th>Total Price</th>
  `;
  table.appendChild(headerRow);

  // Create table rows for each order
  orders.forEach((order) => {
      const orderRow = document.createElement('tr');
      orderRow.classList.add('order');

      orderRow.innerHTML = `
          <td>${order.ticketCategory.event.eventName}</td>
          <td contenteditable="true">${order.ticketCategory.event.eventType.eventtypeName}</td>
          <td contenteditable="true">${order.numberOfTickets}</td>
          <td>$${order.ticketCategory.price}</td>
          <td>$${order.totalPrice}</td>
      `;

      table.appendChild(orderRow);
  });

  return table;
}


// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  var path = window.location.pathname;
  var page = path.split("/").pop();

  if (url === '/' || page === 'index.html') {
    renderHomePage();
  } else if (page === 'orders.html') {
    renderOrdersPage();
  } else if (url.startsWith('/main.php')) {
    renderEventPage(userId, urlParams.get('eventName'));
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
