import Layout from './components/Layout'
import ImcForm from './ImcForm'
import ImcDataComponent from './ImcData'

function App() {

  return (
    <>
     <Layout>
      <div className="app-container">
        <div className="form-container">
          <ImcForm />
        </div>
        <div className="data-container">
          <ImcDataComponent />
        </div>
      </div>
    </Layout>
  </>
  )
}

export default App
