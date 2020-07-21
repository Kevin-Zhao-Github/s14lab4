'use strict';

let data = [];
let bars = null;
let donut = null;
let scatter = null;

d3.json('/load_data').then(d => {

    data = d.users;
    d3.select('#users').append('span').text(data.length);

    bars = new Bars(data, 'vis1');
    donut = new Donut(data, 'vis2');
    scatter = new Scatter(data, 'vis3');

}).catch(err => console.log(err));