import Hero from './components/Hero/Hero';
import ProofForm from './components/ProofForm/ProofForm';
import './App.css';
import './components/Hero/Hero.css';
import './components/ProofForm/ProofForm.css';

function App() {
  return (
    <div className="app-container">
      <Hero />
      <ProofForm />
    </div>
  );
}

export default App;
