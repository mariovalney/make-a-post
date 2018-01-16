"use strict";

jQuery.support.cors = true;

jQuery(document).ready(function($) {
    var url = Cookies.get('make_a_post_url'),
        data = Cookies.get('make_a_post_data');

    if (url) {
        $('#api_url').val(url);
    }

    if (data) {
        $('#api_body').val(data);
    }

    $('#api_post').on('submit', function(event) {
        event.preventDefault();

        if ($(this).hasClass('submiting')) { return false; }

        var url = $('#api_url').val(),
            data = $('#api_body').val();

        $(this).addClass('submiting');
        $('#status').text('Submiting...');

        Cookies.set('make_a_post_url', url);
        Cookies.set('make_a_post_data', data);

        data = data.replace( /(\r\n|\n|\r)/gm, '' );
        data = JSON.parse(data);

        $.ajax({
            url: url,
            data: data,
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