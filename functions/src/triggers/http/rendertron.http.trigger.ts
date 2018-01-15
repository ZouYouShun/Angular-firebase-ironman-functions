import * as functions from 'firebase-functions';
import * as express from 'express';
import * as url from 'url';
import fetch from 'node-fetch';
import { CONFIG } from '../../config';

const app = express();

function generateUrl(request) {
  return url.format({
    protocol: request.protocol,
    host: CONFIG.appUrl,
    pathname: request.originalUrl
  });
}

function detectBot(userAgent: string) {
  const bots = [
    // crawler bots
    'googlebot',
    'binbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    // link bots
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkShare',
    'facebot',
    'outbrain',
    'W3C_Validator'
  ];

  const agent = userAgent.toLocaleLowerCase();

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('偵測到機器人', bot, agent);
      return true;
    }
  }
  console.log('不是機器人');
  return false;
}

app.get('*', (req: any, res) => {
  const isBot = detectBot(req.headers['user-agent']);
  if (isBot) {
    const botUrl = generateUrl(req);
    fetch(`${CONFIG.renderUrl}/render/${botUrl}`)
      .then(response => response.text())
      .then(body => {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.set('Vary', 'User-Agent');
        res.send(body.toString());
      })
      .catch(err => res.status(401).json({
        err: err
      }));
  } else {
    fetch(`https://${CONFIG.appUrl}`)
      .then(response => response.text())
      .then(body => {
        res.send(body.toString());
      })
      .catch(err => res.status(401).json({
        err: err
      }));
  }
});

export const rendertronHttpTrigger = functions.https.onRequest(app);