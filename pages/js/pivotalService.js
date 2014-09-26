var pivotalService = new function () { 

  this.executeTrackerApiFetch = function (params, cb) {
    cb = cb || function () {};
    // get parameters
    // localStorage.sprintCredentials = '{"projectId": 597827, "search": "test", "token": "d1be4e1d5b947e7abc17571b7a969ba4"}';
    var data = JSON.parse(localStorage.sprintCredentials);
    // var data = this.getQueryPrameters();
    // compose request URL
    var filter = 'filter=state:delivered,finished,rejected,started,unstarted,unscheduled'
    if (data.search) {
      filter += '"' + data.search + '"';
    };
    var url = 'https://www.pivotaltracker.com/services/v5';
    url += '/projects/' + data.projectId;
    url += '/stories?';
    url += filter;
    url += '&limit=20';

    // do API request to get story names
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-TrackerToken', data.token);
    xhr.onreadystatechange = handler;
    xhr.send();

    function handler() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var response = this.responseText;
          cb(JSON.parse(response));
        } else {
          console.log('error');
        }
      } else {
        console.log("currently the application is at" + this.readyState);
      }
    }
  }
};

