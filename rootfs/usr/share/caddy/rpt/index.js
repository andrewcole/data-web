function simplifiedMilliseconds(milliseconds) {
    const totalSeconds = parseInt(Math.floor(milliseconds / 1000));
    const totalMinutes = parseInt(Math.floor(totalSeconds / 60));
    const hours = parseInt(Math.floor(totalMinutes / 60));
    const minutes = parseInt(totalMinutes % 60);
    if (minutes < 10) {
        time = `${hours}:0${minutes}`;
    } else {
        time = `${hours}:${minutes}`;
    }
    return time;
}

function showSpinner() {
    $("#table_body").html('<tr><td colspan="9" class="align-middle"><div class="d-flex justify-content-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div></td></tr>');
}

function fetchData(next) {
    $.ajax({
        type: "GET",
        url: "https://data.coley.au/api/v1/rptlog/log.json?_labels=on&_size=10&_next=" + next,
        dataType: "json"
    }).success(function (result, status, xhr) {
        if (next === 0) {
            $("#table_body").html('');
        }
        var table_body = $("#table_body").html();
        result.rows.forEach(flight => {
            table_body += '<tr class="table">'
            table_body += '<td><i class="fa-solid fa-plane"></i></td>'
            table_body += '<td>' + flight[4].substring(0,10) + '</td>'
            table_body += '<td>' + flight[0] + '</td>'
            table_body += '<td>' + flight[1] + '</td>'
            table_body += '<td>' + flight[2] + '-' + flight[3] + '</td>'
            table_body += '<td>' + flight[4].substring(11,16) + '</td>'
            table_body += '<td>' + simplifiedMilliseconds((new Date(flight[5])) - new Date(flight[4])) + '</td>'
            table_body += '<td>'
            if (flight[6]) {
                table_body += flight[6]
            }
            if (flight[6] && flight[7]) {
                table_body += ' '
            }
            if (flight[7]) {
                table_body += flight[7]
            }
            table_body += '</td>'
            table_body += '</tr>';
            $("#table_body").html(table_body);
        })
        if (result.next) {
            fetchData(result.next)
        }
    }).fail(function (xhr, status, error) {
        console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    });
};

$(document).ready(function () {
    showSpinner();
    fetchData(0)
});