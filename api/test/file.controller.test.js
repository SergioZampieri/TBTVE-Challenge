const { expect } = require('chai')

describe('file.controller', () => {
  let fileController
  let fileService
  let req, res, next

  beforeEach(() => {
    // Clear module cache
    delete require.cache[require.resolve('../src/controllers/file.controller')]
    delete require.cache[require.resolve('../src/services/file.service')]

    // Create mock request, response, and next objects
    req = {
      query: {}
    }

    res = {
      statusCode: null,
      jsonData: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.jsonData = data
        return this
      }
    }

    next = (err) => {
      next.called = true
      next.error = err
    }
    next.called = false
    next.error = null

    // Mock file service
    fileService = {
      getFilenames: async () => [],
      getFileContent: async () => ({})
    }

    // Replace the real service with mock
    require.cache[require.resolve('../src/services/file.service')] = {
      exports: fileService
    }

    // Require controller after mocks are set up
    fileController = require('../src/controllers/file.controller')
  })

  describe('getList', () => {
    it('should return list of filenames with 200 status', async () => {
      fileService.getFilenames = async () => ['test1.csv', 'test2.csv']

      await fileController.getList(req, res, next)

      expect(res.statusCode).to.equal(200)
      expect(res.jsonData).to.deep.equal(['test1.csv', 'test2.csv'])
      expect(next.called).to.be.false
    })

    it('should return empty array when no files available', async () => {
      fileService.getFilenames = async () => []

      await fileController.getList(req, res, next)

      expect(res.statusCode).to.equal(200)
      expect(res.jsonData).to.deep.equal([])
    })

    it('should call next with error when service fails', async () => {
      const error = new Error('Service error')
      fileService.getFilenames = async () => {
        throw error
      }

      await fileController.getList(req, res, next)

      expect(next.called).to.be.true
      expect(next.error).to.equal(error)
    })
  })

  describe('getFormattedData', () => {
    it('should return all files data when no filter provided', async () => {
      fileService.getFilenames = async () => ['test1.csv']
      fileService.getFileContent = async (filename) => ({
        file: filename,
        lines: [{ text: 'data', number: 123, hex: '12345678901234567890123456789012' }]
      })

      await fileController.getFormattedData(req, res, next)

      expect(res.statusCode).to.equal(200)
      expect(res.jsonData).to.have.lengthOf(1)
      expect(res.jsonData[0].file).to.equal('test1.csv')
      expect(res.jsonData[0].lines).to.have.lengthOf(1)
    })

    it('should filter files by fileName query parameter', async () => {
      req.query.fileName = 'test'
      fileService.getFilenames = async () => ['test1.csv', 'test2.csv', 'data.csv']
      fileService.getFileContent = async (filename) => ({
        file: filename,
        lines: [{ text: 'data', number: 123, hex: '12345678901234567890123456789012' }]
      })

      await fileController.getFormattedData(req, res, next)

      expect(res.statusCode).to.equal(200)
      expect(res.jsonData).to.have.lengthOf(2)
      expect(res.jsonData[0].file).to.equal('test1.csv')
      expect(res.jsonData[1].file).to.equal('test2.csv')
    })

    it('should exclude files with errors', async () => {
      fileService.getFilenames = async () => ['good.csv', 'bad.csv']
      fileService.getFileContent = async (filename) => {
        if (filename === 'bad.csv') {
          return {
            file: filename,
            error: 'File not found',
            lines: []
          }
        }
        return {
          file: filename,
          lines: [{ text: 'data', number: 123, hex: '12345678901234567890123456789012' }]
        }
      }

      await fileController.getFormattedData(req, res, next)

      expect(res.statusCode).to.equal(200)
      expect(res.jsonData).to.have.lengthOf(1)
      expect(res.jsonData[0].file).to.equal('good.csv')
    })
  })
})
