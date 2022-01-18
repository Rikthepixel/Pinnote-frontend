/// <reference types="cypress" />

describe("Open workspace page", () => {

    before(() => {
        cy.visit("/")
        cy.wait(1500);

        cy.get("body").then(($body) => {
            if ($body.find("a").text().includes("Login")) {
                cy.visit("/login");
                cy.get("input[name=email]").type("pinnottest@outlook.com");
                cy.get("input[name=password]").type("reformist-rotting-gibberish-frenzy-tuition-march1.H");
                cy.get("button[type=submit]").click();
                cy.wait(2000);
            }
        })
    })

    it("Creates a workspace", () => {
        cy.get("#createWorkspaceButton").click({ force: true} )
        cy.wait(1000);
        cy.get("input[name=name]").type("workspacename");
        cy.get("button[type=submit]").click({ force: true});
        cy.wait(1000);
        cy.get("#workspacesContainer").children().should("have.length", 2);
    });

    it("Delete a workspace", () => {
        cy.get("#workspacesContainer").children().should("have.length", 2);
        cy.get("#workspacesContainer").children().first().click({ force: true});
        cy.wait(100);
        cy.get("button[data-rr-ui-event-key=settings]").click({ force: true});
        cy.get("#workspaceDeleteButton").click({ force: true});
        cy.wait(100);
        cy.get("button[type=button].swal2-confirm").first().click({ force: true});
        cy.wait(100);
        cy.get("#workspacesContainer").children().should("have.length.lessThan", 2);
    });

    it("Creates a workspace", () => {
        cy.get("#createWorkspaceButton").click({ force: true} )
        cy.wait(1000);
        cy.get("input[name=name]").type("workspacename");
        cy.get("button[type=submit]").click({ force: true});
        cy.wait(1000);
        cy.get("#workspacesContainer").children().should("have.length", 2);
    });

    it("Leave a workspace", () => {
        cy.get("#workspacesContainer").children().first().click({ force: true});
        cy.wait(100);
        cy.get("button[data-rr-ui-event-key=members]").click({ force: true});
        cy.get("#leaveWorkspaceButton").click({ force: true});
        cy.wait(100);
        cy.get("button[type=button].swal2-confirm").first().click({ force: true});
        cy.wait(100);
        cy.get("#workspacesContainer").children().should("have.length.lessThan", 2);
    });

    it("Create a board", () => {
        cy.get("#workspacesContainer").children().first().click({ force: true});
        cy.wait(100);
        cy.get("#boardsContainer").children().should("have.length", 0);
        cy.get("button[type=button]#addBoardButton").click({ force: true});
        cy.get("input[name=Title]").type("A test board");
        cy.get("input[type=submit].swal2-styles.btn-primary").click();
        cy.get("#boardsContainer").children().should("have.length", 1);
    });
})