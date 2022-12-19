import moment from "moment";
import { loginToBackEndAsDriver, goToTrucksSchedulePage } from "Utils/cypress-helpers";

const truckId = 1;
const today = moment().format("YYYY-MM-DD");
const tomorrow = moment(today)
  .add(1, "days")
  .format("YYYY-MM-DD");
const yesterday = moment(today)
  .subtract(1, "days")
  .format("YYYY-MM-DD");

const sampleAppointment = {
  attachments: [],
  items: [
    {
      description: "Weight",
      id: "25835",
      notes: "",
      orderId: "1234",
      paymentConfirmationId: "",
      paymentMethod: "invoice",
      quantity: "1.0000",
      refundConfirmationId: "",
      tax1: "0.13000",
      tax2: "0.00000",
      unitPrice: "99.00"
    }
  ],
  orderId: "1234",
  deliveryStreet1: "123 Anderson street",
  deliveryCity: "Fakeville",
  deliveryPostalCode: "M4A 2M9",
  deliveryProvince: "ON",
  orderNotes: "",
  type: "d",
  orderTruckId: "35463",
  startDateTime: "2022-07-06 07:00:00",
  endDateTime: "2022-07-06 07:59:59",
  isComplete: 0,
  customerId: "5435",
  companyName: "Acme Inc.",
  firstName: "bob",
  lastName: "anderson",
  email: "bob.anderson@example.com",
  phone: "111-111-1111",
  customerNotes: "",
  title: "5 yard",
  size: "5",
  binId: "1",
  binForeignId: "501"
};

const yesterdaysAppointment = { ...sampleAppointment, orderId: "1111" };
const todaysAppointment = { ...sampleAppointment, orderId: "2222" };
const tomorrowsAppointment = { ...sampleAppointment, orderId: "3333" };

context("TruckSchedule", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");

    cy.server();
    cy.route({
      method: "GET",
      url: `/api/v1/truck-schedule.php?id=${truckId}&date=${today}`,
      response: { appointments: [todaysAppointment] }
    });

    cy.route({
      method: "GET",
      url: `/api/v1/truck-schedule.php?id=${truckId}&date=${tomorrow}`,
      response: { appointments: [tomorrowsAppointment] }
    });

    cy.route({
      method: "GET",
      url: `/api/v1/truck-schedule.php?id=${truckId}&date=${yesterday}`,
      response: { appointments: [yesterdaysAppointment] }
    });

    cy.route({
      method: "GET",
      url: `/api/v1/trucks.php`,
      response: [{ foreignId: "Peterbilt", id: "1", isActive: "1", userId: "1" }]
    });

    // when mark appointment as completed
    cy.route({
      method: "PUT",
      url: `/api/v1/truck-schedule.php`,
      response: []
    });

    cy.route({
      method: "GET",
      url: `/api/v2/items`,
      response: [
        { id: 1, name: "Weight", unitPrice: "99.00", qbId: "", qbTaxCodeId: "" },
        { id: 2, name: "Overfilling bin", unitPrice: "50.00", qbId: "", qbTaxCodeId: "" }
      ]
    });

    loginToBackEndAsDriver(cy);
    goToTrucksSchedulePage(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("can go forward and backward days", () => {
    /*
    1. shows today's appointments only
    2. can check a job
    3. can click on '...' and it reveals sidepanel
    4. can add an item and change payment method

    5. can go to tomorrow and it shows tomorrow's appointments only
    6. cannot check/uncheck a job or click on '...'

    7. can go to yesterday and it shows yesterday's appointments only
    8. cannot check/uncheck a job or click on '...'
    */

    // 1.
    cy.get(".order-number").should("not.contain.text", yesterdaysAppointment.orderId);
    cy.get(".order-number").should("contain.text", todaysAppointment.orderId);
    cy.get(".order-number").should("not.contain.text", tomorrowsAppointment.orderId);

    // 2.
    cy.get(".truck-appointment--completed").should("not.exist");
    // cy.get(".status-circle").click();
    // update the route to return the completed appointment
    // cy.route({
    //   method: "GET",
    //   url: `/api/v1/truck-schedule.php?id=${truckId}&date=${today}`,
    //   response: { appointments: [{ ...todaysAppointment, isComplete: 1 }] }
    // });
    // cy.get(".truck-appointment--completed").should("exist");

    // 3.
    cy.get(".ant-drawer-open").should("not.exist");
    cy.get(".truck-appointment__sidepanel-trigger").click();
    cy.get(".ant-drawer-open").should("exist");

    // 4.
    cy.get(".sidepanel__items-tab .btn-primary").click();
    cy.get("[name='quantity']").type("1");
    cy.get("[name='selectedItemId']").select("2");
    // subotal, tax total, total are correct
    cy.get("[name='paymentMethod']").select("invoice");
    // cy.get(".btn-success").click();
    cy.get(".close").click();

    // its added to screen and totals updated
    cy.get(".ant-drawer-close").click();

    //5.
    cy.get("button.next").click();
    cy.get(".order-number").should("not.contain.text", yesterdaysAppointment.orderId);
    cy.get(".order-number").should("not.contain.text", todaysAppointment.orderId);
    cy.get(".order-number").should("contain.text", tomorrowsAppointment.orderId);

    // 6.
    cy.get(".status-circle").should("not.exist");
    cy.get(".truck-appointment__sidepanel-trigger").should("not.exist");

    // 7.
    cy.get("button.prev").click();
    cy.get("button.prev").click();
    cy.get(".order-number").should("contain.text", yesterdaysAppointment.orderId);
    cy.get(".order-number").should("not.contain.text", todaysAppointment.orderId);
    cy.get(".order-number").should("not.contain.text", tomorrowsAppointment.orderId);

    // 8.
    cy.get(".status-circle").should("not.exist");
    cy.get(".truck-appointment__sidepanel-trigger").should("not.exist");
  });
});
