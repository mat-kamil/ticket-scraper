"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios');
var cheerio = require('cheerio');
var low = require('lowdb');
var lodashId = require('lodash-id');
var FileSync = require('lowdb/adapters/FileSync');
//All saved data will be output to /results/{DD-MM-YYYY}.json
var date = new Date();
var adapter = new FileSync("./results/" + date.getUTCDate() + "-" + date.getUTCMonth() + "-" + date.getFullYear() + ".json");
var db = low(adapter);
db._.mixin(lodashId);
db.set('posts', []).write();
var EventSearch = /** @class */ (function () {
    function EventSearch() {
        this.tags = ['music', 'dance'];
    }
    /**
     * Get the html page of all events (search)
     * @param page
     */
    EventSearch.prototype.fetchSearchPageData = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.post("https://www.wegottickets.com/searchresults/page/" + page + "/adv", { unified_query: this.tags.join(" ") })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sleep method to not overwhelm the server
     * @param ms
     */
    EventSearch.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    /**
     * Get the html page of an event (for additional data)
     * @param id
     */
    EventSearch.prototype.fetchEventPageData = function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get("https://www.wegottickets.com/event/" + id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); });
    };
    /**
     * Get init totals for subsequent requests
     */
    EventSearch.prototype.setupInitData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchSearchPageData(1)
                            .then(function (res) {
                            try {
                                var $ = cheerio.load(res.data);
                                _this.totalPages = parseInt($('a.pagination_link').last().html()) || 0;
                                _this.totalEvents = parseInt($('#resultsCount').html().match(/\d+/g)[0]);
                                $ = null;
                            }
                            catch (e) {
                                return false;
                            }
                            return _this.totalPages && _this.totalPages > 0;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Fetch given page data and save rows to db
     */
    EventSearch.prototype.scrapeSearchPageData = function (i) {
        return __awaiter(this, void 0, void 0, function () {
            var page, $, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //get data
                        console.log("mandated sleep");
                        return [4 /*yield*/, this.sleep(2000)];
                    case 1:
                        _a.sent();
                        console.log("loading search page " + i);
                        return [4 /*yield*/, this.fetchSearchPageData(i)];
                    case 2:
                        page = _a.sent();
                        $ = cheerio.load(page.data);
                        rows = $('.content.block-group.chatterbox-margin');
                        rows.map(function (index, row) {
                            console.log("index " + index + " of page " + i);
                            try {
                                //parse to Schema (first round)
                                var doorTime = $('table.venue-details tr:nth-child(3) td:last-child', row).html().match(/Door\stime\:\s(\d+\:\d+\w+)/);
                                var startTime = $('table.venue-details tr:nth-child(3) td:last-child', row).html().match(/Start\stime\:\s(\d+\:\d+\w+)/);
                                var data = {
                                    id: $('.event_link', row).attr('href').match(/\d+/)[0],
                                    identifier: $('.event_link', row).attr('href').match(/\d+/)[0],
                                    url: $('.event_link', row).attr('href'),
                                    name: $('.event_link', row).html(),
                                    disambiguatingDescription: $('h4', row).first().html(),
                                    location: $('table.venue-details tr:first-child td:last-child', row).html(),
                                    date: $('table.venue-details tr:nth-child(2) td:last-child', row).html(),
                                    doorTime: doorTime ? doorTime[0] : null,
                                    startTime: startTime ? startTime[0] : null,
                                };
                                //save to db
                                db.get('posts').upsert(data).write();
                                doorTime = null;
                                startTime = null;
                            }
                            catch (e) {
                                return false;
                            }
                        });
                        page = null;
                        $ = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    EventSearch.prototype.startScrape = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setupInitData()];
                    case 1:
                        if (!(_a.sent())) {
                            console.log("Failed to retrieve first page data");
                            return [2 /*return*/, false];
                        }
                        console.log("Initial data successfully taken");
                        i = 1;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.totalPages)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.scrapeSearchPageData(i++)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        //TODO: make 2nd request for each event, as in below (it was incomplete and i ran out of time
                        /*
                        this.fetchEventPageData(data.identifier)
                            .then((res2) => {
                                Object.assign(data,{
                                    image: $('.event-image img').attr('src'),
                                    price: null,
                                    location: { locationWithAddress }
                                });
                                //save to db
                                db.get('posts').upsert(data).write();
                            })
                         */
                        console.log("successful. Please see /results/{date}.json");
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return EventSearch;
}());
exports.EventSearch = EventSearch;
