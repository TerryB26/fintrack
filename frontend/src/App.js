import './App.css';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <div className="max-w-8xl mx-auto">
        <div className="rounded-lg shadow-md p-4 text-center"
        style={{ backgroundColor: '#B8D0EB' }}>
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#00B4D8' }}>
            Welcome to FinTrack
          </h1>
          <p className="mb-4" style={{ color: '#415A77' }}>
            Your personal finance tracking dashboard is ready to help you manage your money effectively.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
