var marked  = require('marked')
  , fs      = require('fs')
  , util    = require('util')
  , wrench = require('wrench')
  , markdown = fs.readFileSync('./src/01Manifest.md', 'utf8')
  , html     = fs.readFileSync('./base.html', 'utf8')
  ;
marked(markdown, function (err, data) {

    if (err) {
        return console.log('marked err', err);
      }
    fs.writeFileSync('./html/index.html',util.format(html, data), 'utf8')
    wrench.copyDirSyncRecursive('./assets', './html/assets', {
      forceDelete: true,
      excludeHiddenUnix: true
  });
    console.log('done');
});

