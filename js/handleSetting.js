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


const handleCheckOneStep = (e) => {
  isCheckEveryStep = e.target.checked

  const tableNumInputEls = document.querySelectorAll('.table .input-num-cell-input')
  if (isCheckEveryStep) {
    tableNumInputEls.forEach(el => {
      const val = +el.value
      const idx = el.dataIdx
      const { rowIdx, columnIdx } = getRowAndColumnIdx(idx)

      if (val && val !== finalCells[rowIdx][columnIdx]) {
        el.className = addClassName(el.className, 'error')
      } else {
        el.className = removeClassName(el.className, 'error')
      }
    })
  } else {
    tableNumInputEls.forEach(el => {
      el.className = removeClassName(el.className, 'error')
    })
  }
}

const handleSettingEvents = () => {
  document.querySelector('#check_every_step_radio').addEventListener('change', handleCheckOneStep)

  document.querySelector('#level').addEventListener('change', (e) => {
    initLevelDetailOption(e.target.value)
    generateTableCells()
  })

  document.querySelector('#level_detail').addEventListener('change', () => {
    generateTableCells()
  })

  document.querySelector('#restart_btn').addEventListener('click', () => {
    generateTableCells()
  })
}