const getInputNumAndResultTipEls = () => {
  return {
    checkResultTipEl: document.querySelector('.check-result'),
    checkMarkResultTipEl: document.querySelector('.check-mark-result'),
    tableNumInputEls: document.querySelectorAll('.table .input-num-cell-input'),
  }
}
const getValAndRowIdxAndColumnIdx = (el) => {
  const idx = el.dataIdx
  const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)

  return {
    val: +el.value,
    rowIdx,
    columnIdx,
  }
}
const handleResultTip = (isValid, updateEl, clearEl, className) => {
  if (isValid) {
    updateEl.innerHTML = successTip
    updateEl.className = `${className} ${successTipClassName}`
  } else {
    updateEl.innerHTML = failedTip
    updateEl.className = `${className} ${failedTipClassName}`
  }
  clearEl.innerHTML = ''
}
const handleCheck = () => {
  toggleInputArea(false);
  removeCurForLastInputCell()

  const {
    checkResultTipEl,
    checkMarkResultTipEl,
    tableNumInputEls,
  } = getInputNumAndResultTipEls()

  let isValid = true
  for (let i = 0; i < tableNumInputEls.length; i++) {
    const el = tableNumInputEls[i]
    const { val, rowIdx, columnIdx } = getValAndRowIdxAndColumnIdx(el)

    if (val !== finalCells[rowIdx][columnIdx]) {
      isValid = false
    }
    el.className = removeClassName(el.className, 'error')
  }

  handleResultTip(isValid, checkResultTipEl, checkMarkResultTipEl, 'check-result')
}
const handleCheckAndMark = () => {
  toggleInputArea(false);
  removeCurForLastInputCell()

  const {
    checkResultTipEl,
    checkMarkResultTipEl,
    tableNumInputEls,
  } = getInputNumAndResultTipEls()

  let isValid = true
  for (let i = 0; i < tableNumInputEls.length; i++) {
    const el = tableNumInputEls[i]
    const { val, rowIdx, columnIdx } = getValAndRowIdxAndColumnIdx(el)

    if (val !== finalCells[rowIdx][columnIdx]) {
      el.className = addClassName(el.className, 'error')
      isValid = false
    } else {
      el.className = removeClassName(el.className, 'error')
    }
  }

  handleResultTip(isValid, checkMarkResultTipEl, checkResultTipEl, 'check-mark-result')
}



const oneClickType = {
  filling: 1,
  clear: 2,
}
const handleOneClickFillingOrClear = (type) => {
  toggleInputArea(false);
  removeCurForLastInputCell()

  const tableNumInputEls = document.querySelectorAll('.table .input-num-cell-input')
  tableNumInputEls.forEach(el => {
    const idx = el.dataIdx
    const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)
    el.value = type === oneClickType.filling ? finalCells[rowIdx][columnIdx] : ''
    el.className = removeClassName(el.className, 'error')
  })
}


const handleGodOperationsEvents = () => {
  document.querySelector('.check-btn').addEventListener('click', handleCheck)
  document.querySelector('.check-mark-btn').addEventListener('click', handleCheckAndMark)

  document.querySelector('.one-click-filling-btn').addEventListener('click', () => handleOneClickFillingOrClear(oneClickType.filling))
  document.querySelector('.one-click-clear-btn').addEventListener('click', () => handleOneClickFillingOrClear(oneClickType.clear))
}