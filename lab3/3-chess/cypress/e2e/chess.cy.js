const cell = (rank, file) => `#chessboard > div.rank:nth-child(${9 - rank}) > div:nth-child(${file})`

describe('Chess', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/web/')
  })

  it('should move a white pawn from e2 to e4', () => {
    cy.get(cell(2, 5)).click()
    cy.get(cell(4, 5)).click()

    cy.get(cell(2, 5)).should('be.empty')
    cy.get(cell(4, 5))
      .find('img')
      .should('have.attr', 'src')
      .and('include', 'pawn_white')
  })
})
