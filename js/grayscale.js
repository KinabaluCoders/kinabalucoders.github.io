/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Google Maps Scripts
// When the window has finished loading create our google map below
/* google.maps.event.addDomListener(window, 'load', init); */

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(40.6700, -73.9400), // New York

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image = 'img/map-marker.png';
    var myLatLng = new google.maps.LatLng(40.6700, -73.9400);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });
}

jQuery(document).ready(function($){
    var $form = $("#slack-autoinvite");
    var $response = $("#slack-response");

    function reveal_invite()
    {
        $form.slideDown();
        $response.slideUp();
    }

    reveal_invite();

    function update_response(html)
    {
        $response.html(html);
        $response.find(".reveal").click(function(e){
            reveal_invite();
            return false;
        });
    }

    $form.submit(function()
    {
        var url = "http://slack.sabah.io/team-invite.php?RETURN=jsonp&callback=?";
        $.ajax({
            dataType: "jsonp",
            url: url,
            data: $("#slack-autoinvite").serialize(),
            beforeSend:function()
            {
                $form.find("input").prop("disabled", true);
                $form.slideUp();
                $response.text("Give us a moment...").slideDown();
            },
            success: function(data)
            {
                if(data.ok)
                {
                    update_response('Thank you! An invitation has been sent. <a href="#" class="reveal">Invite others!</a>');
                    $form.find("[type=email]").val("");
                }
                else
                {
                    if(data.error)
                    {
                        switch(data.error)
                        {
                            case "already_in_team":
                                update_response('You are already in the Slack team! <a href="#" class="reveal">Invite others!</a>');
                                $form.find("[type=email]").val("");
                                break;
                            case "already_invited":
                                update_response('Invitation already sent. <a href="#" class="reveal">Perhaps another email?</a>');
                                $form.find("[type=email]").val("");
                                break;
                            case "invalid_email":
                                update_response('Whoaaahhh! That email looks invalid. <a href="#" class="reveal">Try retyping it?</a>');
                                $form.find("[type=email]").val("");
                                break;
                            default:
                                update_response('Unrecognised error! Something about "' + data.error + '" <a href="#" class="reveal">Try again?</a>');
                        }
                    }
                    else
                    {
                        update_response('The server returned an invalid response. <a href="#" class="reveal">Please try again.</a>');
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                update_response('Whoops! Something went wrong. <a href="#" class="reveal">Please try again.</a>');
            },
            complete: function()
            {
                $form.find("input").prop("disabled", false);
            }
        });
        return false; // avoid to execute the actual submit of the form.
    });
});