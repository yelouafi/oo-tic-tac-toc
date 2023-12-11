import { GameRoom } from "@oogg/game-server";
import { State, type ClientMsg, type RoomMsg, TPresent } from "./types";

export class MyRoom extends GameRoom<State, ClientMsg, RoomMsg> {

  tickRate = 30;

  state = new State();

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
    const present = new TPresent();
    present.id = player.sessionId;
    present.position.set(0, 0, 0);
    this.state.presents.push(present);

    this.start();
  }

  onLeave(player) {
    const idx = this.state.presents.findIndex((p) => p.id == player.sessionId);

    if (idx >= 0) {
      this.state.presents.splice(idx, 1);
    }

    if (this.state.presents.length < 2) {
      this.stop();
    }
  }

  onMessage(message: ClientMsg, player): void {
    //
    if (message.type == "player-state") {
      const present = this.state.presents.find((p) => p.id == player.sessionId);

      if (present) {
        present.position.copy(message.position);
        present.rotation.copy(message.rotation);
        present.animation = message.animation;
      }
    }
  }

  async onReady() {
    // this.state.cubes = this.simulation.state.cubes;
  }

  onUpdate(dt: number) {
    // this.state.cubes = this.simulation.state.cubes;
  }
}
