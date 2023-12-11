import { Schema, type, ArraySchema } from "@colyseus/schema";

export const boardSize = 3;

export const initBoard = new Array(boardSize * boardSize).fill("") as BoardCell[];

export class XYZ extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  copy(other: XYZ) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
  }
}

export enum GameStatus {
    Waiting = 0,
    Playing = 1,
    Finished = 2,
}

export class TPresent extends Schema {
  @type("string") id: string = "";
  @type(XYZ) position: XYZ = new XYZ();
  @type(XYZ) rotation: XYZ = new XYZ();
  @type("string") animation: string = "idle";
  @type("string") turn: Turn = null;
}

export class State extends Schema {
  @type([TPresent]) presents: TPresent[] = new ArraySchema<TPresent>();
  @type(["string"]) board = new ArraySchema<BoardCell>(...initBoard);
  @type("string") currentTurn: Turn = null;
  @type("number") status: GameStatus  = GameStatus.Waiting;
  @type("string") winner: Turn = null;
}

export type ClientMsg =
  | { type: "move"; cell: number }
  | { type: "player-state"; position: XYZ; rotation: XYZ; animation: string };

// send to a player when it's their turn
export type RoomMsg =
  | { type: "turn"; turn: Turn }
  | { type: "end"; winner: Turn };

export type Turn = "X" | "O" | null;

export type BoardCell = Turn | "";
