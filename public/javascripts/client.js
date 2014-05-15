(function (window, document, undefined) {
  function botAdapterSelected (event) {
    // show right template and hide others
    var selectedOption  = this.selectedOptions[0],
        selectedConfig  = document.querySelector('fieldset.' + selectedOption.value),
        displayedConfig = document.querySelector('.is-displayed');

    if (displayedConfig) {
      displayedConfig.classList.remove('is-displayed');
      displayedConfig.disabled = true;
    }
    selectedConfig.classList.add('is-displayed');
    selectedConfig.disabled = false;
  }

  function disableAllConfigs () {
    var configs = document.querySelectorAll('.config');
    Array.prototype.map.call(configs, function (conf) { conf.disabled = true });
  }

  /**
   * Initializers
   */
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.bots-new')) {
      // bots/new
      var select = document.querySelector('select');
      select.addEventListener('change', botAdapterSelected);
      disableAllConfigs();
    }
  });

})(window, document);