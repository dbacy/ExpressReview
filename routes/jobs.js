"use strict";

var express = require('express');

var router = module.exports = express.Router();

//let jobList = require('./jobs.json');                               //  load the jobs module
var jobList = require("C:/Projects/SD105-javaScript/ExpressReview/jobs.json");

//  Just a test to bring up the page. If you enter /final in the browser it should list all jobs.
router.get('/', function (req, res) {
    res.render('jobs', {
        jobs: jobList,
        average: 0,
        title: "All Jobs"
    });
});


//  TODO 0 - just for fun. A check to see if the code works
//  Use this URL
//      http://localhost:3000/jobs/check/10                                                 //   \10 will give me the job in spot 10 
//  The 10th job will be listed. change the number to show other jobs.
router.get('/check/:check', function (req, res) {
    res.send(jobList[req.params.check]);
});


//  Here is your endpoint needed to service the request from the POST request from the little mini form
router.post('/search', function (req, res) {
    //  TODO 1 - (6 pts) you need FIVE variables to do the following
    //  create your variables here

    //  TODO 1A you need another variable to hold the category entered by the user
    let category = req.body.category;

    //  TODO 1B you need a variable to hold the city entered by the user
    let city = req.body.city

    //  TODO 1C you need an array for the jobs that were found by your code
    var foundJobs = [];

    //  TODO 1D you need the average salary for the list of jobs being returned. This one is here for you already

    // let pay = jobList.filter(function(job) {
    //     return job.Salary
    // });
    // let average = pay.reduce(function(acc, score) {
    //     return (acc + score) / jobList
    // })
    //    average = foundJobs.reduce((tot, job) => job.Salary + tot, 0) / foundJobs.length;

    //  TODO 1E you need a title for the page - "Jobs", "Jobs for Managers in Dallas", "Jobs in Fort Worth"
    let title = "Jobs"

    //  TODO 2 - (40 pts) List of things to do
    //      TODO A - IF the category and city fields are empty THEN list ALL jobs
    foundJobs = jobList
    //      TODO B - IF the category and city fields BOTH have data then THEN list all jobs for that city for that category
    if (category != 0 && city != 0) {
        foundJobs = jobList.filter(cj => cj.Category == category && cj.city == city)
    }
    //      TODO C - IF the category field has data THEN list all jobs in that category
    if (category.length != 0 && city == "") {
        foundJobs = jobList.filter(c => c.Category == category)
    }
    //      TODO D - IF the city field has data THEN list all jobs in that city
    if (city.length != 0 && category == "") {
        foundJobs = jobList.filter(j => j.City == city)
    }
    //  TODO EXTRA CREDIT (20 pts) - find the job with the highest salary

    const total = foundJobs.reduce((tot, job) => job.Salary + tot, 0);
    let average = total / foundJobs.length;

    let allSalaries = foundJobs.map(j => j.Salary)
    let maxSalary = Math.max(...allSalaries)
    let minSalary = Math.min(...allSalaries)         // ... means a list of all the elements 

    //  this will format the money amount nicely
    average = foundJobs.reduce((tot, job) => job.Salary + tot, 0) / foundJobs.length;
    average = average.formatMoney(0,"$")

    res.render('jobs', {jobs: foundJobs,average:average,
        title:title,
        city: city,
        category: category,
        max : maxSalary.formatMoney(0,"$"),
        min : minSalary.formatMoney(0,"$")
    });
});


// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};