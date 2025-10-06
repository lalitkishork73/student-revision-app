import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Home () {
  return <h1 className="text-center text-3xl mt-10">Frontend: Hello World 🌟</h1>;
}

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
