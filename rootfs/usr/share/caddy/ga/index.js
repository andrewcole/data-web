
function showSpinner() {
  $("#table_body").html('<tr><td colspan="9" class="align-middle"><div class="d-flex justify-content-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div></td></tr>');
}

function fetchData(next) {
  $.ajax({
    type: "GET",
    url: "https://data.coley.au/api/v1/galog/log.json?_labels=on&_size=10&_next=" + next,
    dataType: "json"
  }).success(function (result, status, xhr) {
    if (next === 0) {
      $("#table_body").html('');
    }
    var table_body = $("#table_body").html();
    result.rows.forEach(flight => {
      table_body += '<tr class="table">'
      table_body += '<td><i class="fa-solid fa-plane"></i></td>'
      table_body += '<td>' + flight[0] + '</td>'
      table_body += '<td>' + flight[1] + '</td>'
      table_body += '<td>' + flight[2] + '</td>'
      table_body += '<td>' + flight[3] + '</td>'
      table_body += '<td>' + flight[4] + '</td>'
      table_body += '<td>' + flight[5] + '</td>'
      table_body += '<td>' + flight[6] + '</td>'
      table_body += '<td>' + (flight[7] ?? '0.0') + '</td>'
      table_body += '<td>' + (flight[8] ?? '0.0') + '</td>'
      table_body += '<td>' + (flight[9] ?? '0.0') + '</td>'
      table_body += '<td>'
      if (flight[10]) {
        table_body += '<a href="' + flight[10] + '"><i class="fa-solid fa-blog"></i></a>'
      }
      if (flight[11]) {
        table_body += '<a href="' + flight[11] + '"><i class="fa-solid fa-image"></i></a>'
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