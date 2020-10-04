const init = () => {
  initLevelDetailOption(1)
  generateTableCells()

  handleSettingEvents()
  handleGodOperationsEvents();

  handleInputAreaBtnEvents();
}

init();