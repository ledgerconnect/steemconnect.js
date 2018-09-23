module.exports = {
  *cjs(task) {
    yield task.source('src/*.json').target('lib');
    yield task
      .source('src/*.js')
      .babel()
      .target('lib');
  },
};
