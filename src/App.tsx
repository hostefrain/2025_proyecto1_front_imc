import Layout from './components/common/layout/Layout'
import ImcForm from './components/imc/imcForm/ImcForm'
import ImcDataComponent from './components/imc/imcData/ImcData'

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
