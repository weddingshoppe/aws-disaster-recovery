'use strict';

var expect = require('chai').expect;
var Seeds = require('../lib/cli');
var join = require('path').join;

var mc;
var cli;
var help;
var attrs;
var aliasesClass;
var emberActual;
var emberExpected;
var sailsActual;
var sailsExpected;

describe('Awsdr', function () {
    it('should return a function', function () {
        expect(Seeds).to.be.a('function');
    });

    //it('should have a default configuration', function() {
    //    cli = new Seeds();
    //    expect(cli.config.sails.name).to.equal('api');
    //    expect(cli.config.sails.port).to.equal('1776');
    //    expect(cli.config.ember[0].name).to.equal('frontend');
    //    expect(cli.config.ember[0].port).to.equal('4200');
    //    expect(cli.config.debug).to.equal(false);
    //});
});