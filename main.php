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
        }
        table, th, td {
            border: 1px solid #343941;
        }
        #back_button {
            position: absolute;
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
            font-family: monospace;
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
    </style>
    <script>
        $(document).ready(function() {
            var url_string = window.location.href;
            var url = new URL(url_string);
            var param = url.searchParams.get("eventId");

            $.ajax({
                url: "http://localhost:8080/api/Event/" + param,
                method: "GET",
                success: function(data) {
                    const mainImage = `<img src="images/${data.eventName}.jpg" alt="Event Image" class="event-image"/>`;
                    // Here you can use 'mainImage' as needed in your HTML content.
                },
                error: function(xhr, status, error) {
                    console.error('Failed to fetch event data:', error);
                }
            });
        });
    </script>
</head>
<body>
    <a id="back_button" href="index.html">Back to Events</a>
    <div id="event_details">
        <h1>Event Details</h1>
        <div id="mainImageContainer">
            <!-- 'mainImage' will be inserted here -->
        </div>
        <p>More event details can go here...</p>
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
                    var mainImage = '<img src="images/' + data.eventName + '.jpg" alt="Event Image" class="event-image" />';
                    // Insert 'mainImage' into the 'mainImageContainer' div
                    $('#mainImageContainer').html(mainImage);
                },
                error: function(xhr, status, error) {
                    console.error('Failed to fetch event data:', error);
                }
            });
        });
    </script>
</body>
</html>
