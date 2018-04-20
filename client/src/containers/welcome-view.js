import React from 'react';
import { Link } from 'react-router-dom';
import ButtonDiscover from '../components/button-discover';
import SearchInput from '../components/search-input';
import { Row, Col } from 'react-flexbox-grid';
import Hidden from 'material-ui/Hidden';

const WelcomeView = ({}) =>
  <div className="container-welcome">
    <div className="container-top">
      <div className="container-search">
        <SearchInput/>
        {/* <p>Data about trending topics around the world</p> */}
        <Link to="/discover">
            <ButtonDiscover/>
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

export default WelcomeView;
