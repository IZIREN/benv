var benv = require('../');
var should = require('should');

afterEach(function() {
  benv.teardown();
});

describe('benv.setup', function() {
  
  it('exposes browser globals', function(done) {
    benv.setup(function(){
      should.exist(navigator.userAgent);
      should.exist(document);
      done();
    });
  });
  
  it('exposes passed globals', function(done) {
    benv.globals = function() {
     return { App: { Models: {} } };
    };
    benv.setup(function(){
      should.exist(App.Models);
      done();
    });
  });
});

describe('benv.teardown', function() {
  
  it('removes globals', function(done) {
    benv.setup(function(){
      should.exist(navigator);
      benv.teardown();
      (typeof navigator).should.equal('undefined');
      done();
    });
  });
});

describe('benv.require', function() {
  
  it('can require a non-commonjs module', function(done) {
    benv.setup(function(){
      var $ = benv.require('./libs/zepto.js', 'Zepto');
      should.exist($.ajax);
      done();
    });
  });
  
  it('can require a non-commonjs module that doesnt even export to window', function(done) {
    benv.setup(function(){
      var nowin = benv.require('./libs/no-window.js', 'NoWindow');
      nowin().should.include("I don't even explicitly export to window");
      done();
    });
  });
});


describe('benv.render', function() {
  
  it('renders jade templates', function(done) {
    benv.setup(function(){
      var $ = benv.require('./libs/zepto.js', 'Zepto');
      benv.render(__dirname + '/libs/template.jade', {}, function() {
        $('body').html().should.include('Hello World')
        done();
      });
    });
  });
  
  it('renders just the body from the template', function(done) {
    benv.setup(function(){
      var $ = benv.require('./libs/zepto.js', 'Zepto');
      benv.render(__dirname + '/libs/template.jade', {}, function() {
        $('body').html().should.equal('<h1>Hello World</h1><h2>Ima Template</h2>');
        done();
      });
    });
  });
  
  it('removes script tags', function(done) {
    benv.setup(function(){
      var $ = benv.require('./libs/zepto.js', 'Zepto');
      benv.render(__dirname + '/libs/template.jade', {}, function() {
        $('body').html().should.not.include('script');
        done();
      });
    });
  });
});

describe('benv.requireWithJadeify', function() {
  
  it('rewires jadeify templates to work in node', function() {
    var html = benv.requireWithJadeify('./libs/jadeify.js', ['tmpl'])();
    html.should.include('A foo walks into a bar');
  });
});