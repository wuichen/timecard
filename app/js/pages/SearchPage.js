'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';
var Calendar = require('react-input-calendar');
import classNames from 'classnames'
var Parse = require('parse');
Parse.initialize("umJWoYdcF0EOGf62IiqOinOpmpUaUeYvyvn4QtZ5", "mCvBkC3Yr8lF5R5mNNVfMNWoKLBMOTjpSwaMZ6eH");



const SearchPage = React.createClass({

  getInitialState(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return({
      startDate: firstDay,
      endDate: lastDay,
      staffName: ''
    })
  },

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  setName(event) {
      console.log(event.target.value);
      this.setState({
        staffName: event.target.value
      })
  },
  setStartDate(date) {
      var d = new Date(date);
      console.log(d);
      this.setState({
        startDate: d
      })
  },
  setEndDate(date) {
      var d = new Date(date);
      console.log(d);
      this.setState({
        endDate: d
      })
  },
  search() {

      var TimePunchObject = Parse.Object.extend('TimePunch');
      var timePunchObject = new TimePunchObject();
      var query = new Parse.Query(TimePunchObject);   

      query.greaterThan('createdAt',this.state.startDate);
      query.lessThan('createdAt',this.state.endDate);
      query.equalTo('name','steven');
      // var workInfo = {
      //     Staff: []
      // }
      query.find().then(function(results){
          for (var i = 0; i < results.length; i++) {
              var workingHour = 0;
              if(results[i].get('morningSignIn') || results.get('morningSignOut')){
                  
                  var morningSignIn = results[i].get('morningSignIn');
                  var morningSignOut = results[i].get('morningSignOut');
                  var morningWorkHour = Math.abs(morningSignOut - morningSignIn);

                  var afternoonSignIn = results[i].get('afternoonSignIn');
                  var afternoonSignOut = results[i].get('afternoonSignOut');
                  var afternoonWorkHour = Math.abs(afternoonSignOut-afternoonSignIn);

                  var eveningSignIn = results[i].get('eveningSignIn');
                  var eveningSignOut = results[i].get('eveningSignOut');
                  var eveningWorkHour = Math.abs(eveningSignOut-eveningSignIn);

                  var totalWorkHour = morningWorkHour + afternoonWorkHour + eveningWorkHour;
                  console.log('steven', Math.round(totalWorkHour/60000));                
              }
          }
      })



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

          <div className={classNames('card','searchSection')}>
            <input type='text' className='nameInput' placeholder='Search name' onChange={this.setName}/>
            <Calendar
            format="MM/DD/YYYY"
            closeOnSelect={true}
            onChange={this.setStartDate}
            placeholder='Please enter start date'
            date={this.state.startDate}
            />
            <Calendar
            format="MM/DD/YYYY"
            closeOnSelect={true}
            onChange={this.setEndDate}
            placeholder='Please enter end date'
            date={this.state.endDate}
            />
            <a className={classNames('searchButton','waves-effect','waves-light','btn')} onClick={this.search}><i className={classNames('material-icons', 'right')}>search</i>Search</a>
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