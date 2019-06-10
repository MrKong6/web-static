export default function (AREA, selectedState, selectedCity, selectedCounty) {
  let state = {};
  let city = {};
  let county = {};
  let hasCounty = false;
  let stateArray = [];
  let cityArray = [];
  let countyArray = [];

  for (let code in AREA) {
    if (!(code % 1e4)) {
      state[code] = AREA[code];

      if (!selectedState) {
        if (selectedCity && !(selectedCity % 1e4)) {
          selectedState = selectedCity;
        } else {
          selectedState = code;
        }
      }
    } else {
      var p = code - selectedState;

      if (selectedState && p > 0 && p < 1e4) {
        if (!(code % 100)) {
          hasCounty = true;
          city[code] = AREA[code];

          if (!selectedCity) {
            selectedCity = code;
          }
        } else if (p > 9000) {
          city[code] = AREA[code];

          if (!selectedCity) {
            selectedCity = code;
          }
        } else if (hasCounty) {
          var c = code - selectedCity;

          if (selectedCity && c > 0 && c < 100) {
            county[code] = AREA[code];

            if (!selectedCounty) {
              selectedCounty = code;
            }
          }
        } else {
          city[code] = AREA[code];

          if (!selectedCity) {
            selectedCity = code;
          }
        }
      }
    }
  }

  for (let code in state) {
    stateArray.push({
      code: code,
      name: state[code]
    })
  }

  for (let code in city) {
    cityArray.push({
      code: code,
      name: city[code]
    })
  }

  for (let code in county) {
    countyArray.push({
      code: code,
      name: county[code]
    })
  }

  return {stateArray, cityArray, countyArray, hasCounty, selectedState, selectedCity, selectedCounty}
}