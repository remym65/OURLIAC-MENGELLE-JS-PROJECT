export default class BuggyTondeuse {
    constructor(buggyMesh) {
        this.buggyMesh = buggyMesh;
        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        buggyMesh.BuggyTondeuse = this;
    }
}