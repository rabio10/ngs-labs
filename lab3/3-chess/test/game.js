import * as game from '../games/2022-03-07-game.json' with { type: 'json' };
import assert from 'assert';
import Color from '../src/color.js';
import Chessboard from '../src/chessboard.js';
import Pawn from '../src/pawn.js';

/**
 * From a file number, get the corresponding letter.
 * Rank are 1-indexed.
 * Letters are 97-indexed to get lower-alpha characters.
 * @param {number} file - the file in its number representation.
 * @return {string} returns the file in its string representation.
 */
const convertFileToString = function (file) {
  return String.fromCharCode(97 - 1 + file);
};

describe('Game', function () {
  let chessboard;

  before(function () {
    chessboard = new Chessboard();
    chessboard.init();
  });

  describe('#move and #capture', function () {
    game.default.forEach((action) => {
      if (action.type === 'move') {
        const { from, to } = action;

        it(`${action.color} piece should move from (${from.rank}, ${convertFileToString(from.file)}) to (${to.rank}, ${convertFileToString(to.file)})`, function () {
          const piece = chessboard.getPiece(from.rank, from.file);

          assert.notEqual(piece, null);
          assert.equal(piece.color, action.color);
          assert.equal(piece.canMove(to.rank, to.file), true);

          piece.move(to.rank, to.file);

          assert.equal(piece.rank, to.rank);
          assert.equal(piece.file, to.file);
        });
      } else {
        const { at } = action;

        it(`${action.color} piece should be captured at (${at.rank}, ${convertFileToString(at.file)})`, function () {
          const piece = chessboard.getPiece(at.rank, at.file);

          assert.notEqual(piece, null);
          assert.notEqual(piece.color, action.color);
        });
      }
    });
  });
});
