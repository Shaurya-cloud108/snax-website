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
  gaming_subs: 2390123,
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

  // Init Must Watch Coverflow
  initCoverflow();

  // Init S8UL Collab Web
  initCollabWeb();
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

  videos.forEach((video, index) => {
    const card = document.createElement('a');
    card.href = video.url;
    card.target = '_blank';
    card.className = 'video-card';
    card.style.animationDelay = `${index * 0.06}s`;
    card.innerHTML = `
      <div class="video-thumbnail-wrapper">
        <img class="video-thumbnail" src="${video.thumbnail}" alt="${video.title}" loading="lazy">
        <div class="video-platform-badge">
          <i class="fa-brands fa-youtube"></i>
        </div>
        <div class="video-play-overlay">
          <div class="play-btn-circle">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>
      </div>
      <div class="video-info">
        <h4 class="video-title">${video.title}</h4>
        <div class="video-meta">
          <span class="video-views">
            <i class="fa-solid fa-eye"></i> ${video.views}
          </span>
          <span class="video-date">
            <i class="fa-solid fa-clock"></i> ${video.date}
          </span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ==========================================
   2. Content Hub Tab Switcher
   ========================================== */
function renderChannelHeader(channelKey) {
  const wrapper = document.getElementById(`${channelKey}-header-wrapper`);
  if (!wrapper) return;

  const details = {
    gaming: {
      name: "Snax Gaming",
      handle: "@SnaxGaming",
      avatar: "Snax img 1.jpg",
      url: "https://www.youtube.com/@SnaxGaming",
      videos: "1500+",
      views: "320M+",
      subsKey: "gaming_subs"
    },
    unseen: {
      name: "Snax Unseen",
      handle: "@snaxunseen",
      avatar: "SNAX Channel Banner.jpg",
      url: "https://www.youtube.com/@snaxunseen",
      videos: "580+",
      views: "108M+",
      subsKey: "unseen_subs"
    },
    maxx: {
      name: "Snax Maxx",
      handle: "@SnaxMaxx",
      avatar: "https://yt3.ggpht.com/zFoQMwW0L-OKKgae6bj05GsJu2z7dFlqC1UVkEDm3dLfrthgAwem0YeXS1pqF1G-IQX-pAo4wx0=s800-c-k-c0x00ffffff-no-rj",
      url: "https://www.youtube.com/@SnaxMaxx",
      videos: "8",
      views: "4.5M+",
      subsKey: "maxx_subs"
    }
  };

  const ch = details[channelKey];
  if (!ch) return;

  const subsFormatted = formatNumber(LIVE_STATS[ch.subsKey]);

  wrapper.innerHTML = `
    <div class="channel-header-card">
      <div class="channel-header-left">
        <div class="channel-header-avatar">
          <img src="${ch.avatar}" alt="${ch.name}">
          <span class="live-indicator-dot"></span>
        </div>
        <div class="channel-header-meta">
          <h3>${ch.name} <i class="fa-solid fa-circle-check"></i></h3>
          <p class="channel-handle">${ch.handle}</p>
        </div>
      </div>
      <div class="channel-header-stats">
        <div class="header-stat-box">
          <span class="stat-value live-subs" id="hub-live-subs-${channelKey}">${subsFormatted}</span>
          <span class="stat-label">Subscribers</span>
        </div>
        <div class="header-stat-box">
          <span class="stat-value" id="hub-views-${channelKey}">${ch.views}</span>
          <span class="stat-label">Total Views</span>
        </div>
        <div class="header-stat-box">
          <span class="stat-value">${ch.videos}</span>
          <span class="stat-label">Uploads</span>
        </div>
      </div>
      <div class="channel-header-cta">
        <a href="${ch.url}" target="_blank" class="header-subscribe-btn">
          <i class="fa-brands fa-youtube"></i> Subscribe
        </a>
      </div>
    </div>
  `;
}

function initContentTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const grids = document.querySelectorAll('.tab-content');
  const contentHub = document.getElementById('content-hub');
  const hubBgGlow = document.getElementById('hub-bg-glow');

  if (tabs.length === 0) return;

  if (contentHub) {
    contentHub.classList.add('theme-gaming');
  }

  renderChannelHeader('gaming');
  renderChannelHeader('unseen');
  renderChannelHeader('maxx');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetChannel = tab.getAttribute('data-tab');

      // Update active button
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (contentHub) {
        contentHub.classList.remove('theme-gaming', 'theme-unseen', 'theme-maxx');
        contentHub.classList.add(`theme-${targetChannel}`);
      }

      if (hubBgGlow) {
        const glowColors = {
          gaming: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
          unseen: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          maxx: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)'
        };
        hubBgGlow.style.background = glowColors[targetChannel] || glowColors.gaming;
      }

      // Update active grid display
      grids.forEach(grid => {
        if (grid.id === `${targetChannel}-content`) {
          grid.classList.add('active');
          renderVideoGrid(targetChannel, `${targetChannel}-video-grid`);
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
      updateGoalTracker();
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

function updateGoalTracker() {
  const currentSubs = LIVE_STATS.gaming_subs;
  const startTarget = 2000000;
  const endTarget = 3000000;

  const elCurrent = document.getElementById('goal-current');
  const elProgress = document.getElementById('goal-progress-fill');

  if (elCurrent && elProgress) {
    elCurrent.textContent = (currentSubs / 1000000).toFixed(2) + 'M';
    const percentage = Math.max(0, Math.min(100, ((currentSubs - startTarget) / (endTarget - startTarget)) * 100));
    elProgress.style.width = percentage + '%';
  }
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

  // Sync Content Hub stats banner in real-time
  const elHubGaming = document.getElementById('hub-live-subs-gaming');
  const elHubUnseen = document.getElementById('hub-live-subs-unseen');
  const elHubMaxx = document.getElementById('hub-live-subs-maxx');
  if (elHubGaming) updateDisplay(elHubGaming, LIVE_STATS.gaming_subs);
  if (elHubUnseen) updateDisplay(elHubUnseen, LIVE_STATS.unseen_subs);
  if (elHubMaxx) updateDisplay(elHubMaxx, LIVE_STATS.maxx_subs);

  updateGoalTracker();
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
      if (key === 'maxx' && ch.subs_raw) LIVE_STATS.maxx_subs = ch.subs_raw;
      if (key === 'kick' && ch.followers_raw) LIVE_STATS.kick_followers = ch.followers_raw;

      // Update avatar image
      if (ch.avatar) updateAvatar(key, ch.avatar);

      // Update subscriber count on channel card
      if (ch.subs_raw) updateSubsOnCard(key, ch.subs_raw);
      if (ch.followers_raw) updateSubsOnCard(key, ch.followers_raw, 'Followers');

      // Update views inside the Content Hub Header
      if (ch.views_formatted) {
        const viewsEl = document.getElementById(`hub-views-${key}`);
        if (viewsEl) viewsEl.textContent = ch.views_formatted;
      }

      // Populate video grid with real data
      if (ch.videos && ch.videos.length > 0) {
        CHANNEL_VIDEOS[key] = ch.videos;
        renderVideoGrid(key, `${key}-video-grid`);
      } else {
        renderVideoGrid(key, `${key}-video-grid`);
      }
    });

    if (data.fetched_at) {
      // YouTube's API heavily rounds subscriber counts (e.g. 2.39M comes as 2390000).
      // Since the GitHub Action fetches data daily, the "time since last fetch" resets to 0 daily,
      // causing the simulated numbers to reset back to the rounded base number every day.

      // To fix this, we use the absolute current time to calculate a continuous, deterministic offset.
      // This ensures the numbers are always slightly higher today than yesterday!
      const nowSecs = Math.floor(Date.now() / 1000);

      // modulo (%) ensures the added number never exceeds the gap of YouTube's rounding milestone.
      LIVE_STATS.gaming_subs += Math.floor(nowSecs * 0.03) % 10000;
      LIVE_STATS.unseen_subs += Math.floor(nowSecs * 0.015) % 1000;
      LIVE_STATS.maxx_subs += Math.floor(nowSecs * 0.008) % 100;
      LIVE_STATS.instagram_followers += Math.floor(nowSecs * 0.02) % 10000;
      LIVE_STATS.twitter_followers += Math.floor(nowSecs * 0.005) % 100;
      LIVE_STATS.kick_followers += Math.floor(nowSecs * 0.002) % 100;
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

  // Dynamically update the profile avatar in the Content Hub Header
  const targetHeaderAvatar = document.querySelector(`#${channelKey}-content .channel-header-avatar img`);
  if (targetHeaderAvatar && url) targetHeaderAvatar.src = url;
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

/* ==========================================
   5. Must Watch 3D Coverflow
   ========================================== */
function initCoverflow() {
  const items = document.querySelectorAll('.coverflow-item');
  const len = items.length;
  if (len === 0) return;

  let currentIndex = 0;
  let autoplayInterval;

  function updateCoverflow() {
    items.forEach((item, index) => {
      item.classList.remove('active', 'prev-1', 'prev-2', 'next-1', 'next-2');

      if (index === currentIndex) {
        item.classList.add('active');
      } else if (index === (currentIndex - 1 + len) % len) {
        item.classList.add('prev-1');
      } else if (index === (currentIndex + 1) % len) {
        item.classList.add('next-1');
      } else if (index === (currentIndex - 2 + len) % len) {
        item.classList.add('prev-2');
      } else if (index === (currentIndex + 2) % len) {
        item.classList.add('next-2');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % len;
    updateCoverflow();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + len) % len;
    updateCoverflow();
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, 2500); // Auto-swipe every 2.5s
  }

  document.getElementById('coverflow-next')?.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  document.getElementById('coverflow-prev')?.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      if (index !== currentIndex) {
        e.preventDefault(); // Prevent opening link if not active
        currentIndex = index;
        updateCoverflow();
        resetAutoplay();
      }
    });
  });

  // Initial setup
  updateCoverflow();
  resetAutoplay(); // Start autoplay
}

