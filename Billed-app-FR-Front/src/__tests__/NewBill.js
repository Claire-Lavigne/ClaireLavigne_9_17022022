/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    document.body.innerHTML = NewBillUI();

    // spy window alert
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "employee@test.tld",
      })
    );

    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    });

    describe("When I charge a file", () => {
      // A shortcut to elt.querySelector(`[data-testid="file"]`)
      const fileInput = screen.getByTestId("file");

      // add event on fileInput
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      fileInput.addEventListener("change", handleChangeFile);

      test("Then, if it is the wrong format, it should display an error and empty the input", () => {
        // simulate change
        fireEvent.change(fileInput, { target: { files: ["test.txt"] } });
        expect(fileInput.files[0]).toBe("test.txt");
        // check if file input is empty +  if window alert was called
        expect(fileInput.value).toBe("");
        expect(alertMock).toHaveBeenCalled();
      });

      test("Then, if it is the right format, it should upload the file", () => {
        fireEvent.change(fileInput, { target: { files: ["test.png"] } });
        expect(fileInput.files[0]).toBe("test.png");
      });
    });
    describe("When I submit the form and fields are completed correctly", () => {
      const type = screen.getByTestId("expense-type");
      const name = screen.getByTestId("expense-name");
      const amount = screen.getByTestId("amount");
      const date = screen.getByTestId("datepicker");
      const vat = screen.getByTestId("vat");
      const pct = screen.getByTestId("pct");
      const commentary = screen.getByTestId("commentary");
      const fileInput = screen.getByTestId("file");
      const form = screen.getByTestId("form-new-bill");

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      fileInput.addEventListener("change", handleChangeFile);

      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);

      test("It should update the bill and navigate to the Bills Dashboard", () => {
        // complete inputs
        fireEvent.change(type, { target: { value: "Transport" } });
        fireEvent.click(name, { target: { value: "Name" } });
        fireEvent.click(amount, { target: { value: "350" } });
        fireEvent.change(date, { target: { value: "2020-05-24" } });
        fireEvent.click(vat, { target: { value: "" } });
        fireEvent.click(pct, { target: { value: "20" } });
        fireEvent.click(commentary, { target: { value: "" } });
        fireEvent.change(fileInput, { target: { files: ["test.png"] } });

        // submit form
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });
});
