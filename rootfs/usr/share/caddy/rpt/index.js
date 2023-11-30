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

function fetchData(after) {
    $.ajax({
        type: "POST",
        url: "https://data.coley.au/graphql/rptlog",
        contentType: "application/json",
        data: JSON.stringify({
            query:  `{
                flight(first:10, after:"${after}") {
                  totalCount
                  edges {
                    node {
                      trip_id {
                        title
                      }
                      flight
                      origin_id {
                        iata
                      }
                      destination_id {
                        iata
                      }
                      start
                      end
                      aircraft_id {
                        registration
                        type_id {
                          name
                        }
                        aircraftlink_list {
                          nodes {
                            href
                            icon
                          }
                        }
                      }
                    }
                  }
                  pageInfo {
                    endCursor
                    hasNextPage
                  }
                }
              }`
        }),
        dataType: "json"
    }).success(function (result, status, xhr) {
        if (after === 0) {
            $("#table_body").html('');
        }
        var table_body = $("#table_body").html();
        result.data.flight.edges.forEach(flight => {
            table_body += '<tr class="table">'
            table_body += '<td><i class="fa-solid fa-plane"></i></td>'
            table_body += '<td>' + flight.node.start.substring(0,10) + '</td>'
            table_body += '<td>' + flight.node.trip_id.title + '</td>'
            table_body += '<td>' + flight.node.flight + '</td>'
            table_body += '<td>' + flight.node.origin_id.iata + '-' + flight.node.destination_id.iata + '</td>'
            table_body += '<td>' + flight.node.start.substring(11,16) + '</td>'
            table_body += '<td>' + simplifiedMilliseconds((new Date(flight.node.end)) - new Date(flight.node.start)) + '</td>'
            if (flight.node.aircraft_id)
            {
                table_body += '<td>' + (flight.node.aircraft_id.registration ?? '') + '</td>'
                table_body += '<td>' + flight.node.aircraft_id.type_id.name + '</td>'
            }
            else
            {
                table_body += '<td></td><td></td>'
            }

            table_body += '<td>'
            if (flight.node.aircraft_id)
            {
                flight.node.aircraft_id.aircraftlink_list.nodes.forEach(link => {
                    table_body += '<a href="' + link.href + '" target="_blank"><img src="' + link.icon + '" alt="' + link.href + '" style="padding-top: 0px; padding-bottom: 0px; padding-left: 0px; display: block; padding-right: 0px;" height=24px width=24px></a>'
                })
            }
            table_body += '</td>'
            table_body += '</tr>';
            $("#table_body").html(table_body);
        })
        if (result.data.flight.pageInfo.hasNextPage) {
            fetchData(result.data.flight.pageInfo.endCursor)
        }
    }).fail(function (xhr, status, error) {
        console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
    });
}

$(document).ready(function () {
    showSpinner();
    fetchData(0)
});