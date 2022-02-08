import { Api } from "../src/api/api.service";
import { Database } from "../src/database/database.service";

describe("TESTING => checkParams", () => {
  test("Test with all right params #0", async () => {
    const result = await Api.checkParams([1,2,3], 40, 2, 1000);
    // console.debug(result);
    expect(result).toStrictEqual(1);
  });
  test("Test with all right params #1", async () => {
    const result = await Api.checkParams([1, 2, 3], 40, 2, 100);
    // console.debug(result);
    expect(result).toStrictEqual(1);
  });
  test("Test with empty bandIds", async () => {
    const result = await Api.checkParams([], 40, 2, 100);
    // console.debug(result);
    expect(result).toStrictEqual(2);
  });
  test("Test with wrong latitude", async () => {
    const result = await Api.checkParams([], 600, 2, 100);
    // console.debug(result);
    expect(result).toStrictEqual(0);
  });
  test("Test with wrong longitude", async () => {
    const result = await Api.checkParams([], 40, -200, 100);
    // console.debug(result);
    expect(result).toStrictEqual(0);
  });
  test("Test with empty longitude", async () => {
    const result = await Api.checkParams([], 40, undefined, 100);
    // console.debug(result);
    expect(result).toStrictEqual(0);
  });
  test("Test with empty latitude", async () => {
    const result = await Api.checkParams([1, 2, 3], undefined, 2, 100);
    // console.debug(result);
    expect(result).toStrictEqual(0);
  });
  test("Test with empty geolocation", async () => {
    const result = await Api.checkParams([1, 2, 3], undefined, undefined, undefined);
    // console.debug(result);
    expect(result).toStrictEqual(3);
  });
  test("Test with empty params", async () => {
    const result = await Api.checkParams(undefined, undefined, undefined, undefined);
    // console.debug(result);
    expect(result).toStrictEqual(0);
  });
});

describe("TESTING => parseBandIds", () => {
  test("Test with string", async () => {
    const result = await Api.parseBandIds("1,2,3");
    // console.debug(result);
    expect(result).toStrictEqual([1, 2, 3]);
  });
  test("Test with empty string", async () => {
    const result = await Api.parseBandIds("");
    // console.debug(result);
    expect(result).toStrictEqual([]);
  });
  test("Test with array", async () => {
    const result = await Api.parseBandIds(["1", "2", "3"]);
    // console.debug(result);
    expect(result).toStrictEqual([1, 2, 3]);
  });
});

// describe("TESTING => checkParams", () => {
//   test("Test with all right params", async () => {
//     const res = await Api.checkParams("1,2,3", 48, 2, 1000);
//     expect(res).toStrictEqual(true);
//   });
//   test("Test with wrong latitude params", async () => {
//     const res = await Api.checkParams("1,2,3", 200, 2, 1000);
//     expect(res).toStrictEqual(false);
//   });
// });

describe("TESTING => bandIdsValidator", () => {
  test("Test with string", async () => {
    const res = Api.bandIdsValidator([1,2,3]);
    expect(res).toStrictEqual(1);
  });
  test("Test with empty string", async () => {
    const res = Api.bandIdsValidator([]);
    expect(res).toStrictEqual(2);
  });
  test("Test with array", async () => {
    const res = Api.bandIdsValidator([1,2,3]);
    expect(res).toStrictEqual(1);
  });
  test("Test with empty array", async () => {
    const res = Api.bandIdsValidator([]);
    expect(res).toStrictEqual(2);
  });
});

describe("TESTING => latitudeValidator", () => {
  test("Test with right param #0", async () => {
    const res = Api.latitudeValidator(90);
    expect(res).toStrictEqual(1);
  });
  test("Test with right param #1", async () => {
    const res = Api.latitudeValidator(-90);
    expect(res).toStrictEqual(1);
  });
  test("Test with wrong param #0", async () => {
    const res = Api.latitudeValidator(200);
    expect(res).toStrictEqual(0);
  });
  test("Test with wrong param #1", async () => {
    const res = Api.latitudeValidator(-91);
    expect(res).toStrictEqual(0);
  });
});

describe("TESTING => longitudeValidator", () => {
  test("Test with right param #0", async () => {
    const res = Api.longitudeValidator(180);
    expect(res).toStrictEqual(1);
  });
  test("Test with right param #1", async () => {
    const res = Api.longitudeValidator(-180);
    expect(res).toStrictEqual(1);
  });
  test("Test with wrong param #0", async () => {
    const res = Api.longitudeValidator(181);
    expect(res).toStrictEqual(0);
  });
  test("Test with wrong param #1", async () => {
    const res = Api.longitudeValidator(-181);
    expect(res).toStrictEqual(0);
  });
});

describe("TESTING => geolocGetBoundaries", () => {
  test("Test with right param #0", async () => {
    const res = Api.geolocGetBoundaries(48.8814422, 2.3684356, 10);
    const resExpect = {
      "latitudeMax": 48.971374360591874,
      "latitudeMin": 48.79151003940813,
      "longitudeMax": 2.505189814632254,
      "longitudeMin": 2.231681385367746
    }
    expect(res).toStrictEqual(resExpect);
  });
  test("Test with latitude = 90", async () => {
    const res = Api.geolocGetBoundaries(90, 2.3684356, 100);
    const resExpect = {
      "latitudeMax": 90,
      "latitudeMin": 89.10067839408127,
      "longitudeMax": 180,
      "longitudeMin": -180
    }
    expect(res).toStrictEqual(resExpect);
  });
  test("Test with longitude = 180", async () => {
    const res = Api.geolocGetBoundaries(48.8814422, 179, 100);
    const resExpect = {
      "latitudeMax": 49.78076380591873,
      "latitudeMin": 47.98212059408127,
      "longitudeMax": -179.63238488083155,
      "longitudeMin": 177.63238488083155
    }
    expect(res).toStrictEqual(resExpect);
  });
});

// To test
// [738,986], 68, -37, 2215

// describe("TESTING => searchWithAllParams", () => {
//   test("Test with right param #0", async () => {
//     const params = {
//       "bandIds": "677, 986, 0",
//       "longitude": 2.3684356,  
//       "latitude": 48.8814422,
//       "radius": 10
//     };
//     const res = Api.searchWithAllParams([677, 986, 0], 48.8814422, 2.3684356, 10);
//     expect(Database.dbSearchWithAll).toBeCalled();
//   });
  // test("Test with wrong param #1", async () => {
  //   const res = Api.longitudeValidator(-181);
  //   expect(res).toStrictEqual(0);
  // });
// });

// describe("Test 1 2 3", () => {
//   test("test de ouf", async () => {
//     const result = await Api.checkParams("1,2,3", 48, 2, 1000);
//     // console.debug(result);
//     expect(result).toBe(true);
//   });
// });
