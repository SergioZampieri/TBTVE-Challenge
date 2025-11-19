const { expect } = require('chai')
const parseCSV = require('../src/utils/csvParser')

describe('csvParser', () => {
  it('should parse valid CSV with single row', () => {
    const csvContent = `file,text,number,hex
test1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765`

    const result = parseCSV(csvContent, 'test1.csv')

    expect(result).to.deep.equal({
      file: 'test1.csv',
      lines: [
        {
          text: 'RgTya',
          number: 64075909,
          hex: '70ad29aacf0b690b0467fe2b2767f765'
        }
      ]
    })
  })

  it('should parse valid CSV with multiple rows', () => {
    const csvContent = `file,text,number,hex
test1.csv,Line1,123,12345678901234567890123456789012
test1.csv,Line2,456,abcdefabcdefabcdefabcdefabcdefab`

    const result = parseCSV(csvContent, 'test1.csv')

    expect(result.lines).to.have.lengthOf(2)
    expect(result.lines[0].text).to.equal('Line1')
    expect(result.lines[1].text).to.equal('Line2')
  })

  it('should trim whitespace from fields', () => {
    const csvContent = `file,text,number,hex
test.csv,  SpacedText  ,  999  ,  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  `

    const result = parseCSV(csvContent, 'test.csv')

    expect(result.lines[0].text).to.equal('SpacedText')
    expect(result.lines[0].number).to.equal(999)
    expect(result.lines[0].hex).to.equal('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  })

  it('should skip rows with invalid number (NaN)', () => {
    const csvContent = `file,text,number,hex
test.csv,Text1,notanumber,12345678901234567890123456789012
test.csv,Text2,456,abcdefabcdefabcdefabcdefabcdefab`

    const result = parseCSV(csvContent, 'test.csv')

    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0].text).to.equal('Text2')
  })

  it('should skip rows with invalid hex (not 32 chars or non-hex characters)', () => {
    const csvContent = `file,text,number,hex
test.csv,Text1,123,short
test.csv,Text2,456,ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
test.csv,Text3,789,12345678901234567890123456789012`

    const result = parseCSV(csvContent, 'test.csv')

    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0].text).to.equal('Text3')
  })

  it('should return empty lines array for empty content', () => {
    const csvContent = ''

    const result = parseCSV(csvContent, 'test.csv')

    expect(result).to.deep.equal({
      file: 'test.csv',
      lines: []
    })
  })
})
