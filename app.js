var totalLog = localStorage.totalLog ? JSON.parse(localStorage.totalLog) : [];

function Session(start, end, memo) {
  this.start = start;
  this.end = end || null;
  this.memo = memo || '';
}

function renderSession(session) {
  var tr = '<tr>';
  tr += '<td>' + moment(session.start).format('ddd, D MMM YYYY') + '</td>';
  tr += '<td>' + moment(session.start).format('h:mm a') + '</td>';
  tr += '<td>' + moment(session.end).format('h:mm a') + '</td>';
  tr += '<td>' + session.memo + '</td>';
  tr += '</tr>';
  $('#log-table').prepend(tr);
}

$('#input-form').on('submit', function(event) {
  event.preventDefault();
  var currentSession = JSON.parse(localStorage.getItem('currentSession'));
  if (!currentSession) {
    // start a new session
    var newSession = new Session(moment());
    localStorage.setItem('currentSession', JSON.stringify(newSession));
    $('#session-started').text('Current session started on ' + moment().format('ddd, D MMM YYYY') + ' at ' + moment().format('h:mm a'));
    // set the punch button to "end"
    $('#input-memo').show();
    $('#input-punch').val('Punch Out');
  } else {
    // complete the session in progress and render it
    currentSession.end = moment();
    currentSession.memo = $('#input-memo').val() || '';
    renderSession(currentSession);
    localStorage.removeItem('currentSession');
    $('#session-started').text('No session currently in progress');
    // add the completed session to the log and persist the entire log
    totalLog.push(currentSession);
    localStorage.setItem('totalLog', JSON.stringify(totalLog));
    // reset the punch button
    $('#input-memo').val('').hide();
    $('#input-punch').val('Punch In');
  }
});

function renderLog(data) {
  if (typeof data === 'string') data = JSON.parse(data);
  if (data.length) {
    data.forEach(function(session) {
      renderSession(session);
    });
    $('#export')
      .attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(localStorage.totalLog))
      .attr('download', 'timelog.json');
  }
}

$('#file-import').on('change', function(event) {
  var file = event.target.files[0];
  if (file.type.match(/json.*/)) {
    var reader = new FileReader();
    reader.onload = function(e) {
      renderLog(reader.result);
    };
    reader.readAsText(file);
  } else {
    alert('File not supported.');
  }
});

if (localStorage.currentSession) {
  var currentSession = moment(JSON.parse(localStorage.getItem('currentSession')));
  $('#session-started').text('Current session started on ' + currentSession.start.format('ddd, D MMM YYYY') + ' at ' + currentSession.start.format('h:mm a'));
  $('#input-memo').show();
  $('#input-punch').val('Punch Out');
} else {
  $('#session-started').text('No session currently in progress');
  $('#input-memo').hide();
  $('#input-punch').val('Punch In');
}

renderLog(totalLog);
