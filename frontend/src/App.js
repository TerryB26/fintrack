import './App.css';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to FinTrack
          </h1>
          <p className="text-gray-600 mb-4">
            Your personal finance tracking dashboard is ready to help you manage your money effectively.
          </p>
          
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Balance</h3>
              <p className="text-2xl font-bold text-blue-600">$12,345.67</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Monthly Income</h3>
              <p className="text-2xl font-bold text-green-600">$4,500.00</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Monthly Expenses</h3>
              <p className="text-2xl font-bold text-red-600">$3,200.45</p>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-center py-4">
                Your recent transactions will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
