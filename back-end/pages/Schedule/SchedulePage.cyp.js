import moment from "moment";
import { loginToBackEnd } from "Utils/cypress-helpers";

const momentFormat = "dddd, MMMM D";
const dateInputSelector = "#date";
const today = moment().format(momentFormat);

context("Schedule", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    loginToBackEnd(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("shows all trucks", () => {
    cy.get(".truck-column").should("have.length", 2);
  });

  it("shows a specific truck", () => {
    cy.get(".truck-picker select").select("Ford");
    cy.get(".truck-column").should("have.length", 1);
  });

  it("shows trucks appointments and blockers", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: /api\/v2\/schedule/,
      response: {
        bins: [{ id: "1111", foreignId: "5-01", size: "5", isActive: "1" }],
        trucks: [
          {
            id: "1",
            foreignId: "Truck 1",
            appointments: [
              {
                orderId: "29588",
                deliveryStreet1: "123 Fake Street",
                deliveryCity: "Vancouver",
                deliveryPostalCode: "A1A 1A1",
                deliveryProvince: "BC",
                orderNotes: "",
                type: "d",
                orderTruckId: "61384",
                startDateTime: "2021-01-24 09:00:00",
                endDateTime: "2021-01-24 09:59:59",
                isComplete: 0,
                customerId: "1",
                firstName: "Adam",
                lastName: "Doe",
                email: "adam@fake.com",
                phone: "604-666-0000",
                customerNotes: "private customer notes go here",
                title: "5 Yarder!",
                binId: "1111",
                binForeignId: "5-01"
              }
            ]
          },
          {
            //filler
            id: "2",
            foreignId: "Truck 2",
            appointments: [
              {
                orderId: null,
                deliveryStreet1: null,
                deliveryCity: null,
                deliveryPostalCode: null,
                deliveryProvince: null,
                orderNotes: null,
                type: "f",
                orderTruckId: "61386",
                startDateTime: "2021-01-24 00:00:00",
                endDateTime: "2021-01-24 00:59:59",
                isComplete: 0,
                customerId: null,
                firstName: null,
                lastName: null,
                email: null,
                phone: null,
                customerNotes: null,
                title: null,
                binId: null,
                binForeignId: null
              }
            ]
          }
        ]
      }
    });

    cy.get(".schedule-page__appointment").should("have.length", 2); //1 of them is a filler

    cy.debug();
    cy.get(".schedule-page__appointment--filler").should("have.length", 1);
  });

  it("goes forwards and backwards days", () => {
    const tomorrow = moment()
      .add(1, "days")
      .format(momentFormat);
    const yesterday = moment()
      .subtract(1, "days")
      .format(momentFormat);

    cy.get(dateInputSelector).should("have.value", today);

    cy.get("button.next").click();
    cy.get(dateInputSelector).should("have.value", tomorrow);

    cy.get("button.prev").click();
    cy.get("button.prev").click();
    cy.get(dateInputSelector).should("have.value", yesterday);
  });

  it("selects a specific day from the calendar", () => {
    cy.get(dateInputSelector).should("have.value", today);

    cy.get(dateInputSelector).click(); // expand date picker
    cy.get(".DayPickerNavigation_rightButton__horizontalDefault ").click(); //go to next month (there are really 3 calendars of dates, though only the middle one is visible, thats why use "35" below")
    cy.wait(500);

    cy.get('.CalendarDay[aria-disabled="false"]')
      .eq(35)
      .click();

    cy.get(dateInputSelector).should("not.have.value", today);
  });

  // it("can drag and drop appointments...", () => {});
});
