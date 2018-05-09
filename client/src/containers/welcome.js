import React from 'react';
import { Link } from 'react-router-dom';
import ButtonImportant from '../components/button-important';
import SearchInput from '../components/search-input';
import { Row, Col } from 'react-flexbox-grid';
import Hidden from 'material-ui/Hidden';
import { modelInstance } from '../model/model';
import Login from '../login'

class Welcome extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      status: 'INITIAL',
      data: null,
      page: 0,
    }
  }

  handleInput = event => {
    modelInstance.setSearch(event.target.value);
    console.log(event.target.value);
  }

  render () {
    return (
      <div className="container-welcome">
        <div className="container-top">
          <Login/>
          <div className="container-search">
            <SearchInput handleInput={this.handleInput.bind(this)} page={1}/>
            <Link to="/discover">
                <ButtonImportant text='Discover'  handleClick = {this.handleClick}/>
            </Link>
          </div>
        </div>
        <div id="stepper">
          <Hidden only="xs">
            <Row id="nb-steps">
              <Col sm={4} md={4}>1.</Col>
              <Col sm={4} md={4}>2.</Col>
              <Col sm={4} md={4}>3.</Col>
            </Row>
          </Hidden>
          <Row id="description-steps">
            <Col sm={4} md={4} xs={12}>
              <Hidden smUp>
                <p>1.</p>
              </Hidden>
              <p>Search for hashtags, words, or people</p>
              <i className="fab fa-twitter fa-3x"></i>
            </Col>
            <Col sm={4} md={4} xs={12}>
              <Hidden smUp>
                <p>2.</p>
              </Hidden>
              <p>Interact with the data</p>
              <i className="far fa-map fa-3x"></i>
            </Col>
            <Col sm={4} md={4} xs={12}>
              <Hidden smUp>
                <p>3.</p>
              </Hidden>
              <p>Export / Print data</p>
              <i className="far fa-file-pdf fa-3x"></i>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Welcome;
