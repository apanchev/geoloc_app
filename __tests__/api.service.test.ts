import Api from '../src/api/api.service';

describe('TESTING => checkParams', () => {
  test('Test with all right params #0', async () => {
    const result = await Api.checkParams([1, 2, 3], 40, 2, 1000);
    expect(result).toStrictEqual(1);
  });
  test('Test with all right params #1', async () => {
    const result = await Api.checkParams([1, 2, 3], 40, 2, 100);
    expect(result).toStrictEqual(1);
  });
  test('Test with empty bandIds', async () => {
    const result = await Api.checkParams([], 40, 2, 100);
    expect(result).toStrictEqual(2);
  });
  test('Test with wrong latitude', async () => {
    const result = await Api.checkParams([], 600, 2, 100);
    expect(result).toStrictEqual(0);
  });
  test('Test with wrong longitude', async () => {
    const result = await Api.checkParams([], 40, -200, 100);
    expect(result).toStrictEqual(0);
  });
  test('Test with empty longitude', async () => {
    const result = await Api.checkParams([], 40, undefined, 100);
    expect(result).toStrictEqual(0);
  });
  test('Test with empty latitude', async () => {
    const result = await Api.checkParams([1, 2, 3], undefined, 2, 100);
    expect(result).toStrictEqual(0);
  });
  test('Test with empty geolocation', async () => {
    const result = await Api.checkParams([1, 2, 3], undefined, undefined, undefined);
    expect(result).toStrictEqual(3);
  });
  test('Test with empty params', async () => {
    const result = await Api.checkParams(undefined, undefined, undefined, undefined);
    expect(result).toStrictEqual(0);
  });
});

describe('TESTING => parseBandIds', () => {
  test('Test with string', async () => {
    const result = await Api.parseBandIds('1,2,3');
    expect(result).toStrictEqual([1, 2, 3]);
  });
  test('Test with empty string', async () => {
    const result = await Api.parseBandIds('');
    expect(result).toStrictEqual([]);
  });
  test('Test with array', async () => {
    const result = await Api.parseBandIds(['1', '2', '3']);
    expect(result).toStrictEqual([1, 2, 3]);
  });
});

describe('TESTING => bandIdsValidator', () => {
  test('Test with string', async () => {
    const res = Api.bandIdsValidator([1, 2, 3]);
    expect(res).toStrictEqual(1);
  });
  test('Test with empty string', async () => {
    const res = Api.bandIdsValidator([]);
    expect(res).toStrictEqual(2);
  });
  test('Test with array', async () => {
    const res = Api.bandIdsValidator([1, 2, 3]);
    expect(res).toStrictEqual(1);
  });
  test('Test with empty array', async () => {
    const res = Api.bandIdsValidator([]);
    expect(res).toStrictEqual(2);
  });
});

describe('TESTING => latitudeValidator', () => {
  test('Test with right param #0', async () => {
    const res = Api.latitudeValidator(90);
    expect(res).toStrictEqual(1);
  });
  test('Test with right param #1', async () => {
    const res = Api.latitudeValidator(-90);
    expect(res).toStrictEqual(1);
  });
  test('Test with wrong param #0', async () => {
    const res = Api.latitudeValidator(200);
    expect(res).toStrictEqual(0);
  });
  test('Test with wrong param #1', async () => {
    const res = Api.latitudeValidator(-91);
    expect(res).toStrictEqual(0);
  });
});

describe('TESTING => longitudeValidator', () => {
  test('Test with right param #0', async () => {
    const res = Api.longitudeValidator(180);
    expect(res).toStrictEqual(1);
  });
  test('Test with right param #1', async () => {
    const res = Api.longitudeValidator(-180);
    expect(res).toStrictEqual(1);
  });
  test('Test with wrong param #0', async () => {
    const res = Api.longitudeValidator(181);
    expect(res).toStrictEqual(0);
  });
  test('Test with wrong param #1', async () => {
    const res = Api.longitudeValidator(-181);
    expect(res).toStrictEqual(0);
  });
});

describe('TESTING => geolocGetBoundaries', () => {
  test('Test with right param #0', async () => {
    const res = Api.geolocGetBoundaries(48.8814422, 2.3684356, 10);
    const resExpect = {
      laMax: 48.971374360591874,
      laMin: 48.79151003940813,
      loMax: 2.505189814632254,
      loMin: 2.231681385367746,
    };
    expect(res).toStrictEqual(resExpect);
  });
  test('Test with latitude = 90', async () => {
    const res = Api.geolocGetBoundaries(90, 2.3684356, 100);
    const resExpect = {
      laMax: 90,
      laMin: 89.10067839408127,
      loMax: 180,
      loMin: -180,
    };
    expect(res).toStrictEqual(resExpect);
  });
  test('Test with longitude = 180', async () => {
    const res = Api.geolocGetBoundaries(48.8814422, 179, 100);
    const resExpect = {
      laMax: 49.78076380591873,
      laMin: 47.98212059408127,
      loMax: -179.63238488083155,
      loMin: 177.63238488083155,
    };
    expect(res).toStrictEqual(resExpect);
  });
});
