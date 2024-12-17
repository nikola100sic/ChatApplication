import { ToastContainer } from "react-toastify";
import ChatRoom from "./component/ChatRoom";

function App() {
  return (
    <>
      <ChatRoom />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
      ;
    </>
  );
}

export default App;
