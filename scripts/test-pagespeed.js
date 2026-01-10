/**
 * PageSpeed Insights Test Script
 * 
 * Testet die Performance der Website mit Google PageSpeed Insights API
 * 
 * Usage:
 *   npm run test-pagespeed
 * 
 * Oder mit API Key:
 *   PAGESPEED_API_KEY=your-key npm run test-pagespeed
 */

const https = require('https');

const SITE_URL = process.env.SITE_URL || 'https://www.ahmetoezay.de';
const API_KEY = process.env.PAGESPEED_API_KEY || null;
const LOCALE = process.env.LOCALE || 'de';

// PageSpeed Insights API URL
const API_URL = API_KEY 
  ? `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL + '/' + LOCALE)}&key=${API_KEY}&category=performance&category=accessibility&category=best-practices&category=seo`
  : `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL + '/' + LOCALE)}&category=performance&category=accessibility&category=best-practices&category=seo`;

function fetchPageSpeed(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function formatScore(score) {
  if (score === null || score === undefined) return 'N/A';
  return Math.round(score * 100);
}

function formatMetric(value) {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') {
    return `${value.toFixed(2)}s`;
  }
  return value;
}

async function runTest() {
  console.log('🚀 PageSpeed Insights Test\n');
  console.log(`📊 Testing: ${SITE_URL}/${LOCALE}\n`);

  if (!API_KEY) {
    console.log('⚠️  No API Key provided. Using public API (limited requests).');
    console.log('   Set PAGESPEED_API_KEY environment variable for unlimited requests.\n');
  }

  try {
    const result = await fetchPageSpeed(API_URL);

    if (result.error) {
      console.error('❌ API Error:', result.error.message);
      if (result.error.message.includes('INVALID_URL')) {
        console.error('   Make sure the URL is accessible and publicly available.');
      }
      process.exit(1);
    }

    const lighthouse = result.lighthouseResult;
    const categories = lighthouse.categories;
    const audits = lighthouse.audits;

    // Scores
    console.log('📈 Lighthouse Scores:\n');
    console.log(`   Performance:     ${formatScore(categories.performance?.score)}/100`);
    console.log(`   Accessibility:   ${formatScore(categories.accessibility?.score)}/100`);
    console.log(`   Best Practices:  ${formatScore(categories['best-practices']?.score)}/100`);
    console.log(`   SEO:             ${formatScore(categories.seo?.score)}/100\n`);

    // Core Web Vitals
    console.log('⚡ Core Web Vitals:\n');
    const lcp = audits['largest-contentful-paint'];
    const fid = audits['max-potential-fid'];
    const cls = audits['cumulative-layout-shift'];
    const fcp = audits['first-contentful-paint'];
    const tti = audits['interactive'];
    const tbt = audits['total-blocking-time'];
    const speedIndex = audits['speed-index'];

    console.log(`   LCP (Largest Contentful Paint):  ${formatMetric(lcp?.numericValue)} ${lcp?.displayValue || ''}`);
    console.log(`   FID (First Input Delay):         ${formatMetric(fid?.numericValue)} ${fid?.displayValue || ''}`);
    console.log(`   CLS (Cumulative Layout Shift):   ${formatMetric(cls?.numericValue)} ${cls?.displayValue || ''}`);
    console.log(`   FCP (First Contentful Paint):     ${formatMetric(fcp?.numericValue)} ${fcp?.displayValue || ''}`);
    console.log(`   TTI (Time to Interactive):        ${formatMetric(tti?.numericValue)} ${tti?.displayValue || ''}`);
    console.log(`   TBT (Total Blocking Time):         ${formatMetric(tbt?.numericValue)} ${tbt?.displayValue || ''}`);
    console.log(`   Speed Index:                      ${formatMetric(speedIndex?.numericValue)} ${speedIndex?.displayValue || ''}\n`);

    // Opportunities
    const opportunities = Object.values(audits)
      .filter(audit => audit.details?.type === 'opportunity' && audit.numericValue > 0)
      .sort((a, b) => b.numericValue - a.numericValue)
      .slice(0, 10);

    if (opportunities.length > 0) {
      console.log('💡 Top Performance Opportunities:\n');
      opportunities.forEach((audit, index) => {
        const savings = audit.numericValue > 0 ? ` (save ${formatMetric(audit.numericValue)})` : '';
        console.log(`   ${index + 1}. ${audit.title}${savings}`);
      });
      console.log('');
    }

    // Diagnostics
    const diagnostics = Object.values(audits)
      .filter(audit => audit.details?.type === 'diagnostic' && audit.score !== null && audit.score < 0.9)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    if (diagnostics.length > 0) {
      console.log('🔍 Performance Diagnostics:\n');
      diagnostics.forEach((audit, index) => {
        console.log(`   ${index + 1}. ${audit.title} (Score: ${formatScore(audit.score)})`);
      });
      console.log('');
    }

    // Summary
    const performanceScore = formatScore(categories.performance?.score);
    console.log('📊 Summary:\n');
    if (performanceScore >= 90) {
      console.log('   ✅ Excellent performance!');
    } else if (performanceScore >= 50) {
      console.log('   ⚠️  Good performance, but there is room for improvement.');
    } else {
      console.log('   ❌ Performance needs significant improvement.');
    }
    console.log(`\n   Full report: ${result.id ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL + '/' + LOCALE)}` : 'N/A'}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('   Check your internet connection and API availability.');
    }
    process.exit(1);
  }
}

runTest();
