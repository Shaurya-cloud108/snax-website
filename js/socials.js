/**
 * SNAX GAMING — OFFICIAL WEBSITE SOCIALS HUB SCRIPT
 * Author: Gemini Advanced Agent (Antigravity)
 * Handles live analytics simulations, tab switching for content hub, 
 * and YouTube video listings (via mockup database or API fetch fallback).
 */

// Mock YouTube Video Database representing Snax's actual channels and content topics
const CHANNEL_VIDEOS = {
  gaming: [
    {
      title: "HOW I BECAME THE DP-28 GOD OF INDIA 🇮🇳 | S8UL Snax Story",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxGaming",
      date: "2 days ago",
      views: "248K views"
    },
    {
      title: "SNAX SQUAD VS SOUL AMAN COMPETITIVE CUSTOMS SHOWDOWN!",
      thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxGaming",
      date: "5 days ago",
      views: "195K views"
    },
    {
      title: "MY ALL-TIME BEST BGMI SNIPING CLIPS MONSTAGE 🔥",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxGaming",
      date: "1 week ago",
      views: "312K views"
    },
    {
      title: "S8UL GAMING HOUSE TOUR & MY NEW EXTREME PC SETUP REVEAL!",
      thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxGaming",
      date: "2 weeks ago",
      views: "420K views"
    },
    {
      title: "BGMI NO RECOIL GUIDE: MASTERING DP-28 AND M416 + SENSITIVITY",
      thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxGaming",
      date: "3 weeks ago",
      views: "572K views"
    }
  ],
  unseen: [
    {
      title: "FINALLY BUYING A HOME IN MUMBAI FOR MY PARENTS! ❤️ (EMOTIONAL VLOG)",
      thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@snaxunseen",
      date: "3 days ago",
      views: "180K views"
    },
    {
      title: "MODIFIED ROYAL ENFIELD CONTINENTAL GT 650 DELIVERY & RIDE WITH CHAHAL!",
      thumbnail: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@snaxunseen",
      date: "1 week ago",
      views: "290K views"
    },
    {
      title: "S8UL BOYS OUTING IN BANGALORE - DYNAMO & MORTAL JOIN US!",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@snaxunseen",
      date: "2 weeks ago",
      views: "215K views"
    },
    {
      title: "LATE NIGHT TALKS: REVEALING MY RETIREMENT FROM COMPETITIVE ESPORTS",
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@snaxunseen",
      date: "3 weeks ago",
      views: "340K views"
    },
    {
      title: "MY EVERYDAY WORKOUT & DIET ROUTINE FOR STREAMING ENDURANCE",
      thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@snaxunseen",
      date: "1 month ago",
      views: "125K views"
    }
  ],
  maxx: [
    {
      title: "VALORANT RANKED WITH S8UL BOYS: JETT ACE CLUTCH IN ROUND 24!",
      thumbnail: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxMaxx",
      date: "4 days ago",
      views: "98K views"
    },
    {
      title: "GTA 5 RP IN HYDERABAD SERVER: PRANKING MAVI & REGGALT!",
      thumbnail: "https://images.unsplash.com/photo-1533236897111-3e94666b27fa?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxMaxx",
      date: "1 week ago",
      views: "115K views"
    },
    {
      title: "FIRST TIME PLAYING ELDEN RING: DYING 100 TIMES TO MARGIT!",
      thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxMaxx",
      date: "2 weeks ago",
      views: "87K views"
    },
    {
      title: "TESTING THE EXOTIC KAWASAKI NINJA H2 ON MUMBAI EXPRESSWAY!",
      thumbnail: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxMaxx",
      date: "3 weeks ago",
      views: "230K views"
    },
    {
      title: "MY SPEEDRUN TRY ON ONLY UP! (COMPILATION OF RAGETRANS)",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
      url: "https://www.youtube.com/@SnaxMaxx",
      date: "1 month ago",
      views: "72K views"
    }
  ]
};

// Starting counts for simulation (used as initial values or fallback)
const LIVE_STATS = {
  gaming_subs: 2390105,
  unseen_subs: 382410,
  maxx_subs: 185150,
  instagram_followers: 1304502,
  twitter_followers: 29300,
  kick_followers: 5420
};


let liveSimulationInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initContentTabs();

  // Channel Search Filtering
  const searchInput = document.querySelector('.channel-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('.channel-row-card').forEach(card => {
        const title = card.querySelector('.row-name').textContent.toLowerCase();
        const desc = card.querySelector('.row-desc').textContent.toLowerCase();
        if (title.includes(term) || desc.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Load data from the pre-fetched static JSON file (updated 3x daily by GitHub Actions)
  loadChannelDataFromFile();

  // Instagram live data fetching is removed

  // Start stats simulation ticker (runs on top of loaded base values)
  startLiveAnalyticsSimulation();
});

/* ==========================================
   1. Render Channel Videos
   ========================================== */
function renderAllChannelGrids() {
  renderVideoGrid('gaming', 'gaming-video-grid');
  renderVideoGrid('unseen', 'unseen-video-grid');
  renderVideoGrid('maxx', 'maxx-video-grid');
}

function renderVideoGrid(channelKey, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const videos = CHANNEL_VIDEOS[channelKey];
  if (!videos) return;

  container.innerHTML = ''; // Clear contents

  videos.forEach(video => {
    const card = document.createElement('a');
    card.href = video.url;
    card.target = '_blank';
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-thumbnail-wrapper">
        <img class="video-thumbnail" src="${video.thumbnail}" alt="${video.title}" loading="lazy">
        <div class="video-play-overlay">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <div class="video-info">
        <h4 class="video-title">${video.title}</h4>
        <div class="video-meta">
          <span class="video-views">${video.views}</span>
          <span class="video-date">${video.date}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ==========================================
   2. Content Hub Tab Switcher
   ========================================== */
function initContentTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const grids = document.querySelectorAll('.tab-content');

  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetChannel = tab.getAttribute('data-tab');

      // Update active button
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active grid display
      grids.forEach(grid => {
        if (grid.id === `${targetChannel}-content`) {
          grid.classList.add('active');
        } else {
          grid.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================
   3. Live Social Analytics Counter Simulation
   ========================================== */
function startLiveAnalyticsSimulation() {
  // Clear any existing simulation interval
  if (liveSimulationInterval) {
    clearInterval(liveSimulationInterval);
  }

  const elGaming = document.getElementById('live-gaming-subs');
  const elUnseen = document.getElementById('live-unseen-subs');
  const elMaxx = document.getElementById('live-maxx-subs');
  const elInstagram = document.getElementById('live-instagram-followers');
  const elTwitter = document.getElementById('live-twitter-followers');
  const elKick = document.getElementById('live-kick-followers');

  if (!elGaming && !elInstagram) return; // Check if we are on the socials page

  // Initial values render
  updateDashboardNumbers();

  // Update loops every few seconds to simulate stream registrations
  liveSimulationInterval = setInterval(() => {
    // Random increment of 1-3 subscribers
    if (Math.random() > 0.6) {
      LIVE_STATS.gaming_subs += Math.floor(Math.random() * 2) + 1;
      updateDisplay(elGaming, LIVE_STATS.gaming_subs);
    }

    if (Math.random() > 0.8) {
      LIVE_STATS.unseen_subs += 1;
      updateDisplay(elUnseen, LIVE_STATS.unseen_subs);
    }

    if (Math.random() > 0.85) {
      LIVE_STATS.maxx_subs += 1;
      updateDisplay(elMaxx, LIVE_STATS.maxx_subs);
    }

    if (Math.random() > 0.7) {
      LIVE_STATS.instagram_followers += Math.floor(Math.random() * 2) + 1;
      updateDisplay(elInstagram, LIVE_STATS.instagram_followers);
    }

    if (Math.random() > 0.9) {
      LIVE_STATS.twitter_followers += 1;
      updateDisplay(elTwitter, LIVE_STATS.twitter_followers);
    }

    if (Math.random() > 0.88) {
      LIVE_STATS.kick_followers += 1;
      updateDisplay(elKick, LIVE_STATS.kick_followers);
    }
  }, 12000); // Trigger check every 12 seconds
}

function formatNumber(num, formatType = 'comma') {
  if (formatType === 'compact') {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateDisplay(el, value, compact = false) {
  if (!el) return;
  el.textContent = formatNumber(value, compact ? 'compact' : 'comma');

  // Add pulsing green flash to indicate changes
  el.classList.add('pulse-glow');
  setTimeout(() => el.classList.remove('pulse-glow'), 800);
}

function updateDashboardNumbers() {
  const elGaming = document.getElementById('live-gaming-subs');
  const elUnseen = document.getElementById('live-unseen-subs');
  const elMaxx = document.getElementById('live-maxx-subs');
  const elInstagram = document.getElementById('live-instagram-followers');
  const elTwitter = document.getElementById('live-twitter-followers');
  const elKick = document.getElementById('live-kick-followers');

  updateDisplay(elGaming, LIVE_STATS.gaming_subs);
  updateDisplay(elUnseen, LIVE_STATS.unseen_subs);
  updateDisplay(elMaxx, LIVE_STATS.maxx_subs);
  updateDisplay(elInstagram, LIVE_STATS.instagram_followers);
  updateDisplay(elTwitter, LIVE_STATS.twitter_followers);
  updateDisplay(elKick, LIVE_STATS.kick_followers);
}

/* ==========================================
   4. Load Channel Data from Static JSON File
   (Updated 3x daily by GitHub Actions — zero quota cost per visitor)
   ========================================== */
async function loadChannelDataFromFile() {
  try {
    const response = await fetch('data/channel_data.json?t=' + Math.floor(Date.now() / 300000));
    // ^ cache-busts every 5 min so returning visitors get the latest JSON
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();

    const channels = data.channels || {};

    // Update each channel's avatar, sub count, and video grid
    Object.entries(channels).forEach(([key, ch]) => {
      // Update LIVE_STATS base values from JSON
      if (key === 'gaming' && ch.subs_raw) LIVE_STATS.gaming_subs = ch.subs_raw;
      if (key === 'unseen' && ch.subs_raw) LIVE_STATS.unseen_subs = ch.subs_raw;
      if (key === 'maxx'   && ch.subs_raw) LIVE_STATS.maxx_subs   = ch.subs_raw;
      if (key === 'kick'   && ch.followers_raw) LIVE_STATS.kick_followers = ch.followers_raw;

      // Update avatar image
      if (ch.avatar) updateAvatar(key, ch.avatar);

      // Update subscriber count on channel card
      if (ch.subs_raw) updateSubsOnCard(key, ch.subs_raw);
      if (ch.followers_raw) updateSubsOnCard(key, ch.followers_raw, 'Followers');

      // Populate video grid with real data
      if (ch.videos && ch.videos.length > 0) {
        CHANNEL_VIDEOS[key] = ch.videos;
        renderVideoGrid(key, `${key}-video-grid`);
      } else {
        renderVideoGrid(key, `${key}-video-grid`);
      }
    });

    if (data.fetched_at) {
      const fetchedTime = new Date(data.fetched_at).getTime();
      const now = Date.now();
      // Cap at 8 hours (28800 seconds) so it doesn't run away completely if action fails
      const elapsedSeconds = Math.min(28800, Math.max(0, (now - fetchedTime) / 1000));

      // Fast-forward simulation based on average growth rates
      LIVE_STATS.gaming_subs += Math.floor(elapsedSeconds * 0.02);
      LIVE_STATS.unseen_subs += Math.floor(elapsedSeconds * 0.0075);
      LIVE_STATS.maxx_subs += Math.floor(elapsedSeconds * 0.0033);
      LIVE_STATS.instagram_followers += Math.floor(elapsedSeconds * 0.0125);
      LIVE_STATS.twitter_followers += Math.floor(elapsedSeconds * 0.0025);
      LIVE_STATS.kick_followers += Math.floor(elapsedSeconds * 0.001);
    }

    // Refresh dashboard numbers with real base values + simulated fast-forward
    updateDashboardNumbers();

    const fetchedAt = data.fetched_at_ist || data.fetched_at || 'unknown';
    console.log(`✅ Channel data loaded from static file (last updated: ${fetchedAt} | Quota used: 0)`);

  } catch (err) {
    // Fallback: render using hardcoded data already in CHANNEL_VIDEOS
    console.warn('⚠️ Could not load channel_data.json, using fallback data:', err.message);
    renderAllChannelGrids();
    updateDashboardNumbers();
  }
}

function updateAvatar(channelKey, url) {
  const avatarEl = document.querySelector(`#chan-${channelKey} .row-avatar img`);
  if (avatarEl && url) avatarEl.src = url;
}

function updateSubsOnCard(channelKey, count, label = 'Subscribers') {
  const subsEl = document.querySelector(`#chan-${channelKey} .stat-green`);
  if (!subsEl) return;
  if (count >= 1_000_000) {
    subsEl.textContent = (count / 1_000_000).toFixed(2) + `M+ ${label}`;
  } else if (count >= 1_000) {
    subsEl.textContent = (count / 1_000).toFixed(0) + `K+ ${label}`;
  } else {
    subsEl.textContent = count + ` ${label}`;
  }
}
