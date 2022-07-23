import React from'react';
import ReactDOM from 'react-dom';
import SignIn from './../SignIn'; 
import Calculator from '../calculator';
import {render, cleanup, fireEvent} from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";
import { SignInMethod } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
//import renderer from 'react-test-renderer';

afterEach(cleanup);

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Calculator></Calculator>, div);
})


it("renders calculator correctly", () => {
    const {getByTestId} = render(<Calculator></Calculator>);
    expect(getByTestId('Calculator'));
})

const validateInput = (str = "") => str.includes("@u.nus.edu");
const validatepass = (str = "") => str.length >= 8;
describe("calculator", () => {
    
    it("should render a todo object", () => {
        const {getByTestId } = render(<Calculator todo={mocktodo} />)
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
            <Calculator todo={mockTodo} />
        )
        const EditBtn = getByText(/add/i)
        userEvent.click(EditBtn)
        const UpdateInput = getByPlaceholderText(mockTodo.todo)
        userEvent.type(DeleteInput, 'deleted todo')
        expect(DeleteInput).toHaveValue('deleted todo')
    })


});

/** 
it("matches snapshot", () => {
    const tree =renderer.create(<Calculator></Calculator>).toJSON();
    expect(tree).toMatchSnapshot();
})*/



