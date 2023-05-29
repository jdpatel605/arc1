import {useState, useEffect} from 'react';
let element;
const useInfiniteScroll = (callback, className) => {
  className = className ? className : 'scroll'
  element = document.getElementsByClassName(className)[0];
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if(!isFetching) return;
    callback(() => {
      console.log('called back');
    });
  }, [isFetching]);

  function handleScroll() {
    if(element.scrollTop + element.offsetHeight !== element.scrollHeight || isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;