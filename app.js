var totalLog = localStorage.totalLog ? JSON.parse(localStorage.totalLog) : [];

function Session(date, start, end, memo) {
  this.date = date;
  this.start = start;
  this.end = end || null;
  this.memo = memo || '';
}

function renderSession(session) {
  var tr = '<tr>';
  tr += '<td>' + session.date + '</td>';
  tr += '<td>' + session.start + '</td>';
  tr += '<td>' + session.end + '</td>';
  tr += '<td>' + session.memo + '</td>';
  tr += '</tr>';
  $('#log-table').prepend(tr);
}

$('#input-form').on('submit', function(event) {
  event.preventDefault();
  var currentSession = JSON.parse(localStorage.getItem('currentSession'));
  if (!currentSession) {
    // start a new session
    var newSession = new Session(
      moment().format('ddd, D MMM YYYY'),
      moment().format('h:m a')
    );
    localStorage.setItem('currentSession', JSON.stringify(newSession));
    $('#session-started').text('Current session started on ' + moment().format('ddd, D MMM YYYY') + ' at ' + moment().format('h:m a'));
    // set the punch button to "end"
    $('#input-memo').show();
    $('#input-punch').val('Punch Out');
  } else {
    // complete the session in progress and render it
    currentSession.end = moment().format('h:m a');
    currentSession.memo = $('#input-memo').val() || '';
    renderSession(currentSession);
    localStorage.removeItem('currentSession');
    $('#session-started').text('No session currently in progress');
    // add the completed session to the log and persist the entire log
    totalLog.push(currentSession);
    localStorage.setItem('totalLog', JSON.stringify(totalLog));
    // reset the punch button
    $('#input-memo').hide();
    $('#input-punch').val('Punch In');
  }
});

if (totalLog.length) {
  totalLog.forEach(function(session) {
    renderSession(session);
  });
}

if (localStorage.currentSession) {
  var currentSession = JSON.parse(localStorage.getItem('currentSession'));
  $('#session-started').text('Current session started on ' + currentSession.date + ' at ' + currentSession.start);
  $('#input-memo').show();
  $('#input-punch').val('Punch Out');
} else {
  $('#session-started').text('No session currently in progress');
  $('#input-memo').hide();
  $('#input-punch').val('Punch In');
}
