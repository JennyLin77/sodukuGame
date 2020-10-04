const waitFillSign = 0

const handleFilledNum = (num) => {
  // return String(num)
  return num
}

const init1DArray = (xLen, initVal) => {
  return new Array(xLen).fill(initVal)
}

const init2DArray = (xLen, yLen, initVal) => {
  return new Array(xLen).fill(null).map(elem => new Array(yLen).fill(initVal))
}

const flip = (line, column, nineCells, rowIdx, columnIdx, digit) => {
  // 原先9个数字是否已存在，直接用1个数字表示，9位2进制的0/1来表示是否存在，1代表已存在，根据位操作来代替之前的判断以节省空间
  // 想把数字7切换下状态，比如从0变为1（已存在），假设原先数字 '0 0000 1010' ^=(异或) '0 0100 0000' -> '0 0100 1010'
  // 然后怎么得到异或右边的数 '0 0100 0000'，1左移6位不就得到了
  line[rowIdx] ^= (1 << digit)
  column[columnIdx] ^= (1 << digit)
  nineCells[~~(rowIdx / 3)][~~(columnIdx / 3)] ^= (1 << digit)
}

const dfs = (arr, waitInputCells, line, column, nineCells, isValidInfo, waitInputCellsIdx) => {
  if (waitInputCellsIdx === waitInputCells.length) {
    isValidInfo.isValid = true;
    return;
  }

  let { rowIdx, columnIdx } = waitInputCells[waitInputCellsIdx]
  // 得到一个数字，把它转成二进制数，会发现如果从右往左如果第2位为1，则代表2是一个可以尝试填的数，没被其他行列九格占用
  // 如果得到数字11('0 0000 1011')，代表1/2/4都是可填的数字
  //  & 0x1FF：是为了去掉第10/11位乃至更高位的数字1，把刚取反误操作的1重新变为0
  let mask = ~(line[rowIdx] | column[columnIdx] | nineCells[~~(rowIdx / 3)][~~(columnIdx / 3)]) & 0x1FF
  // mask &= (mask - 1): 去掉最低一位的1，因为刚刚已经处理过这个最低一位的1了
  for (; mask !== 0 && !isValidInfo.isValid; mask &= (mask - 1)) {
    // 拿到最低一位的1，比如 '0 0000 1100'(12) -> '0 0000 0100'(4)，可推出3可尝试填，传给flip的digit是2，左移2位
    const digitMask = mask & (-mask)
    const digit = digitMask.toString(2).length - 1
    flip(line, column, nineCells, rowIdx, columnIdx, digit)
    arr[rowIdx][columnIdx] = handleFilledNum(digit + 1)
    dfs(arr, waitInputCells, line, column, nineCells, isValidInfo, waitInputCellsIdx + 1)
    flip(line, column, nineCells, rowIdx, columnIdx, digit)
  }
};


/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  let line = init1DArray(9, 0)
  let column = init1DArray(9, 0)
  let nineCells = init2DArray(3, 3, 0)
  let waitInputCells = []
  let isValidInfo = { isValid: false }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = board[i][j]
      if (val === waitFillSign) {
        waitInputCells.push({
          rowIdx: i,
          columnIdx: j,
        })
      } else {
        flip(line, column, nineCells, i, j, val - 1)
      }
    }
  }

  while (true) {
    let isModified = false
    for (let cellIdx = 0; cellIdx < waitInputCells.length; cellIdx++) {
      const { rowIdx, columnIdx} = waitInputCells[cellIdx]
      const mask = ~(line[rowIdx] | column[columnIdx] | nineCells[~~(rowIdx / 3)][~~(columnIdx / 3)]) & 0x1FF
      if (mask & (mask - 1) === 0) {
        const digit = mask.toString(2).length - 1
        flip(line, column, nineCells, rowIdx, columnIdx, digit)
        board[rowIdx][columnIdx] = handleFilledNum(digit + 1)
        isModified = true
        waitInputCells.splice(cellIdx, 1)
        cellIdx--
      }
    }
    if (!isModified) { break }
  }

  dfs(board, waitInputCells, line, column, nineCells, isValidInfo, 0)
};