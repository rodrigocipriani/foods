import React, { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
    console.log("1");
    return () => {
      console.log("2");
    };
  });

  const [count2, setCount2] = useState(0);
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count2} times`;
    console.log("1-2");
    return () => {
      console.log("2-2");
    };
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <p>You clicked 2 {count2} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={() => setCount2(count2 + 1)}>Click me 2</button>
    </div>
  );
}

export default Counter;
