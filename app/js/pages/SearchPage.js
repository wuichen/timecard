'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';
var Calendar = require('react-input-calendar');
import classNames from 'classnames'

const SearchPage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },
  setDate(date) {
      var d = new Date(date);
      console.log(d);
  },

  render() {
    return (
      <DocumentTitle title="Search">
        <section className="search-page">
          <nav>
                    <div className={classNames('nav-wrapper','teal','lighten-2')}>
                      <a href="#" className={classNames('brand-logo','center')}>Dr.Wu's Clinic</a>
                    </div>
          </nav>

          <div className={classNames('card','noOverflowHidden')}>
            <Calendar
            format="MM/DD/YYYY"
            closeOnSelect={true}
            onChange={this.setDate}
          />
          </div>
          
          <div>
            <Link to="/">Back to Home</Link>
          </div>

        </section>
      </DocumentTitle>
    );
  }

});

export default SearchPage;