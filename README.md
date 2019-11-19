\* Requires Nodejs \*
##### Packages
 - lowdb (json databasing)
 - axios (page retrieval)
 - cheerio (jQuery for Nodejs)
 - chai (tests)

##### Usage
`npm install && npm run start`
the results folder needs to be writable.

##### Tests
`npm run tests`

#### Inspired by
 https://pusher.com/tutorials/web-scraper-node

#### STEPS
 1. crawl first page (getListPage(1),scrapeFirstPageData)
    - https://www.wegottickets.com/searchresults/adv
    - POST data - unified_query=music dance
    - total pages
    - genre ?
    - do tests on first page & data
 
 2. crawl through pages (getListPage(1..n),scrapePageData(1..n))
    - https://www.wegottickets.com/searchresults/page/{n}/adv
    - https://schema.org/Event
    - https://schema.org/Place
    - title
    - short description
    - location name
    - date
    - time (door & start)
    - age restrictions
    - status : more info / sold out / cancelled
    - url (and subsequently event ID)

 3. more data (go to event page getEventPage(1..n), scrapeEventPageData(1..n))
    - https://schema.org/Offer (price)
    - image
    - price ( breakdown? (booking fee, etc))
    - location address
    - location phone
    - location website
    - similar events by same organiser ?
