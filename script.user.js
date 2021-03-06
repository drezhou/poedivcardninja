// ==UserScript==
// @name         Poe Ninja Ninja
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://poe.ninja/challenge/divinationcards
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.core.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var currentLeague = $(".league-selector > select > option:nth-of-type(2)").text();

    // Get and format date
    var yyyymmdd;
    function doDateStuff() {
        var now = new Date();
        var y = now.getFullYear();
        var m = now.getMonth() + 1;
        var d = now.getDate();
        var mm = m < 10 ? '0' + m : m;
        var dd = d < 10 ? '0' + d : d;
        yyyymmdd = y + '-' + mm + '-' + dd;
    }
    doDateStuff();

    // Get poe.ninja Data
    var currency;
    $.ajax({
        url: 'https://poe.ninja/api/data/currencyoverview?league=' + currentLeague + '&type=Currency&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            currency = data.lines;
        }
    });
    var divination;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=DivinationCard&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            divination = data.lines;
        }
    });
    var prophecy;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=Prophecy&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            prophecy = data.lines;
        }
    });
    var skillGem;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=SkillGem&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            skillGem = data.lines;
        }
    });
    var baseType;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=BaseType&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            baseType = data.lines;
        }
    });
    var uniqueMap;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=UniqueMap&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            uniqueMap = data.lines;
        }
    });
    var uniqueWeapon;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=UniqueWeapon&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            uniqueWeapon = data.lines;
        }
    });
    var uniqueArmour;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=UniqueArmour&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            uniqueArmour = data.lines;
        }
    });
    var uniqueAccessories;
    $.ajax({
        url: 'https://poe.ninja/api/data/itemoverview?league=' + currentLeague + '&type=UniqueAccessory&date=' + yyyymmdd,
        dataType: 'json',
        success: function(data) {
            uniqueAccessories = data.lines;
        }
    });

    // Helper function for name matching
    function findPriceByName(name){
        var searchTerm;
        var searchDataset;
        var searchType;
        var specialCalculation;
        var specialSearchTerm;
        var output;

        function runSearch(type){
            var result;
            if (type === "currency"){
                result = _.find(searchDataset, { 'currencyTypeName': searchTerm });
                if (result) {
                    output = result.chaosEquivalent;
                    if (specialCalculation) {
                        output = specialCalculation(output);
                    }
                } else {
                    output = "no result";
                }
            } else {
                if(specialSearchTerm){
                    result = _.find(searchDataset, specialSearchTerm);
                    if (result) {
                        output = result.chaosValue;
                    } else {
                        output = "no result";
                    }
                } else {
                    result = _.find(searchDataset, { 'name': searchTerm });
                    if (result) {
                        output = result.chaosValue;
                    } else {
                        output = "no result";
                    }
                }
            }
        }

        switch (name) {
            case "House of Mirrors":
                searchTerm = "Mirror of Kalandra";
                searchDataset = currency;
                searchType = "currency";
                break;
            case "The Doctor":
                searchTerm = "Headhunter";
                searchDataset = uniqueAccessories;
                break;
            case "Beauty Through Death":
                searchTerm = "The Queen's Sacrifice";
                searchDataset = prophecy;
                break;
            case "The Immortal":
                searchTerm = "House of Mirrors";
                searchDataset = divination;
                break;
            case "The Nurse":
                searchTerm = "The Doctor";
                searchDataset = divination;
                break;
            case "Immortal Resolve":
                searchTerm = "Fated Connections";
                searchDataset = prophecy;
                break;
            case "The Queen":
                searchTerm = "Atziri's Acuity";
                searchDataset = uniqueArmour;
                break;
            case "Abandoned Wealth":
                searchTerm = "Exalted Orb";
                searchDataset = currency;
                searchType = "currency";
                specialCalculation = function(x){ return x*3; };
                break;
            case "The Spark and the Flame":
                searchTerm = "Berek's Respite";
                searchDataset = uniqueAccessories;
                break;
            case "The Wolven King's Bite":
                searchTerm = "Rigwald's Quills";
                searchDataset = uniqueArmour;
                break;
            case "The Mayor":
                searchTerm = "The Perandus Manor";
                searchDataset = uniqueMap;
                break;
            case "Hunter's Reward":
                searchTerm = "The Taming";
                searchDataset = uniqueAccessories;
                break;
            case "The Iron Bard":
                searchTerm = "Trash to Treasure";
                searchDataset = prophecy;
                break;
            case "The Celestial Stone":
                specialSearchTerm = {
                    name: "Opal Ring",
                    levelRequired: 86,
                    variant: "Shaper"
                };
                searchDataset = baseType;
                break;
            case "The Dragon's Heart":
                specialSearchTerm = {
                    name: "Empower Support",
                    gemLevel: 4
                };
                searchDataset = skillGem;
                break;
            case "Wealth and Power":
                specialSearchTerm = {
                    name: "Enlighten Support",
                    gemLevel: 4
                };
                searchDataset = skillGem;
                break;
            case "The Saint's Treasure":
                searchTerm = "Exalted Orb";
                searchDataset = currency;
                searchType = "currency";
                specialCalculation = function(x){ return x*2; };
                break;
            case "The King's Heart":
                searchTerm = "Kaom's Heart";
                searchDataset = uniqueArmour;
                break;
            case "A Dab of Ink":
                searchTerm = "The Poet's Pen";
                searchDataset = uniqueWeapon;
                break;
            case "The Artist":
                specialSearchTerm = {
                    name: "Enhance Support",
                    gemLevel: 4
                };
                searchDataset = skillGem;
                break;
            case "The Hoarder":
                searchTerm = "Exalted Orb";
                searchDataset = currency;
                searchType = "currency";
                break;
            case "The Enlightened":
                specialSearchTerm = {
                    name: "Enlighten Support",
                    gemLevel: 3,
                    corrupted: false
                };
                searchDataset = skillGem;
                break;
            case "The World Eater":
                specialSearchTerm = {
                    name: "Starforge",
                    links: 0
                };
                searchDataset = uniqueWeapon;
                break;
            case "The Professor":
                searchTerm = "The Putrid Cloister";
                searchDataset = uniqueMap;
                break;
            case "The Sephirot":
                searchTerm = "Divine Orb";
                searchDataset = currency;
                searchType = "currency";
                specialCalculation = function(x){ return x*10; };
                break;
            case "The Valley of Steel Boxes":
                searchTerm = "Monstrous Treasure";
                searchDataset = prophecy;
                break;
            default:
        }

        runSearch(searchType);

        return output;
    };

    // Aggregate data
    setTimeout(
        function ()
        {
            function doStuff() {
                // Get card name
                var cardName = $("> td:nth-of-type(1) > div > span > span:last-of-type", this).text();

                // Get the stack size
                var stackSize = $("> td:nth-of-type(2)", this).text();

                // Get the card value
                var cardValue = $("> td:nth-of-type(4) > span:last-of-type", this)
                    .clone()    //clone the element
                    .children() //select all the children
                    .remove()   //remove all the children
                    .end()  //again go back to selected element
                    .text();    //get the text of element

                // Calculate stack total and parse output
                function formatNumber(num) {
                    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }

                var multiplier;
                if (cardValue > 1000){
                    multiplier = 1.01
                } else if (cardValue > 100 && cardValue < 999){
                    multiplier = 1.03
                } else if (cardValue >10 && cardValue < 99){
                    multiplier = 1.05
                } else {
                    multiplier = 1.02
                };

                var totalDecimal = (stackSize * cardValue) * multiplier;
                var totalStackCost = formatNumber(Math.floor(totalDecimal));

                // Get the item price
                var itemPriceDecimal = findPriceByName(cardName);
                var itemPrice = Math.floor(itemPriceDecimal);
                itemPrice = formatNumber(itemPrice);

                // Calculate total profit
                var profitDecimal = itemPriceDecimal - totalDecimal;
                var totalProfit = Math.floor(profitDecimal);

                if (itemPrice === "NaN"){
                    itemPrice = "-";
                    totalProfit = "-";
                }

                // Append the total price, matched item price, and profit
                $("> td:nth-of-type(4) > span:last-of-type", this).after("<span style='float:right; width: 80px;'>" + totalProfit + "</span><span style='float:right; width: 80px;'>" + itemPrice + "</span><span style='float:right; width: 60px;'>" + totalStackCost + "</span>")

            }

            // Add all the shit to the page for each card
            $(".fvfr3wi").each( doStuff );

        }, 2000);


})();
