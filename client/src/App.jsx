import { Outlet } from "react-router-dom"
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";

function App() {

  return (
    <>
      <Sidebar />
        <div>
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
    </>
  )
}

export default App