import React from "react";
import {FilterValuesType} from "./App";


export type InsidesPropsType = {
    id: number
    name: string
    checked: boolean
}

type TodolistPropsType = {
    hat: string
    insides: InsidesPropsType[]
    deleteMovies: (id: number) => void
    changeFilter: (value: FilterValuesType) => void
}

export function Todolist(props: TodolistPropsType) {

    const mappedInsides = props.insides.map(item =>
        <li><input type="checkbox" checked={item.checked}/>
            <span>{item.name}</span>
            <button onClick={() => {
                props.deleteMovies(item.id)
            }}>X
            </button>
        </li>
    )

    return (
        <div>
            <h3>{props.hat}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {mappedInsides}
            </ul>
            <div>
                <button onClick={() => {
                    props.changeFilter("all")
                }}>All
                </button>
                <button onClick={() => {
                    props.changeFilter("active")
                }}>Active
                </button>
                <button onClick={() => {
                    props.changeFilter("completed")
                }}>Completed
                </button>
            </div>
        </div>
    )
}