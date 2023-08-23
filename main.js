// Navigate to a specific URL
function navigateTo(url, userId) {
  const urlWithUserId = userId ? `${url}?userId=${userId}` : url;
  history.pushState(null, null, urlWithUserId);
  renderContent(url);
}

// HTML templates
const getHomePageTemplate = () => {
  return `
  <label for="eventType">Select Event Type:</label>
  <select id="eventType">
  <option class = "event-type-list"></option>
  </select>
  <br>
  <br>
  <label for="eventLocation">Select Event Location:</label>
  <select id="eventLocation">
  <option class = "event-location-list"></option>
  </select>
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
      <a href="main.php?eventId=${encodeURIComponent(eventData.eventId)}&userId=${userId}">
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

  const eventTypeSelect = document.getElementById('eventType');
  const eventLocationSelect = document.getElementById('eventLocation'); // Add this line

  const response = await fetch('http://localhost:8080/api/Event/Events');
  const data = await response.json();

  const eventTypesSet = new Set();
  const eventLocationsSet = new Set();

  const mainDiv = document.querySelector('.events');
  data.forEach((event) => {
    mainDiv.appendChild(createEvent(event, localStorage.getItem("userId")));
    eventTypesSet.add(event.eventType.eventtypeName);
    eventLocationsSet.add(event.venue.location);
  });

  eventTypesSet.forEach((eventType) => {
    const option = document.createElement('option');
    option.value = eventType;
    option.text = eventType;
    eventTypeSelect.appendChild(option);
  });

  eventLocationsSet.forEach((eventLocation) => {
    const option = document.createElement('option');
    option.value = eventLocation;
    option.text = eventLocation;
    eventLocationSelect.appendChild(option); // Add this block
  });
}


function renderEventPage(userId, eventName) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getEventPageTemplate(eventName);

}


async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  if (mainContentDiv) {
    mainContentDiv.innerHTML = getOrdersPageTemplate();

    const response = await fetch('http://localhost:8080/api/Order/Orders');
    const data = await response.json();
    const table = createOrdersTable(data);
    const mainDiv = document.querySelector('.orders');
    if (mainDiv) {
      mainDiv.appendChild(table);
    }
    disableUpdateFields(data);
    setupTableButtonEvents(data);
  }
}

function disableUpdateFields(data){
  const userId = localStorage.getItem("userId");
  const userOrders = data.filter(order => order.user.userId === parseInt(userId, 10));
  userOrders.forEach((order)=>{
    const ticketsinput = document.querySelector("#numberoftickets-"+order.orderId);
    ticketsinput.disabled=true;
  })
}

function setupTableButtonEvents(orders){
  const userId = localStorage.getItem("userId");
  const userOrders = orders.filter(order => order.user.userId === parseInt(userId, 10));

  userOrders.forEach((order) => {
    const ticketsinput = document.querySelector("#numberoftickets-"+order.orderId);
    
    const deleteButton = document.querySelector('#deleteButton-' +order.orderId);
    deleteButton.addEventListener('click', () => {
      handleDeleteOrder(order);
    });

    // Attach an event listener to the "Edit" button
    const editButton = document.querySelector('#editButton-' +order.orderId);
    editButton.addEventListener('click', () => {
      if(ticketsinput.disabled === true){
        ticketsinput.disabled = false;
      }
      else{
        ticketsinput.disabled=true;
        handleEditOrder(order);
      }
      
    });
  })
}


function createOrdersTable(orders) {
  const userId = localStorage.getItem("userId");
  const userOrders = orders.filter(order => order.user.userId === parseInt(userId, 10));

  const table = document.createElement('table');
  table.classList.add('orders-table');

  // Create table header row
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th class="table-header">Event Name</th>
    <th class="table-header">Ticket Type</th>
    <th class="table-header">Number of Tickets</th>
    <th class="table-header">Price per Ticket</th>
    <th class="table-header">Total Price</th>
    <th class="table-header">Edit|Delete</th>
  `;
  table.appendChild(headerRow);

  // Create table rows for each order
  userOrders.forEach((order) => {
    const orderRow = document.createElement('tr');
    orderRow.classList.add('order');

    orderRow.innerHTML = `
      <td>${order.ticketCategory.event.eventName}</td>
      <td>${order.ticketCategory.description}</td>
      <td><input class ="numberOfTicketsInput" id ="numberoftickets-${order.orderId}" value = "${order.numberOfTickets}" type =number min="1"></input></td>
      <td>$${order.ticketCategory.price}</td>
      <td>$${order.totalPrice}</td>
      <td>
      <button class="edit-button" id="editButton-${order.orderId}"><img src="./src/assets/edit.jpg" alt="Edit|Delete" /></button>
      <button class="delete-button" id="deleteButton-${order.orderId}"><img src="./src/assets/delete.jpg" alt="Edit|Delete" /></button>
      </td>
    `;

    

    table.appendChild(orderRow);
  });

  return table;
}

