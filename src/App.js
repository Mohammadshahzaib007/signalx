import "./App.css";

import data from "./react_nodalmap_test_data.json";

import ConnectedNodeMap from "./component/ConnectedNodeMap/ConnectedNodeMap";

function App() {
  return (
    <div className="App">
      <ConnectedNodeMap data={data} />
    </div>
  );
}

export default App;
