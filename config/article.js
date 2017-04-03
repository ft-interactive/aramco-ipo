export default () => ({ // eslint-disable-line

  // link file UUID
  id: '4be29484-057a-11e7-ace0-1ce02ef0def9',

  // canonical URL of the published page
  // https://ig.ft.com/sites/aramco-ipo get filled in by the ./configure script
  url: 'https://ig.ft.com/saudi-aramco-ipo-calculator',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'IPO calculator: how much will Saudi Aramco be worth?',

  // summary === standfirst (Summary is what the content API calls it)
  summary: //'Saudi State oil company Aramco is likely to be the biggest company in the world when it goes to IPO next year. ' +
  'Play with the factors that could push Saudi oil company Aramco to be the world\'s biggest company', 

  topic: {
    name: 'Saudi Aramco IPO',
    url: 'https://www.ft.com/saudi-aramco-ipo',
  },

  relatedArticle: {
    text: '',
    url: '',
  },

  mainImage: {
    title: '',
    description: '',
    url: '',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Anna Leach', url: 'https://www.ft.com/stream/authorsId/ZmVkNjE2NmMtYmQyMC00M2UyLTkzM2QtNDEwMmM0MWYzY2Y1-QXV0aG9ycw==' },
    { name: 'Alan Livsey', url: 'https://www.ft.com/stream/authorsId/OTFlYjViMWEtYWZmOC00ODQwLWJjOTktNGVmYTc4ZjlhZjEy-QXV0aG9ycw==' },
    { name: 'Steve Bernard', url: 'https://www.ft.com/steve-bernard' },
    { name: 'Tom Pearson', url: 'https://www.ft.com/tom-pearson' },
  ],

  // Appears in the HTML <title>
  title: 'Saudi Aramco IPO valuation calculator',

  // meta data
  description: 'Saudi Aramco is set to become the world’s largest company, how big is up to you.',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
socialImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4240968e-13ac-11e7-b0c1-37e417ee6c76?source=ig&width=1400',
socialHeadline: 'IPO calculator: how much will Saudi Aramco be worth?',
socialSummary:  'Saudi Aramco is set to become the world’s largest company, how big is up to you.',

  // TWITTER
twitterImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4240968e-13ac-11e7-b0c1-37e417ee6c76?source=ig&width=1400',
twitterCreator: '@ftlex',
tweetText:  'Saudi Aramco is set to become the world’s largest company, how big is up to you.',
twitterHeadline:  'IPO calculator: how much will Saudi Aramco be worth?',

  // FACEBOOK
facebookImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4240968e-13ac-11e7-b0c1-37e417ee6c76?source=ig&width=1400',
facebookHeadline: 'IPO calculator: how much will Saudi Aramco be worth?',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
