import Header from "./Components/Header/Header";
import KanbanBoard from "./Components/Kanban/Kanban";
import "./Style.css";

const App = () => {
  return (
    <div className="component-wrapper">
      <Header />
      <KanbanBoard />
    </div>
  );
};

export default App;
