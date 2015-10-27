var _ = require('underscore');
var http = require('superagent');

function RetslyReso(token, vendor){
  this.token = token;
  this.vendor = vendor;
}

window.retsly = {
  reso: RetslyReso
}

RetslyReso.prototype.setVendor = function setVendor(vendor){
  this.vendor = vendor;
}

RetslyReso.prototype.Media = function Properties(){
  return new ResoQuery(this, 'Media');
};

RetslyReso.prototype.Members = function Properties(){
  return new ResoQuery(this, 'Members');
};

RetslyReso.prototype.Offices = function Properties(){
  return new ResoQuery(this, 'Offices');
};

RetslyReso.prototype.DataSystem = function Properties(){
  return new ResoQuery(this, 'DataSystem');
};

RetslyReso.prototype.Properties = function Properties(){
  return new ResoQuery(this, 'Properties');
};

RetslyReso.prototype.Media = function Media(){
  return new ResoQuery(this,'Media');
};

function ResoQuery(retsly,resource){
  this.retsly = retsly;
  this.resource = resource;
  this.baseUrl = 'https://rets.io/api/v1/';
  this.options = {$format: 'json', $top : 10, $skip: 0};
}

ResoQuery.prototype.filter = function(filter){
  this.options.$filter = filter;
  return this;
}

ResoQuery.prototype.next = function(filter){
  this.options.$skip += this.options.$top;
  return this;
}
ResoQuery.prototype.prev = function(filter){
  this.options.$skip += -this.options.$top;
  this.options.$skip = this.options.$skip > 0  ? this.options.$skip : 0;
  return this;
}

ResoQuery.prototype.findAll = function(cb) {
  this.exec(this.getURL(), cb);
}

ResoQuery.prototype.getURL = function() {
  return this.baseUrl + this.retsly.vendor + '/RESO/oData/' + this.resource;
}

ResoQuery.prototype.exec = function(url, cb){
  var urlArgs = [];
  _.each(this.options, function(v,k){
    urlArgs.push(k+'='+decodeURI(v));
  });
  var self = this;
  http('GET', url + '?' + urlArgs.join('&'))
    .set('Authorization', 'Bearer ' + this.retsly.token)
    .set('X-Requested-With', 'XMLHttpRequest')
    .end(function(err, resp){
      if(err) return cb(err);
      var resources = [];
      _.each(resp.body.value, function(src){
        resources.push(src);
      })
      var factory = self.retsly[self.resource+'Factory'];
      if(factory) {
        resources = _.map(resources, function(r){
          return new factory(r);
        });
      }
      cb(null, resources);
    });
};
