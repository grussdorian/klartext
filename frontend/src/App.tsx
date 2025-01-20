import React, {useEffect} from 'react';
import TextSimplifier from './components/TextSimplifier'

function App() {
  useEffect(() => {
    fetch('/set-cookie', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <TextSimplifier />
    </div>
  )
}

export default App