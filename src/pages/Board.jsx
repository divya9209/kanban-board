import { useState } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";


function APICall() {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 1000 + 1000; 

    setTimeout(() => {
      const shouldFail = Math.random() < 0.2; 

      if (shouldFail) {
        reject("Fail");
      } else {
        resolve("Success");
      }
    }, delay);
  });
}


function Sortable({ task, column, handleDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 p-2 rounded mb-2 flex justify-between items-center"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-move flex-1"
      >
        {task.title}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation(); 
          handleDelete(column, task.id);
        }}
        className="text-red-500 text-sm ml-2"
      >
        ✕
      </button>
    </div>
  );
}



function Column({ id, title, tasks, handleDelete }) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white p-4 rounded shadow min-h-[250px]"
    >
      <h2 className="font-semibold mb-4">{title}</h2>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <Sortable
            key={task.id}
            task={task}
            column={id}
            handleDelete={handleDelete}
          />
        ))}
      </SortableContext>
    </div>
  );
}


function Board() {
  const user = localStorage.getItem("user");

  const [tasks, setTasks] = useState({
    todo: [],
    inprogress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState("");

  const handleAddTask = async () => {
  if (newTask.trim() === "") return;

  const taskObj = {
    id: Date.now(),
    title: newTask,
  };

  const previousState = { ...tasks };

  
  setTasks((prev) => ({
    ...prev,
    todo: [...prev.todo, taskObj],
  }));

  setNewTask("");

  try {
    await APICall();
  } catch (error) {
    toast.error("Failed to add task ");

    
    setTasks(previousState);
  }
};
  const handleDelete = async (column, id) => {
  const previousState = { ...tasks };

  setTasks((prev) => ({
    ...prev,
    [column]: prev[column].filter((task) => task.id !== id),
  }));

  try {
    await APICall();
  } catch (error) {
    toast.error("Failed to delete");

  
    setTasks(previousState);
  }
};


  const handleDragEnd =  async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceColumn = null;
    let targetColumn = null;

    for (let key in tasks) {
      if (tasks[key].some((task) => task.id === activeId)) {
        sourceColumn = key;
        break;
      }
    }

    if (tasks[overId]) {
      targetColumn = overId;
    } else {
     
      for (let key in tasks) {
        if (tasks[key].some((task) => task.id === overId)) {
          targetColumn = key;
          break;
        }
      }
    }

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn === targetColumn) return;

    const movedTask = tasks[sourceColumn].find(
      (task) => task.id === activeId
    );

    const previousState = { ...tasks };

    setTasks((prev) => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter(
        (task) => task.id !== activeId
      ),
      [targetColumn]: [...prev[targetColumn], movedTask],
    }));

    try {
        await APICall();
    } catch (error) {
        toast.error("Failed to move task");

   
        setTasks(previousState);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">
          Welcome, {user}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add new task..."
          className="border p-2 rounded w-64"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-3 gap-6">
          <Column
            id="todo"
            title="To Do"
            tasks={tasks.todo}
            handleDelete={handleDelete}
          />
          <Column
            id="inprogress"
            title="In Progress"
            tasks={tasks.inprogress}
            handleDelete={handleDelete}
          />
          <Column
            id="done"
            title="Done"
            tasks={tasks.done}
            handleDelete={handleDelete}
          />
        </div>
      </DndContext>
    </div>
  );
}

export default Board;
