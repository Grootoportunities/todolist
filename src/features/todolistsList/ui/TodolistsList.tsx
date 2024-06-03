import React, {FC} from "react";
import {useTodolistsList} from "../lib/useTodolistsList";
import {Grid} from "@material-ui/core";
import {AddItemForm} from "../../../common/components";
import {Todolist} from "./todolist/ui/Todolist";

export type TodolistsListProps = {
	demo?: boolean;
};

export const TodolistsList: FC<TodolistsListProps> = ({demo = false}) => {
	const {todolists, addTodolist} = useTodolistsList(demo);

	const mappedTodolists = todolists.map((tl) => {
		return (
			<Grid item key={tl.id}>
				<Todolist todolist={tl} demo={demo}/>
			</Grid>
		);
	});

	return (
		<>
			<Grid style={{margin: "30px 0"}} container>
				<AddItemForm addItem={addTodolist}/>
			</Grid>
			<Grid
				container
				spacing={5}
				style={{
					flexWrap: "nowrap",
					overflowX: "scroll",
				}}
			>
				{mappedTodolists}
			</Grid>
		</>
	);
};
