function parseCSV (content, filename) {
  const rows = content.split('\n').slice(1)
  const validLines = []

  rows.forEach((row) => {
    const [file, text, number, hex] = row.split(',')

    if (!file || file === '') return
    if (!text || text === '') return
    if (!number || isNaN(number)) return
    if (!hex || !/^[a-fA-F0-9]{32}$/.test(hex)) return

    validLines.push({
      text,
      number: Number(number),
      hex
    })
  })

  return {
    file: filename,
    lines: validLines
  }
}

module.exports = parseCSV
