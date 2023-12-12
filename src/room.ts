import { GameRoom } from "@oogg/game-server";
import { State, type ClientMsg, type RoomMsg, TPresent, GameStatus } from "./types";
import { TicTacToeGame } from "./game";

export class MyRoom extends GameRoom<State, ClientMsg, RoomMsg> {
    //
    tickRate = 30;

    game = new TicTacToeGame();

    state = this.game.state;

    constructor(ctx) {
        super(ctx);
        this.state = this.game.state;
    }

    // simulatedLatency = 5000;

    static async onAuth() {
        // throw new Error("Not Authorized");
    }

    async onPreload() {
        // Server side messages
        // setInterval(() => {
        //   this.broadcast("tick");
        // }, 1000);
    }

    onRequestPrestart() {
        //
        // this.prestart();
    }

    onRequestStart() {
        //
        // this.start();
    }

    onJoin(player) {
        //
        this.game.addPlayer(player.sessionId);

        this.start()
    }

    onLeave(player) {
        //
        this.game.removePlayer(player.sessionId);
    }

    onMessage(message: ClientMsg, player): void {
        //
        if (message.type == "player-state") {
            
            this.game.updatePresent(player.sessionId, message.position, message.rotation, message.animation);
        }
        else if (message.type == "move") {
            this.game.markCell(message.cell, player.sessionId);
        }
    }

    async onReady() {
        
    }

    onUpdate(dt: number) {
        //
        if (this.state["$changes"].changes.size > 0) {
            this.state.snapshotId = Math.random().toString(36).substring(2, 7);
            this.state.timestamp = Date.now();
        }
        this.game.update(dt);
    }
}
