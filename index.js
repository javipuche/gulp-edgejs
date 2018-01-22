const through = require('through2')
const PluginError = require('plugin-error')
const edge = require('edge.js')

module.exports = function ({path, data: shareData} = {}) {
  return through.obj((file, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      return cb(new PluginError('gulp-edgejs', 'Streaming not supported!'))
    }

    const data = Object.assign({}, shareData, file.data)
    edge.registerViews(path || file.base)

    try {
      file.contents = Buffer.from(edge.renderString(file.contents.toString(), data))
    } catch (error) {
      return cb(new PluginError('gulp-edgejs', error))
    }

    cb(null, file)
  })
}