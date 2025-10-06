import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Home () {
  return <h1 className="text-center text-3xl mt-10 border">Frontend: Hello World 🌟</h1>;
}

function App () {
  return (
    <Home />
  );
}

export default App;
