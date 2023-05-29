import React from "react";

const EmptyUser = (props) => {
  return (
    <div className="row grid-person-data bg-gray">
        <div className="col-lg-12 both-center pt-2 pb-2 text-center">
            <div colspan="100%">
                <p>No users found.</p>
            </div>
        </div>
    </div>
  )
}
export default EmptyUser;
