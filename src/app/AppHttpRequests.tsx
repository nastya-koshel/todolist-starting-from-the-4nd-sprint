import { type ChangeEvent, type CSSProperties, useEffect, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { CreateItemForm, EditableSpan } from "@/common/components"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { TodolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, TaskStatus, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

// CRUD Create - POST, Read - GET, Update - PUT (PATCH), Delete - DELETE

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

  useEffect(() => {
    TodolistsApi.getTodolists().then((res) => {
      const todolists = res.data
      setTodolists(todolists)

      todolists.forEach((tl) => {
        // сразу отправляется 2 запроса на tl, а вот такси приходят не сразу, а в разное время. Сразу при отправке запросов фиксируется значение tasks и больше не меняется.
        tasksApi.getTasks(tl.id).then((res) => {
          //Замыкание
          // setTasks({ ...tasks, [tl.id]: res.data.items })
          setTasks((currentTasks) => ({ ...currentTasks, [tl.id]: res.data.items })) // говорим, чтобы бралось актуальное значение tasks, а не зафиксированное в момент отправки запросов на tl
        })
      })
    })
  }, [])

  const createTodolist = (title: string) => {
    TodolistsApi.createTodolist(title).then((res) => {
      const newTodolist = res.data.data.item
      setTodolists([newTodolist, ...todolists])
    })
  }

  const deleteTodolist = (id: string) => {
    TodolistsApi.deleteTodolist(id).then(() => {
      setTodolists(todolists.filter((el) => el.id !== id))
    })
  }

  const changeTodolistTitle = (id: string, title: string) => {
    TodolistsApi.changeTodolistTitle(id, title).then(() => {
      setTodolists(todolists.map((el) => (el.id === id ? { ...el, title } : el)))
    })
  }

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask({ todolistId, title }).then((res) => {
      const newTask = res.data.data.item
      setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
    })
  }

  const deleteTask = (todolistId: string, taskId: string) => {
    tasksApi.deleteTask({ todolistId, taskId }).then(() => {
      const filteredTasks = tasks[todolistId].filter((t) => t.id !== taskId)
      setTasks({ ...tasks, [todolistId]: filteredTasks })
    })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const model: UpdateTaskModel = {
      description: task.description,
      title: task.title,
      status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
    }
    tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model }).then((res) => {
      setTasks({
        ...tasks,
        [task.todoListId]: tasks[task.todoListId].map((t) => (t.id === task.id ? res.data.data.item : t)),
      })
    })
  }

  const changeTaskTitle = (task: DomainTask, title: string) => {
    const model: UpdateTaskModel = {
      description: task.description,
      title: title,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
    }
    tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model }).then((res) => {
      setTasks({
        ...tasks,
        [task.todoListId]: tasks[task.todoListId].map((t) => (t.id === task.id ? res.data.data.item : t)),
      })
    })
  }

  return (
    <div style={{ margin: "20px" }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={(title) => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task) => (
            <div key={task.id}>
              <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "300px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
