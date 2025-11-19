const { expect } = require('chai')
const partialMatch = require('../src/utils/stringPartialMatcher')

describe('stringPartialMatcher', () => {
  it('should find exact matches', () => {
    const files = ['test1.csv', 'test2.csv', 'data.csv']
    const result = partialMatch(files, 'test1.csv')

    expect(result).to.deep.equal(['test1.csv'])
  })

  it('should find partial matches', () => {
    const files = ['test1.csv', 'test2.csv', 'data.csv']
    const result = partialMatch(files, 'test')

    expect(result).to.deep.equal(['test1.csv', 'test2.csv'])
  })

  it('should return all items when search string is empty', () => {
    const files = ['test1.csv', 'test2.csv', 'data.csv']
    const result = partialMatch(files, '')

    expect(result).to.deep.equal(files)
  })

  it('should match case insensitively', () => {
    const files = ['Test1.csv', 'TEST2.csv', 'test3.csv']
    const result = partialMatch(files, 'test')

    expect(result).to.have.lengthOf(3)
  })
})
