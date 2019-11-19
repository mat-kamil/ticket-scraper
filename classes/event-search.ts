
import {EventSchema} from "../models/event";
const axios = require('axios');
const cheerio = require('cheerio');
const low = require('lowdb');
const lodashId = require('lodash-id');
const FileSync = require('lowdb/adapters/FileSync');

//All saved data will be output to /results/{DD-MM-YYYY}.json
let date = new Date();
const adapter = new FileSync(`./results/${date.getUTCDate()}-${date.getUTCMonth()}-${date.getFullYear()}.json`);
const db = low(adapter);
db._.mixin(lodashId);
db.set('posts',[]).write();

export class EventSearch {
    tags = ['music','dance'];
    totalPages: number;
    totalEvents: number;

    /**
     * Get the html page of all events (search)
     * @param page
     */
    async fetchSearchPageData(page: number){
        return await axios.post(`https://www.wegottickets.com/searchresults/page/${page}/adv`,
            { unified_query: this.tags.join(" ") }
        )
    }

    /**
     * Sleep method to not overwhelm the server
     * @param ms
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get the html page of an event (for additional data)
     * @param id
     */
    async fetchEventPageData(id: string){ return await axios.get(`https://www.wegottickets.com/event/${id}`) }

    /**
     * Get init totals for subsequent requests
     */
    async setupInitData() {
        return await this.fetchSearchPageData(1)
            .then(res => {
                try {
                    let $ = cheerio.load(res.data);
                    this.totalPages = parseInt($('a.pagination_link').last().html()) || 0;
                    this.totalEvents = parseInt($('#resultsCount').html().match(/\d+/g)[0]);
                    $ = null;
                } catch(e) { return false; }
                return this.totalPages && this.totalPages > 0;
            });
    }

    /**
     * Fetch given page data and save rows to db
     */
    async scrapeSearchPageData(i: number) {
        //get data
        console.log("mandated sleep");
        await this.sleep(2000);
        console.log(`loading search page ${i}`);
        let page = await this.fetchSearchPageData(i);
        let $ = cheerio.load(page.data);

        let rows = $('.content.block-group.chatterbox-margin');

        rows.map((index,row) => {
            console.log(`index ${index} of page ${i}`);
            try {
                //parse to Schema (first round)
                let doorTime  = $('table.venue-details tr:nth-child(3) td:last-child',row).html().match(/Door\stime\:\s(\d+\:\d+\w+)/);
                let startTime = $('table.venue-details tr:nth-child(3) td:last-child',row).html().match(/Start\stime\:\s(\d+\:\d+\w+)/);
                let data:EventSchema = {
                    id: $('.event_link',row).attr('href').match(/\d+/)[0],
                    identifier: $('.event_link',row).attr('href').match(/\d+/)[0],
                    url: $('.event_link',row).attr('href'),
                    name: $('.event_link',row).html(),
                    disambiguatingDescription: $('h4',row).first().html(),
                    location: $('table.venue-details tr:first-child td:last-child',row).html(),
                    date: $('table.venue-details tr:nth-child(2) td:last-child',row).html(),
                    doorTime: doorTime ? doorTime[0] : null,
                    startTime: startTime ? startTime[0] : null,
                    // data not captured due to time: status, age
                };
                //save to db
                db.get('posts').upsert(data).write();
                doorTime = null;
                startTime = null;
            } catch(e) { return false; }
        });
        page = null;
        $ = null;
    }
    async startScrape() {
        if(!await this.setupInitData()) {
            console.log("Failed to retrieve first page data");
            return false;
        }
        console.log("Initial data successfully taken");
        let i = 1;
        while(i < this.totalPages) {
            await this.scrapeSearchPageData(i++);
        }
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
        return true;
    }
}
