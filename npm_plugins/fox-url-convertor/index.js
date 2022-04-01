class FoxUrlConvertor {
  constructor(options) {
    this.options = this.getConfig(options);
  }

  getConfig(options) {
    return Object.assign({
      URLchange: '%5C',
      URLto: '/'
    }, options);
  }

  setHtmlLink(compiler) {
    this.buildFiles((assets) => {
      Object.keys(assets).map((i) => {
        if (i.indexOf('.html') !== -1) { //------------------- получаем только html файлы
          let HTML = assets[i]._value.toString(); //--------- получаем html код
          const reg = new RegExp(this.options.URLchange, 'g');
          assets[i]._value = HTML.replace(reg, this.options.URLto);
        }
      });
    }, compiler, true);
  }

  buildFiles(callback, compiler, flag = false) {
    compiler.hooks.thisCompilation.tap(
      { name: 'FoxUrlConvertor' },
      (compilation) => {
        let process = compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS;
        let additional = compilation.PROCESS_ASSETS_STAGE_ADDITIONAL;
        compilation.hooks.processAssets.tap(
          {
            name: 'FoxUrlConvertor',
            stage: flag ? process : additional,
            additionalAssets: flag
          },
          callback
        );
      });
  }

  apply(compiler) {
    this.setHtmlLink(compiler);
  }
}

module.exports = FoxUrlConvertor;