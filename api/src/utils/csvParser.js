function parseCSV (content, filename) {
  // se separa el contenido y se descarta la primera linea
  const rows = content.split('\n').slice(1)

  const validLines = []

  rows.forEach((row) => {
    // se separa por comas y se descarta el espacio vacio
    const fields = row.split(',').map(field => field.trim())

    const [file, text, number, hex] = fields

    // se hacen las validaciones a cada campo
    if (!file || file === '') return
    if (!text || text === '') return
    if (!number || isNaN(number)) return
    if (!hex || !/^[a-fA-F0-9]{32}$/.test(hex)) return

    // se completa el arreglo de lineas validas y se castea el string a number
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
