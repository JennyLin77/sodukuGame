const handleInputNumBtn = (e) => {
  const selectedNum = +e.target.innerHTML
  handleInputNum(selectedNum)
}

const handleInputNumBtnEvents = () => {
  const inputNumBtnEls = document.querySelectorAll('.input-area .input-num-btn')
  inputNumBtnEls.forEach(el => {
    el.addEventListener('click', handleInputNumBtn)
  })
}


const clearInputNum = () => {
  if (lastTableNumInputEl) {
    lastTableNumInputEl.value = ''
    lastTableNumInputEl.className = removeClassName(lastTableNumInputEl.className, 'error')
  }
}

const handleInputAreaBtnEvents = () => {
  handleInputNumBtnEvents()
  document.querySelector('.input-clear-btn').addEventListener('click', clearInputNum)
}