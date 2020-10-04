const validSudoku = (finalBoard) => {
  let line = init1DArray(9, 0)
  let column = init1DArray(9, 0)
  let nineCells = init2DArray(3, 3, 0)

  for (let i = 0; i < finalBoard.length; i++) {
    for (let j = 0; j < finalBoard[i].length; j++) {
      flip(line, column, nineCells, i, j, finalBoard[i][j] - 1)
    }
  }

  const validatedNum = parseInt('111111111', 2)

  for (let i = 0; i < line.length; i++) {
    if (line[i] !== validatedNum) { return false }
  }

  for (let i = 0; i < column.length; i++) {
    if (column[i] !== validatedNum) { return false }
  }

  for (let i = 0; i < nineCells.length; i++) {
    for (let j = 0; j < nineCells[i].length; j++) {
      if (nineCells[i][j] !== validatedNum) { return false }
    }
  }

  return true
}