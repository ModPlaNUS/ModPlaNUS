import SignIn from './SignIn'; 
import {render, cleanup, fireEvent} from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";
import {screen} from '@testing-library/react'
import {BrowserRouter as Router} from 'react-router-dom';

afterEach(cleanup);

test('renders sign in component', async () => {
    render(
      <Router>
        <SignIn />,
      </Router>,
    );
  });



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
        const view = render(
            <Router>
            <SignIn />,
            </Router>,
        );
        const emailInputNode = screen.getByTestId("email-input");
        fireEvent.change(emailInputNode, {target: {value: 'testing'}})
        expect(emailInputNode.value).toMatch("testing");
    });


});
