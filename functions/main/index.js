var http = require('http');
var https = require('https');
var async = require('async');
var aws = require('aws-sdk');
var parseString = require('xml2js').parseString;

// TODO: Templatize the HTML version of the email

// TODO: Can we move this out of the file and require it?
var sources = [{
    'title': 'Local News',
    'url': 'news.google.com',
    'port': 443,
    'path': '/news?cf=all&hl=en&pz=1&ned=us&geo=94114&output=rss',
    'num': 10
},
{
    'title': 'US News',
    'url': 'news.google.com',
    'port': 443,
    'path': '/news?cf=all&hl=en&pz=1&ned=us&topic=n&output=rss',
    'num': 5
},
{
    'title': 'World News',
    'url': 'feeds.bbci.co.uk',
    'port': 80,
    'path': '/news/world/rss.xml',
    'num': 5
},
{
    'title': 'HackerNews',
    'url': 'news.ycombinator.com',
    'port': 443,
    'path': '/rss',
    'num': 10
},
{
    'title': 'Reddit',
    'url': 'www.reddit.com',
    'port': 443,
    'path': '/top.rss',
    'num': 5
}];

function getRssVersion(rss) {
    if (typeof rss.rss !== 'undefined' &&
        typeof rss.rss.$ !== 'undefined' &&
        typeof rss.rss.$.version) {
        return parseInt(rss.rss.$.version);
    }
    if (typeof rss.feed !== 'undefined') {
        return 1; // Atom RSS feed
    }
    return null;
}

function makeRequest(requester, source, callback) {
    var options = {
        host: source.url,
        port: source.port,
        path: source.path,
        method: 'GET'
    };
    console.log("Requesting: " + JSON.stringify(options));
    var req = requester.request(options, function(res) {
        console.log(res.statusCode);
        var body = '';
        res.on('data', function(data) {
            body += data;
        });
        res.on('end', function() {
            parseString(body, function(err, parsed) {
                if (err) {
                    console.log(err);
                    callback(err, body);
                }
                else {
                    var version = getRssVersion(parsed);
                    var stories = ['<h2>' + source.title + '</h2>', '<ol>'];

                    if (version === 1) {
                        stories.push.apply(stories, parsed.feed.entry.map(function(entry, index) {
                            if (index >= source.num) { return; }
                            return '<li>' + entry.title[0] + ' [<a href=\"' + entry.link[0].$.href + '">Link</a>]</li>';
                        }));
                    }
                    else if (version === 2) {
                        stories.push.apply(stories, parsed.rss.channel[0].item.map(function(item, index) {
                            if (index >= source.num) { return; }
                            return '<li>' + item.title[0] + ' [<a href=\"' + item.link[0] + '">Link</a>]</li>';
                        }));
                    } else {
                        callback('Unknown RSS version');
                    }
                    stories.push('</ol><hr />');
                    callback(null, stories.join("\n"));
                }
            });
        });
    }).on('error', function(e) {
        console.error(e);
    });
    req.end();
}

function getNews(source, callback) {
    var requester = http;
    if (source.port === 443) {
        requester = https;
    }
    makeRequest(requester, source, callback);
}

function emailData(data, callback) {
    var today = new Date();
    var dotw = today.toLocaleString('en-US', {weekday: 'short'}).substr(0, 15);
    var title = 'News for ' + dotw;
    var params = {
        Destination: {
            ToAddresses: [process.env.TO_ADDR]
        },
        Message: {
            Body: {
                Html: {
                    Data: '<h2>' + title + '</h2>' + data
                }/*,
                // TODO: Strip tags from Text version
                Text: {
                    Data: data
                }*/
            },
            Subject: {
                Data: title
            }
        },
        Source: process.env.FROM_ADDR
    };
    var ses = new aws.SES({
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccesskey: process.env.SES_SECRET_ACCESS_KEY,
        region: process.env.SES_REGION
    });
    ses.sendEmail(params, callback);
}

exports.handle = function(event, context) {
    async.parallel(sources.map(function(source) {
        return function(callback) {
            getNews(source, callback);
        };
    }), function(err, results) {
        if (err) {
            context.done(err);
        } else {
            emailData(results.join("\n"), function(err, data) {
                if (err) context.done(err);
                else context.succeed(event);
            });
        }
    });
};
