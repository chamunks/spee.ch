const Handlebars = require('handlebars');
const config = require('../config/speechConfig.js');

module.exports = {
  googleAnalytics () {
    const googleApiKey = config.analytics.googleId;
    const gaCode = `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', '${googleApiKey}', 'auto');
        ga('send', 'pageview');</script>`;
    return new Handlebars.SafeString(gaCode);
  },
  addOpenGraph ({ ogTitle, contentType, ogDescription, thumbnail, showUrl, source }) {
    const ogTitleTag = `<meta property="og:title" content="${ogTitle}" >`;
    const ogUrlTag = `<meta property="og:url" content="${showUrl}" >`;
    const ogSiteNameTag = `<meta property="og:site_name" content="Spee.ch" >`;
    const ogDescriptionTag = `<meta property="og:description" content="${ogDescription}" >`;
    const ogImageWidthTag = '<meta property="og:image:width" content="600" >';
    const ogImageHeightTag = '<meta property="og:image:height" content="315" >';
    const basicTags = `${ogTitleTag} ${ogUrlTag} ${ogSiteNameTag} ${ogDescriptionTag} ${ogImageWidthTag} ${ogImageHeightTag}`;
    let ogImageTag = `<meta property="og:image" content="${source}" >`;
    let ogImageTypeTag = `<meta property="og:image:type" content="${contentType}" >`;
    let ogTypeTag = `<meta property="og:type" content="article" >`;
    if (contentType === 'video/mp4') {
      const ogVideoTag = `<meta property="og:video" content="${source}" >`;
      const ogVideoSecureUrlTag = `<meta property="og:video:secure_url" content="${source}" >`;
      const ogVideoTypeTag = `<meta property="og:video:type" content="${contentType}" >`;
      ogImageTag = `<meta property="og:image" content="${thumbnail}" >`;
      // ogImageTypeTag = `<meta property="og:image:type" content="image/png" >`;  // note: might not be png.  needs to check if gif or jpg etc depending on thubmnail
      ogTypeTag = `<meta property="og:type" content="video" >`;
      return new Handlebars.SafeString(`${basicTags} ${ogImageTag} ${ogImageTypeTag} ${ogTypeTag} ${ogVideoTag} ${ogVideoSecureUrlTag} ${ogVideoTypeTag}`);
    } else {
      if (contentType === 'image/gif') {
        ogTypeTag = `<meta property="og:type" content="video.other" >`;
      };
      return new Handlebars.SafeString(`${basicTags} ${ogImageTag} ${ogImageTypeTag} ${ogTypeTag}`);
    }
  },
  addTwitterCard ({ contentType, source, embedUrl, directFileUrl }) {
    const basicTwitterTags = `<meta name="twitter:site" content="@spee_ch" >`;
    if (contentType === 'video/mp4') {
      const twitterName = '<meta name="twitter:card" content="player" >';
      const twitterPlayer = `<meta name="twitter:player" content="${embedUrl}" >`;
      const twitterPlayerWidth = '<meta name="twitter:player:width" content="600" >';
      const twitterTextPlayerWidth = '<meta name="twitter:text:player_width" content="600" >';
      const twitterPlayerHeight = '<meta name="twitter:player:height" content="337" >';
      const twitterPlayerStream = `<meta name="twitter:player:stream" content="${directFileUrl}" >`;
      const twitterPlayerStreamContentType = '<meta name="twitter:player:stream:content_type" content="video/mp4" >';
      return new Handlebars.SafeString(`${basicTwitterTags} ${twitterName} ${twitterPlayer} ${twitterPlayerWidth} ${twitterTextPlayerWidth} ${twitterPlayerHeight} ${twitterPlayerStream} ${twitterPlayerStreamContentType}`);
    } else {
      const twitterCard = '<meta name="twitter:card" content="summary_large_image" >';
      return new Handlebars.SafeString(`${basicTwitterTags} ${twitterCard}`);
    }
  },
  ifConditional (varOne, operator, varTwo, options) {
    switch (operator) {
      case '===':
        return (varOne === varTwo) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (varOne !== varTwo) ? options.fn(this) : options.inverse(this);
      case '<':
        return (varOne < varTwo) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (varOne <= varTwo) ? options.fn(this) : options.inverse(this);
      case '>':
        return (varOne > varTwo) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (varOne >= varTwo) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (varOne && varTwo) ? options.fn(this) : options.inverse(this);
      case '||':
        return (varOne || varTwo) ? options.fn(this) : options.inverse(this);
      case 'mod3':
        return ((parseInt(varOne) % 3) === 0) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },
};
