# reso-js-sdk

Using ./pubic/reso.js we exposed window.retsly.reso for simplicity
```
var RetslyReso = window.retsly.reso;
var reso = new RetslyReso('{MY_TOKEN}', 'abor');
reso.Properties().filter('ListPrice gt 500000').findAll(function(err,properties){
    if(err) throw err;
    //do something with properties
});
```

If you want to pre-populated your response with your own custon prototypes
create a reso.[RESOURCE + 'Factory] funciton
```
function Listing(src){
  this.src = src;
}

reso.PropertiesFactory = function(prop) {
  return new Listing(prop);
};
```
Checkout our test app here :
http://retsly.github.io/reso-js-sdk/