/* ==========================================
   6. S8UL Collab Web
   ========================================== */
function initCollabWeb() {
  const svgContainer = document.getElementById('collab-svg-container');
  const nodesContainer = document.getElementById('collab-nodes-container');
  const tooltip = document.getElementById('collab-tooltip');

  if (!svgContainer || !nodesContainer || !tooltip) return;

  const canvasParent = document.querySelector('.collab-canvas-large');
  if (canvasParent) {
    // Generate background micro-stars with randomized premium colors and glow
    const starColors = ['#ffffff', '#ffffff', '#a7f3d0', '#6ee7b7', '#34d399'];
    for (let s = 0; s < 45; s++) {
      const star = document.createElement('span');
      star.className = 'constellation-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 2 + 1; // 1px to 3px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      const chosenColor = starColors[Math.floor(Math.random() * starColors.length)];
      star.style.background = chosenColor;
      star.style.boxShadow = `0 0 ${Math.random() * 6 + 2}px ${chosenColor}`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      canvasParent.appendChild(star);
    }
  }

  const s8ulCreators = [
    { name: "8bit Goldy", img: "s8ul creators images/8bit Goldy.jpg" },
    { name: "8bit Thug", img: "s8ul creators images/8bit Thug.jpg" },
    { name: "Mortal", img: "s8ul creators images/Mortal.jpg" },
    { name: "8bit Beg4Mercy", img: "s8ul creators images/8bit Beg4Mercy.jpg" },
    { name: "8bit Binks69", img: "s8ul creators images/8bit Binks69.jpg" },
    { name: "8bit Mafia", img: "s8ul creators images/8bit Mafia.jpg" },
    { name: "8bit Mamba", img: "s8ul creators images/8bit Mamba.jpg" },
    { name: "8bit Rebel", img: "s8ul creators images/8bit Rebel.jpg" },
    { name: "8bit RusherWow", img: "s8ul creators images/8bit RusherWow.jpg" },
    { name: "Ankkita C", img: "s8ul creators images/Ankkita C.jpg" },
    { name: "City Sushi", img: "s8ul creators images/City Sushi.jpg" },
    { name: "Harshi", img: "s8ul creators images/Harshi.jpg" },
    { name: "Head Flicker", img: "s8ul creators images/Head Flicker.jpg" },
    { name: "Joker Ki Haveli", img: "s8ul creators images/Joker Ki Haveli.jpg" },
    { name: "Kaztro Gaming", img: "s8ul creators images/Kaztro Gaming.jpg" },
    { name: "Ketan K18", img: "s8ul creators images/Ketan k18.jpg" },
    { name: "Krutika Plays", img: "s8ul creators images/Krutika Plays.jpg" },
    { name: "Mavi", img: "s8ul creators images/Mavi.jpg" },
    { name: "Mazy Is Live", img: "s8ul creators images/Mazy Is Live.jpg" },
    { name: "Mili Kya Mili", img: "s8ul creators images/Mili Kya Mili.jpg" },
    { name: "Pitaji Playz", img: "s8ul creators images/Pitaji Playz.jpg" },
    { name: "Pot Head", img: "s8ul creators images/Pot Head.jpg" },
    { name: "S8UL Sid", img: "s8ul creators images/S8UL Sid.jpg" },
    { name: "Sheek Gaming", img: "s8ul creators images/Sheek Gaming.jpg" },
    { name: "Sherlock Gaming", img: "s8ul creators images/Sherlock Gaming.jpg" },
    { name: "Soul Aman", img: "s8ul creators images/Soul Aman.jpg" },
    { name: "Soul Regaltos", img: "s8ul creators images/Soul Regaltos.jpg" },
    { name: "Soul Viper", img: "s8ul creators images/Soul Viper.jpg" },
    { name: "Soul Zeref", img: "s8ul creators images/Soul Zeref.jpg" },
    { name: "Willy Gaming", img: "s8ul creators images/Willy Gaming.jpg" },
    { name: "Payal Gaming", img: "s8ul creators images/Payal Gaming.jpg" },
    { name: "8bit Juicy", img: "s8ul creators images/8bit Juicy.jpg" }
  ];

  // Distribute creators in 3 concentric rings around the center (50%)
  let creatorIndex = 0;
  const rings = [
    { count: 7, radius: 20, blur: 0, scale: 1.0 },
    { count: 11, radius: 33, blur: 0, scale: 0.95 },
    { count: 14, radius: 42, blur: 0, scale: 0.9 }
  ];

  const webLines = [];
  const activeNodes = [];

  rings.forEach((ring, ringIndex) => {
    const angleStep = (2 * Math.PI) / ring.count;
    const offsetAngle = ringIndex * 0.5;

    let firstNodeInRing = null;
    let prevNodeData = null;

    for (let i = 0; i < ring.count; i++) {
      if (creatorIndex >= s8ulCreators.length) break;

      const creatorData = s8ulCreators[creatorIndex];
      const creatorName = creatorData.name;
      const creatorId = creatorName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const angle = (i * angleStep) + offsetAngle;

      const xPos = 50 + (ring.radius * Math.cos(angle));
      const yPos = 50 + (ring.radius * Math.sin(angle));

      // 1. Create Spoke Line
      const spokeLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      spokeLine.setAttribute("class", "svg-line");
      spokeLine.setAttribute("id", `line-${creatorId}`);
      spokeLine.setAttribute("x1", "50%");
      spokeLine.setAttribute("y1", "50%");
      spokeLine.setAttribute("x2", `${xPos}%`);
      spokeLine.setAttribute("y2", `${yPos}%`);
      svgContainer.appendChild(spokeLine);

      // 2. HTML Node
      const node = document.createElement("div");
      node.className = `collab-node-large orbit-node`;

      node.style.left = `${xPos}%`;
      node.style.top = `${yPos}%`;
      node.style.filter = `blur(${ring.blur}px)`;
      node.style.transform = `translate(-50%, -50%) scale(${ring.scale})`;
      node.style.zIndex = Math.floor(10 - ring.blur);

      const randomCollabs = Math.floor(Math.random() * 80) + 5;
      node.setAttribute("data-stat", "Click over a creator to see his moments with Snax.");

      const img = document.createElement("img");
      if (creatorData.img && creatorData.img.trim() !== "") {
        img.src = creatorData.img;
      } else {
        img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=111111&color=22c55e&bold=true`;
      }
      img.alt = creatorName;
      node.appendChild(img);
      nodesContainer.appendChild(node);

      const nodeObj = {
        el: node,
        spokeLine: spokeLine,
        angle: angle,
        ring: ring,
        creatorData: creatorData,
        collabs: randomCollabs,
        xPos: xPos,
        yPos: yPos
      };

      // Draw web line to previous
      if (prevNodeData) {
        const webLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        webLine.setAttribute("class", "web-line");
        webLine.setAttribute("x1", `${prevNodeData.xPos}%`);
        webLine.setAttribute("y1", `${prevNodeData.yPos}%`);
        webLine.setAttribute("x2", `${xPos}%`);
        webLine.setAttribute("y2", `${yPos}%`);
        svgContainer.appendChild(webLine);
      }

      if (i === 0) firstNodeInRing = nodeObj;
      prevNodeData = nodeObj;
      creatorIndex++;

      // Hover events
      node.addEventListener('mouseenter', () => {
        const collabsCount = creatorCollabs[creatorName] ? creatorCollabs[creatorName].length : randomCollabs;
        if (tooltip) {
          tooltip.innerHTML = `<span class="hud-dot"></span><span class="hud-name">${creatorName}</span><span class="hud-divider">//</span><span class="hud-count">${collabsCount} COLLABS</span>`;
          tooltip.style.left = `${xPos}%`;
          tooltip.style.top = `calc(${yPos}% - 45px)`;
          tooltip.style.transform = 'translate(-50%, -50%)';
          tooltip.classList.add('visible');
        }
        spokeLine.classList.add('active-link');
        node.style.filter = 'blur(0px)';
        node.style.transform = `translate(-50%, -50%) scale(${ring.scale * 1.3})`;
        node.style.zIndex = 20;
      });

      node.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.remove('visible');
        spokeLine.classList.remove('active-link');
        node.style.filter = `blur(${ring.blur}px)`;
        node.style.transform = `translate(-50%, -50%) scale(${ring.scale})`;
        node.style.zIndex = Math.floor(10 - ring.blur);
      });

      node.addEventListener('click', () => {
        const collabsCount = creatorCollabs[creatorName] ? creatorCollabs[creatorName].length : randomCollabs;
        openCollabModal(creatorName, img.src, collabsCount);
      });
    }

    // Connect last node back to first
    if (prevNodeData && firstNodeInRing) {
      const wrapLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      wrapLine.setAttribute("class", "web-line");
      wrapLine.setAttribute("x1", `${prevNodeData.xPos}%`);
      wrapLine.setAttribute("y1", `${prevNodeData.yPos}%`);
      wrapLine.setAttribute("x2", `${firstNodeInRing.xPos}%`);
      wrapLine.setAttribute("y2", `${firstNodeInRing.yPos}%`);
      svgContainer.appendChild(wrapLine);
    }
  });

  // Snax center hover
  const snaxNode = document.querySelector('.center-node-large');
  if (snaxNode && canvasParent) {
    snaxNode.addEventListener('mouseenter', () => {
      canvasParent.classList.add('data-burst');
    });
    snaxNode.addEventListener('mouseleave', () => {
      canvasParent.classList.remove('data-burst');
    });
  }

  // Modal logic
  const modal = document.getElementById('collab-modal');
  const modalClose = document.getElementById('collab-modal-close');

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // ── HARDCODED COLLAB VIDEO DATA (fetched via YouTube API, one-time) ──
  const creatorCollabs = {
    "Joker Ki Haveli": [
      {
        id: "n0FjygmYbRw",
        title: "FEAR ENDS HERE - EP 2 FT @Jokerkihavelii",
        channel: "Snax Gaming",
        views: "1.37M",
        date: "Mar 2026",
        duration: "27:49"
      },
      {
        id: "ZMWdtcu2IHc",
        title: "Exploring Bengaluru w/ Snax | EliteHub, Food, & Fun VLOG",
        channel: "JokerKiHaveli",
        views: "692K",
        date: "Oct 2025",
        duration: "24:33"
      },
      {
        id: "bgV1DbxNiQo",
        title: "RAW LEG DAY SESSION WITH @Jokerkihavelii",
        channel: "SnaxMax",
        views: "393K",
        date: "Apr 2026",
        duration: "52:45"
      },
      {
        id: "5iy_xwBQeL4",
        title: "CARRY THE GLASS WITH @Jokerkihavelii - !insta !member",
        channel: "Snax Gaming",
        views: "384K",
        date: "Oct 2025",
        duration: "4h 21m"
      },
      {
        id: "UJtX9VpZPUI",
        title: "A Day w/ Goldy Bhai & Snax in Delhi | Food, Home Tour & Fun",
        channel: "JokerKiHaveli",
        views: "2.59M",
        date: "Jul 2025",
        duration: "36:20"
      },
      {
        id: "PzaSqyr_isE",
        title: "Bootcamp To Marine Drive In Defender | Full Masti & Massage",
        channel: "JokerKiHaveli",
        views: "1.07M",
        date: "Oct 2025",
        duration: "27:30"
      },
      {
        id: "f5Emb0uWeFQ",
        title: "S8UL ROLE CHANGING : Pappu Chai Wala",
        channel: "S8UL",
        views: "1.49M",
        date: "Sep 2025",
        duration: "32:07"
      },
      {
        id: "t3lVVylY0JY",
        title: "S8UL Throwbacks & memes that OWND the Internet!",
        channel: "Snax Gaming",
        views: "1.16M",
        date: "Dec 2025",
        duration: "22:09"
      },
      {
        id: "eOA8tSkE8gQ",
        title: "JOKER SNAX GOLDY BHAI PLAYING CHAINED TOGETHER 😂 PART 1",
        channel: "Snax Unseen",
        views: "702K",
        date: "Jul 2025",
        duration: "8:02"
      },
      {
        id: "snn-fsC6M30",
        title: "JOKER SNAX GOLDY BHAI PLAYING CHAINED TOGETHER 😂 PART 2",
        channel: "JokerClips",
        views: "438K",
        date: "Jul 2025",
        duration: "10:53"
      },
      {
        id: "75XWUzFz8OQ",
        title: "IT TAKES TWO WITH LEO GANG FT. @SnaxGaming",
        channel: "JokerKiHaveli",
        views: "76.8K",
        date: "Oct 2022",
        duration: "4h 22m"
      },
      {
        id: "gBaFPS93BXw",
        title: "S8UL ROLE CHANGING : PANI PURI WALA",
        channel: "S8UL",
        views: "1.64M",
        date: "Jul 2024",
        duration: "12:27"
      },
      {
        id: "QLkmbqf8uSE",
        title: "S8UL ROLE CHANGING : BILLU BARBER FT. @citysushifr",
        channel: "S8UL",
        views: "1.36M",
        date: "Sep 2025",
        duration: "33:26"
      },
      {
        id: "CFt9BX7llGY",
        title: "JOKER vs SNAX IRL 1V1 In BGMI ft. Boult Y1 Gaming Earbuds",
        channel: "JokerKiHaveli",
        views: "500K",
        date: "May 2024",
        duration: "13:13"
      },
      {
        id: "YTNkBl6gqUc",
        title: "BAIGAN SWING CHALLENGE FT. @SnaxGaming",
        channel: "JokerKiHaveli",
        views: "309K",
        date: "Feb 2023",
        duration: "9:06"
      }
    ]
  };

  function buildVideoCard(video) {
    return `
      <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" class="video-card">
        <div class="video-card-thumb">
          <img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}" loading="lazy">
          <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-card-info">
          <h4>${video.title}</h4>
          <span class="video-stats">${video.views} views • ${video.date}</span>
          <span class="video-channel-name">${video.channel}</span>
        </div>
      </a>
    `;
  }

  function openCollabModal(creatorName, creatorImg, collabsCount) {
    document.getElementById('collab-modal-title').textContent = creatorName;
    document.getElementById('collab-modal-img').src = creatorImg;
    const videosContainer = document.getElementById('collab-modal-videos');
    videosContainer.innerHTML = '';

    // Use real data if available
    if (creatorCollabs[creatorName]) {
      creatorCollabs[creatorName].forEach(video => {
        videosContainer.insertAdjacentHTML('beforeend', buildVideoCard(video));
      });
    } else {
      // Fallback: dummy cards for creators without data yet
      const maxVideos = Math.min(collabsCount, 6);
      for (let v = 1; v <= maxVideos; v++) {
        const views = Math.floor(Math.random() * 900) + 100;
        const months = Math.floor(Math.random() * 11) + 1;
        const videoHTML = `
          <a href="https://www.youtube.com/@SnaxGaming" target="_blank" class="video-card">
            <div class="video-card-thumb">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" alt="Thumbnail">
              <span class="video-duration">10:18</span>
            </div>
            <div class="video-card-info">
              <h4>${creatorName} & SNAX EPIC MOMENTS | BGMI HIGHLIGHTS part ${v}</h4>
              <span class="video-stats">${views}K views • ${months} months ago</span>
              <span class="video-channel-name">${creatorName}</span>
            </div>
          </a>
        `;
        videosContainer.insertAdjacentHTML('beforeend', videoHTML);
      }
    }

    modal.classList.add('active');
  }
}
