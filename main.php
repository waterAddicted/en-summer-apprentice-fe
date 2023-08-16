    
<!DOCTYPE html>
<html>
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>Event Details</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #101212;
            color: white;
            font-family: Arial, sans-serif;
        }
        #back_button {
            position: fixed;
            top: 15px;
            left: 15px;
            width: 200px;
            height: 65px;
            border-radius: 15px;
            border: 3px solid white;
            transition: 0.2s all ease;
            background-color: grey;
            color: white;
            font-size: 26px;
            text-align: center;
            line-height: 65px;
            cursor: pointer;
            opacity: 0.75;
        }
        #back_button:hover {
            border-color: grey;
            transition: 0.2s all ease;
            background-color: white;
            color: grey;
            opacity: 1;
        }
        #back_button:focus {
            outline: none;
        }
        #viewOrderButton {
            margin-left: 10px;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            background-color: #007BFF;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        #event_details {
            margin: 50px auto;
            width: 80%;
            max-width: 1200px;
            text-align: center;
        }

        .event-image {
            width: 100%;
            height: 500px;
            background-size: cover;
            background-position: center;
            border: 5px solid black;
        }

        #eventDetails {
            margin-top: 20px;
        }

        #eventName {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        #eventDescription {
            font-size: 18px;
        }
    </style>
</head>
<body>
    <a id="back_button" href="index.html">Back to Events</a>
    <div id="event_details">
        <div id="mainImageContainer" class="event-image"></div>
        <div id="eventDetails" style="display: none;">
            <div id="eventNameDescription">
                <h2 id="eventName"></h2>
                <p id="eventDescription"></p>
                <div id="ticketCategory">
                    <label for="ticketType">Select Ticket Type:</label>
                    <select id="ticketType">
                        <option value="Standard">Standard</option>
                        <option value="VIP">VIP</option>
                    </select>
                    <!-- Add ticket quantity markup here -->
                    <div class="ticket-quantity">
                        <input type="number" class="ticket-input" id="ticketNumbers" value="0" min="0">
                        <button class="increment-button">+</button>
                        <button class="decrement-button">-</button>
                    </div>
                    <!-- End ticket quantity markup -->
                    <button id="viewOrderButton" disabled>Buy Ticket</button>
                </div>
            </div>
        </div>
    </div>
    <script>
$(document).ready(function() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var param = url.searchParams.get("eventId");

    $.ajax({
        url: "http://localhost:8080/api/Event/" + param,
        method: "GET",
        success: function(data) {
            // Set the background image of mainImageContainer
            $('#mainImageContainer').css('background-image', `url('images/${data.eventName}.jpg')`);
            
            // Set the event name and description
            $('#eventName').text(data.eventName);
            $('#eventDescription').text(data.eventDescription);

            // Handle ticket type selection change
            $('#ticketType').on('change', function() {
                var selectedType = $(this).val();
                $('#viewOrderButton').prop('disabled', true);

                // Check if the selected ticket type matches orders data
                $.ajax({
                    url: "http://localhost:8080/api/TicketCategory/TicketCategories",
                    method: "GET",
                    success: function(ticketCategories) {
                        var matchingTicketCategories = ticketCategories.filter(function(category) {
                            return category.event.eventName === data.eventName &&
                                category.description === selectedType;
                        });

                        if (matchingTicketCategories.length > 0) {
                            $('#viewOrderButton').prop('disabled', false);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Failed to fetch ticket categories:', error);
                    }
                });
            });

            // Display the eventDetails div
            $('#eventDetails').css('display', 'block');
        },
        error: function(xhr, status, error) {
            console.error('Failed to fetch event data:', error);
        }
    });

    // View Order button click handler

    function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

    $('#viewOrderButton').on('click', function() {
    var confirmBuy = confirm("Are you sure you want to buy this ticket?");
    if (confirmBuy) {
        // Retrieve user information
        var userId = localStorage.getItem("userId");

        // Fetch user details
        $.ajax({
            url: "http://localhost:8080/api/User/" + userId,
            method: "GET",
            success: function(userData) {
                console.log(userData)
                // Retrieve selected event ID from URL parameter (Implement this function)
                var eventId = getUrlParameter('eventId');

                // Retrieve selected ticket type
                var selectedType = $('#ticketType').val();

                // Retrieve number of tickets
                var numberOfTickets = parseInt($('#ticketNumbers').val());

                // Fetch event details
                $.ajax({
                    url: "http://localhost:8080/api/TicketCategory/TicketCategories",
                    method: "GET",
                    success: function(categoryData) {

                        // Find the ticket category based on event ID and description
                        var matchingTicketCategory = categoryData.find(function(category) {
                        // console.log(category.event.eventId)
                        // console.log(eventId)
                        // console.log(category.description)
                        // console.log(selectedType)
                        // console.log(null)
                        if (category.event.eventId.toString() === eventId && category.description === selectedType) {
                            return true;
                                    }                   


                        });

                        if (matchingTicketCategory) {
                            var ticketCategoryId = matchingTicketCategory.ticketCategoryId;
                            console.log(matchingTicketCategory)

                            // Calculate total price
                            var totalPrice = numberOfTickets * matchingTicketCategory.price;

                            // console.log(totalPrice)
                            var specificDate = new Date("2023-06-07T21:00:00.000");


                            console.log(specificDate)

                            var orderData = {
                                user: userData,
                                ticketCategory: matchingTicketCategory,
                                totalPrice: totalPrice,
                                orderAt: specificDate,
                                numberOfTickets: numberOfTickets
                                };
                                console.log(new Date())
                                console.log(orderData)
                                var orderDataJSON = JSON.stringify(orderData, null, 2); 
                                console.log(orderDataJSON);
                                $.ajax({
                                url: "http://localhost:8080/api/Order",
                                method: "POST",
                                data: JSON.stringify(orderData),
                                    contentType: "application/json",
                                success: function(response) {
                                    alert("Order created successfully!");
                                    // Redirect to orders page or your desired action
                                    // window.location.href = "orders.html";
                                },
                                error: function(xhr, status, error) {
                                    console.log('Response Body:', xhr.responseText);
                                    console.log('Response Headers:', xhr.getAllResponseHeaders());
                                }
                                });

                            // Now you can proceed with the purchase process using the retrieved data
                            // For example, you can display a summary to the user or perform further actions.
                        } else {
                            alert("Selected ticket category not found for this event.");
                        }
                    },
                    error: function() {
                        alert("Error fetching event data.");
                    }
                });
            },
            error: function() {
                alert("Error fetching user data.");
            }
        });
    }
});

    const ticketInput = $('#ticketNumbers');
            const decrementButton = $('.decrement-button');
            const incrementButton = $('.increment-button');

            decrementButton.on('click', () => {
                if (ticketInput.val() > 0) {
                    ticketInput.val(parseInt(ticketInput.val()) - 1);
                }
            });

            incrementButton.on('click', () => {
                ticketInput.val(parseInt(ticketInput.val()) + 1);
            });

});

    </script>
</body>
</html>
