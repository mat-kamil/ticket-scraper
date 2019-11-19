"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var should = require('chai').should();
var cheerio = require('cheerio');
// let search = new EventSearch();
// console.log("fetching sample page");
// let res = search.fetchSearchPageData(1).then(res => {
//     console.log("page loaded");
//     let $ = cheerio.load(res.data);
//
//     let totalPages = parseInt($('a.pagination_link').last().html());
//     let totalEvents = parseInt($('#resultsCount').html().match(/\d+/g)[0]);
//
//     let row = $('.content.block-group.chatterbox-margin:first-child');
//     //let doorTime  = $('table.venue-details tr:nth-child(3) td:last-child',row).html().match(/Door\stime\:\s(\d+\:\d+\w+)/);
//     //let startTime = $('table.venue-details tr:nth-child(3) td:last-child',row).html().match(/Start\stime\:\s(\d+\:\d+\w+)/);
//     let id = $('.event_link',row).attr('href').match(/\d+/)[0];
//     let identifier = $('.event_link',row).attr('href').match(/\d+/)[0];
//     let url = $('.event_link',row).attr('href');
//     let name = $('.event_link',row).html();
//     let disambiguatingDescription = $('h4',row).first().html();
//     let location = $('table.venue-details tr:first-child td:last-child',row).html();
//     let date = $('table.venue-details tr:nth-child(2) td:last-child',row).html();
//
//     try {
//         totalPages.should.not.equal(0);
//         totalEvents.should.not.equal(0);
//         row.length.should.not.equal(0);
//         id.should.not.equal('');
//         identifier.should.not.equal('');
//         url.should.not.equal('');
//         name.should.not.equal('');
//         disambiguatingDescription.should.not.equal('');
//         location.should.not.equal('');
//         date.should.not.equal('');
//     } catch(e) {}
// });
