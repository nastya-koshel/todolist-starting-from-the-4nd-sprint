import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import {
  changeTaskStatusTC,
  changeTaskTitleTC,
  deleteTaskTC
} from "@/features/todolists/model/tasks-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { useAppSelector } from "@/common/hooks"
import { selectTodolists } from "@/features/todolists/model/todolists-slice.ts"
import { TaskStatus } from "@/common/enums/enums.ts"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch()
  const todolist = useAppSelector(selectTodolists)

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const newTask = {...task, status: newStatus}
    dispatch(changeTaskStatusTC(newTask))
  }

  const changeTaskTitle = (title: string) => {
    const newTask = {...task, title}
    dispatch(changeTaskTitleTC(newTask))
    // dispatch(changeTaskTitleAC({ todolistId, taskId: task.id, title }))
  }

  return (
    <ListItem sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div>
        <Checkbox checked={task.status === TaskStatus.Completed} onChange={changeTaskStatus} disabled={todolist.find(tl => tl.id === todolistId)?.entityStatus === "loading"} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} todolist={todolist.find(tl => tl.id === todolistId)}/>
      </div>
      <span>{new Date(task.addedDate).toLocaleDateString()}</span>
      <IconButton onClick={deleteTask} disabled={todolist.find(tl => tl.id === todolistId)?.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
