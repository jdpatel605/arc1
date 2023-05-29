import React, {forwardRef} from "react";

const ContentHeader = forwardRef((props, ref) => {
  
  return (
    <div className="content-title flex-wrap" ref={ref}>
      <div className="d-flex w-100">
        <h1>Organization Profile</h1>
      </div>
    </div>
  )
})
export default ContentHeader;
