(function () {
    "use strict";
    var $global     = new Function("return this")();
    var $callbacks  = {};
    var $bindable   = function( $event ) {
        var $el         = this,
            $eventId    = $el.getAttribute('data-bindable');

        if ( $eventId in $callbacks ) {
            $callbacks[$eventId].forEach(function ( $callback ) {
                var $timerId; $timerId = setTimeout(function () {
                    $callback.call( $el, $eventId, $event );
                    clearTimeout($timerId);
                });
            });
        }
    };
    var $bind       = function( $eventId, $callback ) {
        if ( ! ($callbacks[$eventId] instanceof Array)) {
            $callbacks[$eventId] = [];
        }

        $callbacks[$eventId].push($callback);
    };
    var $bindIMEvent = function( $eventId, $callback ) {
        /*
         * 
         * this code is written by reference to github:hnakamur's code
         * Repository   (Github): https://github.com/hnakamur/jquery.japanese-input-change/
         * License      (MIT):    https://github.com/hnakamur/jquery.japanese-input-change/blob/master/LICENSE
         * 
         */
        var ready       = true,
            isFirefox   = navigator.userAgent.indexOf('Firefox') != -1,
            beforeValue = null,
            calling     = function ( $el, $eventId, $event ) {
                $callback.call( $el, $eventId, $event );
            }
        ;

        var wrapper     = function ( $eventId, $event ) {
            var $el     = this,
                $type   = $event.type.toLowerCase();

            switch ( $type ) {
                case 'focus':
                    beforeValue = $el.textContent;
                    ready       = true;
                    break;
                case 'blur':
                    break;
                case 'keyup':
                    if ( $event.which == 13 || isFirefox ) {
                        ready = true;
                    }

                    if ( ready ) {
                        calling( $el, $eventId, $event );
                    }

                    break;
                case 'keydown':
                    ready = ( isFirefox ) ? false : ( $event.which != 229 ) ;
                break;
            }

            if ( $type === 'focus' ) {
                beforeValue = $el.textContent;
                ready       = true;
            }
        };

        $bind( $eventId, wrapper );
    };

    $bindable.bind = $bind;
    $bindable.bindIMEvent = $bindIMEvent;

    $global.$bindable = $bindable;
})();

