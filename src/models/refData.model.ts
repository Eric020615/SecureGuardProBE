export class FloorRefData { 
    floorId: string;
    units: Unit[];

    constructor(
        floorId: string,
        units: Unit[],
    ){
        this.floorId = floorId;
        this.units = units;
    }
}

export class Unit {
	unitId: string;
	isAssigned: boolean;
	assignedTo: string | null;

    constructor(
        unitId: string,
        isAssigned: boolean,
        assignedTo: string | null,
    ){
        this.unitId = unitId;
        this.isAssigned = isAssigned;
        this.assignedTo = assignedTo;
    }
}