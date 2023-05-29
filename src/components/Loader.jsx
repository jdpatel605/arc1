import React, {useRef, useEffect} from "react";
import LoadingBar from 'react-top-loading-bar'

const Loader = (props) => {
  const ref = useRef(null);

  useEffect(() => {

    if(props.visible === true) {
      ref.current.continuousStart(1, 70)
    } else if(props.visible === false) {
      ref.current.complete();
    }

  }, [props.visible])

  return (
    <LoadingBar color='#18b99a' ref={ref} />
  )
};
export default Loader;
