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
            </div>
        </div>
    </div>
    <script>
        $(document).ready(function() {
            var url_string = window.location.href;
            var url = new URL(url_string);
            var param = url.searchParams.get("eventName");

            $.ajax({
                url: "http://localhost:8080/api/Event/" + param,
                method: "GET",
                success: function(data) {
                    // Set the background image of mainImageContainer
                    $('#mainImageContainer').css('background-image', `url('images/${data.eventName}.jpg')`);
                    
                    // Set the event name and description
                    $('#eventName').text(data.eventName);
                    $('#eventDescription').text(data.eventDescription);
                    
                    // Display the eventDetails div
                    $('#eventDetails').css('display', 'block');
                },
                error: function(xhr, status, error) {
                    console.error('Failed to fetch event data:', error);
                }
            });
        });
    </script>
</body>
</html>
