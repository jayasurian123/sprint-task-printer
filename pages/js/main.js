var storage = new Storage();
storage.init();

if (storage.dataStore) {
  storage.dataStore.forEach(function (obj, index) {
    addTaskCard(obj, index);
  });
}

document.getElementById('addTask').addEventListener('click', addTask);
document.getElementById('print').addEventListener('click', printTask);
document.getElementById('container').addEventListener('click', clickHandler);
document.getElementById('go').addEventListener('click', searchHandler);

window.onload = function () {
  var obj = JSON.parse(localStorage.sprintCredentials);

  document.getElementById('search').value = getQueryData('search') || obj.search;
  document.getElementById('token').value = getQueryData('token') || obj.token;
  document.getElementById('project-id').value = getQueryData('projectId') || obj.projectId;
};

function searchHandler (e) {
  e.preventDefault();
  var obj = JSON.parse(localStorage.sprintCredentials);
  obj.search = document.getElementById('search').value || getQueryData('search') || obj.search;
  obj.token = document.getElementById('token').value || getQueryData('token') || obj.token;
  obj.projectId = document.getElementById('project-id').value || getQueryData('projectId') || obj.projectId;

  localStorage.sprintCredentials = JSON.stringify(obj);
  loadFromPivotal(obj);
}


function getQueryData (key) {
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
};

function clickHandler (e) {
  e.preventDefault();
  var target = e.target || e.srcElement;

  while(target != e.currentTarget) {
    
    switch (target.className) {
      case 'close':
        removeTask(target);
        return;
      case 'task-container':
        editTask(target);
        return;
    }
    target = target.parentNode;
  }
}

function editTask (target) {
  var index = target.getAttribute('data-index');
  var obj = storage.retrieve(index);

  if (obj) {
    document.getElementById('header').value = obj.title;
    document.getElementById('points').value = obj.points
    document.getElementById('category').value = obj.category;
    document.getElementById('desc').value = obj.desc;
  }
}

function removeTask (target) {
  var taskContainer = target.parentNode;
  taskContainer.parentNode.removeChild(taskContainer);
  var index = taskContainer.getAttribute('data-index') * 1;
  storage.remove(index);
}

function printTask (e) {
  e.preventDefault();
  var formNode = document.getElementById('printMe');
  formNode.parentNode.removeChild(formNode);
  window.print();
}

function addTask (e) {
  e.preventDefault();

  var obj = {
    title: document.getElementById('header').value,
    points: document.getElementById('points').value,
    category: document.getElementById('category').value,
    desc: document.getElementById('desc').value
  };

  var index = storage.save(obj);
  addTaskCard(obj, index);
}

function loadFromPivotal (data) {
  pivotalService.executeTrackerApiFetch(data, function (results) {
    var index;
    results.forEach(function (val) {
      var obj = {};
      obj.title = val.name;
      obj.points = val.estimate || '__';
      obj.category = val.story_type;
      obj.desc = (val.description) ? val.description.substring(0, 155) : '';

      index = storage.save(obj);
      addTaskCard(obj, index);
    });
  });
}

function addTaskCard (obj, index) {
  var template = '<div class="task-container" data-index="{{index}}">' +
    '<span class="close"> X </span>' +
    '<h4>{{title}}<span class="points">{{points}}</span></h4>' +
    '<p>{{desc}}</p>' +
    '<div class="category">{{category}}</div>' +
  '</div>';
  
  template = template.replace('{{index}}', index) ;
  template = template.replace('{{title}}', obj.title) ;
  template = template.replace('{{points}}', obj.points);
  template = template.replace('{{category}}', obj.category);
  var desc = obj.desc.replace(/\n/g, '</p><p>');
  template = template.replace('{{desc}}', desc);

  document.getElementById('container').insertAdjacentHTML('beforeend', template);

}
