let lastInputCellEl = null;
let finalCells = null;
const basicFillNumCount = 16
let isCheckEveryStep = false


const addClassName = (oldClassNames, waitAddedClassName) => {
  let classNames = oldClassNames.split(' ')
  classNames = classNames.filter(className => className !== waitAddedClassName)
  if (waitAddedClassName) { classNames.push(waitAddedClassName) }
  return classNames.join(' ')
}
const removeClassName = (oldClassNames, waitRemovedClassName) => {
  let classNames = oldClassNames.split(' ')
  return classNames.filter(className => className !== waitRemovedClassName).join(' ')
}

const getRowAndColumnIdx = (idx) => {
  return {
    rowIdx: ~~(idx / 9),
    columnIdx: idx % 9,
  }
}

const init = () => {
  initLevelDetailOption(2)
  fillCells()
}

const initCells = () => {
  const tableEl = document.querySelector('#table')
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < 81; i++) {
    const divEl = document.createElement('div')
    divEl.className = 'cell'
    divEl.dataIdx = i
    fragment.appendChild(divEl)
  }
  tableEl.innerHTML = ''
  tableEl.appendChild(fragment)
}



const getRandomNum = (startNum, endNum) => {
  return ~~(Math.random() * endNum) + startNum
}
const getFinalBoard = (cells) => {
  const board = init2DArray(9, 9, 0)
  for (let i = 0; i < cells.length; i++) {
    const { rowIdx, columnIdx } = getRowAndColumnIdx(i)
    board[rowIdx][columnIdx] = cells[i]
  }

  solveSudoku(board)
  return board
}

const generateBasicBoard = () => {
  while (true) {
    const fillCellCount = basicFillNumCount
    let cells = new Array(81).fill(0)

    let line = init1DArray(9, 0)
    let column = init1DArray(9, 0)
    let nineCells = init2DArray(3, 3, 0)

    const waitFillCells = new Array(81).fill(1).map((num, idx) => idx)
    for (let fillCellIdx = 0; fillCellIdx < fillCellCount; fillCellIdx++) {
      let isFilled = false

      while (!isFilled) {
        const waitFillCellIdxNum = getRandomNum(0, waitFillCells.length - 1)
        const waitFillCellIdx = waitFillCells[waitFillCellIdxNum]

        const { rowIdx, columnIdx } = getRowAndColumnIdx(waitFillCellIdx)

        const availableInputNums = new Array(9).fill(1).map((num, idx) => idx + 1)
        while(availableInputNums.length > 0) {
          const fillNumIdx = getRandomNum(0, availableInputNums.length - 1)
          const fillNum = availableInputNums[fillNumIdx]

          const mask = ~(line[rowIdx] | column[columnIdx] | nineCells[~~(rowIdx / 3)][~~(columnIdx / 3)]) & 0x1FF
          const digit = fillNum - 1
          if ((mask & (1 << digit)) !== 0) {
            cells[waitFillCellIdx] = fillNum
            flip(line, column, nineCells, rowIdx, columnIdx, digit)
            waitFillCells.splice(waitFillCellIdxNum, 1)
            isFilled = true;
            break;
          } else {
            availableInputNums.splice(fillNumIdx, 1)
          }
        }
      }
    }

    let finalBoard = getFinalBoard(cells)
    if (validSudoku(finalBoard)) {
      finalCells = finalBoard
      return {
        alreadyFilledCellCount: fillCellCount,
        cells,
        waitFillCells,
      }
    }
  }
}
const fillCells = () => {
  initCells()

  const fillCellCount = document.querySelector('#level_detail').value
  const cellEls = document.querySelectorAll('.cell')

  let { alreadyFilledCellCount, cells, waitFillCells } = generateBasicBoard()

  const restFillCellCount = fillCellCount - alreadyFilledCellCount
  for (let fillCellIdx = 0; fillCellIdx < restFillCellCount; fillCellIdx++) {
    const waitFillCellIdxNum = getRandomNum(0, waitFillCells.length - 1)
    const waitFillCellIdx = waitFillCells[waitFillCellIdxNum]

    const { rowIdx, columnIdx } = getRowAndColumnIdx(waitFillCellIdx)

    cells[waitFillCellIdx] = finalCells[rowIdx][columnIdx]
    waitFillCells.splice(waitFillCellIdxNum, 1)
  }

  for(let i = 0; i < cells.length; i++) {
    if (cells[i] !== 0) {
      cellEls[i].innerHTML = cells[i]
      cellEls[i].className = addClassName(cellEls[i].className, 'fix-num')
    } else {
      cellEls[i].className = addClassName(cellEls[i].className, 'input-num')
    }
  }

  lastInputCellEl = null
  bindCellEvents()
}


document.querySelector('#level').addEventListener('change', (e) => {
  initLevelDetailOption(e.target.value)
  fillCells()
})
const initLevelDetailOption = (level) => {
  const levelDetail = [
    [35, 34, 33, 32, 31],
    [30, 29, 28, 27, 26, 25, 24, 23],
    [22, 21, 20, 19, 18, 17],
  ]
  const options = levelDetail[+level]

  const levelDetailEl = document.querySelector('#level_detail')
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < options.length; i++) {
    const optionEl = document.createElement('option')
    optionEl.value = options[i]
    optionEl.innerHTML = options[i]
    fragment.appendChild(optionEl)
  }
  levelDetailEl.innerHTML = ''
  levelDetailEl.appendChild(fragment)
}

document.querySelector('#level_detail').addEventListener('change', () => {
  fillCells()
})

document.querySelector('#restart_btn').addEventListener('click', () => {
  fillCells()
})


