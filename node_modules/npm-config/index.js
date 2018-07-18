if (process.env.npm_config_argv == undefined)
  console.error('npm-config must be run inside of an `npm run` node process');
  

module.exports = function() {
  var key = Array.prototype
                  .map.call(arguments, function(arg) { 
                    return arg.replace(/(?!\w)[\x00-\xC0]/g, '_') 
                  })
                  .join('_')
    , config = 'npm_config_' + key
    , packageConfig = 'npm_package_config_' + key
    , value = process.env[config] || process.env[packageConfig] 
  ;
  if (value === undefined)
    console.error('no default value present for', key);
  return value;
}