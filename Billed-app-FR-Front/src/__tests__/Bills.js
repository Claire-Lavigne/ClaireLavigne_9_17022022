/**
 * @jest-environment jsdom
 */

import mockStore from "../__mocks__/store";
import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bill from "../containers/Bills";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- \/.](0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    describe("When I click on the button 'new bill'", () => {
      test("Then I should be redirected to NewBill Page", async () => {
        document.body.innerHTML = BillsUI({ data: { bills } });

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "employee@test.tld",
          })
        );

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const bill = new Bill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const buttonNewBill = screen.getByTestId("btn-new-bill");
        const handleClickNewBill = jest.fn(bill.handleClickNewBill);
        buttonNewBill.addEventListener("click", handleClickNewBill);

        expect(handleClickNewBill).toHaveBeenCalled();

        const form = screen.getByTestId("form-new-bill");
        expect(form).toBeTruthy();
      });
    });
    describe("When I click on a bill's icon eye", () => {
      test("Then a modal should open displaying the image of the corresponding bill", () => {
        //const theBills = mockStore.bills();
        document.body.innerHTML = BillsUI({ data: { bills } });

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "employee@test.tld",
          })
        );

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const bill = new Bill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // select All
        const iconEye = screen.getAllByTestId("icon-eye");
        const handleClickIconEye = jest.fn(bill.iconEye);
        // forEach
        iconEye.forEach((icon) => {
          icon.addEventListener("click", () => handleClickIconEye(icon));
        });
        console.log(icon);
        icon.addEventListener("click", handleClickIconEye);

        expect(handleClickIconEye).toHaveBeenCalled();

        // get modal
        // get file url
      });
    });
  });
});
