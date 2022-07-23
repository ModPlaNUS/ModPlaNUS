import React from'react';
import ReactDOM from 'react-dom';
import SignIn from './../SignIn'; 
import Calculator from '../calculator';
import {render, cleanup, fireEvent} from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";
import { SignInMethod } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
//import renderer from 'react-test-renderer';
import Planner from '../planner-main';

afterEach(cleanup);

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Planner></Planner>, div);
})


it("renders calculator correctly", () => {
    const {getByTestId} = render(<Planner></Planner>);
    expect(getByTestId('Calculator'));
})

const validateInput = (str = "") => str.includes("@u.nus.edu");
const validatepass = (str = "") => str.length >= 8;
describe("planner", () => {
    
    it("should render a todo object", () => {
        const {getByTestId } = render(<Planner todo={mocktodo} />)
        const ItemName = getByTestId('Calculator')
        expect(ItemName).toHaveTextContetn(mockTodo.todo)
    })

    it("should display the previous tate in the edit input", () => {
        const {debug, getByText} = render(<todo todo = {mocktodo} />)
        const EditBtn = getByText(/add/i)
        userEvent.click(EditBtn)
        const UpdatInput = getByPlaceholdertext(mockTodo.todo)
        expect(UpdateInput).toBeInTheDocument()
    })

    it('should update the todo via the edit imput', () => {
        const {getByText, getByPlaceholdertext} = render(
            <Planner todo={mockTodo} />
        )
        const EditBtn = getByText(/add/i)
        userEvent.click(EditBtn)
        const UpdateInput = getByPlaceholderText(mockTodo.todo)
        userEvent.type(DeleteInput, 'deleted todo')
        expect(DeleteInput).toHaveValue('deleted todo')
    })

    it('should render non-completed todo component', () => {
        const todo = { id: 1, msg: 'CS1101S', completed: false };
        render(<Planner todo = {todo} />);
        const todoElement = screen.getByTestid('module');
        expect(todoElement).toBeInTheDocument();
        expect(todoElement).toHaveTextContent('CS1101S');
    })

    it('should render completed todo component', () => {
        const todo = { id: 1, msg: 'CS1101S', completed: true };
        render(<Planner todo = {todo} />);
        const todoElement = screen.getByTestid('module');
        expect(todoElement).toBeInTheDocument();
        expect(todoElement).toHaveTextContent('CS1101S');
        expect(todoElement).toContainHTMl(<WarningList/>)
    })


});

/** 
it("matches snapshot", () => {
    const tree =renderer.create(<Calculator></Calculator>).toJSON();
    expect(tree).toMatchSnapshot();
})*/



