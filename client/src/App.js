import React from "react";
import ReactDOM from "react-dom";
import { RadioSVGMap } from "react-svg-map";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Fab from '@material-ui/core/Fab';
import ReactWordcloud from 'react-wordcloud';

import NavBar from './components/navBar';

import API from "./API"

import "./map.scss";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
     
			pointedLocation: null,
			focusedLocation: null,
      selectedLocation: null,
      floorMaps: {},
      words:[[{}]],
      currentMap: 0,
      mapsCount: 0,
      loaded: false,
		};

		this.handleLocationMouseOver = this.handleLocationMouseOver.bind(this);
		this.handleLocationMouseOut = this.handleLocationMouseOut.bind(this);
		this.handleLocationFocus = this.handleLocationFocus.bind(this);
		this.handleLocationBlur = this.handleLocationBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.fetchEventData();
    this.fetchCloudData();
  }

  fetchEventData = async () => {
    try {

      let {data} = await API.getEventData();
     console.log('data',data);
      this.setState({floorMaps: data.plan.floors});
      this.setState({mapsCount: data.plan.floors.length});
      this.setState({loaded: true});

    } catch (error) {
      console.log('fetchEventData error:', error);
    }
  }

  fetchCloudData = async () => {
    let Words = [];
    let wordsData = [];
    let wordsDescString;
    let wordsNameString;

    try {

      let {data} = await API.getEventData();

      
      if(data.plan.floors[this.state.currentMap].locations[0].name !== 'wall'){
        wordsDescString = data.plan.floors[this.state.currentMap].locations[0].desc;
      }else{
        wordsDescString = data.plan.floors[this.state.currentMap].locations[1].desc;
      } 
      var ar = wordsDescString.split(' ');
      ar = wordsDescString.split('\n');

      for(var i = 0; i<ar.length;i++){
        Words.push(ar[i]);
      }
      for(var i = 0; i<Words.length;i++){
        wordsData.push({text: Words[i], value: 1});
      }

      for(let j=0;j<data.plan.floors[this.state.currentMap].locations.length -1;j++){
        if(data.plan.floors[this.state.currentMap].locations[j].name !== 'wall'){
          wordsNameString = data.plan.floors[this.state.currentMap].locations[j].name;
        }else{
          wordsNameString = data.plan.floors[this.state.currentMap].locations[j+1].name;
          j++;
        } 
        Words.push(wordsNameString);
        for(var i = 0; i<Words.length;i++){
          wordsData.push({text: Words[i], value: 1});
        }
      }
      this.setState({words : wordsData} );

    } catch (error) {
      console.log('fetchCloudData error:', error);
    }
  }


  getLocationName(event){
    return event.target.attributes.name.value;
  }

  getLocationDesc(event) {
    let id = event.target.attributes.name.value;
    let currentMap = this.state.currentMap;

    for (const path of this.state.floorMaps[currentMap].locations) {
      if (path.id === id){
        return path.desc;
      }
    }
  }

	handleLocationMouseOver(event) {
		const pointedLocation = this.getLocationName(event);
		this.setState({ pointedLocation: pointedLocation });
	}

	handleLocationMouseOut() {
		this.setState({ pointedLocation: null });
	}

	handleLocationFocus(event) {
		const focusedLocation = this.getLocationDesc(event);
		this.setState({ focusedLocation: focusedLocation });
	}

	handleLocationBlur() {
		this.setState({ focusedLocation: null });
	}

	handleOnChange(selectedNode) {
		this.setState(prevState => {
			return {
				...prevState,
				selectedLocation: selectedNode.attributes.name.value
			};
		});
	}

  handleClick(increment) {

    let newMap = this.state.currentMap + increment;

    newMap = Math.min(Math.max(newMap, 0), this.state.mapsCount-1);

    this.setState( {currentMap: newMap} );

  }
	render() {

    if (this.state.loaded){
      let currentMap = this.state.currentMap;

      return (
        <div className="App">
          <NavBar className="NavBar"/>  
      
        <article className="examples__block">
          <div className="container">
            <div className="buttons">
      
              <ButtonGroup
                orientation="vertical"
                color="secondary"
                aria-label="vertical contained primary button group"
                variant="contained"
              >
                <Fab onClick={() => this.handleClick(1)}>+</Fab>
                <Fab onClick={() => this.handleClick(-1)}>-</Fab>
        
              </ButtonGroup>
            </div> 
            
          <div className="examples__block__map examples__block__map--Taiwan">
            <RadioSVGMap
              map={this.state.floorMaps[currentMap]}
              onLocationMouseOver={this.handleLocationMouseOver}
              onLocationMouseOut={this.handleLocationMouseOut}
              onLocationFocus={this.handleLocationFocus}
              onLocationBlur={this.handleLocationBlur}
              onChange={this.handleOnChange} />
          </div>
          </div>
          <div className="standInformation">
            <div className="examples__block__info">
              <div className="examples__block__info__item">
                Pointed location: {this.state.pointedLocation}
              </div>
              <div className="examples__block__info__item">
                Focused location: {this.state.focusedLocation}
              </div>
              <div className="examples__block__info__item">
                Selected location: {this.state.selectedLocation}
              </div>
            </div>
          </div>
        </article>
        <ReactWordcloud words={this.state.words} />
        </div>
      );
    } else {
      return (
        <div>Loading....</div>
      )
    }
    
	}
}

export default App;
