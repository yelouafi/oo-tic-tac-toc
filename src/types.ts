import { Schema, type, ArraySchema } from "@colyseus/schema";

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

export class TPresent extends Schema {
  @type("string") id: string = "";
  @type(XYZ) position: XYZ = new XYZ();
  @type(XYZ) rotation: XYZ = new XYZ();
  @type("string") animation: string = "idle";
}

export class State extends Schema {
    @type([TPresent]) presents: TPresent[] = new ArraySchema<TPresent>();
}

export type ClientMsg = 
  | { type: 'player-state'; position: XYZ; rotation: XYZ; animation: string; }
  // | { type: 'move'; cell: number; };

export type RoomMsg = 
  | { type: 'end' };