const toggleInputArea = (isShow) => {
  document.querySelector('.input-area').style.visibility = isShow ? 'visible' : 'hidden'
}

const removeCurForLastInputCell = () => {
  if (lastInputCellEl) {
    lastInputCellEl.className = removeClassName(lastInputCellEl.className, 'cur')
    lastInputCellEl = null
  }
}

const handleInputCell = (e) => {
  toggleInputArea(true);
  const el = e.target

  removeCurForLastInputCell()

  lastInputCellEl = el
  el.className = addClassName(el.className, 'cur')
}

const handleFixCell = (e) => {
  toggleInputArea(false)
  removeCurForLastInputCell()
}

const bindCellEvents = () => {
  const fixNumEls = document.querySelectorAll('.table .fix-num')
  const inputNumEls = document.querySelectorAll('.table .input-num')
  fixNumEls.forEach(el => { el.addEventListener('click', handleFixCell) })
  inputNumEls.forEach(el => { el.addEventListener('click', handleInputCell) })
}

const unbindCellEvents = () => {
  const fixNumEls = document.querySelectorAll('.table .fix-num')
  if (fixNumEls) {
    const inputNumEls = document.querySelectorAll('.table .input-num')
    fixNumEls.forEach(el => { el.removeEventListener('click', handleFixCell) })
    inputNumEls.forEach(el => { el.removeEventListener('click', handleInputCell) })
  }
}


const handleInputNum = (e) => {
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
const handleInputNumEvents = () => {
  const inputNumEls = document.querySelectorAll('.input-num')
  inputNumEls.forEach(el => {
    el.addEventListener('click', handleInputNum)
  })
}
handleInputNumEvents()


const clearInputNum = () => {
  if (lastInputCellEl) {
    lastInputCellEl.innerHTML = ''
    lastInputCellEl.className = removeClassName(lastInputCellEl.className, 'error')
  }
}
document.querySelector('.input-clear').addEventListener('click', clearInputNum)


const oneClickType = {
  filling: 1,
  clear: 2,
}
const handleOneClickFillingOrClear = (type) => {
  removeCurForLastInputCell()

  const inputNumEls = document.querySelectorAll('.table .input-num')
  inputNumEls.forEach(el => {
    const idx = el.dataIdx
    const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)
    el.innerHTML = type === oneClickType.filling ? finalCells[rowIdx][columnIdx] : ''
    el.className = removeClassName(el.className, 'error')
  })
}
document.querySelector('.one-click-filling-btn').addEventListener('click', () => handleOneClickFillingOrClear(oneClickType.filling))
document.querySelector('.one-click-clear-btn').addEventListener('click', () => handleOneClickFillingOrClear(oneClickType.clear))

const handleCheckOneStep = (e) => {
  isCheckEveryStep = e.target.checked

  const inputNumEls = document.querySelectorAll('.table .input-num')
  if (isCheckEveryStep) {
    inputNumEls.forEach(el => {
      const val = +el.innerHTML
      const idx = el.dataIdx
      const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)

      if (val && val !== finalCells[rowIdx][columnIdx]) {
        el.className = addClassName(el.className, 'error')
      } else {
        el.className = removeClassName(el.className, 'error')
      }
    })
  } else {
    inputNumEls.forEach(el => {
      el.className = removeClassName(el.className, 'error')
    })
  }
}
document.querySelector('#check_every_step_radio').addEventListener('change', handleCheckOneStep)


const handleCheck = () => {
  const checkResultTipEl = document.querySelector('.check-result')
  const checkMarkResultTipEl = document.querySelector('.check-mark-result')
  const inputNumEls = document.querySelectorAll('.table .input-num')

  let isValid = true
  for (let i = 0; i < inputNumEls.length; i++) {
    const el = inputNumEls[i]
    const val = +el.innerHTML
    const idx = el.dataIdx
    const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)
    if (val !== finalCells[rowIdx][columnIdx]) {
      isValid = false
    }
    el.className = removeClassName(el.className, 'error')
  }

  if (isValid) {
    checkResultTipEl.innerHTML = 'Good job.'
    checkResultTipEl.className = 'check-result green'
    checkMarkResultTipEl.innerHTML = ''
  } else {
    checkResultTipEl.innerHTML = 'You failed. Check again.'
    checkResultTipEl.className = 'check-result red'
    checkMarkResultTipEl.innerHTML = ''
  }
}
const handleCheckAndMark = () => {
  const checkResultTipEl = document.querySelector('.check-result')
  const checkMarkResultTipEl = document.querySelector('.check-mark-result')
  const inputNumEls = document.querySelectorAll('.table .input-num')

  let isValid = true
  for (let i = 0; i < inputNumEls.length; i++) {
    const el = inputNumEls[i]
    const val = +el.innerHTML
    const idx = el.dataIdx
    const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)
    if (val !== finalCells[rowIdx][columnIdx]) {
      el.className = addClassName(el.className, 'error')
      isValid = false
    } else {
      el.className = removeClassName(el.className, 'error')
    }
  }

  if (isValid) {
    checkMarkResultTipEl.innerHTML = 'Good job.'
    checkMarkResultTipEl.className = 'check-mark-result green'
    checkResultTipEl.innerHTML = ''
  } else {
    checkMarkResultTipEl.innerHTML = 'You failed. Check again.'
    checkMarkResultTipEl.className = 'check-mark-result red'
    checkResultTipEl.innerHTML = ''
  }
}
document.querySelector('.check-btn').addEventListener('click', handleCheck)
document.querySelector('.check-mark-btn').addEventListener('click', handleCheckAndMark)


init();