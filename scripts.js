"use strict";

jQuery.support.cors = true;

jQuery(document).ready(function($) {
    var url = Cookies.get('make_a_post_url'),
        data = Cookies.get('make_a_post_data'),
        editor = ace.edit( 'api_body_editor' );

    // Cookies
    if (url) $('#api_url').val(url);
    if (data) $('#api_body').val(data);

    // Ace Editor
    $('#api_body').hide();
    editor.setShowPrintMargin(false);
    editor.getSession().setMode( 'ace/mode/json' );
    editor.getSession().setValue($('#api_body').val());
    editor.getSession().on('change', function() {
        $('#api_body').val(editor.getSession().getValue());
    });

    // Request
    $('#api_post').on('submit', function(event) {
        event.preventDefault();

        if ($(this).hasClass('submiting')) { return false; }

        var url = $('#api_url').val(),
            data = $('#api_body').val();

        if (!data) {
            alert( 'You cannot submit a empty JSON' );
            return false;
        }

        var json_data = '';
        try {
            json_data = data.replace( /(\r\n|\n|\r)/gm, '' );
            json_data = JSON.parse(json_data);
        } catch(e) {
            alert( 'The data is not a valid JSON.' );
            return false;
        }

        // Saving Cookies
        Cookies.set('make_a_post_url', url);
        Cookies.set('make_a_post_data', data);

        $(this).addClass('submiting');
        $('#status').text('Submiting...');

        $.ajax({
            url: url,
            data: json_data,
            type: 'POST',
            dataType: 'JSON',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
        })
        .always(function(response) {
            $('#api_post').removeClass('submiting');
            $('#status').text('Done.');

            console.log(response);
            if (typeof response.responseText == 'undefined') {
                response.responseText = '';
            }

            $('#result_status').text(response.status + ' - ' + response.statusText);
            $('#result_content').html(response.responseText);
        });
    });
});