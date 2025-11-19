const { expect } = require('chai')
const axios = require('axios')

// Mock axios instance before requiring the service
const originalCreate = axios.create
let mockAxiosInstance

describe('file.service', () => {
  let fileService
  let cache

  beforeEach(() => {
    // Reset modules and mocks before each test
    delete require.cache[require.resolve('../src/services/file.service')]
    delete require.cache[require.resolve('../src/utils/cache')]

    // Create mock axios instance
    mockAxiosInstance = {
      get: async () => {}
    }

    // Mock create to return mock instance
    axios.create = () => mockAxiosInstance

    // Clear cache before each test
    cache = require('../src/utils/cache')
    cache.clear()

    // Require service after mocks are set up
    fileService = require('../src/services/file.service')
  })

  afterEach(() => {
    // Restore original create
    axios.create = originalCreate
  })

  it('should fetch and return filenames from external API', async () => {
    mockAxiosInstance.get = async () => ({
      data: {
        files: ['test1.csv', 'test2.csv', 'test3.csv']
      }
    })

    const result = await fileService.getFilenames()

    expect(result).to.deep.equal(['test1.csv', 'test2.csv', 'test3.csv'])
  })

  it('should return empty array when API returns no files', async () => {
    mockAxiosInstance.get = async () => ({
      data: { files: [] }
    })

    const result = await fileService.getFilenames()

    expect(result).to.deep.equal([])
  })

  it('should fetch and parse file content from external API', async () => {
    mockAxiosInstance.get = async () => ({
      data: `file,text,number,hex
test.csv,Line1,123,12345678901234567890123456789012`
    })

    const result = await fileService.getFileContent('test.csv')

    expect(result).to.have.property('file', 'test.csv')
    expect(result).to.have.property('lines')
    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0]).to.deep.equal({
      text: 'Line1',
      number: 123,
      hex: '12345678901234567890123456789012'
    })
  })

  it('should return error object when file fetch fails', async () => {
    mockAxiosInstance.get = async () => {
      throw new Error('File not found')
    }

    const result = await fileService.getFileContent('missing.csv')

    expect(result).to.have.property('file', 'missing.csv')
    expect(result).to.have.property('error', 'File not found')
    expect(result).to.have.property('lines')
    expect(result.lines).to.deep.equal([])
  })

  it('should cache filenames after first fetch', async () => {
    let callCount = 0
    mockAxiosInstance.get = async () => {
      callCount++
      return { data: { files: ['cached.csv'] } }
    }

    // First call => should fetch from API
    const result1 = await fileService.getFilenames()
    expect(callCount).to.equal(1)

    // Second call => should use cache
    const result2 = await fileService.getFilenames()
    expect(callCount).to.equal(1) // Still 1, not 2

    expect(result1).to.deep.equal(result2)
  })
})
