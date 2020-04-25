'use strict';

var messageboard = require('../service/messageboard');

var controllers = {
    sendmessage: function(req, res) {
        messageboard.sendmessage(req, res, function(err, dist) {
           if (err)
               res.send(err);
           res.json(dist);
        });
    },
    readmessages: function(req, res) {
        messageboard.readmessages(req, res, function(err, dist) {
           if (err)
               res.send(err);
           res.json(dist);
        });
    },
    messagedetail: function(req, res) {
        messageboard.messagedetail(req, res, function(err, dist) {
           if (err)
               res.send(err);
           res.json(dist);
        });
    },
    userdetails: function(req, res) {
        messageboard.userdetails(req, res, function(err, dist) {
           if (err)
               res.send(err);
           res.json(dist);
        });
    },
    searchusers: function(req, res) {
        messageboard.searchusers(req, res, function(err, dist) {
           if (err)
               res.send(err);
           res.json(dist);
        });
    },
    searchdetails: function(req, res) {
        messageboard.searchdetails(req, res, function(err, dist) {
           if (err)
               res.send(err);
           res.json(dist);
        });
    }
};

module.exports = controllers;