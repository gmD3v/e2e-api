const request = require('supertest');
const createApp = require('../src/app');
const { config } = require('../src/config/config');

describe('Test the root path', () => {
  let server = null;
  let app = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(9100);
    api = request(app);
  });

  test('It should response the GET method', () => {
    return api.get('/hello').then((response) => {
      expect(response).toBeTruthy();
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual('John');
    });
  });

  describe('POST /nueva-ruta', () => {
    test('It should return 401', async () => {
      const { statusCode } = await api.get('/nueva-ruta');
      expect(statusCode).toBe(401);
    });

    test('It should return 401 wrong api key', async () => {
      const { statusCode } = await api.get('/nueva-ruta').set({ api: '123' });
      expect(statusCode).toBe(401);
    });

    test('It should return 200', async () => {
      const { statusCode } = await api
        .get('/nueva-ruta')
        .set({ api: config.apiKey });
      expect(statusCode).toBe(200);
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});
