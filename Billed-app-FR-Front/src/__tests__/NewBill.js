/**
 * @jest-environment jsdom
 */

import mockStore from "../__mocks__/store";
import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes";
import { ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

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

    describe("When I charge a file", () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // A shortcut to elt.querySelector(`[data-testid="file"]`)
      const fileInput = screen.getByTestId("file");

      // add event on fileInput
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      fileInput.addEventListener("change", handleChangeFile);

      test("Then, if it is the wrong format, it should display an error and empty the input", async () => {
        // simulate change
        fireEvent.change(fileInput, {
          target: {
            files: [new File(["test"], "test.gif", { type: "image/gif" })],
          },
        });
        await new Promise(process.nextTick);
        // check if file input is empty +  if window alert was called
        expect(fileInput.value).toBe("");
        expect(alertMock).toHaveBeenCalled();
      });

      test("Then, if it is the right format, it should upload the file", async () => {
        fireEvent.change(fileInput, {
          target: {
            files: [new File(["test"], "test.png", { type: "image/png" })],
          },
        });
        await new Promise(process.nextTick);
        expect(fileInput.files[0].name).toBe("test.png");
        expect(fileInput.files.length).toBe(1);
      });
    });
    describe("When I submit the form and fields are completed correctly", () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // spy the bills in the store
      // mockStore.bills() contains a mock of completed inputs for one bill
      const spy = jest.spyOn(mockStore.bills(), "update");

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);

      // test d'intégration POST
      test("It should update the bills and navigate to the Bills Dashboard", async () => {
        // submit form
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        // when redirect, table in DOM
        const table = await screen.getByTestId("tbody");
        expect(table).toBeTruthy();
      });

      describe("When an error occurs on API", () => {
        beforeEach(() => {
          jest.spyOn(mockStore, "bills");
          Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
          });
          window.localStorage.setItem(
            "user",
            JSON.stringify({
              type: "Employee",
            })
          );
          const root = document.createElement("div");
          root.setAttribute("id", "root");
          document.body.appendChild(root);
          router();
        });
        test("fetches bills from an API and fails with 404 message error", async () => {
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list: () => {
                return Promise.reject(new Error("Erreur 404"));
              },
            };
          });
          window.onNavigate(ROUTES_PATH.Bills);
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 404/);
          expect(message).toBeTruthy();
        });

        test("fetches messages from an API and fails with 500 message error", async () => {
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list: () => {
                return Promise.reject(new Error("Erreur 500"));
              },
            };
          });

          window.onNavigate(ROUTES_PATH.Bills);
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 500/);
          expect(message).toBeTruthy();
        });
      });
    });
  });
});
