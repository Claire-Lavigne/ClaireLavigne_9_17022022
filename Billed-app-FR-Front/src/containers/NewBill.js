import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;

    this.fileName = "";
    this.fileExtension = "";
    this.billId = "";
    const file = this.document.querySelector(`input[data-testid="file"]`);
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );

    file.addEventListener("change", this.handleChangeFile);
    formNewBill.addEventListener("submit", this.handleSubmit);

    new Logout({ document, localStorage, onNavigate });
  }
  handleChangeFile = (e) => {
    e.preventDefault();
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png"
    ) {
      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;

      formData.append("file", file);
      formData.append("email", email);

      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true,
          },
        })
        .then(({ key }) => {
          this.billId = key;
          this.fileName = fileName;
          this.fileExtension = fileExtension;
        })
        .catch((error) => console.error(error));
    } else {
      // display alert and empty input
      alert("Image au format jpg, jpeg ou png uniquement");
      fileInput.value = "";
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (
      this.fileExtension === "jpg" ||
      this.fileExtension === "jpeg" ||
      this.fileExtension === "png"
    ) {
      const email = JSON.parse(localStorage.getItem("user")).email;
      const bill = {
        email,
        type: e.target.querySelector(`select[data-testid="expense-type"]`)
          .value,
        name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
        amount: parseInt(
          e.target.querySelector(`input[data-testid="amount"]`).value
        ),
        date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
        vat: e.target.querySelector(`input[data-testid="vat"]`).value,
        pct:
          parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
          20,
        commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
          .value,
        fileName: this.fileName,
        status: "pending",
      };
      this.updateBill(bill);
      this.onNavigate(ROUTES_PATH["Bills"]);
    } else {
      // don't submit data
      return false;
    }
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
