var ko = require('knockout');
var _ = require('underscore');


var RetslyReso = window.retsly.reso;
var reso = new RetslyReso('1ee50dbb70a49496f16e4ab71ce29164', 'test_sf');

function ListingsViewModel(listings) {
  this.listings = ko.observableArray([]);
  this.offices = ko.observableArray([]);
  this.members = ko.observableArray([]);
  this.media = ko.observableArray([]);
  this.datasystems = ko.observableArray([]);
  this.inputVal = ko.observable('');
  this.errorText = ko.observable(null);
  this.resourceTypes = ko.observableArray(['Properties','Offices','Members','Media', 'DataSystem']);
  this.mlss = ko.observableArray(['test_sf', 'test_sd', 'abor', 'hiinfo', 'armls']);
  this.mls = ko.observable('test_sf');
  //this.formatTypes = ko.observableArray(['html','json','xml']);
  var self = this;
  this.onResourceChange = function(){
    self.inputVal('');
    self.currentQuery = reso[self.selectedResource()]();
    self.search();
  }
  this.mlsChange = function(){
    reso.setVendor(this.mls())
    self.search();
  }

  this.selectedResource = ko.observable('Properties');
}

ListingsViewModel.prototype.search = function search(){
  var self = this;
  self.errorText(null);
  this.currentQuery = !this.currentQuery ? reso[this.selectedResource()]() : this.currentQuery;
  this.currentQuery.filter(self.inputVal()).findAll(function(err,properties){
    self.onRecords(err,properties)
  });
};
ListingsViewModel.prototype.onRecords = function onRecords(err, records){

  if(err) {
    this.errorText(err.response.text);
    return;
  }
  if(this.selectedResource() === 'Properties')
    this.listings(records);
  else if(this.selectedResource() === 'Offices')
    this.offices(records);
  else if(this.selectedResource() === 'Members')
    this.members(records);
  else if(this.selectedResource() === 'Media')
    this.media(records);
  else if(this.selectedResource() === 'DataSystem')
    this.datasystems(records);
};

ListingsViewModel.prototype.next = function next() {
  var self = this;
  this.currentQuery.next().findAll(function(err,properties){
    self.onRecords(err,properties);
  });
};


reso.PropertiesFactory = function(prop) {
  return new Listing(prop);
};
reso.OfficesFactory = function(prop) {
  return new Office(prop);
};
reso.MembersFactory = function(prop) {
  return new Member(prop);
};
reso.MediaFactory = function(prop) {
  return new Media(prop);
};
reso.DataSystemFactory = function(prop) {
  return new DataSystem(prop);
};


function BaseResource(src){
  this._source = src;
  var self = this;
  this.fields = ko.observableArray([]);
  _.each(src, function(v, k){
    self.fields.push(
      {
        name: ko.observable(k),
        type: ko.observable(typeof v),
        value: ko.observable(v)
      }
    )
    if(Array.isArray(v)){
      self[k] = ko.observableArray(v);
    }
    else {
      self[k] = ko.observable(v);
    }
  });
}

function Listing(src){
  var self = this;
  BaseResource.call(this, src);
  self.imageUrl  = ko.observable(null);
  reso.Media().filter('ResourceRecordKey eq \'' + self.ListingKey() + '\'').findAll(function(err,media){
    if(media.length > 0 ) self.imageUrl(media[0].MediaURL());
  });
}

Listing.prototype = new BaseResource();
Listing.prototype.constructor = BaseResource;



function Office(src){
  BaseResource.call(this, src);
}
Office.prototype = new BaseResource();
Office.prototype.constructor = BaseResource;


function Member(src) {
  BaseResource.call(this, src);
}
Member.prototype = new BaseResource();
Member.prototype.constructor = BaseResource;

function Media(src){
  BaseResource.call(this, src);
}
Media.prototype = new BaseResource();
Media.prototype.constructor = BaseResource;


function DataSystem(src){
  var self = this;
  BaseResource.call(this, src);
  _.each(this.Resources(), function(res) {
    _.each(res, function(v,k){
      self.fields.push(
        {
          name: ko.observable('Resource.'+k),
          type: ko.observable(typeof v),
          value: ko.observable(v)
        }
      )});
  });
}
DataSystem.prototype = new BaseResource();
DataSystem.prototype.constructor = BaseResource;

var mainVM = new ListingsViewModel([]);
ko.applyBindings(mainVM);
setTimeout(function(){mainVM.search()},100);
