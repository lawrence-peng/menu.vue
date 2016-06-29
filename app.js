/**
 * Created by lawrence on 11/27/15.
 */

'use strict';

// load native modules
var http = require('http');
var path = require('path');

// load 3rd modules
var koa = require('koa');
var router = require('koa-router')();
var serve = require('koa-static');
var colors = require('colors');

// load local modules
var pkg = require('./package.json');
var env = process.env.NODE_ENV;
var debug = !env || env === 'development';
var viewDir = debug ? 'build' : 'build';
var fetchTool = require('./fetchMenuData');
// load routes
//var routes = require('./routes');

// init framework
var app = koa();

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

// basic settings
app.keys = [pkg.name, pkg.description];
app.proxy = true;

// global events listen
app.on('error', function(err, ctx) {
    err.url = err.url || ctx.request.url;
    console.error(err, ctx);
});

// handle favicon.ico
app.use(function * (next) {
    if (this.url.match(/favicon\.ico$/)) this.body = '';
    yield next;
});

// logger
app.use(function*(next) {
    console.log(this.method.info, this.url);
    yield next;
});

// use routes
//routes(router, app);
//app.use(router.routes());

// handle static files
app.use(serve(path.resolve(__dirname, viewDir), {
    maxage: 0,
    index:'menu.html'
}));

app = http.createServer(app.callback());

app.listen(3000, '0.0.0.0', function() {
    console.log('app listen success,port is 3000');
});
