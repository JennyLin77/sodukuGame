const handleInputNumBtn = (e) => {
  const selectedNum = +e.target.innerHTML
  if (lastInputCellEl) {
    const idx = lastInputCellEl.dataIdx
    const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)

    lastInputCellEl.innerHTML = selectedNum

    if (!isCheckEveryStep) { return; }
    if (finalCells[rowIdx][columnIdx] !== selectedNum) {
      lastInputCellEl.className = addClassName(lastInputCellEl.className, 'error')
    } else {
      lastInputCellEl.className = removeClassName(lastInputCellEl.className, 'error')
    }
  }
}
const handleInputNumBtnEvents = () => {
  const inputNumBtnEls = document.querySelectorAll('.input-area .input-num-btn')
  inputNumBtnEls.forEach(el => {
    el.addEventListener('click', handleInputNumBtn)
  })
}

const clearInputNum = () => {
  if (lastInputCellEl) {
    lastInputCellEl.innerHTML = ''
    lastInputCellEl.className = removeClassName(lastInputCellEl.className, 'error')
  }
}


const handleInputAreaBtnEvents = () => {
  handleInputNumBtnEvents()
  document.querySelector('.input-clear-btn').addEventListener('click', clearInputNum)
}