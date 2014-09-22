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
