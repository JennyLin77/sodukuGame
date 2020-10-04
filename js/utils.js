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


const getRandomNum = (startNum, endNum) => {
  return ~~(Math.random() * endNum) + startNum
}