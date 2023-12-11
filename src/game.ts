import { TPresent, State, GameStatus, type Turn } from "./types";

export class TicTacToeGame {

    state: State = new State();

    lines = [
        // rows
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        // cols
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        // diagonals
        [0, 4, 8], [2, 4, 6],
    ];

    startGame() {
        if(!this.canPlay()) return;

        this.state.presents[0].turn = "X";
        this.state.presents[1].turn = "O";

        this.reset();
        this.state.currentTurn = "X";
        this.state.status = GameStatus.Playing;
    }

    reset() {
        this.state.board.forEach((_, idx) => this.state.board[idx] = "");
        this.state.currentTurn = null;
        this.state.winner = null;
    }
    
    addPlayer(id: string) {

        if(this.state.presents.length == 2) return false;

        const present = new TPresent();
        present.id = id;

        const randomX = Math.random() * 10 - 5;
        const randomZ = Math.random() * 10 - 5;

        present.position.set(randomX, 0, randomZ);
        this.state.presents.push(present);

        if (this.canPlay()) {
            this.startGame();
        }

        return true;
    }

    removePlayer(id: string) {

        const idx = this.state.presents.findIndex((p) => p.id == id);

        if (idx >= 0) {
            this.state.presents.splice(idx, 1);
        }

        if (!this.canPlay()) {
            this.reset();
            this.state.status = GameStatus.Waiting;
            if(this.state.presents.length == 1) {
                this.state.presents[0].turn = null;
            }
        }
    }

    canPlay() {
        return this.state.presents.length >= 2;
    }

    updatePresent(id: string, position: any, rotation: any, animation: string) {

        const present = this.state.presents.find((p) => p.id == id);

        if (!present) {
            return;
        }

        present.position.copy(position);
        present.rotation.copy(rotation);
        present.animation = animation;
    }

    markCell(cell: number, playerId: string) {

        const present = this.state.presents.find((p) => p.id == playerId);

        if (!present) {
            return;
        }

        if (this.state.currentTurn != present.turn) {
            return;
        }

        if (this.state.board[cell] != "" || this.state.currentTurn == null) {
            return;
        }

        this.state.board[cell] = this.state.currentTurn;

        this.state.currentTurn = this.state.currentTurn == "X" ? "O" : "X";
    }

    checkWinner() {

        const board = this.state.board;

        for (const [a, b, c] of this.lines) {
            if (board[a] != "" && board[a] == board[b] && board[a] == board[c]) {
                this.state.winner = board[a] as Turn;
                this.state.status = GameStatus.Finished;
                this.state.currentTurn = null;
            }
        }
    }

    checkDraw() {
        const isDraw = this.state.board.filter((cell) => cell == "").length == 0;

        if (isDraw) {
            this.state.status = GameStatus.Finished;
            this.state.currentTurn = null;
        }
    }

    checkEnd() {
        this.checkWinner();

        if (!this.state.winner) {
            this.checkDraw();
        }
    }

    update(dt: number) {

        if (this.state.status != GameStatus.Playing) {
            return;
        }

        this.checkEnd();
    }
}
