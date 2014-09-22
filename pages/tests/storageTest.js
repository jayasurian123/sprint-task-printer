YUI({ useBrowserConsole: true }).use("node", "console", "test", function (Y) {
 
  var validation_tests = new Y.Test.Case({ 
    name: "Storage testing", 

    setUp: function () {
      this.storage = new Storage();
    },

    tearDown: function () {
      delete localStorage.sprintTask;
    },

    "if no sprint task state should be empty object": function () {
      this.storage.init();
      Y.Assert.isTrue(_.isEqual([], this.storage.dataStore));
    },
    "if sprint task is there then it should return sprint task": function () {
      var str = '[{"a":1}, {"b":2}]';
      localStorage.sprintTask = str;
      this.storage.init();
      Y.Assert.isTrue(_.isEqual(JSON.parse(str), this.storage.dataStore));
    },
    'retrieve should return entire obj if no index': function () {
      var initial = '[{"a":1}, {"b":2}]';
      var expected = [{"a":1}, {"b":2}];

      localStorage.sprintTask = initial;
      this.storage.init();
      Y.Assert.isTrue(_.isEqual(this.storage.retrieve(), expected));
    },
    'retrieve should return curresponding obj if index is given of null': function () {
      var initial = '[{"a":1}, {"b":2}]';
      var expected = {"b":2};

      localStorage.sprintTask = initial;
      this.storage.init();
      Y.Assert.isTrue(_.isEqual(this.storage.retrieve(1), expected));
      Y.Assert.isTrue(_.isEqual(this.storage.retrieve(3), null));
    },
    'localStorage has empty obj it should be removed': function () {
      var initial = '[{"a":1,"b":2},{},{"c":1,"d":2}]';
      var expected = [{"a":1,"b":2}, {"c":1,"d":2}];
      localStorage.sprintTask = initial;
      this.storage.init();
      Y.Assert.isTrue(_.isEqual(expected, this.storage.dataStore));
    },
    "save should save the state to localStorage": function () {
      var initial = [{"a":1,"b":2}];
      var expected = [{"a":1,"b":2}, {"c":1,"d":2}];

      this.storage.init();
      this.storage.dataStore = initial;
      this.storage.save({"c":1,"d":2});
      var storageStr = localStorage.sprintTask;
      Y.Assert.isTrue(_.isEqual(JSON.parse(storageStr), expected));
    },
    'save should add a new object if no index is specified and return saved index': function () {
      this.storage.init();
      this.storage.dataStore = [{a:1, b:2}, {c:1, d: 2}];
      var index = this.storage.save({e: 1, f: 2});
      Y.Assert.areEqual(index, 2);
      Y.Assert.isTrue(_.isEqual(this.storage.dataStore, [{a:1, b:2}, {c:1, d: 2}, {e: 1, f: 2}]));
    },
    'save should add a new object at specified intex if given and also return saved index': function () {
      this.storage.init();
      this.storage.dataStore = [{a:1, b:2}, {c:1, d: 2}];
      var index = this.storage.save({e: 1, f: 2}, 1);
      Y.Assert.areEqual(index, 1);
      Y.Assert.isTrue(_.isEqual(this.storage.dataStore, [{a:1, b:2}, {e: 1, f: 2}]));
    },
    'remove should make the element empty object': function () {
      this.storage.init();
      this.storage.dataStore = [{a:1, b:2}, {c:1, d: 2}];
      this.storage.remove(1);
      Y.Assert.isTrue(_.isEqual(this.storage.dataStore, [{a:1, b:2}, {}]));
    },
    'remove should save the stage to localStorage': function () {
      var initial = [{"a":1}, {"b":2}];
      var expected = [{"a":1}, {}];

      this.storage.init();
      this.storage.dataStore = initial;
      this.storage.remove(1);
      var storageStr = localStorage.sprintTask;
      Y.Assert.isTrue(_.isEqual(JSON.parse(storageStr), expected));
    },
    'reset would reset the storage': function () {
      this.storage.init();
      this.storage.dataStore = [{a:1, b:2}, {c:1, d: 2}];
      this.storage.reset();
      Y.Assert.isTrue(_.isEqual(localStorage.sprintTask, '[]'));
      Y.Assert.isTrue(_.isEqual(this.storage.dataStore, []));
    }
  });
 
Y.Test.Runner.add(validation_tests); 
Y.Test.Runner.run(); 
});
