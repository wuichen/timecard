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
    firstDay.setHours(8,0);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDay.setHours(23,0);
    return({
      startDate: firstDay,
      endDate: lastDay,
      staffs: [],
      searchName: ''
    })
  },

  // setName(event) {
  //     console.log(event.target.value);
  //     this.setState({
  //       staffName: event.target.value
  //     })
  // },
  componentDidMount () {
      this.search();
  },
  setStartDate(date) {
      var d = new Date(date);
      d.setHours(8,0);
      console.log(d);
      this.setState({
        startDate: d
      })
  },
  setEndDate(date) {
      var d = new Date(date);
      d.setHours(23,0);
      console.log(d);
      this.setState({
        endDate: d
      })
  },
  setSearchName (event) {
      this.setState({
          searchName: event.target.value
      })
      console.log(this.state.searchName);
  },
  search() {
      this.setState({
          staffs: []
      })
      var self = this;
      var TimePunchObject = Parse.Object.extend('TimePunch');
      var timePunchObject = new TimePunchObject();
      var query = new Parse.Query(TimePunchObject);   

      if(this.state.searchName.length > 0){
        query.equalTo('name',this.state.searchName);
      }
      query.greaterThan('createdAt',this.state.startDate);
      query.lessThan('createdAt',this.state.endDate);

      query.find().then(function(results){
          var staffs = {};
          for (var i = 0; i < results.length; i++) {
              var totalWorkMilliseconds = 0;
              var requiredWorkMinutes = 0;
              if(results[i].get('morningSignIn') || results.get('morningSignOut')){
                  requiredWorkMinutes = requiredWorkMinutes + 210
                  var morningSignIn = results[i].get('morningSignIn');
                  var morningSignOut = results[i].get('morningSignOut');
                  var morningWorkMilliseconds = Math.abs(morningSignOut - morningSignIn);

                  totalWorkMilliseconds = totalWorkMilliseconds + morningWorkMilliseconds;
              }

              if(results[i].get('afternoonSignIn') || results.get('afternoonSignOut')){
                  requiredWorkMinutes = requiredWorkMinutes + 210
                  var afternoonSignIn = results[i].get('afternoonSignIn');
                  var afternoonSignOut = results[i].get('afternoonSignOut');
                  var afternoonWorkMilliseconds = Math.abs(afternoonSignOut-afternoonSignIn);
                  totalWorkMilliseconds = totalWorkMilliseconds + afternoonWorkMilliseconds;
              }

              if(results[i].get('eveningSignIn') || results.get('eveningSignOut')){
                  requiredWorkMinutes = requiredWorkMinutes + 180;
                  var eveningSignIn = results[i].get('eveningSignIn');
                  var eveningSignOut = results[i].get('eveningSignOut');
                  var eveningWorkMilliseconds = Math.abs(eveningSignOut-eveningSignIn);
                  totalWorkMilliseconds = totalWorkMilliseconds + eveningWorkMilliseconds;
              }

              if(typeof staffs[results[i].get('name')] === 'undefined'){
                  staffs[results[i].get('name')] = {};
              }

              if(staffs[results[i].get('name')].totalWorkMinutes){
                  var hours = staffs[results[i].get('name')].totalWorkMinutes;
                  staffs[results[i].get('name')].totalWorkMinutes = hours + totalWorkMilliseconds/60000
              }else{
                  staffs[results[i].get('name')].totalWorkMinutes = totalWorkMilliseconds/60000
              }

              if(staffs[results[i].get('name')].requiredWorkMinutes){
                  var hours = staffs[results[i].get('name')].requiredWorkMinutes;
                  staffs[results[i].get('name')].requiredWorkMinutes = hours + requiredWorkMinutes
              }else{
                  staffs[results[i].get('name')].requiredWorkMinutes = requiredWorkMinutes
              }
          }

          for (var staff in staffs) {
            if (staffs.hasOwnProperty(staff)) {
                staffs[staff].staffName = staff;
                self.state.staffs.push(staffs[staff]);
            }
          }

          console.log(self.state.staffs);
          self.setState({
              staffs: self.state.staffs
          })

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
            <input className='nameInput' type='text' onChange={this.setSearchName} />
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
          {this.state.staffs.map(function(staff){
              return(
                  <div className={classNames('card','staffTimeCard')}>
                      <span>{staff.staffName}</span>
                      <span> should work</span>
                      <span className='number'> {Math.round(staff.requiredWorkMinutes)} </span>minutes
                      <span> and worked</span>
                      <span className='number'> {Math.round(staff.totalWorkMinutes)} </span>minutes
                      bonus<span className='number'> {Math.round(staff.totalWorkMinutes - staff.requiredWorkMinutes)} minutes</span>
                  </div>
              )
          }.bind(this))}

        </section>
      </DocumentTitle>
    );
  }

});

export default SearchPage;