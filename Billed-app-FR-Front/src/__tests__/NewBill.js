/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import { ROUTES_PATH } from "../constants/routes.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When I charge a file with wrong format", () => {
      test("Then, it should display an error and empty the input", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const containerNewBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });

        document.body.innerHTML = NewBillUI();

        // A shortcut to elt.querySelector(`[data-testid="file"]`)
        //const file = screen.getByTestId("file");
        // add event on fileInput
        const file = containerNewBill.file;
        const handleChangeFile = jest.fn((e) => {
          containerNewBill.handleChangeFile(e);
        });
        file.addEventListener("change", handleChangeFile);
        // spy window alert
        const alertMock = jest.spyOn(window, "alert").mockImplementation();
        // simulate change
        fireEvent.change(fileInput, [new File(["test"], "test.txt")]);
        //userEvent.upload(fileInput, new File(["test"], "test.png"));
        // check if file input is empty +  if window alert was called
        expect(file.value).toBe("");
        expect(alertMock).toHaveBeenCalledTimes(1);
      });
    });
    describe("When I charge a file in the correct format", () => {
      test("Then, it should upload the file", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const fileInput = screen.getByTestId("file");
        fireEvent.change(fileInput, { target: { files: ["file.png"] } });
        expect(fileInput.files[0]).toBe("file.png");
      });
    });
    describe("When I submit the form and compulsory fields are empty", () => {
      test("It should display an error to complete the fields and do not send data", () => {
        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => e.preventDefault());

        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
      });
    });
    describe("When I submit the form and fields are completed correctly", () => {
      test("It should send data", () => {
        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => e.preventDefault());

        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
      });
    });
  });
});
