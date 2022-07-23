import React from'react';
import ReactDOM from 'react-dom';
import SignIn from './SignIn'; 
import {render, cleanup, fireEvent} from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";
import { SignInMethod } from 'firebase/auth';
import {screen} from '@testing-library/react'
import {BrowserRouter as Router} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
//import renderer from 'react-test-renderer';

afterEach(cleanup);

test('renders sign in component', async () => {
    render(
      <Router>
        <SignIn />,
      </Router>,
    );
  });


// it("renders signin correctly", () => {

//     const view = render(
//     <Router>
//     <SignIn />,
//     </Router>,);
//     expect(view).toEqual(screen.getByText(SignIn));
// })

const validateInput = (str = "") => str.includes("@u.nus.edu");
const validatepass = (str = "") => str.length >= 8;
describe("login", () => {
    it("correct input", () => {
        const text = "text@u.nus.edu";
        expect(validateInput(text)).toBe(true);
    });

    it("incorrect input", () => {
        const text = "text";
        expect(validateInput(text)).toBe(false);
    });

    it("password length", () => {
        const text = "text12345678";
        expect(validatepass(text)).toBe(true);
    });

    it("password length less", () => {
        const text = "text12";
        expect(validatepass(text)).toBe(false);
    });

    it("email field should have label", () => {

        const view = render(
            <Router>
            <SignIn />,
            </Router>,
        );
        const emailInputNode = screen.getByTestId("email-input");
        expect(emailInputNode.getAttribute("name")).toBe("email");
    });

    it("email input should accept test", () => {
        // const { getByLabelText, getByText } = render(<SignIn/>);
        const view = render(
            <Router>
            <SignIn />,
            </Router>,
        );
        const emailInputNode = screen.getByTestId("email-input");
        // expect(emailInputNode.value).toMatch("");
        fireEvent.change(emailInputNode, {target: {value: 'testing'}})
        expect(emailInputNode.value).toMatch("testing");
    });

    // it("should be able to submit form", () => {
    //     const mockFn = jest.fn()
    //     const view = render(
    //         <Router>
    //         <SignIn handleSubmit = {mockFn}/>,
    //         </Router>,);
    //    const buttonNode = screen.getByTestId('formSignIn');
    //    userEvent.click(screen.getByTestId('buttonSignIn'));
    //     expect(mockFn).toHaveBeenCalled();

    // });

});

/** 
it("matches snapshot", () => {
    const tree =renderer.create(<signIn></signIn>).toJSON();
    expect(tree).toMatchSnapshot();
})*/

