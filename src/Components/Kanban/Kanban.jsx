import "./Kanban.css";

import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

import { data } from "../../Data/KanbanData";

const KanbanBoard = () => {
  const [columns, setColumns] = useState(data);

  const handleDragEnd = (event) => {
    //events provided by the onDragEnd. active represents the dragged tasks id and over represents the targets id
    const { active, over } = event;
    if (!active || !over) return;

    // Find source column of the dragged task
    const sourceColumnId = Object.keys(columns).find((columnId) =>
      Object.keys(columns[columnId].tasks).includes(active.id)
    );

    // If the dragged task id and desitnation drop zone id is same we are on same place so nothing to do
    if (over.id === sourceColumnId) return;

    setColumns((prev) => {
      //creating a new shallow copy of the columns data
      const newColumns = { ...prev };
      //stores the dragged task
      const taskToMove = newColumns[sourceColumnId].tasks[active.id];

      // delete the task from source column
      delete newColumns[sourceColumnId].tasks[active.id];

      // Add task to the srouce id
      newColumns[over.id].tasks[active.id] = taskToMove;

      return newColumns;
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {Object.entries(columns).map(([columnId, column]) => (
          <Column
            key={columnId}
            id={columnId}
            title={column.title}
            tasks={column.tasks}
          />
        ))}
      </div>
    </DndContext>
  );
};

const Column = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: id, //passing columnId as unique id for creating a droppable area
  });

  return (
    <div className="kanban-column" ref={setNodeRef}>
      <h1 className="column-title">{title}</h1>
      <ul>
        {Object.values(tasks).map((task) => (
          <TaskCard key={task.id} id={task.id} content={task.content} />
        ))}
      </ul>
    </div>
  );
};

const TaskCard = ({ id, content }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  //translating the card relative to the mouse position
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1,
      }
    : undefined;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="task-card"
    >
      {content}
    </li>
  );
};

export default KanbanBoard;
