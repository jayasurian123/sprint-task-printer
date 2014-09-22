function Storage () {

  this.dataStore = null;

  function init () {
    if (!localStorage.sprintTask) {
      localStorage.sprintTask = '[]';
    }
    this.dataStore = getFromLocalStorage();
  }

  function retrieve (index) {
    if (!index) { // no index return entire data
      return this.dataStore;
    } 
    if (this.dataStore[index]) { // if index is present return that
      return this.dataStore[index];
    } 
    return null;
  }

  function save (obj, index) {
    var savedIndex;
    if (index) {
      savedIndex = index;
      this.dataStore[index] = obj;
    } else {
      savedIndex = this.dataStore.length;
      this.dataStore.push(obj);
    }
    saveToLocalStorage(this.dataStore);
    return savedIndex;
  }

  function remove (index) {
    this.dataStore[index] = {};
    saveToLocalStorage(this.dataStore);
  }

  function saveToLocalStorage (data) {
    localStorage.sprintTask = JSON.stringify(data);
  }

  function getFromLocalStorage () {
    var data = JSON.parse(localStorage.sprintTask);
    return _.filter(data, function (obj) {
      return !_.isEmpty(obj);
    });
  }

  function reset () {
    delete localStorage.sprintTask;
    this.init();
  }

  this.init = init;
  this.retrieve = retrieve;
  this.save = save;
  this.remove = remove;
  this.reset = reset;

  this.getFromLocalStorage = getFromLocalStorage;
  this.saveToLocalStorage = saveToLocalStorage;
}
