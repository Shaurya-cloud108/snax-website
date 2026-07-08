/**
 * SNAX GAMING — YouTube Stats Fetcher
 * -------------------------------------------
 * Fetches live data from YouTube Data API v3 and writes it
 * to data/channel_data.json as a static file.
 *
 * Run manually:   node scripts/fetch-stats.js
 * Run via GitHub Actions: automatically (see .github/workflows/update-stats.yml)
 *
 * Quota cost: ~10 units per run (9 for socials + 1 for home stats)
 * At 3x daily: 30 units/day out of 10,000 quota limit.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// ─── CONFIG ────────────────────────────────────────────────────────────────
const API_KEY = process.env.YOUTUBE_API_KEY; // Set via GitHub Secret or local env
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'channel_data.json');

const CHANNELS = {
  gaming: '@SnaxGaming',
  unseen: '@snaxunseen',
  maxx:   '@SnaxMaxx'
};

const MAX_VIDEOS_PER_CHANNEL = 6; // How many latest videos to include

// ─── HELPERS ───────────────────────────────────────────────────────────────
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

function formatCompact(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B+';
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M+';
  if (num >= 1_000)         return (num / 1_000).toFixed(0) + 'K+';
  return num.toString() + '+';
}

function formatViews(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M views';
  if (num >= 1_000)     return (num / 1_000).toFixed(0) + 'K views';
  return num + ' views';
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const wks  = Math.floor(days / 7);
  const mos  = Math.floor(days / 30);
  if (mins  <  60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  if (hrs   <  24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  if (days  <   7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (wks   <   5) return `${wks} week${wks !== 1 ? 's' : ''} ago`;
  return `${mos} month${mos !== 1 ? 's' : ''} ago`;
}

// ─── CORE FETCH FUNCTIONS ──────────────────────────────────────────────────
async function fetchChannelData(handle) {
  const url = `https://www.googleapis.com/youtube/v3/channels`
    + `?part=statistics,snippet,contentDetails`
    + `&forHandle=${encodeURIComponent(handle)}`
    + `&key=${API_KEY}`;
  const res = await httpsGet(url);
  if (!res.items || res.items.length === 0) throw new Error(`No channel found for handle: ${handle}`);
  return res.items[0];
}

async function fetchPlaylistVideos(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems`
    + `?part=snippet`
    + `&playlistId=${playlistId}`
    + `&maxResults=${MAX_VIDEOS_PER_CHANNEL}`
    + `&key=${API_KEY}`;
  const res = await httpsGet(url);
  return res.items || [];
}

async function fetchVideoStats(videoIds) {
  const url = `https://www.googleapis.com/youtube/v3/videos`
    + `?part=statistics`
    + `&id=${videoIds.join(',')}`
    + `&key=${API_KEY}`;
  const res = await httpsGet(url);
  return res.items || [];
}

async function fetchKickFollowers(handle) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    console.log(`📡 [kick] Scraping channel: ${handle}`);
    
    // Stealth plugin helps bypass basic bot protections
    await page.goto(`https://kick.com/${handle}`, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait a brief moment for dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));

    const followerCount = await page.evaluate(() => {
      // Look for a number followed by "followers" in the whole body text
      const bodyText = document.body.innerText;
      const match = bodyText.match(/([\d,\.]+[kKmM]?)\s*followers/i);
      if (match) {
        let numStr = match[1].toLowerCase().replace(/,/g, '');
        let multiplier = 1;
        if (numStr.endsWith('k')) { multiplier = 1000; numStr = numStr.slice(0, -1); }
        if (numStr.endsWith('m')) { multiplier = 1000000; numStr = numStr.slice(0, -1); }
        return Math.floor(parseFloat(numStr) * multiplier);
      }
      return null;
    });

    if (followerCount !== null) {
      console.log(`   ✅ kick.com/${handle}: ${followerCount.toLocaleString()} followers`);
      return followerCount;
    } else {
      console.warn(`   ⚠️ Could not parse Kick follower count from DOM for ${handle}.`);
      return null;
    }
  } catch (error) {
    console.error(`   ❌ Kick scraper error: ${error.message}`);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

// ─── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  if (!API_KEY) {
    console.error('❌ ERROR: YOUTUBE_API_KEY environment variable is not set.');
    console.error('   Set it with: $env:YOUTUBE_API_KEY="YOUR_KEY" (PowerShell)');
    console.error('   Or add it as a GitHub Secret named YOUTUBE_API_KEY');
    process.exit(1);
  }

  console.log('🚀 Fetching YouTube data for SNAX channels...\n');
  const result = {
    fetched_at: new Date().toISOString(),
    fetched_at_ist: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    channels: {},
    home_stats: {}
  };

  // Fetch all 3 channels in parallel (saves time)
  await Promise.all(
    Object.entries(CHANNELS).map(async ([key, handle]) => {
      console.log(`📡 [${key}] Fetching channel: ${handle}`);
      try {
        const channel = await fetchChannelData(handle);
        const stats   = channel.statistics;
        const subs    = parseInt(stats.subscriberCount);
        const views   = parseInt(stats.viewCount);
        const avatar  = channel.snippet.thumbnails.high?.url
                      || channel.snippet.thumbnails.medium?.url;
        const uploadsId = channel.contentDetails.relatedPlaylists.uploads;

        console.log(`   ✅ ${handle}: ${subs.toLocaleString()} subs | ${views.toLocaleString()} views`);

        // Fetch latest videos
        const playlistItems = await fetchPlaylistVideos(uploadsId);
        const videoIds = playlistItems.map(i => i.snippet.resourceId.videoId);
        const videoStats = await fetchVideoStats(videoIds);

        const videos = playlistItems.map(item => {
          const vidId = item.snippet.resourceId.videoId;
          const vs    = videoStats.find(v => v.id === vidId);
          return {
            title:     item.snippet.title,
            thumbnail: item.snippet.thumbnails.high?.url
                     || item.snippet.thumbnails.medium?.url,
            url:       `https://www.youtube.com/watch?v=${vidId}`,
            date:      timeAgo(item.snippet.publishedAt),
            views:     vs ? formatViews(parseInt(vs.statistics.viewCount)) : '0 views'
          };
        });

        result.channels[key] = {
          handle,
          avatar,
          subs_raw:       subs,
          subs_formatted: formatCompact(subs),
          views_raw:      views,
          views_formatted: formatCompact(views),
          videos
        };

        // Use gaming channel for homepage stats
        if (key === 'gaming') {
          result.home_stats.subs_formatted  = formatCompact(subs);
          result.home_stats.views_formatted = formatCompact(views);
          result.home_stats.subs_raw  = subs;
          result.home_stats.views_raw = views;
        }

      } catch (err) {
        console.error(`   ❌ Failed to fetch ${handle}:`, err.message);
      }
    })
  );

  // Fetch Kick stats (sequential to avoid blocking or memory limits)
  const kickFollowers = await fetchKickFollowers('snaxgaming');
  if (kickFollowers !== null) {
    result.channels['kick'] = {
      handle: 'snaxgaming',
      followers_raw: kickFollowers,
      followers_formatted: formatCompact(kickFollowers)
    };
    result.home_stats.kick_followers_raw = kickFollowers;
  }

  // Merge with existing data so we don't wipe out stats if one API fails
  let existingData = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch(e) {}
  }
  
  if (existingData.channels) {
    result.channels = { ...existingData.channels, ...result.channels };
  }
  if (existingData.home_stats) {
    result.home_stats = { ...existingData.home_stats, ...result.home_stats };
  }

  // Write output
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');

  console.log(`\n✅ Done! Data saved to: ${OUTPUT_FILE}`);
  console.log(`   Fetched at: ${result.fetched_at_ist} IST`);
  console.log(`   Quota used: ~10 units`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
