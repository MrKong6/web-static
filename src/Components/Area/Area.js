import React from 'react'

import areaChanged from "../../utils/areaChanged";

async function getArea() {
  return await import("../../utils/area");
}

class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCounty: false,
      state: [],
      city: [],
      county: [],

      selectedState: "",
      selectedCity: "",
      selectedCounty: ""
    };
    this.initArea = this.initArea.bind(this);
    this.changed = this.changed.bind(this);
    this.getArea = this.getArea.bind(this);
  }

  componentDidMount() {
    getArea().then(({AREA}) => {
        this.AREA = AREA;
        this.initArea();
      }
    );

    this.stateElem = document.getElementById("state");
    this.cityElem = document.getElementById("city");
    this.countyElem = document.getElementById("county");
  }

  initArea() {
    let data;

    if (this.props.defaults) {
      data = areaChanged(this.AREA, this.props.defaults[0], this.props.defaults[1], (this.props.defaults[2] ? this.props.defaults[2] : 0));
    } else {
      data = areaChanged(this.AREA, 0, 0, 0);
    }

    this.setState({
      selectedState: data.selectedState,
      selectedCity: data.selectedCity,
      selectedCounty: data.selectedCounty,
      state: data.stateArray,
      city: data.cityArray,
      county: data.countyArray,
      hasCounty: data.hasCounty
    })
  }

  changed(evt) {
    const targetValue = evt.target.value ? evt.target.value : 0;

    if (evt.target.id === "state") {
      const data = areaChanged(this.AREA, targetValue, 0, 0);

      this.setState({
        selectedState: data.selectedState,
        selectedCity: data.selectedCity,
        selectedCounty: data.selectedCounty,
        city: data.cityArray,
        county: data.countyArray,
        hasCounty: data.hasCounty
      })
    }

    if (evt.target.id === "city") {
      const data = areaChanged(this.AREA, this.state.selectedState, targetValue, 0);

      this.setState({
        selectedCity: data.selectedCity,
        selectedCounty: data.selectedCounty,
        city: data.cityArray,
        county: data.countyArray,
        hasCounty: data.hasCounty
      })
    }

    if (evt.target.id === "county") {
      this.setState({selectedCounty: evt.target.value})
    }
  }

  getArea() {
    let areaCodeArray = [];
    let areaTextArray = [];

    areaCodeArray.push(this.state.selectedState)
    areaCodeArray.push(this.state.selectedCity)
    areaTextArray.push(this.stateElem.options[this.stateElem.selectedIndex].text)
    areaTextArray.push(this.cityElem.options[this.cityElem.selectedIndex].text)

    if (this.state.hasCounty) {
      areaCodeArray.push(this.state.selectedCounty)
      areaTextArray.push(this.countyElem.options[this.countyElem.selectedIndex].text)
    }

    return ({areaCodeArray, areaTextArray});
  }

  render() {
    const countyClass = {display: `${this.state.hasCounty ? "block" : "none"}`};

    return (
      <div className="row">
        <div className="col">
          <select
            className="form-control"
            id="state"
            name="stateCode"
            onChange={this.changed}
            value={this.state.selectedState}
          >
            <option value="">请选择</option>
            {
              this.state.state.map((item) => (
                <option key={item.code} value={item.code}>{item.name}</option>
              ))
            }
          </select>
        </div>
        <div className="col">
          <select
            className="form-control"
            id="city"
            name="cityCode"
            onChange={this.changed}
            value={this.state.selectedCity}
          >
            <option value="">请选择</option>
            {
              this.state.city.map((item) => (
                <option key={item.code} value={item.code}>{item.name}</option>
              ))
            }
          </select>
        </div>
        <div className="col" style={countyClass}>
          <select
            className="form-control"
            id="county"
            name="countyCode"
            onChange={this.changed}
            value={this.state.selectedCounty}
          >
            <option value="">请选择</option>
            {
              this.state.county.map((item) => (
                <option key={item.code} value={item.code}>{item.name}</option>
              ))
            }
          </select>
        </div>
      </div>
    )
  }
}

export default Area;