import React from 'react';

import API from "../API"


class navBar extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
            hostLogo: '',
            eventLogo: ''
        }
    }
    componentDidMount() {
        this.getLogos();
      }
    
      getLogos = async () => {
        try {
          let {data} = await API.getEventLogos();
         
          this.setState({eventLogo: data.eventLogo});
         
    
        } catch (error) {
          console.log('getLogos error:', error);
        }
      }
    render(){
    const buff = new Buffer(this.state.eventLogo);
    const base64data = buff.toString('base64');
  

        
    return(
        <div className="logo">
            {/* <img src={`data:image/png;base64,${base64data}`} /> */}
            <img className="enseirbLogo" src="./img/enseirb-logo.png" alt="logo enseirb" />
            <div className="txt">
                <h2 className="txt-1"> Forum Ingénib </h2>
                <h3 className="txt-2"> 10/10/2020 </h3>
            </div>
            <img className="forumLogo" src="./img/forum-logo.png" alt="logo forum" />

        </div>
    )
    }
}

export default navBar;