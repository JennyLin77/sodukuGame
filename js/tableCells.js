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
  const fixNumCellEls = document.querySelectorAll('.table .fix-num-cell')
  const inputNumCellEls = document.querySelectorAll('.table .input-num-cell')
  fixNumCellEls.forEach(el => { el.addEventListener('click', handleFixCell) })
  inputNumCellEls.forEach(el => { el.addEventListener('click', handleInputCell) })
}

const unbindCellEvents = () => {
  const fixNumCellEls = document.querySelectorAll('.table .fix-num-cell')
  if (fixNumCellEls) {
    const inputNumCellEls = document.querySelectorAll('.table .input-num-cell')
    fixNumCellEls.forEach(el => { el.removeEventListener('click', handleFixCell) })
    inputNumCellEls.forEach(el => { el.removeEventListener('click', handleInputCell) })
  }
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


const toggleLoadingForBody = (isAdd) => {
  const bodyEl = document.querySelector('body')
  const func = isAdd ? addClassName : removeClassName
  bodyEl.className = func(bodyEl.className, 'loading')
}

const generateTableCells = () => {
  toggleLoadingForBody(true)

  unbindCellEvents()
  initCells()

  const fillCellCount = document.querySelector('#level_detail').value
  const cellEls = document.querySelectorAll('.table .cell')

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
      cellEls[i].className = addClassName(cellEls[i].className, 'fix-num-cell')
    } else {
      cellEls[i].className = addClassName(cellEls[i].className, 'input-num-cell')
    }
  }

  lastInputCellEl = null
  bindCellEvents()

  toggleLoadingForBody(false)
}