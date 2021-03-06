'use strict';

/**
 * An election.
 *
 * @module Elections/Election
 */

/**
 * Represents an election.
 *
 * @alias module:Elections/Election
 */
class Election {
    /**
     * Initializes the election.
     *
     * @param {string} id - The election's ID.
     * @param {string} title - The election's title.
     * @param {string[]} candidates - The candidates for the election.
     */
    constructor(id, title, candidates) {
        if (candidates.length === 0) {
            throw new Error('Election must have at least 1 candidate!');
        }

        const cookies = {};
        const votes = {};

        candidates.forEach(candidate => {
            votes[candidate] = 0;
        });

        Object.defineProperties(this, {
            /**
             * `true` if the election is closed; `false` otherwise.
             *
             * @private
             * @type {boolean}
             */
            _closed: { value: false, writable: true },

            /**
             * Current number of votes submitted.
             *
             * @private
             * @type {number}
             */
            _voteCount: { value: 0, writable: true },

            /**
             * Set of all voted cookies.
             *
             * @private
             * @readonly
             * @type {Object.<string, boolean>}
             */
            cookies: { value: cookies },

            /**
             * Map from candidate names to their vote counts.
             *
             * @private
             * @readonly
             * @type {Object.<string, number>}
             */
            votes: { value: votes },

            /**
             * The election's ID.
             *
             * @readonly
             * @type {string}
             */
            id: { value: id },

            /**
             * The election's title.
             *
             * @readonly
             * @type {string}
             */
            title: { value: title },

            /**
             * The election's candidates.
             *
             * @readonly
             * @type {string[]}
             */
            candidates: { value: candidates }
        });
    }

    /**
     * `true` if the election is closed; `false` otherwise.
     *
     * @readonly
     * @type {boolean}
     */
    get closed() {
        return this._closed;
    }

    /**
     * Current number of votes submitted.
     *
     * @readonly
     * @type {number}
     */
    get voteCount() {
        return this._voteCount;
    }

    /**
     * Map from candidates to final votes, or `null` if the election has not
     * been closed yet.
     *
     * If an object is returned, it is frozen.
     *
     * @readonly
     * @type {Object.<string, number>?}
     */
    get finalVotes() {
        return this.closed
            ? this.votes
            : null;
    }

    /**
     * Closes the election from further voting.
     *
     * Has no effect if the election is already closed.
     */
    close() {
        if (!this.closed) {
            this._closed = true;
            Object.freeze(this.votes);
        }
    }

    /**
     * Places a vote for the given candidate.
     *
     * @param {string} candidate - The candidate to vote for.
     * @param {string} [cookie] - Multiple votes with the same cookie are
     * rejected.
     */
    vote(candidate, cookie) {
        if (this.closed) {
            throw new Error('Election already closed!');
        }

        if (!(candidate in this.votes)) {
            throw new Error(`Candidate '${candidate}' not found!`);
        }

        if (cookie) {
            if (cookie in this.cookies) {
                throw new Error('Vote already submitted!');
            }

            this.cookies[cookie] = true;
        }

        this._voteCount++;
        this.votes[candidate]++;
    }

    /**
     * Checks if a vote with the given cookie was placed.
     *
     * @param {string} cookie - The cookie to check.
     * @returns {boolean} `true` if the cookie was submitted already; `false`
     * otherwise.
     */
    voted(cookie) {
        return cookie in this.cookies;
    }

    /**
     * Creates an object containing this election's `title`, `candidates`, and
     * `closed`.
     *
     * @param {string} [cookie] - If specified, the object will additionally
     * contain a `voted` field, marking if the cookie was used.
     * @Returns {Object} The object.
     */
    enumerate(cookie) {
        const { title, candidates, closed } = this;

        const result = { title, candidates, closed };
        cookie && (result.voted = this.voted(cookie));

        return result;
    }
}

Object.freeze(Election);
module.exports = Election;