async function handleDeleteOrder(order) {
  const response = await fetch(`http://localhost:8080/api/Order/${order.orderId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    // Remove the corresponding row from the table
    const deleteRowIndex = findDeleteRowIndex(order.orderId);
    if (deleteRowIndex !== -1) {
      const table = document.querySelector('.orders-table');
      table.deleteRow(deleteRowIndex);
      
    }
    alert("Order deleted.Please reload the page.")
  } else {
    console.error('Failed to delete order:', order);
  }
}

async function handleEditOrder(order) { 
  const numberOfTickets= document.querySelector('#numberoftickets-' + order.orderId);
  const numberOfTicketsInput = parseInt(numberOfTickets.value, 10); // Parse the 
  if (numberOfTicketsInput < 1) {
    alert('Number of tickets must be at least 1');
    numberOfTickets.value = 1;
  } 
  console.log(order.user);
  console.log(order.ticketCategory);
  console.log(order.orderAt);
  console.log(numberOfTicketsInput.value);
  console.log(order.ticketCategory.price*numberOfTicketsInput)
  const response = await fetch(`http://localhost:8080/api/Order/${order.orderId}`, {
    method: 'PUT',
    body: JSON.stringify({
      user: order.user,
      ticketCategory:order.ticketCategory,
      orderAt:order.orderAt,
      numberOfTickets:numberOfTicketsInput,
      totalPrice:order.ticketCategory.price*numberOfTicketsInput,
      orderId:order.orderId
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    // Remove the corresponding row from the table
    const editRowIndex = findDeleteRowIndex(order.orderId);
    if (editRowIndex !== -1) {
      const table = document.querySelector('.orders-table');
      table.deleteRow(editRowIndex);
    }
    alert('Order edited. Please reload the page.');
  } else {
    console.error('Failed to edit order:', order);
  }
}

function findDeleteRowIndex(orderId) {
  const table = document.querySelector('.orders-table');
  const rows = table.querySelectorAll('.order');
  for (let i = 0; i < rows.length; i++) {
    const rowOrderId = parseInt(rows[i].getAttribute('data-order-id'));
    if (rowOrderId === orderId) {
      return i;
    }
  }
  return -1;
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
  } else if (url === '/'||page === 'orders.html') {
    renderOrdersPage();
  } else if (url.startsWith('/main.php')) {
    renderEventPage(userId, urlParams.get('eventName'));
  }
}

function searchEvents(query, events) {
  return events.filter(event => {
    const eventName = event.eventName.toLowerCase();
    return eventName.includes(query.toLowerCase());
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search_event_input');
  const slectedEventType = document.getElementById('eventType')
  const selectedEventLocation = document.getElementById('eventLocation');

  searchInput.addEventListener('keyup', async () => {
    const response = await fetch("http://localhost:8080/api/Event/Events");
    const data = await response.json();

    const searchTerm = searchInput.value.trim();
    const filteredEvents = searchEvents(searchTerm, data);

    const mainDiv = document.querySelector('.events');
    mainDiv.innerHTML = '';

    filteredEvents.forEach((event) => {
      mainDiv.appendChild(createEvent(event));
    });
  });

  slectedEventType.addEventListener('change', async () => {
    const eventTypeSelect = document.getElementById('eventType');

    eventTypeSelect.addEventListener('change', async () => {
      const response = await fetch("http://localhost:8080/api/Event/Events");
      const data = await response.json();
    
      const eventTypeSelected = eventTypeSelect.value;
      const filteredEvents = data.filter(event => event.eventType.eventtypeName === eventTypeSelected);
    
      const mainDiv = document.querySelector('.events');
      mainDiv.innerHTML = '';
    
      filteredEvents.forEach((event) => {
        mainDiv.appendChild(createEvent(event));
      });
    });
    
  });

  selectedEventLocation.addEventListener('change', async () => {
    const response = await fetch("http://localhost:8080/api/Event/Events");
    const data = await response.json();

    const locationEventSelected = selectedEventLocation.value;
    const filteredEvents = data.filter(event => event.venue.location === locationEventSelected);

    const mainDiv = document.querySelector('.events');
    mainDiv.innerHTML = '';

    filteredEvents.forEach((event) => {
      mainDiv.appendChild(createEvent(event));
    });
  });
  
});



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
