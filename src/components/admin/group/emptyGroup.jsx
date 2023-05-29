import React from "react";

const EmptyDiscover = (props) => {
  return (
    <div className="black-box text-center pb-5 mt-5" style={{'minHeight': 'auto'}}>
      <img className="box-icon" src="images/search-large.svg" style={{width: '108px', height: 'auto'}} alt="User" />
      <h4>No Results</h4>
      <p style={{'maxWidth': '70%', margin: 'auto'}}>There doesn’t seem to be any results for the above search.</p>
    </div>
  )
}
export default EmptyDiscover;
